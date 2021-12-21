<template>
  <div>
    <el-form label-position="top">
      <div class="part-header">{{ tl("baseInfo") }}</div>
      <el-row :gutter="30">
        <el-col :span="14">
          <el-form-item :label="tl('name')">
            <el-input v-model="mqttBridgeVal.name" :disabled="edit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-loading="connectorLoading" :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mqttConn')">
            <el-select
              @change="checkForNewConnector"
              v-model="mqttBridgeVal.connector"
            >
              <el-option
                v-for="item in connectorList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
              <el-option value="_new" :label="tl('newMqttConn')"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="edit-icon-blk">
          <el-icon
            :class="[
              'edit-icon',
              mqttBridgeVal.connector === '_new' || !mqttBridgeVal.connector
                ? 'disabled'
                : '',
            ]"
            :size="20"
            @click="openConnectorDialog(true)"
            ><edit
          /></el-icon>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl("mappingInfo") }}</div>

      <el-row :gutter="30">
        <el-col :span="14">
          <el-form-item label="Direction">
            <el-select v-model="mqttBridgeVal.direction">
              <el-option
                v-for="dr in ['egress', 'ingress']"
                :key="dr"
                :value="dr"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="mqttBridgeVal.direction === 'ingress'">
        <el-row :gutter="30">
          <el-col :span="10">
            <el-form-item label="Remote Topic">
              <el-input v-model="mqttBridgeVal.remote_topic"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="QoS">
              <el-select v-model="mqttBridgeVal.remote_qos">
                <el-option
                  v-for="qos in [0, 1, 2]"
                  :key="qos"
                  :value="qos"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="10">
            <el-form-item label="Local Topic">
              <el-input v-model="mqttBridgeVal.local_topic"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="QoS">
              <el-select v-model="mqttBridgeVal.local_qos">
                <el-option
                  v-for="qos in [0, 1, 2]"
                  :key="qos"
                  :value="qos"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-checkbox
              :label="'Retain'"
              border
              v-model="mqttBridgeVal.retain"
            ></el-checkbox>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Payload">
              <el-input
                type="textarea"
                rows="10"
                v-model="mqttBridgeVal.payload"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <el-row :gutter="30">
          <el-col :span="10">
            <el-form-item label="Local Topic">
              <el-input v-model="mqttBridgeVal.local_topic"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="10">
            <el-form-item label="Remote Topic">
              <el-input v-model="mqttBridgeVal.remote_topic"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="QoS">
              <el-select v-model="mqttBridgeVal.remote_qos">
                <el-option
                  v-for="qos in [0, 1, 2]"
                  :key="qos"
                  :value="qos"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-checkbox
              :label="'Retain'"
              border
              v-model="mqttBridgeVal.retain"
            ></el-checkbox>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Payload">
              <el-input
                type="textarea"
                rows="10"
                v-model="mqttBridgeVal.payload"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <connector-dialog
      v-model:open="openDialog"
      :edit="isEditDialog"
      v-if="openDialog"
      @finish="finishConnectorDialog"
      v-model="chosenConnectorData"
    ></connector-dialog>
  </div>
</template>

<script lang="ts">
import { useI18n } from "vue-i18n";
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { Edit } from "@element-plus/icons";
import _ from "lodash";
import { getConnectorList } from "@/api/ruleengine";
import { ConnectorItem } from "@/types/ruleengine";

import ConnectorDialog from "../components/ConnectorDialog.vue";

export default defineComponent({
  name: "",
  components: { Edit, ConnectorDialog },
  props: {
    modelValue: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  setup(prop, context) {
    const { t } = useI18n();
    const openDialog = ref(false);
    const isEditDialog = ref(false);
    const mqttBridgeDefaultVal = {
      name: "",
      connector: "",
      direction: "egress",
      retain: false,
      payload: "",
      local_topic: "",
      remote_topic: "",
      remote_qos: 1,
      local_qos: 1,
    };

    const mqttBridgeVal = reactive({
      ..._.cloneDeep(mqttBridgeDefaultVal),
      ..._.cloneDeep(prop.modelValue),
    });
    const connectorList = ref([]);
    const connectorLoading = ref(false);
    const chosenConnectorData = ref({});

    const loadConnectorList = async () => {
      connectorLoading.value = true;
      const res = await getConnectorList().catch(() => {});
      if (res) {
        connectorList.value = res;
      } else {
        //todo
      }
      connectorLoading.value = false;
    };
    const checkForNewConnector = (val: unknown, val2: unknown) => {
      // console.log(val, val2);
      if (val === "_new") {
        openConnectorDialog(false);
      } else {
        return;
      }
    };
    const openConnectorDialog = (isEdit: boolean) => {
      if (isEdit && !mqttBridgeVal.connector) {
        return;
      }
      isEditDialog.value = isEdit;
      openDialog.value = true;
      chosenConnectorData.value =
        (isEdit &&
          connectorList.value.find(
            (v: ConnectorItem) => v.id === mqttBridgeVal.connector
          )) ||
        {};
    };

    const finishConnectorDialog = async (
      success: boolean,
      data: Record<string, unknown>
    ) => {
      if (success) {
        await loadConnectorList().catch(() => {});
      }

      if (!isEditDialog.value) {
        if (!success) {
          mqttBridgeVal.connector = "";
        } else {
          mqttBridgeVal.connector = (data.id as string) || "";
        }
      } else {
        //todo
      }
    };

    watch(
      () => _.cloneDeep(mqttBridgeVal),
      (val) => {
        context.emit("update:modelValue", transformData(val));
      }
    );
    onMounted(() => {
      loadConnectorList();
      context.emit("update:modelValue", transformData(mqttBridgeVal));
    });

    const transformData = (val: Record<string, unknown>) => {
      let data = {
        ..._.cloneDeep(val),
      };
      if (val.direction === "egress") {
        Reflect.deleteProperty(data, "local_qos");
      }
      return data;
    };

    return {
      tl: (key: string) => t("RuleEngine." + key),
      checkForNewConnector,
      openDialog,
      isEditDialog,
      openConnectorDialog,
      mqttBridgeVal,
      connectorLoading,
      connectorList,
      finishConnectorDialog,
      chosenConnectorData,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-checkbox {
  margin-top: 40px;
}
.edit-icon {
  padding: 9px;
  margin-top: 40px;
  border: var(--el-border-base);
  border-radius: var(--el-border-radius-base);

  &:hover {
    border-color: var(--el-color-primary);
    cursor: pointer;
  }

  &.disabled,
  &.disabled:hover {
    border-color: var(--el-border-color-light);
    color: var(--el-border-color-light);
    cursor: default;
  }
}
.edit-icon-blk {
  display: flex;
  align-items: center;
}
</style>
