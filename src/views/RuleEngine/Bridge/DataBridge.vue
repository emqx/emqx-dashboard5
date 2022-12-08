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

        <el-table class="bridge-table" :data="bridgeTb" v-loading="tbLoading" row-key="id">
          <el-table-column :label="tl('name')" :min-width="120">
            <template #default="{ row }">
              <router-link
                :to="getBridgeDetailPageRoute(row.id)"
                class="first-column-with-icon-type"
              >
                <img v-if="row.type" class="icon-type" :src="getBridgeIcon(row.type)" />
                <div class="name-type-block">
                  <span class="name-data">
                    {{ row.name }}
                  </span>
                  <span class="type-data">{{ getTypeStr(row) }}</span>
                </div>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="tl('status')" :min-width="120">
            <template #default="{ row }">
              <BridgeItemStatus :bridge="row" />
            </template>
          </el-table-column>
          <el-table-column prop="enable" :label="$t('Base.isEnabled')" :min-width="92">
            <template #default="{ row }">
              <el-switch v-model="row.enable" @change="enableOrDisableBridge(row)" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('Base.operation')" :min-width="168">
            <template #default="{ row }">
              <el-button
                size="small"
                @click="$router.push(getBridgeDetailPageRoute(row.id, 'settings'))"
              >
                {{ $t('Base.setting') }}
              </el-button>
              <TableItemDropDown
                is-bridge
                :row-data="row"
                @copy="copyBridgeItem(row)"
                @delete="handleDeleteBridge(row.id)"
                @create-rule="createRuleWithBridge(row.id)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <DeleteBridgeSecondConfirm
        v-model="showSecondConfirm"
        :rule-list="usingBridgeRules"
        :id="currentDeleteBridgeId"
        @submitted="handleDeleteSuc"
      />
    </template>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { getBridgeList, startStopBridge } from '@/api/ruleengine'
import { useI18n } from 'vue-i18n'
import { BridgeItem } from '@/types/rule'
import { ElMessage as M, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useBridgeTypeOptions, useBridgeTypeIcon } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import BridgeItemStatus from './Components/BridgeItemStatus.vue'
import TableItemDropDown from '../components/TableItemDropDown.vue'
import DeleteBridgeSecondConfirm from './Components/DeleteBridgeSecondConfirm.vue'
import useDeleteBridge from '@/hooks/Rule/bridge/useDeleteBridge'

export default defineComponent({
  components: { BridgeItemStatus, TableItemDropDown, DeleteBridgeSecondConfirm },
  setup() {
    const bridgeTb = ref([])
    const tbLoading = ref(false)
    const router = useRouter()
    const { t } = useI18n()
    const { getTypeStr } = useBridgeTypeOptions()
    const { getBridgeIcon } = useBridgeTypeIcon()

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
      const statusToSend = row.enable ? 'enable' : 'disable'
      const sucMessage = row.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'
      try {
        await startStopBridge(row.id, statusToSend)
        M.success(t(sucMessage))
        listBridge()
      } catch (error) {
        console.error(error)
        row.enable = !row.enable
      }
    }

    const createRuleWithBridge = (bridgeId: string) => {
      ElMessageBox.confirm(t('RuleEngine.useBridgeCreateRule'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'success',
      })
        .then(() => {
          router.push({ name: 'iot-create', query: { bridgeId } })
        })
        .catch(() => ({}))
    }

    const {
      showSecondConfirm,
      usingBridgeRules,
      currentDeleteBridgeId,
      handleDeleteSuc,
      handleDeleteBridge,
    } = useDeleteBridge(listBridge)

    const getBridgeDetailPageRoute = (id: string, tab?: string) => ({
      name: 'bridge-detail',
      params: { id },
      query: { tab },
    })

    const copyBridgeItem = (row: BridgeItem) => {
      router.push({ name: 'bridge-create', query: { action: 'copy', target: row.id } })
    }

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
      getBridgeIcon,
      enableOrDisableBridge,
      showSecondConfirm,
      usingBridgeRules,
      currentDeleteBridgeId,
      handleDeleteSuc,
      handleDeleteBridge,
      copyBridgeItem,
      createRuleWithBridge,
      getBridgeDetailPageRoute,
    }
  },
})
</script>
