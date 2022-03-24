<template>
  <div class="API-key app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" @click="createKeyItem">{{ $t('Base.create') }}</el-button>
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
      <el-table-column prop="desc" :label="tl('desc')" />
      <el-table-column prop="enable" :label="tl('status')">
        <template #default="{ row }">
          <span :class="['status', { disabled: !row.enable }]">
            {{ t(`APIKey.${row.enable ? 'enable' : 'disable'}`) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" min-width="100">
        <template #default="{ row }">
          <el-button size="small" @click="operateKeyItem('view', row)">{{ tl('view') }}</el-button>
          <el-button size="small" @click="operateKeyItem('edit', row)">{{
            tl('edit', 'Base')
          }}</el-button>
          <el-button size="small" @click="toggleKeyItemEnable(row)">{{
            tl(!row.enable ? 'enable' : 'disable')
          }}</el-button>
          <el-button size="small" @click="deleteKey(row)">{{ tl('delete', 'Base') }}</el-button>
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
import moment from 'moment'

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

const operateKeyItem = (type: 'edit' | 'view', itemData: APIKey) => {
  dialogOperationType.value = type
  currentAPIKey.value = itemData
  showDialog.value = true
}

const toggleKeyItemEnable = async (itemData: APIKey) => {
  try {
    const { name, enable, expired_at, desc } = itemData
    const body: { enable: boolean; desc: string; expired_at?: string } = {
      enable: !enable,
      desc,
    }
    if (expired_at) {
      body.expired_at = expired_at
    }
    await updateAPIKey(name, body)
    ElMessage.success(t(`Base.${!enable ? 'enableSuccess' : 'disabledSuccess'}`))
    getList()
  } catch (error) {
    console.error(error)
  }
}

const expiredAt = (expiredAt: string | undefined) =>
  !expiredAt ? tl('neverExpire') : moment(expiredAt).format('YYYY-MM-DD')

const getList = async () => {
  try {
    isTableLoading.value = true
    keyList.value = await loadAPIKeyList()
    isTableLoading.value = false
  } catch (error) {
    //
  }
}

const deleteKey = async ({ name }: APIKey) => {
  try {
    await ElMessageBox.confirm(t('APIKey.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
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
@import '~@/views/Auth/style/authTable.scss';
.API-key {
  .key-name {
    cursor: pointer;
    color: var(--el-color-primary);
  }
}
</style>
