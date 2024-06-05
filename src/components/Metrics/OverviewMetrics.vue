<template>
  <div class="overview-metrics">
    <div class="metric-block">
      <div class="block-hd">
        <p class="block-title">{{ t('Base.statistics') }}</p>
        <div class="handlers-container">
          <el-select v-model="selectedNode" @change="handleNodeChange">
            <el-option
              v-for="{ value, label } in nodeOpts"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
          <el-tooltip :content="$t('Base.refresh')" placement="top">
            <el-button class="icon-button" type="primary" :icon="Refresh" @click="handleRefresh">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="requestReset" :content="tl('resetStatistics')" placement="top">
            <el-button class="icon-button" :icon="Close" @click="resetStatistics"></el-button>
          </el-tooltip>
        </div>
      </div>
      <!-- Stats -->
      <el-row
        :gutter="24"
        :class="['block-bd', 'stats-numbers', { 'flow-node-row': isFlowNode }]"
        v-for="(typeMetricsData, index) in typeMetricsDataSets"
        :key="index"
      >
        <!-- Pie Chart Stats -->
        <el-col v-if="totals && totals[typeMetricsData.name]" :span="isFlowNode ? 24 : 8">
          <el-card class="metric-pie">
            <el-row>
              <el-col :span="12" class="pie-base">
                <div>
                  <p class="metric-name">{{ getMetricItemLabel(totals[typeMetricsData.name]) }}</p>
                  <p class="metric-num">
                    {{ formatNumber(currentMetrics[totals[typeMetricsData.name]]) }}
                  </p>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="pie-container" :id="setChartId(typeMetricsData.name)"></div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <!-- Number Stats -->
        <TypeMetrics
          :data="typeMetricsData.stats"
          :is-flow-node="isFlowNode"
          :selected-node="selectedNode"
        />
      </el-row>
    </div>
    <!-- Rate Stats -->
    <div v-show="showRate" class="metric-block">
      <div class="block-hd">
        <p class="block-title">{{ t('Base.rateIndicators') }}</p>
      </div>
      <el-row :class="['block-bd', { 'flow-node-row': isFlowNode }]" :gutter="24">
        <el-col :span="isFlowNode ? 24 : 11">
          <el-card class="metric-bar">
            <div class="metric-bar-hd">
              <p class="metric-name">{{ getMetricItemLabel(rateMetrics.current) }}</p>
              <p class="metric-num">
                <span class="num">
                  {{ formatNumber(currentMetrics[rateMetrics.current]) }}
                </span>
                <span class="unit">
                  {{ t(rateMetrics.unitKey, currentMetrics[rateMetrics.current]) }}
                </span>
              </p>
            </div>
            <div class="metric-bar-bd">
              <!-- Bar Chart -->
              <div class="bar-container" id="bar-chart-rate"></div>
              <p class="bar-desc tip">{{ getMetricItemDesc(rateMetrics.current) }}</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="isFlowNode ? 24 : 13">
          <el-card class="metric-rate">
            <div v-if="rateMetrics.right1" class="metric-rate-item">
              <p class="metric-name">{{ getMetricItemLabel(rateMetrics.right1) }}</p>
              <p class="metric-num">
                <span class="num">
                  {{ formatNumber(currentMetrics[rateMetrics.right1]) }}
                </span>
                <span class="unit">
                  {{ t(rateMetrics.unitKey, currentMetrics[rateMetrics.right1]) }}
                </span>
              </p>
            </div>
            <div v-if="rateMetrics.right2" class="metric-rate-item">
              <p class="metric-name">{{ getMetricItemLabel(rateMetrics.right2) }}</p>
              <p class="metric-num">
                <span class="num">
                  {{ formatNumber(currentMetrics[rateMetrics.right2]) }}
                </span>
                <span class="unit">
                  {{ t(rateMetrics.unitKey, currentMetrics[rateMetrics.right2]) }}
                </span>
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- Children Stats -->
    <div class="metric-block" v-if="showChildrenStats">
      <div class="block-hd">
        <p class="block-title">
          {{ tl('action') }}
        </p>
      </div>
      <div v-for="(typeMetricsData, index) in typeMetricsDataSets" :key="index">
        <el-row
          :gutter="24"
          :class="['block-bd', 'stats-numbers', { 'flow-node-row': isFlowNode }]"
          v-for="(typeMetricsDataChild, index) in typeMetricsData.children"
          :key="index"
        >
          <!-- Pie Chart Stats -->
          <el-col v-if="totals && totals[typeMetricsDataChild.name]" :span="isFlowNode ? 24 : 8">
            <el-card class="metric-pie">
              <el-row>
                <el-col :span="12" class="pie-base">
                  <div>
                    <p class="metric-name">
                      {{ getMetricItemLabel(totals[typeMetricsDataChild.name]) }}
                    </p>
                    <p class="metric-num">
                      {{ formatNumber(currentMetrics[totals[typeMetricsDataChild.name]]) }}
                    </p>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="pie-container" :id="setChartId(typeMetricsDataChild.name)"></div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <!-- Number Stats -->
          <TypeMetrics
            :data="typeMetricsDataChild.stats"
            :is-flow-node="isFlowNode"
            :selected-node="selectedNode"
          />
        </el-row>
      </div>
    </div>
    <!-- Node Status Table -->
    <div class="metric-block" v-if="$slots.table && !isFlowNode">
      <div class="block-hd">
        <p class="block-title">
          {{ tl('nodeStatus') }} <InfoTooltip v-if="nodeStatusDesc" :content="nodeStatusDesc" />
        </p>
      </div>
      <div class="block-bd">
        <slot name="table" :data="metricsData"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useI18nTl from '@/hooks/useI18nTl'
