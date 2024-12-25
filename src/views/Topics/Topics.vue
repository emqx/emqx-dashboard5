<template>
  <div class="topics">
    <el-form class="search-wrapper without-padding-top" @keyup.enter="handleSearch">
      <el-row :gutter="28">
        <el-col :span="8">
          <el-input
            v-model="searchValue"
            :placeholder="$t('Topics.topic')"
            clearable
            @clear="handleSearch"
          />
        </el-col>
        <el-col :span="8">
          <el-button type="primary" plain :icon="Search" @click="handleSearch">
            {{ $t('Base.search') }}
          </el-button>
          <el-button :icon="RefreshLeft" @click="handleReset">
            {{ $t('Base.reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="app-wrapper">
      <div class="section-header">
        <div></div>
        <RefreshButton @click="loadTopics" />
      </div>
      <el-table :data="tableData" v-loading.lock="lockTable">
        <el-table-column prop="topic" :label="$t('Topics.topic')">
          <template #default="{ row }">
            <CommonOverflowTooltip :content="row.topic" />
          </template>
        </el-table-column>
        <el-table-column prop="node" :label="$t('Clients.node')" />
      </el-table>
      <div class="emq-table-footer">
        <common-pagination v-model:metaData="pageMeta" @loadPage="loadTopics" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Topics',
})
</script>

<script lang="ts" setup>
import { listTopics } from '@/api/common'
import CommonPagination from '../../components/commonPagination.vue'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import useI18nTl from '@/hooks/useI18nTl'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'

const { tl } = useI18nTl('Subs')

const tableData = ref([])
const searchValue = ref('')
const lockTable = ref(true)
const params = ref<Record<string, any>>({})

const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const handleSearch = () => {
  const topic = searchValue.value.trim()
  params.value.topic = topic
  loadTopics({ page: 1 })
}

const handleReset = () => {
  searchValue.value = ''
  params.value = {}
  loadTopics({ page: 1 })
}

const loadTopics = async (_params = {}) => {
  lockTable.value = true
  const sendParams = { ...params.value, ...pageParams.value, ..._params }
  try {
    const { data = [], meta = {} } = await listTopics(sendParams)
    tableData.value = data
    setPageMeta(meta)
  } catch (error) {
    tableData.value = []
    initPageMeta()
  } finally {
    lockTable.value = false
  }
}

const wildcardReg = /\/(#|\+)/
const isTopicCanCreateTopic = (topic: string) => !wildcardReg.test(topic)

loadTopics()
</script>

<style lang="scss">
@import '~@/style/management.scss';
.topics {
  .search-wrapper {
    margin-top: -12px;
  }
}
</style>
