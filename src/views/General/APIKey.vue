<template>
  <div class="API-key app-wrapper">
    <div class="section-header">
      <div></div>
      <CreateButton @click="createKeyItem" />
    </div>
    <el-table class="api-key-table" :data="keyList" v-loading.lock="isTableLoading">
      <el-table-column prop="name" :label="tl('keyName')">
        <template #default="{ row }">
          <span class="key-name" @click="operateKeyItem('view', row)">
            {{ row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="expired_at" :label="tl('expireAt')">
        <template #default="{ row }">
          {{ expiredAt(row.expired_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="role" :label="t('Dashboard.role')">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.role, apiKeyRoleOptions) }}
        </template>
      </el-table-column>
      <el-table-column prop="desc" :label="t('Base.note')" />
      <el-table-column prop="enable" :label="$t('Base.isEnabled')">
        <template #default="{ row }">
          <el-switch
            v-model="row.enable"
            :disabled="!$hasPermission('put')"
            @change="toggleKeyItemEnable(row)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" min-width="100">
        <template #default="{ row }">
          <TableButton :disabled="!$hasPermission('put')" @click="operateKeyItem('edit', row)">
            {{ tl('edit', 'Base') }}
          </TableButton>
          <TableButton :disabled="!$hasPermission('delete')" @click="deleteKey(row)">{{
            tl('delete', 'Base')
          }}</TableButton>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <APIKeyDialog
    v-model="showDialog"
    :operation-type="dialogOperationType"
    :API-Key-data="currentAPIKey"
    @submitted="getList"
  />
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { APIKey } from '@/types/systemModule'
import { useI18n } from 'vue-i18n'
import APIKeyDialog, { OperationType } from './components/APIKeyDialog.vue'
import { deleteAPIKey, loadAPIKeyList, updateAPIKey } from '@/api/systemModule'
import { ElMessageBox, ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import useRole from '@/hooks/SSO/useRole'
import { getLabelFromValueInOptionList } from '@/common/tools'

const { t } = useI18n()
const tl = function (key: string, collection = 'APIKey') {
  return t(collection + '.' + key)
}

const isTableLoading = ref(false)
const keyList: Ref<Array<APIKey>> = ref([])

const showDialog = ref(false)
const dialogOperationType: Ref<OperationType> = ref('create')
const currentAPIKey: Ref<undefined | APIKey> = ref(undefined)

const createKeyItem = () => {
  dialogOperationType.value = 'create'
  currentAPIKey.value = undefined
  showDialog.value = true
}

const { apiKeyRoleOptions } = useRole()

const operateKeyItem = (type: 'edit' | 'view', itemData: APIKey) => {
  dialogOperationType.value = type
  currentAPIKey.value = itemData
  showDialog.value = true
}

const toggleKeyItemEnable = async (itemData: APIKey) => {
  try {
    const { name, enable, expired_at, desc } = itemData
    const body: { enable: boolean; desc: string; expired_at?: string } = {
      enable,
      desc,
    }
    if (expired_at) {
      body.expired_at = expired_at
    }
    await updateAPIKey(name, body)
    ElMessage.success(t(`Base.${enable ? 'enableSuccess' : 'disabledSuccess'}`))
  } catch (error) {
    console.error(error)
    itemData.enable = !itemData.enable
  }
}

const expiredAt = (expiredAt: string | undefined) =>
  !expiredAt ? tl('neverExpire') : dayjs(expiredAt).format('YYYY-MM-DD')

const getList = async () => {
  try {
    isTableLoading.value = true
    keyList.value = await loadAPIKeyList()
  } catch (error) {
    //
  } finally {
    isTableLoading.value = false
  }
}

const deleteKey = async ({ name }: APIKey) => {
  try {
    await ElMessageBox.confirm(t('APIKey.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    await deleteAPIKey(name)
    ElMessage.success(t('Base.deleteSuccess'))
    getList()
  } catch (error) {
    //
  }
}

getList()
</script>

<style lang="scss">
@import '@/views/Auth/style/authTable.scss';
.API-key {
  .key-name {
    cursor: pointer;
    color: var(--el-color-primary);
  }
}
</style>
