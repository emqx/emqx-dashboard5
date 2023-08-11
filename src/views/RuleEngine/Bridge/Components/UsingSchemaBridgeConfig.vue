<template>
  <div class="schema-bridge bridge-config">
    <schema-form
      v-if="getRefKey"
      ref="formCom"
      type="bridge"
      need-rules
      schema-file-path="/api/v5/schemas/bridges"
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
      @update="handleRecordChanged"
      @component-change="handleComponentChange"
    >
    </schema-form>
  </div>
</template>

<script setup lang="ts">
import SchemaForm from '@/components/SchemaForm'
import { useBridgeSchema } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useComponentsHandlers from '@/hooks/Rule/bridge/useComponentsHandlers'
import useSchemaBridgePropsLayout from '@/hooks/Rule/bridge/useSchemaBridgePropsLayout'
import {
  useMongoSecondTypeControl,
  useRedisSecondTypeControl,
  useGCPSecondTypeControl,
} from '@/hooks/Rule/bridge/useSecondTypeControl'
import useSyncConfiguration from '@/hooks/Rule/bridge/useSyncConfiguration'
import useFillNewRecord from '@/hooks/useFillNewRecord'
import { BridgeType } from '@/types/enum'
import { OtherBridge } from '@/types/rule'
import { Properties } from '@/types/schemaForm'
import { cloneDeep } from 'lodash'
import { PropType, computed, defineEmits, defineExpose, defineProps, ref } from 'vue'

type UseSchemaBridgeType = Exclude<
  BridgeType,
  BridgeType.MQTT | BridgeType.Webhook | BridgeType.InfluxDB | BridgeType.Kafka
>

const { getSchemaRefByType } = useBridgeSchema()
const typeRefKeyMap = {
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
  [BridgeType.AzureEventHubs]: getSchemaRefByType('azure_event_hub', '_producer'),
  [BridgeType.AmazonKinesis]: getSchemaRefByType('kinesis', '_producer'),
  [BridgeType.GreptimeDB]: getSchemaRefByType('greptimedb', '_grpc_v1'),
}

const props = defineProps({
  modelValue: {
    type: Object,
    default: undefined,
  },
  type: {
    type: String as PropType<UseSchemaBridgeType>,
  },
  edit: {
    type: Boolean,
  },
  copy: {
    type: Boolean,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  colSpan: {
    type: Number,
    default: 12,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  formProps: {
    type: Object as PropType<Properties>,
    default: () => ({}),
  },
  // for flow, hide `role`
  hiddenFields: {
    type: Array as PropType<Array<string>>,
  },
})
const emit = defineEmits(['update:modelValue'])

const bridgeRecord = computed({
  get() {
    return props.modelValue || {}
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { handleSyncEtcFormData } = useSyncConfiguration(bridgeRecord)

const saveLoading = ref(false)

const formCom = ref()

const formBindProps = {
  labelWidth: undefined,
  labelPosition: 'top',
  requireAsteriskPosition: 'right',
  class: '',
  ...props.formProps,
}

const { propsOrderMap, customColClass: fixedCustomColClass } = useSchemaBridgePropsLayout(
  props,
  bridgeRecord,
)
const customColClass = computed(() => {
  const ret = fixedCustomColClass
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

const propsDisabled = computed(() => {
  const ret = []
  if (props.edit) {
    ret.push('name')
    if (props.type && props.type in typesWithSecondControlKeyMap) {
      ret.push(
        typesWithSecondControlKeyMap[props.type as keyof typeof typesWithSecondControlKeyMap],
      )
    }
  }

  return ret
})

const getRefKey = computed(() => {
  if (!props.type) {
    return
  }
  if (Object.keys(typesWithSecondControlMap).includes(props.type)) {
    return typesWithSecondControlMap[props.type as keyof typeof typesWithSecondControlMap].value
  }
  return typeRefKeyMap[props.type as keyof typeof typeRefKeyMap] || undefined
})

const { getComponentsHandler } = useComponentsHandlers(props)

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
      margin-top: 24px + 18px;
      margin-bottom: 24px;
    }
  }
  .el-col-24.dividing-line-below,
  .custom-col-24.dividing-line-below {
    &::after {
      width: 100%;
      margin-top: 24px;
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
      margin-top: 24px;
      margin-bottom: 24px;
      height: 1px;
      background-color: var(--color-border-card);
    }
  }
  .schema-form .el-form-item__label {
    font-size: var(--el-form-label-font-size);
    color: var(--el-text-color-regular);
  }
  .monaco-container,
  .key-and-value-editor,
  .textarea-with-uploader {
    margin-bottom: 18px;
  }
}
</style>
