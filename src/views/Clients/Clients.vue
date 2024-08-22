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
        <template class="more" v-if="showMoreQuery">
          <el-col v-bind="colProps">
            <el-select
              v-model="queryParams.conn_state"
              :placeholder="$t('Clients.connectedStatus')"
              clearable
              @clear="handleSearch"
            >
              <el-option value="connected" />
              <el-option value="disconnected" />
            </el-select>
          </el-col>
          <el-col v-bind="colProps">
            <div class="like-input">
              <el-select v-model="queryParams.comparator">
                <el-option :label="$t('Clients.gte')" :value="Comparator.After" />
                <el-option :label="$t('Clients.lte')" :value="Comparator.Before" />
              </el-select>
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
          <el-button type="primary" plain :icon="Search" @click="handleSearch">
            {{ $t('Base.search') }}
          </el-button>
          <el-button :icon="RefreshLeft" @click="handleReset">
            {{ $t('Base.reset') }}
          </el-button>
          <el-tooltip
            :content="!showMoreQuery ? $t('Base.showMore') : $t('Base.lessMore')"
            placement="top"
          >
            <el-button
              class="icon-button"
              plain
              :icon="showMoreQuery ? ArrowUp : ArrowDown"
              @click="showMoreQuery = !showMoreQuery"
            >
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-form>
    <div class="app-wrapper">
      <div class="section-header">
        <div></div>
        <ClientFieldSelect :selected="tableColumnFields" @change="handleSelectedColumnChanged" />
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
        <el-button type="primary" :icon="Refresh" @click="loadNodeClients">
          {{ $t('Base.refresh') }}
        </el-button>
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
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Clients',
})
</script>

<script lang="ts" setup>
import { batchDisconnectClients, exactSearchClient, listClients } from '@/api/clients'
import { SEARCH_FORM_RES_PROPS as colProps } from '@/common/constants'
import CheckIcon from '@/components/CheckIcon.vue'
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'
import MiniPagination from '@/components/MiniPagination.vue'
import useClientFields from '@/hooks/Clients/useClientFields'
import useI18nTl from '@/hooks/useI18nTl'
import { useCursorPagination } from '@/hooks/usePagination'
import usePaginationRemember from '@/hooks/usePaginationRemember'
import { Client } from '@/types/client'
import { CheckStatus } from '@/types/enum'
import { ArrowDown, ArrowUp, Delete, Refresh, RefreshLeft, Search } from '@element-plus/icons-vue'
import { isEmptyObj } from '@emqx/shared-ui-utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import ClientFieldSelect from './components/ClientFieldSelect.vue'
import ClientInfoItem from './components/ClientInfoItem.vue'

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
  clientidSearchType: SearchType.Exact,
  usernameSearchType: SearchType.Exact,
})

const { page, pageParams, cursorMap, hasNext, setCursor, resetPage } = useCursorPagination()
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
/**
 * Request the corresponding data based on the selected table columns
 */
const getClientFields = () =>
  tableColumnFields.value
    .reduce((arr: Array<string>, column: string) => {
      arr.push(...(columnFieldsMap.get(column) ?? [column]))
      return arr
    }, [])
    .join(',')
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

  let newParams: Record<string, any> = {
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
    return Promise.resolve({ data: isMatchOther ? [data] : [], meta: { count: 1 } })
  } catch (error) {
    return Promise.reject(error)
  }
}

const loadNodeClients = async (isBack = false) => {
  lockTable.value = true
  const sendParams = {
    ...params.value,
    ...pageParams.value,
    fields: getClientFields(),
  }
  try {
    const { data = [], meta = {} } = sendParams.clientid
      ? await handleExactSearchClient(sendParams)
      : await listClients(sendParams)
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
</script>

<style lang="scss">
@import '~@/style/management.scss';
.search-wrapper {
  .like-input {
    > .el-select,
    > .el-date-editor {
      vertical-align: top;
      .is-focus {
        .el-input__wrapper {
          z-index: 20;
        }
      }
      .el-input__wrapper:hover {
        z-index: 20;
      }
    }
    $select-width: 120px;
    > .el-select {
      width: $select-width;
      .el-input__wrapper {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        background-color: var(--el-fill-color-light);
      }
    }
    > .el-date-editor {
      width: calc(100% - #{$select-width});
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
</style>
