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
      <div class="part-header">
        {{ tl("filterData")
        }}<el-button
          size="mini"
          class="part-btn"
          @click="briefEditType = !briefEditType"
          >{{ tl("changeSqlMethod") }}</el-button
        >
      </div>
      <template v-if="briefEditType">
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
                  :key="item.event"
                  :value="item.event"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="SELECT(Data Transformation)">
              <el-input
                type="textarea"
                v-model="sqlPartValue.select"
              ></el-input>
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
      </template>
      <template v-else>
        <el-row>
          <el-col :span="16">
            <el-form-item :label="'SQL'">
              <el-input type="textarea" rows="10" v-model="ruleValue.sql">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <div class="part-header">{{ tl("output") }}</div>
      <el-row>
        <el-col :span="14">
          <template v-for="(item, index) in ruleValue.outputs" :key="item">
            <div class="outputs-item">
              <span
                ><img
                  :src="
                    getOutputImage(
                      item.function ? item.function : item.split(':')[0]
                    )
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
                <el-button size="mini" @click="openOpDialog(true, index)">
                  {{ $t("Base.edit") }}</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteOutput(index)"
                  >{{ $t("Base.delete") }}</el-button
                >
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
                  :disabled="
                    outputDisableList.includes(bridge.id) &&
                    bridge.id !== ruleValue.outputs[editIndex]
                  "
                ></el-option>
                <el-option
                  value="console"
                  :disabled="
                    outputDisableList.includes('console') &&
                    'console' !== ruleValue.outputs[editIndex]
                  "
                  >{{ tl("consoleOutput") }}</el-option
                >
                <el-option
                  value="republish"
                  :disabled="
                    outputDisableList.includes('republish') &&
                    'republish' !== ruleValue.outputs[editIndex]
                  "
                  >{{ tl("republish") }}</el-option
                >
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

    <el-dialog :title="tl('testsql')" v-model="testDialog" width="80%">
      <el-form label-position="top">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item :label="tl('messages')">
              <el-input
                type="textarea"
                rows="5"
                v-model="testParams.msg"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Metadata'">
              <key-and-value-editor
                v-model="testParams.metadata"
              ></key-and-value-editor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item :label="'SQL'">
              <el-input
                type="textarea"
                rows="5"
                v-model="testParams.sql"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Output'">
              <el-input
                type="textarea"
                rows="5"
                v-model="testParams.output"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          size="small"
          :loading="testLoading"
          @click="submitTest()"
          >{{ $t("Base.test") }}</el-button
        >
        <el-button size="small" @click="cancelTestDialog()">{{
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
import { getBridgeList, getRuleEvents, testsql } from "@/api/ruleengine";
import { BridgeItem, RuleItem } from "@/types/ruleengine";
import { useI18n } from "vue-i18n";
import _ from "lodash";
import { ElMessageBox as MB, ElMessage as M } from "element-plus";
import parser from "js-sql-parser";

import KeyAndValueEditor from "@/components/KeyAndValueEditor.vue";
import { text } from "d3-fetch";
type OutputForm = {
  type: string;
  args?: Record<string, unknown>;
};
type OutputItem =
  | string
  | {
      function?: string;
      args?: {
        topic: string;
        payload: string;
        qos: 0 | 1 | 2;
      };
    };

type RuleEvent = {
  test_columns: {
    payload: string;
    qos: number;
  };
  event: string;
  columns: Array<string>;
};

export default defineComponent({
  components: {
    KeyAndValueEditor,
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
    const testLoading = ref(false);
    const outputDisableList: Ref<Array<string>> = ref([]);
    const editIndex: Ref<number | undefined> = ref(undefined);
    const chosenEvent: Ref<RuleEvent> = ref({} as RuleEvent);
    const briefEditType = ref(true);

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

    const outputFormDefault: OutputForm = {
      type: "",
      args: {
        topic: "",
        qos: 0,
        payload: "",
      },
    };

    const outputForm = ref(outputFormDefault);

    const testParams = ref({
      msg: "",
      metadata: {},
      sql: "",
      output: "",
    });

    watch(
      () => sqlFromType.value,
      () => {
        sqlPartValue.value.from = "";
      }
    );

    watch(
      () => [_.cloneDeep(ruleValue.value), _.cloneDeep(sqlPartValue.value)],
      (val) => {
        syncData();
      }
    );

    const syncData = () => {
      const sql = transformSQL();
      context.emit("update:modelValue", { ...ruleValue.value, sql });
      testParams.value.sql = sql;
      ruleValue.value.sql = transformSQL();
      parseStrSQL();
    };

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

    const parseStrSQL = () => {
      // console.log(ruleValue.value.sql);
      // const ast = parser.parse(ruleValue.value.sql);
      // console.log(ast);
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
          opObj = { function: outputForm.value.type };
          break;
        case "republish":
          opObj = {
            function: outputForm.value.type,
            args: { ...outputForm.value.args },
          };
          break;
        default:
          opObj = outputForm.value.type;
      }

      const output = ruleValue.value.outputs || [];
      if (!edit) {
        output.push(opObj);
      } else {
        //
        editIndex.value !== undefined &&
          output.splice(editIndex.value, 1, opObj);
      }
      // outputDisableList.value = outputDisableList.value
      //   .concat([outputForm.value.type])
      //   .filter((v, k, a) => a.indexOf(v) === k);
      calcDisableList();
      outputLoading.value = false;
      opDialog.value = false;
    };

    const calcDisableList = () => {
      outputDisableList.value = [];
      ruleValue.value.outputs?.forEach((v: OutputItem) => {
        if (typeof v === "string") {
          outputDisableList.value.push(v);
        } else if (typeof v === "object") {
          v.function && outputDisableList.value.push(v.function);
        }
      });
    };

    const openOpDialog: (edit: boolean, itemIndex: number | undefined) => void =
      (edit = false, itemIndex) => {
        opEdit.value = !!edit;
        opDialog.value = true;
        outputForm.value = _.cloneDeep(outputFormDefault);
        let item: OutputItem | undefined;
        editIndex.value = itemIndex;
        if (itemIndex !== undefined) {
          item = ruleValue.value.outputs?.[itemIndex];
        }

        if (edit) {
          if (typeof item === "string") {
            outputForm.value.type = item;
          } else if (typeof item === "object") {
            outputForm.value.type = item.function || "";
            if (item.function === "republish") {
              outputForm.value.args = item.args;
            }
          }
        }
        !bridgeList.value.length && loadBridgeList();
      };

    const deleteOutput = (itemIndex: number | undefined) => {
      MB.confirm(t("Base.confirmDelete"), {
        confirmButtonText: t("Base.confirm"),
        cancelButtonText: t("Base.cancel"),
        type: "warning",
      })
        .then(() => {
          if (itemIndex !== undefined) {
            ruleValue.value.outputs?.splice(itemIndex, 1);

            calcDisableList();
          }
        })
        .catch(() => {});
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
      syncData();

      testParams.value.output = "";

      function findProperEvent(event: string) {
        const properEvent = ruleEventsList.value.find(
          (v: { event: string }) => v.event === event
        );
        return properEvent;
      }

      function setDataWithEvent(properEvent: RuleEvent) {
        chosenEvent.value = properEvent;
        testParams.value.msg = chosenEvent.value?.test_columns?.payload;
        testParams.value.metadata = chosenEvent.value?.test_columns;
        Reflect.deleteProperty(testParams.value.metadata, "payload");
      }

      if (sqlFromType.value === "event") {
        const eventData = findProperEvent(sqlPartValue.value.from);
        eventData && setDataWithEvent(eventData);
      } else if (sqlFromType.value === "topic") {
        const eventData = findProperEvent(sqlPartValue.value.from);
        if (eventData) {
          setDataWithEvent(eventData);
          return;
        }
        const modifiedEvent = findProperEvent("$events/message_publish");
        modifiedEvent && setDataWithEvent(modifiedEvent);
      } else if (sqlFromType.value === "bridge") {
        const modifiedEvent = findProperEvent("$events/message_publish");
        modifiedEvent && setDataWithEvent(modifiedEvent);
      }
    };

    const submitTest = async () => {
      testLoading.value = true;
      const eventType = chosenEvent.value?.event || "";
      const context = {
        ...testParams.value.metadata,
        payload: testParams.value.msg,
        event_type: eventType.match(/(\$events\/)([\w]+)/)?.[2],
      };

      const res = await testsql({
        context,
        sql: testParams.value.sql,
      }).catch((e) => {
        testParams.value.output = e;
      });

      if (res) {
        try {
          const text = JSON.stringify(res);
          testParams.value.output = text;
        } catch (e) {
          console.log(e);
          testParams.value.output = res;
        }
      }
      testLoading.value = false;
    };

    const cancelTestDialog = () => {
      testDialog.value = false;
    };

    const loadRuleEvents = async () => {
      const res = await getRuleEvents().catch(() => {});
      if (res) {
        ruleEventsList.value = res;
      }
    };

    const getOutputImage = (item: string) => {
      try {
        return require(`@/assets/img/${item}.png`);
      } catch (e) {
        //May it be a user defined module,
        //that would have no valid overview png file existing in the path
        console.log("ImgErr:", e);
      }
    };

    onMounted(() => {
      loadIngressBridgeList();
      loadRuleEvents();
      syncData();
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
      outputDisableList,
      chosenBridge,
      sqlFromType,
      openTestDialog,
      testDialog,
      ruleValue,
      opEdit,
      opDialog,
      outputLoading,
      ruleEventsList,
      ingressBridgeList,
      cancelTestDialog,
      testParams,
      testLoading,
      deleteOutput,
      editIndex,
      submitTest,
      getOutputImage,
      briefEditType,
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
  padding: 10px;
  box-sizing: border-box;

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
.part-btn {
  margin-left: 15px;
}
</style>
