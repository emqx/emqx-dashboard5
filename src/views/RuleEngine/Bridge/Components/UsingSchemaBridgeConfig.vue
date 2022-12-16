<template>
  <div class="schema-bridge bridge-config">
    <schema-form
      v-if="getRefKey"
      ref="formCom"
      type="bridge"
      need-rules
      :need-footer="false"
      :need-record="!isEdit"
      :form="bridgeRecord"
      :schema-file-path="`static/bridge-api-${store.state.lang}.json`"
      :according-to="{ ref: `#/components/schemas/${getRefKey}` }"
      :btn-loading="saveLoading"
      :form-item-span="12"
      :use-tooltip-show-desc="true"
      :props-order-map="propsOrderMap"
      :custom-col-class="customColClass"
      :custom-label-map="customLabelMap"
      :props-disabled="propsDisabled"
      :data-handler="getComponentsHandler()"
      @update="handleRecordChanged"
      @component-change="handleComponentChange"
    >
    </schema-form>
  </div>
</template>

<script setup lang="ts">
import { REDIS_TYPE } from '@/common/constants'
import SchemaForm from '@/components/SchemaForm'
import useRedisSecondTypeControl from '@/hooks/Rule/bridge/useRedisSecondTypeControl'
import useSyncConfiguration from '@/hooks/Rule/bridge/useSyncConfiguration'
import useFillNewRecord from '@/hooks/useFillNewRecord'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRules } from '@/hooks/useSchemaFormRules'
import { BridgeType } from '@/types/enum'
import { OtherBridge } from '@/types/rule'
import { Properties } from '@/types/schemaForm'
import { cloneDeep } from 'lodash'
import { computed, defineEmits, defineExpose, defineProps, PropType, ref } from 'vue'
import { useStore } from 'vuex'

type UseSchemaBridgeType = Exclude<
  BridgeType,
  BridgeType.MQTT | BridgeType.Webhook | BridgeType.InfluxDB | BridgeType.Kafka
>

const typeRefKeyMap = {
  [BridgeType.MySQL]: `bridge_mysql.post`,
  // [BridgeType.Redis]: `bridge_redis.post_single`,
}

const props = defineProps({
  modelValue: {
    type: Object,
    default: undefined,
  },
  type: {
    type: String as PropType<UseSchemaBridgeType>,
  },
  isEdit: {
    type: Boolean,
  },
})
const emit = defineEmits(['update:modelValue'])

const store = useStore()
const { tl, t } = useI18nTl('RuleEngine')

const bridgeRecord = computed({
  get() {
    return props.modelValue || {}
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { syncEtcFieldsClassMap, handleSyncEtcFormData } = useSyncConfiguration(bridgeRecord)

const saveLoading = ref(false)

const formCom = ref()

const createOrderObj = (keyArr: Array<string>, beginning: number) =>
  keyArr.reduce((obj, key, index) => ({ ...obj, [key]: index + beginning }), {})

const baseOrderMap = {
  name: 0,
  ...createOrderObj(
    [
      'worker_pool_size',
      'health_check_interval',
      'auto_restart_interval',
      'query_mode',
      'async_inflight_window',
      'enable_queue',
      'max_queue_bytes',
      'enable_batch',
      'batch_size',
      'batch_time',
    ],
    99,
  ),
}

const propsOrderTypeMap: Record<string, Record<string, number>> = {
  [BridgeType.MySQL]: {
    ...baseOrderMap,
    ...createOrderObj(
      ['server', 'database', 'username', 'password', 'pool_size', 'auto_reconnect', 'sql', 'ssl'],
      1,
    ),
  },
  [BridgeType.Redis]: {
    ...baseOrderMap,
    ...createOrderObj(
      [
        'redis_type',
        'servers',
        'server',
        'password',
        'database',
        'sentinel',
        'pool_size',
        'auto_reconnect',
        'command_template',
      ],
      1,
    ),
  },
}

const propsOrderMap = computed(() => {
  if (!props.type) {
    return baseOrderMap
  }
  if (props.type in propsOrderTypeMap) {
    return propsOrderTypeMap[props.type]
  }
  return baseOrderMap
})

const propsDisabled = computed(() => (props.isEdit ? ['name'] : []))

const typeColClassMap = {
  [BridgeType.MySQL]: {},
  [BridgeType.Redis]: {
    'resource_opts.auto_restart_interval': 'col-need-row',
    command_template: 'custom-col-24',
  },
}

const customColClass = computed(() => {
  const externalClass = props.type ? typeColClassMap[props.type] : {}
  return {
    ...syncEtcFieldsClassMap.value,
    name: 'col-need-row dividing-line-below',
    direction: 'col-hidden',
    type: 'col-hidden',
    enable: 'col-hidden',
    local_topic: 'col-hidden',
    'connector.ssl': 'col-ssl',
    ...externalClass,
  }
})

const customLabelMap = {
  name: tl('name'),
}

const { currentType: redisFormType } = useRedisSecondTypeControl(bridgeRecord)
const typesWithSecondControlMap = {
  [BridgeType.Redis]: redisFormType,
}

const getRefKey = computed(() => {
  if (!props.type) {
    return
  }
  if (Object.keys(typesWithSecondControlMap).includes(props.type)) {
    return typesWithSecondControlMap[props.type as keyof typeof typesWithSecondControlMap].value
  }
  return typeRefKeyMap[props.type as keyof typeof typeRefKeyMap] || undefined
})

const getComponentsHandler = () => {
  if (props.type === BridgeType.Redis) {
    return ({ components, rules }: { components: Properties; rules: SchemaRules }) => {
      const { redis_type, servers, command_template } = components
      if (redis_type?.symbols && Array.isArray(redis_type.symbols)) {
        redis_type.symbols = REDIS_TYPE
        redis_type.label = t('Auth.redisType')
        if (redis_type.description) {
          Reflect.deleteProperty(redis_type, 'description')
        }
      }
      if (redis_type?.symbols && Array.isArray(redis_type.symbols)) {
        redis_type.symbols = REDIS_TYPE
      }
      if (servers?.type === 'array' && servers?.items?.type === 'string') {
        servers.items.component = 'input'
      }
      if (command_template?.type === 'array' && command_template?.items?.type === 'string') {
        command_template.items.component = 'table'
      }
      return { components, rules }
    }
  }
  return undefined
}

const { fillNewRecord } = useFillNewRecord()
const handleComponentChange = ({
  newVal,
  oldVal,
}: Record<'oldVal' | 'newVal', { components: Properties; record: Record<string, any> }>) => {
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
    display: none;
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
  .el-col-12.dividing-line-below {
    position: relative;
    &::after {
      content: '';
      display: block;
      height: 1px;
      width: 200%;
      margin-top: 24px + 18px;
      margin-bottom: 24px;
      background-color: var(--color-border-menu);
    }
  }
  .schema-form .el-form-item__label {
    font-size: var(--el-form-label-font-size);
    color: var(--el-text-color-regular);
  }
}
</style>
