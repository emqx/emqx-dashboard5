<template>
  <div class="overview app-wrapper">
    <h2>{{ $t('Dashboard.basicInfo') }}</h2>
    <el-row class="block" :gutter="26">
      <el-col :span="15">
        <el-card class="main-info-card top-primary">
          <el-row :gutter="40">
            <el-col :span="8" class="main-info-item">
              <img src="@/assets/img/connections.png" width="40" height="40" alt="connections" />
              <p>{{ $t('Dashboard.connectionNumber') }}</p>
              <div class="num">{{ _formatNumber(currentMetrics.connections) }}</div>
            </el-col>
            <el-col :span="8" class="main-info-item">
              <img src="@/assets/img/topics.png" width="40" height="40" alt="topics" />
              <p>{{ $t('Dashboard.topics') }}</p>
              <div class="num">{{ _formatNumber(currentMetrics.topics) }}</div>
            </el-col>
            <el-col :span="8" class="main-info-item">
              <div>
                <img src="@/assets/img/subs.png" width="40" height="40" alt="subs" />
                <p>{{ $t('Dashboard.subscriptionNumber') }}</p>
                <div class="num">{{ _formatNumber(currentMetrics.subscriptions) }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card class="rate-card">
          <el-radio-group class="rate-type-radio" v-model="rateType" size="small">
            <el-radio-button label="byte" />
            <el-radio-button label="msg" />
          </el-radio-group>
          <template v-if="rateType === 'msg'">
            <div class="rate-item">
              <div>
                <label class="rate-label">{{ $t('Dashboard.currentMessageInRate') }}</label>
                <span>{{ _formatNumber(currentMetrics.received_rate) }}</span>
                <span class="unit">{{ $t('Dashboard.strip') }}/{{ $t('Dashboard.second') }}</span>
              </div>
              <div class="line-wrapper">
                <simple-line :value="currentMetricsLogs.received_rate" type="bar" color="#3D7FF9" />
              </div>
            </div>
            <div class="rate-item">
              <div>
                <label class="rate-label">{{ $t('Dashboard.currentMessageOutRate') }}</label>
                <span>{{ _formatNumber(currentMetrics.sent_rate) }}</span>
                <span class="unit">{{ $t('Dashboard.strip') }}/{{ $t('Dashboard.second') }}</span>
              </div>
              <div class="line-wrapper">
                <simple-line :value="currentMetricsLogs.sent_rate" type="bar" color="#5D4EFF" />
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
                <simple-line
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
                <simple-line
                  :value="currentMetricsLogs.sent_bytes_rate"
                  type="bar"
                  color="#5D4EFF"
                />
              </div>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <h2>{{ $t('Dashboard.networkGraph') }}</h2>
    <el-card class="cluster-card block">
      <NodesGraphCard class="nodes-graph" />
    </el-card>
    <polyline-cards></polyline-cards>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Overview',
})
</script>

<script setup lang="ts">
import { ref, reactive, onUnmounted, Ref } from 'vue'
import SimpleLine from './components/SimpleLine.vue'
import PolylineCards from './components/PolylineCards.vue'
import NodesGraphCard from './components/NodesGraphCard.vue'
import Moment from 'moment'
import { loadCurrentMetrics } from '@/api/common'

interface MetricData {
  x: Array<string>
  y: Array<number>
}

const interval = ref(2000)

const currentMetricsLogs: Record<string, MetricData> = reactive({
  received_rate: {
    x: Array(32).fill('N/A'),
    y: Array(32).fill(0),
  },
  sent_rate: {
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
  received_rate: 0, // Incomming Rate
  sent_rate: 0, // Outgoing Rate
  received_bytes_rate: 0, // Incomming Bytes Rate
  sent_bytes_rate: 0, // Outgoing Bytes Rate
  subscriptions: 0, // Subs number
  connections: 0, // Connections number
  topics: 0, // Topics
})
let timerData: undefined | number = undefined

const rateType = ref<'msg' | 'byte'>('msg')

const _formatNumber = (num: number) => {
  if (num === undefined) return 0
  let number = String(parseInt(num.toString()))
  return number.replace(/(\d{1,3})(?=(\d{3})+($|\.))/g, '$1,')
}

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
  ;['received_rate', 'sent_rate', 'received_bytes_rate', 'sent_bytes_rate'].forEach((key) => {
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
  })
}

loadData()

const setInterval = () => {
  clearInterval(timerData)
  timerData = window.setInterval(() => {
    loadData()
  }, interval.value)
}

setInterval()

onUnmounted(() => {
  clearInterval(timerData)
})
</script>

<style lang="scss">
.overview {
  .main-info-card.el-card {
    height: 195px;
    .el-card__body {
      padding: 36px;
      .main-info-item {
        p {
          font-size: 16px;
          color: var(--color-text-secondary);
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
      .simple-line {
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
