<template>
  <div class="log-trace-detail app-wrapper">
    <detail-header :item="{ name: viewLogName, path: '/log-trace' }" />
    <div v-loading="viewNodeLoading" :element-loading-text="nextPageLoading">
      <el-row :gutter="30">
        <el-col :span="6">
          <el-select v-model="node">
            <el-option v-for="item in currentNodes" :value="item.node" :key="item.node"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button
            class="dialog-primary-btn"
            type="primary"
            @click="download()"
            :disabled="viewNodeLoading"
          >
            {{ $t('Base.download') }}
          </el-button>
        </el-col>
      </el-row>
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
            :key="logContent"
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
import { getTraceLog, downloadTrace } from '@/api/diagnose'
import { ElMessage as M } from 'element-plus'
import { loadNodes } from '@/api/common'
import { NodeMsg } from '@/types/dashboard'

let LOG_VIEW_POSITION = 0
let LAST_ACTIVED_SCROLLTOP = 0
const MAX_LOG_SIZE = 5 * 1024 * 1024
const BYTEPERPAGE = 50 * 1024

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
    const currentNodes: Ref<Array<NodeMsg>> = ref([])
    const node = ref('')
    const viewLogName: string = route.params.id as string
    const nextPageLoading = ref('')

    const countInitialHeight = () => {
      const offsetTop = (monacoContainer.value?.getBoundingClientRect()?.top || 250) + 30
      const windowHeight = window.innerHeight
      initialHeight.value = windowHeight - offsetTop
    }

    const loadCurrentNodes = async () => {
      try {
        const data = await loadNodes()
        currentNodes.value = data
        node.value = currentNodes.value[0]?.node || ''
      } catch (error) {
        console.error(error)
      }
    }

    const viewDetail = async (changeNode = false) => {
      viewNodeLoading.value = true
      LOG_VIEW_POSITION = 0
      LAST_ACTIVED_SCROLLTOP = 0
      logContent.value = ''
      nextPageLoading.value = ''
      if (!changeNode) {
        await loadCurrentNodes()
      }
      await loadLogDetail(viewLogName)

      viewNodeLoading.value = false
    }

    const scrollLoadFunc = async (event: IScrollEvent) => {
      if (
        event.scrollTop + initialHeight.value >= event.scrollHeight &&
        event.scrollTopChanged &&
        event.scrollTop >= LAST_ACTIVED_SCROLLTOP
      ) {
        if (LOG_VIEW_POSITION <= MAX_LOG_SIZE) {
          LAST_ACTIVED_SCROLLTOP = event.scrollTop
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
        bytes: BYTEPERPAGE,
        node: node.value,
      }
      const logResp = await getTraceLog(name, params).catch(() => {})
      if (logResp && logResp.items) {
        const { meta = {} } = logResp
        logContent.value += logResp.items
        LOG_VIEW_POSITION = meta.position ? meta.position : LOG_VIEW_POSITION + BYTEPERPAGE
      }
    }
    const download = async () => {
      await downloadTrace(viewLogName)
      // download link, no more action needed
    }

    onMounted(() => {
      // loadCurrentNodes();
      countInitialHeight()
      viewDetail()
    })

    watch(
      () => node.value,
      (v, oldV) => {
        if (v && oldV && v !== oldV) viewDetail(true)
      },
    )

    return {
      tl: (key: string) => t('LogTrace.' + key),
      monacoContainer,
      initialHeight,
      download,
      logContent,
      scrollLoadFunc,
      currentNodes,
      node,
      viewNodeLoading,
      nextPageLoading,
      viewLogName,
    }
  },
})
</script>

<style lang="scss" scoped>
.viewer-container {
  border: 1px solid #ddd;
  margin-top: 30px;
  width: 100%;
  height: 100%;
}
</style>
