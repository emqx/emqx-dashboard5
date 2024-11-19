<template>
  <div class="client-details app-wrapper" :class="{ 'in-drawer': !!gateway }">
    <div class="block-header">
      <detail-header
        :item="{
          name: clientId,
          route: backRoute,
          backFunc: gateway
            ? () => {
                emit('refreshGateway')
              }
            : undefined,
        }"
      >
        <template #content>
          <el-tooltip :content="clientId">
            <p class="vertical-align-center header-content">
              <TextEasyCopy :content="clientId">
                <PreWithEllipsis>{{ clientId }}</PreWithEllipsis>
              </TextEasyCopy>
            </p>
          </el-tooltip>
        </template>
      </detail-header>
      <div class="actions">
        <el-tooltip :content="$t('Base.refresh')" placement="top">
          <el-button class="icon-button" type="primary" :icon="Refresh" @click="loadData">
          </el-button>
        </el-tooltip>
        <el-tooltip
          :content="record.connected ? tl('kickOut') : tl('cleanSession')"
          placement="top"
        >
          <el-button
            v-if="doesTheClientExist"
            class="icon-button"
            type="danger"
            :icon="Delete"
            :disabled="!$hasPermission('delete')"
            plain
            @click="handleDisconnect"
          >
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <template v-if="doesTheClientExist">
      <el-row :gutter="26" class="client-row block">
        <el-col :span="12">
          <el-card class="top-border client-info" v-loading="clientDetailLock">
            <el-descriptions :title="tl('connectionInfo')" border :column="1" size="large">
              <el-descriptions-item :label="tl('connectedStatus')">
                <ClientInfoItem :client="record" field="connected" />
              </el-descriptions-item>
              <el-descriptions-item
                v-for="item in clientDetailParts.connection"
                :key="item"
                :label="getLabel(item)"
              >
                <ClientInfoItem v-if="item !== 'client_attrs'" :client="record" :field="item" />
                <template v-else>
                  <el-button type="primary" size="small" plain @click="viewClientAttrs">
                    {{ t('Base.view') }}
                  </el-button>
                </template>
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
                  <ClientInfoItem :client="record" :field="item" />
                  <template v-if="withMsgList(item)">
                    <el-tooltip
                      :disabled="!record.durable"
                      :content="tl('cannotViewMsg')"
                      :show-after="500"
                      placement="top"
                    >
                      <el-button
                        class="btn-view-msg"
                        type="primary"
                        :plain="!record.durable"
                        :disabled="record.durable"
                        size="small"
                        @click="viewMsgList(item as 'mqueue' | 'inflight')"
                      >
                        {{ tl('viewMsg') }}
                      </el-button>
                    </el-tooltip>
                  </template>
                  <info-tooltip
                    v-if="withItemDesc(item)"
                    class="client-info-tips"
                    :content="getClientInfoDesc(item)"
                  ></info-tooltip>
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
          <el-button type="primary" :icon="Refresh" @click="handleRefreshSubs">
            {{ t('Base.refresh') }}
          </el-button>
          <el-button
            v-if="allowSubscriptionOperations"
            :disabled="!$hasPermission('post')"
            type="primary"
            :icon="Plus"
            @click="handlePreAdd"
          >
            {{ tl('addASubscription') }}
          </el-button>
        </div>
      </div>
      <el-table class="subs" :data="subscriptions" v-loading.lock="subsLockTable" key="topic">
        <el-table-column prop="topic" :label="$t('Base.topic')">
          <template #default="{ row }">
            <CommonOverflowTooltip :content="row.topic" />
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
        <el-table-column :label="$t('Base.operation')" v-if="allowSubscriptionOperations">
          <template #default="{ row }">
            <el-button
              :disabled="!$hasPermission('delete')"
              plain
              size="small"
              @click="handleUnSubscription(row)"
            >
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
      />
    </template>
    <div class="client-does-not-exist" v-else>
      <el-icon><Warning /></el-icon>
      <span>{{ tl('clientDoesNotExist') }}</span>
    </div>
  </div>
  <MessageListDialog v-model="showMsgListDialog" :client-id="clientId" :type="msgListType" />
  <ClientAttrsDialog v-model="showClientAttrs" :value="record.client_attrs" />
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
import { getLabelFromValueInOptionList } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import PreWithEllipsis from '@/components/PreWithEllipsis.vue'
import TextEasyCopy from '@/components/TextEasyCopy.vue'
import useClientFields from '@/hooks/Clients/useClientFields'
import useI18nTl from '@/hooks/useI18nTl'
import useMQTTVersion5NewConfig from '@/hooks/useMQTTVersion5NewConfig'
import { useReceiveParams } from '@/hooks/usePaginationRemember'
import { Client } from '@/types/client'
import { GatewayName } from '@/types/enum'
import { Subscription } from '@/types/subscription'
import ClientInfoItem from '@/views/Clients/components/ClientInfoItem.vue'
import { Delete, Plus, Refresh, Warning } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import CreateSubscribe from './components/CreateSubscribe.vue'
import MessageListDialog from './components/MessageListDialog.vue'
import ClientAttrsDialog from './components/ClientAttrsDialog.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'

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

