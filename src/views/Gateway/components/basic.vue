<template>
  <el-card>
    <div class="basic-info" v-loading="infoLoading">
      <template v-if="name === 'stomp'">
        <stomp-basic v-model:value="basicData" :key="iKey" />
      </template>
      <template v-else-if="name === 'mqttsn'">
        <mqttsn-basic v-model:value="basicData" :key="iKey" />
      </template>
      <template v-else-if="name === 'coap'">
        <coap-basic v-model:value="basicData" :key="iKey" />
      </template>
      <template v-else-if="name === 'lwm2m'">
        <lwm2m-basic v-model:value="basicData" :key="iKey" />
      </template>
      <template v-else-if="name === 'exproto'">
        <exproto-basic v-model:value="basicData" :key="iKey" is-edit />
      </template>
      <el-button
        type="primary"
        :loading="updateLoading"
        @click="updateGatewayInfo()"
        :disabled="basicData.status === 'unloaded'"
      >
        {{ $t('Base.update') }}
      </el-button>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { getGateway, updateGateway } from '@/api/gateway'
import useHandleExprotoData from '@/hooks/Gateway/useHandleExprotoData'
import { GatewayName } from '@/types/enum'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import CoapBasic from './coapBasic.vue'
import ExprotoBasic from './exprotoBasic.vue'
import Lwm2mBasic from './lwm2mBasic.vue'
import MqttsnBasic from './mqttsnBasic.vue'
import StompBasic from './stompBasic.vue'

const basicData = ref<Record<string, any>>({})
const infoLoading = ref(false)
const updateLoading = ref(false)
const { t } = useI18n()
const iKey = ref(0)
const route = useRoute()
const name = String(route.params.name).toLowerCase()

const loadGatewayInfo = async () => {
  infoLoading.value = true
  if (!name) return
  try {
    basicData.value = await getGateway(name)
    ++iKey.value
  } catch (error) {
    //
  } finally {
    infoLoading.value = false
  }
}

const { handleExprotoData } = useHandleExprotoData()
const updateGatewayInfo = async () => {
  updateLoading.value = true
  infoLoading.value = true
  const removedFields = [
    'listeners',
    'created_at',
    'started_at',
    'status',
    'name',
    'authentication',
  ]
  removedFields.forEach((field) => {
    delete basicData.value[field]
  })
  try {
    let dataToSubmit = basicData.value
    if (name === GatewayName.ExProto) {
      dataToSubmit = handleExprotoData(dataToSubmit)
    }
    const needDeleteFields = ['stopped_at']
    needDeleteFields.forEach((field) => {
      if (dataToSubmit[field]) {
        delete dataToSubmit[field]
      }
    })
    await updateGateway(name, dataToSubmit)
    ElMessage.success(t('Base.updateSuccess'))
    loadGatewayInfo()
  } catch (error) {
    //
  } finally {
    updateLoading.value = false
    infoLoading.value = false
  }
}

onMounted(() => {
  loadGatewayInfo()
})
</script>

<style lang="scss" scoped>
.basic-info {
  width: 75%;
  margin: 10px;
}
</style>
