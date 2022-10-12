<template>
  <div class="client-details app-wrapper">
    <div class="block-header">
      <detail-header
        :item="{
          name: clientId,
          path: '/connections',
          backFunc: gateway
            ? () => {
                emit('refreshGateway')
              }
            : undefined,
        }"
      >
        <template #content>
          <el-tooltip :content="clientId">
            <p class="header-content">{{ clientId }} ({{ tl('clientId') }})</p>
          </el-tooltip>
        </template>
      </detail-header>
      <div class="actions">
        <el-button type="primary" :icon="Refresh" @click="loadData">
          {{ $t('Base.refresh') }}
        </el-button>
        <el-button
          v-if="doesTheClientExist"
          type="danger"
          :icon="SwitchButton"
          plain
          @click="handleDisconnect"
        >
          {{ record.connected ? tl('kickOut') : tl('cleanSession') }}
        </el-button>
      </div>
    </div>
    <template v-if="doesTheClientExist">
      <el-row :gutter="26" class="client-row block">
        <el-col :span="12">
          <el-card class="top-border client-info" v-loading="clientDetailLock">
            <el-descriptions :title="tl('connectionInfo')" border :column="1" size="large">
              <el-descriptions-item :label="tl('connectedStatus')">
                <el-tag type="info">
                  <CheckIcon :status="record.connected ? 'check' : 'close'" size="small" />
                  {{ record.connected ? tl('connected') : tl('disconnected') }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item
                v-for="item in clientDetailParts.connection"
                :key="item"
                :label="getLabel(item)"
              >
                <span v-if="item == 'proto_type'">
                  <el-tag type="info">
                    <span>{{ record.proto_name }}</span>
                    &nbsp;
                    <span v-if="record.proto_name === 'MQTT'">
                      {{ mqttVersion[record.proto_ver] }}
                    </span>
                    <span v-else>{{ record.proto_ver }}</span>
                  </el-tag>
                </span>
                <span v-else-if="item == 'connected_at' || item == 'disconnected_at'">
                  <span>
                    {{ record[item] && moment(record[item]).format('YYYY-MM-DD HH:mm:ss') }}
                  </span>
                </span>
                <span v-else-if="item == 'ip_address'">
                  <span>{{ record.ip_address + ':' + record.port }}</span>
                </span>
                <span v-else>
                  <span class="keep-spaces">{{ record[item] }}</span>
                </span>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="top-border client-session" v-loading="clientDetailLock">
            <span class="stats-tip">({{ $t('Base.current') }} / {{ $t('Base.max') }})</span>
            <el-descriptions :title="tl('sessionInfo')" border :column="1" size="large">
              <el-descriptions-item
                v-for="item in clientDetailParts.session"
                :key="item"
                :label="getLabel(item)"
              >
                <div>
                  <span>{{ getSessionInfoItem(item) }}</span>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
      <h2>
        {{ $t('components.metrics') }}
      </h2>
      <el-row class="block client-metrics" :gutter="26">
        <el-col :span="12">
          <el-card class="top-border table-card bytes" v-loading="clientDetailLock">
            <el-table :data="filterMetrics(clientDetailParts.bytes)">
              <el-table-column prop="label" min-width="140" :label="tl('bytes')" />
              <el-table-column prop="value" sortable class-name="sortable-without-header-text" />
            </el-table>
          </el-card>
          <el-card class="top-border table-card packets" v-loading="clientDetailLock">
            <el-table :data="filterMetrics(clientDetailParts.packets)">
              <el-table-column prop="label" min-width="140" :label="tl('packets')" />
              <el-table-column prop="value" sortable class-name="sortable-without-header-text" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="top-border table-card client messages" v-loading="clientDetailLock">
            <el-table :data="filterMetrics(clientDetailParts.messages)">
              <el-table-column prop="label" min-width="140" :label="tl('messages')" />
              <el-table-column prop="value" sortable class-name="sortable-without-header-text" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <div class="section-header">
        <div>
          {{ tl('currentSubscription') }}
        </div>
        <div>
          <el-button type="primary" :icon="Plus" @click="handlePreAdd">
            {{ tl('addASubscription') }}
          </el-button>
        </div>
      </div>
      <el-table class="subs" :data="subscriptions" v-loading.lock="subsLockTable" key="topic">
        <el-table-column prop="topic" show-overflow-tooltip :label="$t('Base.topic')">
          <template #default="{ row }">
            <span class="keep-spaces">{{ row.topic }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qos" min-width="110px" label="QoS" />
        <template v-if="isMQTTVersion5">
          <el-table-column prop="nl" :label="tl('noLocal')">
            <template #default="{ row }">
              {{ getLabelFromValueInOptionList(row.nl, noLocalOpts) }}
            </template>
          </el-table-column>
          <el-table-column prop="rap" :label="tl('retainAsPublished')">
            <template #default="{ row }">
              {{ getLabelFromValueInOptionList(row.rap, retainAsPublishedOpts) }}
            </template>
          </el-table-column>
          <el-table-column prop="rh" :label="tl('retainHandling')" />
        </template>
        <el-table-column :label="$t('Base.operation')">
          <template #default="{ row }">
            <el-button type="danger" plain size="small" @click="handleUnSubscription(row)">
              {{ $t('Clients.unsubscribe') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <create-subscribe
        v-model:visible="dialogVisible"
        :client-id="record.clientid"
        :gateway="gateway"
        :is-MQTT-Version5="isMQTTVersion5"
        @create:subs="loadSubs"
      >
      </create-subscribe>
    </template>
    <div class="client-does-not-exist" v-else>
      <el-icon><Warning /></el-icon>
      <span>{{ tl('clientDoesNotExist') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, defineEmits, defineProps, ref } from 'vue'

export default defineComponent({
  name: 'ClientDetails',
})
</script>

<script lang="ts" setup>
import { disconnectClient, loadClientDetail, loadSubscriptions, unsubscribe } from '@/api/clients'
import {
  disconnGatewayClient,
  getGatewayClientDetail,
  getGatewayClientSubs,
  unsubscribeGatewayClientSub,
} from '@/api/gateway'
import CheckIcon from '@/components/CheckIcon.vue'
import DetailHeader from '@/components/DetailHeader.vue'
import useClientDetail from '@/hooks/Clients/useClientDetail'
import useI18nTl from '@/hooks/useI18nTl'
import { Client } from '@/types/client'
import { Subscription } from '@/types/subscription'
import { Plus, Refresh, SwitchButton, Warning } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import CreateSubscribe from './components/CreateSubscribe.vue'
import { getLabelFromValueInOptionList } from '@/common/tools'
import useMQTTVersion5NewConfig from '@/hooks/useMQTTVersion5NewConfig'

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
      'clean_start',
      'is_bridge',
      'connected_at',
      'disconnected_at',
      'zone',
    ],
    session: [
      'expiry_interval',
      'created_at',
      'heap_size',
      'subscriptions',
      'mqueue',
      'inflight',
      'awaiting_rel',
    ],
    bytes: ['recv_oct', 'send_oct'],
    packets: ['recv_cnt', 'send_cnt', 'recv_pkt', 'send_pkt'],
    messages: [
      'recv_msg',
      'recv_msg.qos0',
      'recv_msg.qos1',
      'recv_msg.qos2',
      'recv_msg.dropped',
      'recv_msg.dropped.await_pubrel_timeout',
      'send_msg',
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
    ],
    session: ['subscriptions', 'mqueue', 'inflight', 'heap_size', 'reductions'],
    bytes: ['recv_oct', 'send_oct'],
    packets: ['recv_cnt', 'send_cnt', 'recv_pkt'],
    messages: ['send_lw_pkt'],
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
    ],
    session: ['subscriptions', 'mqueue', 'inflight', 'heap_size', 'reductions'],
    bytes: ['recv_oct', 'send_oct'],
    packets: ['recv_cnt', 'send_cnt', 'recv_pkt', 'send_pkt'],
    messages: [],
  },
}
const mqttVersion = {
  3: 'v3.1',
  4: 'v3.1.1',
  5: 'v5.0',
}
const subscriptions = ref<Subscription[]>([])
const route = useRoute()
const router = useRouter()
const { tl } = useI18nTl('Clients')
const { t } = useI18n()
const { noLocalOpts, retainAsPublishedOpts } = useMQTTVersion5NewConfig()

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
const isMQTTVersion5 = computed(() => {
  return record.value.proto_name === 'MQTT' && record.value.proto_ver === 5
})

const { getSessionInfoItem } = useClientDetail(record)

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
      if (!props.gateway) {
        router.push({ name: 'connections' })
      }
      record.value.connected = false
      ElMessage.success(successMsg)
    })
    .catch(() => {
      // ignore
    })
}

