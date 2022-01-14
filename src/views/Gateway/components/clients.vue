<template>
  <div class="gateway-client">
    <el-form @keyup.enter="searchGatewayList()">
      <el-row :gutter="20" class="search-wrapper">
        <el-col :span="6">
          <el-input
            :placeholder="tl('clientid')"
            size="small"
            v-model="searchParams.like_clientid"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="6" v-if="name === 'lwm2m'">
          <el-input
            :placeholder="tl('endpointName')"
            size="small"
            v-model="searchParams.like_endpoint_name"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="6" v-else>
          <el-input
            :placeholder="tl('username')"
            size="small"
            v-model="searchParams.like_username"
            clearable
          ></el-input>
        </el-col>

        <el-col :span="6">
          <el-select
            v-model="searchParams.node"
            :placeholder="$t('Clients.node')"
            size="small"
            clearable
          >
            <el-option v-for="item in nodes" :value="item.node" :key="item.node"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" :icon="Search" size="small" @click="searchGatewayList()">{{
            $t('Base.search')
          }}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="gatewayTable" v-loading="tbLoading">
      <el-table-column :label="'Client ID'" sortable prop="clientid"></el-table-column>

      <el-table-column
        :label="'Endpoint Name'"
        sortable
        prop="endpoint_name"
        v-if="name === 'lwm2m'"
      ></el-table-column>

      <el-table-column
        :label="tl('username')"
        sortable
        prop="username"
        v-if="name !== 'lwm2m'"
      ></el-table-column>

      <el-table-column :label="tl('ipaddress')" sortable>
        <template #default="{ row }">
          <span>{{ row.ip_address }}:{{ row.port }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="tl('lifetime')"
        sortable
        prop="lifetime"
        v-if="name === 'lwm2m'"
      ></el-table-column>
      <el-table-column :label="tl('status')" sortable v-else>
        <template #default="{ row }">
          <el-badge is-dot :type="row.connected ? 'success' : 'danger'"> </el-badge>
          <span>{{ row.connected ? $t('Clients.connected') : $t('Clients.disconnected') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('connectedAt')" sortable>
        <template #default="{ row }">
          {{ moment(row.connected_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button @click="openClientDetail(row)" size="mini">{{ $t('Base.view') }}</el-button>
          <el-button type="danger" @click="disconnectClient(row)" size="mini">{{
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
      ></client-details>
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import commonPagination from '@/components/commonPagination.vue'
import { getGatewayClients, disconnGatewayClient } from '@/api/gateway'
import { loadNodes } from '@/api/common'
import moment from 'moment'
import ClientDetails from '../../Clients/ClientDetails.vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

export default defineComponent({
  components: { commonPagination, ClientDetails },

  setup() {
    let pCommon = ref(null)
    let gatewayTable = ref([])
    let tbLoading = ref(false)
    let searchParams = reactive({
      like_clientid: '',
      like_username: '',
      node: '',
      like_endpoint_name: '',
    })
    let nodes = ref([])
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
      const data = await loadNodes().catch(() => {})
      if (data) nodes.value = data
      else nodes.value = []
    }

    const searchGatewayList = async function () {
      let params = {}
      Object.keys(searchParams).forEach((k) => {
        params[k] = searchParams[k] === '' ? undefined : searchParams[k]
      })
      pageParams = params
      loadGatewayClients()
    }

    const openClientDetail = async function (row) {
      clientsDetailVisible.value = true
      currentClientId.value = row.clientid
    }

    const disconnectClient = async function (row) {
      this.$msgbox
        .confirm(t('Clients.willDisconnectTheConnection'), {
          confirmButtonText: t('Base.confirm'),
          cancelButtonText: t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          let id = row.clientid
          let res = await disconnGatewayClient(gname, id).catch(() => {})
          if (res) {
            this.$message.success(t('Clients.successfulDisconnection'))
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
      tl: (key, collection = 'Gateway') => t(collection + '.' + key),
      loadGatewayClients,
      pCommon,
      gatewayTable,
      tbLoading,
      searchGatewayList,
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
