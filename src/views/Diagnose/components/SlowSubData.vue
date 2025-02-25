<template>
  <div class="slow-sub-data">
    <div class="slow-sub-data-bar">
      <div>
        <el-button
          :icon="Setting"
          @click="$router.push({ name: 'slow-sub-config' })"
          :disabled="!$hasPermission('put')"
        >
          {{ $t('Base.setting') }}
        </el-button>
        <el-button type="danger" :disabled="!$hasPermission('delete')" plain @click="clearData">
          {{ tl('clearData') }}
        </el-button>
      </div>
    </div>
    <el-table ref="TableCom" :data="statistics" @sort-change="sortTable">
      <el-table-column prop="clientid" :label="$t('Base.clientid')">
        <template #default="{ row }">
          <router-link :to="getRoute(row.clientid)">
            <CommonOverflowTooltip :content="row.clientid" />
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="topic" :label="tl('topic')">
        <template #default="{ row }">
          <CommonOverflowTooltip :content="row.topic" />
        </template>
      </el-table-column>
      <el-table-column prop="timespan" :label="tl('duration')" sortable="custom">
        <template #default="{ row }">
          {{ formatTime(row.timespan) }}
        </template>
      </el-table-column>
      <el-table-column prop="node" :label="$t('Clients.node')" />
      <el-table-column prop="last_update_time" :label="tl('updated')">
        <template #default="{ row }">
          {{ dayjs(row.last_update_time).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <commonPagination :meta-data="pageController" @load-page="reloadStatistics" />
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'SlowSubData',
})
</script>

<script setup lang="ts">
import { clearSlowSubData, querySlowSubStatistics } from '@/api/diagnose'
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'
import commonPagination from '@/components/commonPagination.vue'
import useI18nTl from '@/hooks/useI18nTl'
import usePageController from '@/hooks/usePagination'
import usePaginationRemember from '@/hooks/usePaginationRemember'
import usePaging from '@/hooks/usePaging'
import { SlowSubStatistic } from '@/types/diagnose'
import { Setting } from '@element-plus/icons-vue'

import dayjs from 'dayjs'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { tl } = useI18nTl('SlowSub')

const statistics: Ref<Array<SlowSubStatistic>> = ref([])
const { page, limit, count } = usePageController()
const pageController = computed(() => ({
  page: page.value,
  limit: limit.value,
  count: count.value,
}))
const { setTotalData, getAPageData } = usePaging()
let sortFrom: { key: string; type: 'asc' | 'desc' } | undefined = undefined

const { updateParams, checkParamsInQuery } = usePaginationRemember('clients-detail')

const getRoute = (id: string) => ({
  name: 'clients-detail',
  params: { clientId: id },
  query: { from: 'slow-sub' },
})

const getTotalStatistics = async () => {
  try {
    const data = await querySlowSubStatistics()
    setTotalData(data)
    getPageData()
  } catch (error) {
    //
  }
}

const getPageData = () => {
  const { data, meta } = getAPageData({ page: page.value, limit: limit.value }, [], sortFrom)
  statistics.value = data
  count.value = meta.count || 0
  updateParams({ ...pick(meta, ['limit', 'page']), ...sortFrom })
}

const sortTable = ({
  prop,
  order,
}: {
  column: SlowSubStatistic | null
  prop: string | null
  order: 'descending' | 'ascending' | null
}) => {
  if (!prop) {
    sortFrom = undefined
  } else {
    sortFrom = {
      key: prop,
      type: order === 'descending' ? 'desc' : 'asc',
    }
  }
  reloadStatistics({ page: 1, limit: limit.value })
}

const reloadStatistics = (pageData: { page: number; limit: number }) => {
  page.value = pageData.page
  limit.value = pageData.limit
  getPageData()
}

const clearData = async () => {
  try {
    await ElMessageBox.confirm(tl('confirmClearData'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    await clearSlowSubData()
    ElMessage.success(t('Base.operateSuccess'))
    getTotalStatistics()
  } catch (error) {
    //
  }
}

const formatTime = (time: number) => {
  if (time < 1000) {
    return `${time}ms`
  }
  return `${time / 1000}s`
}

const TableCom = ref()
const getParamsFromQuery = async () => {
  const { pageParams, filterParams } = checkParamsInQuery()
  page.value = pageParams.page || page.value
  limit.value = pageParams.limit || limit.value
  if (
    filterParams &&
    Object.keys(filterParams).length > 0 &&
    (filterParams.key || filterParams.type)
  ) {
    if (!sortFrom) {
      sortFrom = { key: '', type: 'desc' }
    }
    sortFrom.key = filterParams.key || sortFrom.key
    sortFrom.type = filterParams.type || sortFrom.type
  }
}

getParamsFromQuery()
getTotalStatistics()
</script>

<style lang="scss" scoped>
.slow-sub-data {
  .slow-sub-data-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 40px;
  }
  .el-icon-question {
    vertical-align: top;
    margin-left: 4px;
  }
}
</style>
