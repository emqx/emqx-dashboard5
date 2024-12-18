<template>
  <el-card class="authz-manager">
    <el-radio-group v-model="type">
      <el-radio-button v-for="item in typeList" :key="item.value" :label="item.value" border>
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
    <div class="section-searchbar" :gutter="20">
      <el-tooltip :content="$t('Base.add')" placement="top">
        <el-button
          class="icon-button"
          :disabled="!$hasPermission('post')"
          type="primary"
          :icon="Plus"
          @click="handleAdd"
        >
        </el-button>
      </el-tooltip>
      <div class="searchbar-content">
        <template v-if="!isTypeAll">
          <el-input
            v-model="searchVal"
            clearable
            :placeholder="getCurrSearchValTip(type)"
            @clear="resetPageAndLoadData"
            @keyup.enter="resetPageAndLoadData"
          />
          <el-tooltip :content="$t('Base.search')" placement="top">
            <el-button type="primary" plain :icon="Search" @click="resetPageAndLoadData">
            </el-button>
          </el-tooltip>
          <el-tooltip :content="$t('Base.refresh')" placement="top">
            <el-button class="icon-button" type="primary" :icon="Refresh" @click="loadData">
            </el-button>
          </el-tooltip>
        </template>
      </div>
    </div>
    <el-table
      ref="tableCom"
      v-if="isTypeAll"
      :data="allTableData"
      v-loading.lock="lockTable"
      row-key="topic"
      class="table-with-draggable"
    >
      <el-table-column v-if="false" type="expand" />
      <el-table-column prop="action" :label="$t('Auth.action')">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.action, actionOpts) }}
        </template>
      </el-table-column>
      <el-table-column prop="permission" :label="$t('Auth.permission')">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.permission, permissionOpts) }}
        </template>
      </el-table-column>
      <el-table-column prop="topic" :label="$t('Base.topic')">
        <template #default="{ row }">
          {{ replaceSpaceForHTML(row.topic) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row, $index }">
          <el-button
            size="small"
            :disabled="!$hasPermission('put')"
            @click="handleEdit(row, $index)"
          >
            {{ $t('Base.edit') }}
          </el-button>
          <el-button
            size="small"
            :disabled="!$hasPermission('delete')"
            plain
            @click="handleDelete(row, $index)"
          >
            {{ $t('Base.delete') }}
          </el-button>
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
            <el-table :data="row.rules">
              <el-table-column :label="$t('Auth.action')" min-width="80px">
                <template #default="{ row }">
                  {{ getLabelFromValueInOptionList(row.action, actionOpts) }}
                </template>
              </el-table-column>
              <el-table-column prop="permission" :label="$t('Auth.permission')" min-width="80px">
                <template #default="{ row }">
                  {{ getLabelFromValueInOptionList(row.permission, permissionOpts) }}
                </template>
              </el-table-column>
              <el-table-column prop="topic" :label="$t('Base.topic')" />
            </el-table>
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
            <el-button
              size="small"
              :disabled="!$hasPermission('put')"
              @click="handleEdit(row, $index)"
            >
              {{ $t('Base.edit') }}
            </el-button>
            <el-button
              size="small"
              :disabled="!$hasPermission('delete')"
              plain
              @click="handleDelete(row, $index)"
            >
              {{ $t('Base.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="emq-table-footer">
        <common-pagination v-model:metaData="pageMeta" @loadPage="loadData" />
      </div>
    </div>
    <el-dialog
      :title="isEdit ? $t('Base.edit') : $t('Base.add')"
      width="700px"
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
            <el-table class="form-table shadow-none" :data="rulesData">
              <el-table-column prop="action" :label="$t('Auth.action')" :width="220">
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
              <el-table-column prop="permission" :label="$t('Auth.permission')">
                <template #default="{ row }">
                  <el-select v-model="row.permission">
                    <el-option
                      v-for="{ label, value } in permissionOpts"
                      :key="value"
                      :value="value"
                      :label="label"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="topic" :label="$t('Base.topic')">
                <template #default="{ row }">
                  <el-input v-model="row.topic" />
                </template>
              </el-table-column>
              <el-table-column align="right" max-width="160px">
                <template #header>
                  <a href="javascript:;" class="btn" @click="addColumn">
                    {{ $t('Base.add') }}
                  </a>
                </template>
                <template #default="{ row, $index }">
                  <a
                    href="javascript:;"
                    :class="['btn', { disabled: $index === 0 }]"
                    @click="handleUp(row, $index)"
                  >
                    {{ $t('Base.up') }}
                  </a>
                  <a
                    href="javascript:;"
                    :class="['btn', { disabled: $index === rulesData.length - 1 }]"
                    @click="handleDown(row, $index)"
                  >
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
          <el-button type="primary" :disabled="!$hasPermission('post')" @click="handleSubmit">
            {{ isEdit ? $t('Base.update') : $t('Base.add') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue'
import {
  loadBuiltInDatabaseData,
  createBuiltInDatabaseData,
  deleteBuiltInDatabaseData,
  updateBuiltInDatabaseData,
  updateAllBuiltInDatabaseData,
} from '@/api/auth'
import _, { cloneDeep } from 'lodash'
import commonPagination from '@/components/commonPagination.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { ElMessage, ElMessageBox as MB } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { BuiltInDBItem, BuiltInDBRule } from '@/types/auth'
import { replaceSpaceForHTML } from '@/common/tools'
import { getLabelFromValueInOptionList } from '@/common/tools'
import { BuiltInDBType } from '@/types/enum'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import TableDropdown from './TableDropdown.vue'
import useSortableTable from '@/hooks/useSortableTable'
import { SortableEvent } from 'sortablejs'

interface AllTableDataItem {
  action: string
  permission: string
  topic: string
}

export default defineComponent({
  components: { commonPagination, InfoTooltip, TableDropdown },
  name: 'AuthzManager',
  setup() {
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
      { value: 'publish', label: t('Auth.publish') },
      { value: 'subscribe', label: t('Auth.subscribe') },
      { value: 'all', label: t('Auth.all') },
    ]

    const permissionOpts = [
      { value: 'allow', label: t('Base.allow') },
      { value: 'deny', label: t('Base.deny') },
    ]

    const isTypeAll = computed(() => type.value === BuiltInDBType.All)

    const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

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
      const res = await loadBuiltInDatabaseData(
        type.value,
        isTypeAll.value ? {} : sendParams,
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
        const data: {
          [key: string]: any
        } = {}
        if (type.value !== BuiltInDBType.All) {
          const key = getKeyByCurrentType()
          data[key] = record[key]
          data.rules = rulesData.value
          if (!isEdit.value) {
            await createBuiltInDatabaseData(type.value, [data])
            ElMessage.success(t('Base.createSuccess'))
          } else {
            await updateBuiltInDatabaseData(type.value, data[key], data)
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
        confirmButtonClass: 'confirm-danger',
        type: 'warning',
      })
        .then(async () => {
          if (!isTypeAll.value) {
            const key = getKeyByCurrentType()
            await deleteBuiltInDatabaseData(type.value, row[key]).catch(() => {
              // ignore error
            })
          } else {
            const rules = _.cloneDeep(allTableData.value)
            rules.splice(index, 1)
            await updateAllBuiltInDatabaseData({
              rules,
            })
          }
          resetPageAndLoadData()
        })
        .catch(() => {
          // ignore error
        })
    }
    const handleEdit = function (row: BuiltInDBItem | BuiltInDBRule, index: number) {
      dialogVisible.value = true
      isEdit.value = true
      editIndex.value = 0
      if (!isTypeAll.value) {
        const _row = row as BuiltInDBItem
        const key = getKeyByCurrentType()
        record[key] = _row[key]
        rulesData.value = cloneDeep(_row.rules)
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

    return {
      BuiltInDBType,
      Plus,
      Search,
      Refresh,
      tableCom,
      recordForm,
      type,
      typeList,
      isTypeAll,
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
      permissionOpts,
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
      getCurrSearchValTip,
      replaceSpaceForHTML,
      getLabelFromValueInOptionList,
      relativeMove,
      absoluteMove,
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
      .btn.disabled {
        cursor: not-allowed;
        color: var(--color-text-placeholder);
      }
      .btn + .btn {
        margin-left: 8px;
      }
    }
  }
  .table-dropdown {
    display: inline-flex;
  }
}
</style>
