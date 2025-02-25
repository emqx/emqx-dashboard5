<template>
  <div class="flow-create" v-loading="isInfoLoading">
    <div class="flow-create-hd space-between">
      <div class="hd-left">
        <router-link class="link-back" :to="{ name: 'flow' }">
          <el-icon :size="20"><ArrowLeft /></el-icon>
        </router-link>
        <div class="basic-info">
          <div class="info-hd">
            <p class="info-name">{{ flowBasicInfo.name }}</p>
            <el-icon class="icon-edit" @click="openBasicInfoDialog">
              <EditPen />
            </el-icon>
          </div>
          <p class="info-desc tip">{{ flowBasicInfo.desc || tl('description') }}</p>
        </div>
      </div>
      <div class="vertical-align-center">
        <!-- <el-radio-group v-model="editingMethod">
          <el-radio-button :label="EditingMethod.Flow">Flow</el-radio-button>
          <el-radio-button :label="EditingMethod.SQL">SQL</el-radio-button>
        </el-radio-group> -->
        <el-tooltip
          v-if="!isTestingPanelOpen || !isTestStarted"
          :content="t('RuleEngine.pleaseSaveFirst')"
          :disabled="savedAfterDataChange"
        >
          <el-button
            type="primary"
            plain
            @click="handleStartTest"
            :disabled="!savedAfterDataChange"
          >
            {{ t('RuleEngine.startTest') }}
          </el-button>
        </el-tooltip>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post') || isDataSaveButtonDisabled"
          :loading="isSubmitting"
          @click="submit"
        >
          {{ t('Base.save') }}
        </el-button>
      </div>
    </div>
    <div class="flow-create-db">
      <FlowEditor
        ref="FlowEditorCom"
        v-if="editingMethod === EditingMethod.Flow"
        :data="flowData"
        @update="updateCurrentFlowData"
      >
        <template #test v-if="isTestingPanelOpen && currentRule">
          <RuleTest
            v-if="isTestingPanelOpen && currentRule"
            ref="RuleTestRef"
            :rule-data="currentRule"
            :ingress-bridge-list="sourceList"
            is-flow
            @close="closeTest"
            @testing-status-change="syncTestingStatusChanged"
          />
        </template>
      </FlowEditor>
    </div>
  </div>
  <FlowNameDialog
    v-model="showBasicInfoDialog"
    :is-edit="!isCreate"
    :data="flowBasicInfo"
    @save="handleSaveBasicInfo"
  />
</template>

<script setup lang="ts">
import useEditFlow from '@/hooks/Flow/useEditFlow'
import useFlowEditorDataHandler from '@/hooks/Flow/useFlowEditorDataHandler'
import useFlowNode from '@/hooks/Flow/useFlowNode'
import useSubmitFlowData from '@/hooks/Flow/useSubmitFlowData'
import useSourceList from '@/hooks/Rule/action/useSourceList'
import { useStatusController } from '@/hooks/Rule/rule/useDebugRule'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { TestRuleTarget } from '@/types/enum'
import { BridgeItem, RuleItem } from '@/types/rule'
import { ArrowLeft, EditPen } from '@element-plus/icons-vue'
import { Edge, Node } from '@vue-flow/core'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash'

import RuleTest from '../RuleEngine/components/RuleTest.vue'
import FlowEditor from './components/FlowEditor.vue'
import FlowNameDialog from './components/FlowNameDialog.vue'

interface FlowBasicInfo {
  name: string
  desc: string
}

interface SimpleFlowData {
  nodes: Array<string>
  edges: Array<{ source: string; target: string }>
}

const enum EditingMethod {
  Flow,
  SQL,
}

const { t, tl } = useI18nTl('Flow')

// Set name and desc to rule
const initName = createRandomString()
const flowBasicInfo = ref({ name: initName, desc: '' })

const { flowId, flowData, ruleData, addBridgeFormDataToNodes, getData } = useEditFlow()
const isCreate = computed(() => !flowId.value)
const editingMethod = ref(EditingMethod.Flow)

const showBasicInfoDialog = ref(false)
const openBasicInfoDialog = () => (showBasicInfoDialog.value = true)
const handleSaveBasicInfo = (val: FlowBasicInfo) => (flowBasicInfo.value = val)

const FlowEditorCom = ref()

/**
 * for compare to check if flow data changed
 */
let simpleInitFlowData: SimpleFlowData = { nodes: [], edges: [] }

const getSimpleFlowData = (flowData: Array<Node | Edge>) => {
  const ret: SimpleFlowData = { nodes: [], edges: [] }
  flowData.forEach((item) => {
    if ('source' in item && 'target' in item) {
      ret.edges.push({ source: item.source, target: item.target })
    } else {
      ret.nodes.push(item.id)
    }
  })
  ret.edges.sort((pre, next) => {
    if (pre.source === next.source) {
      return pre.target.localeCompare(next.target)
    }
    return pre.source.localeCompare(next.source)
  })
  ret.nodes.sort()
  return ret
}

const isFlowChanged = (): boolean => {
  const flowData: { nodes: Array<Node>; edges: Array<Edge> } = FlowEditorCom.value.getFlowData()
  if (isCreate.value) {
    return flowData.nodes.length !== 0 || initName !== flowBasicInfo.value.name
  }
  const simpleCurrentData = getSimpleFlowData([...flowData.nodes, ...flowData.edges])
  const hasNodeFormChanged = flowData.nodes.some((node) => node.data.isChanged)
  return !isEqual(simpleInitFlowData, simpleCurrentData) || hasNodeFormChanged
}
const { updateIsSubmitted } = useDataNotSaveConfirm(isFlowChanged)

