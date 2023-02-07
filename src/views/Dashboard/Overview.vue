<template>
  <div class="overview app-wrapper">
    <el-row class="block" :gutter="26">
      <el-col :span="12">
        <el-card class="rate-card top-primary">
          <!-- <el-radio-group class="rate-type-radio" v-model="rateType" size="small">
            <el-radio-button label="byte" />
            <el-radio-button label="msg"> {{ $t('Dashboard.messageNumber') }} </el-radio-button>
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
      <el-col :span="12">
        <el-card class="main-info-card top-primary">
          <el-row :gutter="40">
            <el-col :span="8" class="main-info-item">
              <router-link :to="{ name: 'connections' }">
                <img src="@/assets/img/connections.png" width="40" height="40" alt="connections" />
                <p>{{ $t('Dashboard.connectionNumber') }}</p>
              </router-link>
              <div class="num">{{ _formatNumber(currentMetrics.connections) }}</div>
            </el-col>
            <el-col :span="8" class="main-info-item">
              <router-link :to="{ name: 'topics' }">
                <img src="@/assets/img/topics.png" width="40" height="40" alt="topics" />
                <p>{{ $t('Dashboard.topics') }}</p>
              </router-link>
              <div class="num">{{ _formatNumber(currentMetrics.topics) }}</div>
            </el-col>
            <el-col :span="8" class="main-info-item">
              <div>
                <router-link :to="{ name: 'subscription' }">
                  <img src="@/assets/img/subs.png" width="40" height="40" alt="subs" />
                  <p>{{ $t('Dashboard.subscriptionNumber') }}</p>
                </router-link>
                <div class="num">{{ _formatNumber(currentMetrics.subscriptions) }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="cluster-card block">
      <NodesGraphCard class="nodes-graph" />
    </el-card>
    <polyline-cards></polyline-cards>
    <LicenseCard :current-connections="currentMetrics.connections" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Overview',
})
</script>

<script setup lang="ts">
import { ref, reactive, Ref } from 'vue'
import RateChart from './components/RateChart.vue'
import PolylineCards from './components/PolylineCards.vue'
import NodesGraphCard from './components/NodesGraphCard.vue'
import LicenseCard from './components/LicenseCard.vue'
import Moment from 'moment'
import { loadCurrentMetrics } from '@/api/common'
import { formatNumber } from '@/common/tools'
import useSyncPolling from '@/hooks/useSyncPolling'

interface MetricData {
  x: Array<string>
  y: Array<number>
}

const POLLING_INTERVAL = 2000

const currentMetricsLogs: Record<string, MetricData> = reactive({
  received_msg_rate: {
    x: Array(32).fill('N/A'),
    y: Array(32).fill(0),
  },
  sent_msg_rate: {
    x: Array(32).fill('N/A'),
    y: Array(32).fill(0),
  },
  received_bytes_rate: {
    x: Array(32).fill('N/A'),
    y: Array(32).fill(0),
  },
  sent_bytes_rate: {
    x: Array(32).fill('N/A'),
    y: Array(32).fill(0),
  },
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
  return Moment().format('HH:mm:ss')
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
.overview {
  .block {
    margin-top: 14px;
    margin-bottom: 28px;
  }
  .main-info-card.el-card {
    height: 195px;
    .el-card__body {
      padding: 36px;
      .main-info-item {
        a {
          display: block;
          font-size: 16px;
          color: var(--color-text-secondary);
          transition: none;
          &:hover {
            color: var(--color-primary);
            img {
              filter: saturate(65%) contrast(135%);
            }
          }
        }
        .num {
          color: var(--color-title-primary);
          font-size: 24px;
        }
      }
    }
  }
  .rate-card {
    height: 195px;
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
    .el-card__body {
      padding: 0px;
    }
  }
}
</style>
