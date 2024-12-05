<template>
  <div class="streaming-overview app-wrapper with-padding-top" v-loading="isLoading">
    <el-card>
      <div v-for="item in metricList" :key="item" class="metric-item">
        <component
          :is="getRouterLink(item) ? 'router-link' : 'div'"
          :to="{ name: getRouterLink(item) }"
          :class="{ 'not-highlight': getRouterLink(item) }"
        >
          <div class="metric-item-hd">
            <i class="metric-item-icon" :class="getIconClass(item)" />
            <p class="metric-item-title">{{ tl(`metricTitleDic.${item}`) }}</p>
          </div>
          <div class="metric-item-bd">
            <label class="metric-item-value">{{ metricsData[item] }}</label>
            <span class="metric-item-unit" v-if="/rate/i.test(item)">
              {{ t('RuleEngine.rateUnit', metricsData[item] || 0) }}
            </span>
          </div>
        </component>
      </div>
    </el-card>
    <div>
      <h2>Endpoint</h2>
      <el-table :data="endpoints">
        <el-table-column :label="tl('securityProtocol')" prop="security_protocol" min-width="140" />
        <el-table-column :label="tl('networkType')" prop="network_type" min-width="120" />
        <el-table-column :label="t('Base.address')" prop="address" min-width="200">
          <template #default="{ row }">
            <TextEasyCopy>{{ row.address }}</TextEasyCopy>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getEndpoints as requestEndpoints, getStreamingMetrics } from '@/api/streaming'
import TextEasyCopy from '@/components/TextEasyCopy.vue'
import { StreamingAllMetrics } from '@/types/schemas/streaming.schemas'
import { useLocale } from '@emqx/shared-ui-utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

interface Endpoint {
  security_protocol: string
  address: string
  network_type: string
}

const { state } = useStore()
const { t: sharedT } = useLocale(state.lang)
const tl = (key: string) => sharedT(`streaming.${key}`)

const { t } = useI18n()

const isLoading = ref(false)

const metricsData = ref<StreamingAllMetrics>({
  partition_count: 0,
  total_messages_out_rate: 0,
  total_messages_in_rate: 0,
  group_count: 0,
  stream_count: 0,
})

const metricList: Array<keyof StreamingAllMetrics> = [
  'stream_count',
  'partition_count',
  'group_count',
  'total_messages_in_rate',
  'total_messages_out_rate',
]

const iconClassMap = {
  partition_count: 'icon-partition',
  total_messages_out_rate: 'icon-message-out',
  total_messages_in_rate: 'icon-message-in',
  group_count: 'icon-consumer',
  stream_count: 'icon-stream',
}
const getIconClass = (key: keyof StreamingAllMetrics) => {
  return iconClassMap[key]
}

const routerLinkMap: Partial<Record<keyof StreamingAllMetrics, string>> = {
  stream_count: 'stream',
  group_count: 'consumer-group',
}
const getRouterLink = (key: keyof StreamingAllMetrics) => {
  return routerLinkMap[key]
}

const getMetrics = async () => {
  try {
    metricsData.value = await getStreamingMetrics()
    return Promise.resolve()
  } catch (error) {
    return Promise.reject()
  }
}

const endpoints = ref<Array<Endpoint>>([])

const getEndpoints = async () => {
  try {
    endpoints.value = await requestEndpoints()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
getEndpoints()
;(async () => {
  try {
    isLoading.value = true
    await Promise.allSettled([getMetrics(), getEndpoints()])
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
})()
</script>

<style lang="scss">
.streaming-overview {
  padding-bottom: 32px;
  .el-card {
    margin-bottom: 48px;
  }
  .el-card__body {
    display: flex;
    padding: 24px;
  }
  .metric-item {
    flex-basis: 20%;
    display: flex;
    cursor: default;

    &-hd {
      .metric-item-icon {
        display: block;
        width: 40px;
        height: 40px;
        margin-bottom: 16px;
        background-size: contain;
        &.icon-partition {
          background-image: url('~@/assets/img/partition.png');
        }
        &.icon-message-out {
          background-image: url('~@/assets/img/message-out.png');
        }
        &.icon-message-in {
          background-image: url('~@/assets/img/message-in.png');
        }
        &.icon-consumer {
          background-image: url('~@/assets/img/consumer.png');
        }
        &.icon-stream {
          background-image: url('~@/assets/img/stream.png');
        }
      }

      .metric-item-title {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        margin-bottom: 16px;
      }
    }

    &-bd {
      .metric-item-value {
        margin-right: 8px;
        font-size: 32px;
        font-weight: 600;
        line-height: 44px;
      }

      .metric-item-unit {
        font-size: 14px;
        color: #999;
        color: var(--color-text-secondary);
      }
    }
  }
}
</style>
