<template>
  <el-card>
    <!-- Config -->
    <div>
      <div class="section-header">{{ $t('Tools.connectionConfiguration') }}</div>
      <el-form
        ref="configForm"
        hide-required-asterisk
        label-position="top"
        :model="connection"
        :rules="connectionRules"
        @keyup.enter="createConnection"
        :disabled="compareConnStatus(WEB_SOCKET_STATUS.Connected)"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="host" :label="$t('Tools.host')">
              <el-input v-model="connection.host" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="port" :label="$t('Tools.port')">
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
            <el-form-item prop="username" :label="$t('Tools.Username')">
              <el-input v-model="connection.username" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="password" :label="$t('Tools.Password')">
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
            <el-form-item prop="sessionExpiryInterval" :label="$t('Tools.sessionExpiryInterval')">
              <el-input
                class="input-with-unit"
                v-model.number="connection.sessionExpiryInterval"
                :placeholder="$t('Tools.neverExpire')"
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
            <el-form-item prop="protocolversion" :label="$t('Tools.ProtocolVersion')">
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
            type="danger"
            plain
            @click="destroyConnection"
            :disabled="
              compareConnStatus(WEB_SOCKET_STATUS.Disconnecting) ||
              compareConnStatus(WEB_SOCKET_STATUS.Disconnected)
            "
          >
            {{ $t('Tools.disconnect') }}
          </el-button>
          <el-button
            type="primary"
            @click="createConnection"
            :disabled="!compareConnStatus(WEB_SOCKET_STATUS.Disconnected)"
          >
            {{ $t('Tools.connect') }}
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- Sub -->
    <div>
      <div class="section-header">{{ $t('Tools.Subscription') }}</div>
      <el-form
        ref="subForm"
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
              <!-- <emq-select
                v-model.number="subscriptionsRecord.qos"
                :field="{ list: QoSOptions }"
              /> -->
              <el-select v-model.number="subscriptionsRecord.qos">
                <el-option v-for="item in QoSOptions" :key="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="subscribe">
                {{ $t('Tools.Subscribe') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="subscriptions" max-height="400px">
        <el-table-column show-overflow-tooltip prop="topic" :label="$t('Base.topic')" />
        <el-table-column prop="qos" label="QoS" sortable />
        <el-table-column prop="createAt" :label="$t('Tools.time')" sortable />
        <el-table-column :label="$t('Base.operation')">
          <template #default="{ row }">
            <el-button
              size="small"
              type="danger"
              plain
              @click="unSubscribe(row)"
              :disabled="!compareConnStatus(WEB_SOCKET_STATUS.Connected)"
            >
              {{ $t('Base.cancel') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Pub -->
    <div>
      <div class="section-header">{{ $t('Tools.publish') }}</div>
      <el-form
        ref="pubForm"
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
                {{ $t('Tools.publish') }}
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
          {{ $t('Tools.received') }}
          <el-tooltip
            popper-class="info-tooltip"
            placement="top-start"
            :content="$t('Tools.clear')"
          >
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
          <el-table-column prop="createAt" min-width="90" :label="$t('Tools.time')" sortable />
        </el-table>
      </el-col>

      <el-col :span="12">
        <div class="message-btn">
          {{ $t('Tools.published') }}
          <el-tooltip
            popper-class="info-tooltip"
            placement="top-start"
            :content="$t('Tools.clear')"
          >
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
          <el-table-column prop="createAt" :label="$t('Tools.time')" min-width="90" sortable />
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import mqtt from 'mqtt'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { QoSOptions, WEB_SOCKET_STATUS } from '@/common/constants'
import { Delete } from '@element-plus/icons-vue'
import { chunkStr } from '@/common/tools.ts'
import { MQTT_V3_RES_CODES, MQTT_V5_RES_CODES } from '@/common/constants.ts'
import BooleanSelect from '@/components/BooleanSelect.vue'

const transBuffet2Hex = (buffer) => {
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('')
}

const MQTT_V3_VALUE = 4
const MQTT_V5_VALUE = 5

export default {
  name: 'WebSocketItem',
  components: {
    Delete,
    BooleanSelect,
  },
  props: {
    messageCount: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: 'New',
    },
  },

  data() {
    return {
      WEB_SOCKET_STATUS,
      QoSOptions,
      times: 0,
      cStatus: 0b00000,
      messageRecordRules: {
        topic: { required: true, message: this.$t('Tools.pleaseEnter') },
      },
      connectionRules: {
        host: { required: true },
        port: [
          {
            type: 'number',
            required: true,
            message: this.$t('Tools.pleaseEnter'),
          },
          {
            type: 'number',
            min: 1,
            max: 65535,
            message: this.$t('Tools.rangeError'),
          },
        ],
        keepalive: [
          {
            type: 'number',
            required: true,
            message: this.$t('Tools.pleaseEnter'),
          },
          {
            type: 'number',
            min: 0,
            message: this.$t('Tools.rangeError'),
          },
        ],
      },
      subscriptionsRules: {
        topic: [{ required: true, message: this.$t('Tools.pleaseEnter') }],
      },
      client: null,
      connection: {
        host: window.location.hostname,
        port: window.location.protocol === 'http:' ? 8083 : 8084,
        protocols: window.location.protocol === 'http:' ? 'ws' : 'wss',
        clientId: `emqx_${this.name}`,
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
      },
      messageRecord: {
        topic: 'testtopic/1',
        qos: 0,
        payload: '{ "msg": "hello" }',
        retain: false,
      },
      subscriptionsRecord: {
        topic: 'testtopic/#',
        qos: 0,
      },

      subscriptions: [],
      messageIn: [],
      messageOut: [],
      protocolVerList: [
        {
          name: '3.1.1',
          value: MQTT_V3_VALUE,
        },
        {
          name: '5',
          value: MQTT_V5_VALUE,
        },
      ],

      cStatusMap: new Map([
        [WEB_SOCKET_STATUS.Disconnected, 0b00001],
        [WEB_SOCKET_STATUS.Connecting, 0b00010],
        [WEB_SOCKET_STATUS.Connected, 0b00100],
        [WEB_SOCKET_STATUS.Disconnecting, 0b01000],
        [WEB_SOCKET_STATUS.Reconnecting, 0b10000],
      ]),
      leaveTime: 0,
      // cleared after 300 ms received
      lastReceivedMessage: [],
    }
  },
  computed: {
    connectUrl() {
      const { host, port, ssl, endpoint } = this.connection
      return `${ssl ? 'wss://' : 'ws://'}${host}:${port}${endpoint}`
    },
    isMQTTv5() {
      return this.connection.protocolversion === MQTT_V5_VALUE
    },
  },
  beforeUnmount() {
    this.destroyConnection()
    document.removeEventListener('visibilitychange', this.visibilityChangeFn)
  },
  created() {
    this.setConnStatus(WEB_SOCKET_STATUS.Disconnected, false)
    this.leaveTime = new Date().getTime()
  },
  mounted() {
    document.addEventListener('visibilitychange', this.visibilityChangeFn)
  },
  activated() {
    document.addEventListener('visibilitychange', this.visibilityChangeFn)
    let timeNow = new Date().getTime()
    let difference = 1000 * 60

    if (timeNow - this.leaveTime > difference) {
      this.reCheckConnStatus()
    }
  },
  deactivated() {
    document.removeEventListener('visibilitychange', this.visibilityChangeFn)
    this.leaveTime = new Date().getTime()
  },

  methods: {
    visibilityChangeFn() {
      if (document.visibilityState == 'visible') {
        this.reCheckConnStatus()
      }
    },
    reCheckConnStatus() {
      if (this.client?.connected) {
        this.setConnStatus(WEB_SOCKET_STATUS.Connected)
      } else if (this.client?.disconnected) {
        this.setConnStatus(WEB_SOCKET_STATUS.Disconnected)
      } else if (this.client?.reconnecting) {
        this.setConnStatus(WEB_SOCKET_STATUS.Reconnecting)
      } else if (this.client?.disconnecting) {
        this.setConnStatus(WEB_SOCKET_STATUS.Disconnecting)
      } else {
        this.setConnStatus(WEB_SOCKET_STATUS.Disconnected)
      }
    },
    compareConnStatus(destStatus) {
      let bVal = this.cStatusMap.get(destStatus)
      if (bVal) {
        return !(bVal ^ this.cStatus)
      } else {
        return !!destStatus
      }
    },
    setConnStatus(status, notify = true) {
      let sCode = this.cStatusMap.get(status)
      if (sCode) {
        if (sCode === this.cStatus) return
        this.cStatus = sCode
        notify && this.setNotify(status)
        return sCode
      } else {
        this.cStatus = status
        return status
      }
    },
    setNotify(status) {
      let label = String(status).substring(1).toLowerCase()
      let labelText = this.$t(`Tools.${label}`)
      const infoType = [WEB_SOCKET_STATUS.Connected, WEB_SOCKET_STATUS.Disconnected].includes(
        status,
      )
        ? 'success'
        : 'info'
      setTimeout(() => {
        this.$notify({
          title: labelText,
          message: this.$t('Tools.doing', { name: this.connection.clientId }) + labelText,
          duration: 6000,
          type: infoType,
        })
      })
    },
    addMessages(msg, content) {
      const messageLimit = 5000
      this[msg].unshift(content)
      if (this[msg].length > messageLimit) {
        this[msg].pop()
      }
    },
    getNow() {
      return moment().format('YYYY-MM-DD HH:mm:ss')
    },
    onMessage(topic, payload, packet = {}) {
      const message = {
        out: false,
        createAt: this.getNow(),
        topic,
        payload: payload.toString(),
        qos: packet.qos,
        retain: packet.retain,
      }
      this.addMessages('messageIn', message)
      let { messageCount } = this
      this.$emit('update:messageCount', (messageCount += 1))
    },
    destroyConnection() {
      if (this.client?.disconnected || this.client?.disconnecting) {
        return
      }
      if (!this.client?.end) {
        return
      }
      this.setConnStatus(WEB_SOCKET_STATUS.Disconnecting)
      try {
        this.client.end(true)
      } catch (e) {
        ElMessage.error(e.toString())
      }
    },
    unSubscribe(item) {
      if (!this.compareConnStatus(WEB_SOCKET_STATUS.Connected)) {
        ElMessage.error(this.$t('Tools.clientNotConnected'))
        return
      }
      this.client.unsubscribe(item.topic, (error) => {
        if (error) {
          return
        }
        this.subscriptions = this.subscriptions.filter(($) => $.topic !== item.topic)
      })
    },
    async subscribe() {
      await this.$refs.subForm.validate()
      if (!this.compareConnStatus(WEB_SOCKET_STATUS.Connected)) {
        ElMessage.error(this.$t('Tools.clientNotConnected'))
        return
      }
      const { topic, qos } = this.subscriptionsRecord
      this.client.subscribe(topic, { qos }, (err, res) => {
        // 是否超过最大订阅数
        let isMoreMaxSubs = false
        res.forEach((item) => {
          if (!QoSOptions.includes(item.qos)) {
            isMoreMaxSubs = true
          }
        })
        if (err || isMoreMaxSubs) {
          ElMessage.error(this.$t('Tools.subscriptionFailure'))
          return
        }
        const oldSub = this.subscriptions.find(($) => $.topic === topic)
        if (oldSub) {
          oldSub.qos = qos
          return
        }
        this.subscriptions.unshift({
          topic,
          qos,
          createAt: this.getNow(),
        })
      })
    },
    async publish() {
      const valid = await this.$refs.pubForm.validate()
      if (!valid) {
        return
      }
      if (!this.compareConnStatus(WEB_SOCKET_STATUS.Connected)) {
        ElMessage.error(this.$t('Tools.clientNotConnected'))
        return
      }
      const { topic, qos, payload, retain } = this.messageRecord
      this.client.publish(
        topic,
        payload,
        {
          qos,
          retain,
        },
        (err) => {
          if (err) {
            ElMessage.error(this.$t('Tools.publishingFailure'))
            return
          }
          const message = {
            out: true,
            createAt: this.getNow(),
            topic,
            payload,
            qos,
            retain,
          }
          this.addMessages('messageOut', message)
        },
      )
    },
    protocolsChange() {
      const { port, ssl } = this.connection
      if (!ssl && port === 8084) {
        this.connection.port = 8083
      } else if (ssl && port === 8083) {
        this.connection.port = 8084
      }
    },
    handleCleanChanged(val) {
      if (!this.isMQTTv5) {
        return
      }
      // default value for true is 0
      const { sessionExpiryInterval: interval } = this.connection
      if (val && (interval === undefined || interval === '')) {
        this.connection.sessionExpiryInterval = 0
      } else if (!val && interval === 0) {
        // default value for true is undefined (never expired)
        this.connection.sessionExpiryInterval = undefined
      }
    },
    /**
     * after connection, subscribe topics in subscribe table
     */
    subTopicsInTable() {
      const obj = this.subscriptions.reduce((obj, topicItem) => {
        const { topic, qos } = topicItem
        return { ...obj, [topic]: { qos } }
      }, {})
      this.client.subscribe(obj, (err) => {
        if (err) {
          ElMessage.error(this.$t('Tools.subscriptionFailure'))
          this.subscriptions = []
          return
        }
        this.subscriptions = this.subscriptions.map((topicItem) => {
          return { ...topicItem, createAt: this.getNow() }
        })
      })
    },
    getConnectionParams() {
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
      } = this.connection
      let sessionExpiryInterval = interval
      if (this.isMQTTv5 && (sessionExpiryInterval === '' || sessionExpiryInterval === undefined)) {
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
        will: will.topic ? will : undefined,
        protocolVersion: protocolversion,
        properties: {
          sessionExpiryInterval,
        },
      }
    },
    /**
     * Store messages for a while to handle possible errors
     */
    storeMessage(res) {
      const { data } = res
      this.lastReceivedMessage = data
      window.setTimeout(() => {
        this.lastReceivedMessage = undefined
      }, 200)
    },
    isTheLastMsgAnErrorMsg() {
      // the format like 2002 0004
      // the second part is error code (from back end)
      const hexStr = transBuffet2Hex(this.lastReceivedMessage)
      const strArr = chunkStr(hexStr)
      if (
        !strArr ||
        (Array.isArray(strArr) && strArr.length > 4) ||
        (strArr[1] && strArr[1].indexOf('00') !== 0)
      ) {
        return false
      }
      const errorCode = strArr[1].slice(2)
      const version = this.connection.protocolversion === MQTT_V3_VALUE ? 3 : 5
      const errorCodes = version === 3 ? MQTT_V3_RES_CODES : MQTT_V5_RES_CODES
      if (!errorCodes.includes(errorCode)) {
        return false
      }
      return errorCode
    },
    /**
     * There are two conditions for displaying errors in mqtt messages
     * 1. The last received data is a data containing error information
     * 2. The connection is closed within 200 ms of receiving data
     */
    showReceivedMessageAfterClose() {
      const errorCode = this.isTheLastMsgAnErrorMsg()
      if (!this.lastReceivedMessage || !errorCode) {
        return false
      }
      const version = this.connection.protocolversion === MQTT_V3_VALUE ? 3 : 5
      this.$notify({
        title: this.$t('Tools.errorOccurred'),
        message: this.$t(`MQTTRes.v${version}${errorCode}`),
        duration: 6000,
        type: 'error',
      })
      return true
    },
    async createConnection() {
      if (!this.compareConnStatus(WEB_SOCKET_STATUS.Disconnected)) {
        return
      }
      await this.$refs.configForm.validate()

      this.setConnStatus(WEB_SOCKET_STATUS.Connecting)
      this.times = 0
      this.client = mqtt.connect(this.connectUrl, {
        ...this.getConnectionParams(),
        reconnectPeriod: 0,
      })
      this.assignEvents()
    },
    assignEvents() {
      this.client.on('error', (error) => {
        ElMessage.error(error.toString())
        this.setConnStatus(WEB_SOCKET_STATUS.Disconnected)
      })
      this.client.on('reconnect', () => {
        // this.times += 1
        // console.log('reconn', this.times)
        // if (this.times > 2) {
        //   this.destroyConnection()
        //   ElMessage.error(this.$t('Tools.connectionDisconnected'))
        this.setConnStatus(WEB_SOCKET_STATUS.Reconnecting)
      })
      this.client.on('disconnect', () => {
        // console.log('discon')
        this.setConnStatus(WEB_SOCKET_STATUS.Disconnected)
      })
      this.client.on('close', () => {
        // console.log('close')
        const hasCustomErrorMsg = this.showReceivedMessageAfterClose()
        this.setConnStatus(WEB_SOCKET_STATUS.Disconnected, !hasCustomErrorMsg)
      })
      this.client.on('offline', () => {
        this.setConnStatus(WEB_SOCKET_STATUS.Disconnected)
        // console.log('offline')
      })
      this.client.on('connect', () => {
        this.setConnStatus(WEB_SOCKET_STATUS.Connected)
        if (this.subscriptions.length && this.connection.clean === true) {
          this.subTopicsInTable()
        }
      })
      this.client.on('message', this.onMessage)

      const { socket } = this.client.stream
      socket.addEventListener('message', this.storeMessage)
    },
  },
}
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
