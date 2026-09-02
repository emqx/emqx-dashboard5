<template>
  <div class="tls-management">
    <div class="app-wrapper">
      <div class="section-header">
        <div>
          <NamespaceSelect
            v-model="namespace"
            :clearable="false"
            :global="{ enable: true, value: GLOBAL_NAMESPACE }"
            @change="getCertBundleList"
          />
        </div>
        <div>
          <CreateButton @click="createBundle" />
        </div>
      </div>
      <el-table :data="certBundleList" v-loading.lock="isLoading">
        <el-table-column prop="name" :label="t('Base.name')">
          <template #default="{ row }">
            <el-button link type="primary" @click="editBundle(row.name)">
              {{ row.name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="t('Base.operation')" width="180">
          <template #default="{ row }">
            <TableButton :disabled="!$hasPermission('delete')" @click="editBundle(row.name)">
              {{ t('Base.edit') }}
            </TableButton>
            <TableButton :disabled="!$hasPermission('delete')" @click="handleDelete(row)">
              {{ t('Base.delete') }}
            </TableButton>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <CertBundleDrawer
    v-model="isDrawerShow"
    :bundle-name="currentBundleName"
    :namespace="selectedNamespace"
    @submit="handleSubmit"
  />
  <CertBundleInUseDialog v-model="isInUseDialogShow" :referencing-configs="referencingConfigs" />
</template>

<script setup lang="ts">
import getErrorMessage from '@/common/getHTTPErrorMessage'
import HTTPErrorMessage from '@/common/HTTPErrorMessage'
import CertBundleDrawer from '@/components/TLSConfig/CertBundleDrawer.vue'
import CertBundleInUseDialog, {
  type ReferencingConfigs,
} from '@/components/TLSConfig/CertBundleInUseDialog.vue'
import { CertBundleOut, ManagedCerts } from '@/types/typeAlias'

const { t } = useI18n()

const isLoading = ref(false)

const namespace = ref<string>(GLOBAL_NAMESPACE)
const selectedNamespace = computed(() =>
  namespace.value === GLOBAL_NAMESPACE ? undefined : namespace.value,
)

const isDrawerShow = ref(false)
const currentBundleName = ref<string>('')

const createBundle = () => {
  currentBundleName.value = ''
  isDrawerShow.value = true
}

const editBundle = (name: string) => {
  currentBundleName.value = name
  isDrawerShow.value = true
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

const isInUseDialogShow = ref(false)
const referencingConfigs = ref<ReferencingConfigs>({})

const { confirmDel } = useOperationConfirm()
const handleDelete = async (row: CertBundleOut) => {
  const { name } = row
  if (!name) {
    return
  }
  try {
    await confirmDel(() => deleteCertBundle(name, selectedNamespace.value))
    getCertBundleList()
  } catch (error: any) {
    const refConfigs = error?.response?.data?.referencing_configs
    if (refConfigs) {
      referencingConfigs.value = refConfigs
      isInUseDialogShow.value = true
    } else if (error.response?.status === 400) {
      HTTPErrorMessage(getErrorMessage(error.response.data, error.response.status) as VNode)
    }
  }
}

;(async () => {
  try {
    isLoading.value = true
    await getCertBundleList()
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
