<template>
  <component ref="FormRef" :is="formCom" v-model:value="record" :is-edit="isEdit" />
</template>

<script setup lang="ts">
import { GatewayName } from '@/types/enum'
import CoapBasic from './coapBasic.vue'
import ExprotoBasic from './exprotoBasic.vue'
import Gbt32960Basic from './gbt32960Basic.vue'
import Jt808Basic from './jt808Basic.vue'
import Lwm2mBasic from './lwm2mBasic.vue'
import MqttsnBasic from './mqttsnBasic.vue'
import NatsBasic from './natsBasic.vue'
import OcppBasic from './ocppBasic.vue'
import StompBasic from './stompBasic.vue'

const props = defineProps<{
  name: GatewayName
  value: Record<string, any>
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:value', value: Record<string, any>): void
}>()

const record = computed({
  get() {
    return props.value
  },
  set(value) {
    emit('update:value', value)
  },
})

const formComMap = new Map<GatewayName, Component>([
  [GatewayName.STOMP, StompBasic],
  [GatewayName.MQTT_SN, MqttsnBasic],
  [GatewayName.CoAP, CoapBasic],
  [GatewayName.LwM2M, Lwm2mBasic],
  [GatewayName.ExProto, ExprotoBasic],
  [GatewayName.GBT32960, Gbt32960Basic],
  [GatewayName.JT808, Jt808Basic],
  [GatewayName.OCPP, OcppBasic],
  [GatewayName.NATS, NatsBasic],
])

const formCom = computed(() => {
  if (!props.name || !formComMap.has(props.name)) {
    return 'div'
  }
  return formComMap.get(props.name)
})

const FormRef = ref()

defineExpose({
  validate: () => FormRef.value?.validate?.(),
})
</script>