const isInfoLoading = ref(false)
const getFlowDetail = async () => {
  try {
    isInfoLoading.value = true
    await getData()
    if (flowData.value) {
      simpleInitFlowData = getSimpleFlowData(flowData.value)
    }
    if (ruleData.value) {
      const { id, description } = ruleData.value
      flowBasicInfo.value = { name: id, desc: description }
      currentRule.value = ruleData.value
    }
    await nextTick()
    updateNewestSavedFlowData(FlowEditorCom.value.getFlowData())
  } catch (error) {
    //
  } finally {
    // Reduce the feeling of screen shake
    await waitAMoment(100)
    isInfoLoading.value = false
  }
}
if (flowId.value) {
  getFlowDetail()
}

const { getRulesActionsSourcesFromFlowData } = useFlowEditorDataHandler()
const { isSubmitting, createFlow, updateFlow } = useSubmitFlowData()
const submit = async () => {
  try {
    const flowData = FlowEditorCom.value.getFlowData()
    const data = await getRulesActionsSourcesFromFlowData(flowBasicInfo.value, flowData)
    const isCallCreate = isCreate.value && !isFlowCreated.value
    const request = isCallCreate ? createFlow : updateFlow
    currentRule.value = await request(data)
    ElMessage.success(t(`Base.${isCallCreate ? 'createSuccess' : 'updateSuccess'}`))
    updateFlowData()
    await nextTick()
    updateIsSubmitted()
    updateNewestSavedFlowData(FlowEditorCom.value.getFlowData())
  } catch (error) {
    //
  }
}

/**
 * The `currentRule` is used to bind the prop when testing rule,
 * and assigns a value when the data is saved or edited for the first time.
 * The `ruleData` is used to get name and desc
 */
const currentRule = ref<RuleItem | undefined>(undefined)
const isFlowCreated = computed(() => !!currentRule.value)

/**
 * To check if the data has been saved or modified for rule testing
 */
const currentFlowData = ref<{ nodes: Array<Node>; edges: Array<Edge> }>({ nodes: [], edges: [] })
/**
 * Called when the flow editor has changed or when getting details
 */
const updateCurrentFlowData = (data: { nodes: Array<Node>; edges: Array<Edge> }) => {
  if (isTestingPanelOpen.value && isTestStarted.value && !isEqual(currentFlowData.value, data)) {
    RuleTestRef.value?.stopTest?.()
    isTestStarted.value = false
  }
  currentFlowData.value = cloneDeep(data)
}

const updateNewestSavedFlowData = (data: { nodes: Array<Node>; edges: Array<Edge> }) => {
  updateCurrentFlowData(data)
  updateSavedData(data)
}

const sourceList = ref<Array<BridgeItem>>([])
const { getSourceList } = useSourceList()
;(async () => (sourceList.value = await getSourceList()))()

const { isBridgerNode } = useFlowNode()
/**
 * After the first created source/action is saved, the node data
 * should be updated to set it to select an existing source/action
 */
const updateFlowData = async () => {
  // The reason for using getNodes here instead of getFlowData
  //  elsewhere is that getFlowData doesn't have node location information.
  const nodes = FlowEditorCom.value.getNodes
  nodes.forEach((node: Node) => {
    if (isBridgerNode(node) && !node.data.formData.id) {
      node.data.formData.id = getBridgeKey(node.data.formData)
    }
  })
  const newNodes = await addBridgeFormDataToNodes(nodes)
  FlowEditorCom.value.setNodes(newNodes)
}

const RuleTestRef = ref()

const {
  isTesting: isTestingPanelOpen,
  savedAfterDataChange,
  isDataSaveButtonDisabled,
  testTarget,
  updateSavedData,
} = useStatusController(currentFlowData)
testTarget.value = TestRuleTarget.Rule
savedAfterDataChange.value = false
const isTestStarted = ref(false)
const handleStartTest = async () => {
  isTestingPanelOpen.value = true
  isTestStarted.value = true
  await nextTick()
  RuleTestRef.value?.handleStartTest?.()
}
const closeTest = () => {
  isTestingPanelOpen.value = false
  isTestStarted.value = false
}
const syncTestingStatusChanged = (val: boolean) => {
  isTestStarted.value = val
}

onUnmounted(() => {
  isTestingPanelOpen.value = false
})
</script>

<style lang="scss">
.flow-create {
  height: 100%;
  background-color: var(--color-bg-content);
  p {
    margin: 0;
  }
  $hd-height: 80px;
  .flow-create-hd {
    height: $hd-height;
    align-items: center;
    padding-left: 20px;
    padding-right: 24px;
    border-bottom: 1px solid var(--color-border-primary);
  }
  $hd-line-height: 24px;
  .hd-left {
    display: flex;
    align-items: flex-start;
  }
  .link-back {
    margin-right: 16px;
    color: var(--color-text-primary);
    &:hover {
      color: var(--el-color-primary);
    }
    .el-icon {
      height: $hd-line-height;
    }
  }
  .el-radio-group {
    margin-right: 24px;
  }
  .flow-create-db {
    height: calc(100% - #{$hd-height});
    flex-grow: 1;
  }
  .rule-test {
    display: flex;
    flex-direction: column;
    height: 100%;
    .log-data-display {
      flex-grow: 1;
    }
  }

  .basic-info {
    line-height: $hd-line-height;
  }
  .icon-edit {
    cursor: pointer;
  }
  .info-hd {
    display: flex;
    margin-bottom: 4px;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
  }
  .info-name,
  .info-desc {
    -webkit-text-overflow: ellipsis;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 500px;
  }
  .info-name {
    margin-right: 16px;
  }
  .info-desc {
    max-width: 400px;
    color: #656b7d;
  }
}
</style>
