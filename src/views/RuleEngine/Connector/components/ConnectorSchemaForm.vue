<template>
  <div class="schema-form-integration connector-config">
    <schema-form
      v-if="renderComponent"
      ref="formCom"
      type="connector"
      need-rules
      schema-file-path="/schemas/connectors"
      :need-footer="false"
      :need-record="needRecord"
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
    />
  </div>
</template>

<script setup lang="ts">
import { BridgeType } from '@/types/enum'
import { OtherBridge } from '@/types/rule'
import { Properties } from '@/types/schemaForm'

const { getTypeRefKey } = useConnectorSchema()

const props = withDefaults(
  defineProps<{
    modelValue: Record<string, any>
    /**
     * in fact, type is UseConnectorBridgeType, but use it will trigger
     * https://github.com/vuejs/core/issues/6252
     */
    type?: string
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

const formBindProps = computed(() => ({
  labelWidth: undefined,
  labelPosition: 'top',
  requireAsteriskPosition: 'right',
  class: '',
  ...props.formProps,
}))

const {
  propsOrderMap,
  customColClass: fixedCustomColClass,
  advancedFields,
} = useSchemaConnectorPropsLayout(props, connectorRecord)
const customColClass = computed(() => {
  const ret = fixedCustomColClass.value
  if (props.hiddenFields) {
    props.hiddenFields.forEach((key) => (ret[key] = 'col-hidden'))
  }
  return ret
})

const { currentRef: IoTDBRef, keyField: IoTDBSecondRefControlField } =
  useIoTDBSecondRefControl(connectorRecord)
const typesWithSecondControlMap: Map<string, ComputedRef<string>> = new Map([
  [BridgeType.IoTDB, IoTDBRef],
])
const typesWithSecondControlKeyMap: Map<string, string> = new Map([
  [BridgeType.IoTDB, IoTDBSecondRefControlField],
])
const secondControlKey = computed(() => typesWithSecondControlKeyMap.get(props.type ?? ''))

const needRecord = computed(() => !props.edit && !props.copy)
const getRefKey = computed(() => {
  if (!props.type) {
    return
  }
  const secondRef = typesWithSecondControlMap.get(props.type)
  if (secondRef) {
    return secondRef.value
  }
  return getTypeRefKey(props.type)
})
const renderComponent = computed<boolean>(() => {
  if (secondControlKey.value && !needRecord.value) {
    return !!connectorRecord.value[secondControlKey.value]
  }
  return !!getRefKey.value
})

const { getComponentsHandler } = useConnectorComponentsHandlers(props)

const { fillNewRecord } = useFillNewRecord()
const isKeyFieldPropChanged = (nC: Properties, oC: Properties) => {
  const key = secondControlKey.value
  if (!key) {
    return false
  }
  const oldValue = oC[key]?.default
  const newValue = nC[key]?.default
  return newValue !== oldValue
}
const handleComponentChange = ({
  newVal,
  oldVal,
}: Record<'oldVal' | 'newVal', { components: Properties; record: Record<string, any> }>) => {
  if (isKeyFieldPropChanged(newVal.components, oldVal.components)) {
    connectorRecord.value = { ...fillNewRecord(newVal, oldVal), type: newVal.record.type }
  }
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
