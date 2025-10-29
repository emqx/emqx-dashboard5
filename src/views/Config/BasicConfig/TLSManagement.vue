<template>
  <div class="tls-management">
    <div class="app-wrapper">
      <div class="section-header">
        <div>
          <el-select
            v-model="selectedNamespace"
            clearable
            :placeholder="t('BasicConfig.namespace')"
            @change="getCertBundleList"
          >
            <el-option v-for="i in namespaceOptions" :key="i" :label="i" :value="i" />
          </el-select>
        </div>
        <div>
          <CreateButton @click="openCreateCertBundleDrawer" />
        </div>
      </div>
      <el-table :data="certBundleList" v-loading.lock="isLoading">
        <el-table-column prop="name" :label="t('Base.name')" />
        <el-table-column :label="t('Base.operation')" width="180">
          <template #default="{ row }">
            <TableButton :disabled="!$hasPermission('delete')" @click="viewCertBundle(row.name)">
              {{ t('Base.view') }}
            </TableButton>
            <TableButton :disabled="!$hasPermission('delete')" @click="handleDelete(row)">
              {{ t('Base.delete') }}
            </TableButton>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <CreateCertBundleDrawer v-model="isDrawerShow" @submit="handleSubmit" />
  <CertBundleInfoDialog
    v-model="isInfoDialogVisible"
    :name="currentBundleName"
    :namespace="selectedNamespace"
  />
</template>

<script setup lang="ts">
import { getManagedNamespaceList } from '@/api/config'
import CreateCertBundleDrawer from '@/components/TLSConfig/CreateCertBundleDrawer.vue'
import CertBundleInfoDialog from '@/components/TLSConfig/CertBundleInfoDialog.vue'
import { CertBundleOut } from '@/types/typeAlias'

const { t } = useI18n()

const isLoading = ref(false)

const selectedNamespace = ref<string>('')
const namespaceOptions = ref<string[]>([])
const getNamespaceOptions = async () => {
  try {
    const res = await getManagedNamespaceList({ limit: 10000 })
    namespaceOptions.value = res
  } catch (error) {
    //
  }
}

const isDrawerShow = ref(false)
const openCreateCertBundleDrawer = () => {
  isDrawerShow.value = true
}

const isInfoDialogVisible = ref(false)
const currentBundleName = ref<string>('')
const viewCertBundle = (name: string) => {
  currentBundleName.value = name
  isInfoDialogVisible.value = true
}

const certBundleList = ref<CertBundleOut[]>([])
const { getCertBundleList: requestCertBundleList, deleteCertBundle } = useCertBundle()
const getCertBundleList = async () => {
  try {
    isLoading.value = true
    const namespace = selectedNamespace.value ? selectedNamespace.value : undefined
    certBundleList.value = await requestCertBundleList(namespace)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async (namespace?: string) => {
  selectedNamespace.value = namespace ?? ''
  getCertBundleList()
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

<style lang="scss">
.tls-management {
  .section-header {
    .el-select {
      width: 33.3%;
      font-weight: normal;
    }
  }
}
</style>
