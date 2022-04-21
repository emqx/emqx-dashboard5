<template>
  <div class="listener app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" :icon="Plus" @click="addListener()">
        {{ tl('addListener') }}
      </el-button>
    </div>
    <el-table :data="listenerTable" v-loading="isTableLoading" row-key="id">
      <el-table-column :label="$t('Base.name')" prop="name" />
      <el-table-column :label="tl('lType')" prop="type" :min-width="90" />
      <el-table-column :label="tl('lAddress')" prop="bind" />
      <el-table-column label="Acceptors" sortable prop="acceptors">
        <template #default="{ row }">
          <span>{{ row.acceptors === '' ? '-' : row.acceptors }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('connection')">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            effect="dark"
            :content="`${row.status?.current_connections || 0}/${row.status?.max_connections || 0}`"
          >
            <el-progress
              :stroke-width="16"
              :percentage="
                calcPercentage(row.status?.current_connections, row.status?.max_connections, false)
              "
              :show-text="false"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.status')" :min-width="90">
        <template #default="{ row }">
          <span class="node-status">
            <el-badge is-dot :type="getListenerStatusClass(row)" />
            <span class="text-status" :class="getListenerStatusClass(row)">
              {{ getStatusLabel(row) }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" :min-width="136">
        <template #default="{ row }">
          <el-button size="small" @click="editListener(row)">
            {{ $t('Base.edit') }}
          </el-button>
          <el-button size="small" @click="toggleListenerStatus(row)">
            {{ $t(`Base.${row.enable ? 'disable' : 'enable'}`) }}
          </el-button>
          <el-button size="small" type="danger" plain @click="deleteListener(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <ListenerDialog v-model="showDialog" :listener="currentListener" @submitted="getListenerData" />
  </div>
</template>

<script setup lang="ts">
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
import { NodeStatusClass, ListenerAction } from '@/types/enum'
import { ElMessage, ElMessageBox } from 'element-plus'
import ListenerDialog from '@/components/ListenerDialog/ListenerDialog.vue'

const { t, tl } = useI18nTl('Gateway')

const isTableLoading = ref(false)
const listenerTable: Ref<Array<ListenerSimpleInfo>> = ref([])

const showDialog = ref(false)
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

const getListenerStatusClass = ({ enable }: Listener) =>
  enable ? NodeStatusClass.Success : NodeStatusClass.Danger

const getStatusLabel = ({ enable }: Listener) => t(`Base.${enable ? 'enable' : 'disable'}`)

const addListener = () => {
  currentListener.value = undefined
  showDialog.value = true
}

const editListener = (listener: Listener) => {
  currentListener.value = listener
  showDialog.value = true
}

const toggleListenerStatus = async ({ id, enable }: Listener) => {
  const action = enable ? ListenerAction.Stop : ListenerAction.Start
  await handleListener(id, action)
  ElMessage.success(t(`Base.${enable ? 'disabledSuccess' : 'enableSuccess'}`))
  getListenerData()
}

const deleteListener = async ({ id }: Listener) => {
  await ElMessageBox.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
  await requestDeleteListener(id)
  ElMessage.success(t(`Base.deleteSuccess`))
  getListenerData()
}

getListenerData()
</script>

<style lang="scss"></style>
