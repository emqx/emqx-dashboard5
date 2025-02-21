<template>
  <div class="overview app-wrapper">
    <el-row class="block" :gutter="16">
      <el-col :span="8">
        <el-card class="rate-card">
          <!-- <el-radio-group class="rate-type-radio" v-model="rateType" size="small">
            <el-radio-button value="byte" />
            <el-radio-button value="msg"> {{ $t('Dashboard.messageNumber') }} </el-radio-button>
          </el-radio-group> -->
          <template v-if="rateType === 'msg'">
            <div class="rate-item">
              <div>
                <label class="rate-label">{{ $t('Dashboard.currentMessageInRate') }}</label>
                <span class="unit">
                  {{ $t('Dashboard.strip', { n: currentMetrics.received_msg_rate }) }}/{{
                    $t('Dashboard.second')
                  }}
                </span>
              </div>
              <div class="line-wrapper">
                <rate-chart
                  :value="currentMetricsLogs.received_msg_rate"
                  type="bar"
                  color="#3D7FF9"
                />
              </div>
            </div>
            <div class="rate-item">
              <div>
                <label class="rate-label">{{ $t('Dashboard.currentMessageOutRate') }}</label>
                <span class="unit">
                  {{ $t('Dashboard.strip', { n: currentMetrics.sent_msg_rate }) }}/{{
                    $t('Dashboard.second')
                  }}
                </span>
              </div>
              <div class="line-wrapper">
                <rate-chart :value="currentMetricsLogs.sent_msg_rate" type="bar" color="#5D4EFF" />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="rate-item">
              <div>
                <label class="rate-label">{{ $t('Dashboard.currentMessageInRate') }}</label>
                <span>{{ _formatNumber(currentMetrics.received_bytes_rate) }}</span>
                <span class="unit">{{ $t('Dashboard.byte') }}/{{ $t('Dashboard.second') }}</span>
              </div>
              <div class="line-wrapper">
                <rate-chart
                  :value="currentMetricsLogs.received_bytes_rate"
                  type="bar"
                  color="#3D7FF9"
                />
              </div>
            </div>
            <div class="rate-item">
              <div>
                <label class="rate-label">{{ $t('Dashboard.currentMessageOutRate') }}</label>
                <span>{{ _formatNumber(currentMetrics.sent_bytes_rate) }}</span>
                <span class="unit">{{ $t('Dashboard.byte') }}/{{ $t('Dashboard.second') }}</span>
              </div>
              <div class="line-wrapper">
                <rate-chart
                  :value="currentMetricsLogs.sent_bytes_rate"
                  type="bar"
                  color="#5D4EFF"
                />
              </div>
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="main-info-item">
          <router-link class="count-item" :to="{ name: 'clients' }">
            <div class="count-item-hd">
              <img src="@/assets/img/connections.png" width="16" height="16" alt="clients" />
              <p class="info-label">{{ $t('Dashboard.allConnections') }}</p>
            </div>
            <div class="num">{{ _formatNumber(currentMetrics.connections) }}</div>
          </router-link>
          <router-link
            class="count-item"
            :to="{ name: 'clients', query: { conn_state: 'connected' } }"
          >
            <div class="count-item-hd">
              <img src="@/assets/img/live_connections.png" width="16" height="16" alt="clients" />
              <p class="info-label">{{ $t('Dashboard.liveConnections') }}</p>
            </div>
            <div class="num">
              {{ _formatNumber(currentMetrics.live_connections) }}
            </div>
          </router-link>
        </el-card>
        <el-card class="main-info-item">
          <router-link class="count-item" :to="{ name: 'subscription' }">
            <div class="count-item-hd">
              <img src="@/assets/img/subs.png" width="16" height="16" alt="subs" />
              <p class="info-label">{{ $t('Dashboard.subscriptionNumber') }}</p>
            </div>
            <div class="num">{{ _formatNumber(currentMetrics.subscriptions) }}</div>
          </router-link>
          <div class="count-item">
            <div class="count-item-hd">
              <img src="@/assets/img/shared_subscriptions.png" width="16" height="16" alt="subs" />
              <p class="info-label">{{ $t('Dashboard.shareSubscription') }}</p>
            </div>
            <div class="num">{{ _formatNumber(currentMetrics.shared_subscriptions) }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="main-info-item">
          <router-link class="count-item" :to="{ name: 'topics' }">
            <div class="count-item-hd">
              <img src="@/assets/img/topics.png" width="16" height="16" alt="topics" />
              <p class="info-label">{{ $t('Dashboard.topics') }}</p>
            </div>
            <div class="num">{{ _formatNumber(currentMetrics.topics) }}</div>
          </router-link>
        </el-card>
        <el-card class="main-info-item">
          <router-link class="count-item" :to="{ name: 'retained' }">
            <div class="count-item-hd">
              <img src="@/assets/img/retained.png" width="16" height="16" alt="topics" />
              <p class="info-label">{{ $t('Dashboard.retained') }}</p>
            </div>
            <div class="num">{{ _formatNumber(currentMetrics.retained_msg_count) }}</div>
          </router-link>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="cluster-card block allow-overflow">
      <NodesGraphCard />
    </el-card>
    <polyline-cards></polyline-cards>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'Overview',
})
</script>

