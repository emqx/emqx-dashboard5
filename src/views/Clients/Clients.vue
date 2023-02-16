<template>
  <div class="app-wrapper clients">
    <el-form @keyup.enter="handleSearch">
      <el-row class="search-wrapper" :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="fuzzyParams.like_clientid"
            :placeholder="$t('Clients.clientId')"
            clearable
            @clear="handleSearch"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="fuzzyParams.like_username"
            :placeholder="$t('Clients.username')"
            clearable
            @clear="handleSearch"
          />
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="fuzzyParams.node"
            :placeholder="$t('Clients.node')"
            clearable
            @clear="handleSearch"
          >
            <el-option v-for="item in currentNodes" :value="item.node" :key="item.node" />
          </el-select>
        </el-col>
        <template v-if="showMoreQuery">
          <el-col :span="6">
            <el-input
              v-model="fuzzyParams.ip_address"
              :placeholder="$t('Clients.ipAddress')"
              clearable
              @clear="handleSearch"
            />
          </el-col>
          <el-col :span="6">
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
          <el-col :span="6">
            <div class="like-input">
              <el-select v-model="fuzzyParams.comparator">
                <el-option :label="$t('Clients.gte')" value="gte" />
                <el-option :label="$t('Clients.lte')" value="lte" />
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
        </template>
        <el-col :span="6" class="col-oper">
          <el-button type="primary" plain :icon="Search" @click="handleSearch">
            {{ $t('Base.search') }}
          </el-button>
          <el-button type="primary" :icon="RefreshRight" @click="loadNodeClients">
            {{ $t('Base.refresh') }}
          </el-button>
          <el-icon class="show-more" @click="showMoreQuery = !showMoreQuery">
            <ArrowUp v-if="showMoreQuery" />
            <ArrowDown v-else />
          </el-icon>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" ref="clientsTable" v-loading.lock="lockTable">
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
              name: 'connection-detail',
              params: { clientId: row.clientid },
            }"
            class="table-data-without-break keep-spaces"
            >{{ row.clientid }}</router-link
          >
        </template>
      </el-table-column>

      <el-table-column prop="username" min-width="100" :label="$t('Clients.username')">
        <template #default="{ row }">
          <span class="keep-spaces">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="connected"
        :min-width="store.state.lang === 'en' ? 140 : 90"
        :label="$t('Clients.connectedStatus')"
      >
        <template #default="{ row }">
          <CheckIcon :status="row.connected ? 'check' : 'close'" size="small" :top="1" />
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
      <el-table-column prop="expiry_interval" min-width="180" :label="$t('Clients.expiryInterval')">
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import useI18nTl from '@/hooks/useI18nTl'
import { SESSION_NEVER_EXPIRE_TIME } from '@/common/constants'

export default defineComponent({
  name: 'Clients',
})
</script>

<script lang="ts" setup>
import { listClients } from '@/api/clients'
import { loadNodes } from '@/api/common'
import moment from 'moment'
import CommonPagination from '@/components/commonPagination.vue'
import { Search, ArrowUp, ArrowDown, RefreshRight } from '@element-plus/icons-vue'
import CheckIcon from '@/components/CheckIcon.vue'
import { useStore } from 'vuex'
import { NodeMsg } from '@/types/dashboard'
import useDurationStr from '@/hooks/useDurationStr'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'

const { transSecondNumToSimpleStr } = useDurationStr()
const { tl } = useI18nTl('Clients')
const showMoreQuery = ref(false)
const tableData = ref([])
const currentNodes = ref<NodeMsg[]>([])
const lockTable = ref(false)
const params = ref({})
const fuzzyParams = ref<Record<string, any>>({
  comparator: 'gte',
})
const store = useStore()
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const handleSearch = async () => {
  params.value = genQueryParams(fuzzyParams.value)
  loadNodeClients({ page: 1 })
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
    newParams[`${comparator}_connected_at`] = new Date(connected_at).toISOString()
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

loadNodeData()
loadNodeClients()
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
