<template>
  <div>
    <el-form @keyup.enter="searchGatewayList()">
      <el-row :gutter="20" class="search-wrapper">
        <template v-if="name === 'LWM2M'">
          <el-col :span="6">
            <el-input
              :placeholder="tl('endpointName')"
              size="small"
              v-model="searchParams.like_endpoint_name"
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
              <el-option
                v-for="item in nodes"
                :value="item.node"
                :key="item.node"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchGatewayList()"
              >{{ $t("Base.search") }}</el-button
            >
          </el-col>
        </template>
        <template v-else>
          <el-col :span="6">
            <el-input
              :placeholder="tl('clientid')"
              size="small"
              v-model="searchParams.like_clientid"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="6">
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
              <el-option
                v-for="item in nodes"
                :value="item.node"
                :key="item.node"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchGatewayList()"
              >{{ $t("Base.search") }}</el-button
            >
          </el-col>
        </template>
      </el-row>
    </el-form>
    <el-table :data="gatewayTable" v-loading="tbLoading">
      <el-table-column
        :label="'Endpoint Name'"
        sortable
        prop="endpoint_name"
        v-if="name === 'LWM2M'"
      ></el-table-column>
      <el-table-column
        :label="'Client ID'"
        sortable
        prop="clientid"
        v-if="name !== 'LWM2M'"
      ></el-table-column>
      <el-table-column
        :label="tl('username')"
        sortable
        prop="username"
        v-if="name !== 'LWM2M'"
      ></el-table-column>
      <el-table-column
        :label="tl('lifetime')"
        sortable
        prop="lifetime"
        v-if="name === 'LWM2M'"
      ></el-table-column>

      <el-table-column :label="tl('ipaddress')" sortable>
        <template #default="{ row }">
          <span>{{ row.ip_address }}:{{ row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('status')" sortable>
        <template #default="{ row }">
          <el-badge is-dot :type="row.connected ? 'success' : 'danger'">
          </el-badge>
          <span>{{
            row.connected ? $t("Clients.connected") : $t("Clients.disconnected")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('connectedAt')" sortable>
        <template #default="{ row }">
          {{ moment(row.connected_at).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button @click="openClientDetail(row)">{{
            $t("Base.view")
          }}</el-button>
          <el-button type="danger" plain @click="disconnectClient(row)">{{
            $t("Clients.kickOut")
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination
        ref="pCommon"
        :reload-func="loadGatewayClients"
      ></common-pagination>
    </div>

    <el-drawer v-model="clientsDetailVisible" direction="rtl" size="70%">
      <client-details
        gateway
        :clientid="currentClientId"
        :key="currentClientId"
      ></client-details>
    </el-drawer>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
} from "vue";
import commonPagination from "@/components/commonPagination.vue";
import { getGatewayClients, disconnGatewayClient } from "@/api/gateway";
import { loadNodes } from "@/api/common";
import moment from "moment";
import ClientDetails from "../../Clients/ClientDetails.vue";

export default defineComponent({
  components: { commonPagination, ClientDetails },
  data: function () {
    return {
      name: String(this.$route.params.name).toUpperCase(),
    };
  },
  setup() {
    let pCommon = ref(null);
    let gatewayTable = ref([]);
    let tbLoading = ref(false);
    let searchParams = reactive({
      like_clientid: "",
      like_username: "",
      node: "",
      like_endpoint_name: "",
    });
    let nodes = ref([]);
    let clientsDetailVisible = ref(false);
    let currentClientId = ref("");
    let vm = getCurrentInstance();
    const tl = function (key, collection = "Gateway") {
      return this.$t(collection + "." + key);
    };

    const loadGatewayClients = async function (params = {}) {
      tbLoading.value = true;
      let gName = String(vm.data.name).toLowerCase();
      let res = await getGatewayClients(gName, params).catch(() => {});
      if (res) {
        gatewayTable.value = res.data;
        tbLoading.value = false;
        return res.meta;
      } else {
        tbLoading.value = false;
        gatewayTable.value = [];
        return {};
      }
    };

    const loadAllNodes = async function () {
      const data = await loadNodes().catch(() => {});
      if (data) nodes.value = data;
      else nodes.value = [];
    };

    const searchGatewayList = async function () {
      let params = {};
      Object.keys(searchParams).forEach((k) => {
        params[k] = searchParams[k] === "" ? undefined : searchParams[k];
      });
      loadGatewayClients(params);
    };

    const openClientDetail = async function (row) {
      clientsDetailVisible.value = true;
      currentClientId.value = row.clientid;
    };

    const disconnectClient = async function (row) {
      this.$msgbox
        .confirm(this.$t("Clients.willDisconnectTheConnection"), {
          confirmButtonText: this.$t("Base.confirm"),
          cancelButtonText: this.$t("Base.cancel"),
          type: "warning",
        })
        .then(async () => {
          let gName = String(vm.data.name).toLowerCase();
          let id = row.clientid;
          let res = await disconnGatewayClient(gName, id).catch(() => {});
          if (res) {
            this.$message.success(this.$t("Clients.successfulDisconnection"));

            pCommon.value.$emit("loadPage");
          }
        })
        .catch(() => {});
    };

    onMounted(() => {
      loadAllNodes();
      pCommon.value.$emit("loadPage");
    });

    return {
      moment: moment,
      tl,
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
    };
  },
});
</script>

<style lang="scss" scoped></style>
