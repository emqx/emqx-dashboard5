<template>
  <div class="alarm app-wrapper">
    <div class="section-header">
      <div></div>
      <el-tooltip link :content="tl('setupWebhookDesc')" placement="top">
        <LinkButton :to="alarmWebhookRoute" :disabled="!$hasPermission('post')">
          <el-icon :size="14">
            <i class="iconfont icon-webhook"></i>
          </el-icon>
          <span>{{ tl('setUpWebhook') }}</span>
        </LinkButton>
      </el-tooltip>
      <LinkButton
        :icon="Setting"
        :to="{ name: 'alarm-settings' }"
        :disabled="!$hasPermission('put')"
      >
        {{ $t('Base.setting') }}
      </LinkButton>
      <RefreshButton :disabled="!$hasPermission('get')" @click="loadData({ page: 1 })" />
    </div>
    <el-table :data="currentAlarmData" v-loading.lock="currentLockTable">
      <el-table-column prop="name" :label="$t('Alarm.alarmName')" />
      <el-table-column prop="message" :label="$t('Alarm.alarmMsg')">
        <template #default="{ row }">
          <div class="message-with-icon">
            <InfoTooltip>
              <template #content>
                <div v-for="(value, label) in row.details" :key="label">
                  {{ label }}: {{ value }}
                </div>
              </template>
            </InfoTooltip>
            <span>{{ row.message }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="node" :label="$t('Alarm.triggerNode')" />
      <el-table-column :label="$t('Alarm.alarmLevel')">
        <span> {{ $t('Alarm.system') }}</span>
      </el-table-column>
      <el-table-column prop="activate_at" :label="$t('Alarm.activateAt')">
        <template #default="{ row }">
          {{ (row.activate_at && dateFormat(row.activate_at)) || '' }}
        </template>
      </el-table-column>
      <el-table-column>
        <template #header>
          <span>
            {{ $t('Alarm.duration') }}
          </span>
        </template>
        <template #default="{ row }">
          <span v-show="row.duration">{{ transMsNumToSimpleStr(row.duration) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination v-model:metaData="pageMeta" @loadPage="loadData"></common-pagination>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'currentAlarm',
})
</script>

<script lang="ts" setup>
import { loadAlarm } from '@/api/common'

import commonPagination from '../../components/commonPagination.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { Setting } from '@element-plus/icons-vue'

const { tl } = useI18nTl('Alarm')

const currentLockTable = ref(false)
const currentAlarmData = ref<any[]>([])
const store = useStore()

const alarmWebhookRoute = {
  name: 'webhook-create',
  query: { trigger: 'alarm' },
}

const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const { transMsNumToSimpleStr } = useDurationStr()

const loadData = async (params = {}) => {
  currentLockTable.value = true
  const sendParams = { ...pageParams.value, ...params }

  try {
    const { data, meta } = await loadAlarm(false, sendParams)
    currentAlarmData.value = data
    store.dispatch('SET_ALERT_COUNT', currentAlarmData.value.length || 0)
    setPageMeta(meta)
  } catch (error) {
    currentAlarmData.value = []
    initPageMeta()
  } finally {
    currentLockTable.value = false
  }
}
loadData()
</script>

<style lang="scss">
@import '@/style/alarm.scss';
.alarm {
  .icon-webhook {
    font-size: 13.5px;
  }
}
</style>
