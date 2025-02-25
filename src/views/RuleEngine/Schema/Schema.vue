<template>
  <div class="exhook app-wrapper">
    <div class="section-header">
      <div></div>
      <CreateButton @click="addSchema" />
    </div>
    <el-table :data="schemaList" v-loading="isLoading">
      <el-table-column prop="name" :label="t('Base.name')" />
      <el-table-column prop="type" :label="tl('type')">
        <template #default="{ row }">
          {{ getLabelByValue(row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="description" :label="t('Base.note')" />
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <TableButton @click="goSchemaDetail(row.name)">
            {{ $t('Base.setting') }}
          </TableButton>
          <TableItemDropdown
            :row-data="row"
            @duplicate="handleCopy(row.name)"
            @delete="handleDel(row.name)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { deleteSchema, querySchemas } from '@/api/ruleengine'
import useSchemaType from '@/hooks/Rule/schema/useSchemaType'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRegistry } from '@/types/rule'
import { ElMessage, ElMessageBox } from 'element-plus'

import TableItemDropdown from './components/TableItemDropdown.vue'

const router = useRouter()
const { tl, t } = useI18nTl('RuleEngine')

const schemaList: Ref<Array<SchemaRegistry>> = ref([])
const isLoading = ref(false)

const { getLabelByValue } = useSchemaType()

const getSchemas = async () => {
  try {
    isLoading.value = true
    schemaList.value = await querySchemas()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const goSchemaDetail = (name: string) =>
  router.push({ name: 'internal-schema-detail', params: { schemaName: name } })

const addSchema = () => {
  router.push({ name: 'internal-schema-create' })
}

const handleCopy = (name: string) => {
  router.push({ name: 'internal-schema-create', query: { action: 'copy', target: name } })
}

const handleDel = async (name: string) => {
  try {
    await ElMessageBox.confirm(t('Base.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    await deleteSchema(name)
    ElMessage.success(t('Base.deleteSuccess'))
    getSchemas()
  } catch (error) {
    //
  }
}

onMounted(() => {
  getSchemas()
})
</script>
