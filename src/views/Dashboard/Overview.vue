<template>
  <div class="overview app-wrapper">
    <el-row class="block stats-overview" :gutter="16">
      <el-col :span="24">
        <el-card class="stats-grid-card">
          <div class="stats-grid">
            <!-- Left: Rate card spanning 2 rows -->
            <div class="stat-card rate-card">
              <div class="rate-item">
                <StatsContent
                  unit="msg/s"
                  :icon="ArrowDown"
                  :value="currentMetrics.received_msg_rate"
                  :title="tl('currentMessageInRate')"
                />
                <div class="stat-chart">
                  <rate-chart
                    :value="currentMetricsLogs.received_msg_rate"
                    type="bar"
                    color="#3D7FF9"
                  />
                </div>
              </div>
              <div class="rate-divider"></div>
              <div class="rate-item">
                <StatsContent
                  unit="msg/s"
                  :icon="ArrowUp"
                  :value="currentMetrics.sent_msg_rate"
                  :title="tl('currentMessageOutRate')"
                />
                <div class="stat-chart">
                  <rate-chart
                    :value="currentMetricsLogs.sent_msg_rate"
                    type="bar"
                    color="#5D4EFF"
                  />
                </div>
              </div>
            </div>

            <!-- Middle row 1: All Connections + Live Connections -->
            <div class="stat-card inline-card">
              <router-link class="inline-item" :to="{ name: 'clients' }">
                <StatsContent
                  :icon="Link"
                  :value="currentMetrics.connections"
                  :title="tl('allConnections')"
                />
              </router-link>
              <div class="inline-divider"></div>
              <router-link
                class="inline-item"
                :to="{ name: 'clients', query: { conn_state: 'connected' } }"
              >
                <StatsContent
                  :icon="Activity"
                  :value="currentMetrics.live_connections"
                  :title="tl('liveConnections')"
                />
              </router-link>
            </div>

            <!-- Right row 1: Topics -->
            <router-link class="stat-card simple-card" :to="{ name: 'topics' }">
              <StatsContent :icon="Hash" :value="currentMetrics.topics" :title="tl('topics')" />
            </router-link>

            <!-- Middle row 2: Subscriptions + Shared Subscriptions -->
            <div class="stat-card inline-card">
              <router-link class="inline-item" :to="{ name: 'subscription' }">
                <StatsContent
                  :icon="Bell"
                  :value="currentMetrics.subscriptions"
                  :title="tl('subscriptionNumber')"
                />
              </router-link>
              <div class="inline-divider"></div>
              <div class="inline-item">
                <StatsContent
                  :icon="Share2"
                  :value="currentMetrics.shared_subscriptions"
                  :title="tl('shareSubscription')"
                />
              </div>
            </div>

            <!-- Right row 2: Retained -->
            <router-link class="stat-card simple-card" :to="{ name: 'retained' }">
              <StatsContent
                :icon="Archive"
                :value="currentMetrics.retained_msg_count"
                :title="tl('retained')"
              />
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
import { loadCurrentMetrics } from '@/api/common'
import dayjs from 'dayjs'
import { Activity, Archive, ArrowDown, ArrowUp, Bell, Hash, Link, Share2 } from 'lucide-vue-next'
import NodesGraphCard from './components/NodesGraphCard.vue'
import PolylineCards from './components/PolylineCards.vue'
import RateChart from './components/RateChart.vue'

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

const createEmptyDataItem = (length: number) => ({
  x: new Array(length).fill(undefined),
  y: new Array(length).fill(undefined),
})

const currentMetricsLogs: Record<string, MetricData> = reactive({
  received_msg_rate: createEmptyDataItem(32),
  sent_msg_rate: createEmptyDataItem(32),
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
const { syncPolling } = useSyncPolling()
const { tl } = useI18nTl('Dashboard')

const loadData = async () => {
  const state = await loadCurrentMetrics()
  if (!state) {
    return
  }
  currentMetrics.value = state
  const now = dayjs().format('HH:mm:ss')
  ;['received_msg_rate', 'sent_msg_rate'].forEach((key) => {
    currentMetricsLogs[key] = currentMetricsLogs[key] || {
      x: [],
      y: [],
    }
    currentMetricsLogs[key].x.push(now)

    currentMetricsLogs[key].y.push(state[key] || 0)
    if (currentMetricsLogs[key].x.length >= 16) {
      currentMetricsLogs[key].x.shift()
      currentMetricsLogs[key].y.shift()
    }
  })
}

syncPolling(loadData, POLLING_INTERVAL)
</script>

<style lang="scss">
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
    grid-template-columns: 2fr 2fr 1fr;
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

    &.rate-card {
      grid-row: span 2;
      padding: 0;
    }

    &.inline-card {
      padding: 0;
      flex-direction: row;

      &:hover {
        border-color: var(--color-primary);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      }
    }

    &.simple-card {
      &:hover {
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
  }

  a.stat-card {
    cursor: pointer;
    text-decoration: none;
  }

  .rate-item {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;

    .stats-content {
      flex: 1;
      min-width: 0;
    }

    .stat-chart {
      width: 220px;
      height: 52px;
      flex-shrink: 0;

      .rate-chart {
        height: 100%;
        width: 100%;
      }
    }
  }

  .rate-divider {
    height: 1px;
    background: var(--color-border-card);
  }

  .inline-item {
    flex: 1;
    padding: 24px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;

    &:first-child {
      border-radius: var(--border-radius-card) 0 0 var(--border-radius-card);
    }

    &:last-child {
      border-radius: 0 var(--border-radius-card) var(--border-radius-card) 0;
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

  .inline-divider {
    width: 1px;
    background: var(--color-border-card);
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
