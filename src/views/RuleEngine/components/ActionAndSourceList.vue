<template>
  <ActionAndSourceFilterForm :type="type" @search="search" />
  <div class="app-wrapper action-source-list">
    <div class="section-header">
      <div></div>
      <ActionAndSourceTableColumnSelect
        :selected="tableColumnFields"
        @change="handleSelectedColumnChanged"
      />
    </div>
    <el-table
      :data="tableData"
      :empty-text="emptyTip"
      v-loading="isLoading"
      row-key="id"
      @sort-change="handleSortChange"
    >
      <el-table-column :label="t('Base.tableNo')" width="60">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="column in tableColumnFields"
        :key="column"
        :prop="column"
        :label="getColumnLabel(column)"
        :min-width="getColumnWidth(column)"
        :sortable="sortableColumns.includes(column)"
      >
        <template #default="{ row }">
          <router-link
            v-if="column === 'id'"
            :to="getDetailPageRoute(row)"
            class="first-column-with-icon-type"
          >
            <img v-if="row.type" class="icon-type" :src="getBridgeIcon(row.type)" />
            <div class="name-type-block">
              <span class="name-data">
                {{ row.name }}
              </span>
              <span class="type-data">{{ getGeneralTypeLabel(row.type) }}</span>
            </div>
          </router-link>
          <TargetItemStatus v-else-if="column === 'status'" type="action" :target="row" />
          <template v-else-if="column === 'enable'">
            <OperationDisabledPopover
              :disabled-by-webhook="!judgeIsWebhookAction(row)"
              :name="row.name"
              :namespace="row.namespace"
              :operation="`${t('Base.enable')}${tl('or')}${t('Base.disable')}`"
              :targetLabel="tl('action')"
            >
              <template #default="{ disabledOpByNsResource }">
                <el-switch
                  v-model="row.enable"
                  :disabled="
                    judgeIsWebhookAction(row) || !$hasPermission('put') || disabledOpByNsResource
                  "
                  @change="toggleEnable(row)"
                />
              </template>
            </OperationDisabledPopover>
          </template>
          <template v-else-if="column === 'rules.length'">
            <router-link
              v-for="item in row.rules"
              :to="{ name: 'rule-detail', params: { id: item }, query: getNsParams(row.namespace) }"
              :key="item"
              target="_blank"
              class="rule-detail-link"
            >
              <el-tag size="small" type="info">
                <CommonOverflowTooltip :content="item" />
              </el-tag>
            </router-link>
            <div class="view-rules-link">
              <router-link :to="ruleFilterRoute(row.id)">
                {{ `${tl('viewRules')} (${row.rules?.length || 0})` }}
              </router-link>
            </div>
          </template>
          <template v-else-if="['created_at', 'last_modified_at'].includes(column)">
            {{ dateFormat(row[column], '') }}
          </template>
          <template v-else>{{ row[column] }}</template>
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
            :disabled="!$hasPermission('post')"
            :loading="reconnectingMap.get(row.id) ?? false"
            @click="reconnect(row)"
          >
            {{ $t('RuleEngine.reconnect') }}
          </TableButton>
          <TableButton @click="$router.push(getDetailPageRoute(row, 'settings'))">
            {{ $t('Base.setting') }}
          </TableButton>
          <OperationDisabledPopover
            :disabled-by-webhook="!judgeIsWebhookAction(row)"
            :name="row.name"
            :namespace="row.namespace"
            :targetLabel="tl('action')"
            :operation="tl('moreOperation')"
          >
            <template #default="{ disabledOpByNsResource }">
              <TableItemDropDown
                can-create-rule
                :row-data="row"
                :can-copy="false"
                :disabled="judgeIsWebhookAction(row) || disabledOpByNsResource"
                @delete="handleDelete(row)"
                @create-rule="createRuleWithTarget(row.id)"
              />
            </template>
          </OperationDisabledPopover>
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
    :data="currentDeleteBridgeData"
    :direction="direction"
    @submitted="handleDeleteSuc"
  />
  <DeleteFallbackActionConfirm
    v-model="showFallbackConfirm"
    :action="currentDeleteBridgeData"
    :action-list="usingAsFallbackAction"
  />
