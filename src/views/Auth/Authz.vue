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
      <el-table-column prop="type" :label="$t('Auth.dataSource')">
        <template #default="{ row }">
          <img class="auth-img" :src="row.img" width="48" />
          <span>{{ titleMap[row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('RuleEngine.SuccessNum')"
        sortable
        prop="metrics.metrics.success"
      />
      <el-table-column :label="$t('RuleEngine.ErrNum')" sortable prop="metrics.metrics.failed" />
      <el-table-column
        :label="`${$t('RuleEngine.speedNow')}(msg/s)`"
        sortable
        prop="metrics.metrics.rate"
      />
      <el-table-column prop="enable" :label="$t('Auth.status')">
        <template #default="{ row }">
          <AuthItemStatus :enable="row.enable" :metrics="row.metrics" />
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')" :min-width="120">
        <template #default="{ row }">
          <table-dropdown
            :row-data="row"
            :table-data-len="authzList.length"
            :position="findIndex(row)"
            @update="handleUpdate"
            @delete="handleDelete"
            @setting="handleSetting"
            @move-to-top="moveAuthzToTop(row)"
            @move-to-bottom="moveAuthzToBottom(row)"
          ></table-dropdown>
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
  moveAuthzToTop,
  moveAuthzToBottom,
} = useAuthz()

const handleUpdate = async (row: AuthzItemInTable) => {
  const { img, metrics, ...data } = row
  await updateAuthz(row.type, data)
  ElMessage.success(t('Base.updateSuccess'))
  await getAuthzList()
  await updateAuthnItemMetrics(row)
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

const handleSetting = function ({ type }: AuthzSourceItem) {
  router.push({ path: `/authorization/detail/${type}` })
}

const findIndex = (row: AuthzSourceItem) => {
  return authzList.value.findIndex((item) => item.type === row.type)
}
</script>

<style lang="scss">
@import './style/authTable.scss';
</style>
