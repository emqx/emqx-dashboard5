<template>
  <div class="app-wrapper clients">
    <el-form @keyup.enter="handleSearch">
      <el-row class="search-wrapper" :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="fuzzyParams.like_clientid"
            :placeholder="$t('Clients.clientId')"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="fuzzyParams.like_username"
            :placeholder="$t('Clients.username')"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="fuzzyParams.node" :placeholder="$t('Clients.node')" clearable>
            <el-option v-for="item in currentNodes" :value="item.node" :key="item.node"></el-option>
          </el-select>
        </el-col>
        <template v-if="showMoreQuery">
          <el-col :span="6">
            <el-input
              v-model="fuzzyParams.ip_address"
              :placeholder="$t('Clients.ipAddress')"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="fuzzyParams.conn_state"
              :placeholder="$t('Clients.connectedStatus')"
              clearable
            >
              <el-option value="connected"></el-option>
              <el-option value="disconnected"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-row class="form-item-row">
              <el-col :span="10">
                <el-select v-model="fuzzyParams.comparator" class="comparator">
                  <el-option :label="$t('Clients.gte')" value="gte"></el-option>
                  <el-option :label="$t('Clients.lte')" value="lte"></el-option>
                </el-select>
              </el-col>
              <el-col :span="14">
                <el-date-picker
                  v-model="fuzzyParams.connected_at"
                  class="datatime"
                  type="datetime"
                  :placeholder="$t('Clients.connectedAt')"
                  clearable
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="fuzzyParams.proto_name"
              :placeholder="$t('Clients.protocol')"
              clearable
            >
              <el-option v-for="name in protoNames" :key="name" :value="name"> </el-option>
            </el-select>
          </el-col>
        </template>
        <el-col :span="6" class="col-oper">
          <el-button type="primary" :icon="Search" @click="handleSearch">
            {{ $t('Clients.search') }}
          </el-button>
          <el-button type="primary" plain :icon="RefreshRight" @click="handleResetSerach">
            {{ $t('Clients.reset') }}
          </el-button>
          <el-icon class="show-more" @click="showMoreQuery = !showMoreQuery">
            <ArrowUp v-if="showMoreQuery" />
            <ArrowDown v-else />
          </el-icon>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" ref="clientsTable" v-loading.lock="lockTable">
      <el-table-column prop="clientid" min-width="140" :label="$t('Clients.clientId')">
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

      <el-table-column
        prop="username"
        min-width="120"
        :label="$t('Clients.username')"
      ></el-table-column>
      <el-table-column
        prop="connected"
        :min-width="store.state.lang === 'en' ? 140 : 90"
        :label="$t('Clients.connectedStatus')"
      >
        <template #default="{ row }">
          <CheckIcon :status="row.connected ? 'check' : 'close'" size="small" :top="1" />
          <span>{{ row.connected ? $t('Clients.connected') : $t('Clients.disconnected') }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150" prop="ip_address" :label="$t('Clients.ipAddress')">
        <template #default="{ row }">
          {{ row.ip_address + ':' + row.port }}
        </template>
      </el-table-column>
      <el-table-column
        prop="keepalive"
        min-width="100"
        :label="$t('Clients.keepalive')"
      ></el-table-column>
      <el-table-column min-width="90" prop="proto_name" :label="$t('Clients.protocol')">
        <template #default="{ row }">
          <span class="">
            {{ row.proto_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="connected_at" min-width="140" :label="$t('Clients.connectedAt')">
        <template #default="{ row }">
          {{ moment(row.connected_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="oper" min-width="120" :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="small" type="danger" plain @click="handleDisconnect(row)">
            {{ row.connected ? $t('Clients.kickOut') : $t('Clients.cleanSession') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="emq-table-footer">
      <common-pagination
        v-model:metaData="pageMeta"
        @loadPage="loadNodeClients"
      ></common-pagination>
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
import moment from 'moment'
import CommonPagination from '@/components/commonPagination.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { ArrowUp, ArrowDown, RefreshRight } from '@element-plus/icons-vue'
import CheckIcon from '@/components/CheckIcon.vue'
import { Client } from '@/types/client'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { NodeMsg } from '@/types/dashboard'

const showMoreQuery = ref(false)
const tableData = ref([])
const currentNodes = ref<NodeMsg[]>([])
const lockTable = ref(false)
const params = ref({})
const fuzzyParams = ref<Record<string, any>>({
  comparator: 'gte',
})
const pageMeta = ref({})
const protoNames = ref(['MQTT', 'MQTT-SN', 'CoAP', 'LwM2M'])
const store = useStore()
const { t } = useI18n()

const handleDisconnect = async (row: Client) => {
  let warningMsg = t('Clients.willDisconnectTheConnection')
  let successMsg = t('Clients.successfulDisconnection')
  if (!row.connected) {
    warningMsg = t('Clients.willCleanSession')
    successMsg = t('Clients.successfulCleanSession')
  }
  ElMessageBox.confirm(warningMsg, {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
    .then(async () => {
      await disconnectClient(row.clientid)
      loadNodeClients()
      ElMessage.success(successMsg)
    })
    .catch(() => {
      // ignore
    })
}

const handleSearch = async () => {
  params.value = genQueryParams(fuzzyParams.value)
  loadNodeClients({ page: 1 })
}

const genQueryParams = (params: Record<string, any>) => {
  let newParams: Record<string, any> = {}
  const {
    like_clientid,
    like_username,
    ip_address,
    conn_state,
    proto_name,
    comparator,
    connected_at,
    node,
  } = params
  newParams = {
    like_clientid: like_clientid || undefined,
    like_username: like_username || undefined,
    ip_address: ip_address || undefined,
    conn_state: conn_state || undefined,
    proto_name: proto_name || undefined,
    node: node || undefined,
  }
  if (connected_at) {
    newParams[`${comparator}_connected_at`] = new Date(connected_at).toISOString()
  }
  return newParams
}

const loadNodeData = async () => {
  const data = await loadNodes()
  if (data) currentNodes.value = data
}

const handleResetSerach = async () => {
  fuzzyParams.value = {
    comparator: 'gte',
  }
  params.value = genQueryParams(fuzzyParams.value)
  loadNodeClients({ page: 1 })
}

const loadNodeClients = async (_params = {}) => {
  lockTable.value = true
  const sendParams = {
    ...params.value,
    ...pageMeta.value,
    ..._params,
  }
  Reflect.deleteProperty(sendParams, 'count')
  const res = await listClients(sendParams).catch(() => {
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

loadNodeData()
loadNodeClients()
</script>

<style lang="scss">
@import '~@/style/management.scss';
</style>
