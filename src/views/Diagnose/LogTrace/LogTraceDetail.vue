<template>
  <div class="log-trace-detail app-wrapper">
    <detail-header :item="{ name: viewLogName, path: '/log-trace' }" />
    <div v-loading="viewNodeLoading" :element-loading-text="nextPageLoading">
      <el-row :gutter="30">
        <el-col :span="6">
          <el-select v-model="selectedNode">
            <el-option v-for="item in nodeOpts" :value="item.node" :key="item.node" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button
            class="dialog-primary-btn"
            type="primary"
            @click="download()"
            :loading="isDownloading"
            :disabled="viewNodeLoading"
          >
            {{ $t('Base.download') }}
          </el-button>
        </el-col>
        <el-col :span="14" class="align-right">
          <RefreshButton type="default" @click="viewDetail" />
        </el-col>
      </el-row>
      <p class="default-node-tip tip">{{ tl('defaultNodeTip') }}</p>
      <el-row>
        <div
          :style="{ height: initialHeight + 'px' }"
          class="viewer-container"
          ref="monacoContainer"
        >
          <monaco
            :key="monacoKey"
            id="log-trace"
            v-model="logContent"
            :scroll-loading="true"
            :scroll-func="scrollLoadFunc"
            lang="powershell"
            :disabled="true"
          ></monaco>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { downloadTrace, getTraceList, getTraceLog, getTraceNodesMsg } from '@/api/diagnose'
import { TraceItem } from '@/types/diagnose'
import { TraceTraceStatus } from '@/types/schemas/trace.schemas'
import { GetTraceContentParams } from '@/types/typeAlias'
import { IScrollEvent } from 'monaco-editor'

let lastPosition: undefined | string | number = undefined
let isEndOfFile = false
let LAST_ACTIVITY_SCROLL_TOP = 0
const BYTE_PER_PAGE = 50 * 1024
const EDITOR_LINE_HEIGHT = 20

interface NodeInfo {
  mtime: number
  node: string
  size: number
}

const { t, tl } = useI18nTl('LogTrace')
const route = useRoute()
const monacoContainer = ref()
const initialHeight = ref(300)
const logContent = ref('')
let fullScreenLines = 30
let totalLine: number = 0
const viewNodeLoading = ref(false)
const nodeOpts: Ref<Array<NodeInfo>> = ref([])
const selectedNode = ref('')
const viewLogName: string = route.params.id as string
const nextPageLoading = ref('')
const isDownloading = ref(false)

const traceInfo = ref<TraceItem | undefined>(undefined)
const isTraceRunning = computed(() => traceInfo.value?.status === TraceTraceStatus.running)

const getTraceStatus = async () => {
  try {
    const list = await getTraceList()
    const trace = list.find((item) => item.name === viewLogName)
    traceInfo.value = trace
  } catch (error) {
    //
  }
}
getTraceStatus()

const countInitialHeight = () => {
  const offsetTop = (monacoContainer.value?.getBoundingClientRect()?.top || 250) + 30
  const windowHeight = window.innerHeight
  initialHeight.value = windowHeight - offsetTop
  fullScreenLines = Math.floor(initialHeight.value / EDITOR_LINE_HEIGHT) + 10
}

const sortNodesByTime = (nodeList: Array<NodeInfo>) => {
  return nodeList.sort((node1, node2) => node2.mtime - node1.mtime)
}

const loadNodeOpts = async () => {
  try {
    const data = await getTraceNodesMsg(viewLogName)
    nodeOpts.value = sortNodesByTime(data)
    selectedNode.value = nodeOpts.value[0].node
  } catch (error) {
    console.error(error)
  }
}

const monacoKey = ref(0)
const viewDetail = async (changeNode = false) => {
  viewNodeLoading.value = true
  if (lastPosition) {
    monacoKey.value++
  }
  lastPosition = undefined
  LAST_ACTIVITY_SCROLL_TOP = 0
  logContent.value = ''
  nextPageLoading.value = ''
  if (!changeNode) {
    await loadNodeOpts()
  }
  await loadLogDetail(viewLogName)

  viewNodeLoading.value = false
}

const scrollLoadFunc = async (event: IScrollEvent) => {
  if (
    event.scrollTop + initialHeight.value >= event.scrollHeight &&
    event.scrollTopChanged &&
    event.scrollTop >= LAST_ACTIVITY_SCROLL_TOP
  ) {
    if (isEndOfFile && !isTraceRunning.value) {
      ElMessage.info(t('LogTrace.eof'))
      return
    }
    LAST_ACTIVITY_SCROLL_TOP = event.scrollTop
    viewNodeLoading.value = true
    nextPageLoading.value = t('LogTrace.loadNextPage')
    await loadLogDetail(viewLogName)
    viewNodeLoading.value = false
  }
}

const loadLogDetail = async (name: string) => {
  const params: GetTraceContentParams = {
    bytes: BYTE_PER_PAGE,
    node: selectedNode.value,
  }
  if (lastPosition) {
    params.position = lastPosition
  }
  try {
    const logResp = await getTraceLog(name, params)
    if (logResp?.items !== undefined) {
      const { meta } = logResp
      logContent.value += logResp.items
      lastPosition = meta?.position
      isEndOfFile = meta?.hint === 'eof'
      if (isTraceRunning.value && isEndOfFile && !logResp.items) {
        ElMessage.info(t('LogTrace.runningEof'))
      }
      totalLine = logContent.value.match(/\n/g)?.length || 0
      // Try to load the log to fill the content of the first screen
      if (logResp.items.length && !isEndOfFile && totalLine < fullScreenLines) {
        await loadLogDetail(name)
      }
    }
  } catch (error: any) {
    const { response = {} } = error || {}
    if (response?.status === 400 && error?.code === 'STALE_CURSOR') {
      ElMessage.error(t('LogTrace.staleCursor'))
    }
  }
}
const download = async () => {
  try {
    isDownloading.value = true
    await downloadTrace(viewLogName, selectedNode.value)
  } catch (error) {
    //
  } finally {
    isDownloading.value = false
  }
}

onMounted(() => {
  countInitialHeight()
  viewDetail()
})

watch(
  () => selectedNode.value,
  (v, oldV) => {
    // !!oldV for prevent repeat request on initialization
    if (v !== oldV && !!oldV) {
      viewDetail(true)
    }
  },
)
</script>

<style lang="scss" scoped>
.default-node-tip {
  margin-top: 12px;
}
.viewer-container {
  border: 1px solid var(--color-border-primary);
  margin-top: 30px;
  width: 100%;
  height: 100%;
}
.align-right {
  text-align: right;
}
</style>
