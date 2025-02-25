<template>
  <div class="schema-form-integration bridge-config">
    <schema-form
      v-if="getRefKey"
      ref="formCom"
      :type="schemaType"
      need-rules
      :schema-file-path="schemaFilePath"
      :need-footer="false"
      :need-record="!edit && !copy"
      :form="bridgeRecord"
      :according-to="{ ref: `#/components/schemas/${getRefKey}` }"
      :readonly="readonly"
      :btn-loading="saveLoading"
      :record-loading="isLoading"
      :form-item-span="colSpan"
      :use-tooltip-show-desc="true"
      :props-order-map="propsOrderMap"
      :custom-col-class="customColClass"
      :props-disabled="propsDisabled"
      :data-handler="getComponentsHandler()"
      :form-props="formBindProps"
      :advanced-fields="advancedFields"
      :batch-setting-configs="batchSettingConfigs"
      @update="handleRecordChanged"
      @component-change="handleComponentChange"
      @init="handleRecordInit"
    >
    </schema-form>
  </div>
</template>

<script setup lang="ts">
import { BatchSettingDatabaseType } from '@/types/enum'
import { OtherBridge } from '@/types/rule'
import { Properties } from '@/types/schemaForm'

const { getSchemaRefByType: getActionTypeRefKey } = useActionSchema()
const { getSchemaRefByType: getSourceTypeRefKey } = useSourceSchema()

const props = withDefaults(
  defineProps<{
    modelValue: Record<string, any>
    /**
     * in fact, type is UseSchemaBridgeType, but use it will trigger
     * https://github.com/vuejs/core/issues/6252
     */
    type?: string
    edit?: boolean
    copy?: boolean
    isLoading?: boolean
    readonly?: boolean
    disabled?: boolean
    /**
     * for rule
     */
    hideName?: boolean
    /**
     * bind to el-form component
     */
    formProps?: Record<string, any>
    // for flow, hide `role`
    hiddenFields?: Array<string>
    isUsingInFlow?: boolean
    isSource?: boolean
  }>(),
  {
    modelValue: undefined,
    formProps: () => ({}),
  },
)
const emit = defineEmits(['update:modelValue', 'init'])

const schemaFilePath = computed(() => getAPIPath(`/schemas/actions`))

const schemaType = computed(() => {
  return props.isSource ? 'source' : 'action'
})

const bridgeRecord = computed({
  get() {
    return props.modelValue || {}
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const colSpan = computed(() => (props.isUsingInFlow ? 24 : 12))

const { handleSyncEtcFormData } = useSyncConfiguration(bridgeRecord)

const saveLoading = ref(false)

const formCom = ref()

const formBindProps = computed(() => ({
  labelWidth: undefined,
  labelPosition: 'top',
  requireAsteriskPosition: 'right',
  disabled: props.disabled,
  class: '',
  ...props.formProps,
}))

const {
  propsOrderMap,
  customColClass: fixedCustomColClass,
  advancedFields,
} = useSchemaBridgePropsLayout(props, bridgeRecord)
const customColClass = computed(() => {
  const ret = fixedCustomColClass.value
  if (props.hiddenFields) {
    props.hiddenFields.forEach((key) => (ret[key] = 'col-hidden'))
  }
  return ret
})

const propsDisabled = computed(() => {
  const ret = []
  if (props.edit) {
    ret.push('name')
  }
  return ret
})

const getRefKey = computed(() => {
  if (!props.type) {
    return
  }
  return props.isSource ? getSourceTypeRefKey(props.type) : getActionTypeRefKey(props.type)
})

const batchSettingDBs = ['tdengine', 'iotdb' /* add more db types here if needed */]
const batchSettingDBMaps: Record<string, string> = {
  tdengine: 'TDengine',
  iotdb: 'IoTDB',
}
const batchSettingConfigs = computed(() => {
  if (!getRefKey.value) {
    return
  }
  /**
   * Finds the database type based on the reference key and returns an object with the corresponding database type.
   * @returns {Object} An object with the database type.
   */
  const dbType = batchSettingDBs.find((type) => getRefKey.value?.includes(type))
  if (dbType) {
    const typeKey = batchSettingDBMaps[dbType] as keyof typeof BatchSettingDatabaseType
    return {
      dbType: BatchSettingDatabaseType[typeKey],
    }
  }
  return undefined
})

const { getComponentsHandler } = useActionComponentsHandlers(props)

const { fillNewRecord } = useFillNewRecord()
const handleComponentChange = ({
  newVal,
  oldVal,
}: Record<'oldVal' | 'newVal', { components: Properties; record: Record<string, any> }>) => {
  if (props.edit || newVal.record?.type === oldVal.record?.type) {
    return
  }
  bridgeRecord.value = { ...fillNewRecord(newVal, oldVal), type: newVal.record.type }
}

const handleRecordChanged = (formData: OtherBridge) => {
  if (Object.keys(formData).length > 0) {
    bridgeRecord.value = formData
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
