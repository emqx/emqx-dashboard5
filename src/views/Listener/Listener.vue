<template>
  <div class="listener app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" :icon="Plus" @click="addListener()">
        {{ tl('addListener') }}
      </el-button>
    </div>
    <el-table :data="listenerTable" v-loading="isTableLoading">
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
            :content="`${row.current_connections || 0}/${row.max_connections || 0}`"
          >
            <el-progress
              :stroke-width="16"
              :percentage="calcPercentage(row.current_connections, row.max_connections, false)"
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
        <template #default="{ row, $index }">
          <el-button size="small" @click="editListener(row, $index)">
            {{ $t('Base.edit') }}
          </el-button>
          <el-button size="small" @click="toggleListenerStatus(row)">
            {{ $t(`Base.${row.enabled ? 'disable' : 'enable'}`) }}
          </el-button>
          <el-button size="small" type="danger" @click="deleteListener(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <ListenerDialog v-model="showDialog" :listener="currentListener" />
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import useI18nTl from '@/hooks/useI18nTl'
import { Plus } from '@element-plus/icons-vue'
import {
  queryListener,
  updateListener,
  deleteListener as requestDeleteListener,
} from '@/api/listener'
import useListenerUtils from '@/hooks/Config/useListenerUtils'
import { Listener } from '@/types/listener'
import { calcPercentage } from '@/common/utils'
import { NodeStatusClass } from '@/types/enum'
import { ElMessage, ElMessageBox } from 'element-plus'
import { omit } from 'lodash'
import ListenerDialog from '@/components/ListenerDialog/ListenerDialog.vue'

const { t, tl } = useI18nTl('Gateway')

const isTableLoading = ref(false)
const listenerTable: Ref<Array<Listener>> = ref([])

const showDialog = ref(false)
const currentListener: Ref<undefined | Listener> = ref(undefined)

const { getListenerNameById } = useListenerUtils()

const getListenerData = async () => {
  try {
    isTableLoading.value = true
    const data = await queryListener()
    listenerTable.value = data.reduce(
      (arr: Array<Listener>, item) =>
        arr.concat(
          item.listeners.map((item: Listener) => ({
            ...item,
            name: getListenerNameById(item.id),
          })),
        ),
      [],
    )
  } catch (error) {
    //
  } finally {
    isTableLoading.value = false
  }
}

const getListenerStatusClass = ({ enabled }: Listener) =>
  enabled ? NodeStatusClass.Success : NodeStatusClass.Danger

const getStatusLabel = ({ enabled }: Listener) => t(`Base.${enabled ? 'enable' : 'disable'}`)

const addListener = () => {
  currentListener.value = undefined
  showDialog.value = true
}

const editListener = (listener: Listener, index: number) => {
  currentListener.value = listener
  showDialog.value = true
}

const toggleListenerStatus = async (listener: Listener) => {
  await updateListener({ ...omit(listener, 'name'), enabled: !listener.enabled }, listener.id)
  ElMessage.success(t(`Base.${listener.enabled ? 'disabledSuccess' : 'enableSuccess'}`))
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
