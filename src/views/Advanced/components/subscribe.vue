<template>
  <div class="no-tab-wrapper">
    <div class="section-header">
      <div>{{ tl("internalExp") }}</div>
      <el-button size="small" type="primary" @click="openOpDialog()">{{
        $t("Base.add")
      }}</el-button>
    </div>

    <el-table :data="subTbData" v-loading="tbLoading">
      <el-table-column :label="'Topic'" prop="topic" sortable></el-table-column>
      <el-table-column :label="'QoS'" prop="qos" sortable></el-table-column>
      <el-table-column :label="'nl/rap/rh'" sortable>
        <template #default="{ row }">
          {{ `${row.nl}/${row.rap}/${row.rh}` }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="mini" @click="openOpDialog(true, row)">{{
            $t("Base.edit")
          }}</el-button>
          <el-button size="mini" type="danger" @click="deleteSubs(row)">{{
            $t("Base.delete")
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="opSubs"
      :title="
        (isEdit ? $t('Base.edit') : $t('Base.add')) + ' ' + tl('subscribe')
      "
    >
      <el-form
        :rules="subsRules"
        :model="subsInput"
        ref="subsForm"
        label-position="top"
        @keyup.enter="submitSubs(isEdit)"
      >
        <el-form-item :label="'Topic'" prop="topic">
          <el-input v-model="subsInput.topic"></el-input>
        </el-form-item>
        <el-form-item :label="'QoS'">
          <el-select v-model="subsInput.qos">
            <el-option
              v-for="item in subsOptions.qos"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="nl">
              <el-select v-model="subsInput.nl">
                <el-option
                  v-for="item in subsOptions.nl"
                  :key="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="rap">
              <el-select v-model="subsInput.rap">
                <el-option
                  v-for="item in subsOptions.rap"
                  :key="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="rh">
              <el-select v-model="subsInput.rh">
                <el-option
                  v-for="item in subsOptions.rh"
                  :key="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button
          size="small"
          type="primary"
          @click="submitSubs(isEdit)"
          :loading="submitLoading"
          >{{ isEdit ? $t("Base.update") : $t("Base.add") }}</el-button
        >
        <el-button size="small" @click="opSubs = false">{{
          $t("Base.cancel")
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import { getSubscribe, editSubscribe } from "@/api/advanced";
import { ElMessageBox as MB, ElMessage } from "element-plus";

export default defineComponent({
  name: "Subscribe",
  props: ["translate"],

  setup(props) {
    let isEdit = ref(false);
    let opSubs = ref(false);
    let subTbData = ref([]);
    let subsOptions = reactive({
      // op: ["nl", "rap", "rh"],
      qos: [0, 1, 2],
      nl: [0, 1],
      rap: [0, 1],
      rh: [0, 1, 2],
    });
    let subsInput = reactive({
      topic: "",
      qos: 0,
      nl: 0,
      rap: 0,
      rh: 0,
    });
    let editPos = ref(undefined);
    let submitLoading = ref(false);
    let tbLoading = ref(false);
    let subsForm = ref(null);
    let subsRules = {
      topic: [
        {
          required: true,
          message: props.translate("required"),
          trigger: ["blur"],
        },
      ],
    };

    let openOpDialog = (edit = false, origin) => {
      opSubs.value = true;
      isEdit.value = !!edit;
      subsForm.value?.resetFields();

      // subsInput.topic = edit && origin.topic ? origin.topic : subsInput.topic;
      // subsInput.qos = edit && origin.qos ? origin.qos : subsInput.qos;
      // subsInput.nl=edit&&origin.nl?origin.nl:subsInput
      subsInput = (edit && { ...subsInput, ...origin }) || subsInput;

      // subsInput.op =
      //   (edit &&
      //     (() => {
      //       let opArr = [];
      //       origin.nl === 1 && opArr.push("nl");
      //       origin.rap === 1 && opArr.push("rap");
      //       origin.rh === 1 && opArr.push("rh");
      //       return opArr;
      //     })()) ||
      //   [];

      edit && (editPos.value = subTbData.value.findIndex((e) => e === origin));
    };

    const submitSubs = async function (edit = false) {
      let valid = await subsForm.value?.validate().catch(() => {});
      if (!valid) return;

      // let tempOpStore = {};
      let pendingTbData = Object.assign([], subTbData.value);

      // Array.prototype.forEach.call(subsOptions.op, (v) => {
      //   tempOpStore[v] = subsInput.op.indexOf(v) >= 0 ? 1 : 0;
      // });
      // let subjectSubData = {
      //   topic: subsInput.topic,
      //   qos: subsInput.qos,
      //   ...tempOpStore,
      // };

      if (!edit) {
        pendingTbData.push(subsInput);
      } else {
        if (editPos.value === undefined) {
          return;
        }
        pendingTbData.splice(editPos.value, 1, subsInput);
      }
      submitLoading.value = true;

      let res = await editSubscribe(pendingTbData).catch(() => {});
      if (res) {
        ElMessage({
          type: "success",
          message: edit
            ? this.$t("Base.editSuccess")
            : this.$t("Base.createSuccess"),
        });
        subTbData.value = pendingTbData;
        opSubs.value = false;
        editPos.value = undefined;
      } else {
        ElMessage({
          type: "error",
          message: this.$t("Base.opErr"),
        });
      }
      submitLoading.value = false;
    };

    const deleteSubs = async function (origin) {
      MB.confirm(this.$t("General.confirmDelete"), {
        confirmButtonText: this.$t("Base.confirm"),
        cancelButtonText: this.$t("Base.cancel"),
        type: "warning",
      })
        .then(async () => {
          let pendingTbData = Object.assign([], subTbData.value);
          const position = pendingTbData.findIndex((e) => e === origin);
          pendingTbData.splice(position, 1);
          let res = await editSubscribe(pendingTbData).catch(() => {});
          if (res) {
            ElMessage({
              type: "success",
              message: this.$t("Base.deleteSuccess"),
            });
            subTbData.value = pendingTbData;
          } else {
            ElMessage({
              type: "error",
              message: this.$t("Base.opErr"),
            });
          }
        })
        .catch(() => {});
    };

    let loadData = async () => {
      tbLoading.value = true;
      let res = await getSubscribe().catch(() => {});
      if (res) {
        subTbData.value = res;
      }
      tbLoading.value = false;
    };
    onMounted(loadData);

    const reloading = () => {
      loadData();
    };

    return {
      tl: props.translate,
      isEdit,
      opSubs,
      openOpDialog,
      subsOptions,
      subTbData,
      subsInput,
      submitSubs,
      deleteSubs,
      submitLoading,
      reloading,
      tbLoading,
      subsForm,
      subsRules,
    };
  },
});
</script>
<style lang="scss" scoped>
.el-form:not(:first-child) {
  margin-top: 50px;
}
</style>
