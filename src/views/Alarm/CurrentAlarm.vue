<template>
  <div class="alarm app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button :icon="Setting" @click="$router.push({ name: 'alarm-settings' })">
        {{ $t('Base.setting') }}
      </el-button>
      <el-button type="primary" :icon="RefreshRight" @click="loadData({ page: 1 })">
        {{ $t('Base.refresh') }}
      </el-button>
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
      <common-pagination v-model:metaData="cPageMeta" @loadPage="loadData"></common-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'currentAlarm',
})
</script>

<script lang="ts" setup>
import { loadAlarm } from '@/api/common'
import { dateFormat } from '@/common/utils'
import commonPagination from '../../components/commonPagination.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { RefreshRight, Setting } from '@element-plus/icons-vue'
import useDurationStr from '@/hooks/useDurationStr'

const currentLockTable = ref(false)
const currentAlarmData = ref<any[]>([])
const cPageMeta = ref({})
const store = useStore()

const { transMsNumToSimpleStr } = useDurationStr()

const loadData = async (params = {}) => {
  currentLockTable.value = true
  const sendParams = {
    ...cPageMeta.value,
    ...params,
  }
  Reflect.deleteProperty(sendParams, 'count')

  let res = await loadAlarm(false, sendParams).catch(() => {
    // ignore
  })
  if (res) {
    let { data, meta = {} } = res
    currentAlarmData.value = data
    currentLockTable.value = false
    store.dispatch('SET_ALERT_COUNT', currentAlarmData.value.length || 0)
    cPageMeta.value = meta
  } else {
    currentAlarmData.value = []
    currentLockTable.value = false
    cPageMeta.value = {}
  }
}
loadData()
</script>

<style lang="scss">
@import '~@/style/alarm.scss';
</style>
