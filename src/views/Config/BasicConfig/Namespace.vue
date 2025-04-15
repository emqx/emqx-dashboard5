<template>
  <div class="namespace app-wrapper">
    <div class="section-header">
      <div></div>
      <CreateButton @click="handleCreate" />
    </div>
    <el-table v-loading="loading" :data="namespaces" style="width: 100%">
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
      <el-table-column
        prop="config.session.max_sessions"
        :label="tl('targetMaxPubRate', { target: tl('tenant') })"
        :min-width="192"
      >
        <template #default="{ row }">
          {{ row.config?.limiter?.tenant?.bytes?.rate ?? tl('noConfigured') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="config.session.max_sessions"
        :label="tl('targetMaxPubRate', { target: tl('client') })"
        :min-width="192"
      >
        <template #default="{ row }">
          {{ row.config?.limiter?.client?.bytes?.rate ?? tl('noConfigured') }}
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.operation')" :min-width="168">
        <template #default="{ row }">
          <TableButton :disabled="!$hasPermission('put')" @click="handleEdit(row)">
            {{ t('Base.edit') }}
          </TableButton>
          <TableButton :disabled="!$hasPermission('delete')" @click="handleDelete(row)">
            {{ t('Base.delete') }}
          </TableButton>
        </template>
      </el-table-column>
    </el-table>
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
  <NamespaceDialog
    :namespace="currentNamespace"
    v-model="dialogVisible"
    @submitted="loadNamespaces"
  />
</template>

<script lang="ts" setup>
import { deleteManagedNamespace } from '@/api/config'
import useNamespace from '@/hooks/Config/useNamespace'
import useI18nTl from '@/hooks/useI18nTl'
import { NamespaceItem } from '@/types/config'
import { ref } from 'vue'
import NamespaceDialog from './components/NamespaceDialog.vue'

const { tl, t } = useI18nTl('BasicConfig')

const loading = ref(false)
const dialogVisible = ref(false)
const namespaces = ref<Array<NamespaceItem>>([])

const currentNamespace = ref<NamespaceItem | undefined>(undefined)

const { queryNamespaceList } = useNamespace()
/**
 * because the namespace list is not updated when the namespace is deleted, so we need to filter the namespace list
 */
const loadNamespaces = async (filterItem?: string) => {
  loading.value = true
  try {
    namespaces.value = await queryNamespaceList(filterItem)
  } catch (error) {
    console.error('Failed to load namespaces:', error)
  } finally {
    loading.value = false
  }
}
loadNamespaces()

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
    loadNamespaces(currentNamespace.value.ns)
    showDeleteDialog.value = false
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.delete-namespace-tip-content {
  p {
    margin: 0;
    line-height: 1.5;
  }
}
</style>
