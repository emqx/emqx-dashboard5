<template>
  <div class="gateway-client">
    <el-form @keyup.enter="searchGatewayList()">
      <el-row :gutter="20" class="search-wrapper">
        <el-col :span="6">
          <el-input
            :placeholder="tl('clientid')"
            v-model="searchParams.like_clientid"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="6" v-if="name === 'lwm2m'">
          <el-input
            :placeholder="tl('endpointName')"
            v-model="searchParams.like_endpoint_name"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="6" v-else>
          <el-input
            :placeholder="tl('username')"
            v-model="searchParams.like_username"
            clearable
          ></el-input>
        </el-col>

        <el-col :span="6">
          <el-select v-model="searchParams.node" :placeholder="$t('Clients.node')" clearable>
            <el-option v-for="item in nodes" :value="item.node" :key="item.node"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" :icon="Search" @click="searchGatewayList()">{{
            $t('Base.search')
          }}</el-button>
          <el-button type="primary" plain @click="handleResetSearch">
            {{ $t('Base.reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="gatewayTable" v-loading="tbLoading">
      <el-table-column label="Client ID" prop="clientid">
        <template #default="{ row }">
          <a href="javascript:;" @click="openClientDetail(row)">{{ row.clientid }}</a>
        </template>
      </el-table-column>

      <el-table-column
        :label="'Endpoint Name'"
        prop="endpoint_name"
        v-if="name === 'lwm2m'"
      ></el-table-column>

      <el-table-column
        :label="tl('username')"
        prop="username"
        v-if="name !== 'lwm2m'"
      ></el-table-column>

      <el-table-column :label="tl('ipaddress')">
        <template #default="{ row }">
          <span>{{ row.ip_address }}:{{ row.port }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="tl('lifetime')"
        prop="lifetime"
        v-if="name === 'lwm2m'"
      ></el-table-column>
      <el-table-column :label="tl('status')" v-else>
        <template #default="{ row }">
          <CheckIcon :status="row.connected ? 'check' : 'close'" size="small" :top="1" />
          <span>{{ row.connected ? $t('Clients.connected') : $t('Clients.disconnected') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('connectedAt')">
        <template #default="{ row }">
          {{ moment(row.connected_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button type="danger" plain @click="disconnectClient(row)" size="small">{{
            $t('Clients.kickOut')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination
        v-model:metaData="pageMeta"
        @loadPage="loadGatewayClients"
      ></common-pagination>
    </div>

    <el-drawer v-model="clientsDetailVisible" direction="rtl" size="90%">
      <client-details
        :gateway="name"
        :clientid="currentClientId"
        :key="currentClientId"
        @refreshGateway="closeClientDetail"
      ></client-details>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import commonPagination from '@/components/commonPagination.vue'
import { getGatewayClients, disconnGatewayClient } from '@/api/gateway'
import { loadNodes } from '@/api/common'
import moment from 'moment'
import ClientDetails from '../../Clients/ClientDetails.vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CheckIcon from '@/components/CheckIcon.vue'
import { NodeMsg } from '@/types/dashboard'

export default defineComponent({
  components: { commonPagination, ClientDetails, CheckIcon },

  setup() {
    let pCommon = ref(null)
    let gatewayTable = ref([])
    let tbLoading = ref(false)
    let searchParams = reactive<Record<string, any>>({
      like_clientid: '',
      like_username: '',
      node: '',
      like_endpoint_name: '',
    })
    let nodes = ref<NodeMsg[]>([])
    let clientsDetailVisible = ref(false)
    let currentClientId = ref('')

    const route = useRoute()
    const gname = String(route.params.name).toLowerCase()
    const { t } = useI18n()
    const pageMeta = ref({})
    let pageParams = {}

    const loadGatewayClients = async function (params = {}) {
      tbLoading.value = true

      const sendParams = {
        ...pageMeta.value,
        ...pageParams,
        ...params,
      }
      Reflect.deleteProperty(sendParams, 'count')

      let res = await getGatewayClients(gname, sendParams).catch(() => {})
      if (res) {
        gatewayTable.value = res.data
        tbLoading.value = false
        pageMeta.value = res.meta
      } else {
        tbLoading.value = false
        gatewayTable.value = []
        pageMeta.value = {}
      }
    }

    const loadAllNodes = async function () {
      const data = await loadNodes()
      if (data) nodes.value = data
      else nodes.value = []
    }

    const searchGatewayList = async function () {
      let params: Record<string, any> = {}
      Object.keys(searchParams).forEach((k) => {
        params[k] = searchParams[k] === '' ? undefined : searchParams[k]
      })
      pageParams = params
      loadGatewayClients()
    }

    const handleResetSearch = () => {
      searchParams.like_clientid = ''
      searchParams.like_username = ''
      searchParams.like_endpoint_name = ''
      searchParams.node = ''
      pageParams = {}
      loadGatewayClients({ page: 1 })
    }

    const openClientDetail = async function (row: any) {
      clientsDetailVisible.value = true
      currentClientId.value = row.clientid
    }

    const closeClientDetail = () => {
      clientsDetailVisible.value = false
      currentClientId.value = ''
      loadGatewayClients()
    }

    const disconnectClient = async function (row: any) {
      ElMessageBox.confirm(t('Clients.willDisconnectTheConnection'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          let id = row.clientid
          let res = await disconnGatewayClient(gname, id).catch(() => {})
          if (res) {
            ElMessage.success(t('Clients.successfulDisconnection'))
            loadGatewayClients()
          }
        })
        .catch(() => {})
    }

    onMounted(() => {
      loadAllNodes()
      loadGatewayClients()
    })

    return {
      Search,
      moment: moment,
      tl: (key: string, collection = 'Gateway') => t(collection + '.' + key),
      loadGatewayClients,
      pCommon,
      gatewayTable,
      tbLoading,
      searchGatewayList,
      handleResetSearch,
      closeClientDetail,
      searchParams,
      nodes,
      clientsDetailVisible,
      currentClientId,
      openClientDetail,
      disconnectClient,
      name: gname,
      pageMeta,
    }
  },
})
</script>

<style lang="scss" scoped>
.gateway-client {
  :deep(.el-drawer__body) {
    overflow-y: auto;
  }
}
</style>
