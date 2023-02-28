<template>
  <div class="app-wrapper topics">
    <el-form @keyup.enter="handleSearch">
      <el-row class="search-wrapper" :gutter="28">
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
          <el-button type="primary" :icon="RefreshRight" @click="loadTopics">
            {{ $t('Base.refresh') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="topic" :label="$t('Topics.topic')" show-overflow-tooltip>
        <template #default="{ row }">
          <PreWithEllipsis>{{ row.topic }}</PreWithEllipsis>
        </template>
      </el-table-column>
      <el-table-column prop="node" :label="$t('Clients.node')" />
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-tooltip
            v-if="!isTopicCanCreateTopic(row.topic)"
            class="box-item"
            effect="dark"
            :content="tl('wildcardNotSupport')"
          >
            <span>
              <el-button size="small" plain disabled> {{ tl('addMetric') }}</el-button>
            </span>
          </el-tooltip>
          <el-button v-else size="small" plain @click="createMetricForTopic(row.topic)">
            {{ tl('addMetric') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="emq-table-footer">
      <common-pagination v-model:metaData="pageMeta" @loadPage="loadTopics" />
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
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import useI18nTl from '@/hooks/useI18nTl'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import PreWithEllipsis from '@/components/PreWithEllipsis.vue'

const router = useRouter()
const { tl } = useI18nTl('Subs')

const tableData = ref([])
const searchValue = ref('')
const lockTable = ref(true)
const params = ref<Record<string, any>>({})

const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const handleSearch = async () => {
  const topic = searchValue.value.trim()
  params.value.topic = topic
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

const createMetricForTopic = (topic: string) => {
  router.push({ name: 'topic-metrics', query: { topic } })
}

loadTopics()
</script>
