<template>
  <div>
    <schema-form
      v-if="getRefKey"
      ref="formCom"
      type="bridge"
      :need-footer="false"
      :need-record="!bridgeRecord"
      :form="bridgeRecord"
      :schema-file-path="`static/bridge-api-${store.state.lang}.json`"
      :according-to="{ ref: `#/components/schemas/${getRefKey}` }"
      :btn-loading="saveLoading"
    >
    </schema-form>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineProps, computed, defineEmits, PropType } from 'vue'
import { useStore } from 'vuex'
import SchemaForm from '@/components/SchemaForm'
import { BridgeType } from '@/types/enum'

type UseSchemaBridgeType = Exclude<BridgeType, BridgeType.MQTT | BridgeType.Webhook>

const typeRefKeyMap: Record<UseSchemaBridgeType, string> = {
  [BridgeType.InfluxDBV1]: `bridge_influxdb.post_api_v1`,
  [BridgeType.InfluxDBV2]: `bridge_influxdb.post_api_v2`,
  [BridgeType.InfluxDBUPD]: `bridge_influxdb.post_udp`,
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

const saveLoading = ref(false)

const formCom = ref()

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
  // TODO:
  return Promise.resolve()
}

const getFormRecord = () => {
  return formCom.value.configForm
}

defineExpose({ getFormRecord, validate })
</script>
