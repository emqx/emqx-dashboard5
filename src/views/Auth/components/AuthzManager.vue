<template>
  <div class="authz-manager">
    <el-radio-group v-model="type" class="mr-5">
      <el-radio-button v-for="item in typeList" :key="item.value" :value="item.value" border>
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
    <div class="section-searchbar" :gutter="20">
      <el-row :gutter="20">
        <el-col :span="6">
          <NamespaceSelect
            v-model="namespace"
            class="flex-0"
            :clearable="false"
            @change="resetPageAndLoadData"
          />
        </el-col>
        <template v-if="!isTypeAll">
          <el-col :span="6">
            <el-input
              v-model="searchVal"
              clearable
              :placeholder="getCurrSearchValTip(type)"
              @clear="resetPageAndLoadData"
              @keyup.enter="resetPageAndLoadData"
            />
          </el-col>
          <el-col :span="6">
            <SearchButton @click="resetPageAndLoadData" />
            <RefreshButton @click="loadData" />
          </el-col>
        </template>
        <!-- placeholder for namespace user -->
        <el-col :span="!isTypeAll ? 6 : 18">
          <div class="flex justify-end">
            <CreateButton @click="handleAdd">{{ t('Base.add') }}</CreateButton>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-if="isTypeAll"
      ref="tableCom"
      row-key="topic"
      :data="allTableData"
      v-loading.lock="lockTable"
      class="table-with-draggable"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <el-card>
            <AuthzRuleForm :model-value="row" :type="BuiltInDBType.All" />
          </el-card>
        </template>
      </el-table-column>
      <el-table-column :label="tl('action')" :min-width="isEdit ? 124 : 80">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.action, actionOpts) }}
        </template>
      </el-table-column>
      <el-table-column prop="permission" :label="tl('permission')" min-width="104">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.permission, permissionOpts) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="topic"
        :label="t('Base.topic')"
        min-width="80"
        class-name="overflow-visible"
      >
        <template #default="{ row }">
          {{ replaceSpaceForHTML(row.topic) }}
        </template>
      </el-table-column>
      <el-table-column prop="qos" label="QoS" :min-width="isEdit ? 210 : 70">
        <template #default="{ row }">
          {{ row.qos?.join?.(', ') }}
        </template>
      </el-table-column>
      <el-table-column prop="retain" label="Retain" min-width="80">
        <template #default="{ row }">
          {{ row.retain === 'all' ? t('Base.all') : row.retain }}
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.operation')" min-width="210">
        <template #default="{ row, $index }">
          <TableButton :disabled="!$hasPermission('put')" @click="handleEdit(row, $index)">
            {{ $t('Base.edit') }}
          </TableButton>
          <TableButton :disabled="!$hasPermission('delete')" @click="handleDelete(row, $index)">
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
    </el-table>

    <div v-else>
      <!-- bind `key` is a hack for re-render table component to remove shake phenomenon -->
      <el-table :key="type" :data="tableData" v-loading.lock="lockTable">
        <el-table-column type="expand">
          <template #default="{ row }">
            <AuthzRuleList :data="row.rules" :type="type" />
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
            <el-popover
              placement="top-start"
              :width="188"
              :disabled="!tableButtonsDisabled"
              :content="t('Base.operationDisabled')"
            >
              <template #reference>
                <div class="inline">
                  <TableButton
                    :disabled="!$hasPermission('put') || tableButtonsDisabled"
                    @click="handleEdit(row, $index)"
                  >
                    {{ $t('Base.edit') }}
                  </TableButton>
                  <TableButton
                    :disabled="!$hasPermission('delete') || tableButtonsDisabled"
                    @click="handleDelete(row, $index)"
                  >
                    {{ $t('Base.delete') }}
                  </TableButton>
                </div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="emq-table-footer">
        <common-pagination v-model:metaData="pageMeta" @loadPage="loadData" />
      </div>
    </div>
    <el-dialog
      :title="isEdit ? $t('Base.edit') : $t('Base.add')"
      :width="isTypeAll ? '800px' : '1300px'"
      v-model="dialogVisible"
      destroy-on-close
    >
      <template v-if="isTypeAll">
        <el-row :gutter="20" v-if="!isNamespaceUser">
          <el-col :span="12">
            <el-form-item :label="t('BasicConfig.namespace')" label-position="top">
              <NamespaceSelectSwitch v-model="recordNamespace" :disabled="isEdit" />
            </el-form-item>
          </el-col>
        </el-row>
        <AuthzRuleForm
          ref="recordForm"
          v-model="record"
          is-edit
          :column="2"
          :rules="formRules"
          :type="BuiltInDBType.All"
        />
      </template>

      <el-form
        v-else
        ref="recordForm"
        :model="record"
        :rules="formRules"
        label-position="top"
        require-asterisk-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12" v-if="!isNamespaceUser">
            <el-form-item :label="t('BasicConfig.namespace')">
              <NamespaceSelectSwitch v-model="recordNamespace" :disabled="isEdit" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <AuthzRuleList
            ref="authzRuleListRef"
            class="form-table shadow-none"
            :data="record.rules"
            :type="type"
            is-edit
          >
            <template #add-button>
              <div class="button-bar">
                <CreateButton @click="addColumn" type="default">
                  {{ t('Auth.addPermission') }}
                </CreateButton>
              </div>
            </template>
            <template #operation="{ row, $index }">
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
                :disabled="$index === record.rules.length - 1"
                @click="handleDown(row, $index)"
              >
                {{ $t('Base.down') }}
              </el-button>
              <el-button link type="primary" class="btn" @click="deleteItem(row, $index)">
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </AuthzRuleList>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <CancelButton :disabled="isSubmitting" @click="dialogVisible = false" />
          <el-button
            type="primary"
            :disabled="!$hasPermission('post')"
            :loading="isSubmitting"
            @click="handleSubmit"
          >
            {{ isEdit ? $t('Base.update') : $t('Base.add') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  createBuiltInDatabaseData,
  deleteBuiltInDatabaseData,
  loadBuiltInDatabaseData,
  updateAllBuiltInDatabaseData,
  updateBuiltInDatabaseData,
} from '@/api/auth'
import useAuthzDataHandler from '@/hooks/Auth/useAuthzDataHandler'
import { BuiltInDBItem, BuiltInDBRule } from '@/types/auth'
import { BuiltInDBType, QoSLevel } from '@/types/enum'
import { AuthzRuleAction, AuthzRulePermission } from '@/types/typeAlias'
import { SortableEvent } from 'sortablejs'
import AuthzRuleForm from './AuthzRuleForm.vue'
import AuthzRuleList from './AuthzRuleList.vue'
import TableDropdown from './TableDropdown.vue'

interface AllTableDataItem {
  action: string
  permission: string
  topic: string
}

interface RecordData extends BuiltInDBRule {
  clientid: string
  username: string
  rules: BuiltInDBRule[]
}

const { t, tl } = useI18nTl('Auth')
const store = useStore()
const currentUserNamespace = computed(() => store.getters.userNamespace)
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)

