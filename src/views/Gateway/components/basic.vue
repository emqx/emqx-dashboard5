<template>
  <el-card class="app-card">
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
      <template v-else-if="name === 'gbt32960'">
        <gbt32960-basic v-model:value="basicData" :key="iKey" is-edit />
      </template>
      <template v-else-if="name === 'jt808'">
        <jt808-basic v-model:value="basicData" :key="iKey" is-edit />
      </template>
      <template v-else-if="name === 'ocpp'">
        <ocpp-basic v-model:value="basicData" :key="iKey" is-edit />
      </template>
    </div>
  </el-card>
  <el-card class="ft-card">
    <el-button
      type="primary"
      :loading="updateLoading"
      @click="updateGatewayInfo()"
      :disabled="basicData.status === 'unloaded' || !$hasPermission('put')"
    >
      {{ $t('Base.update') }}
    </el-button>
  </el-card>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import CoapBasic from './coapBasic.vue'
import Lwm2mBasic from './lwm2mBasic.vue'
import MqttsnBasic from './mqttsnBasic.vue'
import stompBasic from './stompBasic.vue'
import ExprotoBasic from './exprotoBasic.vue'
import Gbt32960Basic from './gbt32960Basic.vue'
import Jt808Basic from './jt808Basic.vue'
import OcppBasic from './ocppBasic.vue'
import { updateGateway, getGateway } from '@/api/gateway'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import useHandleGatewayData from '@/hooks/Gateway/useHandleGatewayData.ts'
import { GatewayName } from '@/types/enum'

export default defineComponent({
  components: {
    stompBasic,
    MqttsnBasic,
    Lwm2mBasic,
    CoapBasic,
    ExprotoBasic,
    Gbt32960Basic,
    Jt808Basic,
    OcppBasic,
  },
  name: 'GatewayDetailBasic',

  setup() {
    let basicData = ref({})
    let infoLoading = ref(false)
    let updateLoading = ref(false)
    const { t } = useI18n()
    let iKey = ref(0)
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

    const { handleExprotoData } = useHandleGatewayData()
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
        const needDeleteFields = ['stopped_at']
        needDeleteFields.forEach((field) => {
          if (dataToSubmit[field]) {
            delete dataToSubmit[field]
          }
        })
        await updateGateway(name, dataToSubmit)
        this.$message({
          type: 'success',
          message: t('Base.updateSuccess'),
        })
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
  width: 75%;
  margin: 10px;
}
</style>
@/hooks/Gateway/
