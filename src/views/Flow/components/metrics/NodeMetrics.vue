<template>
  <div class="node-metrics" v-loading="isInitializing">
    <div class="metrics-hd">
      <el-tooltip :content="t('Base.refresh')" placement="top">
        <el-button class="icon-button" type="primary" :icon="Refresh" @click="handleRefresh">
        </el-button>
      </el-tooltip>
    </div>
    <el-card class="metrics-block">
      <div class="block-hd">
        <p class="block-title">{{ t('Base.statistics') }}</p>
      </div>
      <div class="block-bd">
        <el-row :gutter="32">
          <el-col :span="12" class="pie-block">
            <div class="pie-container">
              <div class="pie-chart" ref="ChartEle"></div>
              <div class="pie-legend">
                <p class="legend-text">{{ getMetricItemLabel(totalKey) }}</p>
                <p class="legend-num num">{{ formatNumber(currentMetrics[totalKey]) }}</p>
              </div>
            </div>
          </el-col>
          <el-col :span="12" class="metric-types">
            <el-collapse>
              <el-collapse-item v-for="item in typeMetricsData" :key="item.type">
                <template #title>
                  <div class="type-hd space-between">
                    <div class="vertical-align-center">
                      <i class="dot-type" :style="{ backgroundColor: getTypeColor(item.type) }"></i>
                      <p class="metric-name">{{ item.title }}</p>
                    </div>
                    <p class="type-count num">{{ item.count }}</p>
                  </div>
                </template>
                <el-descriptions :column="1">
                  <el-descriptions-item v-for="{ value, label, desc } in item.detail" :key="label">
                    <template #label>
                      {{ label }}
                      <template v-if="desc">
                        <InfoTooltip :content="desc" />
                      </template>
                    </template>
                    {{ value }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="metrics-block">
      <div class="block-hd">
        <p class="block-title">{{ t('Base.rateIndicators') }}</p>
      </div>
      <div class="block-bd">
        <div class="bar-container">
          <div class="bar-legend">
            <p class="legend-text">{{ getMetricItemDesc(rateDataKeys.current) }}:</p>
            <p class="legend-num num">
              <span class="num">{{ formatNumber(currentMetrics[rateDataKeys.current]) }}</span>
              <span class="unit">
                {{ t(rateDataKeys.unitKey, currentMetrics[rateDataKeys.current]) }}
              </span>
            </p>
          </div>
          <div class="bar-chart" ref="BarChartEle"></div>
        </div>
        <div class="rate-data">
          <el-row>
            <el-col :span="12">
              <div class="data-item">
                <label class="item-label">{{ getMetricItemLabel(rateDataKeys.right1) }}</label>
                <span class="item-value num">
                  <span class="num">
                    {{ formatNumber(currentMetrics[rateDataKeys.right1]) }}
                  </span>
                  <span class="unit">
                    {{ t(rateDataKeys.unitKey, currentMetrics[rateDataKeys.right1]) }}
                  </span>
                </span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="data-item">
                <label class="item-label">{{ getMetricItemLabel(rateDataKeys.right2) }}</label>
                <span class="item-value num">
                  <span class="num">
                    {{ formatNumber(currentMetrics[rateDataKeys.right2]) }}
                  </span>
                  <span class="unit">
                    {{ t(rateDataKeys.unitKey, currentMetrics[rateDataKeys.right2]) }}
                  </span>
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { queryBridgeMetrics, queryRuleMetrics } from '@/api/ruleengine'
import { formatNumber } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { FlowNodeType, ProcessingType } from '@/hooks/Flow/useFlowNode'
import useI18nTl from '@/hooks/useI18nTl'
import {
  TYPE_COLOR_MAP,
  TypeMapData,
  TypeMetricDataItem,
  useBridgeMetrics,
  useChartDataUtils,
  usePieChart,
  MetricType,
  useRateChart,
} from '@/hooks/useMetrics'
import useSyncPolling from '@/hooks/useSyncPolling'
import { Refresh } from '@element-plus/icons-vue'
import { Node } from '@vue-flow/core'
import { ComputedRef, Ref, computed, defineProps, ref } from 'vue'
import { Metrics, MetricsDataWithExtraData, NodeMetrics } from '@/types/common'

type MetricsData = MetricsDataWithExtraData<unknown>

const props = defineProps<{
  node?: Node
}>()

const isRuleMetrics = computed(() => {
  return (
    props.node &&
    props.node?.type === FlowNodeType.Default &&
    props.node?.data?.specificType === ProcessingType.Function
  )
})
const { t, tl } = useI18nTl('RuleEngine')

const isInitializing = ref(false)
const metricsData: Ref<MetricsData> = ref({ metrics: {}, node_metrics: [] as Array<NodeMetrics> })
const currentMetrics = computed(() => metricsData.value.metrics)

const {
  typeMetricsMaps: bridgeTypeMetricsMap,
  textMap: bridgeTextMap,
  rateData: bridgeRateData,
} = useBridgeMetrics()

const requestMetrics = () => {
  if (!props.node) {
    return
  }
  if (isRuleMetrics.value) {
    return queryRuleMetrics(props.node.data.formData.id)
  }
  return queryBridgeMetrics(props.node.data.formData.id)
}
// TODO:
const totalKey = computed(() => (isRuleMetrics.value ? 'TODO:' : 'matched'))
const typeMetricsMaps = computed(() => (isRuleMetrics.value ? {} : bridgeTypeMetricsMap))
const textMap: ComputedRef<Record<string, { label: string; desc?: string }>> = computed(() =>
  isRuleMetrics.value ? {} : bridgeTextMap,
)
const rateDataKeys = computed(() => (isRuleMetrics.value ? bridgeRateData : bridgeRateData))

const getMetricItemLabel = (key: string) => textMap.value[key]?.label || key
const getMetricItemDesc = (key: string) => textMap.value[key]?.desc || ''

const {
  generatePieData,
  createEmptyRateData,
  addRateDataItem,
  generateMetricTypeData: generateMetricTypeDataFunc,
  generateEmptyMetricTypeData,
} = useChartDataUtils()

/* TYPE METRICS */
const initTypeMetricsData = (): Array<TypeMetricDataItem> =>
  generateEmptyMetricTypeData(typeMetricsMaps.value)
const typeMetricsData: Ref<Array<TypeMetricDataItem>> = ref(initTypeMetricsData())
const generateMetricTypeData = (metrics: Metrics, typeMapData: TypeMapData) => {
  return generateMetricTypeDataFunc(metrics, typeMapData, textMap.value)
}

const getTypeColor = (type: MetricType) => TYPE_COLOR_MAP[type]

/* PIE */
let pieData = []

/* RATE */
const rateDataLength = 30
const getInitRateData = () => createEmptyRateData(rateDataLength)
let rateData = getInitRateData()
const updateRateData = (metrics: Metrics) => {
  const rate = metrics[rateDataKeys.value.current]
  return addRateDataItem(rate, rateData, rateDataLength)
}

const { ChartEle: BarChartEle, updateBarData } = useRateChart()
const { ChartEle, updatePieData } = usePieChart()
const updateToView = () => {
  const data = currentMetrics.value
  pieData = generatePieData(data, typeMetricsMaps.value)
  updatePieData(pieData)

  const { x, y } = updateRateData(data)
  updateBarData(x, y)

  typeMetricsData.value = generateMetricTypeData(data, typeMetricsMaps.value)
}

const getMetrics = async (toggleInit = false) => {
  try {
    if (toggleInit) {
      isInitializing.value = true
    }
    const data = await requestMetrics()
    if (data) {
      metricsData.value = data
      updateToView()
    }
  } catch (error) {
    //
  } finally {
    isInitializing.value = false
  }
}

const initMetrics = () => {
  rateData = getInitRateData()
  typeMetricsData.value = initTypeMetricsData()
}

const handleRefresh = () => {
  initMetrics()
  getMetrics(true)
}

const { syncPolling } = useSyncPolling()
;(() => {
  handleRefresh()
  syncPolling(getMetrics, 2000)
})()
</script>

<style lang="scss">
.node-metrics {
  padding-top: 8px;
  p {
    margin: 0;
  }
  .metrics-hd {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }
  .el-card {
    margin-bottom: 24px;
  }
  .num {
    margin-left: 6px;
    color: var(--color-title-primary);
  }
  .block-hd {
    margin-bottom: 24px;
  }
  .block-title {
    font-weight: 600;
  }
  .pie-block {
    display: flex;
    align-items: center;
    height: 208px;
  }
  .pie-container {
    position: relative;
    width: 100%;
    height: 112px;
    text-align: center;
  }
  .pie-chart {
    height: 100%;
  }
  .pie-legend {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    width: 100%;
    .legend-num {
      font-size: 24px;
      font-weight: 400;
      line-height: 32px;
    }
  }
  $dot-size: 8px;
  $dor-margin: 8px;
  .type-hd {
    width: 100%;
    .dot-type {
      display: block;
      width: $dot-size;
      height: $dot-size;
      border-radius: 50%;
      margin-right: $dor-margin;
    }
    .metric-name {
      font-weight: normal;
    }
  }
  $count-margin: 4px;
  .type-count {
    margin-right: $count-margin;
    font-size: 16px;
    font-weight: 400;
  }
  .el-collapse {
    border: none;
  }
  .el-collapse-item__arrow {
    transform: rotate(90deg);
    &.is-active {
      transform: rotate(270deg);
    }
  }
  .el-collapse-item {
    .el-collapse-item__header {
      border: none;
    }
    &:not(:last-child) {
      border-bottom: 1px solid var(--color-border-card);
    }
  }
  .el-collapse-item__content {
    padding-bottom: 0;
    padding-left: $dot-size + $dor-margin;
    padding-right: 14px + 8px + $count-margin;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }
  .el-collapse-item__header.focusing:focus:not(:hover) {
    color: inherit;
  }

  .el-descriptions__cell {
    display: flex;
    justify-content: space-between;
  }
  .icon-question {
    margin-left: 4px;
  }
  .bar-legend {
    display: flex;
    align-items: center;
    margin-bottom: 14px;

    .legend-num {
      font-weight: 400;
      .num {
        margin-right: 4px;
        font-size: 20px;
      }
    }
  }
  .bar-chart {
    height: 40px;
    margin-bottom: 24px;
  }
  .rate-data {
    .el-col:last-child {
      text-align: right;
    }
  }
}
</style>
