<template>
  <div class="clients">
    <el-form class="search-wrapper" @keyup.enter="handleSearch">
      <el-row :gutter="20">
        <el-col v-bind="colProps">
          <el-input
            v-model="queryParams.clientid"
            :placeholder="$t('Clients.clientId')"
            clearable
            @clear="handleSearch"
          >
            <template #prepend>
              <el-select v-model="queryParams.clientidSearchType">
                <el-option :label="$t('Clients.exactQuery')" :value="SearchType.Exact" />
                <el-option :label="$t('Clients.fuzzySearch')" :value="SearchType.Fuzzy" />
              </el-select>
            </template>
          </el-input>
        </el-col>
        <el-col v-bind="colProps">
          <el-input
            v-model="queryParams.username"
            :placeholder="$t('Clients.username')"
            clearable
            @clear="handleSearch"
          >
            <template #prepend>
              <el-select v-model="queryParams.usernameSearchType">
                <el-option :label="$t('Clients.exactQuery')" :value="SearchType.Exact" />
                <el-option :label="$t('Clients.fuzzySearch')" :value="SearchType.Fuzzy" />
              </el-select>
            </template>
          </el-input>
        </el-col>
        <el-col v-bind="colProps">
          <el-input
            v-model="queryParams.ip_address"
            :placeholder="$t('Clients.ipAddress')"
            clearable
            @clear="handleSearch"
          />
        </el-col>
        <template v-if="showMoreQuery">
          <el-col v-bind="colProps">
            <el-select
              v-model="queryParams.conn_state"
              :placeholder="$t('Clients.connectedStatus')"
              clearable
              @clear="handleSearch"
            >
              <el-option value="connected" :label="tl('connected')" />
              <el-option value="disconnected" :label="tl('disconnected')" />
            </el-select>
          </el-col>
          <el-col v-bind="colProps">
            <div class="el-input-group el-input-group--prepend">
              <div class="el-input-group__prepend">
                <el-select v-model="queryParams.comparator">
                  <el-option :label="$t('Clients.gte')" :value="Comparator.After" />
                  <el-option :label="$t('Clients.lte')" :value="Comparator.Before" />
                </el-select>
              </div>
              <el-date-picker
                v-model="queryParams.connected_at"
                type="datetime"
                :placeholder="$t('Clients.connectedAt')"
                clearable
                @clear="handleSearch"
              />
            </div>
          </el-col>
          <el-col v-bind="colProps" />
        </template>
        <el-col v-bind="{ sm: 12, md: 12, lg: showMoreQuery ? 12 : 6 }" class="col-oper">
          <SearchButton @click="handleSearch" />
          <ResetButton @click="handleReset" />
          <ShowMoreButton v-model="showMoreQuery" />
        </el-col>
      </el-row>
    </el-form>
    <div class="app-wrapper">
      <div class="section-header">
        <div></div>
        <ClientFieldSelect :selected="tableColumnFields" @change="handleSelectedColumnChanged" />
        <el-button class="export-btn" type="primary" plain :icon="Download" @click="handleExport">
          {{ tl('export') }}
        </el-button>
        <el-button
          class="kick-btn"
          type="danger"
          plain
          :disabled="selectedClients.length === 0 || !$hasPermission('delete')"
          :icon="Delete"
          :loading="batchDeleteLoading"
          @click="cleanBatchClients"
        >
          {{ tl('kickOut') }}
        </el-button>
        <RefreshButton @click="loadNodeClients" />
      </div>
      <el-table
        :data="tableData"
        ref="TableCom"
        row-key="clientid"
        :key="tableColumnFields.join('-')"
        v-loading.lock="lockTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="35" reserve-selection />
        <el-table-column
          v-for="column in tableColumnFields"
          :key="column"
          :prop="column"
          :label="getColumnLabel(column)"
          :min-width="getColumnWidth(column)"
        >
          <template #default="{ row }">
            <router-link
              v-if="column === 'clientid'"
              :to="{
                name: 'clients-detail',
                params: { clientId: row.clientid },
              }"
            >
              <CommonOverflowTooltip :content="row.clientid" />
            </router-link>
            <CommonOverflowTooltip v-else-if="column === 'username'" :content="row.username" />
            <template v-else-if="column === 'connected'">
              <CheckIcon
                :status="row.connected ? CheckStatus.Check : CheckStatus.Close"
                size="small"
                :top="1"
              />
              <span class="text-status" :class="row.connected ? 'success' : 'danger'">
                {{ row.connected ? $t('Clients.connected') : $t('Clients.disconnected') }}
              </span>
            </template>
            <ClientInfoItem v-else :client="row" :field="column" />
          </template>
        </el-table-column>
      </el-table>
      <div class="emq-table-footer">
        <MiniPagination
          :current-page="page"
          :hasnext="hasNext"
          :page-size="limit"
          :page-sizes="defaultPageSizeOpt"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
  <el-dialog
    v-model="isExportDialogShow"
    class="payload-dialog"
    width="400px"
    :title="tl('exportClients')"
    :close-on-click-modal="false"
    :before-close="handleCloseExportDialog"
    @closed="initExportDialog"
  >
    <p>{{ tl('exportClientsTip') }}</p>
    <el-form-item :label="tl('exportDataFormat')">
      <el-select v-model="exportFormat" :disabled="exportLoading">
        <el-option
          v-for="{ value, label } in formatOpts"
          :label="label"
          :key="value"
          :value="value"
        />
      </el-select>
    </el-form-item>

    <template #footer>
      <el-button @click="cancelExport">{{ t('Base.cancel') }}</el-button>
      <el-button type="primary" @click="confirmExport" :loading="exportLoading">
        {{ t('Base.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default defineComponent({
  name: 'Clients',
})
</script>

<script lang="ts" setup>
import { batchDisconnectClients, exactSearchClient, listClients } from '@/api/clients'
import {
  SEARCH_FORM_RES_PROPS as colProps,
  DEFAULT_PAGE_SIZE_OPT as defaultPageSizeOpt,
} from '@/common/constants'
import { Client } from '@/types/client'
import { CheckStatus, ClientsExportFormat } from '@/types/enum'
import { Delete, Download } from '@element-plus/icons-vue'
import { isEmptyObj } from '@emqx/shared-ui-utils'
import ClientFieldSelect from './components/ClientFieldSelect.vue'
import ClientInfoItem from './components/ClientInfoItem.vue'
import dayjs from 'dayjs'

enum Comparator {
  After = 'gte',
  Before = 'lte',
}

enum SearchType {
  Exact = 'exact',
  Fuzzy = 'fuzzy',
}

type QueryParams = {
  like_username?: string
  username?: string
  like_clientid?: string
  clientid?: string
  ip_address?: string
  conn_state?: string
  gte_connected_at?: string
  lte_connected_at?: string
}

const CONNECTED_AT_SUFFIX = '_connected_at'

const { tl, t } = useI18nTl('Clients')
const { state, commit } = useStore()
const route = useRoute()
const showMoreQuery = ref(false)
const tableData = ref([])
const selectedClients = ref<Client[]>([])
const lockTable = ref(false)
const TableCom = ref()
const batchDeleteLoading = ref(false)
const params = ref<QueryParams>({})
const queryParams = ref<Record<string, any>>({
  comparator: Comparator.After,
  clientidSearchType: SearchType.Fuzzy,
  usernameSearchType: SearchType.Fuzzy,
})

const { page, limit, pageParams, cursorMap, hasNext, setCursor, resetPage } = useCursorPagination()
const { updateParams, checkNewCursorParamsInQuery, updateCursorMap, getCursorMap } =
  usePaginationRemember('clients-detail')
const routeName = computed(() => route.name?.toString() || 'clients')

const tableColumnFields = ref<Array<string>>(state.clientTableColumns)
const { getBaseLabel } = useClientFields()
const getColumnLabel = (column: string) =>
  column === 'connected' ? tl('connectedStatus') : getBaseLabel(column)

const specialColumnWidth = new Map([
  ['clientid', 140],
  ['username', 100],
  ['connected', 140],
  ['ip_address', 140],
  ['keepalive', 100],
  ['clean_start', 180],
  ['expiry_interval', 180],
  ['connected_at', 180],
  ['awaiting_rel', 180],
])
const getColumnWidth = (column: string) => specialColumnWidth.get(column) || 150

const handleSearch = async () => {
  params.value = genQueryParams(queryParams.value)
  resetPage()
  loadNodeClients()
}

const handleReset = () => {
  queryParams.value = {
    comparator: Comparator.After,
    clientidSearchType: SearchType.Exact,
    usernameSearchType: SearchType.Exact,
  }
  handleSearch()
}

const columnFieldsMap = new Map([
  ['proto_name', ['proto_name', 'proto_ver']],
  ['ip_address', ['ip_address', 'port']],
  ['subscriptions', ['subscriptions_cnt', 'subscriptions_max']],
  ['mqueue', ['mqueue_len', 'mqueue_max']],
  ['inflight', ['inflight_cnt', 'inflight_max']],
  ['awaiting_rel', ['awaiting_rel_cnt', 'awaiting_rel_max']],
])
const getClientFieldArr = () => {
  return tableColumnFields.value.reduce((arr: Array<string>, column: string) => {
    arr.push(...(columnFieldsMap.get(column) ?? [column]))
    return arr
  }, [])
}
/**
 * Request the corresponding data based on the selected table columns
 */
const getClientFields = () => getClientFieldArr().join(',')
const handleSelectedColumnChanged = (val: Array<string>) => {
  tableColumnFields.value = val
  commit('SET_CLIENT_TABLE_COLUMNS', val)
  loadNodeClients()
}

const genQueryParams = (params: Record<string, any>) => {
  const {
    clientid,
    username,
    ip_address,
    conn_state,
    comparator,
    connected_at,
    usernameSearchType,
    clientidSearchType,
  } = params

  const addLikeParam = (key: string, value: string, searchType: string) => {
    if (!value) return undefined

    const isFuzzy = searchType === SearchType.Fuzzy
    const _key = isFuzzy ? `like_${key}` : key
    const _value = isFuzzy ? value : value.split(',')

    return { [_key]: _value }
  }

  const newParams: Record<string, any> = {
    ...addLikeParam('clientid', clientid, clientidSearchType),
    ...addLikeParam('username', username, usernameSearchType),
    ip_address: ip_address || undefined,
    conn_state: conn_state || undefined,
  }

  if (connected_at) {
    newParams[`${comparator}${CONNECTED_AT_SUFFIX}`] = new Date(connected_at).toISOString()
  }

  return newParams
}

const handlePageChange = (no: number) => {
  const isBack = no < page.value
  page.value = no
  loadNodeClients(isBack)
}

const handleSizeChange = (size: number) => {
  limit.value = size
  handlePageChange(1)
}

const handleExactSearchClient = async (params: Record<string, any>) => {
  try {
    const {
      clientid,

      username,
      ip_address,
      conn_state,
      like_username,
      gte_connected_at,
      lte_connected_at,
    } = params
    const data = await exactSearchClient(clientid)
    let isMatchOther = true
    if (username && data.username !== username) {
      isMatchOther = false
    }
    if (ip_address && data.ip_address !== ip_address) {
      isMatchOther = false
    }
    if (conn_state && data.connected !== (conn_state === 'connected')) {
      isMatchOther = false
    }
    if (like_username && data.username.indexOf(like_username) === -1) {
      isMatchOther = false
    }
    if (
      gte_connected_at &&
      new Date(data.connected_at).getTime() < new Date(gte_connected_at).getTime()
    ) {
      isMatchOther = false
    }
    if (
      lte_connected_at &&
      new Date(data.connected_at).getTime() > new Date(lte_connected_at).getTime()
    ) {
      isMatchOther = false
    }
    return Promise.resolve({ data: isMatchOther ? [data] : [] })
  } catch (error) {
    return Promise.reject(error)
  }
}

const getQueryDataAllParams = () => ({
  ...params.value,
  ...pageParams.value,
  fields: getClientFields(),
})

const getQueryFunc = (params: Record<string, any>) =>
  params.clientid ? handleExactSearchClient(params) : listClients(params)

const loadNodeClients = async (isBack = false) => {
  lockTable.value = true
  const sendParams = getQueryDataAllParams()
  try {
    const { data = [], meta = {} } = await getQueryFunc(sendParams)
    tableData.value = data
    setCursor(page.value + 1, meta.cursor)
    updateParams({ page: page.value, ...pageParams.value, ...params.value })
    updateCursorMap(routeName.value, cursorMap.value)
    if (isBack && page.value !== 1 && data.length === 0) {
      ElMessage.warning(tl('pageJumpTip'))
      handlePageChange(1)
    }
  } catch (error) {
    tableData.value = []
    resetPage()
  } finally {
    lockTable.value = false
  }
}

const getParamsFromQuery = () => {
  const { pageParams, filterParams } = checkNewCursorParamsInQuery()
  if (isEmptyObj(pageParams) && isEmptyObj(filterParams)) {
    return
  }
  const storageCursorMap = getCursorMap(routeName.value)
  if (storageCursorMap) {
    cursorMap.value = storageCursorMap
  }
  page.value = pageParams.page || 1
  setCursor(page.value, pageParams.cursor)
  if (filterParams && Object.keys(filterParams).length > 0) {
    Object.keys(filterParams).forEach((key) => {
      if (key.indexOf(CONNECTED_AT_SUFFIX) === -1) {
        queryParams.value[key] = filterParams[key]
      } else {
        queryParams.value.connected_at = filterParams[key]
        queryParams.value.comparator =
          key.indexOf(Comparator.After) > -1 ? Comparator.After : Comparator.Before
      }
    })
  }
  params.value = genQueryParams(queryParams.value)
  if (
    queryParams.value.ip_address ||
    queryParams.value.conn_state ||
    queryParams.value.connected_at
  ) {
    showMoreQuery.value = true
  }
}

getParamsFromQuery()
loadNodeClients()
const handleSelectionChange = (clients: Client[]) => {
  selectedClients.value = clients
}
const cleanBatchClients = async () => {
  const clientIds = selectedClients.value.map((client) => client.clientid)
  ElMessageBox.confirm(tl('willKickSelectedConnections', { n: selectedClients.value.length }), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    confirmButtonClass: 'confirm-danger',
    type: 'warning',
  }).then(async () => {
    batchDeleteLoading.value = true
    try {
      await batchDisconnectClients(clientIds)
      resetPage()
      loadNodeClients()
      ElMessage.success(tl('kickedOutSuc'))
      TableCom.value?.clearSelection()
    } catch (error) {
      console.log(error)
    } finally {
      batchDeleteLoading.value = false
    }
  })
}

