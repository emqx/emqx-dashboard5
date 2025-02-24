<template>
  <el-card>
    <!-- Config -->
    <div>
      <div class="section-header">{{ tl('connectionConfiguration') }}</div>
      <el-form
        ref="ConfigFormCom"
        hide-required-asterisk
        label-position="top"
        :model="connection"
        :rules="connectionRules"
        @keyup.enter="createConnection"
        :disabled="compareConnStatus(WEB_SOCKET_STATUS.Connected)"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="host" :label="tl('host')">
              <el-input v-model="connection.host" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="port" :label="tl('port')">
              <el-input v-model.number="connection.port" placeholder="8083/8084" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="endpoint" label="Path">
              <el-input v-model="connection.endpoint" placeholder="/mqtt" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="clientId" :label="$t('Base.clientid')">
              <el-input v-model="connection.clientId" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="username" :label="tl('Username')">
              <el-input v-model="connection.username" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="password" :label="tl('Password')">
              <el-input v-model="connection.password" show-password autocomplete="one-time-code" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="keepalive" label="Keepalive">
              <el-input v-model.number="connection.keepalive" placeholder="60" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="clean" :label="isMQTTv5 ? 'Clean Start' : 'Clean Session'">
              <BooleanSelect v-model="connection.clean" @change="handleCleanChanged" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="isMQTTv5">
            <el-form-item prop="sessionExpiryInterval" :label="tl('sessionExpiryInterval')">
              <el-input
                class="input-with-unit"
                v-model.number="connection.sessionExpiryInterval"
                :placeholder="tl('neverExpire')"
              >
                <template #append>
                  <span class="single-unit"> s </span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="clean" label="TLS">
              <BooleanSelect v-model="connection.ssl" @change="protocolsChange" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="protocolversion" :label="tl('ProtocolVersion')">
              <el-select v-model="connection.protocolversion">
                <el-option
                  v-for="item in protocolVerList"
                  :key="item.name"
                  :label="`MQTT ${item.name}`"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24" class="footer-area">
          <el-button
            v-if="
              !compareConnStatus(WEB_SOCKET_STATUS.Connected) &&
              !compareConnStatus(WEB_SOCKET_STATUS.Disconnecting)
            "
            type="primary"
            @click="createConnection"
            :loading="
              compareConnStatus(WEB_SOCKET_STATUS.Connecting) ||
              compareConnStatus(WEB_SOCKET_STATUS.Reconnecting)
            "
          >
            {{ tl('connect') }}
          </el-button>
          <el-button
            v-else
            type="danger"
            plain
            @click="destroyConnection"
            :loading="compareConnStatus(WEB_SOCKET_STATUS.Disconnecting)"
          >
            {{ tl('disconnect') }}
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- Sub -->
    <div>
      <div class="section-header">{{ tl('Subscription') }}</div>
      <el-form
        ref="SubFormCom"
        hide-required-asterisk
        :model="subscriptionsRecord"
        :rules="subscriptionsRules"
        @keyup.enter="subscribe"
        class="sub-area"
        :disabled="!compareConnStatus(WEB_SOCKET_STATUS.Connected)"
        label-position="top"
      >
        <el-row :gutter="26" align="bottom">
          <el-col :span="6">
            <el-form-item prop="topic" :label="$t('Base.topic')">
              <el-input v-model="subscriptionsRecord.topic" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="qos" label="QoS">
              <el-select v-model.number="subscriptionsRecord.qos">
                <el-option v-for="item in QoSOptions" :key="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="subscribe">
                {{ tl('Subscribe') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="subscriptions" max-height="400px" class="shadow-none">
        <el-table-column show-overflow-tooltip prop="topic" :label="$t('Base.topic')" />
        <el-table-column prop="qos" label="QoS" sortable />
        <el-table-column prop="createAt" :label="tl('time')" sortable />
        <el-table-column :label="$t('Base.operation')">
          <template #default="{ row }">
            <TableButton
              type="danger"
              plain
              @click="unSubscribe(row)"
              :disabled="!compareConnStatus(WEB_SOCKET_STATUS.Connected)"
            >
              {{ $t('Base.cancel') }}
            </TableButton>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Pub -->
    <div>
      <div class="section-header">{{ tl('publish') }}</div>
      <el-form
        ref="PubFormCom"
        hide-required-asterisk
        label-position="top"
        :model="messageRecord"
        :rules="messageRecordRules"
        @keyup.enter="publish"
        class="pub-area"
        :disabled="!compareConnStatus(WEB_SOCKET_STATUS.Connected)"
      >
        <el-row :gutter="26" align="bottom">
          <el-col :span="6">
            <el-form-item prop="topic" :label="$t('Base.topic')">
              <el-input v-model="messageRecord.topic" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="payload" label="Payload">
              <el-input v-model="messageRecord.payload" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="qos" label="QoS">
              <el-select v-model.number="messageRecord.qos">
                <el-option v-for="item in QoSOptions" :key="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="with-btn">
              <el-checkbox v-model="messageRecord.retain"> Retain </el-checkbox>
              <el-button type="primary" @click="publish">
                {{ tl('publish') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- Data -->
    <el-row :gutter="26">
      <el-col :span="12">
        <div class="message-btn">
          {{ tl('received') }}
          <el-tooltip popper-class="info-tooltip" placement="top-start" :content="tl('clear')">
            <el-icon class="pointer icon-delete" @click="messageIn = []"><delete /></el-icon>
          </el-tooltip>
        </div>
        <el-table :data="messageIn" max-height="400px" class="shadow-none">
          <el-table-column show-overflow-tooltip prop="topic" :label="$t('Base.topic')" />
          <el-table-column prop="qos" label="QoS" sortable min-width="90">
            <template #default="{ row }">
              {{ row.qos }}
            </template>
          </el-table-column>
          <el-table-column min-width="60">
            <template #default="{ row }">
              {{ row.retain ? ' Retain' : '' }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="payload" label="Payload" min-width="120">
            <template #default="{ row }">
              <code>{{ row.payload }}</code>
            </template>
          </el-table-column>
          <el-table-column prop="createAt" min-width="90" :label="tl('time')" sortable />
        </el-table>
      </el-col>

      <el-col :span="12">
        <div class="message-btn">
          {{ tl('published') }}
          <el-tooltip popper-class="info-tooltip" placement="top-start" :content="tl('clear')">
            <el-icon class="pointer icon-delete" @click="messageOut = []">
              <delete />
            </el-icon>
          </el-tooltip>
        </div>
        <el-table :data="messageOut" max-height="400px" class="shadow-none">
          <el-table-column show-overflow-tooltip prop="topic" :label="$t('Base.topic')" />
          <el-table-column prop="qos" label="QoS" sortable min-width="90">
            <template #default="{ row }">
              {{ row.qos }}
            </template>
          </el-table-column>
          <el-table-column min-width="60">
            <template #default="{ row }">
              {{ row.retain ? ' Retain' : '' }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="payload" label="Payload" min-width="120">
            <template #default="{ row }">
              <code>{{ row.payload }}</code>
            </template>
          </el-table-column>
          <el-table-column prop="createAt" :label="tl('time')" min-width="90" sortable />
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts" setup>
import {
  INVALID_PUB_TOPIC_REG,
  INVALID_SUB_TOPIC_REG,
  MQTT_V3_RES_CODES,
  MQTT_V5_RES_CODES,
  QoSOptions,
  SPECIAL_INVALID_SUB_TOPIC_REG,
  WEB_SOCKET_STATUS,
} from '@/common/constants'
import { Delete } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { FormRules } from 'element-plus'
import type { IClientOptions, IClientSubscribeOptions, IPublishPacket, MqttClient } from 'mqtt'
import mqtt from 'mqtt'

interface Subscription {
  topic: string
  qos: mqtt.QoS
  createAt: string
}

interface Message {
  out: boolean
  createAt: string
  topic: string
  payload: string
  qos: mqtt.QoS
  retain: boolean
}

interface MessageRecord {
  topic: string
  qos: mqtt.QoS
  payload: string
  retain: boolean
}

type ConnectionRecord = IClientOptions & {
  ssl: boolean
  protocolversion: number
  endpoint: string
  sessionExpiryInterval: number | string | undefined
}

type Status = (typeof WEB_SOCKET_STATUS)[keyof typeof WEB_SOCKET_STATUS]

const transBuffet2Hex = (buffer: ArrayBuffer) => {
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('')
}

const MQTT_V3_VALUE = 4
const MQTT_V5_VALUE = 5

const props = defineProps({
  messageCount: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: 'New',
  },
})

const emit = defineEmits(['update:messageCount'])

const { t, tl } = useI18nTl('Tools')

const times = ref(0)
const cStatus = ref<number | Status>(0b00000)
const { createRequiredRule, createIntFieldRule } = useFormRules()
const messageRecordRules = reactive({
  topic: [
    ...createRequiredRule(t('Base.topic')),
    {
      validator(rules, value, cb) {
        const isInvalid = INVALID_PUB_TOPIC_REG.test(value)
        cb(isInvalid ? new Error(t('Tools.invalidPubTopic')) : undefined)
      },
      trigger: ['blur'],
    },
  ],
})
const connectionRules = reactive<FormRules>({
  host: { required: true },
  port: [...createRequiredRule(t('Clients.port')), ...createIntFieldRule(1, 65535)],
  keepalive: [
    {
      type: 'number',
      required: true,
      message: tl('pleaseEnter'),
    },
    {
      type: 'number',
      min: 0,
      message: tl('rangeError'),
    },
  ],
})
const subscriptionsRules = reactive({
  topic: [
    ...createRequiredRule(t('Base.topic')),
    {
      validator(rules, value, cb) {
        const isInvalid =
          INVALID_SUB_TOPIC_REG.test(value) || SPECIAL_INVALID_SUB_TOPIC_REG.test(value)
        cb(isInvalid ? new Error(t('Tools.invalidPubTopic')) : undefined)
      },
      trigger: ['blur'],
    },
  ],
})
const client = ref<MqttClient | null>(null)
const connection = reactive<ConnectionRecord>({
  host: window.location.hostname,
  port: window.location.protocol === 'http:' ? 8083 : 8084,
  clientId: `emqx_${props.name}`,
  ssl: window.location.protocol === 'https:',
  protocolversion: MQTT_V5_VALUE,
  endpoint: '/mqtt',
  username: '',
  password: '',
  keepalive: 60,
  clean: true,
  sessionExpiryInterval: 0,
  connectTimeout: 5000,
  will: {
    topic: '',
    payload: '',
    qos: 0,
    retain: false,
  },
})
const messageRecord = reactive<MessageRecord>({
  topic: 'testtopic/1',
  qos: 0,
  payload: '{ "msg": "hello" }',
  retain: false,
})
const subscriptionsRecord = reactive<IClientSubscribeOptions & { topic: string }>({
  topic: 'testtopic/#',
  qos: 0,
})

const subscriptions = ref<Array<Subscription>>([])
const messageIn = ref<Array<Message>>([])
const messageOut = ref<Array<Message>>([])
const protocolVerList = ref([
  {
    name: '3.1.1',
    value: MQTT_V3_VALUE,
  },
  {
    name: '5',
    value: MQTT_V5_VALUE,
  },
])

const cStatusMap = new Map([
  [WEB_SOCKET_STATUS.Disconnected, 0b00001],
  [WEB_SOCKET_STATUS.Connecting, 0b00010],
  [WEB_SOCKET_STATUS.Connected, 0b00100],
  [WEB_SOCKET_STATUS.Disconnecting, 0b01000],
  [WEB_SOCKET_STATUS.Reconnecting, 0b10000],
])
const leaveTime = ref(0)
// cleared after 300 ms received
const lastReceivedMessage = ref<ArrayBuffer | undefined>(new ArrayBuffer(0))

const connectUrl = computed(() => {
  const { host, port, ssl, endpoint } = connection
  return `${ssl ? 'wss://' : 'ws://'}${host}:${port}${endpoint}`
})

const isMQTTv5 = computed(() => connection.protocolversion === MQTT_V5_VALUE)

const visibilityChangeFn = () => {
  if (document.visibilityState == 'visible') {
    reCheckConnStatus()
  }
}

const reCheckConnStatus = () => {
  if (client.value?.connected) {
    setConnStatus(WEB_SOCKET_STATUS.Connected)
  } else if (client.value?.disconnected) {
    setConnStatus(WEB_SOCKET_STATUS.Disconnected)
  } else if (client.value?.reconnecting) {
    setConnStatus(WEB_SOCKET_STATUS.Reconnecting)
  } else if (client.value?.disconnecting) {
    setConnStatus(WEB_SOCKET_STATUS.Disconnecting)
  } else {
    setConnStatus(WEB_SOCKET_STATUS.Disconnected)
  }
}

const compareConnStatus = (destStatus: string) => {
  const bVal = cStatusMap.get(destStatus)
  if (bVal) {
    return !(bVal ^ (cStatus.value as any))
  } else {
    return !!destStatus
  }
}

const setConnStatus = (status: Status, notify = true) => {
  const sCode = cStatusMap.get(status)
  if (sCode) {
    if (sCode === cStatus.value) return
    cStatus.value = sCode
    notify && setNotify(status)
    return sCode
  } else {
    cStatus.value = status
    return status
  }
}

const setNotify = (status: Status) => {
  const label = String(status).substring(1).toLowerCase()
  const labelText = t(`Tools.${label}`)
  const infoType = [WEB_SOCKET_STATUS.Connected, WEB_SOCKET_STATUS.Disconnected].includes(status)
    ? 'success'
    : 'info'
  setTimeout(() => {
    ElNotification({
      title: labelText,
      message: tl('doing', { name: connection.clientId ?? '' }) + labelText,
      duration: 3000,
      type: infoType,
    })
  })
}

const addMessages = (msg: typeof messageIn | typeof messageOut, content: Message) => {
  const messageLimit = 5000
  msg.value.unshift(content)
  if (msg.value.length > messageLimit) {
    msg.value.pop()
  }
}

const getNow = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

const onMessage = (
  topic: string,
  payload: Buffer,
  packet: IPublishPacket = {} as IPublishPacket,
) => {
  const message = {
    out: false,
    createAt: getNow(),
    topic,
    payload: payload.toString(),
    qos: packet.qos,
    retain: packet.retain,
  }
  addMessages(messageIn, message)
  let { messageCount } = props
  emit('update:messageCount', (messageCount += 1))
}

const destroyConnection = () => {
  if (client.value?.disconnected || client.value?.disconnecting) {
    return
  }
  if (!client.value?.end) {
    return
  }
  setConnStatus(WEB_SOCKET_STATUS.Disconnecting)
  try {
    client.value.end(true)
  } catch (e: any) {
    ElMessage.error(e.toString())
  }
}

const unSubscribe = (item: Subscription) => {
  if (!compareConnStatus(WEB_SOCKET_STATUS.Connected)) {
    ElMessage.error(tl('clientNotConnected'))
    return
  }
  client.value?.unsubscribe(item.topic, (error: any) => {
    if (error) {
      return
    }
    subscriptions.value = subscriptions.value.filter(($) => $.topic !== item.topic)
  })
}

const SubFormCom = ref()
const subscribe = async () => {
  await SubFormCom.value.validate()
  if (!compareConnStatus(WEB_SOCKET_STATUS.Connected)) {
    ElMessage.error(tl('clientNotConnected'))
    return
  }
  const { topic, qos } = subscriptionsRecord
  client.value?.subscribe(topic, { qos }, (err, res) => {
    let isMoreMaxSubs = false
    res.forEach((item) => {
      if (!QoSOptions.includes(item.qos)) {
        isMoreMaxSubs = true
      }
    })
    if (err || isMoreMaxSubs) {
      ElMessage.error(tl('subscriptionFailure'))
      return
    }
    const oldSub = subscriptions.value.find(($) => $.topic === topic)
    if (oldSub) {
      oldSub.qos = qos
      return
    }
    subscriptions.value.unshift({
      topic,
      qos,
      createAt: getNow(),
    })
  })
}

const PubFormCom = ref()
const publish = async () => {
  const valid = await PubFormCom.value.validate()
  if (!valid) {
    return
  }
  if (!compareConnStatus(WEB_SOCKET_STATUS.Connected)) {
    ElMessage.error(tl('clientNotConnected'))
    return
  }
  const { topic, qos, payload, retain } = messageRecord
  client.value?.publish(
    topic,
    payload,
    {
      qos,
      retain,
    },
    (err) => {
      if (err) {
        ElMessage.error(tl('publishingFailure'))
        return
      }
      const message = {
        out: true,
        createAt: getNow(),
        topic,
        payload,
        qos,
        retain,
      }
      addMessages(messageOut, message)
    },
  )
}

const protocolsChange = () => {
  const { port, ssl } = connection
  if (!ssl && port === 8084) {
    connection.port = 8083
  } else if (ssl && port === 8083) {
    connection.port = 8084
  }
}

const handleCleanChanged = (val: boolean) => {
  if (!isMQTTv5.value) {
    return
  }
  // default value for true is 0
  const { sessionExpiryInterval: interval } = connection
  if (val && (interval === undefined || interval === '')) {
    connection.sessionExpiryInterval = 0
  } else if (!val && interval === 0) {
    connection.sessionExpiryInterval = undefined
  }
}

const subTopicsInTable = () => {
  const obj = subscriptions.value.reduce((obj, topicItem) => {
    const { topic, qos } = topicItem
    return { ...obj, [topic]: { qos } }
  }, {})
  client.value?.subscribe(obj, (err) => {
    if (err) {
      ElMessage.error(tl('subscriptionFailure'))
      subscriptions.value = []
      return
    }
    subscriptions.value = subscriptions.value.map((topicItem) => {
      return { ...topicItem, createAt: getNow() }
    })
  })
}

const getConnectionParams = () => {
  const {
    clientId,
    username,
    port,
    password,
    keepalive,
    clean,
    connectTimeout,
    will,
    protocolversion,
    sessionExpiryInterval: interval,
  } = connection
  let sessionExpiryInterval = interval
  if (isMQTTv5.value && (sessionExpiryInterval === '' || sessionExpiryInterval === undefined)) {
    sessionExpiryInterval = parseInt('0xFFFFFFFF', 16)
  }
  return {
    clientId,
    username,
    port,
    password,
    keepalive,
    clean,
    connectTimeout,
    will: will?.topic ? will : undefined,
    protocolVersion: protocolversion,
    properties: {
      sessionExpiryInterval,
    },
  } as IClientOptions
}

/**
 * Store messages for a while to handle possible errors
 */
const storeMessage = (res: MessageEvent) => {
  const { data } = res
  lastReceivedMessage.value = data
  window.setTimeout(() => {
    lastReceivedMessage.value = undefined
  }, 200)
}

const isTheLastMsgAnErrorMsg = () => {
  // the format like 2002 0004
  // the second part is error code (from back end)
  const hexStr = transBuffet2Hex(lastReceivedMessage.value ?? new ArrayBuffer(0))
  const strArr = chunkStr(hexStr)
  if (
    !strArr ||
    (Array.isArray(strArr) && strArr.length > 4) ||
    (strArr[1] && strArr[1].indexOf('00') !== 0)
  ) {
    return false
  }
  const errorCode = strArr[1].slice(2)
  const version = connection.protocolversion === MQTT_V3_VALUE ? 3 : 5
  const errorCodes = version === 3 ? MQTT_V3_RES_CODES : MQTT_V5_RES_CODES
  if (!errorCodes.includes(errorCode)) {
    return false
  }
  return errorCode
}

/**
 * There are two conditions for displaying errors in mqtt messages
 * 1. The last received data is a data containing error information
 * 2. The connection is closed within 200 ms of receiving data
 */
const showReceivedMessageAfterClose = () => {
  const errorCode = isTheLastMsgAnErrorMsg()
  if (!lastReceivedMessage.value || !errorCode) {
    return false
  }
  const version = connection.protocolversion === MQTT_V3_VALUE ? 3 : 5
  ElNotification({
    title: tl('errorOccurred'),
    message: t(`MQTTRes.v${version}${errorCode}`),
    duration: 3000,
    type: 'error',
  })
  return true
}

const ConfigFormCom = ref()
const createConnection = async () => {
  if (!compareConnStatus(WEB_SOCKET_STATUS.Disconnected)) {
    return
  }
  await ConfigFormCom.value.validate()

  setConnStatus(WEB_SOCKET_STATUS.Connecting, false)
  times.value = 0
  client.value = mqtt.connect(connectUrl.value, {
    ...getConnectionParams(),
    reconnectPeriod: 0,
  })
  assignEvents()
}

const assignEvents = () => {
  client.value?.on('error', (error) => {
    ElMessage.error(error.toString())
    setConnStatus(WEB_SOCKET_STATUS.Disconnected)
  })
  client.value?.on('reconnect', () => {
    setConnStatus(WEB_SOCKET_STATUS.Reconnecting)
  })
  client.value?.on('disconnect', () => {
    setConnStatus(WEB_SOCKET_STATUS.Disconnected)
  })
  client.value?.on('close', () => {
    const hasCustomErrorMsg = showReceivedMessageAfterClose()
    setConnStatus(WEB_SOCKET_STATUS.Disconnected, !hasCustomErrorMsg)
  })
  client.value?.on('offline', () => {
    setConnStatus(WEB_SOCKET_STATUS.Disconnected)
  })
  client.value?.on('connect', () => {
    setConnStatus(WEB_SOCKET_STATUS.Connected)
    if (subscriptions.value.length && connection.clean === true) {
      subTopicsInTable()
    }
  })
  client.value?.on('message', onMessage)

  const { socket } = (client.value as any).stream
  socket.addEventListener('message', storeMessage)
}

;(() => {
  setConnStatus(WEB_SOCKET_STATUS.Disconnected, false)
  leaveTime.value = new Date().getTime()
})()

onMounted(() => {
  document.addEventListener('visibilitychange', visibilityChangeFn)
})

onBeforeUnmount(() => {
  destroyConnection()
  document.removeEventListener('visibilitychange', visibilityChangeFn)
})

onActivated(() => {
  document.addEventListener('visibilitychange', visibilityChangeFn)
  const timeNow = new Date().getTime()
  const difference = 1000 * 60

  if (timeNow - leaveTime.value > difference) {
    reCheckConnStatus()
  }
})

onDeactivated(() => {
  document.removeEventListener('visibilitychange', visibilityChangeFn)
  leaveTime.value = new Date().getTime()
})
</script>

<style lang="scss" scoped>
.pub-area .el-form-item {
  .el-checkbox {
    margin-right: 24px;
  }
}

.footer-area {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.message-btn {
  display: flex;
  align-items: center;
  margin: 10px auto;
  font-size: 16px;
  font-weight: 700;
  .icon-delete {
    margin-left: 8px;
  }
}
</style>
