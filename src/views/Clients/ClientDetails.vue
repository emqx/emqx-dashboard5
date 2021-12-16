<template>
  <div class="client-details app-wrapper">
    <div class="section-header" v-loading.lock="clientDetailLock">
      <div>
        <span>{{ clientId }}</span>
        <el-tag type="info" size="mini">
          <span v-if="record.connected == true"
            ><i class="el-icon-success iconfont suc"></i
            >{{ $t("Clients.connected") }}</span
          >
          <span v-else
            ><i class="el-icon-error iconfont fail"></i
            >{{ $t("Clients.disconnected") }}</span
          >
        </el-tag>
        <el-tag type="info" size="mini" v-if="record.proto_name">
          <span>{{ record.proto_name }}</span
          >&nbsp;
          <span v-if="record.proto_name === 'MQTT'">{{
            mqttVersion[record.proto_ver]
          }}</span
          ><span v-else>{{ record.proto_ver }}</span>
        </el-tag>
      </div>
      <div>
        <el-button
          v-if="record.connected"
          type="danger"
          size="small"
          @click="handleDisconnect"
        >
          {{ $t("Clients.kickOut") }}
        </el-button>
        <el-button v-else type="danger" size="small" @click="handleDisconnect">
          {{ $t("Clients.cleanSession") }}
        </el-button>
      </div>
    </div>

    <el-card shadow="never" v-loading.lock="clientDetailLock">
      <div class="part-header">
        {{ $t("Clients.connectionInfo") }}
      </div>
      <el-row>
        <el-col
          v-for="item in clientDetailParts.connection"
          :key="item"
          :span="8"
        >
          <div v-if="item == 'proto_type'" class="detail-item">
            <span :title="tl(snake2pascal(item))"
              >{{ tl(snake2pascal(item)) }}:</span
            >
            <span
              v-if="record.proto_name === 'MQTT'"
              :title="
                record.proto_name + '&nbsp;' + mqttVersion[record.proto_ver]
              "
              >{{ record.proto_name }} {{ mqttVersion[record.proto_ver] }}</span
            >
            <span
              v-else
              :title="record.proto_name + '&nbsp;' + record.proto_ver"
              >{{ record.proto_name }} {{ record.proto_ver }}</span
            >
          </div>
          <div
            v-else-if="item == 'connected_at' || item == 'disconnected_at'"
            class="detail-item"
          >
            <span :title="tl(snake2pascal(item))"
              >{{ tl(snake2pascal(item)) }}:</span
            >
            <span
              :title="
                record[item] &&
                moment(record[item]).format('YYYY-MM-DD HH:mm:ss')
              "
            >
              {{
                record[item] &&
                moment(record[item]).format("YYYY-MM-DD HH:mm:ss")
              }}
            </span>
          </div>
          <div v-else-if="item == 'ip_address'" class="detail-item">
            <span :title="tl(snake2pascal(item))"
              >{{ tl(snake2pascal(item)) }}:</span
            >
            <span :title="record.ip_address + ':' + record.port">{{
              record.ip_address + ":" + record.port
            }}</span>
          </div>
          <div v-else class="detail-item">
            <span :title="tl(snake2pascal(item))"
              >{{ tl(snake2pascal(item)) }}:</span
            >
            <span :title="record[item]">{{ record[item] }}</span>
          </div>
        </el-col>
      </el-row>

      <div class="part-header">
        {{ $t("Clients.sessionInfo") }}
      </div>
      <el-row>
        <el-col v-for="item in clientDetailParts.session" :key="item" :span="8">
          <div v-if="item == 'subscriptions'" class="detail-item">
            <span :title="tl(snake2pascal(item))"
              >{{ tl(snake2pascal(item)) }}:</span
            >
            <span
              :title="record.subscriptions_cnt + '/' + record.subscriptions_max"
            >
              {{ record.subscriptions_cnt + "/" + record.subscriptions_max }}
            </span>
          </div>
          <div v-else-if="item == 'clean_start'" class="detail-item">
            <span
              :title="record.proto_ver === 5 ? 'Clean Start' : 'Clean Session'"
              >{{
                record.proto_ver === 5 ? "Clean Start" : "Clean Session"
              }}:</span
            >
            <span :title="record[item]">{{ record[item] }}</span>
          </div>
          <div v-else-if="item == 'mqueue'" class="detail-item">
            <span :title="tl(snake2pascal(item))"
              >{{ tl(snake2pascal(item)) }}:</span
            >
            <span :title="record.mqueue_len + '/' + record.mqueue_max">{{
              record.mqueue_len + "/" + record.mqueue_max
            }}</span>
          </div>
          <div v-else-if="item == 'inflight'" class="detail-item">
            <span :title="tl(snake2pascal(item))"
              >{{ tl(snake2pascal(item)) }}:</span
            >
            <span :title="record.inflight_cnt + '/' + record.inflight_max">
              {{ record.inflight_cnt + "/" + record.inflight_max }}
            </span>
          </div>
          <div v-else-if="item == 'created_at'" class="detail-item">
            <span :title="tl(snake2pascal(item))"
              >{{ tl(snake2pascal(item)) }}:</span
            >
            <span :title="moment(record[item]).format('YYYY-MM-DD HH:mm:ss')">
              {{ moment(record[item]).format("YYYY-MM-DD HH:mm:ss") }}
            </span>
          </div>
          <div v-else class="detail-item">
            <span :title="tl(snake2pascal(item))"
              >{{ tl(snake2pascal(item)) }}:</span
            >
            <span :title="record[item]">{{ record[item] }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <div class="section-header">
      <div>
        {{ $t("Clients.currentSubscription") }}
      </div>
      <div>
        <!-- <el-button  size="mini" icon="el-icon-refresh" @click="loadData">
          {{ $t('Clients.refresh') }}
        </el-button> -->
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="handlePreAdd"
        >
          {{ $t("Clients.addASubscription") }}
        </el-button>
      </div>
    </div>
    <el-table :data="subscriptions" v-loading.lock="subsLockTable">
      <el-table-column
        prop="topic"
        show-overflow-tooltip
        label="Topic"
        sortable
      ></el-table-column>
      <el-table-column
        prop="qos"
        sortable
        min-width="110px"
        label="QoS"
      ></el-table-column>
      <el-table-column prop="clientid" :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button
            type="danger"
            size="mini"
            @click="handleUnSubscription(row)"
          >
            {{ $t("Clients.unsubscribe") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <create-subscribe
      v-model:visible="dialogVisible"
      :client-id="record.clientid"
      :gateway="gateway"
      @create:subs="loadSubs"
    >
    </create-subscribe>

    <!-- <el-dialog
      :visible.sync="errDialog"
      :before-close="
        () => {
          this.$router.push({ path: '/clients' })
        }
      "
    >
      <span>{{ $t('Clients.clientDetailErr') }}</span>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  loadClientDetail,
  loadSubscriptions,
  unsubscribe,
  disconnectClient,
} from "@/api/clients";
import CreateSubscribe from "./components/CreateSubscribe";
import moment from "moment";
import {
  getGatewayClientDetail,
  getGatewayClientSubs,
  disconnGatewayClient,
  unsubscribeGatewayClientSub,
} from "@/api/gateway";
import { ElMessage } from "element-plus";

export default {
  name: "ClientDetails",
  components: { CreateSubscribe },
  props: {
    gateway: {
      type: String,
      required: false,
      default: "",
    },
    clientid: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      dialogVisible: false,
      activeName: "detail",
      searchValue: "",
      clientDetailLock: true,
      subsLockTable: true,
      errDialog: false,
      record: {},
      clientsOrganizied: {
        MQTT: {
          connection: [
            "node",
            "clientid",
            "username",
            "proto_type",
            "ip_address",
            "keepalive",
            "is_bridge",
            "connected_at",
            "disconnected_at",
            "zone",
            "recv_cnt",
            "recv_msg",
            "recv_oct",
            "recv_pkt",
          ],
          session: [
            "clean_start",
            "expiry_interval",
            "created_at",
            "subscriptions",
            "mqueue",
            "inflight",
            "heap_size",
            "reductions",
            "awaiting_rel",
            "max_awaiting_rel",
            "send_cnt",
            "send_msg",
            "send_oct",
            "send_pkt",
          ],
        },
        LWM2M: {
          connection: [
            "node",
            "endpoint_name",
            "lifetime",
            "clientid",
            "username",
            "proto_type",
            "ip_address",
            "connected_at",
            "disconnected_at",
            "recv_oct",
            "send_oct",
            "recv_cnt",
            "send_cnt",
            "recv_pkt",
            "send_pkt",
          ],
          session: [
            "subscriptions",
            "mqueue",
            "inflight",
            "heap_size",
            "reductions",
          ],
        },
        others: {
          connection: [
            "node",
            "clientid",
            "username",
            "proto_type",
            "ip_address",
            "keepalive",
            "connected_at",
            "disconnected_at",
            "recv_oct",
            "send_oct",
            "recv_cnt",
            "send_cnt",
            "recv_pkt",
            "send_pkt",
          ],
          session: [
            "subscriptions",
            "mqueue",
            "inflight",
            "heap_size",
            "reductions",
          ],
        },
      },
      mqttVersion: {
        3: "v3.1",
        4: "v3.1.1",
        5: "v5.0",
      },
      subscriptions: [],
    };
  },

  computed: {
    clientId() {
      return this.$route.params.clientId || this.clientid;
    },
    clientType() {
      return String(this.record.proto_name).toUpperCase();
    },
    clientDetailParts() {
      let allParts = Object.keys(this.clientsOrganizied);
      if (Array.prototype.includes.call(allParts, this.clientType))
        return this.clientsOrganizied[this.clientType];

      return this.clientsOrganizied.others;
    },
  },

  created() {
    this.loadData();
    this.loadSubs();
  },

  methods: {
    moment: moment,
    snake2pascal(s) {
      return String(s).replace(/(_[a-z])/g, (m) =>
        m.substring(1).toUpperCase()
      );
    },
    tl(key, collection = "Clients") {
      return this.$t(collection + "." + key);
    },
    async handleDisconnect() {
      let warningMsg = this.$t("Clients.willDisconnectTheConnection");
      let successMsg = this.$t("Clients.successfulDisconnection");
      if (!this.record.connected) {
        warningMsg = this.$t("Clients.willCleanSession");
        successMsg = this.$t("Clients.successfulCleanSession");
      }
      this.$msgbox
        .confirm(warningMsg, {
          confirmButtonText: this.$t("Base.confirm"),
          cancelButtonText: this.$t("Base.cancel"),
          type: "warning",
        })
        .then(() => {
          if (this.gateway) {
            return this.handleDisconnectGateway();
          } else {
            return disconnectClient(this.record.clientid);
          }
        })
        .then(() => {
          // this.$set(this.record, 'connected', false)
          this.record.connected = false;
          ElMessage.success(successMsg);
          // this.$router.push({ path: '/clients' })
        })
        .catch(() => {});
    },
    async handleDisconnectGateway() {
      let res = await disconnGatewayClient(
        this.gateway,
        this.record.clientid
      ).catch(() => {});
      if (res) {
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    },
    handlePreAdd() {
      this.dialogVisible = true;
    },
    async loadData() {
      if (this.gateway) {
        return this.loadGatewayData();
      }
      this.clientDetailLock = true;
      let res = await loadClientDetail(this.clientId).catch(() => {});
      if (res) {
        this.record = res;
      } else {
        this.record = {};
      }
      this.clientDetailLock = false;
    },
    async loadGatewayData() {
      this.clientDetailLock = true;
      let res = await getGatewayClientDetail(this.gateway, this.clientId).catch(
        () => {}
      );
      if (res) {
        this.record = res;
      } else {
        this.record = {};
      }
      this.clientDetailLock = false;
    },
    async loadSubs() {
      if (this.gateway) {
        return this.loadGatewaySubs();
      }
      this.subsLockTable = true;
      let res = await loadSubscriptions(this.clientId).catch(() => {});
      if (res) {
        this.subscriptions = res;
      } else {
        this.subscriptions = [];
      }
      this.subsLockTable = false;
    },
    async loadGatewaySubs() {
      this.subsLockTable = true;
      let res = await getGatewayClientSubs(this.gateway, this.clientId).catch(
        () => {}
      );
      if (res) {
        this.subscriptions = res;
      } else {
        this.subscriptions = [];
      }
      this.subsLockTable = false;
    },
    handleUnSubscription(row) {
      const title = this.$t("Clients.unsubscribeTitle");
      this.$msgbox
        .confirm(title, {
          confirmButtonText: this.$t("Base.confirm"),
          cancelButtonText: this.$t("Base.cancel"),
          type: "warning",
        })
        .then(async () => {
          if (this.gateway) {
            return this.handleUnsubscriptionGateway(row);
          } else {
            const { clientid, topic } = row;
            return unsubscribe(clientid, topic);
          }
        })
        .then(() => {
          this.loadSubs();
        })
        .catch(() => {});
    },
    async handleUnsubscriptionGateway(row) {
      const { clientid, topic } = row;

      let res = await unsubscribeGatewayClientSub(
        this.gateway,
        clientid,
        topic
      ).catch(() => {});
      if (res) {
        ElMessage({
          type: "success",
          message: this.$t("Base.createSuccess"),
        });
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tag {
  margin-left: 10px;

  & i {
    font-size: 14px;
    margin-right: 3px;
    vertical-align: -1px;
  }

  & i.suc {
    color: #00b299ff;
  }
  & i.fail {
    color: #e34242ff;
  }
}

.detail-item {
  margin-top: 10px;
  color: #1d1d1dff;

  & span:first-child {
    color: #8d96a2ff;
    display: inline-block;
    width: 40%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
  & span:last-child {
    display: inline-block;
    vertical-align: middle;
    width: 55%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.section-header::v-deep .el-loading-mask {
  margin-left: 0px;
}
</style>
