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
          <p class="table-data-without-break">{{ row.topic }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="node" :label="$t('Clients.node')" />
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

const tableData = ref([])
const searchValue = ref('')
const lockTable = ref(true)
const params = ref<Record<string, any>>({})
const pageMeta = ref({})

const handleSearch = async () => {
  const topic = searchValue.value.trim()
  params.value.topic = topic
  loadTopics({ page: 1 })
}

const loadTopics = async (_params = {}) => {
  lockTable.value = true
  const sendParams = { ...params.value, ...pageMeta.value, ..._params }
  Reflect.deleteProperty(sendParams, 'count')
  const res = await listTopics(sendParams).catch(() => {
    lockTable.value = false
  })
  if (res) {
    const { data = [], meta = {} } = res
    tableData.value = data
    lockTable.value = false

    pageMeta.value = meta
  } else {
    tableData.value = []
    lockTable.value = false
    pageMeta.value = {}
  }
}
loadTopics()
</script>
