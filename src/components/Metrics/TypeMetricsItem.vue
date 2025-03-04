<template>
  <div class="type-metrics">
    <div class="metrics-main">
      <div class="metrics-hd">
        <i class="dot-type"></i>
        <p class="metric-name">{{ data.title }}</p>
        <InfoTooltip v-if="hasNoDetails && oneDetailData.desc" :content="oneDetailData.desc" />
      </div>
      <div class="metrics-body">
        <div class="num-container">
          <p class="metric-num">{{ formatNumber(data.count) }}</p>
          <span
            v-if="diff && data.count !== undefined"
            class="num-diff"
            :class="{ 'is-red': diff < 0, 'need-plus': diff > 0 }"
          >
            {{ formatNumber(diff) }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="!hasNoDetails" class="detail-trigger">
      <el-tooltip effect="dark" placement="bottom" trigger="click">
        <template #content>
          <div class="metrics-details">
            <el-scrollbar>
              <div class="desc-container">
                <el-descriptions :column="2">
                  <el-descriptions-item v-for="{ value, label, desc } in data.detail" :key="label">
                    <template #label>
                      {{ label }}
                      <template v-if="desc">
                        <InfoTooltip :content="desc" />
                      </template>
                    </template>
                    {{ value }}
                  </el-descriptions-item>
                  <!-- for align number -->
                  <el-descriptions-item v-if="data.detail.length % 2 === 1" />
                </el-descriptions>
              </div>
            </el-scrollbar>
          </div>
        </template>
        <el-icon class="icon-arrow" :size="18"><MoreFilled /></el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/common/tools'
import { MoreFilled } from '@element-plus/icons-vue'
import { computed, defineProps, PropType, ref, watch } from 'vue'
import { MetricType, TYPE_COLOR_MAP } from '@/hooks/useMetrics'
import InfoTooltip from '../InfoTooltip.vue'

interface DetailItem {
  label: string
  desc?: string
  value: number
}

interface MetricTypeData {
  title: string
  count?: number
  detail: Array<DetailItem>
}

const props = defineProps({
  type: {
    type: Number as PropType<MetricType>,
    default: MetricType.Green,
  },
  data: {
    type: Object as PropType<MetricTypeData>,
    default: () => ({ detail: [] }),
  },
})
const typeColor = computed(() => TYPE_COLOR_MAP[props.type])

const hasNoDetails = computed(() => props.data.detail.length === 1)

const oneDetailData = computed<DetailItem>(() => props.data.detail[0])

const diff = ref(0)
watch(
  () => props.data,
  (newVal, oldVal) => {
    if (oldVal?.count !== undefined && newVal?.count !== undefined) {
      diff.value = newVal.count - oldVal.count
    }
  },
)
</script>

<style lang="scss">
.type-metrics {
  display: flex;
  user-select: none;
  padding: 40px 32px;
  .desc-container {
    padding: 30px 24px 30px 0;
  }
  .metrics-main {
    flex-grow: 1;
  }
  .metrics-hd {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .dot-type {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: v-bind(typeColor);
    margin-right: 8px;
  }

  .metric-name {
    margin-right: 6px;
  }

  .detail-trigger {
    display: flex;
    align-items: center;
    width: 20px;
  }
  .side-main {
    flex-grow: 1;
  }
  .icon-arrow {
    position: relative;
    cursor: pointer;
    padding: 2px;
    transform: rotate(90deg);
    color: var(--color-text-secondary);
    opacity: 0.7;
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: block;
      width: 0;
      height: 0;
      border-radius: 50%;
      transition: all 0.15s ease-out;
      background: #aebcd444;
    }
    &:hover::after {
      width: 28px;
      height: 28px;
    }
  }
}
.el-popper:not(.el-select__popper):not(.el-picker__popper):not(.is-wider):not(.el-cascader__dropdown):not(.el-autocomplete__popper) {
  &.type-detail-tooltip {
    max-width: 700px;
  }
}
.metrics-details {
  padding: 16px;
  .el-descriptions {
    background: transparent;
  }
  .el-descriptions__body {
    background-color: transparent;
  }

  .el-descriptions
    .el-descriptions__body
    .el-descriptions__table:not(.is-bordered)
    .el-descriptions__cell {
    padding-bottom: 6px;
  }

  .el-descriptions
    .el-descriptions__body
    .el-descriptions__table:not(.is-bordered)
    tr:last-child
    .el-descriptions__cell {
    padding-bottom: 0;
  }

  .el-descriptions .el-descriptions__content {
    float: right;
    padding-right: 8px;
    color: #fff;
  }

  .el-descriptions__body .el-descriptions__table .el-descriptions__cell {
    line-height: 21px;
  }

  .el-descriptions .el-descriptions__label,
  .icon-question {
    color: #bac1cd;
  }
  .icon-question {
    margin-left: 2px;
  }
}
</style>
