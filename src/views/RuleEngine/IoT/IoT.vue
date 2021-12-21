<template>
  <div class="app-wrapper iot">
    <div class="section-header">
      <div>
        <el-button-group>
          <el-button
            size="small"
            :class="{ active: pageShow === pageType[0] }"
            @click="pageShow = pageType[0]"
            >{{ tl("listTable") }}</el-button
          >
          <el-button
            size="small"
            :class="{ active: pageShow === pageType[1] }"
            @click="pageShow = pageType[1]"
            >{{ tl("topology") }}</el-button
          >
        </el-button-group>
      </div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="$router.push({ name: 'iot-create' })"
          >{{ tl("createIoTRule") }}</el-button
        >
      </div>
    </div>
    <template v-if="pageShow === pageType[0]">
      <el-table :data="ruleTable" v-loading="iotLoading">
        <el-table-column :label="tl('name')" sortable>
          <template #default="{ row }">
            <router-link :to="{ name: 'iot-detail', params: { id: row.id } }">{{
              row.name
            }}</router-link>
          </template></el-table-column
        >
        <el-table-column label="Source" sortable>
          <template #default="{ row }">
            {{ row.from.join(",") }}
          </template>
        </el-table-column>
        <el-table-column label="Outputs" sortable :sort-method="sorting"
          ><template #default="{ row }">
            {{ row.outputs.length }}
          </template>
        </el-table-column>
        <el-table-column :label="tl('status')" sortable>
          <template #default="{ row }">
            {{ row.enable ? $t("Base.enable") : $t("Base.disable") }}
          </template>
        </el-table-column>
        <el-table-column :label="tl('createdAt')" sortable>
          <template #default="{ row }">
            {{
              row.created_at &&
              moment(row.created_at).format("YYYY-MM-DD HH:mm:ss")
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Base.operation')" min-width="100">
          <template #default="{ row }">
            <el-button
              size="mini"
              @click="
                $router.push({ name: 'iot-detail', params: { id: row.id } })
              "
              >{{ $t("Base.setting") }}</el-button
            >
            <el-button size="mini" @click="startOrStopRule(row)">{{
              row.enable ? $t("Base.disable") : $t("Base.enable")
            }}</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="submitDeleteRules(row.id)"
              >{{ $t("Base.delete") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-else-if="pageShow === pageType[1]">
      <rule-topology></rule-topology>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { getRules, updateRules, deleteRules } from "@/api/ruleengine";
import moment from "moment";
import { Rule, RuleItem } from "@/types/ruleengine";
import { ElMessageBox as MB, ElMessage as M } from "element-plus";
import RuleTopology from "../components/RuleTopology.vue";

export default defineComponent({
  components: { RuleTopology },
  setup() {
    const { t } = useI18n();
    const pageType = ["list", "topology"];
    const pageShow = ref(pageType[0]);
    const ruleTable = ref([]);
    const iotLoading = ref(false);

    watch(
      () => pageShow.value,
      (v) => {
        if (v === pageType[0]) {
          getRulesList();
        }
      }
    );

    const getRulesList = async () => {
      iotLoading.value = true;
      let res = await getRules().catch(() => {});
      if (res) {
        ruleTable.value = res;
      }
      iotLoading.value = false;
    };

    const startOrStopRule = async (row: Rule) => {
      iotLoading.value = true;
      const res = await updateRules(row.id, {
        enable: !row.enable,
      }).catch(() => {});
      if (res) {
        M({
          type: "success",
          message: !row.enable
            ? t("Base.disabledSuccess")
            : t("Base.enableSuccess"),
        });
        getRulesList();
      }
      iotLoading.value = false;
    };

    const submitDeleteRules = async (id: string) => {
      if (!id) return;
      MB.confirm(t("General.confirmDelete"), {
        confirmButtonText: t("Base.confirm"),
        cancelButtonText: t("Base.cancel"),
        type: "warning",
      })
        .then(async () => {
          iotLoading.value = true;

          const res = await deleteRules(id).catch(() => {});
          if (res) {
            M({
              type: "success",
              message: t("Base.deleteSuccess"),
            });
            iotLoading.value = false;

            getRulesList();
          }
        })
        .catch(() => {});
    };

    const sorting = (a: any, b: any) => {
      console.log(a, b);
    };

    onMounted(() => {
      getRulesList();
    });

    return {
      tl: (key: string) => t("RuleEngine." + key),
      pageShow,
      pageType,
      ruleTable,
      moment,
      startOrStopRule,
      iotLoading,
      submitDeleteRules,
      sorting,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-button-group {
  .el-button {
    &.el-button--default {
      border-color: var(--el-button-border-color);
      min-width: 90px;

      &.active {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
        z-index: 1;
      }

      &:hover {
        color: unset;
      }
    }
  }
}
</style>