const type = ref<BuiltInDBType>(BuiltInDBType.Client)
const namespace = ref<string | undefined>(
  isNamespaceUser.value ? currentUserNamespace.value : undefined,
)
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
const authzRuleListRef = ref()
const tableData = ref([])
const allTableData = ref<BuiltInDBRule[]>([])
const createRawRuleItem = (): BuiltInDBRule => ({
  topic: '',
  permission: AuthzRulePermission.allow,
  action: AuthzRuleAction.publish,
  qos: [QoSLevel.QoS0, QoSLevel.QoS1, QoSLevel.QoS2],
  retain: 'all',
  clientid_re: '',
  username_re: '',
  ipaddr: '',
  zone: '',
  zone_re: '',
  listener: '',
  listener_re: '',
})
const createRawRecord = (): RecordData => ({
  clientid: '',
  username: '',
  rules: [],
  ...createRawRuleItem(),
})
const record = ref(createRawRecord())
const recordNamespace = ref<string | undefined>(undefined)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editIndex = ref(0)
const searchVal = ref('')

const { actionOpts, permissionOpts } = useAuthzManager()

const isTypeAll = computed(() => type.value === BuiltInDBType.All)

const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const tableButtonsDisabled = computed(() => {
  return isNamespaceUser.value && namespace.value !== currentUserNamespace.value
})

