<template>
  <div class="metrics app-wrapper">
    <div class="header-block">
      <div class="header-item">
        <h2>{{ tl('dataList') }}</h2>
        <p class="tip">{{ tl('packetStatisticsOfNodes') }}</p>
      </div>
      <div class="header-item">
        <el-select class="node-select" v-model="currentNode" :placeholder="$t('Clients.node')">
          <el-option :label="$t('BasicConfig.cluster')" :value="CLUSTER_VALUE" />
          <el-option v-for="node in nodeOpts" :key="node" :label="node" :value="node" />
        </el-select>
      </div>
    </div>
    <el-row class="content-block" :gutter="26">
      <el-col :span="8">
        <el-card class="top-border table-card client">
          <el-table :data="filterMetrics(currentMetrics, 'client')" v-loading.lock="isDataLoading">
            <el-table-column prop="m" min-width="160" :label="tl('client')" />
            <el-table-column prop="v" sortable class-name="sortable-without-header-text" />
          </el-table>
        </el-card>
        <el-card class="top-border table-card packets">
          <el-table :data="filterMetrics(currentMetrics, 'packets')" v-loading.lock="isDataLoading">
            <el-table-column prop="m" min-width="160" :label="tl('mqttPackets')" />
            <el-table-column prop="v" sortable class-name="sortable-without-header-text" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="top-border table-card delivery">
          <el-table
            :data="filterMetrics(currentMetrics, 'delivery')"
            v-loading.lock="isDataLoading"
          >
            <el-table-column prop="m" min-width="160" label="Delivery" />
            <el-table-column prop="v" sortable class-name="sortable-without-header-text" />
          </el-table>
        </el-card>
        <el-card class="top-border table-card messages">
          <el-table
            :data="filterMetrics(currentMetrics, 'messages')"
            v-loading.lock="isDataLoading"
          >
            <el-table-column prop="m" min-width="160" :label="tl('messageNumber')" />
            <el-table-column prop="v" sortable class-name="sortable-without-header-text" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="top-border table-card session">
          <el-table :data="filterMetrics(currentMetrics, 'session')" v-loading.lock="isDataLoading">
            <el-table-column prop="m" min-width="160" :label="tl('session')" />
            <el-table-column prop="v" sortable class-name="sortable-without-header-text" />
          </el-table>
        </el-card>
        <el-card class="top-border table-card bytes">
          <el-table :data="filterMetrics(currentMetrics, 'bytes')" v-loading.lock="isDataLoading">
            <el-table-column prop="m" min-width="160" :label="tl('traffic')" />
            <el-table-column prop="v" sortable class-name="sortable-without-header-text" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { ComputedRef, defineComponent } from 'vue'

export default defineComponent({
  name: 'Metrics',
})
</script>

<script setup lang="ts">
import { onMounted, ref, Ref, computed } from 'vue'
import { loadMetrics } from '@/api/common'
import useI18nTl from '@/hooks/useI18nTl'
import { NodeStatisticalData } from '@/types/dashboard'

interface MetricItem {
  [propName: string]: string | number
}

const nodeOpts: Ref<Array<string>> = ref([])
const CLUSTER_VALUE = 'cluster'
let currentNode: Ref<string> = ref(CLUSTER_VALUE)

let isDataLoading: Ref<boolean> = ref(true)

const clusterMetrics: Ref<NodeStatisticalData> = ref({} as NodeStatisticalData)
const nodeMetricsData: Ref<Array<NodeStatisticalData>> = ref([])

const currentMetrics: ComputedRef<NodeStatisticalData> = computed(() => {
  if (currentNode.value !== CLUSTER_VALUE) {
    const nodeData = nodeMetricsData.value.find((item) => item.node === currentNode.value)
    return nodeData ? nodeData : ({} as NodeStatisticalData)
  } else {
    return clusterMetrics.value
  }
})

const { tl } = useI18nTl('Dashboard')

const loadClusterMetricsData = async () => {
  try {
    clusterMetrics.value = (await loadMetrics(true)) as NodeStatisticalData
  } catch (error) {
    //
  }
}

const loadNodeMetricsData = async () => {
  try {
    nodeMetricsData.value = (await loadMetrics(false)) as Array<NodeStatisticalData>
    nodeOpts.value = nodeMetricsData.value.map(({ node }) => node)
  } catch (error) {
    //
  }
}

const loadMetricsData = async () => {
  try {
    await Promise.all([loadClusterMetricsData(), loadNodeMetricsData()])
  } catch (error) {
    //
  } finally {
    isDataLoading.value = false
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