import {
  TypeMapData,
  TypeMetricDataItem,
  useChartDataUtils,
  usePieChart,
  useRateChart,
} from '@/hooks/useMetrics'
import useSyncPolling from '@/hooks/useSyncPolling'
import { Metrics, MetricsDataWithExtraData, SetItem } from '@/types/common'
import { Close, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, defineProps, inject, ref } from 'vue'
import TypeMetrics from './TypeMetrics.vue'

type MetricsData = MetricsDataWithExtraData<unknown>

interface Rate {
  unitKey: string
  current: string
  right1: string
  right2: string
}

type TypeMetricsMap = {
  name: string
  data: TypeMapData
  children?: TypeMetricsMap[]
}

const props = defineProps<{
  requestMetrics: () => any
  requestReset?: () => any
  textMap: Record<string, { label: string; desc?: string }>
  showRate?: boolean
  /**
   * metric key for get total
   * Data chart will only be displayed if 'total' is provided.
   */
  totals?: Record<string, string>
  typeMetricsMaps: TypeMetricsMap[]
  rateMetrics: Rate
  /**
   * for confirm dialog
   */
  title?: string
  tableData?: Array<string>
  nodeStatusDesc?: string
}>()

// Special handling of metric styles under Flow nodes
const isFlowNode = inject('isFlowNode', false)

const { t, tl } = useI18nTl('RuleEngine')

const metricsData = ref<MetricsData>({ metrics: {}, node_metrics: [] })

const CLUSTER = 'cluster'
const clusterOpt = { label: t('BasicConfig.cluster'), value: CLUSTER }
const nodeOpts = computed(() => [
  clusterOpt,
  ...(metricsData.value?.node_metrics || []).map(({ node }) => ({ value: node, label: node })),
])
const selectedNode = ref(CLUSTER)
const handleNodeChange = () => {
  rateData = getInitRateData()
  updateToView()
}

const getMetricItemLabel = (key: string) => props.textMap[key]?.label || key
const getMetricItemDesc = (key: string) => props.textMap[key]?.desc || ''

const {
  generatePieData,
  createEmptyRateData,
  addRateDataItem,
  generateMetricTypeData: generateMetricTypeDataFunc,
  generateEmptyMetricTypeData,
} = useChartDataUtils()

const showChildrenStats = computed(() => {
  return props.typeMetricsMaps.some((typeMapData) => typeMapData.children)
})

/**
 * base on selectedNode
 */
const currentMetrics = computed<Metrics>(() => {
  const { metrics, node_metrics } = metricsData.value
  if (selectedNode.value === CLUSTER) {
    return metrics
  }
  return node_metrics.find(({ node }) => node === selectedNode.value)?.metrics || {}
})

/* TYPE METRICS */
const initTypeMetricsData = (typeMapData: TypeMapData): Array<TypeMetricDataItem> =>
  generateEmptyMetricTypeData(typeMapData)
// const typeMetricsData: Ref<Array<TypeMetricDataItem>> = ref(initTypeMetricsData())
const generateMetricTypeData = (metrics: Metrics, typeMapData: TypeMapData) => {
  return generateMetricTypeDataFunc(metrics, typeMapData, props.textMap)
}
const typeMetricsDataSets = ref<SetItem[]>([
  {
    name: '',
    stats: [],
  },
])

const handleInitTypeMetricsData = (typeMetricsMaps: TypeMetricsMap[]): SetItem[] => {
  return typeMetricsMaps.map((typeMapData) => {
    const children = typeMapData.children
      ? handleInitTypeMetricsData(typeMapData.children)
      : undefined

    return {
      name: typeMapData.name,
      stats: initTypeMetricsData(typeMapData.data),
      children,
    }
  })
}

typeMetricsDataSets.value = handleInitTypeMetricsData(props.typeMetricsMaps)

/* PIE */
let pieData = []
const setChartId = (name: string) => {
  return `pie-chart-${name}`
}
const { updatePieData } = usePieChart()

/* RATE */
const rateDataLength = 20
const { updateBarData } = useRateChart()
const getInitRateData = () => createEmptyRateData(rateDataLength)
let rateData = getInitRateData()
const updateRateData = (metrics: Metrics) => {
  const rate = metrics[props.rateMetrics.current]
  return addRateDataItem(rate, rateData, rateDataLength)
}

