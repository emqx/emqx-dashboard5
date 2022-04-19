<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" v-if="Component"></component>
    <template v-else>
      <div class="app-wrapper data-bridge">
        <div class="section-header">
          <div></div>
          <el-button type="primary" :icon="Plus" @click="$router.push({ name: 'bridge-create' })">
            {{ tl('create') }}
          </el-button>
        </div>

        <el-table class="bridge-table" :data="bridgeTb" v-loading="tbLoading">
          <el-table-column :label="tl('name')">
            <template #default="{ row }">
              <div class="bridge-column-first">
                <img
                  v-if="row.type"
                  class="icon-bridge-type"
                  :src="require(`@/assets/img/${row.type}.png`)"
                />
                <div>
                  <router-link :to="getBridgeDetailPageRoute(row.id)" class="bridge-name">
                    {{ row.name }}
                  </router-link>
                  <span class="bridge-type">{{ getTypeStr(row) }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="tl('SuccessNum')" sortable prop="metrics.success" />
          <el-table-column :label="tl('ErrNum')" sortable prop="metrics.failed" />
          <el-table-column :label="`${tl('speedNow')}(msg/s)`" sortable prop="metrics.rate" />
          <el-table-column :label="tl('status')" sortable :width="120">
            <template #default="{ row }">
              <BridgeItemStatus :bridge="row" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('Base.operation')" min-width="120">
            <template #default="{ row }">
              <el-button size="small" @click="$router.push(getBridgeDetailPageRoute(row.id))">
                {{ $t('Base.setting') }}
              </el-button>
              <el-button size="small" @click="enableOrDisableBridge(row)">
                {{ row.enable ? $t('Base.disable') : $t('Base.enable') }}
              </el-button>
              <el-button size="small" type="danger" plain @click="submitDeleteBridge(row.id)">
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { getBridgeList, startStopBridge, deleteBridge } from '@/api/ruleengine'
import { useI18n } from 'vue-i18n'
import { BridgeItem } from '@/types/rule'
import { ElMessageBox as MB, ElMessage as M } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useBridgeTypeOptions } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { onBeforeRouteUpdate } from 'vue-router'
import BridgeItemStatus from './Components/BridgeItemStatus.vue'

export default defineComponent({
  components: { BridgeItemStatus },
  setup() {
    let bridgeTb = ref([])
    let tbLoading = ref(false)
    let { t } = useI18n()
    const { getTypeStr } = useBridgeTypeOptions()

    const listBridge = async function () {
      tbLoading.value = true
      try {
        bridgeTb.value = await getBridgeList()
      } catch (error) {
        console.error(error)
      } finally {
        tbLoading.value = false
      }
    }

    const enableOrDisableBridge = async (row: BridgeItem) => {
      tbLoading.value = true
      const statusToSend = row.enable ? 'disable' : 'enable'
      const sucMessage = row.enable ? 'Base.disabledSuccess' : 'Base.enableSuccess'
      try {
        await startStopBridge(row.id, statusToSend)
        M.success(t(sucMessage))
        listBridge()
      } catch (error) {
        console.error(error)
      } finally {
        tbLoading.value = false
      }
    }

    const submitDeleteBridge = async (id: string) => {
      await MB.confirm(t('Base.confirmDelete'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
      tbLoading.value = true
      try {
        await deleteBridge(id)
        M.success(t('Base.deleteSuccess'))
        listBridge()
        tbLoading.value = false
      } catch (error) {
        console.error(error)
      }
    }

    const getBridgeDetailPageRoute = (id: string) => ({
      name: 'bridge-detail',
      params: { id },
    })

    onMounted(listBridge)

    onBeforeRouteUpdate((to) => {
      if (to.name === 'data-bridge') {
        listBridge()
      }
    })

    return {
      Plus,
      tl: (key: string) => t('RuleEngine.' + key),
      getTypeStr,
      bridgeTb,
      tbLoading,
      enableOrDisableBridge,
      submitDeleteBridge,
      getBridgeDetailPageRoute,
    }
  },
})
</script>

<style lang="scss" scoped>
.bridge-table {
  .bridge-column-first {
    display: flex;
    align-items: center;
  }
  .icon-bridge-type {
    width: 32px;
    height: 32px;
    margin-right: 4px;
  }
  .bridge-name {
    display: block;
    line-height: 16px;
    color: var(--el-color-primary);
  }
  .bridge-type {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
    line-height: 16px;
  }
}
</style>
