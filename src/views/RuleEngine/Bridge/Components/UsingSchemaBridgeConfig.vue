<template>
  <div class="schema-form-integration bridge-config">
    <schema-form
      v-if="getRefKey"
      ref="formCom"
      type="bridge"
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
      @update="handleRecordChanged"
      @component-change="handleComponentChange"
      @init="handleRecordInit"
    >
    </schema-form>
  </div>
</template>

<script setup lang="ts">
import { SUPPORTED_CONNECTOR_TYPES } from '@/common/constants'
import { getAPIPath, waitAMoment } from '@/common/tools'
import SchemaForm from '@/components/SchemaForm'
import useReuseBridgeInFlow from '@/hooks/Flow/useReuseBridgeInFlow'
import { useBridgeSchema, useActionSchema } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useComponentsHandlers from '@/hooks/Rule/bridge/useComponentsHandlers'
import useSchemaBridgePropsLayout from '@/hooks/Rule/bridge/useSchemaBridgePropsLayout'
import {
  useGCPSecondTypeControl,
  useMongoSecondTypeControl,
  useRedisSecondTypeControl,
} from '@/hooks/Rule/bridge/useSecondTypeControl'
import useSyncConfiguration from '@/hooks/Rule/bridge/useSyncConfiguration'
import useFillNewRecord from '@/hooks/useFillNewRecord'
import { BridgeDirection, BridgeType, Role } from '@/types/enum'
import { OtherBridge } from '@/types/rule'
import { Properties } from '@/types/schemaForm'
import { cloneDeep } from 'lodash'
import { computed, defineEmits, defineExpose, defineProps, ref, watch, withDefaults } from 'vue'

// type UseSchemaBridgeType = Exclude<
//   BridgeType,
//   BridgeType.MQTT | BridgeType.Webhook | BridgeType.InfluxDB | BridgeType.Kafka
// >

const { getSchemaRefByType } = useBridgeSchema()
const bridgeTypeRefKeyMap = {
  [BridgeType.MySQL]: getSchemaRefByType('mysql'),
  [BridgeType.PgSQL]: getSchemaRefByType('pgsql'),
  [BridgeType.TimescaleDB]: getSchemaRefByType('timescale'),
  [BridgeType.MatrixDB]: getSchemaRefByType('matrix'),
  [BridgeType.TDengine]: getSchemaRefByType('tdengine'),
  [BridgeType.ClickHouse]: getSchemaRefByType('clickhouse'),
  [BridgeType.DynamoDB]: getSchemaRefByType('dynamo'),
  [BridgeType.Cassandra]: getSchemaRefByType('cassa'),
  [BridgeType.RocketMQ]: getSchemaRefByType('rocketmq'),
  [BridgeType.MicrosoftSQLServer]: getSchemaRefByType('sqlserver'),
  [BridgeType.IoTDB]: getSchemaRefByType('iotdb'),
  [BridgeType.OpenTSDB]: getSchemaRefByType('opents'),
  [BridgeType.OracleDatabase]: getSchemaRefByType('oracle'),
  [BridgeType.RabbitMQ]: getSchemaRefByType('rabbitmq'),
  [BridgeType.HStream]: getSchemaRefByType('hstreamdb'),
  [BridgeType.AmazonKinesis]: getSchemaRefByType('kinesis', '_producer'),
  [BridgeType.GreptimeDB]: getSchemaRefByType('greptimedb', '_grpc_v1'),
}

const { getSchemaRefByType: getActionSchemaRefByType } = useActionSchema()
const getActionTypeRefKey = (type: string) => getActionSchemaRefByType(type)
const actionTypeRefKeyMap = {
  [BridgeType.Webhook]: getActionTypeRefKey(BridgeType.Webhook),
  [BridgeType.AzureEventHubs]: getActionTypeRefKey('azure_event_hub'),
  [BridgeType.Confluent]: 'confluent.post_bridge_v2',
  [BridgeType.PgSQL]: getActionTypeRefKey(BridgeType.PgSQL),
}

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
  }>(),
  {
    modelValue: undefined,
    formProps: () => ({}),
  },
)
const emit = defineEmits(['update:modelValue', 'init'])

/**
 * different from is bridge
 */
const isAction = computed(() => SUPPORTED_CONNECTOR_TYPES.includes(props.type as BridgeType))

const schemaFilePath = computed(() => {
  const schemaType = isAction.value ? 'actions' : 'bridges'
  return getAPIPath(`/schemas/${schemaType}`)
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

const formBindProps = {
  labelWidth: undefined,
  labelPosition: 'top',
  requireAsteriskPosition: 'right',
  disabled: props.disabled,
  class: '',
  ...props.formProps,
}

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

const { currentType: redisFormType, keyField: redisSecondTypeControlField } =
  useRedisSecondTypeControl(bridgeRecord)
const { currentType: mongoFormType, keyField: mongoSecondTypeControlField } =
  useMongoSecondTypeControl(bridgeRecord)
const { currentType: GCPFormType, keyField: GCPSecondTypeControlField } =
  useGCPSecondTypeControl(bridgeRecord)

const typesWithSecondControlMap = {
  [BridgeType.Redis]: redisFormType,
  [BridgeType.MongoDB]: mongoFormType,
  [BridgeType.GCP]: GCPFormType,
}
const typesWithSecondControlKeyMap = {
  [BridgeType.Redis]: redisSecondTypeControlField,
  [BridgeType.MongoDB]: mongoSecondTypeControlField,
  [BridgeType.GCP]: GCPSecondTypeControlField,
}

const direction = computed(() =>
  props.modelValue?.role === Role.Consumer ? BridgeDirection.Ingress : BridgeDirection.Egress,
)
const { isCreateBridgeInFlow, isBridgeSelected, handleSchemaForReuse } = useReuseBridgeInFlow(
  props.type as BridgeType,
  props,
  bridgeRecord,
  direction.value,
)

watch(isBridgeSelected, async (nVal, oVal) => {
  if (!nVal && oVal && formCom.value?.getInitRecord) {
    bridgeRecord.value = formCom.value.getInitRecord()
    await waitAMoment()
    formCom.value.clearValidate?.()
  }
})

const propsDisabled = computed(() => {
  const ret = []
  if (props.edit) {
    ret.push('name')
    if (props.type && props.type in typesWithSecondControlKeyMap) {
      ret.push(
        typesWithSecondControlKeyMap[props.type as keyof typeof typesWithSecondControlKeyMap],
      )
    }
  } else if (isCreateBridgeInFlow.value && isBridgeSelected.value) {
    ret.push(typesWithSecondControlKeyMap[props.type as keyof typeof typesWithSecondControlKeyMap])
  }
  return ret
})

const getRefKey = computed(() => {
  if (!props.type) {
    return
  }
  if (isAction.value) {
    return actionTypeRefKeyMap[props.type as keyof typeof actionTypeRefKeyMap] || undefined
  }
  if (Object.keys(typesWithSecondControlMap).includes(props.type)) {
    return typesWithSecondControlMap[props.type as keyof typeof typesWithSecondControlMap].value
  }
  return bridgeTypeRefKeyMap[props.type as keyof typeof bridgeTypeRefKeyMap] || undefined
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
