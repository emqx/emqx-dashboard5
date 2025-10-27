<template>
  <el-col v-if="!isFlowNode" :span="span">
    <el-card class="metric-types">
      <el-row :gutter="0">
        <el-col
          v-for="stat in data"
          :key="stat.type"
          :span="typeColSpan"
          class="col-type-metrics"
          :style="colExtraStyle"
        >
          <!-- set key to eliminate the diff when change node -->
          <TypeMetricsItem :data="stat" :type="stat.type" :key="selectedNode" />
        </el-col>
      </el-row>
    </el-card>
  </el-col>
  <el-col v-else :span="span">
    <div class="metric-types">
      <el-row :gutter="24">
        <el-col v-for="stat in data" :key="stat.type" :span="12" class="flow-node-col">
          <el-card class="card-type-metrics">
            <!-- set key to eliminate the diff when change node -->
            <TypeMetricsItem :data="stat" :type="stat.type" :key="selectedNode" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-col>
</template>

<script setup lang="ts">
import { TypeMetricDataItem } from '@/hooks/useMetrics'
import { isArray } from 'lodash'
import { defineProps } from 'vue'
import TypeMetricsItem from './TypeMetricsItem.vue'

const props = defineProps<{
  data: Array<TypeMetricDataItem>
  isFlowNode: boolean
  selectedNode: string
  span?: number
}>()

const getTypeColSpan = (typeStats: TypeMetricDataItem[]) => {
  if (!typeStats || !isArray(typeStats) || typeStats.length === 0) {
    return 0
  }
  return 24 / typeStats.length
}
const typeColSpan = computed(() => getTypeColSpan(props.data))
const colExtraStyle = computed(() => {
  if (typeColSpan.value % 0 === 0) {
    return {}
  }
  return { flexGrow: 1, flexShrink: 0, width: (1 / props.data.length) * 100 + '%' }
})
</script>
