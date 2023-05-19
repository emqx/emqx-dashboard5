<template>
  <div class="clients">
    <el-form class="search-wrapper" @keyup.enter="handleSearch">
      <el-row :gutter="20">
        <el-col v-bind="colProps">
          <el-input
            v-model="fuzzyParams.like_clientid"
            :placeholder="$t('Clients.clientId')"
            clearable
            @clear="handleSearch"
          />
        </el-col>
        <el-col v-bind="colProps">
          <el-input
            v-model="fuzzyParams.like_username"
            :placeholder="$t('Clients.username')"
            clearable
            @clear="handleSearch"
          />
        </el-col>
        <el-col v-bind="colProps">
          <el-select
            v-model="fuzzyParams.node"
            :placeholder="$t('Clients.node')"
            clearable
            @clear="handleSearch"
          >
            <el-option v-for="item in currentNodes" :value="item.node" :key="item.node" />
          </el-select>
        </el-col>
        <template class="more" v-if="showMoreQuery">
          <el-col v-bind="colProps">
            <el-input
              v-model="fuzzyParams.ip_address"
              :placeholder="$t('Clients.ipAddress')"
              clearable
              @clear="handleSearch"
            />
          </el-col>
          <el-col v-bind="colProps">
            <el-select
              v-model="fuzzyParams.conn_state"
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
              <el-select v-model="fuzzyParams.comparator">
                <el-option :label="$t('Clients.gte')" :value="Comparator.After" />
                <el-option :label="$t('Clients.lte')" :value="Comparator.Before" />
              </el-select>
              <el-date-picker
                v-model="fuzzyParams.connected_at"
                type="datetime"
                :placeholder="$t('Clients.connectedAt')"
                clearable
                @clear="handleSearch"
              />
            </div>
          </el-col>
          <el-col v-bind="colProps" />
        </template>
        <el-col v-bind="colProps" class="col-oper">
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
        <el-button
          class="kick-btn"
          type="danger"
          plain
          :disabled="selectedClients.length === 0"
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
        ref="clientsTable"
        v-loading.lock="lockTable"
        @selection-change="handleSelectionChange"
      >
        <!-- TODO:fixed the tooltip content (spaces) -->
        <el-table-column type="selection" width="35" />
        <el-table-column
          prop="clientid"
          min-width="140"
          fixed
          :label="$t('Clients.clientId')"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <router-link
              :to="{
                name: 'clients-detail',
                params: { clientId: row.clientid },
              }"
            >
              <PreWithEllipsis>{{ row.clientid }}</PreWithEllipsis>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          min-width="100"
          :label="$t('Clients.username')"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <PreWithEllipsis>{{ row.username }}</PreWithEllipsis>
          </template>
        </el-table-column>
        <el-table-column
          prop="connected"
          :min-width="store.state.lang === 'en' ? 140 : 90"
          :label="$t('Clients.connectedStatus')"
        >
          <template #default="{ row }">
            <CheckIcon
              :status="row.connected ? CheckStatus.Check : CheckStatus.Close"
              size="small"
              :top="1"
            />
            <span class="text-status" :class="row.connected ? 'success' : 'danger'">
              {{ row.connected ? $t('Clients.connected') : $t('Clients.disconnected') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="140" prop="ip_address" :label="$t('Clients.ipAddress')">
          <template #default="{ row }">
            {{ row.ip_address + ':' + row.port }}
          </template>
        </el-table-column>
        <el-table-column prop="keepalive" min-width="100" :label="$t('Clients.keepalive')" />
        <el-table-column prop="clean_start" min-width="120" label="Clean Start" />
        <el-table-column
          prop="expiry_interval"
          min-width="180"
          :label="$t('Clients.expiryInterval')"
        >
          <template #default="{ row }">
            <span>{{ sessionExpiryIntervalHandler(row.expiry_interval) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="connected_at" min-width="150" :label="$t('Clients.connectedAt')">
          <template #default="{ row }">
            {{ moment(row.connected_at).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="emq-table-footer">
        <common-pagination v-model:metaData="pageMeta" @loadPage="loadNodeClients" />
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
import { disconnectClient, listClients } from '@/api/clients'
import { loadNodes } from '@/api/common'
import { SESSION_NEVER_EXPIRE_TIME, SEARCH_FORM_RES_PROPS as colProps } from '@/common/constants'
import CheckIcon from '@/components/CheckIcon.vue'
import PreWithEllipsis from '@/components/PreWithEllipsis.vue'
import CommonPagination from '@/components/commonPagination.vue'
import useDurationStr from '@/hooks/useDurationStr'
import useI18nTl from '@/hooks/useI18nTl'
import usePaginationRemember from '@/hooks/usePaginationRemember'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import { Client } from '@/types/client'
import { NodeMsg } from '@/types/dashboard'
import { CheckStatus } from '@/types/enum'
import { ArrowDown, ArrowUp, Delete, Refresh, RefreshLeft, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { pick } from 'lodash'
import moment from 'moment'
import { useStore } from 'vuex'

enum Comparator {
  After = 'gte',
  Before = 'lte',
}

const CONNECTED_AT_SUFFIX = '_connected_at'

const { transSecondNumToSimpleStr } = useDurationStr()
const { tl, t } = useI18nTl('Clients')
const showMoreQuery = ref(false)
const tableData = ref([])
const selectedClients = ref<Client[]>([])
const currentNodes = ref<NodeMsg[]>([])
const lockTable = ref(false)
const batchDeleteLoading = ref(false)
const params = ref({})
const fuzzyParams = ref<Record<string, any>>({
  comparator: Comparator.After,
})
const store = useStore()
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()
const { updateParams, checkParamsInQuery } = usePaginationRemember('clients-detail')

const handleSearch = async () => {
  params.value = genQueryParams(fuzzyParams.value)
  loadNodeClients({ page: 1 })
}

const handleReset = () => {
  fuzzyParams.value = {
    comparator: Comparator.After,
  }
  handleSearch()
}

const genQueryParams = (params: Record<string, any>) => {
  let newParams: Record<string, any> = {}
  const { like_clientid, like_username, ip_address, conn_state, comparator, connected_at, node } =
    params
  newParams = {
    like_clientid: like_clientid || undefined,
    like_username: like_username || undefined,
    ip_address: ip_address || undefined,
    conn_state: conn_state || undefined,
    node: node || undefined,
  }
  if (connected_at) {
    newParams[`${comparator}${CONNECTED_AT_SUFFIX}`] = new Date(connected_at).toISOString()
  }
  return newParams
}

const loadNodeData = async () => {
  try {
    const data = await loadNodes()
    currentNodes.value = data
  } catch (error) {
    //
  }
}

const loadNodeClients = async (_params = {}) => {
  lockTable.value = true
  const sendParams = {
    ...params.value,
    ...pageParams.value,
    ..._params,
  }
  try {
    const { data = [], meta = {} } = await listClients(sendParams)
    tableData.value = data
    setPageMeta(meta)
    updateParams({ ...pick(meta, ['limit', 'page']), ...params.value })
  } catch (error) {
    tableData.value = []
    initPageMeta()
  } finally {
    lockTable.value = false
  }
}

const sessionExpiryIntervalHandler = (interval: number): string | number => {
  return interval === SESSION_NEVER_EXPIRE_TIME
    ? tl('neverExpire')
    : transSecondNumToSimpleStr(interval)
}

const getParamsFromQuery = () => {
  const { pageParams, filterParams } = checkParamsInQuery()
  pageMeta.value = { ...pageMeta.value, ...pageParams }
  if (filterParams && Object.keys(filterParams).length > 0) {
    Object.keys(filterParams).forEach((key) => {
      if (key.indexOf(CONNECTED_AT_SUFFIX) === -1) {
        fuzzyParams.value[key] = filterParams[key]
      } else {
        fuzzyParams.value.connected_at = filterParams[key]
        fuzzyParams.value.comparator =
          key.indexOf(Comparator.After) > -1 ? Comparator.After : Comparator.Before
      }
    })
  }
  params.value = genQueryParams(fuzzyParams.value)
  if (
    fuzzyParams.value.ip_address ||
    fuzzyParams.value.conn_state ||
    fuzzyParams.value.connected_at
  ) {
    showMoreQuery.value = true
  }
}

getParamsFromQuery()
loadNodeData()
loadNodeClients()
const handleSelectionChange = (clients: Client[]) => {
  selectedClients.value = clients
}
// Handling batch client disconnection requests
async function batchDisconnectClients(clientIds: string[], batchSize = 10) {
  const results = []
  for (let i = 0; i < clientIds.length; i += batchSize) {
    const batch = clientIds.slice(i, i + batchSize)
    const disconnectPromises = batch.map((clientId) => disconnectClient(clientId))
    try {
      const batchResults = await Promise.allSettled(disconnectPromises)
      results.push(...batchResults)
    } catch (err) {
      console.error(err)
    }
  }
  return results
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
      const results = await batchDisconnectClients(clientIds, 5)
      if (results) {
        loadNodeClients()
        const fulfilledCount = results.filter((result) => result.status === 'fulfilled').length
        const rejectedCount = results.filter((result) => result.status === 'rejected').length
        if (fulfilledCount > 0) {
          ElMessage.success(tl('willKickSelectedConnectionsSuccess', { n: fulfilledCount }))
        }
        if (rejectedCount > 0) {
          ElMessage.error(tl('willKickSelectedConnectionsFailed', { n: rejectedCount }))
        }
      }
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
    > .el-select {
      width: 30%;
      .el-input__wrapper {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        background-color: var(--el-fill-color-light);
      }
    }
    > .el-date-editor {
      width: 70%;
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