const { createRequiredRule } = useFormRules()
const formRules = {
  clientid: createRequiredRule(t('Base.clientid')),
  username: createRequiredRule(t('Base.username')),
  permission: createRequiredRule(t('Auth.permission'), 'select'),
  action: createRequiredRule(t('Auth.action'), 'select'),
  topic: createRequiredRule(t('Base.topic')),
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
  const nsParams = { ns: namespace.value }
  const sendParams: Record<string, string | number | undefined> = {
    ...pageParams.value,
    ...params,
    ...nsParams,
  }
  if (searchVal.value) {
    sendParams[`like_${getKeyByCurrentType()}`] = searchVal.value
  }
  const res: any = await loadBuiltInDatabaseData(
    type.value,
    isTypeAll.value ? nsParams : sendParams,
  ).catch(() => {
    lockTable.value = false
  })
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
  addColumn()
  recordNamespace.value = isNamespaceUser.value ? currentUserNamespace.value : namespace.value
  if (recordForm.value) {
    setTimeout(recordForm.value.clearValidate, 10)
  }
}
const handleCancel = function () {
  dialogVisible.value = false
  record.value = createRawRecord()
}
const addColumn = () => {
  record.value.rules.push(createRawRuleItem())
}
const deleteItem = (row: BuiltInDBItem, index: number) => {
  record.value.rules.splice(index, 1)
}

const { handleRulesBeforeSubmit } = useAuthzDataHandler()

const isSubmitting = ref(false)
const handleSubmit = async () => {
  try {
    await Promise.all([
      recordForm.value.validate(),
      !isTypeAll.value ? authzRuleListRef.value.validate() : Promise.resolve(),
    ])
    isSubmitting.value = true
    const data: {
      [key: string]: any
    } = {}
    const params = { ns: recordNamespace.value }
    if (type.value !== BuiltInDBType.All) {
      const key = getKeyByCurrentType()
      data[key] = record.value[key]
      data.rules = handleRulesBeforeSubmit(record.value.rules)
      if (!isEdit.value) {
        await createBuiltInDatabaseData(type.value, [data], params)
        ElMessage.success(t('Base.createSuccess'))
      } else {
        await updateBuiltInDatabaseData(type.value, data[key], data, params)
        ElMessage.success(t('Base.updateSuccess'))
      }
    } else {
      let currentRules = cloneDeep(allTableData.value)
      if (namespace.value !== recordNamespace.value) {
        //
        const allData = await loadBuiltInDatabaseData(BuiltInDBType.All, {
          ns: recordNamespace.value,
        })
        currentRules = allData.rules
      }
      Object.assign(data, pick(record.value, Object.keys(createRawRuleItem())))
      if (!isEdit.value) {
        currentRules.push(data as BuiltInDBRule)
      } else {
        currentRules.splice(editIndex.value, 1, data as BuiltInDBRule)
      }
      await updateAllBuiltInDatabaseData({ rules: handleRulesBeforeSubmit(currentRules) }, params)
    }
    dialogVisible.value = false
    namespace.value = recordNamespace.value
    loadData()
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

const { confirmDel } = useOperationConfirm()
const submitDel = async (row: BuiltInDBItem, index: number) => {
  try {
    const params = { ns: namespace.value }
    if (!isTypeAll.value) {
      const key = getKeyByCurrentType()
      await deleteBuiltInDatabaseData(type.value, row[key], params)
    } else {
      const rules = cloneDeep(allTableData.value)
      rules.splice(index, 1)
      await updateAllBuiltInDatabaseData({ rules }, params)
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
  recordNamespace.value = namespace.value
  if (!isTypeAll.value) {
    const _row = row as BuiltInDBItem
    const key = getKeyByCurrentType()
    record.value[key] = _row[key]
    record.value.rules = cloneDeep(_row.rules)
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
  swapArray(record.value.rules, index, index - 1)
}
const handleDown = (row: BuiltInDBItem, index: number) => {
  if (index === record.value.rules.length - 1) {
    return
  }
  swapArray(record.value.rules, index, index + 1)
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
  padding-bottom: 32px;
  .section-searchbar {
    margin-bottom: 20px;
    margin-top: 32px;
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
.button-bar {
  display: flex;
  margin-top: 16px;
  justify-content: flex-end;
  width: 100%;
}
</style>
