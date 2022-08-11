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
    >
    </schema-form>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineProps, computed, defineEmits, PropType } from 'vue'
import { useStore } from 'vuex'
import SchemaForm from '@/components/SchemaForm'
import { BridgeType } from '@/types/enum'
import useI18nTl from '@/hooks/useI18nTl'

type UseSchemaBridgeType = Exclude<BridgeType, BridgeType.MQTT | BridgeType.Webhook>

const typeRefKeyMap: Record<UseSchemaBridgeType, string> = {
  [BridgeType.InfluxDBV1]: `bridge_influxdb.post_api_v1`,
  [BridgeType.InfluxDBV2]: `bridge_influxdb.post_api_v2`,
  [BridgeType.InfluxDBUPD]: `bridge_influxdb.post_udp`,
  // TODO:
  [BridgeType.MySQL]: `bridge.post`,
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

const saveLoading = ref(false)

const formCom = ref()

const baseOrderMap = {
  name: 0,
}

const propsOrderTypeMap: Record<string, Record<string, number>> = {
  [BridgeType.InfluxDBV1]: {
    // root
    ...baseOrderMap,
    host: 1,
    port: 2,
    database: 3,
    username: 4,
    password: 5,
    precision: 6,
    pool_size: 7,
    write_syntax: 8,
    local_topic: 9,
  },
  [BridgeType.InfluxDBV2]: {
    // root
    ...baseOrderMap,
    host: 1,
    port: 2,
    token: 3,
    org: 4,
    bucket: 5,
    pool_size: 6,
    write_syntax: 7,
    ssl: 8,
  },
  [BridgeType.InfluxDBUPD]: {
    // root
    ...baseOrderMap,
    host: 1,
    port: 2,
    pool_size: 3,
    write_syntax: 4,
  },
  [BridgeType.MySQL]: {
    ...baseOrderMap,
    server: 1,
    username: 2,
    password: 3,
    database: 4,
    prepare_statement: 5,
    ssl: 6,
    pool_size: 7,
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

const customColClass = {
  name: 'col-name dividing-line-below',
  direction: 'col-hidden',
  type: 'col-hidden',
  enable: 'col-hidden',
  local_topic: 'col-hidden',
  'connector.ssl': 'col-ssl',
}

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

const validate = () => {
  if (formCom.value?.validate) {
    return formCom.value.validate()
  }
  return Promise.resolve()
}

const getFormRecord = () => {
  return formCom.value.configForm
}

defineExpose({ getFormRecord, validate })
</script>

<style lang="scss">
.schema-bridge {
  min-height: 320px;
  .col-name {
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
