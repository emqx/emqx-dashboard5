<template>
  <div class="message-queue-page">
    <!-- 有数据时显示表格 -->
    <template v-if="!noData || loading">
      <div class="app-wrapper">
        <div class="section-header">
          <div></div>
          <LinkButton :disabled="!$hasPermission('put')" :to="{ name: 'mqtt-message-queue' }">
            <Icon icon="lucide:settings" class="mr-2" />
            {{ t('Base.setting') }}
          </LinkButton>
          <CreateButton @click="handleCreate" />
        </div>

        <el-table
          v-loading="loading"
          :data="messageQueues"
          class="data-table"
          :default-sort="{ prop: 'topic_filter', order: 'ascending' }"
        >
          <el-table-column prop="topic_filter" :label="tl('topicFilter')">
            <template #default="{ row }">
              <span class="topic-filter">{{ row.topic_filter }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="dispatch_strategy" :label="tl('dispatchStrategy')">
            <template #default="{ row }">
              {{ getDispatchStrategyLabel(row.dispatch_strategy) }}
            </template>
          </el-table-column>

          <el-table-column prop="is_lastvalue" :label="tl('isLastvalue')">
            <template #default="{ row }">
              {{ row.is_lastvalue ? t('Base.yes') : t('Base.no') }}
            </template>
          </el-table-column>

          <el-table-column prop="data_retention_period" :label="tl('dataRetentionPeriod')">
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
          <MiniPagination
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

    <MQGuidance v-else @create="handleCreate" />

    <MessageQueueDialog
      v-model="isDialogShow"
      :queue="currentMessageQueue"
      @submitted="loadMessageQueues"
    />
  </div>
</template>

<script setup lang="ts">
import { deleteMessageQueue, getMessageQueues } from '@/api/messageQueue'
import { DEFAULT_PAGE_SIZE_OPT as defaultPageSizeOpt } from '@/common/constants'
import useMessageQueue from '@/hooks/MessageQueue/useMessageQueue'
import { MessageQueue } from '@/types/typeAlias'
import MessageQueueDialog from './components/MessageQueueDialog.vue'
import MQGuidance from './components/MQGuidance.vue'

const { t, tl } = useI18nTl('MessageQueue')

const loading = ref(false)
const messageQueues = ref<MessageQueue[]>([])

const { page, limit, pageParams, hasNext, setCursor } = useCursorPagination()
const { getIntDurationStr } = useDurationStr()

const isDialogShow = ref(false)
const currentMessageQueue = ref<MessageQueue | undefined>(undefined)

const noData = computed(() => messageQueues.value.length === 0 && page.value === 1)

const loadMessageQueues = async (isBack?: boolean) => {
  try {
    loading.value = true
    const { data = [], meta = {} } = await getMessageQueues(pageParams.value)
    messageQueues.value = data
    setCursor(page.value + 1, meta.cursor)
    if (isBack && page.value !== 1 && data.length === 0) {
      ElMessage.warning(t('Clients.pageJumpTip'))
      handlePageChange(1)
    }
  } catch (error) {
    messageQueues.value = []
  } finally {
    loading.value = false
  }
}

const handlePageChange = (no: number) => {
  const isBack = no < page.value
  page.value = no
  loadMessageQueues(isBack)
}

const handleSizeChange = (size: number) => {
  limit.value = size
  handlePageChange(1)
}

const { getDispatchStrategyLabel } = useMessageQueue()

const handleCreate = () => {
  currentMessageQueue.value = undefined
  isDialogShow.value = true
}

const handleEdit = (messageQueue: MessageQueue) => {
  currentMessageQueue.value = messageQueue
  isDialogShow.value = true
}

const { confirmDel } = useOperationConfirm()
const handleDelete = async (messageQueue: MessageQueue) => {
  const confirmText = tl('deleteTip', { topicFilter: messageQueue.topic_filter })
  await confirmDel(() => deleteMessageQueue(messageQueue.topic_filter), confirmText)
  loadMessageQueues()
}

loadMessageQueues()
</script>
