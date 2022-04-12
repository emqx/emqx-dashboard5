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
    <el-table class="auth-table" :data="authnList" v-loading.lock="isListLoading">
      <el-table-column prop="backend" :label="$t('Auth.dataSource')">
        <template #default="{ row }">
          <img :src="row.img" width="48" />
          <span>{{ titleMap[row.backend] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mechanism" :label="$t('Auth.mechanism')" />
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
            :table-data-len="authnList.length"
            :position="findIndex(row)"
            @update="handleUpdate"
            @delete="handleDelete"
            @setting="handleSetting"
            @move="handleMove($event, $index)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TableDropdown from './components/TableDropdown.vue'
import { updateAuthn, deleteAuthn } from '@/api/auth'
import { useRouter } from 'vue-router'
import { ElMessageBox as MB } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
import { AuthnItem } from '@/types/auth'
import useHandleAuthnItem from '@/hooks/Auth/useHandleAuthnItem'
import useMove from '@/hooks/useMove'
import useAuth from '@/hooks/Auth/useAuth'
import useAuthn from '@/hooks/Auth/useAuthn'
import AuthItemStatus from './components/AuthItemStatus.vue'

export default defineComponent({
  name: 'Authn',
  components: {
    TableDropdown,
    AuthItemStatus,
  },
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const { titleMap } = useAuth()
    const { isListLoading, authnList, getAuthnList, updateAuthnItemMetrics } = useAuthn()

    const handleUpdate = async (row: AuthnItem) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { img, ...data } = row
      await updateAuthn(row.id, data)
      await getAuthnList()
      await updateAuthnItemMetrics(row.id)
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

    const handleSetting = function ({ id }: AuthnItem) {
      router.push({ path: `/authentication/detail/${id}` })
    }

    const {
      moveAuthnBeforeAnotherAuthn,
      moveAuthnAfterAnotherAuthn,
      moveAuthnToTop,
      moveAuthnToBottom,
    } = useHandleAuthnItem()

    const { handleDragEvent } = useMove(
      {
        moveToBottom: moveAuthnToBottom,
        moveToTop: moveAuthnToTop,
        moveBeforeAnotherTarget: moveAuthnBeforeAnotherAuthn,
        moveAfterAnotherTarget: moveAuthnAfterAnotherAuthn,
      },
      undefined,
      getAuthnList,
    )

    const handleMove = async function (direction: string, oldIndex: number) {
      const newIndex = direction === 'up' ? oldIndex - 1 : oldIndex + 1
      handleDragEvent(newIndex, oldIndex, authnList.value)
    }

    const findIndex = (row: AuthnItem) => {
      return authnList.value.findIndex((item) => {
        const id = `${item.mechanism}_${item.backend}`
        return id === `${row.mechanism}_${row.backend}`
      })
    }

    return {
      Plus,
      isListLoading,
      authnList,
      titleMap,
      handleUpdate,
      handleDelete,
      handleSetting,
      handleMove,
      findIndex,
    }
  },
})
</script>

<style lang="scss">
@import './style/authTable.scss';
</style>
