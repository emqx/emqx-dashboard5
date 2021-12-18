<template>
  <div>
    <el-dialog
      :title="edit ? tl('editConn') : tl('newConn')"
      v-model="visible"
      @close="$emit('finish', false)"
    >
      <connector-mqtt-config
        v-model="connectorData"
        v-model:tls="connectorTLS"
        :edit="edit"
      ></connector-mqtt-config>
      <template #footer>
        <el-button
          type="primary"
          size="small"
          :loading="submitLoading"
          @click="submitConnector(edit)"
          >{{ edit ? $t("Base.update") : $t("Base.add") }}</el-button
        >
        <el-button size="small" @click="closeDialog()">{{
          $t("Base.cancel")
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  ref,
  Ref,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import ConnectorMqttConfig from "../Connector/ConnectorMqttConfig.vue";
// import { tlsConfig } from "@/types/ruleengine";
import { createConnector, updateConnector } from "@/api/ruleengine";
import _ from "lodash";
// import { Connector } from "@/types/ruleengine";
import { ElMessageBox as MB, ElMessage as M } from "element-plus";

export default defineComponent({
  components: { ConnectorMqttConfig },
  name: "ConnectorDialog",
  emits: ["update:open", "finish"],
  props: {
    edit: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    open: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    modelValue: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    connType: {
      type: String,
      required: false,
      default: () => "mqtt",
    },
  },
  setup(props, context) {
    const tlsParamsDefault = {
      enable: false,
      verify: "verify_none",
      certfile: "",
      keyfile: "",
      cacertfile: "",
    };

    const { t } = useI18n();
    const connectorData = ref(
      props.edit
        ? {
            ..._.cloneDeep(props.modelValue),
            name: props.modelValue.id?.split(":")[1],
          }
        : {}
    );
    const connectorTLS = ref(
      props.edit && props.modelValue.ssl
        ? _.cloneDeep(props.modelValue.ssl)
        : _.cloneDeep(tlsParamsDefault)
    );
    const submitLoading = ref(false);

    const visible = computed({
      get() {
        return props.open;
      },
      set(value) {
        context.emit("update:open", value);
      },
    });

    const submitConnector = async (isEdit) => {
      let res;
      submitLoading.value = true;
      const data = {
        ...connectorData.value,
        ssl: { ...connectorTLS.value },
        type: props.connType,
      };
      if (isEdit) {
        const id = connectorData.value.id;
        Reflect.deleteProperty(data, "name");
        Reflect.deleteProperty(data, "id");
        Reflect.deleteProperty(data, "type");
        Reflect.deleteProperty(data, "num_of_bridges");
        res = await updateConnector(id, data).catch(() => {});
      } else {
        res = await createConnector(data).catch(() => {});
      }
      if (res) {
        visible.value = false;
        context.emit("finish", true, res);
        if (!isEdit) {
          M({ type: "success", message: t("Base.createSuccess") });
        } else {
          M({ type: "success", message: t("Base.updateSuccess") });
        }
      }
      submitLoading.value = false;
    };

    const closeDialog = () => {
      visible.value = false;
      context.emit("finish", false);
    };

    // watch(
    //   () => [_.cloneDeep(connectorData.value), _.cloneDeep(connectorTLS.value)],
    //   (val) => {
    //     if (props.edit) {
    //       context.emit("update:modelValue", {
    //         ...val[0],
    //         tls: { ...val[1] },
    //       });
    //     }
    //   }
    // );

    return {
      tl: (key) => t("RuleEngine." + key),
      visible,
      connectorData,
      connectorTLS,
      submitLoading,
      submitConnector,
      closeDialog,
    };
  },
});
</script>
<style lang="scss" scoped></style>
