<template>
  <el-drawer
    :title="t('Clients.clients')"
    v-model="showDrawer"
    size="600px"
    destroy-on-close
    class="namespace-clients-drawer"
    @open="handleOpen"
    @close="handleClose"
  >
    <div class="space-between drawer-header">
      <div>
        <label>{{ tl('namespace') }}: </label>
        <span>{{ props.namespace }}</span>
      </div>
      <div>
        <el-button
          class="kick-btn"
          type="danger"
          plain
          :disabled="selectedClients.length === 0 || !$hasPermission('delete')"
          :icon="Delete"
          :loading="isDeleteLoading"
          @click="cleanBatchClients"
        >
          {{ t('Clients.kickOut') }}
        </el-button>
      </div>
    </div>

    <el-table
      :data="tableData"
      ref="TableCom"
      :row-key="(row) => row"
      v-loading.lock="isLoading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="35" reserve-selection />
      <el-table-column :label="t('Base.clientid')">
        <template #default="{ row }">
          <router-link :to="{ name: 'clients-detail', params: { clientId: row } }" target="_blank">
            <CommonOverflowTooltip :content="row" />
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <MiniPagination
        :total="total"
        :current-page="page"
        :hasnext="hasNext"
        :page-size="limit"
        :page-sizes="DEFAULT_PAGE_SIZE_OPT"
        layout="total, sizes, prev, next"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { batchDisconnectClients } from '@/api/clients'
import { getNamespaceClientCount, getNamespaceClientList } from '@/api/config'
import { Delete } from '@element-plus/icons-vue'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  namespace?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const showDrawer = computed<boolean>({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('BasicConfig')

const TableCom = ref()
const isLoading = ref(false)
const tableData = ref<Array<string>>([])
const selectedClients = ref<Array<string>>([])
const handleSelectionChange = (clients: Array<string>) => {
  selectedClients.value = clients
}

const total = ref(0)
const { page, limit, pageParams, hasNext, setCursor, resetPage } = useCursorPagination()

const handleOpen = () => {
  getClientsCount()
  getClients()
}

const handleClose = () => {
  resetPage()
}

const getClients = async (isBack?: boolean) => {
  try {
    if (!props.namespace) {
      return
    }
    isLoading.value = true
    const params = {
      last_clientid: pageParams.value.cursor,
      limit: pageParams.value.limit,
    }
    const data = await getNamespaceClientList(props.namespace, params)
    debugger
    if (data.length === limit.value) {
      setCursor(page.value + 1, data[data.length - 1])
    }
    tableData.value = data
    if (isBack && page.value !== 1 && data.length === 0) {
      ElMessage.warning(t('Clients.pageJumpTip'))
      handlePageChange(1)
    }
  } catch (error) {
    tableData.value = []
    resetPage()
  } finally {
    isLoading.value = false
  }
}

const getClientsCount = async () => {
  try {
    if (!props.namespace) {
      return
    }
    const { count } = await getNamespaceClientCount(props.namespace)
    total.value = count
  } catch (error) {
    //
  }
}

const handlePageChange = (no: number) => {
  const isBack = no < page.value
  page.value = no
  getClients(isBack)
}

const handleSizeChange = (size: number) => {
  limit.value = size
  handlePageChange(1)
}

const isDeleteLoading = ref(false)
const { operationWarning } = useOperationConfirm()
const cleanBatchClients = async () => {
  await operationWarning(
    t('Clients.willKickSelectedConnections', { n: selectedClients.value.length }),
  )
  isDeleteLoading.value = true
  try {
    await batchDisconnectClients(selectedClients.value)
    resetPage()
    getClients()
    ElMessage.success(t('Clients.kickedOutSuc'))
    TableCom.value?.clearSelection?.()
  } catch (error) {
    console.log(error)
  } finally {
    isDeleteLoading.value = false
  }
}
</script>

<style lang="scss">
.namespace-clients-drawer {
  .drawer-header {
    margin-bottom: 20px;
  }
}
</style>