const exportLoading = ref(false)
let exportWorker: Worker | null = null
const isExportDialogShow = ref(false)
const exportFormat = ref(ClientsExportFormat.CSV)

const formatOpts = [
  { label: 'CSV', value: ClientsExportFormat.CSV },
  { label: 'JSON', value: ClientsExportFormat.JSON },
]

const { getSimpleClientInfoValue } = useClientInfoItem()
const processClients = (clients: Array<Client>) => {
  return clients.map((item) => {
    return tableColumnFields.value.reduce((ret: Partial<Client>, column) => {
      ret[column] = getSimpleClientInfoValue(item, column)
      return ret
    }, {})
  })
}

const getAllClients = async () => {
  // TODO: if there is no next page, directly use the table data
  const cursorMap = new Map<number, string | undefined>([[1, undefined]])
  const limit = 300
  let page = 1
  const getOnePageClients = async () => {
    const params = { ...getQueryDataAllParams(), limit, cursor: cursorMap.get(page) }
    try {
      const { data = [], meta = {} } = await getQueryFunc(params)
      const postData =
        exportFormat.value === ClientsExportFormat.CSV
          ? processClients(data)
          : data.map((item: Client) => pick(item, getClientFieldArr()))
      exportWorker?.postMessage({ data: postData })
      if (!isExportDialogShow.value) {
        return
      }
      if (meta.cursor) {
        cursorMap.set(page + 1, meta.cursor)
        page += 1
        await getOnePageClients()
      } else {
        exportWorker?.postMessage({ isFinished: true })
      }
    } catch (error) {
      exportLoading.value = false
    }
  }
  await getOnePageClients()
}

