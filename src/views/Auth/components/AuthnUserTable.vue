<template>
  <el-table :data="data">
    <el-table-column prop="user_id" :label="getFiledLabel(field)">
      <template #default="{ row }">
        {{ replaceSpaceForHTML(row.user_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="is_superuser" :label="t('Auth.isSuperuser')">
      <template #default="{ row }">
        {{ row.is_superuser ? tl('yes') : tl('no') }}
      </template>
    </el-table-column>
    <el-table-column :label="tl('operation')">
      <template #default="{ row }">
        <TableButton :disabled="!$hasPermission('put')" @click="handleEdit(row)">
          {{ tl('edit') }}
        </TableButton>
        <TableButton :disabled="!$hasPermission('delete')" @click="handleDelete(row)">
          {{ tl('delete') }}
        </TableButton>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import useBuiltInDatabaseAuthn from '@/hooks/Auth/useBuiltInDatabaseAuthn'
import { DataManagerItem } from '@/types/auth'

type FieldType = 'username' | 'clientid'

withDefaults(
  defineProps<{
    data: DataManagerItem[]
    field?: FieldType
  }>(),
  {
    field: 'username',
  },
)
const emit = defineEmits<{
  (e: 'edit', row: DataManagerItem): void
  (e: 'delete', row: DataManagerItem): void
}>()

const { t, tl } = useI18nTl('Base')

const handleEdit = (row: DataManagerItem) => {
  emit('edit', row)
}

const handleDelete = (row: DataManagerItem) => {
  emit('delete', row)
}

const { getFiledLabel } = useBuiltInDatabaseAuthn()
</script>

<style lang="scss"></style>
