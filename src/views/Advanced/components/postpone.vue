<template>
  <div>
    <el-tabs>
      <el-tab-pane :label="tl('setting')" v-loading="configPending">
        <el-form
          ref="delayedForm"
          :rules="delayedRules"
          :model="delayedConfig"
          :disabled="!configEnable"
          label-position="top"
          @keyup.enter="updateDelayedConfig()"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item
                :label="tl('maxDelayedMsg')"
                prop="max_delayed_messages"
              >
                <el-input
                  v-model.number="delayedConfig.max_delayed_messages"
                  :readonly="delayedOption == 'unlimited'"
                >
                  <template #append>
                    <el-select v-model="delayedOption">
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
        </el-form>
        <el-row>
          <el-button
            size="small"
            type="primary"
            @click="updateDelayedConfig()"
            >{{ $t("Base.update") }}</el-button
          >
        </el-row>
        <div class="part-header">{{ tl("enable") }}</div>

        <el-row>
          <el-col :span="13">{{ tl("enableDescDelay") }}</el-col>
          <el-col :span="6">
            <el-switch
              v-model="delayedConfig.enable"
              @change="updateDelayedConfig()"
            ></el-switch>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :label="tl('dataManage')" v-loading="tbLoading">
        <el-table :data="delayedTbData">
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
          <el-table-column
            :label="tl('delayedTime')"
            prop="delayed_interval"
            sortable
          ></el-table-column>
          <el-table-column
            :label="tl('remainTime')"
            prop="delayed_remaining"
            sortable
          ></el-table-column>
          <el-table-column :label="tl('publishTime')" sortable>
            <template #default="{ row }">
              {{ row.publish_at && dateFormat(row.publish_at) }}
            </template>
          </el-table-column>

          <el-table-column :label="$t('Base.operation')">
            <template #default="{ row }">
              <el-button
                size="mini"
                type="danger"
                @click="deleteDelayedInfo(row)"
                >{{ $t("Base.delete") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="emq-table-footer">
          <common-pagination
            @loadPage="loadDelayedList"
            v-model:metaData="pageMeta"
          ></common-pagination>
        </div>
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
  getDelayedConfig,
  editDelayedConfig,
  getDelayedList,
  getDelayedInfo,
  delDelayedInfo,
} from "@/api/advanced";
import CommonPagination from "@/components/commonPagination.vue";
import { dateFormat } from "@/common/utils";

export default defineComponent({
  name: "Postpone",
  props: ["translate"],
  components: {
    CommonPagination,
  },
  setup(props) {
    let delayedConfig = reactive({
      enable: false,
      max_delayed_messages: 0,
    });
    let delayedTbData = ref([]);
    let configPending = ref(true);
    let tbLoading = ref(false);
    let configEnable = ref(false);
    let delayedOption = ref("custom");
    let delayedForm = ref(null);
    let delayedRules = {
      max_delayed_messages: [
        {
          required: true,
          message: props.translate("required"),
          trigger: "blur",
        },
        {
          type: "number",
          message: props.translate("needNumber"),
          trigger: "blur",
        },
      ],
    };
    let payloadDialog = ref(false);
    let payloadLoading = ref(false);
    let payloadDetail = ref("");
    let isCopyShow = ref(false);
    let pageMeta = ref({});

    watch(delayedOption, (newOption) => {
      if (newOption == "unlimited") {
        delayedConfig.max_delayed_messages = 0;
      }
    });

    const getDelayedOption = () => {
      if (delayedConfig?.max_delayed_messages == 0) {
        return "unlimited";
      } else {
        return "custom";
      }
    };
    const getConfigFormEnable = () => {
      if (delayedConfig?.enable === true) {
        configEnable.value = true;
      } else {
        configEnable.value = false;
      }
    };

    const loadDelayedConfig = async () => {
      configPending.value = true;
      delayedForm.value?.resetFields();

      let res = await getDelayedConfig().catch(() => {});
      if (res) {
        Object.assign(delayedConfig, res);
        getConfigFormEnable();
        delayedOption.value = getDelayedOption();
      }
      configPending.value = false;
    };

    const loadDelayedList = async (params = {}) => {
      tbLoading.value = true;
      let sendParams = {
        ...pageMeta,
        ...params,
      };
      Reflect.deleteProperty(sendParams, "count");
      let res = await getDelayedList(sendParams).catch(() => {});
      if (res) {
        delayedTbData.value = res.data;
        tbLoading.value = false;
        pageMeta.value = res.meta;
      } else {
        tbLoading.value = false;
        delayedTbData.value = [];
        pageMeta.value = {};
      }
    };

    const deleteDelayedInfo = async function (row) {
      this.$confirm(this.$t("General.confirmDelete"), {
        confirmButtonText: this.$t("Base.confirm"),
        cancelButtonText: this.$t("Base.cancel"),
        type: "warning",
      })
        .then(async () => {
          const { msgid } = row;
          if (!msgid) return;
          let res = await delDelayedInfo(msgid).catch(() => {});
          if (res) {
            // p.value.$emit("loadPage");
            loadDelayedList();
          } else {
            //todo
          }
        })
        .catch(() => {});
    };

    const checkPayload = async function (row) {
      payloadDialog.value = true;
      payloadLoading.value = true;
      payloadDetail.value = "";
      const { msgid } = row;
      let res = await getDelayedInfo(msgid).catch(() => {});
      if (res) {
        payloadDetail.value = res?.payload;
      } else {
        //todo
      }
      payloadLoading.value = false;
    };

    const updateDelayedConfig = async function () {
      let valid = await delayedForm.value?.validate().catch(() => {});
      if (!valid) return;
      configPending.value = true;
      let res = await editDelayedConfig(delayedConfig).catch(() => {});
      if (res) {
        getConfigFormEnable();
        this.$message({
          type: "success",
          message: this.$t("Base.updateSuccess"),
        });
      } else {
        loadDelayedConfig();
      }
      configPending.value = false;
    };

    const reloading = function () {
      loadDelayedConfig();
      loadDelayedList();
      // p.value.$emit("loadPage");
    };

    onMounted(reloading);

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
      tl: props.translate,
      delayedTbData,
      delayedConfig,
      updateDelayedConfig,
      configPending,
      deleteDelayedInfo,
      delayedOption,
      reloading,
      tbLoading,
      delayedForm,
      delayedRules,
      configEnable,
      loadDelayedList,
      checkPayload,
      payloadDialog,
      payloadLoading,
      payloadDetail,
      dateFormat,
      isCopyShow,
      copySuccess,
      pageMeta,
    };
  },
});
</script>
<style lang="scss" scoped>
.payload-copied {
  padding-right: 10px;
}
</style>
