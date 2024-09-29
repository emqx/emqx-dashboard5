<template>
  <div class="banned-clients">
    <el-form class="search-wrapper" @keyup.enter="refreshListData">
      <el-row :gutter="20">
        <el-col v-bind="colProps">
          <el-form-item>
            <el-select v-model="searchAs">
              <el-option
                v-for="{ value, label } in asOpts"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-bind="colProps">
          <el-form-item>
            <el-input
              v-model="filterValue"
              clearable
              :placeholder="filterValuePlaceholder"
              @clear="refreshListData"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="colProps">
          <el-checkbox v-model="enableFuzzySearch" v-if="!isSelectedPeerHostNet">
            {{ t('Clients.enableFuzzySearch') }}
          </el-checkbox>
        </el-col>

        <el-col v-bind="colProps" class="buttons-wrap">
          <el-button type="primary" plain :icon="Search" @click="refreshListData">
            {{ t('Base.search') }}
          </el-button>
          <el-button :icon="RefreshLeft" @click="handleReset">
            {{ t('Base.reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="app-wrapper">
      <div class="section-header">
        <div></div>
        <el-button type="primary" :icon="Plus" @click="dialogVisible = true">
          {{ t('Base.create') }}
        </el-button>
        <el-button
          type="danger"
          plain
          :icon="Remove"
          :disabled="!tableData.length"
          @click="clearAllConfirm"
          :loading="clearLoading"
        >
          {{ tl('clearAll') }}
        </el-button>
      </div>
      <el-table :data="tableData" v-loading="tbLoading" row-key="who">
        <el-table-column prop="who" :label="tl('who')" />
        <el-table-column prop="as" :label="tl('as')">
          <template #default="{ row }">
            {{ getLabelFromValue(row.as) }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" min-width="120px" :label="tl('reason')" />
        <el-table-column prop="until" :formatter="formatterUntil" :label="tl('until')">
          <template #default="{ row }">
            {{ expiredAt(row.until) }}
          </template>
        </el-table-column>
        <el-table-column prop="oper" :label="t('Base.operation')">
          <template #default="{ row }">
            <el-button plain size="small" @click="deleteConfirm(row)">
              {{ t('Base.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="emq-table-footer">
        <common-pagination
          @loadPage="listBlackList"
          v-model:metaData="pageMeta"
        ></common-pagination>
      </div>
    </div>
  </div>
  <BannedDialog v-model="dialogVisible" @submitted="refreshListData" />
</template>

<script setup lang="ts">
import { clearAllBannedClients, deleteBannedClient, loadBannedClient } from '@/api/function'
import { BANNED_NEVER_EXPIRE_VALUE, SEARCH_FORM_RES_PROPS as colProps } from '@/common/constants'
import { dateFormat, getLabelFromValueInOptionList } from '@/common/tools'
import useBannedType from '@/hooks/Auth/useBannedType'
import useI18nTl from '@/hooks/useI18nTl'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import { BannedItem } from '@/types/systemModule'
import { Plus, RefreshLeft, Remove, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import { Banned } from 'src/types/auth'
import { computed, ref } from 'vue'
import CommonPagination from '../../components/commonPagination.vue'
import BannedDialog from './components/BannedDialog.vue'

enum As {
  ClientID = 'clientid',
  Username = 'username',
  PeerHost = 'peerhost',
  PeerHostNet = 'peerhost_net',
}

const { t, tl } = useI18nTl('General')

const dialogVisible = ref(false)
const clearLoading = ref(false)
const tableData = ref<BannedItem[]>([])
const tbLoading = ref(false)
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const enableFuzzyGetKeyMap = new Map<boolean, (key: string) => string>([
  [false, (key: string) => key],
  [true, (key: string) => `like_${key}`],
])
const asOpts = [
  { label: t('Clients.clientId'), value: As.ClientID },
  { label: t('Clients.username'), value: As.Username },
  { label: t('Clients.ipAddress'), value: As.PeerHost },
  { label: t('Clients.ipAddressRange'), value: As.PeerHostNet },
]
const filterValuePlaceholder = computed(() => getLabelFromValueInOptionList(searchAs.value, asOpts))

const searchAs = ref<string>(As.ClientID)
const filterValue = ref('')
const enableFuzzySearch = ref(false)
const isSelectedPeerHostNet = computed(() => searchAs.value === As.PeerHostNet)

const getFilterParams = () => {
  const isFuzzy = enableFuzzySearch.value || isSelectedPeerHostNet.value
  const getKey = enableFuzzyGetKeyMap.get(isFuzzy) as (key: string) => string
  const filterKey = getKey(searchAs.value)
  return filterValue.value ? { [filterKey]: filterValue.value } : {}
}

const handleReset = () => {
  filterValue.value = ''
  refreshListData()
}

const listBlackList = async (params = {}) => {
  tbLoading.value = true
  const sendParams = { ...pageParams.value, ...params, ...getFilterParams() }
  Reflect.deleteProperty(sendParams, 'count')
  try {
    const { data = [], meta = { limit: 20, page: 1 } } = await loadBannedClient(sendParams)
    tableData.value = data
    setPageMeta(meta)
  } catch (error) {
    tableData.value = []
    initPageMeta()
  } finally {
    tbLoading.value = false
  }
}

const refreshListData = () => {
  initPageMeta()
  listBlackList()
}

const expiredAt = (value: string) => {
  return value === BANNED_NEVER_EXPIRE_VALUE
    ? tl('neverExpire')
    : moment(value).format('YYYY-MM-DD HH:mm')
}

const { getLabelFromValue } = useBannedType()

const deleteConfirm = async (item: Banned) => {
  try {
    await ElMessageBox.confirm(tl('determineToDeleteTheBannedClient'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    const { who, as } = item
    await deleteBannedClient({ who, as })
    ElMessage.success(t('Base.deleteSuccess'))
    refreshListData()
  } catch (error) {
    //
  }
}

const clearAllConfirm = async () => {
  try {
    await ElMessageBox.confirm(tl('clearAllBannedConfirm'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      type: 'warning',
    })
    clearLoading.value = true
    await clearAllBannedClients()
    ElMessage.success(t('Base.deleteSuccess'))
    refreshListData()
  } catch (error) {
    // ignore error
  } finally {
    clearLoading.value = false
  }
}

const formatterUntil = ({ until }: Banned) => {
  if (!until) {
    return tl('General.neverExpire')
  }
  return dateFormat(until)
}

listBlackList()
</script>

<style lang="scss">
.banned-clients {
  $prepend-width: 180px;
  .el-input-group--prepend .el-input-group__prepend {
    width: $prepend-width;
    flex-shrink: 0;
  }
  .section-header {
    margin-top: 0;
  }
  .search-wrapper {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .buttons-wrap {
    display: flex !important;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
