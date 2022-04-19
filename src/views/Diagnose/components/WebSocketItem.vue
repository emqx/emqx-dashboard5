<template>
  <el-card>
    <div class="section-header">
      {{ $t('Tools.connectionConfiguration') }}
    </div>

    <el-form
      ref="configForm"
      hide-required-asterisk
      label-position="top"
      :model="connection"
      :rules="connectionRules"
      @keyup.enter="createConnection"
      :disabled="compareConnStatus('MCONNECTED')"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item prop="host" :label="$t('Tools.host')">
            <el-input v-model="connection.host"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="port" :label="$t('Tools.port')">
            <el-input v-model.number="connection.port" placeholder="8083/8084"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="endpoint" :label="$t('Tools.mountPoint')">
            <el-input v-model="connection.endpoint" placeholder="/mqtt"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="clientId" label="Client ID">
            <el-input v-model="connection.clientId"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="username" :label="$t('Tools.Username')">
            <el-input v-model="connection.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="password" :label="$t('Tools.Password')">
            <el-input v-model="connection.password" show-password></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="keepalive" label="Keepalive">
            <el-input v-model.number="connection.keepalive" placeholder="60"></el-input>
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
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8" class="checkbox-area">
          <div class="checkbox-container">
            <el-checkbox v-model="connection.clean"> Clean Session </el-checkbox>
            <el-checkbox v-model="connection.ssl" @change="protocolsChange"> TLS </el-checkbox>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24" class="footer-area">
        <el-button
          type="primary"
          @click="createConnection"
          :disabled="!compareConnStatus('MDISCONNECTED')"
        >
          {{ $t('Tools.connect') }}
        </el-button>

        <el-button
          type="danger"
          plain
          @click="destroyConnection"
          :disabled="compareConnStatus('MDISCONNECTING') || compareConnStatus('MDISCONNECTED')"
        >
          {{ $t('Tools.disconnect') }}
        </el-button>
      </el-col>
    </el-row>

    <div class="section-header">
      {{ $t('Tools.Subscription') }}
    </div>

    <el-form
      ref="subForm"
      hide-required-asterisk
      :model="subscriptionsRecord"
      :rules="subscriptionsRules"
      @keyup.enter="subscribe"
      class="sub-area"
      :disabled="!compareConnStatus('MCONNECTED')"
    >
      <el-form-item prop="topic" label="Topic">
        <el-input v-model="subscriptionsRecord.topic"></el-input>
      </el-form-item>

      <el-form-item prop="qos" label="QoS">
        <!-- <emq-select
          v-model.number="subscriptionsRecord.qos"
          :field="{ list: QoSOptions }"
        ></emq-select> -->
        <el-select v-model.number="subscriptionsRecord.qos">
          <el-option v-for="item in QoSOptions" :key="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="subscribe">
          {{ $t('Tools.Subscribe') }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="subscriptions" max-height="400px">
      <el-table-column show-overflow-tooltip prop="topic" label="Topic" sortable></el-table-column>
      <el-table-column prop="qos" label="QoS" sortable></el-table-column>
      <el-table-column prop="createAt" :label="$t('Tools.time')" sortable></el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button
            size="small"
            type="danger"
            plain
            @click="unSubscribe(row)"
            :disabled="!compareConnStatus('MCONNECTED')"
          >
            {{ $t('Base.cancel') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="section-header">
      {{ $t('Tools.publish') }}
    </div>

    <el-form
      ref="pubForm"
      hide-required-asterisk
      label-position="top"
      :model="messageRecord"
      :rules="messageRecordRules"
      @keyup.enter="publish"
      class="pub-area"
      :disabled="!compareConnStatus('MCONNECTED')"
    >
      <el-form-item prop="topic" label="Topic">
        <el-input v-model="messageRecord.topic"></el-input>
      </el-form-item>

      <el-form-item prop="payload" label="Payload">
        <el-input v-model="messageRecord.payload"></el-input>
      </el-form-item>

      <el-form-item prop="qos" label="QoS">
        <el-select v-model.number="messageRecord.qos">
          <el-option v-for="item in QoSOptions" :key="item" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="with-btn">
        <el-checkbox v-model="messageRecord.retain"> Retain </el-checkbox>
        <el-button type="primary" @click="publish">
          {{ $t('Tools.publish') }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="20">
      <el-col :span="12">
        <div class="message-btn">
          {{ $t('Tools.received') }}
          <el-icon><delete /></el-icon>
        </div>
        <el-table :data="messageIn" max-height="400px">
          <el-table-column
            show-overflow-tooltip
            prop="topic"
            label="Topic"
            sortable
          ></el-table-column>
          <el-table-column prop="qos" label="QoS" sortable min-width="50">
            <template #default="{ row }">
              {{ row.qos }}
            </template>
          </el-table-column>
          <el-table-column min-width="60">
            <template #default="{ row }">
              {{ row.retain ? ' Retain' : '' }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="payload"
            label="Payload"
            sortable
            min-width="120"
          >
            <template #default="{ row }">
              <code>{{ row.payload }}</code>
            </template>
          </el-table-column>
          <el-table-column prop="createAt" :label="$t('Tools.time')" sortable></el-table-column>
        </el-table>
      </el-col>

      <el-col :span="12">
        <div class="message-btn">
          {{ $t('Tools.published') }}
          <el-icon><delete /></el-icon>
        </div>
        <el-table :data="messageOut" max-height="400px">
          <el-table-column
            show-overflow-tooltip
            prop="topic"
            label="Topic"
            sortable
          ></el-table-column>
          <el-table-column prop="qos" label="QoS" sortable min-width="50">
            <template #default="{ row }">
              {{ row.qos }}
            </template>
          </el-table-column>
          <el-table-column min-width="60">
            <template #default="{ row }">
              {{ row.retain ? ' Retain' : '' }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="payload"
            label="Payload"
            sortable
            min-width="120"
          >
            <template #default="{ row }">
              <code>{{ row.payload }}</code>
            </template>
          </el-table-column>
          <el-table-column prop="createAt" :label="$t('Tools.time')" sortable></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import mqtt from 'mqtt'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { QoSOptions } from '@/common/constants'
import { Delete } from '@element-plus/icons-vue'

export default {
  name: 'WebSocketItem',
  components: {
    Delete,
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
        protocolversion: 4,
        endpoint: '/mqtt',
        username: '',
        password: '',
        keepalive: 60,
        clean: true,
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
          value: 4,
        },
        {
          name: '5',
          value: 5,
        },
      ],
      cStatusMap: new Map([
        ['MDISCONNECTED', 0b00001],
        ['MCONNECTING', 0b00010],
        ['MCONNECTED', 0b00100],
        ['MDISCONNECTING', 0b01000],
        ['MRECONNECTING', 0b10000],
      ]),
      leaveTime: 0,
    }
  },
  computed: {
    connectUrl() {
      const { host, port, ssl, endpoint } = this.connection
      return `${ssl ? 'wss://' : 'ws://'}${host}:${port}${endpoint}`
    },
  },
  beforeUnmount() {
    this.destroyConnection()
    document.removeEventListener('visibilitychange', this.visibilityChangeFn)
  },
  created() {
    this.setConnStatus('MDISCONNECTED', false)
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
        this.setConnStatus('MCONNECTED')
      } else if (this.client?.disconnected) {
        this.setConnStatus('MDISCONNECTED')
      } else if (this.client?.reconnecting) {
        this.setConnStatus('MRECONNECTING')
      } else if (this.client?.disconnecting) {
        this.setConnStatus('MDISCONNECTING')
      } else {
        this.setConnStatus('MDISCONNECTED')
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
    setNotify(status, custom = false) {
      let label = String(status).substring(1).toLowerCase()
      let labelText = this.$t(`Tools.${label}`)
      setTimeout(() => {
        this.$notify({
          title: labelText,
          message: this.$t('Tools.doing', { name: this.connection.clientId }) + labelText,
          duration: 6000,
          type: 'info',
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
      this.setConnStatus('MDISCONNECTING')
      try {
        this.client.end(true)
      } catch (e) {
        ElMessage.error(e.toString())
      }
    },
    unSubscribe(item) {
      if (!this.compareConnStatus('MCONNECTED')) {
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
      const valid = await this.$refs.subForm.validate()
      if (!valid) {
        return
      }
      if (!this.compareConnStatus('MCONNECTED')) {
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
        if (this.subscriptions.find(($) => $.topic === topic)) {
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
      if (!this.compareConnStatus('MCONNECTED')) {
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
    createConnection() {
      if (!this.compareConnStatus('DISCONNECTED')) {
        return
      }
      this.$refs.configForm.validate((valid) => {
        if (!valid) {
          return
        }
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
        } = this.connection

        this.setConnStatus('MCONNECTING')
        this.times = 0
        this.client = mqtt.connect(this.connectUrl, {
          port,
          clientId,
          username,
          password,
          keepalive,
          clean,
          connectTimeout,
          protocolVersion: protocolversion,
          will: will.topic ? will : undefined,
          reconnectPeriod: 0,
        })

        this.assignEvents()
      })
    },
    assignEvents() {
      this.client.on('error', (error) => {
        ElMessage.error(error.toString())
        this.setConnStatus('MDISCONNECTED')
      })
      this.client.on('reconnect', () => {
        // this.times += 1
        // console.log('reconn', this.times)
        // if (this.times > 2) {
        //   this.destroyConnection()
        //   ElMessage.error(this.$t('Tools.connectionDisconnected'))
        this.setConnStatus('MRECONNECTING')
      })
      this.client.on('disconnect', () => {
        // console.log('discon')
        this.setConnStatus('MDISCONNECTED')
      })
      this.client.on('close', () => {
        // console.log('close')
        this.setConnStatus('MDISCONNECTED')
      })
      this.client.on('offline', () => {
        this.setConnStatus('MDISCONNECTED')
        // console.log('offline')
      })
      this.client.on('connect', () => {
        this.setConnStatus('MCONNECTED')
      })
      this.client.on('message', this.onMessage)
    },
  },
}
</script>

<style lang="scss" scoped>
.sub-area .el-form-item {
  display: inline-block;
  width: 30%;
  padding-right: 3%;
}
.pub-area .el-form-item {
  display: inline-block;
  width: 24%;
  padding-right: 1%;

  &.with-btn :deep(.el-form-item__content) {
    justify-content: space-between;
  }
}

.footer-area {
  margin-top: 20px;
}
.checkbox-area {
  padding-top: 16px;
  padding-left: 30px;
  .checkbox-container {
    display: flex;
    align-items: center;
    height: 100%;
  }
}

.message-btn {
  margin: 10px auto;
  font-size: 16px;
  font-weight: 700;
}
</style>
