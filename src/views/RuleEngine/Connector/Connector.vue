<template>
  <div class="app-wrapper data-bridge">
    <router-view v-slot="{ Component }">
      <component :is="Component" v-if="Component"></component>
      <template v-else>
        <div class="section-header">
          <div></div>
          <el-button
            size="small"
            type="primary"
            :icon="Plus"
            @click="$router.push({ name: 'connector-create' })"
            >{{ tl('createConnector') }}</el-button
          >
        </div>

        <el-table :data="connectorTb" v-loading="tbLoading">
          <el-table-column :label="tl('name')" sortable prop="name" />

          <el-table-column :label="tl('connType')" sortable prop="type" />
          <el-table-column :label="tl('bridgeNum')" sortable prop="num_of_bridges" />
          <el-table-column :label="$t('Base.operation')">
            <template #default="{ row }">
              <el-button size="mini" @click="openEdit(row)">
                {{ $t('Base.setting') }}
              </el-button>
              <el-button size="mini" type="danger" @click="deleteConnectorHandler(row)">
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <connector-dialog
          :edit="true"
          v-if="openEditDialog"
          v-model:open="openEditDialog"
          v-model="itemConnector"
          @finish="finishConnectorDialog"
        />
      </template>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { getConnectorList, deleteConnector } from '@/api/ruleengine'
import { useI18n } from 'vue-i18n'
import { ConnectorItem } from '@/types/ruleengine'
import ConnectorDialog from '../components/ConnectorDialog.vue'
import { ElMessageBox as MB, ElMessage as M } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

export default defineComponent({
  components: { ConnectorDialog },
  setup() {
    let connectorTb = ref([])
    let tbLoading = ref(false)
    let { t } = useI18n()
    const openEditDialog = ref(false)
    const itemConnector = ref({})

    const translate = function (key: string, collection = 'RuleEngine') {
      return t(collection + '.' + key)
    }

    const listConnector = async function () {
      tbLoading.value = true
      let res = await getConnectorList().catch(() => {})
      if (res) {
        connectorTb.value = res
      }
      tbLoading.value = false
    }

    const deleteConnectorHandler = async (row: ConnectorItem) => {
      if (!row.id) return
      MB.confirm(t('Base.confirmDelete'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          tbLoading.value = true
          let res = await deleteConnector(row.id).catch(() => {})
          if (res) {
            M({
              type: 'success',
              message: t('Base.deleteSuccess'),
            })
            listConnector()
          }
          tbLoading.value = false
        })
        .catch(() => {})
    }

    const openEdit = async (row: ConnectorItem) => {
      openEditDialog.value = true
      itemConnector.value = row
    }

    const finishConnectorDialog = async (success: boolean, data: Record<string, unknown>) => {
      if (success) {
        listConnector()
      }
    }

    onMounted(listConnector)

    return {
      Plus,
      tl: translate,
      connectorTb,
      tbLoading,
      deleteConnectorHandler,
      openEdit,
      openEditDialog,
      itemConnector,
      finishConnectorDialog,
    }
  },
})
</script>

<style lang="scss"></style>
