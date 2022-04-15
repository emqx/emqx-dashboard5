<template>
  <div class="client-details app-wrapper">
    <div class="section-header" v-loading.lock="clientDetailLock">
      <div>
        <span>{{ clientId }}</span>
        <template v-if="doesTheClientExist">
          <el-tag type="info" size="small">
            <span v-if="record.connected == true">
              <el-icon color="#00b299ff">
                <SuccessFilled class="icon-status" />
              </el-icon>
              {{ $t('Clients.connected') }}
            </span>
            <span v-else>
              <el-icon color="#e34242ff">
                <Failed class="icon-status fail" />
              </el-icon>
              {{ $t('Clients.disconnected') }}
            </span>
          </el-tag>
          <el-tag type="info" size="small" v-if="record.proto_name">
            <span>{{ record.proto_name }}</span
            >&nbsp;
            <span v-if="record.proto_name === 'MQTT'">{{ mqttVersion[record.proto_ver] }}</span
            ><span v-else>{{ record.proto_ver }}</span>
          </el-tag>
        </template>
      </div>
      <div v-if="doesTheClientExist">
        <el-button v-if="record.connected" type="danger" @click="handleDisconnect">
          {{ $t('Clients.kickOut') }}
        </el-button>
        <el-button v-else type="danger" @click="handleDisconnect">
          {{ $t('Clients.cleanSession') }}
        </el-button>
      </div>
    </div>
    <template v-if="!clientDetailLock">
      <template v-if="doesTheClientExist">
        <el-card v-loading.lock="clientDetailLock">
          <div class="part-header">
            {{ $t('Clients.connectionInfo') }}
          </div>
          <el-row>
            <el-col v-for="item in clientDetailParts.connection" :key="item" :span="8">
              <div v-if="item == 'proto_type'" class="detail-item">
                <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
                <span
                  v-if="record.proto_name === 'MQTT'"
                  :title="record.proto_name + '&nbsp;' + mqttVersion[record.proto_ver]"
                  >{{ record.proto_name }} {{ mqttVersion[record.proto_ver] }}</span
                >
                <span v-else :title="record.proto_name + '&nbsp;' + record.proto_ver"
                  >{{ record.proto_name }} {{ record.proto_ver }}</span
                >
              </div>
              <div
                v-else-if="item == 'connected_at' || item == 'disconnected_at'"
                class="detail-item"
              >
                <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
                <span :title="record[item] && moment(record[item]).format('YYYY-MM-DD HH:mm:ss')">
                  {{ record[item] && moment(record[item]).format('YYYY-MM-DD HH:mm:ss') }}
                </span>
              </div>
              <div v-else-if="item == 'ip_address'" class="detail-item">
                <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
                <span :title="record.ip_address + ':' + record.port">{{
                  record.ip_address + ':' + record.port
                }}</span>
              </div>
              <div v-else class="detail-item">
                <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
                <span :title="record[item]">{{ record[item] }}</span>
              </div>
            </el-col>
          </el-row>

          <div class="part-header">
            {{ $t('Clients.sessionInfo') }}
          </div>
          <el-row>
            <el-col v-for="item in clientDetailParts.session" :key="item" :span="8">
              <div v-if="item == 'subscriptions'" class="detail-item">
                <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
                <span :title="record.subscriptions_cnt + '/' + record.subscriptions_max">
                  {{ record.subscriptions_cnt + '/' + record.subscriptions_max }}
                </span>
              </div>
              <div v-else-if="item == 'clean_start'" class="detail-item">
                <span :title="record.proto_ver === 5 ? 'Clean Start' : 'Clean Session'"
                  >{{ record.proto_ver === 5 ? 'Clean Start' : 'Clean Session' }}:</span
                >
                <span :title="record[item]">{{ record[item] }}</span>
              </div>
              <div v-else-if="item == 'mqueue'" class="detail-item">
                <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
                <span :title="record.mqueue_len + '/' + record.mqueue_max">{{
                  record.mqueue_len + '/' + record.mqueue_max
                }}</span>
              </div>
              <div v-else-if="item == 'inflight'" class="detail-item">
                <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
                <span :title="record.inflight_cnt + '/' + record.inflight_max">
                  {{ record.inflight_cnt + '/' + record.inflight_max }}
                </span>
              </div>
              <div v-else-if="item == 'created_at'" class="detail-item">
                <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
                <span :title="moment(record[item]).format('YYYY-MM-DD HH:mm:ss')">
                  {{ moment(record[item]).format('YYYY-MM-DD HH:mm:ss') }}
                </span>
              </div>
              <div v-else class="detail-item">
                <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
                <span :title="record[item]">{{ record[item] }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <div class="section-header">
          <div>
            {{ $t('Clients.currentSubscription') }}
          </div>
          <div>
            <el-button type="primary" :icon="Plus" @click="handlePreAdd">
              {{ $t('Clients.addASubscription') }}
            </el-button>
          </div>
        </div>
        <el-table :data="subscriptions" v-loading.lock="subsLockTable">
          <el-table-column
            prop="topic"
            show-overflow-tooltip
            label="Topic"
            sortable
          ></el-table-column>
          <el-table-column prop="qos" sortable min-width="110px" label="QoS"></el-table-column>
          <el-table-column :label="$t('Base.operation')">
            <template #default="{ row }">
              <el-button type="danger" size="small" @click="handleUnSubscription(row)">
                {{ $t('Clients.unsubscribe') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <create-subscribe
          v-model:visible="dialogVisible"
          :client-id="record.clientid"
          :gateway="gateway"
          @create:subs="loadSubs"
        >
        </create-subscribe>
      </template>
      <div class="client-does-not-exist" v-else>
        <el-icon><Warning /></el-icon>
        <span>{{ tl('clientDoesNotExist') }}</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, defineProps, ref, defineEmits } from 'vue'

export default defineComponent({
  name: 'ClientDetails',
})
</script>

<script lang="ts" setup>
import { loadClientDetail, loadSubscriptions, unsubscribe, disconnectClient } from '@/api/clients'
import CreateSubscribe from './components/CreateSubscribe.vue'
import moment from 'moment'
import {
  getGatewayClientDetail,
  getGatewayClientSubs,
  disconnGatewayClient,
  unsubscribeGatewayClientSub,
} from '@/api/gateway'
import { ElMessage, ElMessageBox } from 'element-plus'
import { SuccessFilled, Failed, Plus, Warning } from '@element-plus/icons-vue'
import { Client } from '@/types/client'
import { Subscription } from '@/types/subscription'
import { useRoute } from 'vue-router'
import useI18nTl from '@/hooks/useI18nTl'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  gateway: {
    type: String,
    required: false,
    default: '',
  },
  clientid: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits(['refreshGateway'])

const dialogVisible = ref(false)
const clientDetailLock = ref(true)
const subsLockTable = ref(true)
const doesTheClientExist = ref(true)
const record = ref<Partial<Client>>({})
const clientsOrganizied = {
  MQTT: {
    connection: [
      'node',
      'clientid',
      'username',
      'proto_type',
      'ip_address',
      'keepalive',
      'is_bridge',
      'connected_at',
      'disconnected_at',
      'zone',
      'recv_cnt',
      'recv_msg',
      'recv_oct',
      'recv_pkt',
    ],
    session: [
      'clean_start',
      'expiry_interval',
      'created_at',
      'subscriptions',
      'mqueue',
      'inflight',
      'heap_size',
      'reductions',
      'awaiting_rel_cnt',
      'awaiting_rel_max',
      'send_cnt',
      'send_msg',
      'send_oct',
      'send_pkt',
      'recv_msg.qos0',
      'recv_msg.qos1',
      'recv_msg.qos2',
      'recv_msg.dropped',
      'recv_msg.dropped.await_pubrel_timeout',
      'send_msg.qos0',
      'send_msg.qos1',
      'send_msg.qos2',
      'send_msg.dropped',
      'send_msg.dropped.expired',
      'send_msg.dropped.queue_full',
      'send_msg.dropped.too_large',
    ],
  },
  LWM2M: {
    connection: [
      'node',
      'endpoint_name',
      'lifetime',
      'clientid',
      'username',
      'proto_type',
      'ip_address',
      'connected_at',
      'disconnected_at',
      'recv_oct',
      'send_oct',
      'recv_cnt',
      'send_cnt',
      'recv_pkt',
      'send_lw_pkt',
    ],
    session: ['subscriptions', 'mqueue', 'inflight', 'heap_size', 'reductions'],
  },
  others: {
    connection: [
      'node',
      'clientid',
      'username',
      'proto_type',
      'ip_address',
      'keepalive',
      'connected_at',
      'disconnected_at',
      'recv_oct',
      'send_oct',
      'recv_cnt',
      'send_cnt',
      'recv_pkt',
      'send_pkt',
    ],
    session: ['subscriptions', 'mqueue', 'inflight', 'heap_size', 'reductions'],
  },
}
const mqttVersion = {
  3: 'v3.1',
  4: 'v3.1.1',
  5: 'v5.0',
}
const subscriptions = ref<Subscription[]>([])
const route = useRoute()
const { tl } = useI18nTl('Clients')
const { t } = useI18n()

const clientId = computed<string>((): string => {
  return (route.params.clientId as string) || (props.clientid as string)
})
const clientType = computed<'MQTT' | 'LWM2M' | 'others'>((): 'MQTT' | 'LWM2M' | 'others' => {
  const proto_name = String(record.value.proto_name)
  return proto_name.toUpperCase() as 'MQTT' | 'LWM2M' | 'others'
})
const clientDetailParts = computed(() => {
  let allParts = Object.keys(clientsOrganizied)
  if (Array.prototype.includes.call(allParts, clientType.value)) {
    return clientsOrganizied[clientType.value]
  }
  return clientsOrganizied.others
})

/**
 * snake and point to camel, demo: send_msg -> sendMsg; send_msg.qos1 -> sendMsgQos1
 */
const snake2pascal = (s: string) => {
  return String(s).replace(/((_|\.)[a-z])/g, (m) => m.substring(1).toUpperCase())
}
const handleDisconnect = async () => {
  if (record.value === null) return
  let warningMsg = tl('willDisconnectTheConnection')
  let successMsg = tl('successfulDisconnection')
  if (!record.value.connected) {
    warningMsg = tl('willCleanSession')
    successMsg = tl('successfulCleanSession')
  }
  ElMessageBox.confirm(warningMsg, {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
    .then(() => {
      if (props.gateway) {
        return handleDisconnectGateway()
      } else {
        if (record.value === null) return
        return disconnectClient(record.value.clientid as string)
      }
    })
    .then(() => {
      if (record.value === null) return
      record.value.connected = false
      ElMessage.success(successMsg)
    })
    .catch(() => {
      // ignore
    })
}

const handleDisconnectGateway = async () => {
  if (record.value === null) return
  let res = await disconnGatewayClient(props.gateway, record.value.clientid as string).catch(() => {
    // ignore
  })
  if (res) {
    emit('refreshGateway')
    return Promise.resolve()
  } else {
    return Promise.reject()
  }
}

const loadData = async () => {
  if (props.gateway) {
    return loadGatewayData()
  }
  clientDetailLock.value = true
  let res = await loadClientDetail(clientId.value).catch((error) => {
    if (error.response.status === 404) {
      doesTheClientExist.value = false
    }
  })
  if (res) {
    record.value = res
  } else {
    record.value = {}
  }
  clientDetailLock.value = false
}

const loadGatewayData = async () => {
  clientDetailLock.value = true
  let res = await getGatewayClientDetail(props.gateway, clientId.value).catch(() => {
    clientDetailLock.value = false
  })
  if (res) {
    record.value = res
  } else {
    record.value = {}
  }
  clientDetailLock.value = false
}

const handlePreAdd = () => {
  dialogVisible.value = true
}

const loadSubs = async () => {
  if (props.gateway) {
    return loadGatewaySubs()
  }
  subsLockTable.value = true
  let res = await loadSubscriptions(clientId.value).catch(() => {
    subsLockTable.value = false
  })
  if (res) {
    subscriptions.value = res
  } else {
    subscriptions.value = []
  }
  subsLockTable.value = false
}

const loadGatewaySubs = async () => {
  subsLockTable.value = true
  let res = await getGatewayClientSubs(props.gateway, clientId.value).catch(() => {
    subsLockTable.value = false
  })
  if (res) {
    subscriptions.value = res
  } else {
    subscriptions.value = []
  }
  subsLockTable.value = false
}

const handleUnSubscription = (row: Subscription) => {
  const title = tl('unsubscribeTitle')
  ElMessageBox.confirm(title, {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
    .then(async () => {
      if (props.gateway) {
        if (props.gateway === 'lwm2m' && !row.clientid) {
          row.clientid = clientId.value
        }
        return handleUnsubscriptionGateway(row)
      } else {
        const { clientid, topic } = row
        return unsubscribe(clientid, topic)
      }
    })
    .then(() => {
      loadSubs()
    })
    .catch(() => {
      // ignore
    })
}

const handleUnsubscriptionGateway = async (row: Subscription) => {
  const { clientid, topic } = row
  let res = await unsubscribeGatewayClientSub(props.gateway, clientid, topic)
  if (res) {
    ElMessage({
      type: 'success',
      message: t('Base.createSuccess'),
    })
    return Promise.resolve()
  } else {
    return Promise.reject()
  }
}

loadData()
loadSubs()
</script>

<style lang="scss" scoped>
.el-tag {
  margin-left: 10px;

  & i {
    margin-right: 3px;
  }
}

.detail-item {
  margin-top: 10px;
  color: #1d1d1dff;

  & span:first-child {
    color: #8d96a2ff;
    display: inline-block;
    width: 40%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
  & span:last-child {
    display: inline-block;
    vertical-align: middle;
    width: 55%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.section-header :deep(.el-loading-mask) {
  margin-left: 0px;
}

.client-does-not-exist {
  padding-top: 180px;
  text-align: center;
  color: #0000007f;
  i {
    margin-right: 8px;
  }
}
</style>
