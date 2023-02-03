<template>
  <div class="target-detail-metrics">
    <el-row :gutter="28" v-for="(group, $index) in slicedMetrics" :key="$index">
      <el-col :span="6" v-for="{ label, value, className, desc, unit } in group" :key="label">
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
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/common/tools'
import { defineProps, PropType, computed } from 'vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { chunk } from 'lodash'

interface MetricItem {
  label: string
  value: number | undefined
  className: string
  desc?: string
  unit?: string
}

const props = defineProps({
  metrics: {
    type: Array as PropType<Array<MetricItem>>,
    default: () => [],
  },
})

const slicedMetrics = computed(() => {
  return chunk(props.metrics, 4)
})
</script>

<style lang="scss">
.target-detail-metrics {
  .el-col-6 {
    display: flex;
    flex-direction: column;
    .el-card {
      flex-grow: 1;
    }
  }
  .statistic-label {
    position: relative;
    display: inline-block;
    padding-right: 20px;
    .icon-question {
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
