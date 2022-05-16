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

<script>
import { defineComponent, onMounted, ref } from 'vue'
import CoapBasic from './coapBasic.vue'
import Lwm2mBasic from './lwm2mBasic.vue'
import MqttsnBasic from './mqttsnBasic.vue'
import stompBasic from './stompBasic.vue'
import ExprotoBasic from './exprotoBasic.vue'
import { updateGateway, getGateway } from '@/api/gateway'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import useHandleExprotoData from '@/hooks/Gateway/useHandleExprotoData.ts'
import { GatewayName } from '@/types/enum'

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
    const updateGatewayInfo = async function () {
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
        await updateGateway(name, dataToSubmit)
        this.$message({
          type: 'success',
          message: t('Base.updateSuccess'),
        })
        getGatewayInfo()
      } catch (error) {
        //
      } finally {
        updateLoading.value = false
        infoLoading.value = false
      }
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
