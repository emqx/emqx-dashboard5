<template>
  <ListCard class="authn">
    <div class="section-header">
      <div></div>
      <CreateButton @click="$router.push({ name: 'authentication-create' })" />
    </div>
    <el-table
      ref="tableCom"
      class="auth-table table-with-draggable"
      :data="authnList"
      v-loading.lock="isListLoading"
      row-key="id"
    >
      <el-table-column prop="backend" :label="$t('Auth.mechanismAndBackend')" min-width="80">
        <template #default="{ row }">
          <router-link
            :to="{ name: 'authenticationDetail', params: { id: row.id } }"
            class="first-column-with-icon-type"
          >
            <img class="icon-type" :src="row.img" width="48" />
            <div class="name-type-block">
              <span class="name-data">{{ getAuthnItemBackendForShow(row) }}</span>
              <span class="type-data">{{ getLabelByValue(row.mechanism) }}</span>
            </div>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="metrics" :label="$t('Auth.status')">
        <template #default="{ row }">
          <AuthItemStatus :metrics="row.metrics" />
        </template>
      </el-table-column>
      <el-table-column prop="enable" :label="$t('Base.isEnabled')">
        <template #default="{ row }">
          <el-switch
            v-model="row.enable"
            :disabled="!$hasPermission('put')"
            :before-change="handleSwitchStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template #default="{ row, $index }">
          <TableButton
            :style="{ marginRight: '10px' }"
            :icon="User"
            v-if="row.backend === 'built_in_database'"
            @click="routeToDetail(row, 'users')"
          >
            {{ $t('Auth.users') }}
          </TableButton>
          <table-dropdown
            :row-data="row"
            :table-data-len="authnList.length"
            :position="findIndex(row)"
            @delete="handleDelete"
            @setting="routeToDetail"
            @move-up="moveAuthnUp($index)"
            @move-down="moveAuthnDown($index)"
            @move-to-top="moveAuthnToTop(row)"
            @move-to-bottom="moveAuthnToBottom(row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </ListCard>
</template>

<script lang="ts">
export default {
  name: 'Authn',
}
</script>

<script lang="ts" setup>
import { deleteAuthn } from '@/api/auth'
import useAuthn, { AuthnItemInTable } from '@/hooks/Auth/useAuthn'
import { useAuthnMechanismType } from '@/hooks/Auth/useAuthnType'
import useToggleAuthStatus from '@/hooks/Auth/useToggleAuthStatus'
import { AuthnItem } from '@/types/auth'
import { ElMessageBox as MB } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AuthItemStatus from './components/AuthItemStatus.vue'
import TableDropdown from './components/TableDropdown.vue'
import { User } from '@element-plus/icons-vue'

const router = useRouter()
const { t } = useI18n()
const {
  isListLoading,
  authnList,
  tableCom,
  getAuthnItemBackendForShow,
  getAuthnList,
  updateAuthnItemMetrics,
  moveAuthnUp,
  moveAuthnDown,
  moveAuthnToTop,
  moveAuthnToBottom,
} = useAuthn()
const { getLabelByValue } = useAuthnMechanismType()
const { toggleAuthStatus } = useToggleAuthStatus()

const toggleEnable = async (row: AuthnItemInTable) => {
  try {
    await toggleAuthStatus(row, 'authn')
    row.enable = !row.enable

    await updateAuthnItemMetrics(row)
  } catch (error) {
    //
  }
}

const handleSwitchStatus = (authn: AuthnItemInTable) => {
  return () => {
    return toggleEnable(authn)
  }
}

const handleDelete = async function ({ id, backend }: AuthnItem) {
  try {
    const confirmText = t('Auth.delAuthnConfirm', {
      additionalTip: backend === 'built_in_database' ? t('Auth.deleteBuiltInTip') : '',
    })
    await MB.confirm(confirmText, {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    await deleteAuthn(id)
    getAuthnList()
  } catch (error) {
    //
  }
}

const routeToDetail = function ({ id }: AuthnItem, tab: string) {
  router.push({ path: `/authentication/detail/${id}`, query: { tab } })
}

const findIndex = (row: AuthnItem) => {
  return authnList.value.findIndex((item) => {
    const id = `${item.mechanism}_${item.backend}`
    return id === `${row.mechanism}_${row.backend}`
  })
}
</script>

<style lang="scss">
@import './style/authTable.scss';
</style>
