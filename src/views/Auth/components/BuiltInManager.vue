<template>
  <div class="built-in-manager">
    <div class="section-header">
      <el-radio-group v-model="type" class="select-type">
        <el-radio
          v-for="item in typeList"
          :key="item.value"
          :label="item.value"
          class="permission-type"
          border
        >
          <span>{{ item.label }}</span>
        </el-radio>
      </el-radio-group>
      <div>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleAdd"
        >
          {{ $t("Base.add") }}
        </el-button>
      </div>
    </div>
    <el-table
      v-show="type === 'all'"
      :data="allTableData"
      v-loading.lock="lockTable"
    >
      <el-table-column v-if="false" type="expand"></el-table-column>
      <el-table-column prop="permission" label="Permission"></el-table-column>
      <el-table-column prop="action" label="Action"></el-table-column>
      <el-table-column prop="topic" label="Topic"></el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row, $index }">
          <el-button size="mini" @click="handleEdit(row, $index)">
            {{ $t("Base.edit") }}
          </el-button>
          <el-button size="mini" @click="handleDelete(row, $index)">
            {{ $t("Base.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="type !== 'all'">
      <el-table :data="tableData" v-loading.lock="lockTable">
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-table :data="row.rules">
              <el-table-column
                prop="permission"
                label="Permission"
                min-width="80px"
              >
              </el-table-column>
              <el-table-column
                prop="action"
                label="Action"
                min-width="80px"
              ></el-table-column>
              <el-table-column prop="topic" label="Topic"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          v-if="type === 'clientid'"
          prop="clientid"
          label="ClientID"
        ></el-table-column>
        <el-table-column
          v-else-if="type === 'username'"
          prop="username"
          label="Username"
        ></el-table-column>
        <el-table-column prop="rules" :label="$t('Auth.permissionCount')">
          <template #default="{ row }">
            {{ row.rules.length }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Base.operation')">
          <template #default="{ row }">
            <el-button size="mini" @click="handleEdit(row)">
              {{ $t("Base.edit") }}
            </el-button>
            <el-button size="mini" @click="handleDelete(row)">
              {{ $t("Base.delete") }}
            </el-button>
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
          @size-change="loadData()"
          @current-change="loadData()"
        >
        </el-pagination>
      </div> -->
    </div>
    <el-dialog
      :title="isEdit ? $t('Base.edit') : $t('Base.add')"
      v-model="dialogVisible"
    >
      <el-form
        ref="recordForm"
        :model="record"
        :rules="getRules()"
        label-position="top"
      >
        <template v-if="type === 'all'">
          <el-form-item prop="permission" label="Permission">
            <el-select v-model="record.permission">
              <el-option value="allow" label="Allow"></el-option>
              <el-option value="deny" label="Deny"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="action" label="Action">
            <el-select v-model="record.action">
              <el-option value="publish" label="Publish"></el-option>
              <el-option value="subscribe" label="Subscribe"></el-option>
              <el-option value="all" label="All"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="topic" label="Topic">
            <el-input v-model="record.topic"></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item
            v-if="type === 'clientid'"
            prop="clientid"
            label="ClientID"
          >
            <el-input v-model="record.clientid" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item
            v-else-if="type === 'username'"
            prop="username"
            label="Username"
          >
            <el-input v-model="record.username" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="Permissions">
            <el-table class="form-table" :data="rulesData" size="mini">
              <el-table-column prop="permission" label="Permission">
                <template #default="{ row }">
                  <el-select v-model="row.permission">
                    <el-option value="allow" label="Allow"></el-option>
                    <el-option value="deny" label="Deny"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="action" label="Action">
                <template #default="{ row }">
                  <el-select v-model="row.action">
                    <el-option value="publish" label="Publish"></el-option>
                    <el-option value="subscribe" label="Subscribe"></el-option>
                    <el-option value="all" label="All"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="topic" label="Topic">
                <template #default="{ row }">
                  <el-input v-model="row.topic"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="right" max-width="160px">
                <template #header>
                  <a href="javascript:;" class="btn" @click="addColumn">
                    {{ $t("Base.add") }}
                  </a>
                </template>
                <template #default="{ row, $index }">
                  <a
                    href="javascript:;"
                    class="btn"
                    @click="handleUp(row, $index)"
                  >
                    {{ $t("Base.up") }}
                  </a>
                  <a
                    href="javascript:;"
                    class="btn"
                    @click="handleDown(row, $index)"
                  >
                    {{ $t("Base.down") }}
                  </a>
                  <a
                    href="javascript:;"
                    class="btn"
                    @click="deleteItem(row, $index)"
                  >
                    {{ $t("Base.delete") }}
                  </a>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button size="small" @click="dialogVisible = false">
            {{ $t("Base.cancel") }}
          </el-button>
          <el-button type="primary" size="small" @click="handleSubmit">
            {{ isEdit ? $t("Base.update") : $t("Base.add") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import {
  loadBuiltInDatabaseData,
  createBuiltInDatabaseData,
  deleteBuiltInDatabaseData,
  updateBuiltInDatabaseData,
  updateAllBuiltInDatabaseData,
} from "@/api/auth";
import _ from "lodash";
import commonPagination from "@/components/commonPagination.vue";

export default defineComponent({
  components: { commonPagination },
  name: "BuiltInManager",
  setup() {
    const type = ref("clientid");
    const lockTable = ref(false);
    const typeList = [
      {
        label: "ClientID",
        value: "clientid",
      },
      {
        label: "Username",
        value: "username",
      },
      {
        label: "All",
        value: "all",
      },
    ];
    const pageMeta = ref({});
    const recordForm = ref(null);
    const tableData = ref([]);
    const allTableData = ref([]);
    const rulesData = ref([]);
    const record = reactive({
      clientid: "",
      username: "",
      rules: [],
      permission: "allow",
      action: "publish",
      topic: "",
    });
    const dialogVisible = ref(false);
    const isEdit = ref(false);
    const editIndex = ref(0);
    // const page = ref(1);
    // const limit = ref(20);
    // const count = ref(0);
    const getRules = function () {
      return {
        clientid: [
          {
            required: true,
            message: this.$t("Auth.pleaseEnterClientID"),
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: this.$t("Auth.pleaseEnterUsername"),
            trigger: "blur",
          },
        ],
        permission: [
          {
            required: true,
            message: this.$t("Auth.pleaseSelectPermission"),
            trigger: "blur",
          },
        ],
        action: [
          {
            required: true,
            message: this.$t("Auth.pleaseSelectAction"),
            trigger: "blur",
          },
        ],
        topic: [
          {
            required: true,
            message: this.$t("Auth.pleaseEnterTopic"),
            trigger: "blur",
          },
        ],
      };
    };
    watch(type, () => {
      loadData({ page: 1 });
    });
    watch(dialogVisible, (val) => {
      if (!val) {
        handleCancel();
      }
    });
    const loadData = async (params) => {
      // if (reload) {
      //   // tableData.value = [];
      //   // page.value = 1;
      // }
      lockTable.value = true;

      const sendParams = {
        ...pageMeta.value,
        ...params,
      };
      Reflect.deleteProperty(sendParams, "count");
      // const params = {};
      // if (type.value !== "all") {
      //   // params.page = page.value;
      //   // params.limit = limit.value;
      // }
      const res = await loadBuiltInDatabaseData(type.value, sendParams).catch(
        () => {
          lockTable.value = false;
        }
      );
      if (type.value === "all") {
        allTableData.value = res.rules;
      } else {
        tableData.value = res?.data;
        // count.value = res.meta.count;
        pageMeta.value = res?.meta;
      }
      lockTable.value = false;
    };
    onMounted(loadData);
    const handleAdd = function () {
      dialogVisible.value = true;
      isEdit.value = false;
      if (recordForm.value) {
        setTimeout(recordForm.value.clearValidate, 10);
      }
    };
    const handleCancel = function () {
      dialogVisible.value = false;
      record.clientid = "";
      record.username = "";
      record.permission = "allow";
      record.action = "publish";
      record.topic = "";
      record.rules = [];
      rulesData.value = [];
    };
    const addColumn = () => {
      rulesData.value.push({
        permission: "allow",
        action: "publish",
        topic: "",
      });
    };
    const deleteItem = (row, index) => {
      rulesData.value.splice(index, 1);
    };
    const handleSubmit = function () {
      recordForm.value.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const key = type.value;
        const data = {};
        if (key !== "all") {
          data[key] = record[key];
          data.rules = rulesData.value;
          if (!isEdit.value) {
            await createBuiltInDatabaseData(type.value, [data]);
            this.$message.success(this.$t("Base.createSuccess"));
          } else {
            await updateBuiltInDatabaseData(type.value, data[type.value], data);
            this.$message.success(this.$t("Base.updateSuccess"));
          }
        } else {
          data.permission = record.permission;
          data.action = record.action;
          data.topic = record.topic;
          const rules = _.cloneDeep(allTableData.value);
          if (!isEdit.value) {
            rules.push(data);
          } else {
            rules.splice(editIndex.value, 1, data);
          }
          await updateAllBuiltInDatabaseData({
            rules,
          });
        }
        dialogVisible.value = false;
        loadData();
      });
    };
    const handleDelete = function (row, index) {
      this.$confirm(this.$t("General.confirmDelete"), {
        confirmButtonText: this.$t("Base.confirm"),
        cancelButtonText: this.$t("Base.cancel"),
        type: "warning",
      })
        .then(async () => {
          if (type.value !== "all") {
            await deleteBuiltInDatabaseData(type.value, row[type.value]).catch(
              () => {}
            );
          } else {
            const rules = _.cloneDeep(allTableData.value);
            rules.splice(index, 1);
            await updateAllBuiltInDatabaseData({
              rules,
            });
          }
          loadData({ page: 1 });
        })
        .catch(() => {});
    };
    const handleEdit = function (row, index) {
      dialogVisible.value = true;
      isEdit.value = true;
      editIndex.value = 0;
      if (type.value !== "all") {
        const key = type.value;
        record[key] = row[key];
        rulesData.value = row.rules;
      } else {
        editIndex.value = index;
        record.permission = row.permission;
        record.action = row.action;
        record.topic = row.topic;
      }
    };
    const swapArray = (arr, fromIndex, toIndex) => {
      arr[toIndex] = arr.splice(fromIndex, 1, arr[toIndex])[0];
      return arr;
    };
    const handleUp = (row, index) => {
      if (index === 0) {
        return;
      }
      swapArray(rulesData.value, index, index - 1);
    };
    const handleDown = (row, index) => {
      if (index === rulesData.value.length - 1) {
        return;
      }
      swapArray(rulesData.value, index, index + 1);
    };
    return {
      type,
      typeList,
      record,
      dialogVisible,
      lockTable,
      tableData,
      allTableData,
      rulesData,
      isEdit,
      // page,
      // limit,
      // count,
      pageMeta,
      loadData,
      getRules,
      handleAdd,
      addColumn,
      deleteItem,
      handleSubmit,
      handleDelete,
      handleEdit,
      handleUp,
      handleDown,
    };
  },
});
</script>

<style lang="scss">
.built-in-manager {
  .el-radio.is-bordered {
    margin-top: 0px;
    width: 100px;
  }
  .el-table__expanded-cell {
    padding: 24px 48px;
    .el-table {
      border: 0px;
    }
  }
  .form-table {
    .cell {
      .btn + .btn {
        margin-left: 5px;
      }
    }
  }
}
</style>
