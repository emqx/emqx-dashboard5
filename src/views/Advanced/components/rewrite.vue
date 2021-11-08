<template>
  <div class="no-tab-wrapper">
    <div class="section-header">
      <div></div>
      <el-button size="small" type="primary" @click="openOpDialog()">{{
        $t("Base.add")
      }}</el-button>
    </div>

    <el-table :data="rewriteTbData" v-loading="tbDataLoading">
      <el-table-column
        :label="'Action'"
        prop="action"
        sortable
      ></el-table-column>
      <el-table-column
        :label="tl('sTopic')"
        prop="source_topic"
        sortable
      ></el-table-column>
      <el-table-column :label="'Re'" prop="re" sortable></el-table-column>
      <el-table-column
        :label="tl('dTopic')"
        prop="dest_topic"
        sortable
      ></el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="mini" @click="openOpDialog(true, row)">{{
            $t("Base.edit")
          }}</el-button>
          <el-button size="mini" type="danger" @click="deleteRewrite(row)">{{
            $t("Base.delete")
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="opRewrite"
      :title="(isEdit ? $t('Base.edit') : $t('Base.add')) + ' ' + tl('rewrite')"
    >
      <el-form
        ref="rewriteForm"
        :model="rewriteInput"
        :rules="rewriteRules"
        label-position="top"
      >
        <el-form-item :label="'Action'" prop="action">
          <el-select v-model="rewriteInput.action">
            <el-option
              v-for="item in actionOptions"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="tl('sTopic')" prop="source_topic">
          <el-input v-model="rewriteInput.source_topic"></el-input>
        </el-form-item>
        <el-form-item :label="'Re'" prop="re">
          <el-input v-model="rewriteInput.re"></el-input>
        </el-form-item>
        <el-form-item :label="tl('dTopic')" prop="dest_topic">
          <el-input v-model="rewriteInput.dest_topic"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          size="small"
          type="primary"
          @click="submitRewrite(isEdit)"
          :loading="submitLoading"
          >{{ isEdit ? $t("Base.update") : $t("Base.add") }}</el-button
        >
        <el-button size="small" @click="opRewrite = false">{{
          $t("Base.cancel")
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import { getTopicRewrite, editTopicRewrite } from "@/api/advanced";
// import i18n from '@/i18n'

export default defineComponent({
  name: "Rewrite",
  props: ["translate"],
  setup(props) {
    let opRewrite = ref(false);
    let rewriteTbData = ref([]);
    let isEdit = ref(false);
    let actionOptions = ref(["all", "publish", "subscribe"]);
    let rewriteInput = reactive({
      action: "",
      source_topic: "",
      re: "",
      dest_topic: "",
    });
    let editPos = ref(undefined);
    let submitLoading = ref(false);
    let tbDataLoading = ref(true);
    let rewriteForm = ref(null);

    let validatorRules = [
      {
        required: true,
        message: props.translate("required"),
        trigger: ["blur", "change"],
      },
    ];
    let rewriteRules = {
      action: validatorRules,
      source_topic: validatorRules,
      re: validatorRules,
      dest_topic: validatorRules,
    };

    const openOpDialog = (edit = false, originData) => {
      opRewrite.value = true;
      rewriteForm.value?.resetFields();
      isEdit.value = !!edit;
      Object.keys(rewriteInput).forEach((k) => {
        rewriteInput[k] = edit && originData[k] ? originData[k] : "";
      });
      edit &&
        (editPos.value = rewriteTbData.value.findIndex(
          (e) => e === originData
        ));
    };

    const submitRewrite = async function (edit = false) {
      let valid = await rewriteForm.value?.validate().catch(() => {});
      if (!valid) return;

      let pendingTbData = [...rewriteTbData.value];

      if (!edit) {
        pendingTbData.push({ ...rewriteInput });
      } else {
        if (editPos.value === undefined) {
          return;
        }
        pendingTbData.splice(editPos.value, 1, { ...rewriteInput });
      }

      submitLoading.value = true;
      let res = await editTopicRewrite(pendingTbData).catch(() => {});
      if (res) {
        this.$message({
          type: "success",
          message: edit
            ? this.$t("Base.editSuccess")
            : this.$t("Base.createSuccess"),
        });
        loadData();
      } else {
        this.$message({
          type: "error",
          message: this.$t("Base.opErr"),
        });
      }
      submitLoading.value = false;
      opRewrite.value = false;
      editPos.value = undefined;
    };

    const deleteRewrite = async function (row) {
      this.$confirm(this.$t("General.confirmDelete"), {
        confirmButtonText: this.$t("Base.confirm"),
        cancelButtonText: this.$t("Base.cancel"),
        type: "warning",
      })
        .then(async () => {
          let pendingTbData = [...rewriteTbData.value];
          const pos = pendingTbData.findIndex((e) => e === row);
          pendingTbData.splice(pos, 1);
          let res = await editTopicRewrite(pendingTbData).catch(() => {});
          if (res) {
            this.$message({
              type: "success",
              message: this.$t("Base.deleteSuccess"),
            });
            rewriteTbData.value = pendingTbData;
          } else {
            this.$message({
              type: "error",
              message: this.$t("Base.opErr"),
            });
          }
        })
        .catch(() => {});
    };

    const loadData = async () => {
      tbDataLoading.value = true;
      let res = await getTopicRewrite().catch(() => {});
      if (res) {
        rewriteTbData.value = res;
      }
      tbDataLoading.value = false;
    };
    onMounted(loadData);

    const reloading = () => {
      loadData();
    };
    return {
      tl: props.translate,
      isEdit,
      opRewrite,
      rewriteTbData,
      actionOptions,
      rewriteInput,
      openOpDialog,
      submitRewrite,
      deleteRewrite,
      submitLoading,
      tbDataLoading,
      reloading,
      rewriteForm,
      rewriteRules,
    };
  },
});
</script>
<style lang="scss" scoped></style>
