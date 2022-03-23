<template>
  <div class="overview app-wrapper">
    <div class="basic-info">
      <el-row class="basic-graph">
        <el-col :span="12">
          <el-card shadow="never" class="app-card">
            <div class="app-card-title">
              {{ $t('Dashboard.connectionsTips') }}
            </div>
            <div class="content">
              <span>{{ _formatNumber(currentMetrics.connections) }}</span>
              <el-progress
                class="status-progress"
                :stroke-width="24"
                :percentage="licensePercentage"
                :format="() => ''"
              ></el-progress>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="never" class="app-card">
            <div class="app-card-title">
              {{ $t('Dashboard.subscriptionNumber') }}
            </div>
            <div class="content">
              <span>{{ _formatNumber(currentMetrics.subscriptions) }}</span>
              <div class="flux-wrapper">
                <simple-line :value="currentMetricsLogs.subscriptions" color="#58afff" type="bar" />
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="never" class="app-card">
            <div class="app-card-title">
              {{ $t('Dashboard.currentMessageInRate') }}
            </div>
            <div class="content">
              <span>{{ currentMetrics.received_rate }}</span>
              <span class="unit">{{ $t('Dashboard.strip') }}/{{ $t('Dashboard.second') }}</span>
              <div class="flux-wrapper">
                <simple-line :value="currentMetricsLogs.received_rate" type="bar" />
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="never" class="app-card">
            <div class="app-card-title">
              {{ $t('Dashboard.currentMessageOutRate') }}
            </div>
            <div class="content">
              <span>{{ currentMetrics.sent_rate }}</span>
              <span class="unit">{{ $t('Dashboard.strip') }}/{{ $t('Dashboard.second') }}</span>
              <div class="flux-wrapper">
                <simple-line :value="currentMetricsLogs.sent_rate" type="bar" color="#34c388" />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <nodes-graph class="nodes-graph"></nodes-graph>
    </div>
    <polyline-cards></polyline-cards>

    <div v-if="false" class="license-card">
      <div class="lisence-title">{{ $t('Dashboard.license') }}</div>

      <ul class="license-field">
        <li v-if="license.customer_type !== evaluation" class="item">
          <span class="key">{{ $t('Dashboard.customer') }}:</span>
          <span class="value">{{ license.customer }}</span>
        </li>

        <li class="item">
          <span class="key">
            {{ $t('Dashboard.numberOfConnectionLines') }}:
            {{ formatConnection }}
          </span>
          <div class="content">
            <el-progress
              :stroke-width="16"
              :format="() => ''"
              :percentage="licensePercentage"
              :color="getProgressColor(licensePercentage, '#00A890FF')"
            ></el-progress>
          </div>
        </li>
        <template v-if="license.customer_type !== evaluation">
          <li class="item">
            <span class="key">{{ $t('Dashboard.issuanceOfEmail') }}:</span>
            <span class="value">{{ license.email }}</span>
          </li>

          <li class="item">
            <span class="key">{{ $t('Dashboard.issuedAt') }}:</span>
            <span class="value broker">{{ license.issued_at }}</span>
          </li>

          <li class="item">
            <span class="key">{{ $t('Dashboard.expireAt') }}:</span>
            <span class="value broker">{{ license.expiry_at }}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Overview',
})
</script>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted, Ref } from 'vue'
import SimpleLine from './components/SimpleLine.vue'
import PolylineCards from './components/PolylineCards.vue'
import NodesGraph from './components/NodesGraph.vue'
import Moment from 'moment'
import { loadCurrentMetrics } from '@/api/common'
import { calcPercentage, getProgressColor } from '@/common/utils'

interface MetricData {
  x: Array<string>
  y: Array<number>
}

const evaluation: Ref<number> = ref(10)

let license: Record<string, number | boolean> = reactive({})
const currentMetricsLogs: Record<string, MetricData> = reactive({
  received_rate: {
    x: Array(32).fill('N/A'),
    y: Array(32).fill(0),
  },
  sent_rate: {
    x: Array(32).fill('N/A'),
    y: Array(32).fill(0),
  },
  subscriptions: {
    x: Array(32).fill('N/A'),
    y: Array(32).fill(0),
  },
})
const currentMetrics: Ref<Record<string, number>> = ref({
  node: 0, // 节点数
  received_rate: 0, // 消息 in 速率
  sent_rate: 0, // 消息 out 速率
  subscriptions: 0, // 订阅数
  connections: 0, // 连接数
})
let timerData: undefined | number = undefined

const licensePercentage = computed(() => {
  const { connections } = currentMetrics.value
  const { max_connections } = license
  return calcPercentage(connections, max_connections)
})

const formatConnection = computed(() => {
  const { connections } = currentMetrics.value
  const { max_connections } = license
  return `${_formatNumber(connections)} / ${_formatNumber(max_connections as number)}`
})

const _formatNumber = (num: number) => {
  let number = String(parseInt(num.toString()))
  return number.replace(/(\d{1,3})(?=(\d{3})+($|\.))/g, '$1,')
}

const loadData = async () => {
  const state = await loadCurrentMetrics().catch(() => {})
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
  ;['received_rate', 'sent_rate', 'subscriptions'].forEach((key) => {
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

timerData = setInterval(() => {
  loadData()
}, 2 * 1000)

onUnmounted(() => {
  clearInterval(timerData)
})
</script>

<style lang="scss" scoped>
.basic-info {
  display: flex;
  .basic-graph,
  .nodes-graph {
    overflow: hidden;
    width: 50%;
  }
  .nodes-graph {
    margin: 10px;
    border: 1px solid #ececef;
  }
}
.app-card {
  margin: 10px;

  .app-card-title {
    font-size: 14px;
    margin-bottom: 15px;
    color: rgba(0, 0, 0, 0.4);
  }

  .content {
    color: rgba(0, 0, 0, 0.85);
    min-height: 90px;
    font-size: 30px;
    position: relative;

    .unit {
      font-size: 14px;
      margin-left: 2px;
    }

    .flux-wrapper {
      width: 100%;
      box-sizing: border-box;

      :deep(.simple-line) {
        box-sizing: border-box;
        height: 32px;
      }
    }

    .charts {
      margin-top: 6px;
    }
  }
}
.tip-checkbox {
  margin-top: 20px;
  .el-checkbox {
    color: #aaa;
  }
}
</style>
