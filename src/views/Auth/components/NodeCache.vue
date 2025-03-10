<template>
  <el-dropdown>
    <el-button @click="openNodeCacheSettings">{{ tl('nodeCacheSettings') }}</el-button>
    <template #dropdown>
      <el-button @click="openNodeCacheStatus">{{ tl('nodeCacheStatus') }}</el-button>
    </template>
  </el-dropdown>
  <el-drawer
    v-model="isNodeCacheSettingsDrawerOpen"
    destroy-on-close
    append-to-body
    class="node-cache-settings-drawer"
    :size="660"
    :title="tl('nodeCacheSettings')"
  >
    <el-form
      ref="FormCom"
      class="node-cache-form"
      :model="record"
      v-loading="isSettingsLoading"
      :label-width="236"
    >
      <el-form-item :label="tl('enableNodeCache')">
        <el-switch v-model="record.enable" />
      </el-form-item>

      <el-form-item :label="tl('nodeCacheMaxCount')" prop="max_count">
        <Oneof
          class="in-one-row"
          v-model="record.max_count"
          :items="[{ type: 'number' }, { symbols: [UNLIMITED], type: 'enum' }]"
          :disabled="!record.enable"
        />
      </el-form-item>

      <el-form-item :label="tl('maxMemory')" prop="max_memory">
        <InputWithUnit
          v-model="record.max_memory"
          :disabled="!record.enable"
          :units="usefulMemoryUnit"
        />
      </el-form-item>

      <el-form-item :label="tl('cacheTTL')" prop="cache_ttl">
        <TimeInputWithUnitSelect v-model="record.cache_ttl" :disabled="!record.enable" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelSettings">
        {{ t('Base.cancel') }}
      </el-button>
      <el-button type="primary" @click="updateSettings" :loading="isSubmitting">
        {{ t('Base.update') }}
      </el-button>
    </template>
  </el-drawer>
  <el-drawer
    v-model="isNodeCacheStatusDrawerOpen"
    destroy-on-close
    append-to-body
    class="node-cache-status-drawer"
    :size="900"
    :title="tl('nodeCacheStatus')"
    v-loading="isCacheMetricsLoading"
  >
    <div class="metrics-header">
      <h2 class="metrics-title">{{ tl('cacheMetrics') }}</h2>
      <RefreshButton @click="loadCacheMetrics" />
    </div>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card>
          <p class="metric-label">{{ tl('cacheMemory') }}</p>
          <div class="metric-value">
            <p class="metric-value-num">
              {{ metrics.memory }} <span class="metric-unit">{{ tl('bytes') }}</span>
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <p class="metric-label">{{ tl('cacheCount') }}</p>
          <div class="metric-value">
            <p class="metric-value-num">{{ metrics.count }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <p class="metric-label">{{ tl('cacheHits') }}</p>
          <div class="metric-value">
            <p class="metric-value-num">{{ metrics.hits.value }}</p>
          </div>
          <div class="metric-rate">
            <span class="rate-item current">
              {{ getRateValueStr(metrics.hits.rate.current) }} {{ tl('currentRate') }}
            </span>
            <span class="rate-item">
              {{ getRateValueStr(metrics.hits.rate.last5m) }} {{ tl('last5mRate') }}
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <p class="metric-label">{{ tl('cacheMisses') }}</p>
          <div class="metric-value">
            <p class="metric-value-num">{{ metrics.misses.value }}</p>
          </div>
          <div class="metric-rate">
            <span class="rate-item current">
              {{ getRateValueStr(metrics.misses.rate.current) }} {{ tl('currentRate') }}
            </span>
            <span class="rate-item">
              {{ getRateValueStr(metrics.misses.rate.last5m) }} {{ tl('last5mRate') }}
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <p class="metric-label">{{ tl('cacheInserts') }}</p>
          <div class="metric-value">
            <p class="metric-value-num">{{ metrics.inserts.value }}</p>
          </div>
          <div class="metric-rate">
            <span class="rate-item current">
              {{ getRateValueStr(metrics.inserts.rate.current) }} {{ tl('currentRate') }}
            </span>
            <span class="rate-item">
              {{ getRateValueStr(metrics.inserts.rate.last5m) }} {{ tl('last5mRate') }}
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-table :data="nodeMetrics" style="width: 100%">
      <el-table-column prop="node" :label="t('Base.node')" />
      <el-table-column prop="metrics.memory" :label="tl('cacheMemory')" />
      <el-table-column prop="metrics.count" :label="tl('cacheCount')" />
      <el-table-column prop="metrics.hits.value" :label="tl('cacheHits')" />
      <el-table-column prop="metrics.misses.value" :label="tl('cacheMisses')" />
      <el-table-column prop="metrics.inserts.value" :label="tl('cacheInserts')" />
    </el-table>
    <template #footer>
      <el-button @click="cancelSettings">
        {{ t('APIKey.close') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {
  loadAuthnCacheStatus,
  loadAuthnSettings,
  loadAuthzCacheStatus,
  loadAuthzSettings,
  resetAuthnCacheStatus,
  resetAuthzCacheStatus,
  updateAuthnSettings,
  updateAuthzSettings,
} from '@/api/auth'

type NodeCacheConfig = {
  enable?: boolean
  max_count?: number
  max_memory?: string
  cache_ttl?: string
}

const props = defineProps<{
  type: 'authn' | 'authz'
}>()

const isNodeCacheSettingsDrawerOpen = ref(false)
const openNodeCacheSettings = () => {
  isNodeCacheSettingsDrawerOpen.value = true
  loadSettings()
}

const { t, tl } = useI18nTl('Auth')

const UNLIMITED = 'unlimited'

const FormCom = ref()
const record = ref<NodeCacheConfig>({})

const isAuthz = computed(() => props.type === 'authz')
const loadSettingsRequest = async () => {
  if (isAuthz.value) {
    return loadAuthzSettings()
  }
  try {
    const { node_cache } = await loadAuthnSettings()
    return Promise.resolve(node_cache)
  } catch (error) {
    return Promise.reject(error)
  }
}
const updateSettingsRequest = async (data: NodeCacheConfig) =>
  isAuthz.value ? updateAuthzSettings(data) : updateAuthnSettings({ node_cache: data })

const isSettingsLoading = ref(false)
const loadSettings = async () => {
  try {
    isSettingsLoading.value = true
    const res = await loadSettingsRequest()
    record.value = res
  } catch (error) {
    //
  } finally {
    isSettingsLoading.value = false
  }
}

const isSubmitting = ref(false)
const updateSettings = async () => {
  try {
    isSubmitting.value = true
    await updateSettingsRequest(checkNOmitFromObj(record.value))
    ElMessage.success(t('Base.updateSuccess'))
    isNodeCacheSettingsDrawerOpen.value = false
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

const cancelSettings = () => {
  isNodeCacheSettingsDrawerOpen.value = false
}

const isNodeCacheStatusDrawerOpen = ref(false)
const openNodeCacheStatus = () => {
  isNodeCacheStatusDrawerOpen.value = true
  loadCacheMetrics()
}

const createEmptyMetricItem = () => ({ value: 0, rate: { max: 0, current: 0, last5m: 0 } })
const createEmptyMetrics = () => ({
  count: 0,
  memory: 0,
  hits: createEmptyMetricItem(),
  inserts: createEmptyMetricItem(),
  misses: createEmptyMetricItem(),
})

const totalMetrics = ref({
  metrics: createEmptyMetrics(),
  node_metrics: [],
})

const metrics = computed(() => totalMetrics.value.metrics)
const nodeMetrics = computed(() => totalMetrics.value.node_metrics)

const requestCacheMetrics = () => (isAuthz.value ? loadAuthnCacheStatus() : loadAuthzCacheStatus())
const requestResetCacheMetrics = () =>
  isAuthz.value ? resetAuthnCacheStatus() : resetAuthzCacheStatus()

const isCacheMetricsLoading = ref(false)
const loadCacheMetrics = async () => {
  try {
    isCacheMetricsLoading.value = true
    totalMetrics.value = await requestCacheMetrics()
  } catch (error) {
    //
  } finally {
    isCacheMetricsLoading.value = false
  }
}

const resetCacheMetrics = async () => {
  try {
    await requestResetCacheMetrics()
  } catch (error) {
    //
  }
}

const getRateValueStr = (val: number) => `${val}${tl('rateUnit', { val })}`
</script>

<style lang="scss">
.node-cache-status-drawer {
  .el-card {
    margin-bottom: 20px;
    transition: all 0.3s;
  }

  .metric-label {
    margin-top: 8px;
    margin-bottom: 12px;
    color: var(--el-text-color-secondary);
  }

  .metric-value {
    display: flex;
    align-items: baseline;
    font-weight: 600;

    .metric-value-num {
      font-size: 22px;
      color: var(--el-text-color-primary);
      margin: 0;
    }

    .metric-unit {
      font-size: 14px;
      font-weight: normal;
      color: var(--el-text-color-secondary);
      margin-left: 5px;
    }
  }

  .metric-rate {
    margin-top: 12px;
    display: flex;
    align-items: center;

    .rate-item {
      color: var(--el-text-color-secondary);

      &.current {
        margin-right: 12px;
        color: var(--el-color-primary);
      }
    }
  }

  // 添加一个标题
  .metrics-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .metrics-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: var(--el-text-color-primary);
  }

  // 添加刷新按钮样式
  .refresh-button {
    margin-left: 10px;
    font-size: 14px;
  }
}
</style>
