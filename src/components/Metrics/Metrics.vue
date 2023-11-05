<template>
  <div class="metrics">
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
          <el-tooltip :content="tl('resetStatistics')" placement="top">
            <el-button class="icon-button" :icon="Close" @click="resetStatistics"></el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="block-bd">
        <el-card class="metric-pie">
          <p class="metric-name">{{ getMetricItemLabel(total) }}</p>
          <p class="metric-num">{{ formatNumber(currentMetrics[total]) }}</p>
          <div class="pie-container" :id="createRandomString()" ref="ChartEle"></div>
        </el-card>
        <div class="metric-types">
          <el-row :gutter="24">
            <el-col :span="12" v-for="item in typeMetricsData" :key="item.type">
              <!-- set key to eliminate the diff when change node -->
              <TypeMetrics :data="item" :type="item.type" :key="selectedNode" />
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="metric-block">
      <div class="block-hd">
        <p class="block-title">{{ t('Base.rateIndicators') }}</p>
      </div>
      <el-row class="block-bd" :gutter="24">
        <el-col :span="11">
          <el-card class="metric-bar">
            <div class="metric-bar-hd">
              <p class="metric-name">{{ getMetricItemLabel(rateMetrics.current) }}</p>
              <p class="metric-num-s">
                <span class="num">
                  {{ formatNumber(currentMetrics[rateMetrics.current]) }}
                </span>
                <span class="unit">
                  {{ t(rateMetrics.unitKey, currentMetrics[rateMetrics.current]) }}
                </span>
              </p>
            </div>
            <div class="metric-bar-bd">
              <div class="bar-container" :id="createRandomString()" ref="BarChartEle"></div>
              <p class="bar-desc tip">{{ getMetricItemDesc(rateMetrics.current) }}</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="13">
          <el-card class="metric-rate">
            <div class="metric-rate-item">
              <p class="metric-name">{{ getMetricItemLabel(rateMetrics.right1) }}</p>
              <p class="metric-num-s">
                <span class="num">
                  {{ formatNumber(currentMetrics[rateMetrics.right1]) }}
                </span>
                <span class="unit">
                  {{ t(rateMetrics.unitKey, currentMetrics[rateMetrics.right1]) }}
                </span>
              </p>
            </div>
            <div class="metric-rate-item">
              <p class="metric-name">{{ getMetricItemLabel(rateMetrics.right2) }}</p>
              <p class="metric-num-s">
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
  </div>
</template>

<script setup lang="ts">
import { createRandomString, formatNumber } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { MetricType, PieDataItem, usePieChart, useRateChart } from '@/hooks/useMetrics'
import useSyncPolling from '@/hooks/useSyncPolling'
import { BridgeMetricsData, Metrics } from '@/types/rule'
import { Close, Refresh } from '@element-plus/icons-vue'
import moment from 'moment'
import { ComputedRef, Ref, computed, defineProps, ref } from 'vue'
import TypeMetrics from './TypeMetrics.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

type TypeMapData = Record<MetricType, { title: string; contains: Array<string> }>

interface Rate {
  unitKey: string
  current: string
  right1: string
  right2: string
}

const props = defineProps<{
  requestMetrics: () => any
  requestReset: () => any
  textMap: Record<string, { label: string; desc?: string }>
  /**
   * metric key for get total
   */
  total: string
  typeMetricsMap: TypeMapData
  rateMetrics: Rate
  /**
   * for confirm dialog
   */
  title: string
}>()

interface TypeMetricDataItem {
  type: MetricType
  title: string
  count?: number
  detail: Array<{
    value: number
    desc?: string
    label: string
  }>
}

const { t, tl } = useI18nTl('RuleEngine')

const metricsData: Ref<BridgeMetricsData> = ref({ metrics: {}, node_metrics: [] })

const CLUSTER = 'cluster'
const clusterOpt = { label: t('BasicConfig.cluster'), value: CLUSTER }
const nodeOpts = computed(() => {
  return [
    clusterOpt,
    ...(metricsData.value?.node_metrics || []).map(({ node }) => ({ value: node, label: node })),
  ]
})
const selectedNode = ref(CLUSTER)
const handleNodeChange = () => {
  rateData = createEmptyRateData()
  updateToView()
}

const getMetricItemLabel = (key: string) => props.textMap[key]?.label || key
const getMetricItemDesc = (key: string) => props.textMap[key]?.desc || ''

/**
 * base on selectedNode
 */
const currentMetrics: ComputedRef<Metrics> = computed(() => {
  const { metrics, node_metrics } = metricsData.value
  if (selectedNode.value === CLUSTER) {
    return metrics
  }
  return node_metrics.find(({ node }) => node === selectedNode.value)?.metrics || {}
})

