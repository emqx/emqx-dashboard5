<template>
  <el-dropdown
    split-button
    @click="openNodeCacheSettings"
    placement="bottom-end"
    class="node-cache-dropdown"
  >
    {{ tl('nodeCacheSettings') }}
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
          :disabled-label="t('Extension.unlimited')"
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
            <el-button class="icon-button" :icon="Close" @click="resetCacheMetrics"></el-button>
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
              <p class="metric-value-num">{{ formatNumber(metrics.count) }}</p>
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
import { useSizeMetric } from '@/hooks/useMetrics'
import { Close } from '@element-plus/icons-vue'

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

const { CLUSTER, getNodeOpts } = useNodeOpts()
const nodeOpts = computed(() => getNodeOpts((nodeMetrics.value || []).map(({ node }) => node)))
const selectedNode = ref(CLUSTER)

const nodeMetrics = computed(() => totalMetrics.value.node_metrics)
const metrics = computed(() => {
  if (selectedNode.value === CLUSTER) {
    return totalMetrics.value.metrics
  }
  return nodeMetrics.value.find(({ node }) => node === selectedNode.value)?.metrics
})

const { getSizeNum, getSizeUnit } = useSizeMetric()

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
      margin-right: 12px;
      color: var(--el-text-color-secondary);
      &:not(:last-child):after {
        position: absolute;
        content: '';
        width: 1px;
        height: 12px;
        background-color: var(--el-border-color);
        right: -6px;
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
