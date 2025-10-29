<template>
  <div class="topics">
    <el-form class="search-wrapper without-padding-top">
      <el-row :gutter="28">
        <el-col :span="8">
          <el-select v-model="selectedNamespace" :placeholder="t('Topics.topic')" clearable>
            <el-option v-for="item in namespaceOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-col>
      </el-row>
    </el-form>
    <div class="app-wrapper">
      <el-table :data="certBundleList" v-loading.lock="isLoading">
        <el-table-column prop="name" :label="t('Base.name')" />
        <el-table-column :label="t('Base.operation')">
          <template #default="{ row }">
            <TableButton :disabled="!$hasPermission('delete')" @click="handleDelete(row)">
              {{ t('Base.delete') }}
            </TableButton>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getManagedNamespaceList } from '@/api/config'
import { CertBundleOut } from '@/types/typeAlias'

const { t } = useI18n()

const isLoading = ref(false)

const selectedNamespace = ref<string>(GLOBAL_NAMESPACE)
const namespaceOptions = ref<string[]>([])
const getNamespaceOptions = async () => {
  try {
    const res = await getManagedNamespaceList({ limit: 10000 })
    namespaceOptions.value = res
  } catch (error) {
    //
  }
}

const certBundleList = ref<CertBundleOut[]>([])

const { getCertBundleList: requestCertBundleList, deleteCertBundle } = useCertBundle()
const getCertBundleList = async () => {
  try {
    isLoading.value = true
    certBundleList.value = await requestCertBundleList()
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const { confirmDel } = useOperationConfirm()
const handleDelete = async (row: CertBundleOut) => {
  const { name } = row
  if (!name) {
    return
  }
  return confirmDel(() => deleteCertBundle(name, selectedNamespace.value))
}

;(async () => {
  try {
    isLoading.value = true
    await Promise.all([getNamespaceOptions(), getCertBundleList()])
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
})()
</script>
