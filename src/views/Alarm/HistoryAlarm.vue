<template>
  <div class="alarm app-wrapper">
    <div class="section-header">
      <div></div>
      <div>
        <el-button
          type="danger"
          plain
          :icon="Remove"
          @click="handleClearHistory"
          :disabled="!historyAlarmData.length"
        >
          {{ $t('Alarm.clearHistory') }}
        </el-button>
      </div>
    </div>

    <el-table :data="historyAlarmData" v-loading.lock="historyLockTable">
      <el-table-column prop="name" :label="$t('Alarm.alarmName')" />
      <el-table-column :label="$t('Alarm.alarmMsg')">
        <template #default="{ row }">
          <div class="message-with-icon">
            <InfoTooltip v-if="Object.keys(row.details).length">
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
        <span>{{ $t('Alarm.system') }}</span>
      </el-table-column>
      <el-table-column prop="activate_at" :label="$t('Alarm.activateTime')">
        <template #default="{ row }">
          {{ row.activate_at && dateFormat(row.activate_at) }}<br />
          {{ row.deactivate_at && dateFormat(row.deactivate_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="deactivate_at" :label="$t('Alarm.duration')">
        <template #default="{ row }">
          {{ transMsNumToSimpleStr(row.duration) }}
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination v-model:metaData="pageMeta" @loadPage="loadData"></common-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'currentAlarm',
})
</script>

<script lang="ts" setup>
import { loadAlarm, clearHistoryAlarm } from '@/api/common'
import { dateFormat } from '@/common/utils'
import commonPagination from '../../components/commonPagination.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { Remove } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useDurationStr from '@/hooks/useDurationStr'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'

const historyLockTable = ref(false)
const historyAlarmData = ref<any[]>([])
const { t } = useI18n()
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const { transMsNumToSimpleStr } = useDurationStr()

const loadData = async (params = {}) => {
  historyLockTable.value = true
  const sendParams = { ...pageParams.value, ...params }
  try {
    let { data, meta } = await loadAlarm(true, sendParams)
    historyAlarmData.value = data
    setPageMeta(meta)
  } catch (error) {
    historyAlarmData.value = []
    initPageMeta()
  } finally {
    historyLockTable.value = false
  }
}
const handleClearHistory = async () => {
  try {
    await ElMessageBox.confirm(t('Alarm.clearConfirm'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    let res = await clearHistoryAlarm().catch(() => {
      // ignore
    })
    if (res) {
      ElMessage.success(t('Alarm.clearSuccess'))
      loadData()
    }
  } catch (error) {
    console.error(error)
  }
}
loadData()
</script>

<style lang="scss">
@import '~@/style/alarm.scss';
</style>
