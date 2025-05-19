<template>
  <div class="message-analysis">
    <div class="search-wrapper">
      <el-form :inline="true" @submit.prevent="getTableData">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="searchForm.topic"
              clearable
              :placeholder="t('Topics.topic')"
              @clear="getTableData"
            />
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchForm.qos" clearable placeholder="QoS" @clear="getTableData">
              <el-option v-for="item in QoSOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="searchForm.event"
              clearable
              :placeholder="t('General.event')"
              @clear="getTableData"
            >
              <el-option
                v-for="{ value, label } in eventOptions"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-col>
          <el-col :span="6" class="col-oper">
            <SearchButton @click="getTableData" />
            <ResetButton @click="handleReset" />
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="app-wrapper">
      <el-table :data="tableData" v-loading="isLoading" style="margin-top: 16px">
        <el-table-column prop="id" label="ID" min-width="120">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleView(row.id)">
              {{ row.id }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="topic" :label="t('Base.topic')" min-width="120" />
        <el-table-column prop="qos" label="QoS" min-width="60" />
        <el-table-column prop="event" :label="t('General.event')" min-width="80">
          <template #default="{ row }">
            {{ getLabelFromValueInOptionList(row.event, eventOptions) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="80">
          <template #default="{ row }">
            <span class="text-status" :class="getTextClass(row.status)">
              {{ row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="from_clientid" :label="t('QoS.pubClient')" min-width="120" />
        <el-table-column prop="clientid" :label="t('QoS.subClient')" min-width="120" />
        <el-table-column prop="time" :label="t('Tools.time')" min-width="160">
          <template #default="{ row }">
            {{ dateFormat(row.time) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="emq-table-footer">
        <CommonPagination :meta-data="pageParams" @load-page="refreshTable" />
      </div>
    </div>
  </div>
  <MessageAnalysisDetailDialog v-model="isDetailDialogVisible" :id="detailId" />
</template>

<script setup lang="ts">
import { MessageAnalysisStatus, TopicEvent } from '@/types/enum'
import { MessageAnalysisItem } from '@/types/diagnose'
import { queryMessageAnalysis } from '@/api/diagnose'
import MessageAnalysisDetailDialog from './components/MessageAnalysisDetailDialog.vue'

const { t } = useI18n()

const isLoading = ref(false)
const { page, limit, count } = usePagination()
const pageParams = computed(() => ({
  page: page.value,
  limit: limit.value,
  count: count.value,
}))

const searchForm = reactive({
  topic: '',
  qos: undefined,
  event: undefined,
})

const eventOptions = Object.values(TopicEvent).map((value) => {
  const labelKey = camelCase(`events.${value}`)
  return { value, label: t(`RuleEvent.${labelKey}`) }
})

const allData: Array<MessageAnalysisItem> = [
  {
    id: 'xxxx',
    topic: 't/1',
    qos: 0,
    event: TopicEvent.MessagePublish,
    status: MessageAnalysisStatus.Completed,
    from_clientid: 'clientid-1',
    clientid: 'clientid-2',
    time: '2025-05-12 11:22:33',
    size: 1024 * 100,
    latency: 100,
  },
]

const tableData = ref<Array<MessageAnalysisItem>>([...allData])

const getTableData = async () => {
  const params = {
    page: page.value,
    limit: limit.value,
    ...searchForm,
  }
  const { meta, data } = await queryMessageAnalysis(params)
  tableData.value = data
  count.value = meta.count || 0
}
getTableData()

const handleReset = () => {
  searchForm.topic = ''
  searchForm.qos = undefined
  searchForm.event = undefined
  getTableData()
}

const refreshTable = (pageData: { page: number; limit: number }) => {
  page.value = pageData.page
  limit.value = pageData.limit
  getTableData()
}

const getTextClass = (status: MessageAnalysisStatus) => {
  if (status === MessageAnalysisStatus.Error) {
    return 'danger'
  }
  if (status === MessageAnalysisStatus.Dropped) {
    return `info`
  }
  return 'success'
}

const isDetailDialogVisible = ref(false)
const detailId = ref('')
const handleView = (id: string) => {
  detailId.value = id
  isDetailDialogVisible.value = true
}
</script>
