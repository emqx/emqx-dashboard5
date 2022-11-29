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
      </el-row>
      <p class="default-node-tip tip">{{ tl('defaultNodeTip') }}</p>
      <el-row>
        <div
          :style="{ height: initialHeight + 'px' }"
          class="viewer-container"
          ref="monacoContainer"
        >
          <monaco
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

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Monaco from '@/components/Monaco.vue'
import DetailHeader from '@/components/DetailHeader.vue'
import { IScrollEvent } from 'monaco-editor'
import { useRoute } from 'vue-router'
import { getTraceLog, downloadTrace, getTraceDetail } from '@/api/diagnose'
import { ElMessage as M } from 'element-plus'

let LOG_VIEW_POSITION = 0
let LAST_ACTIVITY_SCROLL_TOP = 0
const MAX_LOG_SIZE = 5 * 1024 * 1024
const BYTE_PER_PAGE = 50 * 1024

interface NodeMsg {
  mtime: number
  node: string
  size: number
}

export default defineComponent({
  components: {
    Monaco,
    DetailHeader,
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const monacoContainer = ref()
    const initialHeight = ref(300)
    const logContent = ref('')
    const viewNodeLoading = ref(false)
    const nodeOpts: Ref<Array<NodeMsg>> = ref([])
    const selectedNode = ref('')
    const viewLogName: string = route.params.id as string
    const nextPageLoading = ref('')
    const isDownloading = ref(false)

    const countInitialHeight = () => {
      const offsetTop = (monacoContainer.value?.getBoundingClientRect()?.top || 250) + 30
      const windowHeight = window.innerHeight
      initialHeight.value = windowHeight - offsetTop
    }

    const sortNodesByTime = (nodeList: Array<NodeMsg>) => {
      return nodeList.sort((node1, node2) => node2.mtime - node1.mtime)
    }

    const loadNodeOpts = async () => {
      try {
        const data = await getTraceDetail(viewLogName)
        nodeOpts.value = sortNodesByTime(data)
        selectedNode.value = nodeOpts.value[0].node
      } catch (error) {
        console.error(error)
      }
    }

    const viewDetail = async (changeNode = false) => {
      viewNodeLoading.value = true
      LOG_VIEW_POSITION = 0
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
        if (LOG_VIEW_POSITION <= MAX_LOG_SIZE) {
          LAST_ACTIVITY_SCROLL_TOP = event.scrollTop
          viewNodeLoading.value = true
          nextPageLoading.value = t('LogTrace.loadNextPage')
          await loadLogDetail(viewLogName)
          viewNodeLoading.value = false
        } else {
          M.warning(t('LogTrace.tooLargeLog'))
        }
      }
    }

    const loadLogDetail = async (name: string) => {
      const params = {
        position: LOG_VIEW_POSITION,
        bytes: BYTE_PER_PAGE,
        node: selectedNode.value,
      }
      try {
        const logResp = await getTraceLog(name, params)
        if (logResp && logResp.items) {
          const { meta } = logResp
          logContent.value += logResp.items
          LOG_VIEW_POSITION = meta?.position ? meta.position : LOG_VIEW_POSITION + BYTE_PER_PAGE
        }
      } catch (error) {
        //
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

    return {
      tl: (key: string) => t('LogTrace.' + key),
      monacoContainer,
      initialHeight,
      download,
      logContent,
      scrollLoadFunc,
      nodeOpts,
      selectedNode,
      viewDetail,
      viewNodeLoading,
      isDownloading,
      nextPageLoading,
      viewLogName,
    }
  },
})
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
</style>