<script setup lang="ts">
import RateChart from './components/RateChart.vue'
import PolylineCards from './components/PolylineCards.vue'
import NodesGraphCard from './components/NodesGraphCard.vue'
import dayjs from 'dayjs'
import { loadCurrentMetrics } from '@/api/common'
import { formatNumber } from '@/common/tools'

interface MetricData {
  x: Array<string>
  y: Array<number>
}

const POLLING_INTERVAL = 2000

const createEmptyDataItem = (length: number) => ({
  x: new Array(length).fill(undefined),
  y: new Array(length).fill(undefined),
})

const currentMetricsLogs: Record<string, MetricData> = reactive({
  received_msg_rate: createEmptyDataItem(32),
  sent_msg_rate: createEmptyDataItem(32),
  received_bytes_rate: createEmptyDataItem(32),
  sent_bytes_rate: createEmptyDataItem(32),
})
const currentMetrics: Ref<Record<string, number>> = ref({
  node: 0, // Nodes number
  received_msg_rate: 0, // Incoming Rate
  sent_msg_rate: 0, // Outgoing Rate
  received_bytes_rate: 0, // Incoming Bytes Rate
  sent_bytes_rate: 0, // Outgoing Bytes Rate
  subscriptions: 0, // Subs number
  connections: 0, // Connections number
  topics: 0, // Topics
  live_connections: 0, // Live Connections
})

const rateType = ref<'msg' | 'byte'>('msg')

const _formatNumber = (num: number) => (num === undefined ? 0 : formatNumber(num))
const { syncPolling } = useSyncPolling()

const loadData = async () => {
  const state = await loadCurrentMetrics()
  if (!state) {
    return
  }
  currentMetrics.value = state
  setCurrentMetricsLogsRealtime(state)
}

const getNow = () => {
  return dayjs().format('HH:mm:ss')
}
const setCurrentMetricsLogsRealtime = (state: Record<string, number> = {}) => {
  ;['received_msg_rate', 'sent_msg_rate', 'received_bytes_rate', 'sent_bytes_rate'].forEach(
    (key) => {
      currentMetricsLogs[key] = currentMetricsLogs[key] || {
        x: [],
        y: [],
      }
      const currentValue = state[key] || 0
      currentMetricsLogs[key].x.push(getNow())

      currentMetricsLogs[key].y.push(currentValue)
      if (currentMetricsLogs[key].x.length >= 16) {
        currentMetricsLogs[key].x.shift()
        currentMetricsLogs[key].y.shift()
      }
    },
  )
}

syncPolling(loadData, POLLING_INTERVAL)
</script>

<style lang="scss">
@use 'sass:math';
.overview {
  .block {
    align-items: stretch;
    margin-top: 14px;
    margin-bottom: 28px;
  }
  .main-info-item {
    width: 100%;
    height: calc(math.div(100%, 2) - math.div(16px, 2));
    &:not(:last-child) {
      margin-bottom: 16px;
    }
    .el-card__body {
      display: flex;
      padding: 24px 32px;
    }
    .count-item {
      width: 50%;
    }
    .count-item-hd {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      img {
        margin-right: 8px;
      }
    }
    a {
      position: relative;
      transition: none;
      &:hover {
        .info-label {
          color: var(--color-primary);
        }
        img {
          filter: contrast(125%);
        }
      }
      .img-container {
        line-height: 0;
      }
    }
    .info-label {
      display: flex;
      align-items: center;
      height: 24px;
      margin-top: 0;
      margin-bottom: 0;
      font-size: 16px;
      color: var(--color-text-secondary);
    }
    .num {
      color: var(--color-title-primary);
      font-size: 22px;
      font-weight: 600;
      line-height: 32px;
    }
  }
  .rate-card {
    height: 100%;
    .el-card__body {
      height: 100%;
      .rate-item {
        height: 50%;
        margin-bottom: 8px;
      }
    }
    .rate-label {
      color: var(--color-text-secondary);
      padding-right: 10px;
    }
    span {
      color: var(--color-text-primary);
    }
    .line-wrapper {
      width: 100%;
      box-sizing: border-box;
      margin: 16px 0;
      .rate-chart {
        box-sizing: border-box;
        height: 36px;
      }
    }
    .rate-type-radio {
      position: absolute;
      right: 10px;
      top: 16px;
    }
  }
  .cluster-card {
    border: none;
    border-radius: 8px;
    .el-card__body {
      padding: 0px;
    }
  }
}
</style>
