<template>
  <ActionAndSourceFilterForm :type="type" @search="search" />
  <div class="app-wrapper">
    <el-table
      :data="tableData"
      :empty-text="emptyTip"
      v-loading="isLoading"
      row-key="id"
      @sort-change="handleSortChange"
    >
      <el-table-column :label="tl('name')" :min-width="172" sortable="custom" prop="id">
        <template #default="{ row }">
          <router-link :to="getDetailPageRoute(row.id)" class="first-column-with-icon-type">
            <img v-if="row.type" class="icon-type" :src="getBridgeIcon(row.type)" />
            <div class="name-type-block">
              <span class="name-data">
                {{ row.name }}
              </span>
              <span class="type-data">{{ getGeneralTypeLabel(row.type) }}</span>
            </div>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.status')" :min-width="120" sortable>
        <template #default="{ row }">
          <TargetItemStatus type="action" :target="row" />
        </template>
      </el-table-column>
      <el-table-column prop="enable" :label="$t('Base.isEnabled')" :min-width="102" sortable>
        <template #default="{ row }">
          <OperateWebhookAssociatedPopover
            :disabled="!judgeIsWebhookAction(row)"
            :name="row.name"
            :operation="`${t('Base.enable')}${tl('or')}${t('Base.disable')}`"
            :targetLabel="tl('action')"
          >
            <el-switch
              v-model="row.enable"
              :disabled="judgeIsWebhookAction(row)"
              @change="toggleEnable(row)"
            />
          </OperateWebhookAssociatedPopover>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        :label="t('BridgeSchema.common.description.label')"
        :min-width="108"
      />
      <el-table-column
        sortable
        prop="rules.length"
        :min-width="168"
        :label="tl('associatedRules')"
        :sort-method="(row: BridgeItem) => row.rules?.length ?? 0"
      >
        <template #default="{ row }">
          <router-link
            v-for="item in row.rules"
            :to="{ name: 'rule-detail', params: { id: item } }"
            target="_blank"
            :key="item"
          >
            <el-tag size="small" type="info">{{ item }}</el-tag>
          </router-link>
          <div class="view-rules-link">
            <router-link :to="ruleFilterRoute(row.id)">
              {{ `${tl('viewRules')} (${row.rules?.length || 0})` }}
            </router-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" :label="t('Base.createdAt')" :min-width="162" sortable>
        <template #default="{ row }">
          {{ dateFormat(row.created_at, '') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="last_modified_at"
        :label="t('Base.lastModified')"
        :min-width="162"
        sortable
      >
        <template #default="{ row }">
          {{ dateFormat(row.last_modified_at, '') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" :min-width="180">
        <template #default="{ row }">
          <TableButton
            v-if="
              row.enable &&
              (row.status === ConnectionStatus.Disconnected ||
                row.status === ConnectionStatus.Inconsistent)
            "
            :loading="reconnectingMap.get(row.id) ?? false"
            @click="reconnect(row)"
          >
            {{ $t('RuleEngine.reconnect') }}
          </TableButton>
          <TableButton @click="$router.push(getDetailPageRoute(row.id, 'settings'))">
            {{ $t('Base.setting') }}
          </TableButton>
          <OperateWebhookAssociatedPopover
            :disabled="!judgeIsWebhookAction(row)"
            :name="row.name"
            :operation="tl('moreOperation')"
            :targetLabel="tl('action')"
          >
            <TableItemDropDown
              can-create-rule
              :row-data="row"
              :can-copy="false"
              :disabled="judgeIsWebhookAction(row)"
              @delete="handleDeleteBridge(row)"
              @create-rule="createRuleWithTarget(row.id)"
            />
          </OperateWebhookAssociatedPopover>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <commonPagination :meta-data="pageParams" @load-page="refreshTable" />
    </div>
  </div>
  <DeleteBridgeSecondConfirm
    v-model="showSecondConfirm"
    :rule-list="usingBridgeRules"
    :id="currentDeleteBridgeId"
    :direction="direction"
    @submitted="handleDeleteSuc"
  />
</template>

<script setup lang="ts">
import { dateFormat } from '@/common/tools'
import CommonPagination from '@/components/commonPagination.vue'
import useActionList from '@/hooks/Rule/action/useActionList'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import useHandleSourceItem from '@/hooks/Rule/action/useHandleSourceItem'
import useSourceList from '@/hooks/Rule/action/useSourceList'
import useBridgeTypeValue, { useBridgeTypeIcon } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useDeleteBridge from '@/hooks/Rule/bridge/useDeleteBridge'
import useI18nTl from '@/hooks/useI18nTl'
import usePagination from '@/hooks/usePagination'
import usePaginationRemember from '@/hooks/usePaginationRemember'
import usePaging from '@/hooks/usePaging'
import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import { BridgeDirection, ConnectionStatus } from '@/types/enum'
import { Action, BridgeItem, Source } from '@/types/rule'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isPlainObject, pick } from 'lodash'
import { computed, defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'
import DeleteBridgeSecondConfirm from '../Bridge/Components/DeleteBridgeSecondConfirm.vue'
import ActionAndSourceFilterForm from './ActionAndSourceFilterForm.vue'
import OperateWebhookAssociatedPopover from './OperateWebhookAssociatedPopover.vue'
import TableItemDropDown from './TableItemDropDown.vue'
import TargetItemStatus from './TargetItemStatus.vue'

const props = defineProps<{
  type: 'source' | 'action'
}>()

const isSource = computed(() => props.type === 'source')

const { t, tl } = useI18nTl('RuleEngine')

let totalData: Array<BridgeItem> = []
const tableData = ref<Array<BridgeItem>>([])

const filters = ref<Record<string, string | boolean>>({})
const getFilterArr = (
  filterParams: Record<string, string | boolean>,
): Array<{ key: string; value: string | boolean }> => {
  if (!isPlainObject(filterParams)) {
    return []
  }
  return Object.entries(filterParams).reduce(
    (arr: Array<{ key: string; value: string | boolean }>, [currentKey, currentVal]) => {
      return [...arr, { key: currentKey, value: currentVal }]
    },
    [],
  )
}
const filterArr = computed(() => getFilterArr(filters.value))

let sortFrom: { key: string; type: 'asc' | 'desc' } | undefined = undefined

const { setTotalData, getAPageData } = usePaging()
const { updateParams, checkParamsInQuery } = usePaginationRemember(`${props.type}-detail`)

const { page, limit, count } = usePagination()
const pageParams = computed(() => ({
  page: page.value,
  limit: limit.value,
  count: count.value,
}))

const { getSourceList } = useSourceList()
const { getActionList } = useActionList()

const isLoading = ref(false)
const getList = async () => {
  isLoading.value = true
  try {
    const queryFn = isSource.value ? getSourceList : getActionList
    totalData = await queryFn()
    setTotalData(totalData)
    getTableData()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
getList()

const getTableData = () => {
  const { data, meta } = getAPageData(
    { page: page.value, limit: limit.value },
    filterArr.value,
    sortFrom,
  )
  tableData.value = data
  count.value = meta.count || 0
  updateParams({
    ...pick(meta, ['limit', 'page']),
    ...filters.value,
    sortBy: sortFrom?.key,
    sortType: sortFrom?.type,
  })
}

const refreshTable = (pageData: { page: number; limit: number }) => {
  page.value = pageData.page
  limit.value = pageData.limit
  getTableData()
}

const search = (filterParams: Record<string, string | boolean>) => {
  filters.value = filterParams
  refreshTable({ page: 1, limit: limit.value })
}

const emptyTip = isSource.value ? tl('sourceEmptyTip') : tl('actionsEmptyTip')

const handleSortChange = (p: { column: any; prop: string; order: any }) => {
  const { prop, order } = p
  sortFrom = prop ? { key: prop, type: order === 'descending' ? 'desc' : 'asc' } : undefined
  refreshTable({ page: 1, limit: limit.value })
}

const getParamsFromQuery = async () => {
  const { pageParams, filterParams } = checkParamsInQuery()
  page.value = pageParams.page || page.value
  limit.value = pageParams.limit || limit.value
  const { sortBy, sortType, ...rest } = filterParams || {}
  if (sortBy && sortType) {
    sortFrom = {
      key: sortBy ?? sortFrom?.key ?? '',
      type: sortType ?? sortFrom?.type ?? 'desc',
    }
  }
  if (Object.keys(rest).length > 0) {
    filters.value = rest
  }
}
getParamsFromQuery()

const getDetailPageRoute = (id: string, tab?: string) => ({
  name: `${props.type}-detail`,
  params: { id },
  query: { tab },
})

const ruleFilterRoute = (id: string) => {
  const query = isSource.value ? { source: id } : { action: id }
  return { name: 'rule', query }
}

const { getBridgeIcon } = useBridgeTypeIcon()
const { getGeneralTypeLabel } = useBridgeTypeValue()
const { judgeIsWebhookAction } = useWebhookUtils()

const { toggleSourceEnable, reconnectSource } = useHandleSourceItem()
const { toggleActionEnable, reconnectAction } = useHandleActionItem()

const reconnectingMap = ref<Map<string, boolean>>(new Map())
const reconnect = ({ id }: Source | Action) => {
  try {
    const reconnectFn = isSource.value ? reconnectSource : reconnectAction
    reconnectingMap.value.set(id, true)
    reconnectFn(id)
  } catch (error) {
    //
  } finally {
    reconnectingMap.value.delete(id)
  }
}

const toggleEnable = async (row: Source | Action) => {
  const { enable } = row
  const sucMessage = enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'
  const toggleFn = isSource.value ? toggleSourceEnable : toggleActionEnable
  try {
    await toggleFn(row.id, enable)
    ElMessage.success(t(sucMessage))
    getList()
  } catch (error) {
    console.error(error)
    row.enable = !row.enable
  }
}

const router = useRouter()
const createRuleWithTarget = (id: string) => {
  const confirmContent = isSource.value ? tl('useSourceCreateRule') : tl('useActionCreateRule')
  const query = isSource.value ? { sourceId: id } : { actionId: id }
  ElMessageBox.confirm(confirmContent, {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'success',
  })
    .then(() => {
      router.push({ name: 'rule-create', query })
    })
    .catch(() => ({}))
}

const {
  showSecondConfirm,
  usingBridgeRules,
  currentDeleteBridgeId,
  handleDeleteSuc,
  handleDeleteBridge,
} = useDeleteBridge(getList)
const direction = isSource.value ? BridgeDirection.Ingress : BridgeDirection.Egress
</script>

<style lang="scss">
.view-rules-link {
  margin-top: 2px;
  margin-left: 4px;
  font-size: 12px;
}
</style>
