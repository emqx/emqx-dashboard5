<template>
  <div class="external-schema app-wrapper">
    <div class="section-header">
      <div></div>
      <CreateButton @click="addSchema" />
    </div>
    <el-table :data="schemaList" v-loading="isLoading">
      <el-table-column prop="name" :label="t('Base.name')" :min-width="200" />
      <el-table-column prop="type" :label="tl('type')" :min-width="200">
        <template #default="{ row }">
          {{ getLabelByValue(row.type) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" :min-width="150">
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
import { deleteExternalSchema, getExternalSchemas } from '@/api/ruleengine'
import useExternalSchemaType from '@/hooks/Rule/schema/useExternalSchemaType'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import type { ExternalSchema } from '@/types/typeAlias'

import { useRouter } from 'vue-router'
import TableItemDropdown from './components/TableItemDropdown.vue'

const router = useRouter()
const { tl, t } = useI18nTl('RuleEngine')

const schemaList: Ref<Array<ExternalSchema>> = ref([])
const isLoading = ref(false)

const { getLabelByValue } = useExternalSchemaType()

const getSchemas = async () => {
  try {
    isLoading.value = true
    const nameValueMap = await getExternalSchemas()
    schemaList.value = Object.entries(nameValueMap).reduce(
      (arr: Array<ExternalSchema>, [name, value]) => {
        if (typeof value === 'object' && value !== null) {
          arr.push({ name, ...value })
        } else {
          console.error(`Invalid value for schema: ${name}`, value)
        }
        return arr
      },
      [],
    )
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const goSchemaDetail = (name: string) =>
  router.push({ name: 'external-schema-detail', params: { schemaName: name } })

const addSchema = () => {
  router.push({ name: 'external-schema-create' })
}

const handleCopy = (name: string) => {
  router.push({ name: 'external-schema-create', query: { action: 'copy', target: name } })
}

const { confirmDel } = useOperationConfirm()
const handleDel = async (name: string) => {
  await confirmDel(() => deleteExternalSchema(name))
  getSchemas()
}

onMounted(() => {
  getSchemas()
})
</script>
