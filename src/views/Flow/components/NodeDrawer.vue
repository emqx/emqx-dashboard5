<template>
  <el-drawer
    v-model="showDrawer"
    :class="`node-drawer drawer-with-divider ${showTabs ? 'with-tabs' : ''}`"
    :size="width"
    :title="title"
    :z-index="1999"
    :before-close="cancel"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <RemovedBridgeTip v-if="isRemovedBridge" />
    <template v-else-if="getFormComponent(type)">
      <el-tabs v-if="showTabs" v-model="activeTab">
        <el-tab-pane :label="t('Base.setting')" :name="DetailTab.Setting" />
        <el-tab-pane :label="tl('overview')" :name="DetailTab.Overview" />
      </el-tabs>
      <template v-if="isBridgeType(type) && !readonly">
        <el-form-item :label-width="actionLabelWidth" :label="actionLabel">
          <ActionSelect
            v-model="selectedAction"
            :type="actionType"
            :direction="actionDirection"
            @change="processSelectedActionChange"
          />
        </el-form-item>
        <el-divider />
      </template>
      <!-- Setting key is to refresh the component after changing the selection  -->
      <component
        v-if="activeTab === DetailTab.Setting"
        ref="FormCom"
        :is="getFormComponent(type)"
        :key="selectedAction"
        v-model="record"
        v-loading="isLoading"
        v-bind="getFormComponentProps(type)"
        :readonly="readonly"
        :edit="isEdit"
        :class="{ 'in-tab': showTabs }"
        :hide-name="!!selectedAction"
        @save="save"
        @init="resetRawRecord"
      />
      <NodeMetrics v-else-if="activeTab === DetailTab.Overview" :node="node" />
    </template>
    <template #footer>
      <div class="space-between" v-if="!readonly">
        <div>
          <el-button
            v-if="node?.type === FlowNodeType.Default && record.editedWay !== undefined"
            link
            type="primary"
            @click="toggleEditedWay"
          >
            {{ t(`Flow.${record.editedWay === EditedWay.Form ? 'switchToSql' : 'switchToForm'}`) }}
          </el-button>
        </div>
        <div>
          <el-button @click="cancel">{{ tl('cancel') }}</el-button>
          <el-button
            :disabled="isSaveDisabled || !$hasPermission('post')"
            :type="isSaveDisabled ? 'info' : 'primary'"
            @click="save"
          >
            {{ tl('save') }}
          </el-button>
        </div>
      </div>
      <template v-else>
        <OperateWebhookAssociatedPopover
          :disabled="!disabledEditBecauseWebhook || !readonly"
          :teleported="false"
          :name="webhookName"
          :operation="t('Base.edit')"
          :targetLabel="t('Base.node')"
        >
          <el-button
            v-if="readonly"
            type="primary"
            @click="edit"
            :disabled="!$hasPermission('put') || disabledEditBecauseWebhook"
          >
            {{ tl('edit') }}
          </el-button>
        </OperateWebhookAssociatedPopover>
      </template>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import useFlowNode, {
  EditedWay,
  FlowNodeType,
  ProcessingType,
  SinkType,
  SourceType,
  SourceTypeAllMsgsAndEvents,
} from '@/hooks/Flow/useFlowNode'
import useGenerateFlowDataUtils from '@/hooks/Flow/useGenerateFlowDataUtils'
import useNodeDrawer from '@/hooks/Flow/useNodeDrawer'
import useNodeForm from '@/hooks/Flow/useNodeForm'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import ActionSelect from '@/views/RuleEngine/Rule/components/ActionSelect.vue'
import OperateWebhookAssociatedPopover from '@/views/RuleEngine/components/OperateWebhookAssociatedPopover.vue'
import RemovedBridgeTip from '@/views/RuleEngine/components/RemovedBridgeTip.vue'
import { Node } from '@vue-flow/core'
import { ElMessageBox } from 'element-plus'
import { cloneDeep, isEqual, isFunction, isObject, lowerCase } from 'lodash'

