<template>
  <div class="authn app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button
        type="primary"
        :icon="Plus"
        @click="$router.push({ name: 'authenticationCreate' })"
      >
        {{ $t('Base.create') }}
      </el-button>
    </div>
    <el-table
      ref="tableCom"
      class="auth-table table-with-draggable"
      :data="authnList"
      v-loading.lock="isListLoading"
      row-key="id"
    >
      <el-table-column prop="backend" :label="$t('Auth.mechanismAndBackend')">
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
      <el-table-column prop="enable" :label="$t('Base.isEnabled')">
        <template #default="{ row }">
          <el-switch v-model="row.enable" @change="toggleEnable(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="metrics" :label="$t('Auth.status')">
        <template #default="{ row }">
          <AuthItemStatus :metrics="row.metrics" />
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template #default="{ row, $index }">
          <el-button
            :style="{ marginRight: '10px' }"
            v-if="row.backend === 'built_in_database'"
            size="small"
            @click="routeToDeatil(row, 'users')"
            >{{ $t('Auth.users') }}</el-button
          >
          <table-dropdown
            :row-data="row"
            :table-data-len="authnList.length"
            :position="findIndex(row)"
            @delete="handleDelete"
            @setting="routeToDeatil"
            @move-up="moveAuthnUp($index)"
            @move-down="moveAuthnDown($index)"
            @move-to-top="moveAuthnToTop(row)"
            @move-to-bottom="moveAuthnToBottom(row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Authn',
}
</script>

<script lang="ts" setup>
import TableDropdown from './components/TableDropdown.vue'
import { updateAuthn, deleteAuthn } from '@/api/auth'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox as MB } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
import { AuthnItem } from '@/types/auth'
import useAuthn, { AuthnItemInTable } from '@/hooks/Auth/useAuthn'
import AuthItemStatus from './components/AuthItemStatus.vue'
import { useAuthnMechanismType } from '@/hooks/Auth/useAuthnType'

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

const toggleEnable = async (row: AuthnItemInTable) => {
  try {
    const { img, metrics, ...data } = row
    await updateAuthn(row.id, data)
    ElMessage.success(t(row.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'))
    await updateAuthnItemMetrics(row)
  } catch (error) {
    row.enable = !row.enable
  }
}

const handleDelete = async function ({ id }: AuthnItem) {
  try {
    await MB.confirm(t('Base.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      type: 'warning',
    })
    await deleteAuthn(id)
    getAuthnList()
  } catch (error) {
    //
  }
}

const routeToDeatil = function ({ id }: AuthnItem, tab: string) {
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
