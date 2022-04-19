<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" v-if="Component"></component>
    <template v-else>
      <div class="app-wrapper data-bridge">
        <div class="section-header">
          <div></div>
          <el-button type="primary" :icon="Plus" @click="openCreate">
            {{ tl('createConnector') }}
          </el-button>
        </div>

        <el-table :data="connectorTb" v-loading="tbLoading">
          <el-table-column :label="tl('name')" sortable prop="name" />

          <el-table-column :label="tl('connType')" sortable prop="type">
            <template #default="{ row }">
              {{ getConnectorLabelByValue(row.type) }}
            </template>
          </el-table-column>
          <el-table-column :label="tl('bridgeNum')" sortable prop="num_of_bridges" />
          <el-table-column :label="$t('Base.operation')">
            <template #default="{ row }">
              <el-button size="small" @click="openEdit(row)">
                {{ $t('Base.setting') }}
              </el-button>
              <el-button size="small" type="danger" plain @click="deleteConnectorHandler(row)">
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <connector-dialog
          :edit="!!itemConnector"
          v-if="isDialogOpen"
          v-model:open="isDialogOpen"
          v-model="itemConnector"
          @finish="finishConnectorDialog"
        />
      </div>
    </template>
  </router-view>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
import { getConnectorList, deleteConnector } from '@/api/ruleengine'
import { useI18n } from 'vue-i18n'
import { ConnectorItem } from '@/types/ruleengine'
import ConnectorDialog from '../components/ConnectorDialog.vue'
import { ElMessageBox as MB, ElMessage as M } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import useConnectorTypeValue from '@/hooks/Rule/bridge/useConnectorTypeValue'

let { t } = useI18n()

let connectorTb = ref([])
let tbLoading = ref(false)
const isDialogOpen = ref(false)
const itemConnector: Ref<undefined | ConnectorItem> = ref(undefined)
const { getConnectorLabelByValue } = useConnectorTypeValue()

const tl = function (key: string, collection = 'RuleEngine') {
  return t(collection + '.' + key)
}

const listConnector = async function () {
  tbLoading.value = true
  try {
    connectorTb.value = await getConnectorList()
  } catch (error) {
    console.error(error)
  } finally {
    tbLoading.value = false
  }
}

const deleteConnectorHandler = async (row: ConnectorItem) => {
  if (!row.id) return
  await MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
  tbLoading.value = true
  try {
    await deleteConnector(row.id)
    M.success(t('Base.deleteSuccess'))
    listConnector()
  } catch (error) {
    console.error(error)
  } finally {
    tbLoading.value = false
  }
}

const openCreate = () => {
  itemConnector.value = undefined
  isDialogOpen.value = true
}

const openEdit = async (row: ConnectorItem) => {
  isDialogOpen.value = true
  itemConnector.value = row
}

const finishConnectorDialog = async (success: boolean) => {
  if (success) {
    listConnector()
  }
}

onMounted(listConnector)
</script>

<style lang="scss"></style>
