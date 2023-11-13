<template>
  <div class="schema-connector connector-config">
    <schema-form
      v-if="getRefKey"
      ref="formCom"
      type="bridge"
      need-rules
      schema-file-path="api/v5/schemas/connectors"
      :need-footer="false"
      :need-record="!edit && !copy"
      :form="connectorRecord"
      :according-to="{ ref: `#/components/schemas/${getRefKey}` }"
      :readonly="readonly"
      :btn-loading="saveLoading"
      :record-loading="isLoading"
      :form-item-span="colSpan"
      :use-tooltip-show-desc="true"
      :props-order-map="propsOrderMap"
      :custom-col-class="customColClass"
      :form-props="formBindProps"
      :advanced-fields="advancedFields"
      :data-handler="getComponentsHandler()"
      @update="handleRecordChanged"
      @component-change="handleComponentChange"
      @init="handleRecordInit"
    >
    </schema-form>
  </div>
</template>

<script setup lang="ts">
import { waitAMoment } from '@/common/tools'
import SchemaForm from '@/components/SchemaForm'
import useReuseBridgeInFlow from '@/hooks/Flow/useReuseBridgeInFlow'
import useSyncConfiguration from '@/hooks/Rule/bridge/useSyncConfiguration'
import useComponentsHandlers from '@/hooks/Rule/connector/useComponentsHandlers'
import useSchemaPropsLayout from '@/hooks/Rule/connector/useSchemaConnectorPropsLayout'
import useFillNewRecord from '@/hooks/useFillNewRecord'
import { BridgeDirection, BridgeType, Role } from '@/types/enum'
import { OtherBridge } from '@/types/rule'
import { Properties } from '@/types/schemaForm'
import { cloneDeep } from 'lodash'
import { computed, defineEmits, defineExpose, defineProps, ref, watch, withDefaults } from 'vue'

type UseConnectorBridgeType = Exclude<
  BridgeType,
  BridgeType.MQTT | BridgeType.Webhook | BridgeType.InfluxDB
>

const typeRefKeyMap = {
  [BridgeType.Kafka]: 'bridge_kafka.post_connector',
}

const props = withDefaults(
  defineProps<{
    modelValue: Record<string, any>
    type?: UseConnectorBridgeType
    edit?: boolean
    copy?: boolean
    isLoading?: boolean
    readonly?: boolean
    formProps?: Record<string, any>
    // for flow, hide `role`
    hiddenFields?: Array<string>
    isUsingInFlow?: boolean
  }>(),
  {
    modelValue: undefined,
    formProps: () => ({}),
  },
)
const emit = defineEmits(['update:modelValue', 'init'])

const connectorRecord = computed({
  get() {
    return props.modelValue || {}
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const colSpan = computed(() => (props.isUsingInFlow ? 24 : 12))

const { handleSyncEtcFormData } = useSyncConfiguration(connectorRecord)

const saveLoading = ref(false)

const formCom = ref()

const formBindProps = {
  labelWidth: undefined,
  labelPosition: 'top',
  requireAsteriskPosition: 'right',
  class: '',
  ...props.formProps,
}

const {
  propsOrderMap,
  customColClass: fixedCustomColClass,
  advancedFields,
} = useSchemaPropsLayout(props, connectorRecord)
const customColClass = computed(() => {
  const ret = fixedCustomColClass.value
  if (props.hiddenFields) {
    props.hiddenFields.forEach((key) => (ret[key] = 'col-hidden'))
  }
  return ret
})

const direction = computed(() =>
  props.modelValue?.role === Role.Consumer ? BridgeDirection.Ingress : BridgeDirection.Egress,
)
const { isCreateBridgeInFlow, isBridgeSelected, handleSchemaForReuse } = useReuseBridgeInFlow(
  props.type as BridgeType,
  props,
  connectorRecord,
  direction.value,
)

watch(isBridgeSelected, async (nVal, oVal) => {
  if (!nVal && oVal && formCom.value?.getInitRecord) {
    connectorRecord.value = formCom.value.getInitRecord()
    await waitAMoment()
    formCom.value.clearValidate?.()
  }
})

const getRefKey = computed(() => {
  if (!props.type) {
    return
  }
  return typeRefKeyMap[props.type as keyof typeof typeRefKeyMap] || undefined
})

const { getComponentsHandler: getTypeComponentsHandler } = useComponentsHandlers(props)
const getComponentsHandler = () => {
  if (!isCreateBridgeInFlow.value) {
    return getTypeComponentsHandler()
  }
  return async (data: any) => {
    // To clear a validation error triggered by a change in the type of the name
    const ret = await handleSchemaForReuse(getTypeComponentsHandler()(data))
    window.setTimeout(() => formCom.value.clearValidate?.(), 16)
    return ret
  }
}

const { fillNewRecord } = useFillNewRecord()
const handleComponentChange = ({
  newVal,
  oldVal,
}: Record<'oldVal' | 'newVal', { components: Properties; record: Record<string, any> }>) => {
  if (props.edit || newVal.record?.type === oldVal.record?.type) {
    return
  }
  connectorRecord.value = { ...fillNewRecord(newVal, oldVal), type: newVal.record.type }
}

const handleRecordChanged = (formData: OtherBridge) => {
  if (Object.keys(formData).length > 0) {
    connectorRecord.value = formData
  }
}

const handleRecordInit = (record: OtherBridge) => {
  emit('init', record)
}

const validate = () => {
  if (formCom.value?.validate) {
    return formCom.value.validate()
  }
  return Promise.resolve()
}

const getFormRecord = () => handleSyncEtcFormData(cloneDeep(formCom.value.configForm))

defineExpose({ getFormRecord, validate })
</script>

<style lang="scss">
.schema-bridge {
  min-height: 320px;
  .col-need-row {
    // To squeeze the next column down
    margin-right: 40%;
  }
  .col-hidden {
    display: none !important;
  }
  .custom-col-24 {
    width: 100%;
    max-width: 100%;
    flex-basis: 100%;
  }
  // hide first label
  .col-ssl {
    > .el-form-item {
      > .el-form-item__label {
        display: none;
      }
    }
  }
  .el-form-item {
    margin-top: 0;
    margin-bottom: 18px;
  }
  .el-col-12.dividing-line-below,
  .el-col-24.dividing-line-below {
    position: relative;
    &::after {
      content: '';
      display: block;
      height: 1px;
      background-color: var(--color-border-card);
    }
  }
  .el-col-12:not(.custom-col-24).dividing-line-below {
    &::after {
      width: calc(200% + 24px);
      margin-top: 24px;
      margin-bottom: 24px;
    }
  }
  .el-col-24.dividing-line-below,
  .custom-col-24.dividing-line-below {
    &::after {
      width: 100%;
      margin-top: 6px;
      margin-bottom: 24px;
    }
  }
  .custom-col-24.dividing-line-above,
  .el-col-24.dividing-line-above {
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 100%;
      margin-top: 6px;
      margin-bottom: 24px;
      height: 1px;
      background-color: var(--color-border-card);
    }
  }
  .schema-form .el-form-item__label {
    font-size: var(--el-form-label-font-size);
    color: var(--el-text-color-regular);
  }
}
</style>
