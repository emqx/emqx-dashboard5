<template>
  <div>
    <el-tabs>
      <el-tab-pane :label="tl('setting')" v-loading="configLoading">
        <div class="part-header">{{ tl("storage") }}</div>
        <el-form
          :disabled="!configEnable"
          ref="retainerForm"
          :rules="retainerRules"
          :model="retainerConfig"
          label-position="top"
          @keyup.enter="updateConfigData()"
        >
          <el-row :gutter="30">
            <el-col :span="16">
              <el-form-item :label="tl('storageType')">
                <el-select v-model="retainerConfig.config.type">
                  <el-option
                    value="built_in_database"
                    :label="tl('builtInDatabase')"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="16">
              <el-form-item :label="tl('storage')">
                <el-select v-model="retainerConfig.config.storage_type">
                  <el-option value="ram"></el-option>
                  <el-option value="disc"></el-option>
                  <el-option value="disc_only"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="part-header">{{ tl("policy") }}</div>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item
                label="Max Retained Messages"
                prop="config.max_retained_messages"
              >
                <el-input
                  v-model.number="retainerConfig.config.max_retained_messages"
                  :readonly="selOptions.retained == 'unlimited'"
                >
                  <template #append>
                    <el-select v-model="selOptions.retained">
                      <el-option
                        value="unlimited"
                        :label="tl('unlimited')"
                      ></el-option>
                      <el-option
                        value="custom"
                        :label="tl('custom')"
                      ></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Max Payload Size" prop="max_payload_size[0]">
                <el-input v-model.number="retainerConfig.max_payload_size[0]">
                  <template #append>
                    <el-select v-model="selOptions.payload">
                      <el-option value="KB" label="KB"></el-option>
                      <el-option value="MB" label="MB"></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item :label="tl('expire')" prop="msg_expiry_interval[0]">
                <el-input
                  v-model.number="retainerConfig.msg_expiry_interval[0]"
                  :readonly="selOptions.expiry == '0s'"
                >
                  <template #append>
                    <el-select v-model="selOptions.expiry">
                      <el-option value="0s" :label="tl('noExp')"></el-option>
                      <el-option value="s" :label="tl('sec')"></el-option>
                      <el-option value="m" :label="tl('min')"></el-option>
                      <el-option value="h" :label="tl('hour')"></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="tl('intervalClean')"
                prop="msg_clear_interval[0]"
              >
                <el-input
                  v-model.number="retainerConfig.msg_clear_interval[0]"
                  :readonly="selOptions.clean == '0s'"
                >
                  <template #append>
                    <el-select v-model="selOptions.clean">
                      <el-option value="0s" :label="tl('disable')"></el-option>
                      <el-option value="s" :label="tl('sec')"></el-option>
                      <el-option value="m" :label="tl('min')"></el-option>
                      <el-option value="h" :label="tl('hour')"></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="part-header">{{ tl("flowControl") }}</div>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item
                :label="tl('readNumber')"
                prop="flow_control.max_read_number"
              >
                <el-input
                  v-model.number="retainerConfig.flow_control.max_read_number"
                  :readonly="selOptions.read == 'unlimited'"
                >
                  <template #append>
                    <el-select v-model="selOptions.read">
                      <el-option
                        value="unlimited"
                        :label="tl('unlimited')"
                      ></el-option>
                      <el-option
                        value="custom"
                        :label="tl('custom')"
                      ></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="tl('deliverQuota')"
                prop="flow_control.msg_deliver_quota"
              >
                <el-input
                  v-model.number="retainerConfig.flow_control.msg_deliver_quota"
                  :readonly="selOptions.deliver == 'unlimited'"
                >
                  <template #append>
                    <el-select v-model="selOptions.deliver">
                      <el-option
                        value="unlimited"
                        :label="tl('unlimited')"
                      ></el-option>
                      <el-option
                        value="custom"
                        :label="tl('custom')"
                      ></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item
                :label="tl('releaseInterval')"
                prop="flow_control.quota_release_interval[0]"
              >
                <el-input
                  v-model.number="
                    retainerConfig.flow_control.quota_release_interval[0]
                  "
                >
                  <template #append>
                    <el-select v-model="selOptions.release">
                      <el-option value="s" :label="tl('sec')"></el-option>
                      <el-option value="m" :label="tl('min')"></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-button
              size="small"
              type="primary"
              @click="updateConfigData()"
              >{{ $t("Base.update") }}</el-button
            >
          </el-row>
        </el-form>
        <div class="part-header">{{ tl("enable") }}</div>
        <el-row>
          <el-col :span="13">{{ tl("enableDesc") }}</el-col>
          <el-col :span="6">
            <el-switch
              v-model="retainerConfig.enable"
              @change="updateConfigData()"
            ></el-switch>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :label="tl('dataManage')">
        <el-table :data="tbData" v-loading="tbLoading">
          <el-table-column
            :label="'Topic'"
            prop="topic"
            sortable
          ></el-table-column>
          <el-table-column :label="'QoS'" prop="qos" sortable></el-table-column>
          <el-table-column :label="'Payload'">
            <template #default="{ row }">
              <el-button size="mini" @click="checkPayload(row)">{{
                tl("openPayload")
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            :label="'From ClientID'"
            prop="from_clientid"
            sortable
          ></el-table-column>
          <el-table-column :label="tl('createDate')" sortable>
            <template #default="{ row }">
              {{ row.publish_at && dateFormat(row.publish_at) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('Base.operation')">
            <template #default="{ row }">
              <el-button
                size="mini"
                type="danger"
                @click="deleteRetainerTopic(row)"
                >{{ $t("Base.delete") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="payloadDialog" :title="'Payload'">
      <el-row v-loading="payloadLoading">
        <el-input
          type="textarea"
          :rows="10"
          resize="none"
          placeholder="Payload"
          v-model="payloadDetail"
          readonly
        ></el-input>
      </el-row>
      <template #footer>
        <span v-if="isCopyShow" class="payload-copied">{{
          $t("Base.copied")
        }}</span>
        <el-button size="small">{{ $t("Base.copy") }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import {
  getRetainer,
  getRetainerList,
  updateRetainer,
  getRetainerTopic,
  delRetainerTopic,
} from "@/api/advanced";
import { dateFormat } from "@/common/utils";
import { ElMessageBox as MB, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "Retainer",
  setup() {
    const { t } = useI18n();
    const tl = function (key, collection = "Advanced") {
      return t(collection + "." + key);
    };

    let retainerConfig = reactive({
      max_payload_size: [1, "MB"],
      msg_clear_interval: [0, "s"],
      msg_expiry_interval: [0, "s"],
      config: {
        storage: "ram",
        type: "built_in_database",
        max_retained_messages: 0,
      },
      flow_control: {
        max_read_number: 0,
        msg_deliver_quota: 0,
        quota_release_interval: [0, "s"],
      },
      enable: false,
    });

    let selOptions = reactive({
      retained: "custom",
      payload: "KB",
      expiry: "s",
      clean: "s",
      read: "custom",
      deliver: "custom",
      release: "s",
    });

    let configLoading = ref(true);
    let configEnable = ref(false);
    let tbLoading = ref(true);
    let tbData = ref([]);
    let payloadDialog = ref(false);
    let payloadDetail = ref("");
    let payloadLoading = ref(false);
    let retainerForm = ref(null);
    let isCopyShow = ref(false);

    let validatorRules = [
      { required: true, message: tl("required"), trigger: "blur" },
      {
        type: "number",
        message: tl("needNumber"),
        trigger: "blur",
      },
    ];

    const retainerRules = ref({
      config: {
        max_retained_messages: validatorRules,
      },
      max_payload_size: {
        0: validatorRules,
      },
      msg_expiry_interval: {
        0: validatorRules,
      },
      msg_clear_interval: {
        0: validatorRules,
      },
      flow_control: {
        max_read_number: validatorRules,
        msg_deliver_quota: validatorRules,
        quota_release_interval: {
          0: validatorRules,
        },
      },
    });

    watch(
      () => ({ ...selOptions }),
      (newV, oldV) => {
        if (newV.retained == "unlimited") {
          retainerConfig.config.max_retained_messages = 0;
        }
        if (newV.read == "unlimited") {
          retainerConfig.flow_control.max_read_number = 0;
        }
        if (newV.deliver == "unlimited") {
          retainerConfig.flow_control.msg_deliver_quota = 0;
        }

        if (newV.expiry == "0s") {
          retainerConfig.msg_expiry_interval = [0, "s"];
        } else {
          retainerConfig.msg_expiry_interval[1] = newV.expiry;
        }
        if (newV.clean == "0s") {
          retainerConfig.msg_clear_interval = [0, "s"];
        } else {
          retainerConfig.msg_clear_interval[1] = newV.clean;
        }

        if (newV.payload != oldV.payload) {
          retainerConfig.max_payload_size[1] = newV.payload;
        }
        if (newV.release != oldV.release) {
          retainerConfig.flow_control.quota_release_interval[1] = newV.release;
        }
      }
    );

    const loadConfigData = async () => {
      configLoading.value = true;
      configEnable.value = true;
      retainerForm.value?.resetFields();
      let res = await getRetainer().catch(() => {});
      if (res) {
        Object.assign(retainerConfig, res);
        getConfigFormEnable();
        derivedOptionsFromConfig();
      } else {
        //todo
      }
      configLoading.value = false;
    };

    const getConfigFormEnable = () => {
      if (retainerConfig?.enable === true) {
        configEnable.value = true;
      } else {
        configEnable.value = false;
      }
    };

    const derivedOptionsFromConfig = () => {
      let config = retainerConfig;
      if (config?.config?.max_retained_messages === 0) {
        selOptions.retained = "unlimited";
      } else {
        selOptions.retained = "custom";
      }
      if (config?.max_payload_size) {
        let matching = config.max_payload_size.match(/(\d+)(\w{2,})/);
        selOptions.payload = matching[2];
        config.max_payload_size = [+matching[1], matching[2]];
      }
      if (config?.msg_expiry_interval) {
        let matching = config.msg_expiry_interval.match(/(\d+)(\w)/);
        selOptions.expiry =
          matching[1] === "0" ? config.msg_expiry_interval : matching[2];
        config.msg_expiry_interval = [+matching[1], matching[2]];
      }
      if (config?.msg_clear_interval) {
        let matching = config.msg_clear_interval.match(/(\d+)(\w)/);
        selOptions.clean =
          matching[1] === "0" ? config.msg_clear_interval : matching[2];
        config.msg_clear_interval = [+matching[1], matching[2]];
      }
      if (config?.flow_control?.max_read_number === 0) {
        selOptions.read = "unlimited";
      } else {
        selOptions.read = "custom";
      }
      if (config?.flow_control?.msg_deliver_quota === 0) {
        selOptions.deliver = "unlimited";
      } else {
        selOptions.deliver = "custom";
      }
      if (config?.flow_control?.quota_release_interval) {
        let matching =
          config.flow_control.quota_release_interval.match(/(\d+)(\w)/);
        selOptions.release = matching[2];
        config.flow_control.quota_release_interval = [
          +matching[1],
          matching[2],
        ];
      }
    };

    // const changeSelType1 = async (event, e) => {
    //   console.log(event)
    // }

    // const dateFormat = (date) => {
    //   return moment(date).format('YYYY-MM-DD HH:mm:ss')
    // }

    const composeConfigFromForm = (config) => {
      combineData(config);
      function combineData(data) {
        if (typeof data == "object" && data !== null) {
          Object.keys(data).forEach((k) => {
            if (data[k] instanceof Array) {
              data[k] = data[k].join("");
            } else if (typeof data[k] == "object" && data[k] !== null) {
              combineData(data[k]);
              return;
            }
          });
        }
      }
    };

    const updateConfigData = async function () {
      let valid = await retainerForm.value.validate().catch(() => {});
      if (!valid) return;

      configLoading.value = true;
      composeConfigFromForm(retainerConfig);

      let res = await updateRetainer(retainerConfig).catch(() => {});
      if (res) {
        getConfigFormEnable();
        ElMessage({
          type: "success",
          message: t("Base.updateSuccess"),
        });
        derivedOptionsFromConfig();
      } else {
        loadConfigData();
      }
      configLoading.value = false;
    };

    const deleteRetainerTopic = async function (row) {
      MB.confirm(t("General.confirmDelete"), {
        confirmButtonText: t("Base.confirm"),
        cancelButtonText: t("Base.cancel"),
        type: "warning",
      })
        .then(async () => {
          const { topic } = row;
          if (!topic) return;
          let res = await delRetainerTopic(topic).catch(() => {});
          if (res) {
            loadTbData();
          } else {
            //todo
          }
        })
        .catch(() => {});
    };

    const loadTbData = async () => {
      tbLoading.value = true;
      let res = await getRetainerList().catch(() => {});
      if (res) {
        tbData.value = res;
      }
      tbLoading.value = false;
    };

    const checkPayload = async (row) => {
      payloadDialog.value = true;
      payloadDetail.value = "";
      payloadLoading.value = true;
      const { topic } = row;
      if (!topic) return;
      let res = await getRetainerTopic(topic).catch(() => {});
      if (res) {
        payloadDetail.value = res[0].payload;
      }
      payloadLoading.value = false;
    };

    onMounted(() => {
      loadConfigData();
      loadTbData();
    });

    const reloading = () => {
      loadConfigData();
      loadTbData();
    };

    let copyShowTimeout = ref(null);
    const copySuccess = () => {
      isCopyShow.value = true;
      clearTimeout(copyShowTimeout.value);
      copyShowTimeout.value = setTimeout(() => {
        isCopyShow.value = false;
      }, 2000);
    };

    onUnmounted(() => {
      copyShowTimeout.value && clearTimeout(copyShowTimeout.value);
    });

    return {
      tl,
      retainerConfig,
      configLoading,
      tbLoading,
      tbData,
      updateConfigData,
      selOptions,
      configEnable,
      deleteRetainerTopic,
      reloading,
      payloadDialog,
      checkPayload,
      payloadDetail,
      payloadLoading,
      retainerRules,
      retainerForm,
      dateFormat,
      copySuccess,
      isCopyShow,
    };
  },
});
</script>
<style lang="scss" scoped>
.payload-copied {
  padding-right: 10px;
}
</style>
