<template>
  <div class="iot-form">
    <el-form label-position="top">
      <div class="part-header">{{ tl("baseInfo") }}</div>
      <el-row>
        <el-col :span="14">
          <el-form-item :label="tl('ruleName')">
            <el-input v-model="ruleValue.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="tl('note')">
            <el-input
              type="textarea"
              v-model="ruleValue.description"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl("filterData") }}</div>
      <el-row>
        <el-col :span="14">
          <el-form-item label="FROM(Data Source)">
            <el-radio-group v-model="sqlFromType">
              <el-radio label="topic"></el-radio>
              <el-radio label="bridge"></el-radio>
              <el-radio label="event"></el-radio>
            </el-radio-group>
            <el-input
              v-if="sqlFromType === 'topic'"
              v-model="sqlPartValue.from"
            ></el-input>
            <el-select
              v-if="sqlFromType === 'bridge'"
              v-model="sqlPartValue.from"
            >
              <el-option
                v-for="item in ingressBridgeList"
                :key="item.id"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              v-if="sqlFromType === 'event'"
              v-model="sqlPartValue.from"
            >
              <el-option
                v-for="item in ruleEventsList"
                :key="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="SELECT(Data Transformation)">
            <el-input type="textarea" v-model="sqlPartValue.select"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="WHERE(Condition)">
            <el-input type="textarea" v-model="sqlPartValue.where"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-button size="small" @click="openTestDialog()">{{
            tl("testsql")
          }}</el-button>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl("output") }}</div>
      <el-row>
        <el-col :span="14">
          <template v-for="item in ruleValue.outputs" :key="item">
            <div class="outputs-item">
              <span
                ><img
                  :src="
                    require(`@/assets/img/${
                      item.function ? item.function : item.split(':')[0]
                    }.png`)
                  "
                  width="80"
              /></span>
              <span>
                <div v-if="!item.function">{{ item.split(":")[1] }}</div>
                <div class="output-desc">
                  {{
                    (item.function
                      ? item.function
                      : item.split(":")[0]
                    ).toUpperCase()
                  }}
                </div>
              </span>
              <span class="output-op">
                <el-button size="mini" @click="openOpDialog(true)">
                  {{ $t("Base.edit") }}</el-button
                >
                <el-button size="mini" type="danger">{{
                  $t("Base.delete")
                }}</el-button>
              </span>
            </div>
          </template>
          <div class="outputs-item add" @click="openOpDialog()">
            <span>{{ tl("addOutput") }}</span>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      :title="!opEdit ? tl('addOutput') : tl('editOutput')"
      v-model="opDialog"
    >
      <el-form label-position="top">
        <el-row>
          <el-col :span="14" v-loading="outputLoading">
            <el-form-item :label="tl('output')">
              <el-select v-model="outputForm.type">
                <el-option
                  v-for="bridge in bridgeList"
                  :key="bridge"
                  :value="bridge.id"
                  :label="bridge.id"
                ></el-option>
                <el-option value="console">{{ tl("consoleOutput") }}</el-option>
                <el-option value="republish">{{ tl("republish") }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <span
          class="edit-output"
          @click="toggleBridgeEdit()"
          v-if="
            outputForm.type !== 'republish' && outputForm.type !== 'console'
          "
        >
          <el-icon v-if="!isBridgeEdit"><caret-bottom></caret-bottom></el-icon>
          <el-icon v-else><caret-top></caret-top></el-icon>
          {{ tl("editOutput") }}</span
        > 
        <template
          v-if="
            isBridgeEdit &&
            outputForm.type !== 'republish' &&
            outputForm.type !== 'console'
          "
          ><div class="embedded-config">
            <bridge-http-config
              v-if="chosenBridge.type === 'http'"
            ></bridge-http-config>
            <bridge-mqtt-config
              v-if="chosenBridge.type === 'mqtt'"
            ></bridge-mqtt-config>
          </div>
        </template>-->
        <template v-if="outputForm.type === 'republish'">
          <div class="part-header">{{ tl("paramSetting") }}</div>
          <el-row>
            <el-col :span="14">
              <el-form-item label="Topic">
                <el-input v-model="outputForm.args.topic"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="QoS">
                <el-select v-model="outputForm.args.qos">
                  <el-option
                    v-for="item in [0, 1, 2]"
                    :value="item"
                    :key="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="Payload">
                <el-input
                  type="textarea"
                  v-model="outputForm.args.payload"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          size="small"
          @click="submitOutput(opEdit)"
          :loading="outputLoading"
          >{{ opEdit ? $t("Base.update") : $t("Base.add") }}</el-button
        >
        <el-button size="small" @click="cancelOpDialog()">{{
          $t("Base.cancel")
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, watch } from "vue";
// import BridgeHttpConfig from "../Bridge/BridgeHttpConfig.vue";
// import BridgeMqttConfig from "../Bridge/BridgeMqttConfig.vue";
// import { CaretBottom, CaretTop } from "@element-plus/icons";
import { getBridgeList, getRuleEvents } from "@/api/ruleengine";
import { BridgeItem, RuleItem } from "@/types/ruleengine";
import { useI18n } from "vue-i18n";
import _ from "lodash";

export default defineComponent({
  components: {
    // CaretTop,
    // CaretBottom,
    // BridgeHttpConfig,
    // BridgeMqttConfig,
  },
  name: "iot-form",
  props: {
    modelValue: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue"],
  setup(prop, context) {
    const { t } = useI18n();
    const opEdit = ref(false);
    const opDialog = ref(false);
    const testDialog = ref(false);
    const bridgeList = ref([]);
    const ingressBridgeList = ref([]);
    const ruleEventsList = ref([]);
    const outputLoading = ref(false);
    const chosenBridge = ref({});
    const sqlFromType = ref("topic");
    const isBridgeEdit = ref(false);

    const ruleValueDefault = {
      name: "",
      sql: "",
      outputs: [],
      description: "",
    };

    const ruleValue: Ref<RuleItem> = ref({
      ..._.cloneDeep(ruleValueDefault),
      ..._.cloneDeep(prop.modelValue),
    });

    const sqlPartValue = ref({
      from: "t/#",
      select: "*",
      where: "",
    });

    const outputForm = ref({
      type: "",
      args: {
        topic: "",
        qos: 0,
        payload: "",
      },
    });

    watch(
      () => sqlFromType.value,
      () => {
        sqlPartValue.value.from = "";
      }
    );

    watch(
      () => _.cloneDeep(ruleValue.value),
      (val) => {
        context.emit("update:modelValue", { ...val, sql: transformSQL() });
      }
    );

    watch(
      () => _.cloneDeep(sqlPartValue.value),
      (val) => {
        context.emit("update:modelValue", {
          ...ruleValue.value,
          sql: transformSQL(),
        });
      }
    );

    const transformSQL = () => {
      const tempSql = [
        "SELECT",
        sqlPartValue.value.select,
        "FROM",
        ['"', sqlPartValue.value.from, '"'].join(""),
      ];
      if (sqlPartValue.value.where)
        tempSql.push("WHERE", sqlPartValue.value.where);

      return tempSql.map((v) => String(v).trim()).join(" ");
    };

    const loadBridgeList = async () => {
      outputLoading.value = true;
      const res = await getBridgeList().catch(() => {});
      if (res) {
        bridgeList.value = res;
      }
      outputLoading.value = false;
    };

    const submitOutput = (edit = false) => {
      outputLoading.value = true;
      let opObj;
      switch (outputForm.value.type) {
        case "console":
          opObj = { function: "console" };
          break;
        case "republish":
          opObj = { function: "republish", args: { ...outputForm.value.args } };
          break;
        default:
          opObj = outputForm.value.type;
      }
      const output = ruleValue.value.outputs || [];
      if (!edit) {
        output.push(opObj);
      }

      outputLoading.value = false;
      opDialog.value = false;
    };

    const openOpDialog = (edit = false) => {
      opEdit.value = !!edit;
      opDialog.value = true;
      !bridgeList.value.length && loadBridgeList();
    };

    const cancelOpDialog = () => {
      opDialog.value = false;
    };

    const toggleBridgeEdit = () => {
      if (isBridgeEdit.value) {
        //todo
        chosenBridge.value =
          (outputForm.value.type &&
            bridgeList.value.find(
              (v: BridgeItem) => v.id === outputForm.value.type
            )) ||
          {};
      }
      isBridgeEdit.value = !isBridgeEdit.value;
    };

    const loadIngressBridgeList = async () => {
      await loadBridgeList();
      ingressBridgeList.value = bridgeList.value.filter(
        (v: BridgeItem) => v.direction == "ingress"
      );
    };

    const openTestDialog = () => {
      testDialog.value = true;
    };

    const loadRuleEvents = async () => {
      const res = await getRuleEvents().catch(() => {});
      if (res) {
        ruleEventsList.value = res.map((v: Record<string, unknown>) => {
          return v.event;
        });
      }
    };

    onMounted(() => {
      loadIngressBridgeList();
      loadRuleEvents();
      context.emit("update:modelValue", {
        ...ruleValue.value,
        sql: transformSQL(),
      });
    });

    return {
      tl: (key: string) => t("RuleEngine." + key),
      bridgeList,
      toggleBridgeEdit,
      loadIngressBridgeList,
      openOpDialog,
      outputForm,
      cancelOpDialog,
      sqlPartValue,
      submitOutput,
      chosenBridge,
      sqlFromType,
      openTestDialog,
      ruleValue,
      opEdit,
      opDialog,
      outputLoading,
      ruleEventsList,
      ingressBridgeList,
    };
  },
});
</script>

<style lang="scss" scoped>
.outputs-item {
  height: 92px;
  border: var(--el-border-base);
  margin-top: 10px;
  display: flex;
  align-items: center;

  span:nth-child(2) {
    flex-grow: 1;

    div {
      line-height: 200%;
    }

    .output-desc {
      color: #5b5b5b;
    }
  }

  .output-op {
    padding: 0 10px;
    visibility: hidden;
  }

  &.add {
    justify-content: center;
    // align-items: center;
  }
  &:first-of-type {
    margin-top: 20px;
  }
  &:hover {
    border-color: var(--el-color-primary);
    cursor: pointer;
    span {
      color: var(--el-color-primary);
      visibility: visible;
    }
  }
}

.edit-output {
  color: var(--el-color-primary);
  line-height: 50px;
  cursor: pointer;
}

.embedded-config {
  border: var(--el-border-base);
  padding: 30px;
}
</style>
