<template>
  <el-dialog
    v-model="showDialog"
    class="message-list-dialog"
    :width="1060"
    :title="dialogTitle"
    destroy-on-close
  >
    <div class="dialog-hd">
      <RefreshButton @click="refreshList" />
    </div>

    <div class="table-container">
      <el-table-v2
        ref="TableRef"
        :columns="columns"
        :data="msgList"
        :width="tableWidth"
        :height="TABLE_HEIGHT"
        :row-height="TABLE_ROW_HEIGHT"
        scrollbar-always-on
        @scroll="handleScroll"
      />
    </div>
    <PayloadDialog
      v-model="showPayloadDialog"
      :raw-payload="payloadContent"
      :topic="currentTopic"
    />
  </el-dialog>
</template>

<script lang="tsx" setup>
import { loadInflightMsgs, loadMsgQueue } from '@/api/clients'
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'
import { MessageItem } from '@/types/client'

type MsgItem = MessageItem & {
  mqueue_priority: number | string
  /**
   * Time to insert queue
   */
  inserted_at: string
  /**
   * If the message is a message queue, it is spliced from inserted_at and priority; if it is an inflight message, it is inserted_at
   * for compare to remove outdated data
   */
  _id?: string
}

const TABLE_HEIGHT = 410
const TABLE_HEADER_HEIGHT = 50
const TABLE_ROW_HEIGHT = 60
const tableBodyHeight = TABLE_HEIGHT - TABLE_HEADER_HEIGHT

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
    initPageMeta()
    msgList.value = []
  }
})

const isMsgQueue = computed(() => props.type === 'mqueue')

const dialogTitle = computed(() => {
  return isMsgQueue.value ? tl('msgQueueMsgList') : tl('inflightMsgList')
})

const isLoading = ref(false)

const TableRef = ref()

const msgList = ref<Array<MsgItem>>([])

const totalLength = computed(() => msgList.value.length)

const scrollTop = ref(0)
const isScrollToBottom = computed(() => {
  return totalLength.value * TABLE_ROW_HEIGHT - scrollTop.value <= tableBodyHeight
})

const limit = 200

const tableWidth = 1020
const publishTimeWidth = 180
const qosWidth = 100
const payloadWidth = 180
const msgIdWidth = 240
const topicWidth = (tableWidth - publishTimeWidth - qosWidth - payloadWidth - msgIdWidth) / 2
const columns = [
  {
    title: tl('msgId'),
    key: 'msgid',
    dataKey: 'msgid',
    width: msgIdWidth,
    cellRenderer: ({ rowData }: any) => {
      if (
        !isMsgQueue.value ||
        rowData.mqueue_priority === 0 ||
        isUndefined(rowData.mqueue_priority)
      ) {
        return <CommonOverflowTooltip content={rowData.msgid} />
      }
      return (
        <>
          <span>{rowData.msgid}</span>
          <el-tag type="info" disable-transitions>
            {tl('priority')}: {rowData.mqueue_priority}
          </el-tag>
        </>
      )
    },
  },
  {
    title: t('Base.topic'),
    key: 'topic',
    dataKey: 'topic',
    width: topicWidth,
    cellRenderer: ({ rowData }: any) => <CommonOverflowTooltip content={rowData.topic} />,
  },
  { title: 'QoS', key: 'qos', dataKey: 'qos', width: qosWidth },
  {
    title: t('Base.clientid'),
    key: 'from_clientid',
    dataKey: 'from_clientid',
    width: topicWidth,
    cellRenderer: ({ rowData }: any) => <CommonOverflowTooltip content={rowData.from_clientid} />,
  },
  {
    title: t('Extension.publishTime'),
    key: 'publish_at',
    dataKey: 'publish_at',
    width: publishTimeWidth,
    cellRenderer: ({ rowData }: any) => rowData.publish_at && dateFormat(rowData.publish_at),
  },
  {
    title: 'Payload',
    width: payloadWidth,
    cellRenderer: ({ rowData }: any) => {
      return (
        <table-button onClick={() => showPayload(rowData)}>
          {t('Extension.openPayload')}
        </table-button>
      )
    },
  },
]

let lastPosition = 'none'

const removeOutdatedData = (start: string, list: Array<MsgItem>): Array<MsgItem> => {
  // If start is none, there is no data in the list.
  if (start === 'none') {
    return []
  }
  const ret = [...list]
  const startIndex = ret.findIndex((item) => item._id === start)
  if (startIndex > -1) {
    return ret.slice(startIndex)
  }
  return ret
}

const getList = async () => {
  try {
    isLoading.value = true
    const request = isMsgQueue.value ? loadMsgQueue : loadInflightMsgs
    const { data: rawData = [], meta } = await request(props.clientId, {
      limit,
      position: lastPosition,
    })
    const data = rawData.map((item: MsgItem) => {
      const { inserted_at, mqueue_priority } = item
      const _id = isMsgQueue.value ? `${inserted_at}_${mqueue_priority}` : inserted_at
      return { ...item, _id }
    })
    msgList.value.push(...data)
    const lengthBeforeRemove = msgList.value.length
    await waitAMoment(800)
    // just remove outdated data from old data
    msgList.value = removeOutdatedData(meta.start, msgList.value)
    const lengthAfterRemove = msgList.value.length
    if (lengthAfterRemove < lengthBeforeRemove) {
      const firstRow = msgList.value.findIndex((item) => item.msgid === data[0].msgid)
      if (firstRow > -1) {
        TableRef.value.scrollToRow(firstRow)
      }
    }
    lastPosition = meta.position
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const initPageMeta = () => {
  lastPosition = 'none'
}

const refreshList = () => {
  initPageMeta()
  msgList.value = []
  getList()
}

const showPayloadDialog = ref(false)
const payloadContent = ref('')
const currentTopic = ref('')

const showPayload = ({ topic, payload }: MsgItem) => {
  currentTopic.value = topic
  payloadContent.value = payload
  showPayloadDialog.value = true
}

const handleScroll = debounce(async (scrollArg: any) => {
  if (!isUndefined(scrollArg?.scrollTop) && scrollArg.scrollTop > 0) {
    scrollTop.value = scrollArg.scrollTop
    if (totalLength.value && isScrollToBottom.value) {
      getList()
    }
  }
}, 300)
</script>

<style lang="scss">
.message-list-dialog {
  .dialog-hd {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 24px;
  }
  .el-dialog__body {
    padding-bottom: 32px;
  }
  .el-table-v2:not(.is-dynamic) .el-table-v2__cell-text {
    white-space: normal;
    overflow: auto;
    text-overflow: unset;
    word-break: break-all;
  }
  .el-tag {
    margin-left: 6px;
  }
  .common-overflow-tooltip {
    width: 100%;
  }
}
</style>
