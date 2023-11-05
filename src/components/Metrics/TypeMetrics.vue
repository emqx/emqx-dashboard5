<template>
  <el-card class="type-metrics">
    <transition name="slide-fade-back">
      <div class="side front" v-if="!showBack">
        <div class="side-main">
          <div class="front-hd">
            <i class="dot-type"></i>
            <p class="metric-name">{{ data.title }}</p>
          </div>
          <div class="front-body">
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
        <div class="side-trigger" @click="toggleShow">
          <el-icon class="icon-arrow" :size="20"><ArrowRight /></el-icon>
        </div>
      </div>
    </transition>
    <transition name="slide-fade">
      <div class="back-wrap" v-if="showBack">
        <div class="side back">
          <div class="side-trigger" @click="toggleShow">
            <el-icon class="icon-arrow" :size="20"><ArrowRight /></el-icon>
          </div>
          <div class="side-main">
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
                </el-descriptions>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </transition>
  </el-card>
</template>

<script setup lang="ts">
import { formatNumber } from '@/common/tools'
import { ArrowRight } from '@element-plus/icons-vue'
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

const showBack = ref(false)
const toggleShow = () => (showBack.value = !showBack.value)

const diff = ref(0)
watch(
  () => props.data.count,
  (newVal, oldVal) => {
    if (oldVal !== undefined && newVal !== undefined) {
      diff.value = newVal - oldVal
    }
  },
)
</script>

<style lang="scss">
.type-metrics {
  position: relative;
  user-select: none;

  .el-card__body {
    padding: 0;
    height: 100%;
    line-height: 1;
  }
  .side {
    display: flex;
    height: 100%;
  }
  .front {
    padding: 30px 24px;
  }
  .back {
    padding: 0 0 0 24px;
  }
  .desc-container {
    padding: 30px 24px 30px 0;
  }
  .front-hd {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .dot-type {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: v-bind(typeColor);
    margin-right: 8px;
  }

  .num-container {
    display: flex;
    .metric-num {
      margin-right: 8px;
    }
  }
  .num-diff {
    color: var(--color-primary);
    line-height: 24px;
    &.is-red {
      color: #469cf7;
    }
    &.need-plus {
      &:before {
        content: '+';
        margin-right: 2px;
      }
    }
  }

  .side-trigger {
    display: flex;
    align-items: center;
    width: 20px;
  }
  .side-main {
    flex-grow: 1;
  }
  .back-wrap {
    // display: none;
    height: 100%;
  }
  .back {
    background: var(--color-bg);
    .side-trigger {
      margin-right: 20px;
    }
    .icon-arrow {
      transform: rotate(180deg);
      color: var(--color-text-placeholder);
    }
  }
  .icon-arrow {
    position: relative;
    cursor: pointer;
    padding: 2px;
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

  // &:hover {
  //   .front {
  //     display: none;
  //   }
  //   .back-wrap {
  //     display: block;
  //   }
  // }
  .slide-fade-enter-active,
  .slide-fade-back-leave-active {
    transition: all 0.25s ease-out;
  }

  .slide-fade-leave-active,
  .slide-fade-back-enter-active {
    transition: all 0.05s ease-out;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(60px);
    opacity: 0.6;
  }
  .slide-fade-back-enter-from,
  .slide-fade-back-leave-to {
    transform: translateX(-60px);
    opacity: 0.6;
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

  .el-descriptions__body .el-descriptions__table .el-descriptions__cell {
    line-height: 21px;
  }
  .el-descriptions .el-descriptions__label,
  .icon-question {
    color: var(--color-text-placeholder);
  }
  .icon-question {
    margin-left: 2px;
  }
  .el-descriptions .el-descriptions__content {
    color: var(--color-bg-content);
  }
}
</style>
