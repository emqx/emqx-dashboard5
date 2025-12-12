<template>
  <div class="message-stream-page">
    <MSGuidance v-if="showPlaceholder" :enabled="isMSEnabled" @create="handleCreate" />
    <template v-else>
      <div class="app-wrapper">
        <div class="section-header">
          <div></div>
          <LinkButton :disabled="!$hasPermission('put')" :to="{ name: 'mqtt-message-stream' }">
            <Settings class="mr-2" />
            {{ t('Base.setting') }}
          </LinkButton>
          <CreateButton @click="handleCreate" />
        </div>

        <el-table
          v-loading="loading"
          :data="messageStreams"
          class="data-table"
          :default-sort="{ prop: 'topic_filter', order: 'ascending' }"
        >
          <el-table-column prop="topic_filter" :label="t('MessageQueue.topicFilter')">
            <template #default="{ row }">
              <span class="topic-filter">{{ row.topic_filter }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="is_lastvalue" :label="t('MessageQueue.isLastvalue')">
            <template #default="{ row }">
              {{ row.is_lastvalue ? t('Base.yes') : t('Base.no') }}
            </template>
          </el-table-column>

          <el-table-column
            prop="data_retention_period"
            :label="t('MessageQueue.dataRetentionPeriod')"
          >
            <template #default="{ row }">
              <span>{{ getIntDurationStr(row.data_retention_period) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('Base.operation')" width="160">
            <template #default="{ row }">
              <TableButton :disabled="!$hasPermission('put')" @click="handleEdit(row)">
                {{ t('Base.edit') }}
              </TableButton>
              <TableButton :disabled="!$hasPermission('delete')" @click="handleDelete(row)">
                {{ t('Base.delete') }}
              </TableButton>
            </template>
          </el-table-column>
        </el-table>
        <div class="emq-table-footer">
          <CommonMiniPagination
            :current-page="page"
            :hasnext="hasNext"
            :page-size="limit"
            :page-sizes="defaultPageSizeOpt"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </template>

    <MessageStreamDialog
      v-model="isDialogShow"
      :stream="currentMessageStream"
      @submitted="loadMessageStreams"
    />
  </div>
</template>

<script setup lang="ts">
import {
  deleteMessageStream,
  getMessageStreamList,
  getMessageStreamsConfig,
} from '@/api/messageStream'
import { DEFAULT_PAGE_SIZE_OPT as defaultPageSizeOpt } from '@/common/constants'
import { MessageStreamItem } from '@/types/typeAlias'
// import { Settings } from 'lucide-vue-next'
import MessageStreamDialog from './components/MessageStreamDialog.vue'
import MSGuidance from './components/MSGuidance.vue'
import { Settings } from 'lucide-vue-next'

const { t, tl } = useI18nTl('MessageStream')

const isMSEnabled = ref(true)

const loading = ref(false)
const messageStreams = ref<MessageStreamItem[]>([])

const showPlaceholder = computed(() => !loading.value && (noData.value || !isMSEnabled.value))

const { page, limit, pageParams, hasNext, setCursor } = useCursorPagination()
const { getIntDurationStr } = useDurationStr()

const isDialogShow = ref(false)
const currentMessageStream = ref<MessageStreamItem | undefined>(undefined)

const noData = computed(() => messageStreams.value.length === 0 && page.value === 1)

const loadMSEnabled = async () => {
  try {
    loading.value = true
    const { enable } = await getMessageStreamsConfig()
    // If enable is undefined, it might default to true or false?
    // Assuming true if not present or following server default.
    // Schema says enable?: boolean.
    if (enable !== undefined) {
      isMSEnabled.value = enable
    }
  } catch (error) {
    //
  } finally {
    loading.value = false
  }
}

const loadMessageStreams = async (isBack?: boolean) => {
  try {
    loading.value = true
    const { data = [], meta = {} } = await getMessageStreamList(pageParams.value)
    messageStreams.value = data
    setCursor(page.value + 1, meta.cursor)
    if (isBack && page.value !== 1 && data.length === 0) {
      ElMessage.warning(t('Clients.pageJumpTip'))
      handlePageChange(1)
    }
  } catch (error) {
    messageStreams.value = []
  } finally {
    loading.value = false
  }
}

const handlePageChange = (no: number) => {
  const isBack = no < page.value
  page.value = no
  loadMessageStreams(isBack)
}

const handleSizeChange = (size: number) => {
  limit.value = size
  handlePageChange(1)
}

const handleCreate = () => {
  currentMessageStream.value = undefined
  isDialogShow.value = true
}

const handleEdit = (stream: MessageStreamItem) => {
  currentMessageStream.value = stream
  isDialogShow.value = true
}

const { confirmDel } = useOperationConfirm()
const handleDelete = async (stream: MessageStreamItem) => {
  const confirmText = tl('deleteTip', { topicFilter: stream.topic_filter })
  await confirmDel(() => deleteMessageStream(stream.topic_filter), confirmText)
  loadMessageStreams()
}

;(async () => {
  await loadMSEnabled()
  if (!isMSEnabled.value) {
    return
  }
  loadMessageStreams()
})()
</script>
