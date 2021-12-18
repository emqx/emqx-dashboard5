<template>
  <div class="app-wrapper data-bridge">
    <router-view v-slot="{ Component }">
      <component :is="Component" v-if="Component"></component>
      <template v-else>
        <div class="section-header">
          <div></div>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="$router.push({ name: 'bridge-create' })"
            >{{ tl("createBridge") }}</el-button
          >
        </div>

        <el-table :data="bridgeTb" v-loading="tbLoading">
          <el-table-column
            :label="'Bridge ID'"
            sortable
            prop="id"
          ></el-table-column>
          <el-table-column
            :label="'Direction'"
            sortable
            prop="direction"
          ></el-table-column>
          <el-table-column
            :label="tl('SuccessNum')"
            sortable
            prop="metrics.success"
          ></el-table-column>
          <el-table-column
            :label="tl('ErrNum')"
            sortable
            prop="metrics.failed"
          ></el-table-column>
          <el-table-column
            :label="tl('speedNow')"
            sortable
            prop="metrics.rate"
          ></el-table-column>
          <el-table-column
            :label="tl('status')"
            sortable
            prop="status"
          ></el-table-column>
          <el-table-column :label="$t('Base.operation')">
            <template #default="{ row }">
              <el-button
                size="mini"
                @click="
                  $router.push({
                    name: 'bridge-detail',
                    params: { id: row.id },
                  })
                "
                >{{ $t("Base.setting") }}</el-button
              >
              <el-button size="mini" @click="enableOrDisableBridge(row)">{{
                row.status === "connected"
                  ? $t("Base.disable")
                  : $t("Base.enable")
              }}</el-button>
              <el-button size="mini" type="danger">{{
                $t("Base.delete")
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { getBridgeList, updateBridge, startStopBridge } from "@/api/ruleengine";
import { useI18n } from "vue-i18n";
import { BridgeItem } from "@/types/ruleengine";
import _ from "lodash";
import { ElMessageBox as MB, ElMessage as M } from "element-plus";

export default defineComponent({
  setup() {
    let bridgeTb = ref([]);
    let tbLoading = ref(false);
    let { t } = useI18n();

    const listBridge = async function () {
      tbLoading.value = true;
      let res = await getBridgeList().catch(() => {});
      if (res) {
        bridgeTb.value = res;
      }
      tbLoading.value = false;
    };

    const enableOrDisableBridge = async (row: BridgeItem) => {
      tbLoading.value = true;
      if (row.status === "connected") {
        let res = await startStopBridge(row.id, "stop").catch(() => {});
        if (res) {
          M({
            type: "success",
            message: t("Base.enableSuccess"),
          });
          listBridge();
        }
      } else {
        let res = await startStopBridge(row.id, "start").catch(() => {});
        if (res) {
          M({
            type: "success",
            message: t("Base.disabledSuccess"),
          });
          listBridge();
        }
      }
      tbLoading.value = false;
    };

    onMounted(listBridge);

    return {
      tl: (key: string) => t("RuleEngine." + key),
      bridgeTb,
      tbLoading,
      enableOrDisableBridge,
    };
  },
});
</script>

<style lang="scss" scoped></style>