const updateToView = () => {
  const data = currentMetrics.value
  typeMetricsDataSets.value = []
  props.typeMetricsMaps.forEach((typeMapData) => {
    if (props.totals && props.totals[typeMapData.name]) {
      pieData = generatePieData(data, typeMapData.data)
      updatePieData(`pie-chart-${typeMapData.name}`, pieData)
    }
    const children = typeMapData.children
      ? typeMapData.children.map((child) => {
          const childPieData = generatePieData(data, child.data)
          updatePieData(`pie-chart-${child.name}`, childPieData)
          return {
            name: child.name,
            stats: generateMetricTypeData(data, child.data),
          }
        })
      : null

    typeMetricsDataSets.value.push({
      name: typeMapData.name,
      stats: generateMetricTypeData(data, typeMapData.data),
      children,
    })
  })
  if (props.rateMetrics) {
    const { x, y } = updateRateData(data)
    updateBarData('bar-chart-rate', x, y)
  }
}

const getMetrics = async () => {
  try {
    metricsData.value = await props.requestMetrics()
    updateToView()
  } catch (error) {
    //
  }
}

const initMetrics = () => {
  rateData = getInitRateData()
  typeMetricsDataSets.value = handleInitTypeMetricsData(props.typeMetricsMaps)
}

const handleRefresh = () => {
  initMetrics()
  getMetrics()
}

const resetStatistics = async () => {
  await ElMessageBox.confirm(t('RuleEngine.resetMetricsConfirm', { target: props.title }))
  if (props.requestReset) {
    await props.requestReset()
  }
  ElMessage.success(tl('resetSuccessfully'))
  initMetrics()
  getMetrics()
}

const { syncPolling } = useSyncPolling()
;(() => {
  syncPolling(getMetrics, 3000)
  getMetrics()
})()
</script>

<style lang="scss">
@use 'sass:math';

.overview-metrics {
  .stats-numbers {
    margin-bottom: 24px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  p {
    margin: 0;
  }
  .metric-name {
    color: var(--color-text-primary);
    line-height: 24px;
  }
  .metric-num {
    height: 32px;
    font-size: 22px;
    line-height: 32px;
    color: var(--color-title-primary);
    font-weight: 400;
  }
  .metric-num {
    .unit {
      margin-left: 2px;
      font-size: 14px;
      font-weight: 400;
      line-height: 32px;
      vertical-align: middle;
    }
  }
  .block-hd {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .block-title {
    font-weight: 600;
  }
  .handlers-container {
    display: flex;
    justify-content: flex-end;
  }
  .el-select {
    margin-right: 16px;
  }
  .block-bd {
    display: flex;
    align-items: stretch;
    &.flow-node-row {
      & > .el-col:not(:last-child) {
        margin-bottom: 24px;
      }
    }
  }
  .metric-block {
    margin-bottom: 24px;
  }
  $column-gap: 24px;
  .metric-pie {
    height: 144px;
    flex-shrink: 0;
    .el-card__body {
      display: flex;
      align-items: center;
      padding: 32px 24px;
      height: 100%;
    }
    .pie-base {
      display: flex;
      align-items: center;
    }
    .el-row {
      width: 100%;
    }
    .metric-name {
      margin-bottom: 4px;
    }
    .pie-container {
      height: 80px;
    }
  }
  .metric-types {
    flex-grow: 1;
    .el-card__body {
      padding: 0;
    }
    .col-type-metrics {
      position: relative;
      margin-bottom: 0;
      &:not(:last-child) {
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          display: block;
          width: 1px;
          height: 50%;
          background-color: var(--color-border-card);
        }
      }
    }
    .flow-node-col {
      &:nth-child(1),
      &:nth-child(2) {
        margin-bottom: 24px;
      }
      .type-metrics {
        padding-top: 24px;
        padding-bottom: 24px;
      }
    }
    .el-row {
      height: 100%;
    }
    .el-card {
      height: 100%;
    }
  }
  .metric-bar,
  .metric-rate {
    height: 100%;
    .el-card__body {
      padding: 40px 24px;
    }
    .metric-name {
      margin-bottom: 16px;
    }
  }

  .metric-bar {
    .el-card__body {
      display: flex;
      padding-bottom: 25px;
      align-items: stretch;
    }
    .metric-bar-hd {
      width: 200px;
      margin-right: 40px;
      padding-bottom: 14px;
    }
    .metric-bar-bd {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    .bar-container {
      flex-grow: 1;
    }
    .bar-desc {
      color: var(--color-text-placeholder);
      font-size: 12px;
      font-weight: 400;
      line-height: 24px;
    }
  }
  .metric-rate {
    .el-card__body {
      display: flex;
    }
    .metric-rate-item {
      width: 50%;
      padding: 0 32px;
      &:first-child {
        position: relative;
        &::after {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          width: 1px;
          height: 40px;
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  .text-status {
    margin-right: 8px;
  }
}
</style>
