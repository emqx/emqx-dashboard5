<template>
  <div class="ns-metrics" v-loading="isLoading">
    <div class="app-wrapper">
      <div class="section-header">
        <el-row :gutter="20" justify="space-between">
          <el-col v-bind="colProps">
            <NamespaceSelect
              v-model="namespace"
              class="w-96"
              clearable
              :placeholder="t('BasicConfig.namespace')"
              @change="handleNamespaceChange"
            />
          </el-col>
          <el-col v-bind="colProps">
            <div class="flex justify-end">
              <RefreshButton @click="getMetrics" />
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="metrics-content">
        <el-row :gutter="24" class="mb-6">
          <!-- Row 1 -->
          <el-col :span="12">
            <el-card shadow="never" class="metric-card">
              <StatsContent
                :icon="ArrowDown"
                :title="tl('messageReceived')"
                :value="metricsData.messaging_stats?.['messages.received']"
              />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never" class="metric-card">
              <StatsContent
                :icon="ArrowUp"
                :title="tl('messageSent')"
                :value="metricsData.messaging_stats?.['messages.sent']"
              />
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-card shadow="never" class="metric-card">
              <StatsContent
                :icon="Link"
                :value="metricsData.session_count"
                :title="tl('allConnections')"
              />
            </el-card>
          </el-col>
          <!-- <el-col :span="6">
            <el-card shadow="never" class="metric-card">
              <StatsContent
                :icon="Activity"
                :value="metricsData.messaging_stats?.['client.connect']"
                :title="tl('liveConnections')"
              />
            </el-card>
          </el-col> -->
          <el-col :span="6">
            <el-card shadow="never" class="metric-card">
              <StatsContent
                :icon="Workflow"
                :value="metricsData.messaging_stats?.['actions.executed']"
                :title="tl('actions_executed')"
              />
            </el-card>
          </el-col>
          <el-col :span="6" v-if="!isGlobal">
            <el-card shadow="never" class="metric-card">
              <div class="flex gap-4">
                <StatsContent
                  class="flex-1"
                  :icon="ShieldCheck"
                  :value="metricsData.builtin_authn_record_count"
                  :title="tl('authnRecordCount')"
                />
                <StatsContent
                  class="flex-1"
                  :value="metricsData.builtin_authz_record_count"
                  :title="tl('authzRecordCount')"
                />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loadCurrentMetrics, loadMetrics } from '@/api/common'
import { getNamespaceMetrics as queryNamespaceMetrics } from '@/api/config'
import { SEARCH_FORM_RES_PROPS as colProps } from '@/common/constants'
import { NamespaceMetrics } from '@/types/config'
import { ArrowDown, ArrowUp, Link, ShieldCheck, Workflow } from 'lucide-vue-next'

const { t, tl } = useI18nTl('Dashboard')

const isLoading = ref(false)
const namespace = ref<string | undefined>(undefined)
const isGlobal = computed(() => !namespace.value)

const metricsData = ref<NamespaceMetrics>({} as NamespaceMetrics)

const handleNamespaceChange = () => {
  getMetrics()
}

const getGlobalMetrics = async () => {
  try {
    isLoading.value = true
    const [metrics, currentMetrics] = await Promise.all([loadMetrics(), loadCurrentMetrics()])
    metricsData.value = {
      builtin_authn_record_count: 0,
      builtin_authz_record_count: 0,
      session_count: currentMetrics.connections,
      messaging_stats: isPlainObject(metrics) ? metrics : (metrics as any)[0],
    }
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const getNamespaceMetrics = async () => {
  try {
    isLoading.value = true
    const data = await queryNamespaceMetrics(namespace.value as string)
    metricsData.value = data
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const getMetrics = async () => {
  if (!namespace.value) {
    getGlobalMetrics()
  } else {
    getNamespaceMetrics()
  }
}

getMetrics()
</script>
