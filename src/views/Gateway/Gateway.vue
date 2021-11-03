<template>
  <div class="app-wrapper gateway">
    <el-table :data="tbData" v-loading="tbLoading">
      <el-table-column :label="tl('name')">
        <template #default="{ row }">
          <span :class="`g-${row.name} g-icon`"></span>
          <span class="g-title">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('status')" sortable>
        <template #default="{ row }">
          <span>{{
            isRunning(row.status) ? tl("running") : tl("stopped")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('connection')">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            effect="dark"
            :content="`${row.current_connections || 0}/${
              row.max_connections || 0
            }`"
          >
            <el-progress
              :stroke-width="16"
              :percentage="
                calcPercentage(row.current_connections, row.max_connections)
              "
              :format="() => {}"
            ></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="tl('listeners')" width="120" sortable>
        <template #default="{ row }">
          {{ (row.listeners && row.listeners.length) || 0 }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="scope">
          <el-button
            size="mini"
            :disabled="isUnload(scope.row.status)"
            @click="
              $router.push({
                name: 'gateway-detail-basic',
                params: { name: scope.row.name },
              })
            "
            >{{ tl("setting") }}</el-button
          >
          <el-button
            size="mini"
            :disabled="isUnload(scope.row.status)"
            @click="
              $router.push({
                name: 'gateway-detail-auth',
                params: { name: scope.row.name },
              })
            "
            >{{ tl("auth") }}</el-button
          >
          <el-dropdown
            size="small"
            placement="bottom-start"
            @visible-change="dropdownVChange(scope.row)"
            @command="dropdownHandler"
          >
            <el-button size="mini"
              >{{ tl("more")
              }}<i
                :class="[
                  'iconfont',
                  !scope.row[dropdownExclusiveKey]
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-top',
                ]"
              ></i
            ></el-button>
            <template #dropdown>
              <el-dropdown-menu class="no-dropdown-arrow">
                <el-dropdown-item
                  :disabled="!isRunning(scope.row.status)"
                  :command="{
                    name: 'gateway-detail-clients',
                    params: { name: scope.row.name },
                  }"
                  >{{ tl("clients") }}</el-dropdown-item
                >
                <el-dropdown-item
                  :command="{ name: 'gateway-enable', data: scope.row }"
                  >{{
                    isRunning(scope.row.status) ? tl("disable") : tl("enable")
                  }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { getGatewayList, updateGateway } from "@/api/gateway";
import { calcPercentage, caseInsensitiveCompare } from "@/common/utils";
import i18n from "@/i18n";
import router from "@/router";
import { Message as M } from "element-plus";

export default defineComponent({
  name: "Gateway",
  setup() {
    let tbData = ref([]);
    let tbLoading = ref(false);
    let dropdownExclusiveKey = "_drop";
    const enableStr = "running";
    const disableStr = "stopped";
    const unloadStr = "unload";

    const tl = function (key, collection = "Gateway") {
      return this.$t(collection + "." + key);
    };

    const isRunning = (status) => {
      return caseInsensitiveCompare(status, enableStr);
    };

    const isUnload = (status) => {
      return caseInsensitiveCompare(status, unloadStr);
    };

    const loadGateway = async () => {
      tbLoading.value = true;
      let res = await getGatewayList().catch(() => {});
      if (res) {
        let pendingData = [];
        Array.prototype.forEach.call(res, (v) => {
          pendingData.push({ ...v, ...{ [dropdownExclusiveKey]: false } });
        });
        tbData.value = pendingData;
      } else {
        tbData.value = [];
      }
      tbLoading.value = false;
    };

    const dropdownVChange = (row) => {
      return Object.assign(row, {
        [dropdownExclusiveKey]: !row[dropdownExclusiveKey],
      });
    };

    const dropdownHandler = function (command) {
      if (!command) return;
      if (typeof command == "object") {
        if (command.name.match(/gateway-detail-.*/i)) {
          router.push(command);
          return;
        } else {
          switch (command.name) {
            case "gateway-enable":
              gatewayStartStop(command.data);
              break;
          }
        }
      }
    };

    const gatewayStartStop = async function (instance) {
      const { name } = instance;
      if (isUnload(instance.status)) {
        router.push({ name: "gateway-create", params: { name: name } });
      } else {
        let body = { enable: !isRunning(instance.status) };
        let res = await updateGateway(name, body).catch(() => {});
        if (res) {
          M({
            type: "success",
            message: isRunning(instance.status)
              ? i18n.t("Base.disabledSuccess")
              : i18n.t("Base.enableSuccess"),
          });
          instance.status = isRunning(instance.status) ? disableStr : enableStr;
        }
      }
    };

    onMounted(loadGateway);

    return {
      tl,
      tbLoading,
      tbData,
      calcPercentage,
      isRunning,
      isUnload,
      dropdownVChange,
      dropdownExclusiveKey,
      dropdownHandler,
    };
  },
});
</script>

<style lang="scss" scoped>
.g-icon::before {
  width: 60px;
  height: 60px;
  content: "";
  display: inline-block;
  background-size: contain;
}
.g-title {
  vertical-align: 23px;
  padding: 0 5px;
}
</style>
