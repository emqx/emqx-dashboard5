<template>
  <div class="basic-info" v-loading="infoLoading">
    <template v-if="name === 'stomp'">
      <stomp-basic v-model:value="basicData" :key="iKey" />
    </template>
    <template v-else-if="name === 'mqttsn'">
      <mqttsn-basic v-model:value="basicData" :key="iKey"></mqttsn-basic>
    </template>
    <template v-else-if="name === 'coap'">
      <coap-basic v-model:value="basicData" :key="iKey"></coap-basic>
    </template>
    <template v-else-if="name === 'lwm2m'">
      <lwm2m-basic v-model:value="basicData" :key="iKey"></lwm2m-basic>
    </template>
    <template v-else-if="name === 'exproto'">
      <exproto-basic v-model:value="basicData" :key="iKey"></exproto-basic>
    </template>
    <el-button
      type="primary"
      size="small"
      :loading="updateLoading"
      @click="updateGatewayInfo()"
      :disabled="basicData.status === 'unloaded'"
      >{{ $t('Base.update') }}</el-button
    >
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import CoapBasic from './coapBasic.vue'
import Lwm2mBasic from './lwm2mBasic.vue'
import MqttsnBasic from './mqttsnBasic.vue'
import stompBasic from './stompBasic.vue'
import ExprotoBasic from './exprotoBasic.vue'
import { updateGateway, getGateway } from '@/api/gateway'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: { stompBasic, MqttsnBasic, Lwm2mBasic, CoapBasic, ExprotoBasic },
  name: 'GatewayDetailBasic',

  setup() {
    let basicData = ref({})
    let infoLoading = ref(false)
    let updateLoading = ref(false)
    const { t } = useI18n()
    let iKey = ref(0)
    const route = useRoute()
    const name = String(route.params.name).toLowerCase()

    const getGatewayInfo = async () => {
      infoLoading.value = true
      if (!name) return
      let res = await getGateway(name).catch(() => {})
      if (res) {
        basicData.value = res
        ++iKey.value
      }
      infoLoading.value = false
    }

    const updateGatewayInfo = async function () {
      updateLoading.value = true
      infoLoading.value = true
      let res = await updateGateway(name, basicData.value).catch(() => {})
      if (res) {
        this.$message({
          type: 'success',
          message: t('Base.updateSuccess'),
        })
        getGatewayInfo()
      }
      updateLoading.value = false
      infoLoading.value = false
    }

    onMounted(() => {
      getGatewayInfo()
    })

    return {
      tl: (key, collection = 'Gateway') => t(collection + '.' + key),
      basicData,
      updateLoading,
      infoLoading,
      updateGatewayInfo,
      iKey,
      name,
    }
  },
})
</script>

<style lang="scss" scoped>
.basic-info {
  width: 70%;
  margin: 10px;
}
</style>
