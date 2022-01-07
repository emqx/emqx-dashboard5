<template>
  <div class="data-manager">
    <el-form class="create-form">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item>
            <el-input
              v-model="dataManager.user_id"
              :placeholder="field"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-input
              v-model="dataManager.password"
              type="password"
              :placeholder="$t('General.password')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-checkbox
            v-model="dataManager.is_superuser"
            :label="$t('Auth.isSuperuser')"
            border
          ></el-checkbox>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" :icon="Plus" @click="handleAdd">
            {{ $t("Base.add") }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="user_id" :label="field"></el-table-column>
      <el-table-column prop="is_superuser" :label="$t('Auth.isSuperuser')">
        <template #default="{ row }">
          {{ row.is_superuser ? $t("Base.yes") : $t("Base.no") }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-dropdown
            class="table-dropdown"
            @command="handleCommand(row, $event)"
          >
            <el-button class="dropdown-btn" size="mini">
              <el-icon><More /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="edit">
                  <el-icon><Edit /></el-icon>
                  {{ $t("Base.edit") }}
                </el-dropdown-item>
                <el-dropdown-item command="delete">
                  <el-icon><Delete /></el-icon>
                  {{ $t("Base.delete") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination
        v-model:metaData="pageMeta"
        @loadPage="loadData"
      ></common-pagination>
    </div>

    <el-dialog :title="$t('Base.edit')" v-model="dialogVisible">
      <el-form
        ref="recordForm"
        :model="record"
        :rules="getRules()"
        label-position="top"
      >
        <el-form-item prop="username" :label="field">
          <el-input v-model="record.user_id" disabled></el-input>
        </el-form-item>
        <el-form-item prop="password" :label="$t('General.password')">
          <el-input v-model="record.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <div>
            <el-checkbox
              v-model="record.is_superuser"
              :label="$t('Auth.isSuperuser')"
              border
            ></el-checkbox>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button size="small" @click="dialogVisible = false">
            {{ $t("Base.cancel") }}
          </el-button>

          <el-button type="primary" size="small" @click="handleUpdate">
            {{ $t("Base.update") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import {
  loadAuthnUsers,
  createAuthnUsers,
  deleteAuthnUser,
  updateAuthnUser,
} from "@/api/auth";
import {
  getGatewayUserManagement,
  addGatewayUserManagement,
  updateGatewayUser,
  deleteGatewayUser,
  getGatewayUser,
} from "@/api/gateway";
import { useRoute } from "vue-router";
import commonPagination from "@/components/commonPagination.vue";
import { ElMessageBox as MB, ElMessage as M } from "element-plus";
import { useI18n } from "vue-i18n";
import { Plus, More, Edit, Delete } from "@element-plus/icons-vue";

export default defineComponent({
  components: { commonPagination, More, Edit, Delete },

  name: "DataManager",
  props: {
    field: {
      type: String,
      required: true,
      default: "username",
    },
    gateway: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup(prop) {
    const { t } = useI18n();
    const dataManager = reactive({
      user_id: "",
      password: "",
      is_superuser: false,
    });
    const pageMeta = ref({});
    let record = ref({});
    const tableData = ref([]);
    const lockTable = ref(false);
    const dialogVisible = ref(false);
    const route = useRoute();
    const recordForm = ref()
    const id = computed(function () {
      return route.params.id;
    });

    const loadData = async (params) => {
      const sendParams = {
        ...pageMeta.value,
        ...params,
      };
      Reflect.deleteProperty(sendParams, "count");

      lockTable.value = true;
      let res;
      if (prop.gateway) {
        res = await getGatewayUserManagement(prop.gateway, sendParams).catch(
          () => {}
        );
      } else {
        res = await loadAuthnUsers(id.value, sendParams).catch(() => {});
      }
      if (res) {
        tableData.value = res.data;
        pageMeta.value = res?.meta;
      } else {
        tableData.value = [];
        pageMeta.value = {};
      }
      lockTable.value = false;
    };
    onMounted(loadData);
    const getRules = function () {
      return {
        password: [
          { required: true, message: t("General.pleaseEnterPassword") },
        ],
      };
    };
    const handleAdd = async function () {
      if (dataManager.user_id === "" || dataManager.password === "") {
        return;
      }
      let res;
      if (prop.gateway) {
        res = await addGatewayUserManagement(prop.gateway, dataManager).catch(
          () => {}
        );
      } else {
        res = await createAuthnUsers(id.value, dataManager).catch(() => {});
      }
      if (res) {
        M.success(t("Base.createSuccess"));
        dataManager.user_id = "";
        dataManager.password = "";
        dataManager.is_superuser = false;
      }
      loadData();
    };

    const handleCommand = async function (row, command) {
      if (command === "delete") {
        MB.confirm(t("Base.confirmDelete"), {
          confirmButtonText: t("Base.confirm"),
          cancelButtonText: t("Base.cancel"),
          type: "warning",
        })
          .then(async () => {
            let res;
            if (prop.gateway) {
              res = await deleteGatewayUser(prop.gateway, row.user_id).catch(
                () => {}
              );
            } else {
              res = await deleteAuthnUser(id.value, row.user_id).catch(
                () => {}
              );
            }
            loadData({ page: 1 });
          })
          .catch(() => {});
      } else if (command === "edit") {
        dialogVisible.value = true;
        record.value = {
          user_id: row.user_id,
          is_superuser: row.is_superuser,
          password: "",
        };
      }
    };
    const handleUpdate = async function () {
      let validation = await recordForm.value.validate().catch(() => {});
      if (!validation) {
        return;
      }
      const { password, is_superuser, user_id } = record.value;
      const data = {
        password: password,
        is_superuser: is_superuser,
      };
      let res;
      if (prop.gateway) {
        res = await updateGatewayUser(prop.gateway, user_id, data).catch(
          () => {}
        );
      }
      res = await updateAuthnUser(id.value, user_id, data).catch(() => {});
      if (res) {
        dialogVisible.value = false;
        M.success(t("Base.updateSuccess"));
        loadData();
      }
    };
    return {
      Plus,
      id,
      dialogVisible,
      tableData,
      lockTable,
      dataManager,
      record,
      recordForm,
      pageMeta,
      loadData,
      handleUpdate,
      handleAdd,
      handleCommand,
      getRules,
    };
  },
});
</script>

<style lang="scss" scoped>
.data-manager {
  .el-checkbox.is-bordered {
    margin: 0;
    padding: 0 30px;
  }
  .dropdown-btn {
    padding: 1px 6px;
  }
}
</style>
