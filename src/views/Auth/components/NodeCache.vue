<template>
  <el-dropdown
    split-button
    @click="openNodeCacheSettings"
    placement="bottom-end"
    class="node-cache-dropdown"
  >
    {{ settingsTitle }}
    <template #dropdown>
      <el-button size="large" @click="openNodeCacheStatus">{{ tl('nodeCacheStatus') }}</el-button>
    </template>
  </el-dropdown>
  <el-drawer
    v-model="isNodeCacheSettingsDrawerOpen"
    destroy-on-close
    append-to-body
    class="node-cache-settings-drawer"
    :size="660"
    :title="settingsTitle"
  >
    <el-form
      ref="FormCom"
      class="node-cache-form"
      :model="record"
      v-loading="isSettingsLoading"
      :label-width="236"
    >
      <el-form-item v-if="!isAuthz">
        <template #label>
          <FormItemLabel
            :label="tl('ignoreBackendFailures')"
            :desc="tl('ignoreBackendFailuresDesc')"
            desc-marked
          />
        </template>
        <el-switch v-model="record.ignore_backend_failures" />
      </el-form-item>

      <el-form-item>
        <template #label>
          <FormItemLabel :label="tl('enableNodeCache')" :desc="tl('enableNodeCacheDesc')" />
        </template>
        <el-switch v-model="nodeCacheRecord.enable" />
      </el-form-item>

      <el-form-item :label="tl('nodeCacheMaxCount')" prop="max_count">
        <Oneof
          class="in-one-row"
          v-model="nodeCacheRecord.max_count"
          :items="[{ type: 'number' }, { symbols: [UNLIMITED], type: 'enum' }]"
          :disabled="!nodeCacheRecord.enable"
          :disabled-label="t('Extension.unlimited')"
        />
      </el-form-item>

      <el-form-item :label="tl('maxMemory')" prop="max_memory">
        <InputWithUnit
          v-model="nodeCacheRecord.max_memory"
          :disabled="!nodeCacheRecord.enable"
          :units="usefulMemoryUnit"
        />
      </el-form-item>

      <el-form-item :label="tl('cacheTTL')" prop="cache_ttl">
        <TimeInputWithUnitSelect
          v-model="nodeCacheRecord.cache_ttl"
          :disabled="!nodeCacheRecord.enable"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <CancelButton @click="cancelSettings" />
      <el-button
        type="primary"
        :loading="isSubmitting"
        :disabled="!$hasPermission('put')"
        @click="updateSettings"
      >
        {{ t('Base.update') }}
      </el-button>
    </template>
  </el-drawer>
  <el-drawer
    v-model="isNodeCacheStatusDrawerOpen"
    destroy-on-close
    append-to-body
    class="node-cache-status-drawer"
    :size="960"
    :title="tl('nodeCacheStatus')"
  >
    <div v-loading="isCacheMetricsLoading">
      <div class="metrics-header">
        <div class="vertical-align-center">
          <el-select v-model="selectedNode">
            <el-option
              v-for="{ label, value } in nodeOpts"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
          <el-tooltip :content="t('Base.refresh')" placement="top">
            <RefreshButton class="icon-button" no-text @click="loadCacheMetrics" />
          </el-tooltip>
          <el-tooltip :content="tl('resetNodeCacheStatus')" placement="top">
            <el-button
              class="icon-button"
              :disabled="!$hasPermission('post')"
              @click="resetCacheMetrics"
            >
              <X class="w-4 h-4" />
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-card>
            <p class="metric-label">{{ tl('cacheMemory') }}</p>
            <div class="metric-value">
              <p class="metric-value-num">
                {{ getSizeNum(metrics.memory) }}
                <span class="metric-unit">{{ getSizeUnit(metrics.memory) }}</span>
              </p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <p class="metric-label">{{ tl('cacheCount') }}</p>
            <div class="metric-value">
              <p class="metric-value-num">
                {{ isUndefined(metrics?.count) ? 0 : formatNumber(metrics.count) }}
              </p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <p class="metric-label">{{ tl('cacheHits') }}</p>
            <div class="metric-value">
              <p class="metric-value-num">{{ formatNumber(metrics.hits.value) }}</p>
            </div>
            <div class="metric-rate">
              <span class="rate-item current">
                {{ getRateValueStr(metrics.hits.rate.current) }} ({{ tl('currentRate') }})
              </span>
              <span class="rate-item">
                {{ getRateValueStr(metrics.hits.rate.last5m) }} ({{ tl('last5mRate') }})
              </span>
              <span class="rate-item">
                {{ getRateValueStr(metrics.hits.rate.max) }} ({{ t('Dashboard.maximum') }})
              </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <p class="metric-label">{{ tl('cacheMisses') }}</p>
            <div class="metric-value">
              <p class="metric-value-num">{{ formatNumber(metrics.misses.value) }}</p>
            </div>
            <div class="metric-rate">
              <span class="rate-item current">
                {{ getRateValueStr(metrics.misses.rate.current) }} ({{ tl('currentRate') }})
              </span>
              <span class="rate-item">
                {{ getRateValueStr(metrics.misses.rate.last5m) }} ({{ tl('last5mRate') }})
              </span>
              <span class="rate-item">
                {{ getRateValueStr(metrics.misses.rate.max) }} ({{ t('Dashboard.maximum') }})
              </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <p class="metric-label">{{ tl('cacheInserts') }}</p>
            <div class="metric-value">
              <p class="metric-value-num">{{ formatNumber(metrics.inserts.value) }}</p>
            </div>
            <div class="metric-rate">
              <span class="rate-item current">
                {{ getRateValueStr(metrics.inserts.rate.current, 'Auth.insertUnit') }}
                ({{ tl('currentRate') }})
              </span>
              <span class="rate-item">
                {{ getRateValueStr(metrics.inserts.rate.last5m, 'Auth.insertUnit') }}
                ({{ tl('last5mRate') }})
              </span>
              <span class="rate-item">
                {{ getRateValueStr(metrics.inserts.rate.max, 'Auth.insertUnit') }}
                ({{ t('Dashboard.maximum') }})
              </span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-table :data="nodeMetrics" style="width: 100%">
        <el-table-column prop="node" :label="t('Base.node')" />
        <el-table-column prop="metrics.memory" :label="tl('cacheMemory')">
          <template #default="{ row }">
            {{ getSizeNum(row.metrics.memory) }}
            <span class="metric-unit">{{ getSizeUnit(row.metrics.memory) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="metrics.count" :label="tl('cacheCount')" />
        <el-table-column prop="metrics.hits.value" :label="tl('cacheHits')" />
      </el-table>
    </div>
    <template #footer>
      <el-button @click="isNodeCacheStatusDrawerOpen = false">
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
import { useSizeMetric } from '@/hooks/useMetrics'
import { X } from 'lucide-vue-next'

type NodeCacheConfig = {
  enable?: boolean
  max_count?: number
  max_memory?: string
  cache_ttl?: string
}

type AuthnSettings = {
  ignore_backend_failures?: boolean
  node_cache?: NodeCacheConfig
}

type CacheMetricItem = {
  value: number
  rate: {
    max: number
    current: number
    last5m: number
  }
}

type CacheMetrics = {
  count: number
  memory: number
  hits: CacheMetricItem
  inserts: CacheMetricItem
  misses: CacheMetricItem
}

type CacheMetricsResponse = {
  metrics: CacheMetrics
  node_metrics: Array<{
    node: string
    metrics: CacheMetrics
  }>
}

const props = defineProps<{
  type: 'authn' | 'authz'
}>()

const { t, tl } = useI18nTl('Auth')
const isAuthz = computed(() => props.type === 'authz')
const settingsTitle = computed(() =>
  isAuthz.value ? tl('nodeCacheSettings') : tl('authnSettings'),
)

const isNodeCacheSettingsDrawerOpen = ref(false)
const openNodeCacheSettings = () => {
  isNodeCacheSettingsDrawerOpen.value = true
  loadSettings()
}

const UNLIMITED = 'unlimited'

const FormCom = ref()
const record = ref<AuthnSettings>({ node_cache: {} })
const nodeCacheRecord = computed({
  get: () => {
    if (!record.value.node_cache) {
      record.value.node_cache = {}
    }
    return record.value.node_cache
  },
  set: (value: NodeCacheConfig) => {
    record.value.node_cache = value
  },
})

const loadSettingsRequest = async (): Promise<AuthnSettings> => {
  if (isAuthz.value) {
    const nodeCache = (await loadAuthzSettings()) as unknown as NodeCacheConfig
    return { node_cache: nodeCache }
  }
  try {
    const settings = (await loadAuthnSettings()) as unknown as AuthnSettings
    return { node_cache: {}, ...settings }
  } catch (error) {
    return Promise.reject(error)
  }
}
const updateSettingsRequest = async (data: AuthnSettings) =>
  isAuthz.value ? updateAuthzSettings(data.node_cache) : updateAuthnSettings(data)

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

const createEmptyMetricItem = (): CacheMetricItem => ({
  value: 0,
  rate: { max: 0, current: 0, last5m: 0 },
})
const createEmptyMetrics = (): CacheMetrics => ({
  count: 0,
  memory: 0,
  hits: createEmptyMetricItem(),
  inserts: createEmptyMetricItem(),
  misses: createEmptyMetricItem(),
})

const totalMetrics = ref<CacheMetricsResponse>({
  metrics: createEmptyMetrics(),
  node_metrics: [],
})

const { CLUSTER, getNodeOpts } = useNodeOpts()
const nodeOpts = computed(() => getNodeOpts((nodeMetrics.value || []).map(({ node }) => node)))
const selectedNode = ref(CLUSTER)

const nodeMetrics = computed(() => totalMetrics.value.node_metrics)
const metrics = computed<CacheMetrics>(() => {
  if (selectedNode.value === CLUSTER) {
    return totalMetrics.value.metrics
  }
  return (
    nodeMetrics.value.find(({ node }) => node === selectedNode.value)?.metrics ??
    createEmptyMetrics()
  )
})

const { getSizeNum, getSizeUnit } = useSizeMetric()

const requestCacheMetrics = async (): Promise<CacheMetricsResponse> =>
  (await (isAuthz.value
    ? loadAuthzCacheStatus()
    : loadAuthnCacheStatus())) as unknown as CacheMetricsResponse
const requestResetCacheMetrics = () =>
  isAuthz.value ? resetAuthzCacheStatus() : resetAuthnCacheStatus()

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
    await ElMessageBox.confirm(tl('resetNodeCacheStatusConfirm'))
    await requestResetCacheMetrics()
    ElMessage.success(t('RuleEngine.resetSuccessfully'))
    loadCacheMetrics()
  } catch (error) {
    //
  }
}

const getRateValueStr = (val: number, unit = 'Auth.rateUnit') =>
  `${formatNumber(val)} ${t(unit, val)}`
</script>

<style lang="scss">
.node-cache-dropdown {
  .el-dropdown__caret-button {
    &:hover {
      border-left-width: 1px;
      border-left-style: solid;
    }
  }
  .el-button-group > .el-button:hover {
    z-index: 10;
  }
}
.node-cache-status-drawer {
  .el-card {
    margin-bottom: 24px;
  }
  .el-select {
    width: 200px;
    margin-right: 12px;
  }
  .metric-label {
    margin-top: 8px;
    margin-bottom: 12px;
    color: var(--el-text-color-secondary);
  }
  .metric-value {
    display: flex;
    align-items: baseline;
    font-weight: 400;
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
      position: relative;
      margin-right: 24px;
      color: var(--el-text-color-secondary);
      &:not(:last-child):after {
        position: absolute;
        content: '';
        width: 1px;
        height: 12px;
        background-color: var(--el-border-color);
        right: -12px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.75;
      }
      &.current {
        color: var(--el-color-primary);
      }
    }
  }

  .metrics-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }
}
</style>
