<template>
  <div class="app-wrapper gateway-create with-padding-bottom">
    <DetailHeader :item="{ name: pageTitle, routeName: 'gateway' }" />
    <el-card>
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
          <GatewayForm ref="FormRef" :name="gname" v-model:value="basicData" />
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
        <CancelButton v-if="stepActive === 0" @click="gotoList" />
        <el-button @click="--stepActive" v-if="stepActive > 0" :disabled="submitLoading">
          {{ t('Base.backStep') }}
        </el-button>
        <el-button
          type="primary"
          @click="handleNextStep"
          v-if="stepActive < 2"
          :disabled="submitLoading"
        >
          {{ t('Base.nextStep') }}
        </el-button>
        <el-button
          type="primary"
          v-if="stepActive === 2"
          :loading="submitLoading"
          :disabled="!$hasPermission('post')"
          @click="createGateway()"
        >
          {{ t('Base.enable') }}
        </el-button>
      </el-row>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { getGateway, updateGateway } from '@/api/gateway'
import { GatewayName } from '@/types/enum'
import { GatewayListener } from '@/types/typeAlias'
import { ElMessage as M } from 'element-plus'
import GatewayForm from './components/gatewayForm.vue'
import Listeners from './components/listeners.vue'

type GatewayData = any

const STATIC_LISTENER: Record<GatewayName, GatewayListener> = {
  [GatewayName.ExProto]: {
    type: 'tcp',
    name: 'default',
    bind: '7993',
    acceptors: 16,
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  [GatewayName.LwM2M]: {
    type: 'udp',
    name: 'default',
    bind: '5783',
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  [GatewayName.CoAP]: {
    type: 'udp',
    name: 'default',
    bind: '5683',
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  [GatewayName.MQTT_SN]: {
    type: 'udp',
    name: 'default',
    bind: '1884',
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  [GatewayName.STOMP]: {
    type: 'tcp',
    name: 'default',
    bind: '61613',
    acceptors: 16,
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  [GatewayName.GBT32960]: {
    type: 'tcp',
    name: 'default',
    bind: '7325',
    acceptors: 16,
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  [GatewayName.JT808]: {
    type: 'tcp',
    name: 'default',
    bind: '6207',
    acceptors: 16,
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  [GatewayName.OCPP]: {
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
  [GatewayName.NATS]: {
    type: 'tcp',
    name: 'default',
    bind: '4222',
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
const FormRef = ref()

const stepActive = ref(0)
const basicData = ref<GatewayData>({})
const listenerList = ref<Array<GatewayListener>>([])
const submitLoading = ref(false)

const gname = (route.params.name as string).toLowerCase() as GatewayName
const name = computed(() => gname)

const pageTitle = computed(() => `${tl('initial')} ${transGatewayName(name.value as GatewayName)}`)

const gotoList = () => router.push({ name: 'gateway' })

const createGateway = async () => {
  let data: Record<string, any> = {
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
    return FormRef.value?.validate()
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
