<template>
  <div class="log-view">
    <div class="search-wrapper">
      <el-form :inline="true" @keyup.enter.prevent="search">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="filterForm.content_like"
              clearable
              :placeholder="t('QoS.logContent')"
              @clear="search"
            />
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="filterForm.module"
              clearable
              :placeholder="t('QoS.logModule')"
              @clear="search"
            >
              <el-option v-for="item in moduleOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-col>
          <el-col :span="6" />
          <el-col :span="6" class="col-oper">
            <SearchButton @click="search" />
            <ResetButton @click="handleReset" />
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="app-wrapper" v-loading="viewNodeLoading" :element-loading-text="nextPageLoading">
      <div :style="{ height: initialHeight + 'px' }" class="viewer-container" ref="monacoContainer">
        <monaco
          id="log-trace"
          v-model="logContent"
          :scroll-loading="true"
          :scroll-func="scrollLoadFunc"
          lang="powershell"
          :disabled="true"
        ></monaco>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { querySysLog } from '@/api/diagnose'
import { IScrollEvent } from 'monaco-editor'

const { t } = useI18nTl('LogTrace')
const monacoContainer = ref()
const initialHeight = ref(300)
const logContent = ref('')
const logLength = ref(0)
const viewNodeLoading = ref(false)
const nextPageLoading = ref('')

const { page, limit, count } = usePagination()
limit.value = 100
const filterForm = ref({
  content_like: '',
  module: undefined,
})

const moduleOptions = [
  'PUBLISH',
  'SUBSCRIBE',
  'UNSUBSCRIBE',
  'API',
  'MQTT',
  'WS-MQTT',
  'SOCKET',
  'CLI',
  'QUERY',
  'RULE',
  'AUTHZ',
  'MULTI_TENANCY',
  'CUSTOM',
]

const countInitialHeight = () => {
  const offsetTop = (monacoContainer.value?.getBoundingClientRect()?.top || 250) + 30
  const windowHeight = window.innerHeight
  initialHeight.value = windowHeight - offsetTop
}

const viewDetail = async () => {
  viewNodeLoading.value = true
  logContent.value = ''
  nextPageLoading.value = ''
  await loadLogDetail()
  viewNodeLoading.value = false
}

const scrollLoadFunc = async (event: IScrollEvent) => {
  const { scrollTop, scrollHeight, scrollTopChanged } = event
  const isScrollBottom = scrollTop + initialHeight.value >= scrollHeight && scrollTopChanged
  if (isScrollBottom && logLength.value < count.value) {
    viewNodeLoading.value = true
    nextPageLoading.value = t('LogTrace.loadNextPage')
    page.value++
    await loadLogDetail()
    viewNodeLoading.value = false
  }
}

const loadLogDetail = async () => {
  const params = {
    page: page.value,
    limit: limit.value,
    ...Object.fromEntries(Object.entries(filterForm.value).filter(([, value]) => !!value)),
  }
  try {
    const { meta, contents } = await querySysLog(params)
    logLength.value += contents.length
    logContent.value += contents.join('\n')
    count.value = meta.count
  } catch (error) {
    //
  }
}

const search = () => {
  logContent.value = ''
  logLength.value = 0
  page.value = 1
  count.value = 0
  loadLogDetail()
}

const handleReset = () => {
  filterForm.value.content_like = ''
  filterForm.value.module = undefined
  search()
}

onMounted(() => {
  countInitialHeight()
  viewDetail()
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
