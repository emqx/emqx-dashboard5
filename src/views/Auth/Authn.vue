<template>
  <div class="authn app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="$router.push({ name: 'authenticationCreate' })"
      >
        {{ $t("Base.create") }}
      </el-button>
    </div>
    <el-table class="auth-table" :data="authnList" v-loading.lock="lockTable">
      <el-table-column
        prop="mechanism"
        :label="$t('Auth.mechanism')"
      ></el-table-column>
      <el-table-column prop="backend" :label="$t('Auth.dataSource')">
        <template #default="{ row }">
          <img :src="row.img" width="48" />
          <span>{{ row.backend }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="enable" :label="$t('Auth.status')">
        <template #default="{ row }">
          <span :class="['status', { disabled: !row.enable }]">
            {{ row.enable ? "Enable" : "Disabled" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template #default="{ row }">
          <table-dropdown
            :row-data="row"
            :table-data-len="authnList.length"
            :position="findIndex(row)"
            @update="handleUpdate"
            @delete="handleDelete"
            @setting="handleSetting"
            @move="handleMove"
          ></table-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import TableDropdown from "./components/TableDropdown.vue";
import { listAuthn, updateAuthn, deleteAuthn, moveAuthn } from "@/api/auth";
import { useRouter } from "vue-router";
import { ElMessageBox as MB } from "element-plus";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "Authn",
  components: {
    TableDropdown,
  },
  setup() {
    const router = useRouter();
    const { t } = useI18n();
    const authnList = ref([]);
    const lockTable = ref(false);
    const loadData = async () => {
      lockTable.value = true;
      const res = await listAuthn().catch(() => {
        lockTable.value = false;
      });
      if (res) {
        authnList.value = res.map((item) => {
          if (item.mechanism !== "jwt") {
            item.img = require(`@/assets/img/${item.backend}.png`);
          }
          return item;
        });
        const addedAuthn = authnList.value.map((authn) => {
          if (authn.backend === undefined) {
            return `${authn.mechanism}`;
          }
          return `${authn.mechanism}_${authn.backend}`;
        });
        sessionStorage.setItem("addedAuthn", JSON.stringify(addedAuthn));
      }
      lockTable.value = false;
    };
    loadData();
    const handleUpdate = async (row) => {
      const { img, ...data } = row;
      await updateAuthn(row.id, data);
      loadData();
    };
    const handleDelete = async function ({ id }) {
      MB.confirm(t("Base.confirmDelete"), {
        confirmButtonText: t("Base.confirm"),
        cancelButtonText: t("Base.cancel"),
        type: "warning",
      })
        .then(async () => {
          await deleteAuthn(id).catch(() => {});
          loadData();
        })
        .catch(() => {});
    };
    const handleSetting = function ({ id }) {
      router.push({ path: `/authentication/detail/${id}` });
    };
    const handleMove = async function ({ id }, position) {
      const data = {
        position,
      };
      await moveAuthn(id, data);
      loadData();
    };
    const findIndex = (row) => {
      return authnList.value.findIndex((item) => {
        const id = `${item.mechanism}_${item.backend}`;
        return id === `${row.mechanism}_${row.backend}`;
      });
    };
    return {
      lockTable,
      authnList,
      handleUpdate,
      handleDelete,
      handleSetting,
      handleMove,
      findIndex,
    };
  },
});
</script>

<style lang="scss">
@import "./style/authTable.scss";
</style>
