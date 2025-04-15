<template>
  <div class="namespace app-wrapper">
    <div class="section-header">
      <div></div>
      <CreateButton @click="handleCreate" />
    </div>
    <el-table v-loading="loading" :data="namespaces" style="width: 100%">
      <el-table-column prop="ns" :label="tl('namespace')">
        <template #default="{ row }">
          <CommonOverflowTooltip :content="row.ns" />
        </template>
      </el-table-column>
      <el-table-column prop="config.session.max_sessions" :label="tl('maxSessions')">
        <template #default="{ row }">
          {{ row.config?.session?.max_sessions ?? t('Base.infinity') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="config.session.max_sessions"
        :label="tl('targetMaxPubRate', { target: tl('tenant') })"
      >
        <template #default="{ row }">
          {{ row.config?.limiter?.tenant?.bytes?.rate ?? t('Base.infinity') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="config.session.max_sessions"
        :label="tl('targetMaxPubRate', { target: tl('client') })"
      >
        <template #default="{ row }">
          {{ row.config?.limiter?.client?.bytes?.rate ?? t('Base.infinity') }}
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.operation')">
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

interface NamespaceData {
  name: string
  client_count: number
  config?: Record<string, any>
}

const loading = ref(false)
const dialogVisible = ref(false)
const namespaces = ref<Array<NamespaceItem>>([])

const currentNamespace = ref<NamespaceItem | undefined>(undefined)

const { queryNamespaceList } = useNamespace()
const loadNamespaces = async () => {
  loading.value = true
  try {
    namespaces.value = await queryNamespaceList()
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

const { confirmDel } = useOperationConfirm()
const handleDelete = async (row: NamespaceData) => {
  try {
    await confirmDel(() => deleteManagedNamespace(row.name), tl('deleteNamespaceTip'))
    loadNamespaces()
  } catch (error) {
    //
  }
}
</script>