const initExportWorker = () => {
  exportWorker = new Worker(new URL('./exportWorker.js', import.meta.url))
  exportWorker.onerror = console.error
  exportWorker.onmessage = (e) => {
    const { type, data, length } = e.data
    if (type === 'complete') {
      downloadClientsFile(data)
      exportLoading.value = false
      ElMessage.success(tl('exportSucMsg', { n: length }))
    }
  }
}

const getFileTimestamp = () => dayjs(new Date()).format('YYYY-MM-DD_HH-mm-ss')
const createCSVFileObj = (content: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const headers = {
    'content-disposition': `attachment; filename=clients_${getFileTimestamp()}.csv`,
    'content-type': 'text/csv;charset=utf-8;',
  }
  return { data: blob, headers }
}

const createJSONFileObj = (content: string) => {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' })
  const headers = {
    'content-disposition': `attachment; filename=clients_${getFileTimestamp()}.json`,
    'content-type': 'application/json;charset=utf-8;',
  }
  return { data: blob, headers }
}

const downloadClientsFile = (content: string) => {
  const data =
    exportFormat.value === ClientsExportFormat.CSV
      ? createCSVFileObj(content)
      : createJSONFileObj(content)
  downloadBlobData(data)
}

interface ExportColumn {
  prop: string
  label: string
}