</template>

<script setup lang="ts">
import { BridgeDirection, ConnectionStatus } from '@/types/enum'
import { Action, BridgeItem, Source } from '@/types/rule'
import DeleteBridgeSecondConfirm from '../Bridge/Components/DeleteBridgeSecondConfirm.vue'
import DeleteFallbackActionConfirm from '../Bridge/Components/DeleteFallbackActionConfirm.vue'
import ActionAndSourceFilterForm from './ActionAndSourceFilterForm.vue'
import ActionAndSourceTableColumnSelect from './ActionAndSourceTableColumnSelect.vue'
import OperationDisabledPopover from './OperationDisabledPopover.vue'
import TableItemDropDown from './TableItemDropDown.vue'
import TargetItemStatus from './TargetItemStatus.vue'

const props = defineProps<{
  type: 'source' | 'action'
}>()

const isSource = computed(() => props.type === 'source')

const { t, tl } = useI18nTl('RuleEngine')

const store = useStore()
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)

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

const filterNamespace = (columns: Array<string>) =>
  columns.filter((item: string) => !(isNamespaceUser.value && item === 'namespace'))
const tableColumnFields = computed({
  get() {
    const columns = isSource.value ? store.state.sourceTableColumns : store.state.actionTableColumns
    return filterNamespace(columns)
  },
  set(value: Array<string>) {
    if (isSource.value) {
      store.commit('SET_SOURCE_TABLE_COLUMNS', value)
    } else {
      store.commit('SET_ACTION_TABLE_COLUMNS', value)
    }
  },
})
const handleSelectedColumnChanged = (value: Array<string>) => {
  tableColumnFields.value = value
}
const sortableColumns = ['id', 'status', 'enable', 'rules.length', 'created_at', 'last_modified_at']
const { getColumnLabel } = useActionAndSourceTableColumns()

const specialColumnWidth = new Map<string, number>([
  ['id', 172],
  ['status', 124],
  ['enable', 102],
  ['namespace', 108],
  ['description', 108],
  ['rules.length', 168],
  ['created_at', 128],
  ['last_modified_at', 144],
])
const getColumnWidth = (column: string) => specialColumnWidth.get(column) || 150

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

const { getNsParams } = useNsParams()
const getDetailPageRoute = ({ id, namespace }: Action | Source, tab?: string) => ({
  name: `${props.type}-detail`,
  params: { id },
  query: { tab, ...getNsParams(namespace) },
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
const reconnect = (data: Source | Action) => {
  const { id } = data
  try {
    const reconnectFn = isSource.value ? reconnectSource : reconnectAction
    reconnectingMap.value.set(id, true)
    reconnectFn(data)
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
    await toggleFn(row, enable)
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

const useDeleteHook = isSource.value ? useDeleteSource : useDeleteBridge
const { showSecondConfirm, usingBridgeRules, currentDeleteBridgeData, handleDeleteSuc, ...other } =
  useDeleteHook(getList)
const { showFallbackConfirm, usingAsFallbackAction } = other as ReturnType<typeof useDeleteBridge>

const handleDelete = isSource.value
  ? (other as ReturnType<typeof useDeleteSource>).handleDeleteSource
  : (other as ReturnType<typeof useDeleteBridge>).handleDeleteBridge

const direction = isSource.value ? BridgeDirection.Ingress : BridgeDirection.Egress
</script>

<style lang="scss">
.action-source-list {
  .section-header {
    margin-top: 0;
  }
  .rule-detail-link {
    display: inline-block;
    max-width: 100%;
    line-height: 0;
    &:not(:last-child) {
      margin-right: 4px;
    }
    .el-tag,
    .el-tag__content,
    .overflow-tooltip {
      max-width: 100%;
    }
    .el-tag__content {
      height: 100%;
      align-items: center;
    }
    .overflow-tooltip {
      height: 100%;
      line-height: 18px;
    }
  }

  .view-rules-link {
    margin-top: 2px;
    margin-left: 4px;
    font-size: 12px;
  }
}
</style>
