<template>
  <div class="authz-manager">
    <el-tabs v-model="type">
      <el-tab-pane
        v-for="item in typeList"
        :key="item.value"
        :label="item.label"
        :name="item.value"
        class="permission-type"
        border
      >
      </el-tab-pane>
    </el-tabs>
    <div class="section-searchbar" :gutter="20">
      <div class="searchbar-content">
        <template v-if="type !== 'all'">
          <el-input
            v-model="searchVal"
            clearable
            :placeholder="getCurrSearchValTip(type)"
            @clear="resetPageAndLoadData"
            @keyup.enter="resetPageAndLoadData"
          ></el-input>
          <el-button type="primary" plain :icon="Search" @click="resetPageAndLoadData">
            {{ $t('Base.search') }}
          </el-button>
          <el-button type="primary" :icon="RefreshRight" @click="resetSearchAndLoadData">
            {{ $t('Base.refresh') }}
          </el-button>
        </template>
      </div>
      <el-button type="primary" :icon="Plus" @click="handleAdd">
        {{ $t('Base.add') }}
      </el-button>
    </div>
    <el-table v-show="type === 'all'" :data="allTableData" v-loading.lock="lockTable">
      <el-table-column v-if="false" type="expand"></el-table-column>
      <el-table-column prop="permission" label="Permission"></el-table-column>
      <el-table-column prop="action" label="Action"></el-table-column>
      <el-table-column prop="topic" label="Topic">
        <template #default="{ row }">
          {{ replaceSpaceForHTML(row.topic) }}
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
    <div v-show="type !== 'all'">
      <el-table :data="tableData" v-loading.lock="lockTable">
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-table :data="row.rules">
              <el-table-column prop="permission" label="Permission" min-width="80px">
              </el-table-column>
              <el-table-column label="Action" min-width="80px">
                <template #default="{ row }">
                  {{ getLabelFromValueInOptionList(row.action, actionOpts) }}
                </template>
              </el-table-column>
              <el-table-column prop="topic" label="Topic"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column v-if="type === 'clientid'" prop="clientid" label="Client ID">
          <template #default="{ row }">
            {{ replaceSpaceForHTML(row.clientid) }}
          </template>
        </el-table-column>
        <el-table-column v-else-if="type === 'username'" prop="username" label="Username">
          <template #default="{ row }">
            {{ replaceSpaceForHTML(row.username) }}
          </template>
        </el-table-column>
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
            <el-table class="form-table shadow-none" :data="rulesData">
              <el-table-column prop="permission" label="Permission">
                <template #default="{ row }">
                  <el-select v-model="row.permission">
                    <el-option value="allow" label="Allow"></el-option>
                    <el-option value="deny" label="Deny"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="action" label="Action" :width="220">
                <template #default="{ row }">
                  <el-select v-model="row.action">
                    <el-option
                      v-for="{ label, value } in actionOpts"
                      :key="value"
                      :value="value"
                      :label="label"
                    />
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
import { Plus, Search, RefreshRight } from '@element-plus/icons-vue'
import { BuiltInDBItem, BuiltInDBRule, BuiltInDBType } from '@/types/auth'
import { replaceSpaceForHTML } from '@/common/tools'
import { getLabelFromValueInOptionList } from '@/common/tools'

export default defineComponent({
  components: { commonPagination, InfoTooltip },
  name: 'AuthzManager',
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
        label: 'All Users',
        value: 'all',
      },
    ]
    const pageMeta = ref({
      count: 0,
      limit: 20,
      page: 1,
    })
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

    const actionOpts = [
      { value: 'publish', label: 'Publish' },
      { value: 'subscribe', label: 'Subscribe' },
      { value: 'all', label: 'Publish & Subscribe' },
    ]

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
      resetPageAndLoadData()
    })
    watch(dialogVisible, (val) => {
      if (!val) {
        handleCancel()
      }
    })
    const loadData = async (params = {}) => {
      lockTable.value = true

      const sendParams: Record<string, string | number> = {
        ...pageMeta.value,
        ...params,
      }
      if (searchVal.value) {
        sendParams[`like_${type.value}`] = searchVal.value
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
          resetPageAndLoadData()
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

    const resetPageAndLoadData = () => {
      pageMeta.value.page = 1
      loadData()
    }

    const resetSearchAndLoadData = () => {
      searchVal.value = ''
      resetPageAndLoadData()
    }

    return {
      Plus,
      Search,
      RefreshRight,
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
      actionOpts,
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
      resetPageAndLoadData,
      resetSearchAndLoadData,
      getCurrSearchValTip,
      replaceSpaceForHTML,
      getLabelFromValueInOptionList,
    }
  },
})
</script>

<style lang="scss">
.authz-manager {
  .section-searchbar {
    display: flex;
    margin-bottom: 20px;
    margin-top: 32px;
    width: 100%;
    justify-content: space-between;
    .searchbar-content {
      display: flex;
      width: 460px;
      .el-input {
        margin-right: 12px;
      }
    }
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