type ClientTypes = 'MQTT' | 'LWM2M' | 'MQISDP' | 'others' | 'OCPP'

const emit = defineEmits(['refreshGateway'])

const isGateway = computed(() => !!props.gateway)

const dialogVisible = ref(false)
const clientDetailLock = ref(true)
const subsLockTable = ref(true)
const doesTheClientExist = ref(true)
const record = ref<Partial<Client>>({})
const { clientFields, snake2pascal, getBaseLabel } = useClientFields()
const clientsOrganizied = {
  MQTT: {
    ...clientFields,
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
    session: ['subscriptions', 'heap_size', 'reductions'],
    bytes: ['recv_oct', 'send_oct'],
    packets: ['recv_cnt', 'send_cnt', 'recv_pkt'],
    messages: ['send_lw_pkt'],
  },
  OCPP: {
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
    session: ['subscriptions', 'heap_size', 'reductions'],
    bytes: ['recv_oct', 'send_oct'],
    packets: ['recv_cnt', 'send_cnt', 'recv_pkt', 'send_pkt'],
    messages: [],
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
    session: ['subscriptions', 'heap_size', 'reductions'],
    bytes: ['recv_oct', 'send_oct'],
    packets: ['recv_cnt', 'send_cnt', 'recv_pkt', 'send_pkt'],
    messages: [],
  },
}
const subscriptions = ref<Subscription[]>([])

const route = useRoute()
const router = useRouter()
const { tl } = useI18nTl('Clients')
const { t } = useI18n()
const { noLocalOpts, retainAsPublishedOpts } = useMQTTVersion5NewConfig()
const { getBackRoute } = useReceiveParams('clients')

const showMsgListDialog = ref(false)
const msgListType = ref<'mqueue' | 'inflight'>('mqueue')

const isFromSlowSub = computed(() => {
  return route.query.from === 'slow-sub'
})

const backRoute = computed(() => {
  let routeName = isFromSlowSub.value ? 'slow-sub' : 'clients'
  return getBackRoute({ name: routeName })
})

const clientId = computed<string>((): string => {
  return (route.params.clientId as string) || (props.clientid as string)
})
const clientType = computed<ClientTypes>((): ClientTypes => {
  const proto_name = String(record.value.proto_name)
  return proto_name.toUpperCase() as ClientTypes
})
const clientDetailParts = computed(() => {
  let allParts = Object.keys(clientsOrganizied)
  if (clientType.value === 'MQISDP') {
    return clientsOrganizied.MQTT
  }
  if (Array.prototype.includes.call(allParts, clientType.value)) {
    return clientsOrganizied[clientType.value]
  }
  if (props.gateway === GatewayName.OCPP) {
    return clientsOrganizied.OCPP
  }
  return clientsOrganizied.others
})
const isMQTTVersion5 = computed(() => {
  return record.value.proto_name === 'MQTT' && record.value.proto_ver === 5
})

const gatewayTypesAllowSubscriptionOperations = [
  GatewayName.CoAP,
  GatewayName.MQTT_SN,
  GatewayName.STOMP,
]
const allowSubscriptionOperations = computed(() => {
  return (
    !isGateway.value ||
    (isGateway.value &&
      gatewayTypesAllowSubscriptionOperations.includes(props.gateway as GatewayName))
  )
})
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
    confirmButtonClass: 'confirm-danger',
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
        router.push({ name: 'clients' })
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

const handleRefreshSubs = () => {
  loadSubs()
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
  } else {
    if (label === 'recv_cnt') {
      return tl('recvSocketCnt')
    }
    if (label === 'send_cnt') {
      return tl('sendSocketCnt')
    }
  }
  return getBaseLabel(label)
}

const getClientInfoDesc = (item: string) => {
  return tl(`${item}Desc`)
}

const filterMetrics = (metrics: Array<keyof Client>) => {
  return metrics.map((metric) => {
    const label = getLabel(metric as string)
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
    confirmButtonClass: 'confirm-danger',
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

const withMsgList = (item: string) => ['mqueue', 'inflight'].includes(item)
const withItemDesc = (item: string) => withMsgList(item) || ['reductions'].includes(item)
const viewMsgList = (type: 'mqueue' | 'inflight') => {
  msgListType.value = type
  showMsgListDialog.value = true
}

const showClientAttrs = ref(false)
const viewClientAttrs = () => {
  showClientAttrs.value = true
}

loadData()
loadSubs()
</script>

<style lang="scss">
.client-details {
  &.in-drawer {
    padding-top: 0;
    .block-header {
      margin-bottom: 24px;
    }
    .el-page-header__header {
      .el-page-header__back,
      .el-divider {
        display: none;
      }
    }
    .detail-header {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
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
  .btn-copy,
  .btn-view-msg {
    margin-left: 16px;
  }
  .icon-question {
    float: right;
  }
}
</style>
