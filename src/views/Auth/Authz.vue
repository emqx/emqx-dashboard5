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
    <el-table class="auth-table" :data="authzList" v-loading.lock="isDataLoading">
      <el-table-column prop="type" :label="$t('Auth.dataSource')">
        <template #default="{ row }">
          <img :src="row.img" width="48" />
          <span>{{ titleMap[row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('RuleEngine.SuccessNum')"
        sortable
        prop="metrics.metrics.success"
      />
      <el-table-column :label="$t('RuleEngine.ErrNum')" sortable prop="metrics.metrics.rate" />
      <el-table-column
        :label="`${$t('RuleEngine.speedNow')}(msg/s)`"
        sortable
        prop="metrics.metrics.failed"
      />
      <el-table-column prop="enable" :label="$t('Auth.status')">
        <template #default="{ row }">
          <AuthItemStatus :enable="row.enable" :metrics="row.metrics" />
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template #default="{ row, $index }">
          <table-dropdown
            :row-data="row"
            :table-data-len="authzList.length"
            :position="findIndex(row)"
            @update="handleUpdate"
            @delete="handleDelete"
            @move="handleMove($event, $index)"
            @setting="handleSetting"
          ></table-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TableDropdown from './components/TableDropdown.vue'
import { updateAuthz, deleteAuthz } from '@/api/auth'
import router from '@/router'
import { ElMessageBox as MB } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Plus, Setting } from '@element-plus/icons-vue'
import { AuthzSourceItem } from '@/types/auth'
import useHandleAuthzItem from '@/hooks/Auth/useHandleAuthzItem'
import useAuthz from '@/hooks/Auth/useAuthz'
import useMove from '@/hooks/useMove'
import useAuth from '@/hooks/Auth/useAuth'
import AuthItemStatus from './components/AuthItemStatus.vue'

export default defineComponent({
  name: 'Authz',
  components: {
    TableDropdown,
    AuthItemStatus,
  },
  setup() {
    const { t } = useI18n()

    const { titleMap } = useAuth()
    const { isDataLoading, authzList, getAuthzList, updateAuthnItemMetrics } = useAuthz()

    const handleUpdate = async (row: AuthzSourceItem) => {
      const { img, ...data } = row
      await updateAuthz(row.type, data)
      await getAuthzList()
      await updateAuthnItemMetrics(row.type)
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

    const {
      moveAuthzBeforeAnotherAuthz,
      moveAuthzAfterAnotherAuthz,
      moveAuthzToTop,
      moveAuthzToBottom,
    } = useHandleAuthzItem()

    const { handleDragEvent } = useMove(
      {
        moveToBottom: moveAuthzToBottom,
        moveToTop: moveAuthzToTop,
        moveBeforeAnotherTarget: moveAuthzBeforeAnotherAuthz,
        moveAfterAnotherTarget: moveAuthzAfterAnotherAuthz,
      },
      undefined,
      getAuthzList,
    )

    const handleMove = async function (direction: string, oldIndex: number) {
      const newIndex = direction === 'up' ? oldIndex - 1 : oldIndex + 1
      handleDragEvent(newIndex, oldIndex, authzList.value)
    }

    const handleSetting = function ({ type }: AuthzSourceItem) {
      router.push({ path: `/authorization/detail/${type}` })
    }

    const findIndex = (row: AuthzSourceItem) => {
      return authzList.value.findIndex((item) => item.type === row.type)
    }

    return {
      Plus,
      Setting,
      isDataLoading,
      authzList,
      titleMap,
      handleUpdate,
      handleDelete,
      handleMove,
      handleSetting,
      findIndex,
    }
  },
})
</script>

<style lang="scss">
@import './style/authTable.scss';
</style>