import NodeMetrics from './metrics/NodeMetrics.vue'
import useHandleSourceItem from '@/hooks/Rule/action/useHandleSourceItem'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  node: {
    type: Object as PropType<Node>,
  },
  nodes: {
    type: Array as PropType<Array<Node>>,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel', 'close', 'edit', 'saveAsNew'])

const showDrawer = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('Base')

/**
 * is specific type, no general type
 * eg. SourceType.Message etc.
 */
const type = computed(() => props.node?.data?.specificType)
const isEdit = computed(() => !!record.value.id)

const FormCom = ref()

const isRemovedBridge = computed(() => {
  if (!props.node || !props.node.data) {
    return false
  }
  return props.node.data.isRemoved
})

const { getDrawerTitle, drawerDefaultWidth, getDrawerWidth, getFormComponent } = useNodeDrawer()
const title = computed(() => (type.value ? getDrawerTitle(type.value) : ''))
const width = computed(() => (type.value ? getDrawerWidth(type.value) : drawerDefaultWidth))

const selectedEvents = computed(() => {
  if (!props.nodes?.length) {
    return []
  }
  return props.nodes.reduce((arr: Array<string>, node) => {
    if (node.data.specificType === SourceType.Event && node.data.formData?.event) {
      arr.push(node.data.formData.event)
    }
    return arr
  }, [])
})

const existedTopics = computed(() => {
  if (!props.nodes?.length) {
    return []
  }
  const currentNodeID = props.node?.id
  return props.nodes.reduce((arr: Array<string>, node) => {
    if (
      node.data.specificType === SourceType.Message &&
      node.data.formData?.topic &&
      node.id !== currentNodeID
    ) {
      arr.push(node.data.formData.topic)
    }
    return arr
  }, [])
})

const { isBridgeType } = useFlowNode()
const { getFormDataByType, isUsingSchemaBridgeType, checkFormIsEmpty } = useNodeForm()
const withOutMetricsTypes: Record<FlowNodeType, Array<string>> = {
  [FlowNodeType.Input]: [SourceType.Event, SourceType.Message, SourceTypeAllMsgsAndEvents],
  [FlowNodeType.Default]: [ProcessingType.Filter],
  [FlowNodeType.Output]: [SinkType.Console, SinkType.RePub],
}
const withMetrics = computed(() => {
  const { node } = props
  if (!node || !node.type || !node.data.specificType) {
    return false
  }
  const withOutMetricsTypesArr = withOutMetricsTypes[node.type as FlowNodeType] || []
  return !withOutMetricsTypesArr.includes(node.data.specificType)
})
const showTabs = computed(() => withMetrics.value && props.readonly)
const enum DetailTab {
  Setting,
  Overview,
}
const activeTab = ref(DetailTab.Setting)

const addedSourceNodes = computed(() => {
  if (!props.nodes?.length) {
    return []
  }
  return props.nodes.filter(({ type }) => type === FlowNodeType.Input)
})

const bridgeFormProps = {
  colSpan: 24,
  labelPosition: 'right',
  requireAsteriskPosition: 'left',
  isUsingInFlow: true,
}
const schemaProps = {
  formProps: {
    labelWidth: '180px',
    labelPosition: 'right',
    requireAsteriskPosition: 'left',
  },
}

const getSchemaBridgeProps = (type: string) => ({
  ...bridgeFormProps,
  ...schemaProps,
  isSource: props.node?.type === FlowNodeType.Input,
  isUsingInFlow: true,
  labelWidth: '180px',
  type: type,
})

const formComponentPropsMap: ComputedRef<Record<string, { [key: string]: any }>> = computed(() => ({
  [SourceType.Message]: { existedTopics: existedTopics.value },
  [SourceType.Event]: { selectedEvents: selectedEvents.value },
  [ProcessingType.Function]: { sourceNodes: addedSourceNodes.value },
  [SinkType.RePub]: { isUsingInFlow: true },
  [SinkType.InfluxDB]: { ...bridgeFormProps, labelWidth: '152px' },
  [SinkType.Datalayers]: { ...bridgeFormProps, labelWidth: '152px' },
}))
const getFormComponentProps = (type: string) => {
  const ret = formComponentPropsMap.value[type]
  if (!ret && isUsingSchemaBridgeType(type)) {
    return getSchemaBridgeProps(type)
  }
  return ret || {}
}

/* For Reuse Action */
const selectedAction = ref('')
const actionType = computed(() => type.value)
const actionDirection = computed(() =>
  props.node?.type === FlowNodeType.Input ? BridgeDirection.Ingress : BridgeDirection.Egress,
)
const { handleActionDataAfterLoaded } = useHandleActionItem()
const processSelectedActionChange = (action: BridgeItem | undefined) => {
  // select create a new one
  if (!action) {
    record.value = getFormDataByType(type.value)
  } else {
    record.value = handleActionDataAfterLoaded(cloneDeep(action))
  }
}
const actionLabel = computed(() =>
  actionDirection.value === BridgeDirection.Ingress ? 'Source' : t('RuleEngine.action'),
)
const actionLabelWidth = computed(() => {
  const setWidth = getFormComponentProps(type.value)?.labelWidth
  return setWidth || 180
})

const record: Ref<Record<string, any>> = ref({})

const isSaveDisabled = computed(() => checkFormIsEmpty(type.value, record.value))

const { detectFieldsExpressionsEditedWay, detectWhereDataEditedWay } = useGenerateFlowDataUtils()
const toggleEditedWay = async () => {
  try {
    if (![ProcessingType.Filter, ProcessingType.Function].includes(type.value)) {
      return
    }
    if (record.value.editedWay === EditedWay.SQL) {
      const detectFunc =
        type.value === ProcessingType.Filter
          ? detectWhereDataEditedWay
          : detectFieldsExpressionsEditedWay
      const defaultEditedWay = detectFunc(record.value.form)
      if (defaultEditedWay === EditedWay.SQL) {
        await ElMessageBox.confirm(t('Flow.editedWayToggleTip'), {
          confirmButtonText: tl('confirm'),
          cancelButtonText: tl('cancel'),
          type: 'warning',
        })
      }
    }
    record.value.editedWay =
      record.value.editedWay === EditedWay.SQL ? EditedWay.Form : EditedWay.SQL
  } catch (error) {
    //
  }
}

/**
 * When clicking the cancel / close button, it's used to compare the
 * current record's value to determine whether to pop up a window or not.
 */
let rawRecord: Record<string, any> = {}

const resetRawRecord = (record: Record<string, any>) => {
  rawRecord = cloneDeep(record)
}

const recordHasNotChanged = () => {
  const ret = isEqual(record.value, rawRecord)
  return ret
}

const cancel = async () => {
  try {
    if (!recordHasNotChanged() && !props.readonly) {
      await ElMessageBox.confirm(
        t('Flow.nodeDrawerCancelTip', {
          type: lowerCase(props.node?.data?.formData ? tl('edit') : tl('create')),
        }),
        {
          confirmButtonText: tl('confirm'),
          cancelButtonText: tl('cancel'),
          type: 'warning',
        },
      )
    }
    emit('cancel')
    showDrawer.value = false
  } catch (error) {
    //
  }
}

const save = async () => {
  try {
    if (FormCom.value.validate && isFunction(FormCom.value.validate)) {
      await customValidate(FormCom.value)
    }
    emit('save', record.value)
  } catch (error) {
    console.error(error)
  }
}

const { judgeIsWebhookRuleId } = useWebhookUtils()
const disabledEditBecauseWebhook = computed(() => {
  const { rulesUsed } = props?.node?.data || {}
  if (!rulesUsed) {
    return false
  }
  return rulesUsed.every(judgeIsWebhookRuleId)
})
const webhookName = computed(() => {
  const { rulesUsed } = props?.node?.data || {}
  if (!rulesUsed || (Array.isArray(rulesUsed) && rulesUsed.length > 1)) {
    return undefined
  }
  return rulesUsed[0]
})

const edit = () => emit('edit')

const { getDetail: getActionDetail } = useHandleActionItem()
const { getSourceDetail } = useHandleSourceItem()
const isLoading = ref(false)
/**
 * summary api do not have detail, so we need to get the detail from the api
 */
const getActionAndSourceDetail = async () => {
  try {
    isLoading.value = true
    const func = props.node?.type === FlowNodeType.Input ? getSourceDetail : getActionDetail
    record.value = await func(record.value.id)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

watch(showDrawer, (val) => {
  if (!val) {
    activeTab.value = DetailTab.Setting
    return
  }

  const { node } = props
  const { formData, specificType: type } = node?.data || {}
  record.value = formData && isObject(formData) ? cloneDeep(formData) : getFormDataByType(type)
  if (isBridgeType(type)) {
    selectedAction.value = record.value.id ? record.value.id : ''
    if (props.readonly) {
      getActionAndSourceDetail()
    }
  }
  rawRecord = cloneDeep(record.value)
})
</script>

<style lang="scss">
.node-drawer {
  &.with-tabs {
    .el-drawer__header {
      margin-bottom: 24px;
    }
    .el-drawer__body {
      padding-top: 0;
    }
  }
  .in-tab {
    padding-top: 24px;
  }
  .action-select {
    width: calc(100% - 120px);
  }
  .bridge-config {
    .el-form-item {
      margin-top: 0;
      margin-bottom: 24px;
    }
    .el-divider--horizontal {
      margin-top: 0;
    }
    .el-form-item__label {
      height: 32px;
      align-items: center;
      text-align: right;
      line-height: 1.2;
    }
    $input-append-width: 120px;
    .el-form-item__content,
    .oneof-item {
      > .el-input:not(.el-input-group--append),
      > .el-select,
      .connector-select {
        width: calc(100% - #{$input-append-width});
      }
    }
    .one-of {
      width: 100%;
    }
    .monaco-container {
      width: calc(100% - #{$input-append-width} / 2);
    }
  }
  .el-alert {
    margin-bottom: 16px;
  }
  .mqtt-bridge-trans-configuration {
    .monaco-container {
      margin-top: 0;
    }
  }
  .message-form,
  .event-form {
    width: 80%;
  }
  .TLS-enable-config .TLS-input {
    width: 100%;
  }
}
</style>