const handleDisconnectGateway = async () => {
  if (record.value === null) return
  let res = await disconnGatewayClient(props.gateway, record.value.clientid as string)
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
    doesTheClientExist.value = true
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

const getLabel = (label: string) => {
  if (label === 'clean_start') {
    return record.value.proto_ver === 5 ? 'Clean Start' : tl('cleanSession')
  }
  if (!props.gateway) {
    if (label === 'recv_pkt') {
      return tl(snake2pascal(label), { proto: ' MQTT ' })
    }
    if (label === 'send_pkt') {
      return tl(snake2pascal(label), { proto: ' MQTT ' })
    }
  }
  return tl(snake2pascal(label))
}

const filterMetrics = (metrics: Array<keyof Client>) => {
  return metrics.map((metric) => {
    const label = getLabel(metric)
    const value = record.value[metric]
    return {
      label,
      value,
    }
  })
}

const handleUnSubscription = (row: Subscription) => {
  const title = tl('unsubscribeTitle')
  let topic = row.topic
  if (record.value.mountpoint) {
    topic = topic.replace(record.value.mountpoint, '')
  }
  ElMessageBox.confirm(title, {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
    .then(async () => {
      if (props.gateway) {
        if (!row.clientid) {
          row.clientid = clientId.value
        }
        return handleUnsubscriptionGateway(row.clientid, topic)
      } else {
        return unsubscribe(row.clientid, topic)
      }
    })
    .then(() => {
      loadSubs()
    })
    .catch(() => {
      // ignore
    })
}

const handleUnsubscriptionGateway = async (clientid: Subscription['clientid'], topic: string) => {
  const res = await unsubscribeGatewayClientSub(props.gateway, clientid, topic)
  if (res) {
    return Promise.resolve()
  } else {
    return Promise.reject()
  }
}

loadData()
loadSubs()
</script>

<style lang="scss">
.client-details {
  .header-content {
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: nowrap;
    margin: 0;
  }
  .el-card {
    &.client-info {
      &.top-border {
        &:before {
          background: linear-gradient(135deg, #00b173 0%, #009580 100%);
        }
      }
    }
    &.client-session {
      &.top-border {
        &:before {
          background: linear-gradient(33deg, #9a66ff 0%, #3651ec 100%);
        }
      }
    }
  }
  .client-metrics {
    .el-card {
      &.top-border.packets {
        &:before {
          background: #3d7ff9;
        }
      }
      &.top-border.messages {
        &:before {
          background: #bf73ff;
        }
      }
      &.top-border.bytes {
        &:before {
          background: #f49845;
        }
      }
    }
  }
  .el-tag {
    margin-right: 12px;
    & i {
      margin-right: 6px;
    }
  }
  .section-header:not(:first-of-type) {
    margin-top: 0px;
  }
  .client-does-not-exist {
    padding-top: 180px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      margin-right: 8px;
    }
  }
  .subs.el-table {
    margin-bottom: 48px;
  }
  .stats-tip {
    position: absolute;
    right: 25px;
  }
}
</style>
