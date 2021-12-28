<template>
  <div>
    <div class="section-header" v-if="!showIntegration">
      <div></div>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="openDialog()"
      >
        {{ tl("addListener") }}
      </el-button>
    </div>
    <el-table :data="listenerTable" v-loading="listenerLoading">
      <el-table-column :label="'ID'" sortable prop="id"></el-table-column>
      <el-table-column
        :label="tl('lType')"
        sortable
        prop="type"
      ></el-table-column>
      <el-table-column
        :label="tl('lAddress')"
        sortable
        prop="bind"
      ></el-table-column>
      <el-table-column
        label="Acceptors"
        sortable
        prop="acceptors"
      ></el-table-column>
      <el-table-column
        :label="tl('lMaxConn')"
        sortable
        prop="max_connections"
      ></el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row, $index }">
          <el-button size="mini" @click="openDialog(true, row, $index)">{{
            $t("Base.edit")
          }}</el-button>
          <el-button size="mini" type="danger" @click="delListener(row)">{{
            $t("Base.delete")
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="not-standalone-btn" v-if="showIntegration">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="openDialog()"
      >
        {{ tl("addListener") }}
      </el-button>
    </div>

    <el-dialog :title="tl('addListener')" v-model="opListener">
      <div class="part-header">{{ tl("basic") }}</div>
      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="tl('name')">
              <el-input
                v-model="listenerInput.name"
                :disabled="editListener"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('lType')">
              <el-select v-model="listenerInput.type" :disabled="editListener">
                <template v-if="listenerTypeList[name]">
                  <el-option
                    v-for="item in listenerTypeList[name]"
                    :key="item"
                    :value="item"
                  ></el-option>
                </template>
                <template v-else>
                  <el-option
                    v-for="item in listenerTypeList.others"
                    :key="item"
                    :value="item"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('lAddress')">
              <el-input v-model="listenerInput.bind"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('mountPoint')">
              <el-input v-model="listenerInput.mountpoint"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="part-header">{{ tl("listenerSetting") }}</div>
        <el-row :gutter="20">
          <el-col :span="12" v-if="listenerInput.type !== 'udp'">
            <el-form-item :label="'Acceptors'">
              <el-input v-model="listenerInput.acceptors"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('maxConn')">
              <el-input v-model="listenerInput.max_connections"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('maxConnRate')">
              <el-input v-model="listenerInput.max_conn_rate"></el-input>
            </el-form-item>
          </el-col>
          <template
            v-if="listenerInput.type === 'tcp' || listenerInput.type === 'ssl'"
          >
            <el-col :span="12">
              <el-form-item :label="'Proxy Protocol'">
                <el-select v-model="listenerInput.proxy_protocol">
                  <el-option :value="true"></el-option>
                  <el-option :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Proxy Protocol Timeout'">
                <el-input
                  v-model.number="listenerInput.proxy_protocol_timeout[0]"
                  :placeholder="String(baseInput.proxy_protocol_timeout[0])"
                >
                  <template #append>
                    <el-select
                      v-model="listenerInput.proxy_protocol_timeout[1]"
                    >
                      <el-option value="s"></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </template>
        </el-row>

        <template
          v-if="listenerInput.type === 'tcp' || listenerInput.type === 'ssl'"
        >
          <div class="part-header">
            {{ "TCP " + tl("configSetting") }}
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="'ActiveN'">
                <el-input
                  v-model="listenerInput.tcp.active_n"
                  :placeholder="String(baseInput.tcp.active_n)"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Buffer'">
                <el-input
                  v-model.number="listenerInput.tcp.buffer[0]"
                  :placeholder="String(baseInput.tcp.buffer[0])"
                >
                  <template #append>
                    <el-select v-model="listenerInput.tcp.buffer[1]">
                      <el-option value="KB"></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'TCP_NODELAY'">
                <el-select v-model="listenerInput.tcp.nodelay">
                  <el-option :value="true"></el-option>
                  <el-option :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'SO_REUSEADDR'">
                <el-select v-model="listenerInput.tcp.reuseaddr">
                  <el-option :value="true"></el-option>
                  <el-option :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="tl('sendTimeout')">
                <el-input
                  v-model.number="listenerInput.tcp.send_timeout[0]"
                  :placeholder="String(baseInput.tcp.send_timeout[0])"
                >
                  <template #append>
                    <el-select v-model="listenerInput.tcp.send_timeout[1]">
                      <el-option value="s"></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="tl('sendTimeoutClose')">
                <el-select v-model="listenerInput.tcp.send_timeout_close">
                  <el-option :value="true"></el-option>
                  <el-option :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template
          v-else-if="
            listenerInput.type === 'udp' || listenerInput.type === 'dtls'
          "
        >
          <div class="part-header">
            {{ "UDP " + tl("configSetting") }}
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="'ActiveN'">
                <el-input
                  v-model="listenerInput.udp.active_n"
                  :placeholder="String(baseInput.udp.active_n)"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Buffer'">
                <el-input
                  v-model.number="listenerInput.udp.buffer[0]"
                  :placeholder="String(baseInput.udp.buffer[0])"
                >
                  <template #append>
                    <el-select v-model="listenerInput.udp.buffer[1]">
                      <el-option value="KB"></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="tl('recBuf')">
                <el-input
                  v-model.number="listenerInput.udp.recbuf[0]"
                  :placeholder="String(baseInput.udp.recbuf[0])"
                >
                  <template #append>
                    <el-select v-model="listenerInput.udp.recbuf[1]">
                      <el-option value="KB"></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="tl('sendBuf')">
                <el-input
                  v-model.number="listenerInput.udp.sndbuf[0]"
                  :placeholder="String(baseInput.udp.sndbuf[0])"
                >
                  <template #append>
                    <el-select v-model="listenerInput.udp.sndbuf[1]">
                      <el-option value="KB"></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'SO_REUSEADDR'">
                <el-select v-model="listenerInput.udp.reuseaddr">
                  <el-option :value="true"></el-option>
                  <el-option :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template
          v-if="listenerInput.type === 'ssl' || listenerInput.type === 'dtls'"
        >
          <div class="part-header">
            {{ listenerInput.type.toUpperCase() + " " + tl("configSetting") }}
          </div>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item :label="'Cert'">
                <el-input
                  type="textarea"
                  rows="3"
                  :placeholder="baseInput.certSpecial.certfile"
                  v-model="listenerInput[listenerInput.type].certfile"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="'CA Cert'">
                <el-input
                  type="textarea"
                  rows="3"
                  :placeholder="baseInput.certSpecial.cacertfile"
                  v-model="listenerInput[listenerInput.type].cacertfile"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="'Key'">
                <el-input
                  type="textarea"
                  rows="3"
                  :placeholder="baseInput.certSpecial.keyfile"
                  v-model="listenerInput[listenerInput.type].keyfile"
                ></el-input>
              </el-form-item>
            </el-col>
            <template v-if="listenerInput.type === 'ssl'">
              <el-col :span="12">
                <el-form-item :label="tl('sslversion')">
                  <el-select v-model="listenerInput.ssl.versions">
                    <el-option
                      value="tlsv1.3,tlsv1.2,tlsv1.1,tlsv1"
                    ></el-option>
                    <el-option value="tlsv1.2,tlsv1.1,tlsv1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <template v-else-if="listenerInput.type === 'dtls'">
              <el-col :span="12">
                <el-form-item :label="tl('dtlsversion')">
                  <el-select v-model="listenerInput.dtls.versions">
                    <el-option value="dtlsv1.2,dtlsv1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="12">
              <el-form-item :label="'Verify'">
                <el-select v-model="listenerInput.xtls.verify">
                  <el-option value="verify_none"></el-option>
                  <el-option value="verify_peer"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Fail If No Peer Cert'">
                <el-select v-model="listenerInput.xtls.fail_if_no_peer_cert">
                  <el-option :value="true"></el-option>
                  <el-option :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Server Name Indacation'">
                <el-input
                  v-model="listenerInput.xtls.server_name_indication"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Intermediate Certificate Depth'">
                <el-input v-model="listenerInput.xtls.depth"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'Key Password'">
                <el-input v-model="listenerInput.xtls.password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          size="small"
          @click="submitListener(editListener)"
          :loading="submitLoading"
          >{{ editListener ? $t("Base.update") : $t("Base.add") }}</el-button
        >
        <el-button size="small" @click="opListener = false">{{
          $t("Base.cancel")
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import {
  getGatewayListeners,
  updateGatewayListener,
  addGatewayListener,
  deleteGatewayListener,
} from "@/api/gateway";
import _ from "lodash";
import {
  transformUnitArrayToStr,
  transformStrToUnitArray,
} from "@/common/utils";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage as M, ElMessageBox as MB } from "element-plus";

export default defineComponent({
  props: {
    integration: {
      type: Boolean,
      required: false,
      default: false,
    },
    gatewayName: {
      type: String,
      required: false,
      default: "",
    },
    list: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  emits: ["list"],
  setup(props, context) {
    const route = useRoute();
    const { t } = useI18n();
    const gName = (route.params.name || props.gatewayName).toLowerCase();
    const listenerTypeList = {
      coap: ["udp", "dtls"],
      others: ["tcp", "ssl", "udp", "dtls"],
    };
    let baseInput = {
      type: (listenerTypeList[gName] || listenerTypeList.others)[0],
      id: "",
      name: "",
      bind: "",
      acceptors: 16,
      max_connections: 102400,
      max_conn_rate: 1000,
      mountpoint: "",
      proxy_protocol: false,
      proxy_protocol_timeout: [15, "s"],
      tcp: {
        nodelay: false,
        reuseaddr: true,
        send_timeout_close: true,
        active_n: 100,
        buffer: [4, "KB"],
        send_timeout: [15, "s"],
      },
      udp: {
        active_n: 100,
        buffer: [4, "KB"],
        recbuf: [2, "KB"],
        sndbuf: [2, "KB"],
        reuseaddr: true,
      },
      dtls: {
        versions: "dtls1.2,dtlsv1",
      },
      ssl: {
        versions: "tlsv1.3,tlsv1.2,tlsv1.1,tlsv1",
      },
      xtls: {
        cacertfile: "",
        certfile: "",
        keyfile: "",
        verify: "verify_none",
        fail_if_no_peer_cert: false,
        server_name_indication: "disable",
        depth: 10,
        password: "",
      },
      certSpecial: {
        cacertfile: "Begins with ----BEGIN CERTIFICATE----",
        certfile: "Begins with ----BEGIN CERTIFICATE----",
        keyfile: "Begins with ----BEGIN PRIVATE KEY----",
      },
    };
    let opListener = ref(false);
    let editListener = ref(false);
    let listenerInput = ref(_.cloneDeep(baseInput));
    let listenerTable = ref([]);
    let listenerLoading = ref(false);
    let submitLoading = ref(false);

    const ID_SEPERATE = ":";
    let editPos = 0;

    const openDialog = (edit = false, current = {}, index = 0) => {
      opListener.value = true;
      editListener.value = !!edit;
      if (edit) {
        // let name = current.name || current?.id?.split(ID_SEPERATE)[2]
        // listenerInput.value = {
        //   ..._.cloneDeep(baseInput),
        //   ..._.cloneDeep(current),
        // };
        listenerInput.value = _.merge(baseInput, current);
        editPos = index;
      } else {
        listenerInput.value = _.cloneDeep(baseInput);
      }
    };

    const loadListenerData = async function () {
      listenerLoading.value = true;
      let res = await getGatewayListeners(gName).catch(() => {});
      if (res) {
        listenerTable.value = res.map((v) => denormalizeStructure(v));
      }
      listenerLoading.value = false;
    };

    const submitListener = async function (edit = false) {
      // let id = [gName, listenerInput.value.type, listenerInput.value.name].join(ID_SEPERATE)

      let input = { ..._.cloneDeep(listenerInput.value) };
      if (listenerInput.value.type === "udp") input.acceptors = "";
      if (props.integration) {
        if (edit) {
          listenerTable.value.splice(editPos, 1, input);
        } else {
          listenerTable.value.push(input);
        }
        opListener.value = false;
      } else {
        let remoteRes = await submitGatewayListenerInfo(
          edit,
          gName,
          input
        ).catch(() => {});
        if (remoteRes) {
          opListener.value = false;
          loadListenerData();
        }
      }
    };

    const submitGatewayListenerInfo = async function (
      edit = false,
      name,
      formData
    ) {
      submitLoading.value = true;
      let data = normalizeStructure(formData);
      if (edit) {
        let res = await updateGatewayListener(name, data.id, data).catch(
          () => {}
        );
        if (res) {
          M({
            type: "success",
            message: t("Base.editSuccess"),
          });
          submitLoading.value = false;
          return true;
        } else {
          submitLoading.value = false;
          return Promise.reject();
        }
      } else {
        let res = await addGatewayListener(name, data).catch(() => {});
        if (res) {
          M({
            type: "success",
            message: t("Base.createSuccess"),
          });
          submitLoading.value = false;

          return true;
        } else {
          submitLoading.value = false;
          return Promise.reject();
        }
      }
    };

    const delListener = async function (row) {
      MB.confirm(t("Base.confirmDelete"), {
        confirmButtonText: t("Base.confirm"),
        cancelButtonText: t("Base.cancel"),
        type: "warning",
      }).then(async () => {
        if (props.integration) {
          listenerTable.value.splice(listenerTable.value.indexOf(row), 1);
        } else {
          let res = await deleteGatewayListener(gName, row.id).catch(() => {});
          if (res) {
            M({
              type: "success",
              message: t("Base.deleteSuccess"),
            });
            loadListenerData();
          }
        }
      });
    };

    function normalizeStructure(record) {
      const { type = "tcp" } = record;
      let result = {};

      Object.keys(record).forEach((v) => {
        switch (v) {
          case "proxy_protocol_timeout":
          case "proxy_protocol":
            if (type === "tcp" || type === "ssl") {
              result[v] = record[v];
            }
            break;
          case "acceptors":
            if (type !== "udp") {
              result[v] = record[v];
            }
            break;

          default:
            if (typeof record[v] !== "object" || record[v] === null) {
              result[v] = record[v];
            }
        }
      });

      if (record[type]) {
        result[type] = { ...record[type] };
      }
      if (type === "ssl" && record.tcp) {
        result.tcp = { ...record.tcp };
        Object.assign(result[type], record.xtls);
      } else if (type === "dtls" && record.udp) {
        result.udp = { ...record.udp };
        Object.assign(result[type], record.xtls);
      }

      return transformUnitArrayToStr(result);
    }

    function denormalizeStructure(record) {
      const { type = "tcp" } = record;

      const expandKey = [
        "tcp.buffer",
        "tcp.send_timeout",
        "proxy_protocol_timeout",
        "udp.buffer",
        "udp.recbuf",
        "udp.sndbuf",
      ];

      let result = transformStrToUnitArray(_.cloneDeep(record), expandKey);

      if (type === "ssl" || type === "dtls") {
        result.xtls = { ...record[type] };
        result.certSpecial = { ...baseInput.certSpecial };
        Object.keys(result.xtls).forEach((v) => {
          if (v in baseInput.xtls) {
            delete result[type][v];
          } else {
            delete result.xtls[v];
          }
        });
      }

      if (!record.name) {
        result.name = record?.id?.split(ID_SEPERATE)[2] || "";
      }
      if (!record.id) {
        result.id = [gName, record.type, record.name].join(ID_SEPERATE);
      }

      return result;
    }

    watch(
      () => _.cloneDeep(listenerTable.value),
      (v) => {
        if (props.integration) {
          context.emit(
            "update:list",
            v.map((v) => normalizeStructure(v))
          );
        }
      }
    );

    onMounted(() => {
      if (props.integration) {
        listenerTable.value = props.list.map((v) => denormalizeStructure(v));
      } else {
        loadListenerData();
      }
    });

    return {
      tl: (key, collection = "Gateway") => t(collection + "." + key),
      showIntegration: props.integration,
      openDialog,
      opListener,
      listenerTable,
      submitListener,
      listenerInput,
      baseInput,
      editListener,
      delListener,
      listenerLoading,
      submitLoading,
      listenerTypeList,
      name: gName,
    };
  },
});
</script>

<style lang="scss" scoped>
.not-standalone-btn {
  margin-top: 40px;
  margin-bottom: 20px;
}

.el-input-group--append ::v-deep .el-input-group__append {
  width: 70px;
}
</style>
