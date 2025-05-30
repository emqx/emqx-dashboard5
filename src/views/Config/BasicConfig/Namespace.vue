<template>
  <div class="namespace app-wrapper">
    <div class="section-header">
      <div>
        <el-switch v-model="onlyManagedNamespaces" @change="handleViewChanged" />
        <p class="tip">{{ tl('managedNamespacesOnly') }}</p>
      </div>
      <div>
        <SettingsButton @click="isConfigsDrawerVisible = true" />
        <CreateButton @click="handleCreate" />
      </div>
    </div>
    <el-table v-loading="loading" :data="namespaceTableData" style="width: 100%">
      <el-table-column prop="ns" :label="tl('namespace')" :min-width="180">
        <template #default="{ row }">
          <CommonOverflowTooltip :content="row.ns" />
        </template>
      </el-table-column>
      <el-table-column
        prop="config.session.max_sessions"
        :label="tl('maxSessions')"
        :min-width="180"
      >
        <template #default="{ row }">
          {{ row.config?.session?.max_sessions ?? '' }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('targetMaxPubRate', { target: tl('tenant') })" :min-width="192">
        <template #default="{ row }">
          {{ row.config?.limiter?.tenant?.bytes?.rate ?? tl('noConfigured') }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('targetMaxPubRate', { target: tl('client') })" :min-width="192">
        <template #default="{ row }">
          {{ row.config?.limiter?.client?.bytes?.rate ?? tl('noConfigured') }}
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.createdAt')" :min-width="164">
        <template #default="{ row }">
          {{ dateFormat(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.operation')" :min-width="224">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            :content="tl('cannotOperateNotExplicitCreatedNamespace')"
            :disabled="!row.not_explicit_created"
          >
            <TableButton
              :disabled="!$hasPermission('put') || row.not_explicit_created"
              @click="handleEdit(row)"
            >
              {{ t('Base.edit') }}
            </TableButton>
          </el-tooltip>
          <TableButton @click="openClientsDrawer(row)">
            {{ t('Clients.clients') }}
          </TableButton>
          <TableButton :disabled="!$hasPermission('delete')" @click="handleDelete(row)">
            {{ t('Base.delete') }}
          </TableButton>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <MiniPagination
        :current-page="page"
        :hasnext="hasNext"
        :page-size="limit"
        :page-sizes="DEFAULT_PAGE_SIZE_OPT"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
  <el-dialog v-model="showDeleteDialog" width="400px">
    <p>{{ tl('deleteNamespaceTip') }}</p>
    <TipContainer>
      <div class="delete-namespace-tip-content">
        <p>{{ tl('deleteNamespaceConfirmFirst') }}</p>
        <i18n-t keypath="BasicConfig.deleteNamespaceConfirmSecond" tag="p">
          <template #target>
            <b>{{ currentNamespace?.ns ?? '' }}</b>
          </template>
        </i18n-t>
      </div>
    </TipContainer>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDeleteDialog = false">
          {{ t('Base.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          @click="confirmDelete"
          :loading="isSubmitting"
        >
          {{ t('Base.delete') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <NamespaceClientsDrawer v-model="isClientsDrawerVisible" :namespace="currentNamespace?.ns" />
  <NamespaceDialog
    :namespace="currentNamespace"
    v-model="dialogVisible"
    @submitted="loadNamespaces"
  />
  <NamespaceConfigDrawer v-model="isConfigsDrawerVisible" />
</template>

<script lang="ts" setup>
import { deleteManagedNamespace } from '@/api/config'
import useNamespace from '@/hooks/Config/useNamespace'
import useI18nTl from '@/hooks/useI18nTl'
import { NamespaceItem } from '@/types/config'
import { ref } from 'vue'
import NamespaceClientsDrawer from './components/NamespaceClientsDrawer.vue'
import NamespaceConfigDrawer from './components/NamespaceConfigDrawer.vue'
import NamespaceDialog from './components/NamespaceDialog.vue'
import { last } from 'lodash'

const { tl, t } = useI18nTl('BasicConfig')

const loading = ref(false)
const dialogVisible = ref(false)

const onlyManagedNamespaces = ref(true)
const namespaceTableData = ref<Array<NamespaceItem>>([])

const { page, limit, cursorMap, hasNext } = useCursorPagination()

const currentNamespace = ref<NamespaceItem | undefined>(undefined)

const { queryAllTypeNamespaceList, queryManagedNamespaceList } = useNamespace()
/**
 * because the namespace list is not updated when the namespace is deleted, so we need to filter the namespace list
 */
const loadNamespaces = async (isBack?: boolean) => {
  loading.value = true
  try {
    const params = {
      last_ns: cursorMap.value.get(page.value),
      limit: limit.value,
    }
    const funcForQuery = onlyManagedNamespaces.value
      ? queryManagedNamespaceList
      : queryAllTypeNamespaceList
    namespaceTableData.value = await funcForQuery(params)
    cursorMap.value.set(page.value + 1, last(namespaceTableData.value)?.ns)
    if (isBack && page.value !== 1 && namespaceTableData.value.length === 0) {
      ElMessage.warning(tl('pageJumpTip'))
      handlePageChange(1)
    }
  } catch (error) {
    console.error('Failed to load namespaces:', error)
  } finally {
    loading.value = false
  }
}
loadNamespaces()

const handlePageChange = (no: number) => {
  const isBack = no < page.value
  page.value = no
  loadNamespaces(isBack)
}

const handleSizeChange = (size: number) => {
  limit.value = size
  handlePageChange(1)
}

const handleViewChanged = () => {
  handlePageChange(1)
}

const handleCreate = () => {
  currentNamespace.value = undefined
  dialogVisible.value = true
}

const handleEdit = async (row: NamespaceItem) => {
  currentNamespace.value = row
  dialogVisible.value = true
}

const showDeleteDialog = ref(false)
const handleDelete = async (row: NamespaceItem) => {
  currentNamespace.value = row
  showDeleteDialog.value = true
}
const isSubmitting = ref(false)
const confirmDelete = async () => {
  if (!currentNamespace.value) {
    return
  }
  isSubmitting.value = true
  try {
    await deleteManagedNamespace(currentNamespace.value.ns)
    if (namespaceTableData.value.length === 1 && page.value > 1) {
      page.value--
    }
    loadNamespaces()
    showDeleteDialog.value = false
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

const isClientsDrawerVisible = ref(false)
const openClientsDrawer = (row: NamespaceItem) => {
  currentNamespace.value = row
  isClientsDrawerVisible.value = true
}

const isConfigsDrawerVisible = ref(false)
</script>

<style lang="scss" scoped>
.section-header {
  .tip {
    margin-left: 12px;
    font-size: 14px;
    font-weight: normal;
    color: var(--color-text-secondary);
  }
}
.delete-namespace-tip-content {
  p {
    margin: 0;
    line-height: 1.5;
  }
  b {
    word-break: break-all;
  }
}
</style>
