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
          <el-table-column :label="$t('Base.operation')" min-width="120">
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
              <el-button
                size="mini"
                type="danger"
                @click="submitDeleteBridge(row.id)"
                >{{ $t("Base.delete") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  getBridgeList,
  updateBridge,
  startStopBridge,
  deleteBridge,
} from "@/api/ruleengine";
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
      const statusToSend = row.status === "connected" ? "stop" : "start";
      const sucMessage = row.status === "connected" ? "Base.disabledSuccess" : "Base.enableSuccess";
      let res = await startStopBridge(row.id, statusToSend).catch(() => {});
      if (res) {
        M({
          type: "success",
          message: t(sucMessage),
        });
        listBridge();
      }
      tbLoading.value = false;
    };

    const submitDeleteBridge = async (id: string) => {
      MB.confirm(t("Base.confirmDelete"), {
        confirmButtonText: t("Base.confirm"),
        cancelButtonText: t("Base.cancel"),
        type: "warning",
      })
        .then(async () => {
          tbLoading.value = true;

          const res = await deleteBridge(id).catch(() => {});
          if (res) {
            M({
              type: "success",
              message: t("Base.deleteSuccess"),
            });
            listBridge();
            tbLoading.value = false;
          }
        })
        .catch(() => {});
    };

    onMounted(listBridge);

    return {
      tl: (key: string) => t("RuleEngine." + key),
      bridgeTb,
      tbLoading,
      enableOrDisableBridge,
      submitDeleteBridge,
    };
  },
});
</script>

<style lang="scss" scoped></style>
