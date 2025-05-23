<template>
  <div class="historical-subscriptions">
    <div class="section-header">
      <div></div>
      <div>
        <RefreshButton @click="refreshData" />
      </div>
    </div>
    <el-table :data="historySubs" v-loading="isLoading" style="margin-top: 16px">
      <el-table-column prop="id" label="ID" min-width="90">
        <template #default="{ row }">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column prop="topic" :label="t('Base.topic')" min-width="120" />
      <el-table-column prop="qos" label="QoS" min-width="60" />
      <el-table-column prop="event_label" :label="t('General.event')" min-width="80">
      </el-table-column>
      <el-table-column prop="time" :label="t('Tools.time')" min-width="160">
        <template #default="{ row }">
          {{ dateFormat(row.time) }}
        </template>
      </el-table-column>
    </el-table>
    <div
      class="emq-table-footer"
      v-if="count && count > (limit >= DEFAULT_PAGE_SIZE_OPT[0] ? DEFAULT_PAGE_SIZE_OPT[0] : limit)"
    >
      <CommonPagination :meta-data="pageParams" @load-page="refreshTable" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { loadHistorySubscriptions } from '@/api/clients'
import { Subscription } from '@/types/subscription'

const props = defineProps<{
  clientId: string
}>()

const { t } = useI18nTl('Clients')

const historySubs = ref<Subscription[]>([])
const isLoading = ref(false)

const { page, limit, count, pageParams } = usePagination()

const getTableData = async () => {
  try {
    isLoading.value = true
    const params = {
      page: page.value,
      limit: limit.value,
    }
    const { meta, data } = await loadHistorySubscriptions(props.clientId, params)
    count.value = meta?.count ?? 0
    historySubs.value = data
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
getTableData()

const refreshTable = (pageData: { page: number; limit: number }) => {
  page.value = pageData.page
  limit.value = pageData.limit
  getTableData()
}

const refreshData = () => {
  page.value = 1
  getTableData()
}
</script>

<style lang="scss">
.historical-subscriptions {
  .emq-table-footer {
    margin-bottom: 0;
  }
}
</style>
