<template>
  <div class="authz app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button
        size="small"
        icon="el-icon-setting"
        @click="$router.push({ name: 'authorizationSetting' })"
      >
        {{ $t("Auth.setting") }}
      </el-button>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="$router.push({ name: 'authorizationCreate' })"
      >
        {{ $t("Base.create") }}
      </el-button>
    </div>
    <el-table class="auth-table" :data="authzList" v-loading.lock="lockTable">
      <el-table-column prop="type" :label="$t('Auth.dataSource')">
        <template #default="{ row }">
          <img :src="row.img" width="48" />
          <span>{{ row.type }}</span>
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
            :table-data-len="authzList.length"
            :position="findIndex(row)"
            @update="handleUpdate"
            @delete="handleDelete"
            @move="handleMove"
            @setting="handleSetting"
          ></table-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import TableDropdown from "./components/TableDropdown.vue";
import { listAuthz, updateAuthz, deleteAuthz, moveAuthz } from "@/api/auth";

export default defineComponent({
  name: "Authz",
  components: {
    TableDropdown,
  },
  setup() {
    const authzList = ref([]);
    const lockTable = ref(false);
    const loadData = async () => {
      lockTable.value = true;
      const res = await listAuthz().catch(() => {
        lockTable.value = false;
      });
      if (res) {
        authzList.value = res.sources.map((item) => ({
          ...item,
          img: require(`@/assets/img/${item.type}.png`),
        }));
        const addedAuthz = authzList.value.map((authz) => authz.type);
        sessionStorage.setItem("addedAuthz", JSON.stringify(addedAuthz));
      }
      lockTable.value = false;
    };
    loadData();
    const handleUpdate = async (row) => {
      const { img, ...data } = row;
      await updateAuthz(row.type, data);
      loadData();
    };
    const handleDelete = async function ({ type }) {
      this.$confirm(this.$t("General.confirmDelete"), {
        confirmButtonText: this.$t("Base.confirm"),
        cancelButtonText: this.$t("Base.cancel"),
        type: "warning",
      })
        .then(async () => {
          await deleteAuthz(type).catch(() => {});
          loadData();
        })
        .catch(() => {});
    };
    const handleMove = async function ({ type }, position) {
      const data = {
        position,
      };
      await moveAuthz(type, data);
      loadData();
    };
    const handleSetting = function ({ type }) {
      this.$router.push({ path: `/authorization/detail/${type}` });
    };
    const findIndex = (row) => {
      return authzList.value.findIndex((item) => item.type === row.type);
    };
    return {
      lockTable,
      authzList,
      handleUpdate,
      handleDelete,
      handleMove,
      handleSetting,
      findIndex,
    };
  },
});
</script>

<style lang="scss">
@import "./style/authTable.scss";
</style>