const handleExport = () => {
  isExportDialogShow.value = true
}

const initExportDialog = () => {
  exportLoading.value = false
}

const { operationWarning } = useOperationConfirm()
const handleCloseExportDialog = async (done?: () => void) => {
  try {
    if (exportLoading.value) {
      await operationWarning(tl('cancelExportingConfirm'))
    }
    done?.()
    return Promise.resolve()
  } catch (error) {
    return Promise.reject()
  }
}
const cancelExport = async () => {
  await handleCloseExportDialog()
  isExportDialogShow.value = false
}

const confirmExport = () => {
  exportLoading.value = true
  const initMessage: any = { isInit: true, format: exportFormat.value }
  if (exportFormat.value === ClientsExportFormat.CSV) {
    const columns: ExportColumn[] = tableColumnFields.value.map((column) => {
      return { prop: column, label: getColumnLabel(column) }
    })
    initMessage.tableColumns = columns
  }
  exportWorker?.postMessage(initMessage)
  getAllClients()
}

onMounted(() => {
  initExportWorker()
})

onUnmounted(() => {
  if (exportWorker) {
    exportWorker.terminate()
  }
})
</script>

<style lang="scss">
@use '@/style/management.scss';
.search-wrapper {
  $prepend-width: 128px;
  .el-input-group--prepend .el-input-group__prepend {
    width: $prepend-width;
    flex-shrink: 0;
  }
  .el-input-group {
    .el-input-group__prepend {
      box-shadow:
        1px 0 0 0 var(--color-border-primary) inset,
        0 1px 0 0 var(--color-border-primary) inset,
        0 -1px 0 0 var(--color-border-primary) inset;
    }
    > .el-select {
      width: $prepend-width;
    }
    > .el-date-editor {
      width: calc(100% - #{$prepend-width});
      position: relative;
      left: -1px;
      .el-input__wrapper {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left-color: transparent;
      }
    }
  }
}
.export-progress {
  margin: 10px 0;
}
</style>
