<template>
  <div class="alarm app-wrapper">
    <div class="section-header">
      {{ tl('currentAlarm') }}
    </div>

    <el-table :data="currentAlarmData" v-loading.lock="currentLockTable">
      <el-table-column prop="name" :label="$t('Alarm.alarmName')"></el-table-column>
      <el-table-column prop="message" :label="$t('Alarm.alarmMsg')">
        <template #default="{ row }">
          <el-popover placement="top" trigger="hover" width="160">
            <div v-for="(value, label) in row.details" :key="label">{{ label }}: {{ value }}</div>
            <template #reference>
              <span class="details">
                <el-icon><QuestionFilled /></el-icon>
              </span>
            </template>
          </el-popover>
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="node" :label="$t('Alarm.triggerNode')"></el-table-column>
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
          <span v-show="row.duration">{{ getDuration(row.duration) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination v-model:metaData="cPageMeta" @loadPage="loadData"></common-pagination>
    </div>

    <div class="section-header">
      <div>
        <span>{{ tl('historyAlarm') }}</span>
      </div>
      <div>
        <el-button
          type="danger"
          plain
          @click="clearHistoryAlarm"
          :disabled="!historyAlarmData.length"
        >
          {{ $t('Alarm.clearHistory') }}
        </el-button>
      </div>
    </div>

    <el-table :data="historyAlarmData" v-loading.lock="historyLockTable">
      <el-table-column prop="name" :label="$t('Alarm.alarmName')"></el-table-column>
      <el-table-column :label="$t('Alarm.alarmMsg')">
        <template #default="{ row }">
          <el-popover
            placement="top"
            trigger="hover"
            width="160"
            v-if="Object.keys(row.details).length"
          >
            <div v-for="(value, label) in row.details" :key="label">{{ label }}: {{ value }}</div>
            <template #reference>
              <span class="details">
                <el-icon><QuestionFilled /></el-icon>
              </span>
            </template>
          </el-popover>
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="node" :label="$t('Alarm.triggerNode')"></el-table-column>
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
          {{ getDuration(row.duration) }}
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination v-model:metaData="hPageMeta" @loadPage="loadHData"></common-pagination>
    </div>
  </div>
</template>

<script>
import { loadAlarm, clearHistoryAlarm } from '@/api/common'
import { getDuration, dateFormat } from '@/common/utils'
import commonPagination from '../../components/commonPagination.vue'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'

export default {
  components: { commonPagination, QuestionFilled },
  name: 'Alarm',
  data() {
    return {
      currentAlarmData: [],
      historyAlarmData: [],
      currentLockTable: false,
      historyLockTable: false,
      cPageMeta: {},
      hPageMeta: {},
    }
  },
  mounted() {
    this.loadData()
    this.loadHData()
  },
  methods: {
    getDuration: getDuration,
    tl(key, collection = 'Alarm') {
      return this.$t(collection + '.' + key)
    },
    async clearHistoryAlarm() {
      let res = await clearHistoryAlarm().catch(() => {})
      if (res) {
        ElMessage.success(this.$t('Alarm.clearSuccess'))
        this.loadHData()
      }
    },
    dateFormat: dateFormat,
    async loadData(params = {}) {
      this.currentLockTable = true
      const sendParams = {
        ...this.cPageMeta,
        ...params,
      }
      Reflect.deleteProperty(sendParams, 'count')

      let res = await loadAlarm(false, sendParams).catch(() => {})
      if (res) {
        let { data, meta = {} } = res

        this.currentAlarmData = data
        this.currentLockTable = false
        this.$store.dispatch('SET_ALERT_COUNT', this.currentAlarmData.length || 0)

        this.cPageMeta = meta
      } else {
        this.currentAlarmData = []
        this.currentLockTable = false
        this.cPageMeta = {}
      }
    },
    async loadHData(params = {}) {
      this.historyLockTable = true
      const sendParams = {
        ...this.hPageMeta,
        ...params,
      }
      Reflect.deleteProperty(sendParams, 'count')

      let res = await loadAlarm(true, sendParams).catch(() => {})
      if (res) {
        let { data, meta = {} } = res
        this.historyAlarmData = data
        this.historyLockTable = false
        this.hPageMeta = meta
      } else {
        this.historyAlarmData = []
        this.historyLockTable = false
        this.hPageMeta = {}
      }
    },
    getStateText(state) {
      const stateMap = {
        0: this.$t('Alarm.normal'),
      }
      return stateMap[state] || `${this.$t('Alarm.abnormal')} ${state} ${this.$t('Alarm.second')}`
    },
  },
}
</script>

<style lang="scss" scoped>
.details {
  margin-right: 5px;
  color: #a7a7a7;
  cursor: pointer;
  vertical-align: middle;
}
</style>
