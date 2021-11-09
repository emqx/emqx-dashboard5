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
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
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
              <i class="el-icon-more"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="edit">
                  <i class="el-icon-edit-outline"></i>
                  {{ $t("Base.edit") }}
                </el-dropdown-item>
                <el-dropdown-item command="delete">
                  <i class="el-icon-delete"></i>
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

    <!-- <div class="emq-table-footer">
      <el-pagination
        v-if="count > 0"
        layout="total, sizes, prev, pager, next"
        :page-sizes="[20, 50, 100, 500]"
        :page-size.sync="limit"
        :current-page.sync="page"
        :total="count"
        @size-change="loadData(id)"
        @current-change="loadData(id)"
      >
      </el-pagination>
    </div> -->

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
import { useRoute } from "vue-router";
import commonPagination from "@/components/commonPagination.vue";

export default defineComponent({
  components: { commonPagination },

  name: "DataManager",
  props: {
    field: {
      type: String,
      required: true,
      default: "username",
    },
  },
  setup() {
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
    // const page = ref(1);
    // const limit = ref(20);
    // const count = ref(0);
    const route = useRoute();
    const id = computed(function () {
      return route.params.id;
    });

    const loadData = async (params) => {
      // if (reload) {
      //   page.value = 1;
      // }
      const sendParams = {
        ...pageMeta.value,
        ...params,
      };
      Reflect.deleteProperty(sendParams, "count");

      lockTable.value = true;
      const res = await loadAuthnUsers(id.value, sendParams).catch(() => {
        lockTable.value = false;
      });
      if (res) {
        tableData.value = res.data;
        // count.value = res.meta.count;
        pageMeta.value = res?.meta;
      }
      lockTable.value = false;
    };
    onMounted(loadData);
    const getRules = function () {
      return {
        password: [
          { required: true, message: this.$t("General.pleaseEnterPassword") },
        ],
      };
    };
    const handleAdd = async function () {
      if (dataManager.user_id === "" || dataManager.password === "") {
        return;
      }
      await createAuthnUsers(id.value, dataManager);
      this.$message.success(this.$t("Base.createSuccess"));
      dataManager.user_id = "";
      dataManager.password = "";
      dataManager.is_superuser = false;
      loadData();
    };
    const handleCommand = async function (row, command) {
      if (command === "delete") {
        this.$confirm(this.$t("General.confirmDelete"), {
          confirmButtonText: this.$t("Base.confirm"),
          cancelButtonText: this.$t("Base.cancel"),
          type: "warning",
        })
          .then(async () => {
            await deleteAuthnUser(id.value, row.user_id).catch(() => {});
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
      let validation = await this.$refs.recordForm.validate().catch(() => {});
      if (!validation) {
        return;
      }
      const { password, is_superuser, user_id } = record.value;
      const data = {
        password: password,
        is_superuser: is_superuser,
      };
      await updateAuthnUser(id.value, user_id, data);
      dialogVisible.value = false;
      this.$message.success(this.$t("Base.updateSuccess"));
      loadData();
    };
    return {
      id,
      dialogVisible,
      tableData,
      lockTable,
      dataManager,
      record,
      // page,
      // limit,
      // count,
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