/* TYPE METRICS */
const initTypeMetricsData = (): Array<TypeMetricDataItem> => {
  return Object.entries(props.typeMetricsMap).reduce(
    (arr: Array<TypeMetricDataItem>, [key, { title }]) => {
      arr.push({
        title,
        count: undefined,
        detail: [],
        type: Number(key) as MetricType,
      })
      return arr
    },
    [] as Array<TypeMetricDataItem>,
  )
}
const typeMetricsData: Ref<Array<TypeMetricDataItem>> = ref(initTypeMetricsData())
const generateMetricTypeData = (metrics: Metrics, typeMapData: TypeMapData) => {
  return Object.entries(typeMapData).reduce(
    (arr: Array<TypeMetricDataItem>, [key, { title, contains: values }]) => {
      let typeCount = 0
      const typeList = values.reduce((ret, key) => {
        const item = {
          value: metrics[key],
          label: getMetricItemLabel(key),
          desc: getMetricItemDesc(key),
        }
        typeCount += metrics[key]
        ret.push(item)
        return ret
      }, [] as Array<{ value: number; label: string; desc?: string }>)
      arr.push({ title, count: typeCount, detail: typeList, type: Number(key) as MetricType })
      return arr
    },
    [] as Array<TypeMetricDataItem>,
  )
}

/* PIE */
let pieData = []
const generatePieData = (metrics: Metrics, typeMapData: TypeMapData): Array<PieDataItem> => {
  return Object.entries(typeMapData).reduce(
    (arr: Array<PieDataItem>, [key, { title, contains: values }]) => {
      const value = values.reduce((sum, item) => sum + (metrics[item] || 0), 0)
      return [...arr, { type: Number(key) as MetricType, name: title, value }]
    },
    [] as Array<PieDataItem>,
  )
}

/* RATE */
const rateDataLength = 20
const createEmptyArray = (length: number) => new Array(length).fill(undefined)
const createEmptyRateData = () => ({
  x: createEmptyArray(rateDataLength),
  y: createEmptyArray(rateDataLength),
})
let rateData = createEmptyRateData()
const getNow = () => moment().format('HH:mm:ss')
const addRateDataItem = (rate: number) => {
  rateData.x.push(getNow())
  rateData.y.push(rate)

  if (rateData.x.length >= rateDataLength) {
    rateData.x.shift()
    rateData.y.shift()
  }
}
const updateRateData = (metrics: Metrics) => {
  const rate = metrics[props.rateMetrics.current]
  addRateDataItem(rate)
  return rateData
}

const { ChartEle: BarChartEle, updateBarData } = useRateChart()
const { ChartEle, updateRingData } = usePieChart()
const updateToView = () => {
  const data = currentMetrics.value
  pieData = generatePieData(data, props.typeMetricsMap)
  updateRingData(pieData)

  const { x, y } = updateRateData(data)
  updateBarData(x, y)

  typeMetricsData.value = generateMetricTypeData(data, props.typeMetricsMap)
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
  rateData = createEmptyRateData()
  typeMetricsData.value = initTypeMetricsData()
}

const handleRefresh = () => {
  initMetrics()
  getMetrics()
}

const resetStatistics = async () => {
  await ElMessageBox.confirm(t('RuleEngine.resetMetricsConfirm', { target: props.title }))
  await props.requestReset()
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

.metrics {
  p {
    margin: 0;
  }
  .metric-name {
    color: var(--color-text-primary);
    line-height: 24px;
  }
  .metric-num,
  .metric-num-s {
    color: var(--color-title-primary);
    font-weight: 600;
  }
  .metric-num {
    height: 44px;
    font-size: 32px;
    line-height: 44px;
  }
  .metric-num-s {
    height: 32px;
    font-size: 22px;
    line-height: 32px;
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
  }
  .metric-block {
    margin-bottom: 24px;
  }
  $pie-card-side-length: 300px;
  $column-gap: 24px;
  .metric-pie {
    width: $pie-card-side-length;
    height: $pie-card-side-length;
    margin-right: $column-gap;
    flex-shrink: 0;
    .el-card__body {
      display: flex;
      flex-direction: column;
      padding: 40px 46px;
      height: 100%;
    }
    .metric-name {
      margin-bottom: 4px;
    }
    .metric-num {
      margin-bottom: 32px;
    }
    .pie-container {
      flex-grow: 1;
      margin-left: -8px;
      margin-right: -8px;
    }
  }
  .metric-types {
    flex-grow: 1;
    height: $pie-card-side-length;
    .el-row {
      height: 100%;
    }
    $row-gap: 16px;
    .el-col {
      height: calc(math.div($pie-card-side-length, 2) - math.div($row-gap, 2));
    }
    .el-card {
      height: 100%;
    }
    .el-col:nth-child(1),
    .el-col:nth-child(2) {
      margin-bottom: 16px;
    }
  }
  .metric-bar,
  .metric-rate {
    height: 100%;
    .el-card__body {
      padding: 40px 24px;
    }
    .metric-name {
      margin-bottom: 24px;
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
      font-size: 10px;
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
}
</style>
