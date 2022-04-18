<template>
  <div class="metrics app-wrapper">
    <div class="header-block">
      <div class="header-item">
        <h2>{{ tl('dataList') }}</h2>
        <p class="tip">{{ tl('packetStatisticsOfNodes') }}</p>
      </div>
      <div class="header-item">
        <emq-select
          class="node-select"
          v-model:value="currentNode"
          :field="{ options: metrics }"
          :field-name="{ label: 'node', value: 'node' }"
          @change="changeNode"
        />
      </div>
    </div>
    <el-row class="content-block" :gutter="26">
      <el-col :span="8">
        <el-card class="top-border table-card client">
          <el-table
            :data="filterMetrics(metricsObj[currentNode], 'client')"
            v-loading.lock="lockTable"
          >
            <el-table-column prop="m" :label="tl('client')" />
            <el-table-column prop="v" sortable class-name="sortable-without-header-text" />
          </el-table>
        </el-card>
        <el-card class="top-border table-card packets">
          <el-table
            :data="filterMetrics(metricsObj[currentNode], 'packets')"
            v-loading.lock="lockTable"
          >
            <el-table-column prop="m" :label="tl('mqttPackets')" />
            <el-table-column prop="v" sortable class-name="sortable-without-header-text" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="top-border table-card delivery">
          <el-table
            :data="filterMetrics(metricsObj[currentNode], 'delivery')"
            v-loading.lock="lockTable"
          >
            <el-table-column prop="m" label="Delivery" />
            <el-table-column prop="v" sortable class-name="sortable-without-header-text" />
          </el-table>
        </el-card>
        <el-card class="top-border table-card messages">
          <el-table
            :data="filterMetrics(metricsObj[currentNode], 'messages')"
            v-loading.lock="lockTable"
          >
            <el-table-column prop="m" :label="tl('messageNumber')" />
            <el-table-column prop="v" sortable class-name="sortable-without-header-text" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="top-border table-card session">
          <el-table
            :data="filterMetrics(metricsObj[currentNode], 'session')"
            v-loading.lock="lockTable"
          >
            <el-table-column prop="m" :label="tl('session')" />
            <el-table-column prop="v" sortable class-name="sortable-without-header-text" />
          </el-table>
        </el-card>
        <el-card class="top-border table-card bytes">
          <el-table
            :data="filterMetrics(metricsObj[currentNode], 'bytes')"
            v-loading.lock="lockTable"
          >
            <el-table-column prop="m" min-width="120" :label="tl('traffic')" />
            <el-table-column prop="v" sortable class-name="sortable-without-header-text" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Metrics',
})
</script>

<script setup lang="ts">
import { onMounted, reactive, ref, Ref } from 'vue'
import { loadMetrics } from '@/api/common'
import useI18nTl from '@/hooks/useI18nTl'

interface MetricItem {
  [propName: string]: string | number
}

let metrics: Array<MetricItem> = reactive([])
let metricsObj: Record<string, MetricItem> = reactive({})
let currentNode: Ref<string> = ref('')
let lockTable: Ref<boolean> = ref(true)
const { tl } = useI18nTl('Dashboard')

const loadMetricsData = async () => {
  let metricsArr: Array<MetricItem> = await loadMetrics().catch(() => [])
  lockTable.value = false
  metricsArr?.forEach((v) => {
    metrics.push(v)
  })

  if (metrics.length) {
    currentNode.value = metrics[0].node as string
    metrics.forEach((v) => {
      metricsObj[v.node] = v
    })
  }
}

function filterMetrics(data: MetricItem, key: string) {
  let keys: Array<{ m: string; v: number }> = []
  Object.keys(data || []).forEach((v) => {
    if (v.startsWith(key)) {
      keys.push({ m: v.split('.').slice(1).join('.'), v: data[v] as number })
    }
  })
  return keys
}

const changeNode = (n: string) => {
  currentNode.value = n
}

onMounted(() => {
  loadMetricsData()
})
</script>

<style lang="scss">
.metrics {
  .header-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    h2 {
      margin-bottom: 16px;
    }
    .node-select.el-select {
      width: 320px;
    }
  }
  .content-block {
    .el-card {
      &.top-border.client {
        &:before {
          background: #00b299;
        }
      }
      &.top-border.delivery {
        &:before {
          background: #66cfda;
        }
      }
      &.top-border.session {
        &:before {
          background: #5d4eff;
        }
      }
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
}
</style>
