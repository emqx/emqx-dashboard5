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
        <el-button type="primary" :icon="Plus" @click="handleAdd">
          {{ $t('Base.add') }}
        </el-button>
      </div>
    </div>
    <el-row v-if="type !== 'all'" class="section-searchbar" :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="searchVal"
          clearable
          :placeholder="getCurrSearchValTip(type)"
          @clear="handleSearch"
        ></el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" :icon="Search" @click="handleSearch">
          {{ $t('Base.search') }}
        </el-button>
      </el-col>
    </el-row>
    <el-table v-show="type === 'all'" :data="allTableData" v-loading.lock="lockTable">
      <el-table-column v-if="false" type="expand"></el-table-column>
      <el-table-column prop="permission" label="Permission"></el-table-column>
      <el-table-column prop="action" label="Action"></el-table-column>
      <el-table-column prop="topic" label="Topic"></el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row, $index }">
          <el-button size="small" @click="handleEdit(row, $index)">
            {{ $t('Base.edit') }}
          </el-button>
          <el-button size="small" plain type="danger" @click="handleDelete(row, $index)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="type !== 'all'">
      <el-table :data="tableData" v-loading.lock="lockTable">
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-table :data="row.rules">
              <el-table-column prop="permission" label="Permission" min-width="80px">
              </el-table-column>
              <el-table-column prop="action" label="Action" min-width="80px"></el-table-column>
              <el-table-column prop="topic" label="Topic"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          v-if="type === 'clientid'"
          prop="clientid"
          label="Client ID"
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
          <template #default="{ row, $index }">
            <el-button size="small" @click="handleEdit(row, $index)">
              {{ $t('Base.edit') }}
            </el-button>
            <el-button size="small" plain type="danger" @click="handleDelete(row, $index)">
              {{ $t('Base.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="emq-table-footer">
        <common-pagination v-model:metaData="pageMeta" @loadPage="loadData"></common-pagination>
      </div>
    </div>
    <el-dialog :title="isEdit ? $t('Base.edit') : $t('Base.add')" v-model="dialogVisible">
      <el-form ref="recordForm" :model="record" :rules="getRules()" label-position="top">
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
          <el-form-item prop="topic">
            <template #label>
              Topic
              <InfoTooltip :content="$t('Auth.topicTips', ['{username}', '{clientid}'])" />
            </template>
            <el-input v-model="record.topic" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item v-if="type === 'clientid'" prop="clientid" label="Client ID">
            <el-input v-model="record.clientid" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item v-else-if="type === 'username'" prop="username" label="Username">
            <el-input v-model="record.username" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="Permissions">
            <el-table class="form-table" :data="rulesData" size="small">
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
                    {{ $t('Base.add') }}
                  </a>
                </template>
                <template #default="{ row, $index }">
                  <a href="javascript:;" class="btn" @click="handleUp(row, $index)">
                    {{ $t('Base.up') }}
                  </a>
                  <a href="javascript:;" class="btn" @click="handleDown(row, $index)">
                    {{ $t('Base.down') }}
                  </a>
                  <a href="javascript:;" class="btn" @click="deleteItem(row, $index)">
                    {{ $t('Base.delete') }}
                  </a>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button @click="dialogVisible = false">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ isEdit ? $t('Base.update') : $t('Base.add') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import {
  loadBuiltInDatabaseData,
  createBuiltInDatabaseData,
  deleteBuiltInDatabaseData,
  updateBuiltInDatabaseData,
  updateAllBuiltInDatabaseData,
} from '@/api/auth'
import _ from 'lodash'
import commonPagination from '@/components/commonPagination.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { ElMessage, ElMessageBox as MB } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Plus, Search } from '@element-plus/icons-vue'
import { BuiltInDBItem, BuiltInDBRule, BuiltInDBType } from '@/types/auth'

export default defineComponent({
  components: { commonPagination, InfoTooltip },
  name: 'BuiltInManager',
  setup() {
    const { t } = useI18n()

    const type = ref<BuiltInDBType>('clientid')
    const lockTable = ref(false)
    const typeList = [
      {
        label: 'Client ID',
        value: 'clientid',
      },
      {
        label: 'Username',
        value: 'username',
      },
      {
        label: 'All',
        value: 'all',
      },
    ]
    const pageMeta = ref({})
    const recordForm = ref()
    const tableData = ref([])
    const allTableData = ref<BuiltInDBRule[]>([])
    const rulesData = ref<BuiltInDBRule[]>([])
    const record = reactive({
      clientid: '',
      username: '',
      rules: [],
      permission: 'allow',
      action: 'publish',
      topic: '',
    })
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const editIndex = ref(0)
    const searchVal = ref('')

    const getRules = function () {
      return {
        clientid: [
          {
            required: true,
            message: t('Auth.pleaseEnterClientID'),
            trigger: 'blur',
          },
        ],
        username: [
          {
            required: true,
            message: t('Auth.pleaseEnterUsername'),
            trigger: 'blur',
          },
        ],
        permission: [
          {
            required: true,
            message: t('Auth.pleaseSelectPermission'),
            trigger: 'blur',
          },
        ],
        action: [
          {
            required: true,
            message: t('Auth.pleaseSelectAction'),
            trigger: 'blur',
          },
        ],
        topic: [
          {
            required: true,
            message: t('Auth.pleaseEnterTopic'),
            trigger: 'blur',
          },
        ],
      }
    }
    watch(type, () => {
      searchVal.value = ''
      loadData({ page: 1 })
    })
    watch(dialogVisible, (val) => {
      if (!val) {
        handleCancel()
      }
    })
    const loadData = async (params = {}) => {
      lockTable.value = true

      const sendParams = {
        ...pageMeta.value,
        ...params,
      }
      Reflect.deleteProperty(sendParams, 'count')
      const res = await loadBuiltInDatabaseData(type.value, sendParams).catch(() => {
        lockTable.value = false
      })
      if (type.value === 'all') {
        allTableData.value = res.rules
      } else {
        tableData.value = res?.data
        pageMeta.value = res?.meta
      }
      lockTable.value = false
    }
    onMounted(loadData)
    const handleAdd = function () {
      dialogVisible.value = true
      isEdit.value = false
      if (recordForm.value) {
        setTimeout(recordForm.value.clearValidate, 10)
      }
    }
    const handleCancel = function () {
      dialogVisible.value = false
      record.clientid = ''
      record.username = ''
      record.permission = 'allow'
      record.action = 'publish'
      record.topic = ''
      record.rules = []
      rulesData.value = []
    }
    const addColumn = () => {
      rulesData.value.push({
        permission: 'allow',
        action: 'publish',
        topic: '',
      })
    }
    const deleteItem = (row: BuiltInDBItem, index: number) => {
      rulesData.value.splice(index, 1)
    }
    const handleSubmit = function () {
      recordForm.value.validate(async (valid: boolean) => {
        if (!valid) {
          return
        }
        const key = type.value
        const data: {
          [key: string]: any
        } = {}
        if (key !== 'all') {
          data[key] = record[key]
          data.rules = rulesData.value
          if (!isEdit.value) {
            await createBuiltInDatabaseData(type.value, [data])
            ElMessage.success(t('Base.createSuccess'))
          } else {
            await updateBuiltInDatabaseData(type.value, data[type.value], data)
            ElMessage.success(t('Base.updateSuccess'))
          }
        } else {
          data.permission = record.permission
          data.action = record.action
          data.topic = record.topic
          const rules = _.cloneDeep(allTableData.value)
          if (!isEdit.value) {
            rules.push(data as BuiltInDBRule)
          } else {
            rules.splice(editIndex.value, 1, data as BuiltInDBRule)
          }
          await updateAllBuiltInDatabaseData({
            rules,
          })
        }
        dialogVisible.value = false
        loadData()
      })
    }
    const handleDelete = function (row: BuiltInDBItem, index: number) {
      MB.confirm(t('Base.confirmDelete'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          if (type.value !== 'all') {
            await deleteBuiltInDatabaseData(type.value, row[type.value]).catch(() => {})
          } else {
            const rules = _.cloneDeep(allTableData.value)
            rules.splice(index, 1)
            await updateAllBuiltInDatabaseData({
              rules,
            })
          }
          loadData({ page: 1 })
        })
        .catch(() => {})
    }
    const handleEdit = function (row: BuiltInDBItem | BuiltInDBRule, index: number) {
      dialogVisible.value = true
      isEdit.value = true
      editIndex.value = 0
      if (type.value !== 'all') {
        const _row = row as BuiltInDBItem
        const key = type.value
        record[key] = _row[key]
        rulesData.value = _row.rules
      } else {
        const _row = row as BuiltInDBRule
        editIndex.value = index
        record.permission = _row.permission
        record.action = _row.action
        record.topic = _row.topic
      }
    }
    const swapArray = (arr: BuiltInDBRule[], fromIndex: number, toIndex: number) => {
      arr[toIndex] = arr.splice(fromIndex, 1, arr[toIndex])[0]
      return arr
    }
    const handleUp = (row: BuiltInDBItem, index: number) => {
      if (index === 0) {
        return
      }
      swapArray(rulesData.value, index, index - 1)
    }
    const handleDown = (row: BuiltInDBItem, index: number) => {
      if (index === rulesData.value.length - 1) {
        return
      }
      swapArray(rulesData.value, index, index + 1)
    }

    const getCurrSearchValTip = (type: BuiltInDBType) => {
      const typeMap = {
        all: '',
        clientid: 'Client ID',
        username: 'Username',
      }
      return typeMap[type]
    }
    const handleSearch = () => {
      const page = 1
      if (searchVal.value) {
        const searchKey = `like_${type.value}`
        loadData({ page, [searchKey]: searchVal.value })
      } else {
        loadData({ page })
      }
    }

    return {
      Plus,
      Search,
      recordForm,
      type,
      typeList,
      record,
      dialogVisible,
      lockTable,
      tableData,
      allTableData,
      rulesData,
      isEdit,
      pageMeta,
      searchVal,
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
      handleSearch,
      getCurrSearchValTip,
    }
  },
})
</script>

<style lang="scss">
.built-in-manager {
  .section-searchbar {
    margin-bottom: 20px;
    margin-top: 32px;
    width: 100%;
  }
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
