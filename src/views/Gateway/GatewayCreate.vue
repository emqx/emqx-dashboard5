<template>
  <div class="app-wrapper with-padding-top gateway-create">
    <el-card>
      <div class="section-header">
        {{ `${tl('initial')} ${transGatewayName(gname)}` }}
      </div>
      <el-row>
        <el-col :span="16">
          <el-steps :active="stepActive" finish-status="success">
            <el-step :title="tl('basicConfig')" />
            <el-step :title="tl('listeners')" />
            <el-step :title="tl('auth')" />
          </el-steps>
        </el-col>
      </el-row>
      <el-row class="config-main">
        <el-col :span="18" v-if="stepActive === 0" class="config-basic">
          <template v-if="gname === 'stomp'">
            <stomp-basic v-model:value="basicData" />
          </template>
          <template v-else-if="gname === 'mqttsn'">
            <mqttsn-basic v-model:value="basicData"></mqttsn-basic>
          </template>
          <template v-else-if="gname === 'coap'">
            <coap-basic v-model:value="basicData"></coap-basic>
          </template>
          <template v-else-if="gname === 'lwm2m'">
            <lw-basic v-model:value="basicData"></lw-basic>
          </template>
          <template v-else-if="gname === 'exproto'">
            <exproto-basic v-model:value="basicData"></exproto-basic>
          </template>
          <template v-else-if="gname === 'gbt32960'">
            <gbt32960-basic v-model:value="basicData"></gbt32960-basic>
          </template>
          <template v-else-if="gname === 'jt808'">
            <jt808-basic ref="jt808BasicRef" v-model:value="basicData"></jt808-basic>
          </template>
          <template v-else-if="gname === 'ocpp'">
            <ocpp-basic v-model:value="basicData"></ocpp-basic>
          </template>
        </el-col>

        <el-col :span="24" v-else-if="stepActive === 1">
          <listeners
            :integration="true"
            :gateway-name="gname"
            v-model:list="listenerList"
          ></listeners>
        </el-col>
        <el-col :span="24" v-else-if="stepActive === 2">
          <div class="part-header">
            {{ tl('clientAuth') }}
          </div>
          <div v-if="gname !== 'jt808'" class="config-auth">
            {{ tl('clientAuthDesc') }}
          </div>
          <div v-else>
            <MarkdownContent :content="tl('jt808AuthDesc')" />
          </div>
        </el-col>
      </el-row>
      <el-row class="config-op">
        <el-button v-if="stepActive === 0" @click="gotoList">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button @click="--stepActive" v-if="stepActive > 0" :disabled="submitLoading">
          {{ $t('Base.backStep') }}
        </el-button>
        <el-button
          type="primary"
          @click="handleNextStep"
          v-if="stepActive < 2"
          :disabled="submitLoading"
        >
          {{ $t('Base.nextStep') }}
        </el-button>
        <el-button
          type="primary"
          v-if="stepActive === 2"
          :loading="submitLoading"
          :disabled="!$hasPermission('post')"
          @click="createGateway()"
        >
          {{ $t('Base.enable') }}
        </el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import CoapBasic from './components/coapBasic.vue'
import Listeners from './components/listeners.vue'
import LwBasic from './components/lwm2mBasic.vue'
import MqttsnBasic from './components/mqttsnBasic.vue'
import stompBasic from './components/stompBasic.vue'
import ExprotoBasic from './components/exprotoBasic.vue'
import Gbt32960Basic from './components/gbt32960Basic.vue'
import Jt808Basic from './components/jt808Basic.vue'
import OcppBasic from './components/ocppBasic.vue'
import { updateGateway, getGateway } from '@/api/gateway'
import { ElMessage as M } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import useHandleGatewayData from '@/hooks/Gateway/useHandleGatewayData'
import { GatewayName } from '@/types/enum'
import useTransName from '@/hooks/useTransName'
import useI18nTl from '@/hooks/useI18nTl'
import MarkdownContent from '@/components/MarkdownContent.vue'

const STATIC_LISTENER: Record<GatewayName, any> = {
  exproto: {
    type: 'tcp',
    name: 'default',
    bind: '7993',
    acceptors: 16,
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  lwm2m: {
    type: 'udp',
    name: 'default',
    bind: '5783',
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  coap: {
    type: 'udp',
    name: 'default',
    bind: '5683',
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  mqttsn: {
    type: 'udp',
    name: 'default',
    bind: '1884',
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  stomp: {
    type: 'tcp',
    name: 'default',
    bind: '61613',
    acceptors: 16,
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  gbt32960: {
    type: 'tcp',
    name: 'default',
    bind: '7325',
    acceptors: 16,
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  jt808: {
    type: 'tcp',
    name: 'default',
    bind: '6207',
    acceptors: 16,
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  ocpp: {
    type: 'ws',
    name: 'default',
    bind: '33033',
    acceptors: 16,
    websocket: {
      path: '/ocpp',
    },
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
}

const router = useRouter()
const route = useRoute()
const { tl } = useI18nTl('Gateway')
const { t } = useI18n()
const { handleExprotoData } = useHandleGatewayData()
const { transGatewayName } = useTransName()
const jt808BasicRef = ref()

const stepActive = ref(0)
const basicData = ref<any>({})
const listenerList = ref<any[]>([])
const submitLoading = ref(false)

const gname = (route.params.name as string).toLowerCase() as GatewayName

const gotoList = () => {
  router.push({ name: 'gateway' })
}

const createGateway = async () => {
  let data: any = {
    ...basicData.value,
    listeners: [...listenerList.value],
    name: gname,
  }
  if (gname === GatewayName.ExProto) {
    data = handleExprotoData(data)
  }
  try {
    submitLoading.value = true
    await updateGateway(gname, data)
    M.success(t('Base.createSuccess'))
    gotoList()
  } catch (error) {
    // ignore error
  } finally {
    submitLoading.value = false
  }
}

const gatewayStatus = async () => {
  if (!gname) {
    gotoList()
  }

  try {
    const { status } = await getGateway(gname)
    if (status !== 'unloaded') {
      M.error(t('Gateway.alreadyLoad'))
      gotoList()
    }
  } catch (error) {
    // ignore error
  }
}

const validNext = async () => {
  if (
    gname === 'exproto' &&
    stepActive.value === 0 &&
    basicData.value.server?.ssl_options?.enable
  ) {
    const { certfile, keyfile } = basicData.value.server.ssl_options
    if (!certfile || !keyfile) {
      M.warning(t('Gateway.missinggRPCTLSFile'))
      return Promise.resolve(false)
    }
  }
  if (gname === 'jt808' && stepActive.value === 0) {
    return await jt808BasicRef.value?.getFormRuleValide()
  }
  return Promise.resolve(true)
}

const handleNextStep = async () => {
  const isValid = await validNext()
  if (!isValid) {
    return
  }
  stepActive.value += 1
}

onMounted(() => {
  gatewayStatus()

  const staticListener = STATIC_LISTENER[gname]
  if (staticListener) {
    listenerList.value.push({ ...staticListener } as unknown as any)
  }
})
</script>

<style lang="scss" scoped>
.config-main {
  margin-top: 30px;
}
.config-op {
  margin-top: 30px;
}
.config-auth {
  width: 50%;
  margin: 20px 0;
}
</style>
