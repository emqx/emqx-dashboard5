<template>
  <div class="app-wrapper clients">
    <el-form @keyup.enter="handleSearch">
      <el-row class="search-wrapper" :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="fuzzyParams.like_clientid"
            size="small"
            :placeholder="$t('Clients.clientId')"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="fuzzyParams.like_username"
            size="small"
            :placeholder="$t('Clients.username')"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="fuzzyParams.node"
            :placeholder="$t('Clients.node')"
            size="small"
            clearable
          >
            <el-option
              v-for="item in currentNodes"
              :value="item.node"
              :key="item.node"
            ></el-option>
          </el-select>
        </el-col>
        <template v-if="showMoreQuery">
          <el-col :span="6">
            <el-input
              v-model="fuzzyParams.ip_address"
              size="small"
              :placeholder="$t('Clients.ipAddress')"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="fuzzyParams.conn_state"
              size="small"
              :placeholder="$t('Clients.connectedStatus')"
              clearable
            >
              <el-option value="connected"></el-option>
              <el-option value="disconnected"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-row class="form-item-row">
              <el-col :span="8">
                <el-select
                  v-model="fuzzyParams.comparator"
                  class="comparator"
                  size="small"
                >
                  <el-option label=">=" value="gte"></el-option>
                  <el-option label="<=" value="lte"></el-option>
                </el-select>
              </el-col>
              <el-col :span="16">
                <el-date-picker
                  v-model="fuzzyParams.connected_at"
                  class="datatime"
                  type="datetime"
                  value-format="timestamp"
                  size="small"
                  :placeholder="$t('Clients.createdAt')"
                  clearable
                >
                </el-date-picker>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="fuzzyParams.proto_name"
              size="small"
              :placeholder="$t('Clients.protocol')"
              clearable
            >
              <el-option v-for="name in protoNames" :key="name" :value="name">
              </el-option>
            </el-select>
          </el-col>
        </template>
        <el-col :span="6" class="col-oper">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleSearch"
          >
            {{ $t("Clients.search") }}
          </el-button>

          <a
            href="javascript:;"
            class="show-more"
            @click="showMoreQuery = !showMoreQuery"
          >
            <i
              :class="showMoreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            ></i>
          </a>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      :data="tableData"
      :row-class-name="getRowClass"
      @row-click="handleRowClick"
      ref="clientsTable"
      v-loading.lock="lockTable"
    >
      <!-- <el-table-column type="selection"> </el-table-column> -->
      <el-table-column prop="clientid" sortable :label="$t('Clients.clientId')">
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
        sortable
        :label="$t('Clients.username')"
      ></el-table-column>
      <el-table-column
        prop="ip_address"
        sortable
        :label="$t('Clients.ipAddress')"
      >
        <template #default="{ row }">
          {{ row.ip_address + ":" + row.port }}
        </template>
      </el-table-column>
      <el-table-column
        prop="keepalive"
        sortable
        :label="$t('Clients.keepalive')"
      ></el-table-column>
      <el-table-column
        prop="proto_name"
        sortable
        :label="$t('Clients.protocol')"
      >
        <template #default="{ row }">
          <span class="">
            {{ row.proto_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="connected"
        sortable
        :label="$t('Clients.connectedStatus')"
      >
        <template #default="{ row }">
          <el-badge is-dot :type="row.connected ? 'success' : 'danger'">
          </el-badge>
          <span>{{
            row.connected ? $t("Clients.connected") : $t("Clients.disconnected")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="connected_at"
        sortable
        :label="$t('Clients.connectedAt')"
      >
        <template #default="{ row }">
          {{ moment(row.connected_at).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="mini" type="danger" @click="handleDisconnect(row)">
            {{
              row.connected ? $t("Clients.kickOut") : $t("Clients.cleanSession")
            }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="emq-table-footer">
      <common-pagination
        v-model:metaData="pageMeta"
        @loadPage="loadNodeClients"
      ></common-pagination>
      <!-- <custom-pagination
        v-if="count === -1 && tableData.length"
        :hasnext="hasnext"
        :page="params.page"
        @prevClick="handlePrevClick"
        @nextClick="handleNextClick"
      >
      </custom-pagination> -->
    </div>
  </div>
</template>

<script>
// import CustomPagination from '@/components/CustomPagination.vue'
import { disconnectClient, listClients } from "@/api/clients";
import { loadNodes } from "@/api/common";
import moment from "moment";
import CommonPagination from "@/components/commonPagination.vue";

export default {
  name: "Clients",

  components: {
    // CustomPagination,
    CommonPagination,
  },
  data() {
    return {
      showMoreQuery: false,
      tableData: [],
      lockTable: false,
      // hasnext: false,
      params: {},
      currentNodes: [],
      fuzzyParams: {
        comparator: "gte",
      },
      pageMeta: {},
      // selectedClients: [],
      protoNames: ["MQTT", "MQTT-SN", "CoAP", "LwM2M"],
      // qulifiedKeys: [
      //   'awaiting_rel',
      //   'clean_start',
      //   'clientid',
      //   'connected',
      //   'connected_at',
      //   'created_at',
      //   'expiry_interval',
      //   'heap_size',
      //   'inflight',
      //   'ip_address',
      //   'is_bridge',
      //   'keepalive',
      //   'mailbox_len',
      //   'max_awaiting_rel',
      //   'max_inflight',
      //   'max_mqueue',
      //   'max_subscriptions',
      //   'mountpoint',
      //   'mqueue_dropped',
      //   'mqueue_len',
      //   'node',
      //   'port',
      //   'proto_name',
      //   'proto_ver',
      //   'recv_cnt',
      //   'recv_msg',
      //   'recv_oct',
      //   'recv_pkt',
      //   'reductions',
      //   'send_cnt',
      //   'send_msg',
      //   'send_oct',
      //   'send_pkt',
      //   'subscriptions_cnt',
      //   'username',
      //   'zone',
      // ],
    };
  },

  mounted() {
    this.loadData();
    // this.$refs.p.$emit("loadPage");
    this.loadNodeClients();
  },

  methods: {
    moment: moment,
    handleRowClick(row, column, event) {
      // console.log(row, event)
      //shiftkey+mouse select all rows before the selected one
      if (event.shiftKey) {
        let rowIndex = this.tableData.findIndex((e) => e == row);
        for (let x = rowIndex, y = 0; x > y; x--) {
          if (this.tableData[x].selection) break;
          this.$refs.clientsTable.toggleRowSelection(this.tableData[x], true);
          this.tableData[x].selection = true;
        }
      }
      // else {
      //   this.$refs.clientsTable.toggleRowSelection(row, !row.selection)
      //   row.selection = !row.selection
      // }
    },
    // clientSelectAll(sel) {
    //   this.selectedClients = sel
    //   sel.length
    //     ? sel.forEach((row) => (row.selection = true))
    //     : this.tableData.forEach((row) => (row.selection = false))
    // },
    // clientSelect(selection, row) {
    //   row.selection = selection.includes(row)
    //   this.selectedClients = selection
    // },
    getRowClass({ row, rowIndex }) {
      if (row.selection == true) {
        return "row_selected";
      }
    },
    async handleDisconnect(row) {
      let warningMsg = this.$t("Clients.willDisconnectTheConnection");
      let successMsg = this.$t("Clients.successfulDisconnection");
      if (!row.connected) {
        warningMsg = this.$t("Clients.willCleanSession");
        successMsg = this.$t("Clients.successfulCleanSession");
      }
      this.$msgbox
        .confirm(warningMsg, {
          confirmButtonText: this.$t("Base.confirm"),
          cancelButtonText: this.$t("Base.cancel"),
          type: "warning",
        })
        .then(async () => {
          await disconnectClient(row.clientid);
          this.loadNodeClients();
          this.$message.success(successMsg);
          // this.$refs.p.$emit("loadPage");
        })
        .catch(() => {});
    },

    async handleSearch() {
      this.params = this.genQueryParams(this.fuzzyParams);
      // this.$refs.p.$emit("loadPage", 1);
      this.loadNodeClients({ page: 1 });
    },
    genQueryParams(params) {
      let newParams = {};
      const {
        like_clientid,
        like_username,
        ip_address,
        conn_state,
        proto_name,
        comparator,
        connected_at,
        node,
      } = params;
      newParams = {
        like_clientid: like_clientid || undefined,
        like_username: like_username || undefined,
        ip_address: ip_address || undefined,
        conn_state: conn_state || undefined,
        proto_name: proto_name || undefined,
        node: node || undefined,
      };
      if (connected_at) {
        newParams[`${comparator}_connected_at`] = new Date(
          connected_at
        ).toISOString();
      }
      return newParams;
    },
    // handlePrevClick() {
    //   if (this.params.page === 1) {
    //     return
    //   }
    //   this.params.page -= 1
    //   const params = this.genQueryParams(this.fuzzyParams)
    //   this.loadNodeClients(false, params)
    // },
    // handleNextClick() {
    //   if (!this.hasnext) {
    //     return
    //   }
    //   this.params.page += 1
    //   const params = this.genQueryParams(this.fuzzyParams)
    //   this.loadNodeClients(false, params)
    // },
    async loadData() {
      const data = await loadNodes().catch(() => {});
      if (data) this.currentNodes = data;
    },
    async loadNodeClients(params = {}) {
      this.lockTable = true;

      const sendParams = {
        ...this.params,
        ...this.pageMeta,
        ...params,
      };
      Reflect.deleteProperty(sendParams, "count");

      const res = await listClients(sendParams).catch(() => {});
      if (res) {
        const { data = [], meta = {} } = res;
        this.tableData = data;
        this.lockTable = false;
        this.pageMeta = meta;
        // this.hasnext = meta.hasnext || this.hasnext
      } else {
        this.tableData = [];
        this.lockTable = false;
        this.pageMeta = {};
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.show-more {
  margin-left: 12px;
}
</style>
