<template>
  <div class="flow-create" v-loading="isInfoLoading">
    <div class="flow-create-hd space-between">
      <div class="basic-info">
        <div class="info-hd">
          <p class="info-name">{{ flowBasicInfo.name }}</p>
          <el-icon class="icon-edit" @click="openBasicInfoDialog">
            <EditPen />
          </el-icon>
        </div>
        <p class="info-desc tip">{{ flowBasicInfo.desc || tl('description') }}</p>
      </div>
      <div class="vertical-align-center">
        <el-radio-group v-model="editingMethod">
          <el-radio-button :label="EditingMethod.Flow">Flow</el-radio-button>
          <el-radio-button :label="EditingMethod.SQL">SQL</el-radio-button>
        </el-radio-group>
        <el-button type="primary" :loading="isSubmitting" @click="submit">
          {{ t(`Base.${isCreate ? 'create' : 'update'}`) }}
        </el-button>
      </div>
    </div>
    <div class="flow-create-db">
      <FlowEditor
        ref="FlowEditorCom"
        v-if="editingMethod === EditingMethod.Flow"
        :data="flowData"
        :flow-name="flowBasicInfo.name"
      />
      <SQLEditor v-if="editingMethod === EditingMethod.SQL" />
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
import useI18nTl from '@/hooks/useI18nTl'
import { EditPen } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import FlowEditor from './components/FlowEditor.vue'
import FlowNameDialog from './components/FlowNameDialog.vue'
import SQLEditor from './components/SQLEditor.vue'

interface FlowBasicInfo {
  name: string
  desc: string
}

const enum EditingMethod {
  Flow,
  SQL,
}

const router = useRouter()
const { t, tl } = useI18nTl('Flow')

// Set name and desc to rule
const flowBasicInfo = ref({ name: createRandomString(), desc: '' })

const { flowId, flowData, ruleData, getData } = useEditFlow()
const isCreate = computed(() => !flowId.value)
const editingMethod = ref(EditingMethod.Flow)

const showBasicInfoDialog = ref(false)
const openBasicInfoDialog = () => (showBasicInfoDialog.value = true)
const handleSaveBasicInfo = (val: FlowBasicInfo) => (flowBasicInfo.value = val)

const FlowEditorCom = ref()

const isInfoLoading = ref(false)
const getFlowDetail = async () => {
  try {
    isInfoLoading.value = true
    await getData()
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

const { getRuleNBridgesFromFlowData } = useFlowEditorDataHandler()
const { isSubmitting, createFlow, updateFlow } = useSubmitFlowData()
const submit = async () => {
  try {
    if (editingMethod.value === EditingMethod.Flow) {
      const flowData = FlowEditorCom.value.getFlowData()
      const data = await getRuleNBridgesFromFlowData(flowBasicInfo.value, flowData)
      const request = isCreate.value ? createFlow : updateFlow
      await request(data)
      ElMessage.success(t(`Base.${isCreate.value ? 'createSuccess' : 'updateSuccess'}`))
      router.push({ name: 'flow' })
    } else {
      // TODO:
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
  $hd-height: 72px;
  .flow-create-hd {
    height: $hd-height;
    align-items: center;
    padding-left: 24px;
    padding-right: 24px;
    border-bottom: 1px solid var(--color-border-primary);
  }
  .el-radio-group {
    margin-right: 24px;
  }
  .flow-create-db {
    height: calc(100% - #{$hd-height});
    flex-grow: 1;
  }
  .basic-info {
    line-height: 24px;
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
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: nowrap;
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
