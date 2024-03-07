<template>
  <el-dialog v-model="showDialog" class="message-list-dialog" :width="1060" :title="dialogTitle">
    <div class="dialog-hd">
      <el-button type="primary" @click="refreshList">
        {{ t('Base.refresh') }}
      </el-button>
    </div>
    <el-scrollbar max-height="400px">
      <el-table :data="msgList" class="msg-table">
        <el-table-column :label="tl('msgId')" prop="msgid" :min-width="92" />
        <el-table-column :label="t('Base.topic')" prop="topic" :min-width="92" />
        <el-table-column label="QoS" prop="qos" :width="88" />
        <el-table-column :label="t('Base.clientid')" prop="from_clientid" :min-width="146" />
        <el-table-column :label="t('Extension.publishTime')" :width="168">
          <template #default="{ row }">
            {{ row.publish_at && dateFormat(row.publish_at) }}
          </template>
        </el-table-column>
        <el-table-column :label="'Payload'" :width="132">
          <template #default="{ row }">
            <el-button size="small" @click="showPayload(row)">
              {{ t('Extension.openPayload') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <div class="emq-table-footer">
      <CommonPagination @loadPage="getList" v-model:metaData="pageMeta" />
    </div>
    <PayloadDialog
      v-model="showPayloadDialog"
      :raw-payload="payloadContent"
      :topic="currentTopic"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { loadInflightMsgs, loadMsgQueue } from '@/api/clients'
import { dateFormat } from '@/common/tools'
import PayloadDialog from '@/components/PayloadDialog.vue'
import CommonPagination from '@/components/commonPagination.vue'
import useI18nTl from '@/hooks/useI18nTl'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import { MessageItem } from '@/types/client'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  clientId: string
  type: 'mqueue' | 'inflight'
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { t, tl } = useI18nTl('Clients')

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, (val) => {
  if (val) {
    getList()
  } else {
    msgList.value = []
  }
})

const dialogTitle = computed(() => {
  return props.type === 'mqueue' ? tl('msgQueueMsgList') : tl('inflightMsgList')
})

const isLoading = ref(false)

const msgList = ref<Array<MessageItem>>([])

const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const getList = async () => {
  try {
    isLoading.value = true
    const request = props.type === 'mqueue' ? loadMsgQueue : loadInflightMsgs
    const { data = [], meta = { limit: 20, page: 1 } } = await request(
      props.clientId,
      pageParams.value,
    )
    msgList.value = data
    setPageMeta(meta)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const refreshList = () => {
  initPageMeta()
  getList()
}

const showPayloadDialog = ref(false)
const payloadContent = ref('')
const currentTopic = ref('')

const showPayload = ({ topic, payload }: MessageItem) => {
  currentTopic.value = topic
  payloadContent.value = payload
  showPayloadDialog.value = true
}
</script>

<style lang="scss">
.message-list-dialog {
  .dialog-hd {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 24px;
  }
}
</style>
