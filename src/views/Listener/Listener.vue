<template>
  <div class="listener app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" :icon="Plus" @click="addListener()">
        {{ tl('addListener') }}
      </el-button>
    </div>
    <el-table :data="listenerTable" v-loading="isTableLoading" row-key="id">
      <el-table-column :label="$t('Base.name')" prop="name" :min-width="100" show-overflow-tooltip>
        <template #default="{ row }">
          <p class="table-data-without-break">{{ row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column :label="tl('lType')" prop="type" :min-width="90" />
      <el-table-column :label="tl('lAddress')" prop="bind" :min-width="132" />
      <el-table-column :label="tl('connection')" :min-width="120">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            effect="dark"
            :content="`${row.status?.current_connections || 0}/${row.status?.max_connections || 0}`"
          >
            <el-progress
              :stroke-width="16"
              :text-inside="true"
              :percentage="
                calcPercentage(row.status?.current_connections, row.status?.max_connections, false)
              "
              :show-text="false"
            >
              <span>{{ row.status?.current_connections }}</span>
            </el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Acceptors" prop="acceptors" :min-width="128">
        <template #default="{ row }">
          <span>{{ row.acceptors === '' ? '-' : row.acceptors }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="enable" :label="$t('Base.isEnabled')" :min-width="92">
        <template #default="{ row }">
          <el-switch v-model="row.enable" :before-change="handleSwitch(row)" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" :min-width="152">
        <template #default="{ row }">
          <el-button size="small" @click="editListener(row)">
            {{ $t('Base.setting') }}
          </el-button>
          <el-button size="small" type="danger" plain @click="handleShowDeleteConfirm(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <ListenerDrawer v-model="showDialog" :listener="currentListener" @submitted="getListenerData" />
    <el-dialog
      v-model="showDeleteDialog"
      :width="450"
      class="API-key-dialog"
      :title="t('Base.confirmDelete')"
      :z-index="2000"
    >
      <el-form label-position="top">
        <el-form-item :label="$t('BasicConfig.confirmDeleteListenerType')">
          <el-input v-model="confirmDeleteName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDeleteDialog = false">{{ $t('Base.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="deleteListener(removeRow)"
            :disabled="confirmDeleteName !== removeRow.name"
            :loading="deleteLoading"
          >
            {{ $t('Base.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref, Ref } from 'vue'
import useI18nTl from '@/hooks/useI18nTl'
import { Plus } from '@element-plus/icons-vue'
import {
  queryListener,
  deleteListener as requestDeleteListener,
  handleListener,
} from '@/api/listener'
import useListenerUtils from '@/hooks/Config/useListenerUtils'
import { Listener, ListenerSimpleInfo } from '@/types/listener'
import { calcPercentage } from '@/common/utils'
import { ListenerAction } from '@/types/enum'
import { ElMessage, ElMessageBox } from 'element-plus'
import ListenerDrawer from '@/components/ListenerDrawer/ListenerDrawer.vue'

const { t, tl } = useI18nTl('Gateway')

const isTableLoading = ref(false)
const deleteLoading = ref(false)
const listenerTable: Ref<Array<ListenerSimpleInfo>> = ref([])

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const removeRow = ref<Listener>({})
const confirmDeleteName = ref('')
const currentListener: Ref<undefined | Listener> = ref(undefined)

const { getListenerNameNTypeById } = useListenerUtils()

const getListenerData = async () => {
  try {
    isTableLoading.value = true
    const data = await queryListener()
    listenerTable.value = data.map((item) => {
      const { name, type } = getListenerNameNTypeById(item.id)
      return { ...item, name, type }
    })
  } catch (error) {
    //
  } finally {
    isTableLoading.value = false
  }
}

const addListener = () => {
  showDialog.value = true
  currentListener.value = undefined
}

const editListener = (listener: Listener): Promise<boolean> => {
  currentListener.value = listener
  showDialog.value = true
}

const toggleListenerStatus = async (listener: Listener) => {
  try {
    const { enable, id } = listener
    if (enable) {
      await ElMessageBox.confirm(tl('disableListenerTip'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
    }
    const action = enable ? ListenerAction.Stop : ListenerAction.Start
    await handleListener(id, action)
    ElMessage.success(t(`Base.${enable ? 'disabledSuccess' : 'enableSuccess'}`))
    // for update the connections
    getListenerData()
  } catch (error) {
    //
  }
  return false
}

const handleSwitch = (listener: Listener): (() => Promise<boolean>) => {
  return () => {
    return toggleListenerStatus(listener)
  }
}

const handleShowDeleteConfirm = (row: Listener) => {
  showDeleteDialog.value = true
  removeRow.value = row
  confirmDeleteName.value = ''
}

const deleteListener = async ({ id }: Listener) => {
  deleteLoading.value = true
  try {
    await requestDeleteListener(id)
    ElMessage.success(t(`Base.deleteSuccess`))
    getListenerData()
    showDeleteDialog.value = false
  } catch (error) {
    // ignore error
  } finally {
    deleteLoading.value = false
  }
}

getListenerData()
</script>

<style lang="scss"></style>
