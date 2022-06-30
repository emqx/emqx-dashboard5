<template>
  <div class="authz app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button :icon="Setting" @click="$router.push({ name: 'authorizationSetting' })">
        {{ $t('Auth.setting') }}
      </el-button>
      <el-button type="primary" :icon="Plus" @click="$router.push({ name: 'authorizationCreate' })">
        {{ $t('Base.create') }}
      </el-button>
    </div>
    <el-table
      ref="tableCom"
      class="auth-table table-with-draggable"
      :data="authzList"
      v-loading.lock="isDataLoading"
      row-key="type"
    >
      <el-table-column prop="type" :label="$t('Auth.dataSource')" min-width="70">
        <template #default="{ row }">
          <router-link
            :to="{
              name: 'authorizationDetail',
              params: { type: row.type },
            }"
            class="link"
          >
            <img class="auth-img" :src="row.img" width="48" />
            <span>{{ titleMap[row.type] }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="metrics" :label="$t('Base.status')">
        <template #default="{ row }">
          <AuthItemStatus :metrics="row.metrics" />
        </template>
      </el-table-column>
      <el-table-column prop="enable" :label="$t('Base.isEnabled')">
        <template #default="{ row }">
          <el-switch v-model="row.enable" @change="toggleEnable(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template #default="{ row, $index }">
          <el-button
            :style="{ marginRight: '10px' }"
            v-if="row.type === 'built_in_database'"
            size="small"
            @click="routeToDetail(row, 'users')"
            >{{ $t('Auth.users') }}</el-button
          >
          <table-dropdown
            :row-data="row"
            :table-data-len="authzList.length"
            :position="$index"
            :type="row.type"
            @delete="handleDelete"
            @setting="routeToDetail"
            @move-up="moveAuthzUp($index)"
            @move-down="moveAuthzDown($index)"
            @move-to-top="moveAuthzToTop(row)"
            @move-to-bottom="moveAuthzToBottom(row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Authz',
}
</script>

<script lang="ts" setup>
import TableDropdown from './components/TableDropdown.vue'
import { updateAuthz, deleteAuthz } from '@/api/auth'
import router from '@/router'
import { ElMessage, ElMessageBox as MB } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Plus, Setting } from '@element-plus/icons-vue'
import { AuthzSourceItem } from '@/types/auth'
import useAuthz, { AuthzItemInTable } from '@/hooks/Auth/useAuthz'
import useAuth from '@/hooks/Auth/useAuth'
import AuthItemStatus from './components/AuthItemStatus.vue'

const { t } = useI18n()

const { titleMap } = useAuth()

const {
  isDataLoading,
  authzList,
  tableCom,
  getAuthzList,
  updateAuthnItemMetrics,
  moveAuthzUp,
  moveAuthzDown,
  moveAuthzToTop,
  moveAuthzToBottom,
} = useAuthz()

const toggleEnable = async (row: AuthzItemInTable) => {
  try {
    const { img, metrics, ...data } = row
    await updateAuthz(row.type, data)
    ElMessage.success(t(row.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'))
    await updateAuthnItemMetrics(row)
  } catch (error) {
    row.enable = !row.enable
  }
}

const handleDelete = async function ({ type }: AuthzSourceItem) {
  await MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
  await deleteAuthz(type)
  getAuthzList()
}

const routeToDetail = function ({ type }: AuthzSourceItem, tab: string) {
  router.push({ path: `/authorization/detail/${type}`, query: { tab } })
}
</script>

<style lang="scss">
@import './style/authTable.scss';
</style>
