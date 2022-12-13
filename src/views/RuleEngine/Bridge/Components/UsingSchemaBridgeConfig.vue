<template>
  <div class="schema-bridge bridge-config">
    <schema-form
      v-if="getRefKey"
      ref="formCom"
      type="bridge"
      need-rules
      :need-footer="false"
      :need-record="!bridgeRecord"
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
      :array-editor-type="'table'"
      @update="handleRecordChanged"
    >
    </schema-form>
  </div>
</template>

<script setup lang="ts">
import SchemaForm from '@/components/SchemaForm'
import useSyncConfiguration from '@/hooks/Rule/bridge/useSyncConfiguration'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { OtherBridge } from '@/types/rule'
import { cloneDeep } from 'lodash'
import { computed, defineEmits, defineExpose, defineProps, PropType, ref } from 'vue'
import { useStore } from 'vuex'

type UseSchemaBridgeType = Exclude<
  BridgeType,
  BridgeType.MQTT | BridgeType.Webhook | BridgeType.InfluxDB | BridgeType.Kafka
>

const typeRefKeyMap: Record<UseSchemaBridgeType, string> = {
  [BridgeType.MySQL]: `bridge_mysql.post`,
  [BridgeType.Redis]: `bridge_redis.post_sentinel`,
}

const props = defineProps({
  modelValue: {
    type: Object,
    default: undefined,
  },
  type: {
    type: String as PropType<UseSchemaBridgeType>,
  },
})
const emit = defineEmits(['update:modelValue'])

const store = useStore()
const { tl } = useI18nTl('RuleEngine')

const record = ref({})

const { syncEtcFieldsClassMap, handleSyncEtcFormData } = useSyncConfiguration(record)

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

const propsDisabled = computed(() => (props.modelValue ? ['name'] : []))

const customColClass = computed(() => {
  return {
    ...syncEtcFieldsClassMap.value,
    name: 'col-need-row dividing-line-below',
    direction: 'col-hidden',
    type: 'col-hidden',
    enable: 'col-hidden',
    local_topic: 'col-hidden',
    'connector.ssl': 'col-ssl',
  }
})

const customLabelMap = {
  name: tl('name'),
}

const getRefKey = computed(() => {
  if (!props.type) {
    return
  }
  return typeRefKeyMap[props.type] || undefined
})

const bridgeRecord = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const handleRecordChanged = (formData: OtherBridge) => {
  record.value = formData
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
