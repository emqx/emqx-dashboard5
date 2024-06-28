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
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          :loading="isSubmitting"
          @click="submit"
        >
          {{ t(`Base.${isCreate ? 'create' : 'update'}`) }}
        </el-button>
      </div>
    </div>
    <div class="flow-create-db">
      <FlowEditor
        ref="FlowEditorCom"
        v-if="editingMethod === EditingMethod.Flow"
        :data="flowData"
      />
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
import { createRandomString, waitAMoment } from '@/common/tools'
import useEditFlow from '@/hooks/Flow/useEditFlow'
import useFlowEditorDataHandler from '@/hooks/Flow/useFlowEditorDataHandler'
import useSubmitFlowData from '@/hooks/Flow/useSubmitFlowData'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { ArrowLeft, EditPen } from '@element-plus/icons-vue'
import { Edge, Node } from '@vue-flow/core'
import { ElMessage } from 'element-plus'
import { isEqual } from 'lodash'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
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

const router = useRouter()
const { t, tl } = useI18nTl('Flow')

// Set name and desc to rule
const initName = createRandomString()
const flowBasicInfo = ref({ name: initName, desc: '' })

const { flowId, flowData, ruleData, getData } = useEditFlow()
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
    }
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
    if (editingMethod.value === EditingMethod.Flow) {
      const flowData = FlowEditorCom.value.getFlowData()
      const data = await getRulesActionsSourcesFromFlowData(flowBasicInfo.value, flowData)
      const request = isCreate.value ? createFlow : updateFlow
      await request(data)
      ElMessage.success(t(`Base.${isCreate.value ? 'createSuccess' : 'updateSuccess'}`))
      updateIsSubmitted()
      router.push({ name: 'flow' })
    } else {
      // TODO:form
    }
  } catch (error) {
    //
  }
}
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
