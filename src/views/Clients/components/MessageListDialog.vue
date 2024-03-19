<template>
  <el-dialog
    v-model="showDialog"
    class="message-list-dialog"
    :width="1060"
    :title="dialogTitle"
    destroy-on-close
  >
    <div class="dialog-hd">
      <el-button type="primary" @click="refreshList">
        {{ t('Base.refresh') }}
      </el-button>
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
import { dateFormat, waitAMoment } from '@/common/tools'
import PayloadDialog from '@/components/PayloadDialog.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { MessageItem } from '@/types/client'
import { ElButton } from 'element-plus'
import { debounce, isUndefined } from 'lodash'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const TABLE_HEIGHT = 400
const TABLE_ROW_HEIGHT = 50
const tableBodyHeight = TABLE_HEIGHT - TABLE_ROW_HEIGHT

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

const dialogTitle = computed(() => {
  return props.type === 'mqueue' ? tl('msgQueueMsgList') : tl('inflightMsgList')
})

const isLoading = ref(false)

const TableRef = ref()

const msgList = ref<Array<MessageItem>>([])

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
const msgIdWidth = (tableWidth - publishTimeWidth - qosWidth - payloadWidth) / 3
const columns = [
  { title: tl('msgId'), key: 'msgid', dataKey: 'msgid', width: msgIdWidth },
  { title: t('Base.topic'), key: 'topic', dataKey: 'topic', width: msgIdWidth },
  { title: 'QoS', key: 'qos', dataKey: 'qos', width: qosWidth },
  { title: t('Base.clientid'), key: 'from_clientid', dataKey: 'from_clientid', width: msgIdWidth },
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
        <ElButton size="small" onClick={() => showPayload(rowData)}>
          {t('Extension.openPayload')}
        </ElButton>
      )
    },
  },
]

let lastPosition = 'none'

const withPriorityReg = /\d+_\d+/
const removeOutdatedData = (start: string, list: Array<MessageItem>) => {
  // If start is none, there is no data in the list.
  if (start === 'none') {
    return []
  }
  let startNum = Number(start)
  if (withPriorityReg.test(start)) {
    // TODO: compare with priority
    // TODO: compare with priority
    // TODO: compare with priority
    startNum = Number(start.slice(0, -2))
  }
  const ret = [...list]
  let lastOutdatedIndex = -1
  for (lastOutdatedIndex = 0; lastOutdatedIndex < ret.length; lastOutdatedIndex++) {
    if (ret[lastOutdatedIndex].publish_at >= startNum) {
      break
    }
  }
  if (lastOutdatedIndex > -1) {
    ret.splice(0, lastOutdatedIndex)
  }
  return ret
}

const getList = async () => {
  try {
    isLoading.value = true
    const request = props.type === 'mqueue' ? loadMsgQueue : loadInflightMsgs
    const { data = [], meta } = await request(props.clientId, {
      limit,
      position: lastPosition,
    })
    const preList = [...msgList.value]
    msgList.value.push(...data)
    const lengthBeforeRemove = msgList.value.length
    await waitAMoment(800)
    // just remove outdated data from old data
    msgList.value = [...removeOutdatedData(meta.start, preList), ...data]
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

const showPayload = ({ topic, payload }: MessageItem) => {
  currentTopic.value = topic
  payloadContent.value = payload
  showPayloadDialog.value = true
}

const handleScroll = debounce(async (scrollArg: any) => {
  if (!isUndefined(scrollArg?.scrollTop)) {
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
}
</style>
