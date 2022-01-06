<template>
  <div class="exhook app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" size="small" @click="addExhook">
        {{ $t("Base.add") }}
      </el-button>
    </div>
    <el-table class="exhook-table" :data="exhooks" v-loading.lock="isTableLoading">
      <el-table-column prop="name" :label="tl('name')">
        <template #default="{ row }">
          <router-link to="XXXX">
            {{ row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="tl('numberOfHooks')">
        <template #default="{ row }">
          {{ row.registered_hooks.length }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('success')">
        <template #default="{ row }">
          {{ row.metrics.success }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('failure')">
        <template #default="{ row }">
          {{ row.metrics.failed }}
        </template>
      </el-table-column>
      <el-table-column :label="`${tl('speed')}(${tl('second')})`">
        <template #default="{ row }">
          {{ row.metrics.rate }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('status')">
        <template #default="{ row }">
          <!-- TODO:style detail -->
          {{ row.status }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="mini">{{ tl("setting", "Base") }}</el-button>
          <el-button size="mini" v-if="row.status === ConnectionStatus.Connected" @click="enableExhook(row)">
            {{ tl("enable", "Base") }}
          </el-button>
          <el-button size="mini" v-else-if="row.status === ConnectionStatus.Disconnected" @click="disableExhook(row)">
            {{ tl("disable", "Base") }}
          </el-button>
          <TableItemDropdown
            :row-data="row"
            @move-to-top="moveExhookItemToTop"
            @move-to-bottom="moveExhookItemToBottom"
            @delete="deleteExhook"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ConnectionStatus } from "@/types/enum";
import TableItemDropdown from "./components/TableItemDropdown.vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import useHandleExhookItem from "@/hooks/Exhook/useHandleExhookItem";
import { Exhook } from "@/types/systemModule";
// TODO:drag
const router = useRouter();
const { t } = useI18n();

const exhooks = ref([]);
const isTableLoading = ref(false);

const tl = (key: string, moduleName = "Exhook") => t(`${moduleName}.${key}`);

const addExhook = () => {
  router.push({ name: "exhook-create" });
};

const { deleteExhook, disableExhook, enableExhook } = useHandleExhookItem();

const moveExhookItemToTop = (row: Exhook) => {
  // TODO:
};

const moveExhookItemToBottom = (row: Exhook) => {
  // TODO:
};
</script>
