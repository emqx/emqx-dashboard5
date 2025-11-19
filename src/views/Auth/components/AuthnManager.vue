<template>
  <div class="authn-manager">
    <div class="section-header">
      <div class="searchbar">
        <el-space wrap :size="20">
          <el-input
            v-model="searchVal.user_id"
            clearable
            :placeholder="getFiledLabel(field)"
            @keyup.enter="resetPageAndLoadData"
            @clear="resetPageAndLoadData"
          />
          <el-select
            v-model="searchVal.is_superuser"
            clearable
            :placeholder="$t('Auth.isSuperuser')"
            @clear="resetIsSuperuser(), resetPageAndLoadData()"
          >
            <el-option :value="true" :label="$t('Base.yes')" />
            <el-option :value="false" :label="$t('Base.no')" />
          </el-select>
          <SearchButton @click="resetPageAndLoadData" />
          <RefreshButton @click="loadData" />
        </el-space>
      </div>
      <div class="add-funcs-container">
        <template v-if="mechanism === 'password_based'">
          <authn-users-import @uploadedData="loadData" />
        </template>
        <CreateButton @click="addCommand">{{ t('Base.add') }}</CreateButton>
      </div>
    </div>
    <AuthnUserTable
      :data="tableData"
      :field="field"
      v-loading.lock="lockTable"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <div class="emq-table-footer">
      <common-pagination v-model:metaData="pageMeta" @loadPage="loadData" />
    </div>

    <AuthnUserDialog
      v-model="dialogVisible"
      :authn-id="id"
      :field="field"
      :user="currentItem"
      :gateway="gateway"
      @save="loadData"
    />
  </div>
</template>

<script lang="ts" setup>
import { deleteAuthnUser, loadAuthnUsers } from '@/api/auth'
import { deleteGatewayUser, getGatewayUserManagement } from '@/api/gateway'
import { DataManagerItem } from '@/types/auth'
import { ElMessageBox as MB } from 'element-plus'
import AuthnUserDialog from './AuthnUserDialog.vue'
import AuthnUsersImport from './AuthnUsersImport.vue'
import AuthnUserTable from './AuthnUserTable.vue'
import useBuiltInDatabaseAuthn from '@/hooks/Auth/useBuiltInDatabaseAuthn'

const prop = defineProps({
  field: {
    type: String as PropType<'username' | 'clientid'>,
    required: true,
    default: 'username',
  },
  gateway: {
    type: String,
    required: false,
    default: '',
  },
})

const { t } = useI18n()
const currentItem = ref<DataManagerItem | undefined>(undefined)
const tableData = ref([])
const lockTable = ref(false)
const dialogVisible = ref(false)
const route = useRoute()
const isEdit = ref(false)
const searchVal = reactive({
  user_id: '',
  is_superuser: undefined,
})
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const id = computed(function (): string {
  return route.params.id as string
})

const reg = /^(?<mechanism>.+):.+$/
const mechanism = computed(() => {
  const matchRes = id.value?.match(reg)
  return matchRes ? matchRes.groups?.mechanism : ''
})

const loadData = async () => {
  const { user_id, is_superuser } = searchVal
  const sendParams = {
    ...pageParams.value,
    like_user_id: searchVal.user_id === '' ? null : user_id,
    is_superuser,
  }

  lockTable.value = true
  let res
  try {
    if (prop.gateway) {
      res = await getGatewayUserManagement(prop.gateway, sendParams)
    } else {
      res = await loadAuthnUsers(id.value, sendParams)
    }
    if (res) {
      tableData.value = res.data
      setPageMeta(res?.meta)
    }
  } catch (error) {
    tableData.value = []
    initPageMeta()
  }

  lockTable.value = false
}

onMounted(loadData)

const addCommand = () => {
  isEdit.value = false
  currentItem.value = undefined
  dialogVisible.value = true
}

const handleEdit = (row: DataManagerItem) => {
  dialogVisible.value = true
  isEdit.value = true
  currentItem.value = {
    user_id: row.user_id,
    is_superuser: row.is_superuser,
    password: '',
  }
}

const handleDelete = (row: DataManagerItem) => {
  MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    confirmButtonClass: 'confirm-danger',
    type: 'warning',
  })
    .then(async () => {
      if (prop.gateway) {
        await deleteGatewayUser(prop.gateway, row.user_id)
      } else {
        await deleteAuthnUser(id.value, row.user_id)
      }
      resetPageAndLoadData()
    })
    .catch(() => {
      // cancel
    })
}

const { getFiledLabel } = useBuiltInDatabaseAuthn()

const resetPageAndLoadData = () => {
  pageMeta.value.page = 1
  loadData()
}

const resetIsSuperuser = () => {
  searchVal.is_superuser = undefined
}
</script>

<style lang="scss" scoped>
.authn-manager {
  .searchbar {
    height: 36px;
    .el-input {
      width: 260px;
    }
    .el-select {
      width: 200px;
      font-weight: normal;
    }
  }

  .add-funcs-container {
    display: flex;
    > .el-button,
    > .file-upload {
      margin-left: 16px;
    }
  }

  .file-upload {
    display: inline-block;
    vertical-align: top;
  }
}
</style>
