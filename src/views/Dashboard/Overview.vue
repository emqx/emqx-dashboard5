<template>
  <div class="overview app-wrapper">
    <el-row class="block stats-overview" :gutter="16">
      <el-col :span="24">
        <el-card class="stats-grid-card">
          <div class="stats-grid">
            <!-- Rate Cards -->
            <div class="stat-card rate-card-in">
              <div class="stat-header">
                <el-icon class="stat-icon"><Top /></el-icon>
                <span class="stat-label">{{ $t('Dashboard.currentMessageInRate') }}</span>
              </div>
              <div class="stat-value">
                <span class="stat-number">{{
                  _formatNumber(currentMetrics.received_msg_rate)
                }}</span>
                <span class="stat-unit">msg/s</span>
              </div>
              <div class="stat-chart">
                <rate-chart
                  :value="currentMetricsLogs.received_msg_rate"
                  type="bar"
                  color="#3D7FF9"
                />
              </div>
            </div>

            <div class="stat-card rate-card-out">
              <div class="stat-header">
                <el-icon class="stat-icon"><Bottom /></el-icon>
                <span class="stat-label">{{ $t('Dashboard.currentMessageOutRate') }}</span>
              </div>
              <div class="stat-value">
                <span class="stat-number">{{ _formatNumber(currentMetrics.sent_msg_rate) }}</span>
                <span class="stat-unit">msg/s</span>
              </div>
              <div class="stat-chart">
                <rate-chart :value="currentMetricsLogs.sent_msg_rate" type="bar" color="#5D4EFF" />
              </div>
            </div>

            <!-- Sessions Card -->
            <div class="stat-card combined-card">
              <router-link class="stat-item" :to="{ name: 'clients' }">
                <div class="stat-header">
                  <el-icon class="stat-icon"><Connection /></el-icon>
                  <span class="stat-label">{{ $t('Dashboard.allConnections') }}</span>
                </div>
                <div class="stat-value">
                  <span class="stat-number">{{ _formatNumber(currentMetrics.connections) }}</span>
                </div>
              </router-link>

              <div class="stat-divider"></div>

              <router-link
                class="stat-item"
                :to="{ name: 'clients', query: { conn_state: 'connected' } }"
              >
                <div class="stat-header">
                  <el-icon class="stat-icon"><Link /></el-icon>
                  <span class="stat-label">{{ $t('Dashboard.liveConnections') }}</span>
                </div>
                <div class="stat-value">
                  <span class="stat-number">{{
                    _formatNumber(currentMetrics.live_connections)
                  }}</span>
                </div>
              </router-link>
            </div>

            <!-- Subscriptions Card -->
            <div class="stat-card combined-card">
              <router-link class="stat-item" :to="{ name: 'subscription' }">
                <div class="stat-header">
                  <el-icon class="stat-icon"><Bell /></el-icon>
                  <span class="stat-label">{{ $t('Dashboard.subscriptionNumber') }}</span>
                </div>
                <div class="stat-value">
                  <span class="stat-number">{{ _formatNumber(currentMetrics.subscriptions) }}</span>
                </div>
              </router-link>

              <div class="stat-divider"></div>

              <div class="stat-item">
                <div class="stat-header">
                  <el-icon class="stat-icon"><Share /></el-icon>
                  <span class="stat-label">{{ $t('Dashboard.shareSubscription') }}</span>
                </div>
                <div class="stat-value">
                  <span class="stat-number">{{
                    _formatNumber(currentMetrics.shared_subscriptions)
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Topics -->
            <router-link class="stat-card" :to="{ name: 'topics' }">
              <div class="stat-header">
                <el-icon class="stat-icon"><ChatDotRound /></el-icon>
                <span class="stat-label">{{ $t('Dashboard.topics') }}</span>
              </div>
              <div class="stat-value">
                <span class="stat-number">{{ _formatNumber(currentMetrics.topics) }}</span>
              </div>
            </router-link>

            <!-- Retained -->
            <router-link class="stat-card" :to="{ name: 'retained' }">
              <div class="stat-header">
                <el-icon class="stat-icon"><Collection /></el-icon>
                <span class="stat-label">{{ $t('Dashboard.retained') }}</span>
              </div>
              <div class="stat-value">
                <span class="stat-number">{{
                  _formatNumber(currentMetrics.retained_msg_count)
                }}</span>
              </div>
            </router-link>
          </div>
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
import {
  Connection,
  Link,
  Bell,
  Share,
  ChatDotRound,
  Collection,
  Top,
  Bottom,
} from '@element-plus/icons-vue'

interface MetricData {
  x: Array<string>
  y: Array<number>
}
interface SessionsHistHwmark {
  current_value: number
  peak_time: number
  peak_value: number
}
type CurrentMetrics = Record<string, number> & {
  sessions_hist_hwmark?: SessionsHistHwmark
}

const POLLING_INTERVAL = 2000

// const { tl } = useI18nTl('Dashboard')

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
const currentMetrics: Ref<CurrentMetrics> = ref({
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
// const withSessionsHistHwmark = computed(
//   () => !isUndefined(currentMetrics.value.sessions_hist_hwmark),
// )

// const rateType = ref<'msg' | 'byte'>('msg')

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
    margin-bottom: 16px;
  }

  .stats-overview {
    margin-bottom: 24px;
  }

  .stats-grid-card {
    background: transparent;
    border: none;
    box-shadow: none;

    .el-card__body {
      padding: 0;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: auto;
    gap: 16px;
  }

  .stat-card {
    background: var(--color-bg-content);
    padding: 24px;
    transition: all 0.2s ease;
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border-card);
    border-radius: var(--border-radius-card);

    // Rate 卡片占 2 列
    &.rate-card-in,
    &.rate-card-out {
      grid-column: span 2;
      padding: 24px;
    }

    // 合并卡片样式
    &.combined-card {
      padding: 0;

      &:hover {
        border-color: var(--color-primary);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      }
    }

    &:not(.combined-card):not(.rate-card-in):not(.rate-card-out) {
      align-self: start;
    }

    &:not(.combined-card):hover {
      border-color: var(--color-primary);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

      .stat-icon {
        color: var(--color-primary);
      }

      .stat-label {
        color: var(--color-primary);
      }

      .stat-number {
        color: var(--color-primary);
      }
    }
  }

  a.stat-card {
    text-decoration: none;
  }

  .stat-item {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    transition: all 0.2s ease;
    overflow: hidden;

    &:first-child {
      border-radius: var(--border-radius-card) var(--border-radius-card) 0 0;
    }

    &:last-child {
      border-radius: 0 0 var(--border-radius-card) var(--border-radius-card);
    }

    &:hover {
      background: var(--color-bg-split);

      .stat-icon {
        color: var(--color-primary);
      }

      .stat-label {
        color: var(--color-primary);
      }

      .stat-number {
        color: var(--color-primary);
      }
    }
  }

  .stat-divider {
    height: 1px;
    background: var(--color-border-card);
  }

  .stat-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .stat-icon {
    font-size: 18px;
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
  }

  .stat-label {
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 18px;
  }

  .stat-value {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .stat-number {
    font-size: 32px;
    font-weight: 600;
    line-height: 40px;
    color: var(--color-title-primary);
    transition: color 0.2s ease;
  }

  .stat-unit {
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 20px;
  }

  .stat-chart {
    margin-top: 16px;
    height: 52px;
    width: 100%;

    .rate-chart {
      height: 100%;
      width: 100%;
    }
  }

  a.stat-card {
    cursor: pointer;
    text-decoration: none;
  }

  .cluster-card {
    border: none;
    border-radius: var(--border-radius-card);
    .el-card__body {
      padding: 0px;
    }
  }
}
</style>
