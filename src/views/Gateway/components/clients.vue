<template>
  <div class="gateway-client">
    <el-form @keyup.enter="searchGatewayList()">
      <el-row :gutter="20" class="search-wrapper">
        <el-col :span="6">
          <el-input
            :placeholder="t('Base.clientid')"
            v-model="searchParams.like_clientid"
            clearable
            @clear="searchGatewayList"
          />
        </el-col>
        <el-col :span="6" v-if="name === 'lwm2m'">
          <el-input
            :placeholder="tl('endpointName')"
            v-model="searchParams.like_endpoint_name"
            clearable
            @clear="searchGatewayList"
          />
        </el-col>
        <el-col :span="6" v-else>
          <el-input
            :placeholder="tl('username')"
            v-model="searchParams.like_username"
            clearable
            @clear="searchGatewayList"
          />
        </el-col>

        <el-col :span="6">
          <el-select
            v-model="searchParams.node"
            :placeholder="$t('Clients.node')"
            clearable
            @clear="searchGatewayList"
          >
            <el-option v-for="item in nodes" :value="item.node" :key="item.node" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" plain :icon="Search" @click="searchGatewayList()">
            {{ $t('Base.search') }}
          </el-button>
          <el-button type="primary" :icon="RefreshRight" @click="loadGatewayClients">
            {{ $t('Base.refresh') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="gatewayTable" v-loading="tbLoading">
      <el-table-column :label="$t('Base.clientid')" prop="clientid">
        <template #default="{ row }">
          <a href="javascript:;" @click="openClientDetail(row)">{{ row.clientid }}</a>
        </template>
      </el-table-column>

      <el-table-column :label="'Endpoint Name'" prop="endpoint_name" v-if="name === 'lwm2m'" />

      <el-table-column :label="tl('username')" prop="username" v-if="name !== 'lwm2m'" />

      <el-table-column :label="tl('ipaddress')">
        <template #default="{ row }">
          <span>{{ row.ip_address }}:{{ row.port }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="tl('lifetime')" prop="lifetime" v-if="name === 'lwm2m'" />
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
          <el-button plain @click="disconnectClient(row)" size="small">
            {{ $t('Clients.kickOut') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination v-model:metaData="pageMeta" @loadPage="loadGatewayClients" />
    </div>

    <el-drawer v-model="clientsDetailVisible" direction="rtl" size="90%" destroy-on-close>
      <client-details
        :gateway="name"
        :clientid="currentClientId"
        :key="currentClientId"
        @refreshGateway="closeClientDetail"
      />
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
import { useRoute } from 'vue-router'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CheckIcon from '@/components/CheckIcon.vue'
import { NodeMsg } from '@/types/dashboard'
import useI18nTl from '@/hooks/useI18nTl'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'

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
    const { tl, t } = useI18nTl('Gateway')
    let pageParams = {}

    const {
      pageMeta,
      pageParams: pageQueries,
      initPageMeta,
      setPageMeta,
    } = usePaginationWithHasNext()

    const loadGatewayClients = async function (params = {}) {
      tbLoading.value = true

      const sendParams = { ...pageQueries.value, ...pageParams, ...params }

      try {
        let { data, meta } = await getGatewayClients(gname, sendParams)
        gatewayTable.value = data
        setPageMeta(meta)
      } catch (error) {
        gatewayTable.value = []
        initPageMeta()
      } finally {
        tbLoading.value = false
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
      pageMeta.value.page = 1
      loadGatewayClients()
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
      try {
        await ElMessageBox.confirm(t('Clients.willDisconnectTheConnection'), {
          confirmButtonText: t('Base.confirm'),
          cancelButtonText: t('Base.cancel'),
          confirmButtonClass: 'confirm-danger',
          type: 'warning',
        })
        await disconnGatewayClient(gname, row.clientid)
        ElMessage.success(t('Clients.successfulDisconnection'))
        loadGatewayClients()
      } catch (error) {
        //
      }
    }

    onMounted(() => {
      loadAllNodes()
      loadGatewayClients()
    })

    return {
      Search,
      RefreshRight,
      moment: moment,
      tl,
      t,
      loadGatewayClients,
      pCommon,
      gatewayTable,
      tbLoading,
      searchGatewayList,
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
