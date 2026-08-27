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
      <el-table-column prop="api_key" label="API Key" />
      <el-table-column prop="expired_at" :label="tl('expireAt')" sortable>
        <template #default="{ row }">
          {{ expiredAt(row.expired_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="role" :label="t('Dashboard.role')" sortable>
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.role, apiKeyRoleOptions) }}
        </template>
      </el-table-column>
      <el-table-column prop="scopes" :label="tl('scopes')">
        <template #header>
          <FormItemLabel
            :label="tl('scopes')"
            :desc="scopesColumnDesc"
            desc-marked
            :max-height="400"
            popper-class="role-default-scopes-tooltip"
          />
        </template>
        <template #default="{ row }">
          <span v-if="isUnsetScopes(row.scopes)">{{ tl('roleDefaultScopes') }}</span>
          <template v-else-if="hasSelectedScopes(row.scopes)">
            <el-tag
              v-for="scope in row.scopes"
              :key="scope"
              type="info"
              effect="plain"
              size="small"
              style="margin-right: 4px; margin-bottom: 2px"
            >
              {{ getScopeLabel(scope) }}
            </el-tag>
          </template>
          <span v-else>{{ tl('noScopes') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isMultiTenancyEnabled && !isNamespaceUser"
        prop="namespace"
        :label="t('BasicConfig.namespace')"
        sortable
        :sort-by="({ namespace }) => namespace || ''"
      >
        <template #default="{ row }">
          {{ row.namespace || '' }}
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
import { APIKey, APIKeyFormWhenEditing } from '@/types/systemModule'
import APIKeyDialog, { OperationType } from './components/APIKeyDialog.vue'
import { deleteAPIKey, loadAPIKeyList, updateAPIKey } from '@/api/systemModule'
import dayjs from 'dayjs'
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import { hasSelectedScopes, isUnsetScopes } from '@/common/scopes'

const { t, te } = useI18n()
const tl = function (key: string, collection = 'APIKey') {
  return t(collection + '.' + key)
}
const store = useStore()
const isMultiTenancyEnabled = useMultiTenancyEnabled()

const buildRoleDefaultScopesDesc = (intro: string) =>
  [intro, tl('roleDefaultScopesByRoleDesc'), tl('roleDefaultScopesRestrictionDesc')].join('\n\n')
const scopesColumnDesc = computed(() => buildRoleDefaultScopesDesc(tl('scopesColumnDesc')))

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

const getScopeLabel = (name: string): string => {
  const key = `APIKey.scopeLabel_${name}`
  return te(key) ? t(key) : titleCase(name)
}

const operateKeyItem = (type: 'edit' | 'view', itemData: APIKey) => {
  dialogOperationType.value = type
  currentAPIKey.value = itemData
  showDialog.value = true
}

const { processAPIKeyRecordForUpdating } = useNamespaceUser()
const toggleKeyItemEnable = async (itemData: APIKey) => {
  try {
    const { name, enable, expired_at, desc, role } = processAPIKeyRecordForUpdating(itemData)
    const body: Omit<APIKeyFormWhenEditing, 'name'> = {
      enable,
      desc,
      role,
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

const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
const currentUserNamespace = computed(() => store.getters.userNamespace)
const getList = async () => {
  try {
    isTableLoading.value = true
    const list = await loadAPIKeyList()
    if (!isNamespaceUser.value) {
      keyList.value = list
    } else {
      keyList.value = list.filter(({ namespace }) => namespace === currentUserNamespace.value)
    }
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
@use '@/views/Auth/style/authTable.scss';
.API-key {
  .key-name {
    cursor: pointer;
    color: var(--el-color-primary);
  }
}

.role-default-scopes-tooltip {
  max-width: 720px;
}
</style>
