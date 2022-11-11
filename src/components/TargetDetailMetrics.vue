<template>
  <el-row :gutter="28" class="target-detail-metrics">
    <el-col :span="6" v-for="{ label, value, className, desc, unit } in metrics" :key="label">
      <el-card :class="className">
        <p class="statistic-label">
          <span>{{ label }}</span>
          <InfoTooltip v-if="desc" :content="desc" />
        </p>
        <p class="statistic-num">
          {{ formatNumber(value) }}
          <span class="unit" v-if="unit">{{ unit }}</span>
        </p>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { formatNumber } from '@/common/tools'
import { defineProps, PropType } from 'vue'
import InfoTooltip from '@/components/InfoTooltip.vue'

interface MetricItem {
  label: string
  value: number | undefined
  className: string
  desc?: string
  unit?: string
}

defineProps({
  metrics: {
    type: Array as PropType<Array<MetricItem>>,
    default: () => [],
  },
})
</script>

<style lang="scss"></style>
