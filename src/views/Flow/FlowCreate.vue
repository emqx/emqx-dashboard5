<template>
  <div class="flow-create">
    <div class="flow-create-hd space-between">
      <div class="basic-info">
        <div class="info-hd">
          <p class="info-name">{{ flowBasicInfo.name }}</p>
          <el-icon class="icon-edit" @click="openBasicInfoDialog"><EditPen /></el-icon>
        </div>
        <p class="info-desc tip">{{ flowBasicInfo.desc || tl('description') }}</p>
      </div>
      <div class="vertical-align-center">
        <el-radio-group v-model="editingMethod">
          <el-radio-button :label="EditingMethod.Flow">Flow</el-radio-button>
          <el-radio-button :label="EditingMethod.SQL">SQL</el-radio-button>
        </el-radio-group>
        <el-button type="primary" :loading="isSubmitting" @click="create">
          {{ t('Base.create') }}
        </el-button>
      </div>
    </div>
    <div class="flow-create-db">
      <FlowEditor
        ref="FlowEditorCom"
        v-if="editingMethod === EditingMethod.Flow"
        :flow-name="flowBasicInfo.name"
      />
      <SQLEditor v-if="editingMethod === EditingMethod.SQL" />
    </div>
  </div>
  <FlowNameDialog v-model="showBasicInfoDialog" :data="flowBasicInfo" @save="handleSaveBasicInfo" />
</template>

<script setup lang="ts">
import { createRandomString } from '@/common/tools'
import useFlowEditorDataHandler from '@/hooks/Flow/useFlowEditorDataHandler'
import useSubmitFlowData from '@/hooks/Flow/useSubmitFlowData'
import useI18nTl from '@/hooks/useI18nTl'
import { EditPen } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
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

const editingMethod = ref(EditingMethod.Flow)

// Set name and desc to rule
const flowBasicInfo = ref({ name: createRandomString(), desc: '' })
const showBasicInfoDialog = ref(false)
const openBasicInfoDialog = () => (showBasicInfoDialog.value = true)
const handleSaveBasicInfo = (val: FlowBasicInfo) => (flowBasicInfo.value = val)

const FlowEditorCom = ref()

const { getRuleNBridgesFromFlowData } = useFlowEditorDataHandler()
const { isSubmitting, createFlow } = useSubmitFlowData()
const create = async () => {
  if (editingMethod.value === EditingMethod.Flow) {
    const flowData = FlowEditorCom.value.getFlowData()
    const data = getRuleNBridgesFromFlowData(flowBasicInfo.value.name, flowData)
    await createFlow(data)
    ElMessage.success(t('Base.createSuccess'))
    router.push({ name: 'flow' })
    // TODO:go back list page
  } else {
    //
  }
}
</script>

<style lang="scss">
.flow-create {
  height: 100%;
  background-color: var(--color-bg-primary);
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
  .info-name {
    margin-right: 16px;
  }
  .info-desc {
    color: #656b7d;
  }
}
</style>
