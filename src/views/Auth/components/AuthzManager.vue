<template>
  <div class="authz-manager">
    <el-radio-group v-model="type">
      <el-radio-button v-for="item in typeList" :key="item.value" :value="item.value" border>
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
    <div class="section-searchbar" :gutter="20">
      <div class="searchbar-content">
        <template v-if="!isTypeAll">
          <el-input
            v-model="searchVal"
            clearable
            :placeholder="getCurrSearchValTip(type)"
            @clear="resetPageAndLoadData"
            @keyup.enter="resetPageAndLoadData"
          />
          <SearchButton @click="resetPageAndLoadData" />
          <RefreshButton @click="loadData" />
        </template>
      </div>
      <CreateButton @click="handleAdd">{{ t('Base.add') }}</CreateButton>
    </div>
    <AuthzRulesTable
      v-if="isTypeAll"
      ref="tableCom"
      row-key="topic"
      :data="allTableData"
      v-loading.lock="lockTable"
      class="table-with-draggable"
    >
      <template #operation-column>
        <el-table-column :label="$t('Base.operation')">
          <template #default="{ row, $index }">
            <TableButton @click="handleEdit(row, $index)">
              {{ $t('Base.edit') }}
            </TableButton>
            <TableButton plain @click="handleDelete(row, $index)">
              {{ $t('Base.delete') }}
            </TableButton>
            <TableDropdown
              :row-data="row"
              :position="$index"
              :is-auth-item="false"
              :table-data-len="allTableData.length"
              @move-up="relativeMove($index, -1)"
              @move-down="relativeMove($index, 1)"
              @move-to-top="absoluteMove($index, 0)"
              @move-to-bottom="absoluteMove($index, allTableData.length - 1)"
            />
          </template>
        </el-table-column>
      </template>
    </AuthzRulesTable>
    <div v-else>
      <!-- bind `key` is a hack for re-render table component to remove shake phenomenon -->
      <el-table :key="type" :data="tableData" v-loading.lock="lockTable">
        <el-table-column type="expand">
          <template #default="{ row }">
            <AuthzRulesTable :data="row.rules" />
          </template>
        </el-table-column>
        <el-table-column v-if="type === BuiltInDBType.Client" :label="$t('Base.clientid')">
          <template #default="{ row }">
            {{ replaceSpaceForHTML(row.clientid) }}
          </template>
        </el-table-column>
        <el-table-column v-else-if="type === BuiltInDBType.User" :label="$t('Base.username')">
          <template #default="{ row }">
            {{ replaceSpaceForHTML(row.username) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Auth.permissionCount')">
          <template #default="{ row }">
            {{ row.rules.length }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Base.operation')">
          <template #default="{ row, $index }">
            <TableButton @click="handleEdit(row, $index)">
              {{ $t('Base.edit') }}
            </TableButton>
            <TableButton plain @click="handleDelete(row, $index)">
              {{ $t('Base.delete') }}
            </TableButton>
          </template>
        </el-table-column>
      </el-table>
      <div class="emq-table-footer">
        <common-pagination v-model:metaData="pageMeta" @loadPage="loadData" />
      </div>
    </div>
    <el-dialog
      :title="isEdit ? $t('Base.edit') : $t('Base.add')"
      width="1300px"
      v-model="dialogVisible"
    >
      <el-form
        ref="recordForm"
        :model="record"
        :rules="getRules()"
        label-position="top"
        require-asterisk-position="right"
      >
        <template v-if="isTypeAll">
          <el-form-item prop="action" :label="$t('Auth.action')">
            <el-select v-model="record.action">
              <el-option
                v-for="{ label, value } in actionOpts"
                :key="value"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="permission" :label="$t('Auth.permission')">
            <el-select v-model="record.permission">
              <el-option
                v-for="{ label, value } in permissionOpts"
                :key="value"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="topic">
            <template #label>
              {{ $t('Base.topic') }}
              <InfoTooltip :content="$t('Auth.topicTips', ['{username}', '{clientid}'])" />
            </template>
            <el-input v-model="record.topic" />
          </el-form-item>
          <el-form-item prop="qos" label="QoS">
            <el-select v-model="record.qos" multiple>
              <el-option v-for="item in QoSOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item prop="retain" label="Retain" clearable>
            <el-select v-model="record.retain">
              <el-option :value="true" label="true" />
              <el-option :value="false" label="false" />
              <el-option value="all" :label="t('Base.all')" />
            </el-select>
          </el-form-item>
          <el-form-item prop="clientid_re" :label="t('Clients.clientIdReg')">
            <el-input v-model="record.clientid_re" />
          </el-form-item>
          <el-form-item prop="username_re" :label="t('Clients.usernameReg')">
            <el-input v-model="record.username_re" />
          </el-form-item>
          <el-form-item prop="ipaddr" :label="t('Clients.ipAddressRange')">
            <el-input v-model="record.ipaddr" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item
            v-if="type === BuiltInDBType.Client"
            prop="clientid"
            :label="$t('Base.clientid')"
          >
            <el-input v-model="record.clientid" :disabled="isEdit" />
          </el-form-item>
          <el-form-item
            v-else-if="type === BuiltInDBType.User"
            prop="username"
            :label="$t('Base.username')"
          >
            <el-input v-model="record.username" :disabled="isEdit" />
          </el-form-item>
          <el-form-item>
            <AuthzRulesTable class="form-table shadow-none" :data="rulesData" is-edit>
              <template #operation-column>
                <el-table-column align="right" max-width="160px">
                  <template #header>
                    <el-button link type="primary" class="btn" @click="addColumn">
                      {{ $t('Base.add') }}
                    </el-button>
                  </template>
                  <template #default="{ row, $index }">
                    <el-button
                      link
                      type="primary"
                      :disabled="$index === 0"
                      @click="handleUp(row, $index)"
                    >
                      {{ $t('Base.up') }}
                    </el-button>
                    <el-button
                      link
                      type="primary"
                      :disabled="$index === rulesData.length - 1"
                      @click="handleDown(row, $index)"
                    >
                      {{ $t('Base.down') }}
                    </el-button>
                    <el-button link type="primary" class="btn" @click="deleteItem(row, $index)">
                      {{ $t('Base.delete') }}
                    </el-button>
                  </template>
                </el-table-column>
              </template>
            </AuthzRulesTable>
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

<script lang="ts" setup>
import {
  loadBuiltInDatabaseData,
  createBuiltInDatabaseData,
  deleteBuiltInDatabaseData,
  updateBuiltInDatabaseData,
  updateAllBuiltInDatabaseData,
} from '@/api/auth'
import { AuthzRuleAction, AuthzRulePermission } from '@/types/typeAlias'
import { BuiltInDBItem, BuiltInDBRule } from '@/types/auth'
import { BuiltInDBType, QoSLevel } from '@/types/enum'
import AuthzRulesTable from './AuthzRulesTable.vue'
import TableDropdown from './TableDropdown.vue'
import { SortableEvent } from 'sortablejs'

interface AllTableDataItem {
  action: string
  permission: string
  topic: string
}

const { t } = useI18n()

const type = ref<BuiltInDBType>(BuiltInDBType.Client)
const lockTable = ref(false)
const typeList = [
  {
    label: t('Base.clientid'),
    value: BuiltInDBType.Client,
  },
  {
    label: t('Base.username'),
    value: BuiltInDBType.User,
  },
  {
    label: t('Auth.allUsers'),
    value: BuiltInDBType.All,
  },
]
const recordForm = ref()
const tableData = ref([])
const allTableData = ref<BuiltInDBRule[]>([])
const rulesData = ref<BuiltInDBRule[]>([])
const createRawRuleItem = (): BuiltInDBRule => ({
  topic: '',
  permission: AuthzRulePermission.allow,
  action: AuthzRuleAction.publish,
  qos: [QoSLevel.QoS0, QoSLevel.QoS1, QoSLevel.QoS2],
  retain: 'all',
  clientid_re: '',
  username_re: '',
  ipaddr: '',
})
const createRawRecord = () => ({
  clientid: '',
  username: '',
  rules: [],
  ...createRawRuleItem(),
})
const record = ref(createRawRecord())
const dialogVisible = ref(false)
const isEdit = ref(false)
const editIndex = ref(0)
const searchVal = ref('')

const { actionOpts, permissionOpts } = useAuthzManager()

const isTypeAll = computed(() => type.value === BuiltInDBType.All)

const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const { createRequiredRule } = useFormRules()
const getRules = function () {
  return {
    clientid: createRequiredRule(t('Base.clientid')),
    username: createRequiredRule(t('Base.username')),
    permission: createRequiredRule(t('Auth.permission'), 'select'),
    action: createRequiredRule(t('Auth.action'), 'select'),
    topic: createRequiredRule(t('Base.topic')),
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
const getKeyByCurrentType = () => {
  return type.value === BuiltInDBType.Client ? 'clientid' : 'username'
}
const loadData = async (params = {}) => {
  lockTable.value = true

  const sendParams: Record<string, string | number> = {
    ...pageParams.value,
    ...params,
  }
  if (searchVal.value) {
    sendParams[`like_${getKeyByCurrentType()}`] = searchVal.value
  }
  const res = await loadBuiltInDatabaseData(type.value, isTypeAll.value ? {} : sendParams).catch(
    () => {
      lockTable.value = false
    },
  )
  if (isTypeAll.value) {
    allTableData.value = res.rules
    await nextTick()
    initSortable()
  } else {
    tableData.value = res?.data
    setPageMeta(res?.meta)
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
  record.value = createRawRecord()
  rulesData.value = []
}
const addColumn = () => {
  rulesData.value.push(createRawRuleItem())
}
const deleteItem = (row: BuiltInDBItem, index: number) => {
  rulesData.value.splice(index, 1)
}
const handleSubmit = function () {
  recordForm.value.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    const data: {
      [key: string]: any
    } = {}
    if (type.value !== BuiltInDBType.All) {
      const key = getKeyByCurrentType()
      data[key] = record.value[key]
      data.rules = rulesData.value
      if (!isEdit.value) {
        await createBuiltInDatabaseData(type.value, [data])
        ElMessage.success(t('Base.createSuccess'))
      } else {
        await updateBuiltInDatabaseData(type.value, data[key], data)
        ElMessage.success(t('Base.updateSuccess'))
      }
    } else {
      Object.assign(data, pick(record.value, Object.keys(createRawRuleItem())))
      const rules = cloneDeep(allTableData.value)
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

const { confirmDel } = useOperationConfirm()
const submitDel = async (row: BuiltInDBItem, index: number) => {
  try {
    if (!isTypeAll.value) {
      const key = getKeyByCurrentType()
      await deleteBuiltInDatabaseData(type.value, row[key])
    } else {
      const rules = cloneDeep(allTableData.value)
      rules.splice(index, 1)
      await updateAllBuiltInDatabaseData({ rules })
    }
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}
const handleDelete = async function (row: BuiltInDBItem, index: number) {
  try {
    await confirmDel(() => submitDel(row, index))
    resetPageAndLoadData()
  } catch (error) {
    //
  }
}
const handleEdit = function (row: BuiltInDBItem | BuiltInDBRule, index: number) {
  dialogVisible.value = true
  isEdit.value = true
  editIndex.value = 0
  if (!isTypeAll.value) {
    const _row = row as BuiltInDBItem
    const key = getKeyByCurrentType()
    record.value[key] = _row[key]
    rulesData.value = cloneDeep(_row.rules)
  } else {
    const _row = row as BuiltInDBRule
    editIndex.value = index
    record.value = Object.assign(record.value, cloneDeep(_row))
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
    [BuiltInDBType.Client]: t('Base.clientid'),
    [BuiltInDBType.User]: t('Base.username'),
  }
  return typeMap[type]
}

const resetPageAndLoadData = () => {
  initPageMeta()
  loadData()
}

const reorderAllTableData = async (rules: Array<AllTableDataItem>) => {
  try {
    await updateAllBuiltInDatabaseData({ rules })
  } catch (error) {
    //
  } finally {
    loadData()
  }
}

const moveToTargetPosition = async (nowIndex: number, targetIndex: number) => {
  const order = [...allTableData.value]
  const [removed] = order.splice(nowIndex, 1)
  order.splice(targetIndex, 0, removed)
  reorderAllTableData(order)
}

const relativeMove = (nowIndex: number, relativePosition: number) => {
  const targetIndex = nowIndex + relativePosition
  if (targetIndex < 0 || targetIndex >= allTableData.value.length) {
    return
  }
  moveToTargetPosition(nowIndex, targetIndex)
}

const absoluteMove = (nowIndex: number, absolutePosition: number) => {
  if (nowIndex === absolutePosition) {
    return
  }
  moveToTargetPosition(nowIndex, absolutePosition)
}

const handleOrderChanged = async (evt: SortableEvent) => {
  const { newIndex, oldIndex } = evt
  if (newIndex === undefined || oldIndex === undefined) {
    return
  }
  absoluteMove(oldIndex, newIndex)
}

const { tableCom, initSortable } = useSortableTable(handleOrderChanged)
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
      .el-button {
        padding: 0;
        margin-right: 0;
        border: none;
        & + .el-button {
          margin-left: 8px;
        }
      }
    }
  }
  .table-dropdown {
    display: inline-flex;
  }
}
</style>
