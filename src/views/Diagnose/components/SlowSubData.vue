<template>
  <div class="slow-sub-data">
    <div class="slow-sub-data-bar">
      <div>
        <el-button class="link-btn">
          <router-link :to="{ name: 'slow-sub-config' }">
            <el-icon><Tools class="el-icon-s-tools" /></el-icon>
            <span>
              {{ $t('Base.setting') }}
            </span>
          </router-link>
        </el-button>
        <el-button type="danger" plain @click="clearData">
          {{ tl('clearData') }}
        </el-button>
      </div>
    </div>
    <el-table :data="statistics" @sort-change="sortTable">
      <el-table-column prop="clientid" label="Client ID">
        <template #default="{ row }">
          <router-link
            :to="{
              name: 'clients-detail',
              params: { clientId: row.clientid },
            }"
          >
            {{ row.clientid }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="topic" :label="tl('topic')" />
      <el-table-column prop="timespan" :label="tl('duration')" sortable="custom">
        <template #default="{ row }">
          {{ formatTime(row.timespan) }}
        </template>
      </el-table-column>
      <el-table-column prop="node" :label="$t('Clients.node')" />
      <el-table-column prop="last_update_time" :label="tl('updated')">
        <template #default="{ row }">
          {{ moment(row.last_update_time).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <commonPagination :meta-data="pageController" @load-page="reloadStatistics" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SlowSubData',
})
</script>

<script setup lang="ts">
import { ref, Ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import commonPagination from '@/components/commonPagination.vue'
import usePageController from '@/hooks/usePagination'
import { SlowSubStatistic } from '@/types/diagnose'
import { clearSlowSubData, querySlowSubStatistics } from '@/api/diagnose'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import usePaging from '@/hooks/usePaging'
import { Tools } from '@element-plus/icons-vue'
import useI18nTl from '@/hooks/useI18nTl'
import { createRandomString } from '@/common/tools'

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
  .el-icon-s-tools {
    transform: scale(1.2);
  }
  .el-icon-question {
    vertical-align: top;
    margin-left: 4px;
  }
}
</style>
