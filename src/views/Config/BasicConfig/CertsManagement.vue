<template>
  <div class="tls-management">
    <div class="app-wrapper">
      <div class="section-header">
        <div>
          <el-select
            v-model="namespace"
            clearable
            :placeholder="t('BasicConfig.namespace')"
            @change="getCertBundleList"
          >
            <el-option
              v-for="{ label, value } in namespaceOptions"
              :key="value"
              :label="label"
              :value="value"
            />
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
  <CreateCertBundleDrawer
    v-model="isDrawerShow"
    :namespace="selectedNamespace"
    @submit="handleSubmit"
  />
  <CertBundleInfoDialog
    v-model="isInfoDialogVisible"
    :name="currentBundleName"
    :namespace="selectedNamespace"
  />
</template>

<script setup lang="ts">
import CreateCertBundleDrawer from '@/components/TLSConfig/CertBundleDrawer.vue'
import CertBundleInfoDialog from '@/components/TLSConfig/CertBundleInfoDialog.vue'
import { CertBundleOut, ManagedCerts } from '@/types/typeAlias'
import { OptionList } from '@/types/common'

const { t } = useI18n()

const isLoading = ref(false)

const namespace = ref<string>(GLOBAL_NAMESPACE)
const selectedNamespace = computed(() =>
  namespace.value === GLOBAL_NAMESPACE ? undefined : namespace.value,
)
const namespaceOptions = ref<OptionList<string>>([])
const { globalNamespaceOption, getNamespaceOptions: requestNamespaceOptions } =
  useManagedNamespaceOptions()
const getNamespaceOptions = async () => {
  try {
    const res = await requestNamespaceOptions()
    namespaceOptions.value = [globalNamespaceOption, ...res.map((i) => ({ label: i, value: i }))]
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
    certBundleList.value = await requestCertBundleList(selectedNamespace.value)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async ({ namespace: ns }: ManagedCerts) => {
  namespace.value = ns ?? GLOBAL_NAMESPACE
  getCertBundleList()
}

const { confirmDel } = useOperationConfirm()
const handleDelete = async (row: CertBundleOut) => {
  const { name } = row
  if (!name) {
    return
  }
  await confirmDel(() => deleteCertBundle(name, selectedNamespace.value))
  getCertBundleList()
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
