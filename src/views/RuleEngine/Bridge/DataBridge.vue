<template>
  <div class="app-wrapper data-bridge">
    <el-table
      class="bridge-table"
      :data="bridgeTb"
      :empty-text="tl('actionsEmptyTip')"
      v-loading="tbLoading"
      row-key="id"
    >
      <el-table-column :label="tl('name')" :min-width="120">
        <template #default="{ row }">
          <router-link :to="getBridgeDetailPageRoute(row.id)" class="first-column-with-icon-type">
            <img v-if="row.type" class="icon-type" :src="getBridgeIcon(row.type)" />
            <div class="name-type-block">
              <span class="name-data">
                {{ row.name }}
              </span>
              <span class="type-data">{{ getGeneralTypeLabel(row.type) }}</span>
            </div>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.status')" :min-width="120">
        <template #default="{ row }">
          <TargetItemStatus type="action" :target="row" />
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
            v-if="
              row.enable &&
              (row.status === ConnectionStatus.Disconnected ||
                row.status === ConnectionStatus.Inconsistent)
            "
            :loading="reconnectingMap.get(row.id)"
            @click="reconnect(row)"
          >
            {{ $t('RuleEngine.reconnect') }}
          </el-button>
          <el-button
            size="small"
            @click="$router.push(getBridgeDetailPageRoute(row.id, 'settings'))"
          >
            {{ $t('Base.setting') }}
          </el-button>
          <TableItemDropDown
            is-bridge
            :row-data="row"
            :can-copy="false"
            @delete="handleDeleteBridge(row)"
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
    :direction="delBridgeDirection"
    @submitted="handleDeleteSuc"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BridgeItem } from '@/types/rule'
import { ElMessage as M, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useBridgeTypeValue, useBridgeTypeIcon } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { useRouter } from 'vue-router'
import TargetItemStatus from '../components/TargetItemStatus.vue'
import TableItemDropDown from '../components/TableItemDropDown.vue'
import DeleteBridgeSecondConfirm from './Components/DeleteBridgeSecondConfirm.vue'
import useDeleteBridge from '@/hooks/Rule/bridge/useDeleteBridge'
import { ConnectionStatus } from '@/types/enum'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import useMixedActionList from '@/hooks/Rule/action/useMixedActionList'

export default defineComponent({
  components: { TargetItemStatus, TableItemDropDown, DeleteBridgeSecondConfirm },
  setup() {
    const bridgeTb = ref<Array<BridgeItem>>([])
    const tbLoading = ref(false)
    const router = useRouter()
    const reconnectingMap: Ref<Map<string, boolean>> = ref(new Map())
    const { t } = useI18n()
    const { getGeneralTypeLabel } = useBridgeTypeValue()
    const { getBridgeIcon } = useBridgeTypeIcon()

    const initReconnectingMap = () => {
      reconnectingMap.value = new Map()
      bridgeTb.value.forEach(({ id }) => reconnectingMap.value.set(id, false))
    }

    const { getMixedActionList } = useMixedActionList()
    const listBridge = async function () {
      tbLoading.value = true
      try {
        bridgeTb.value = await getMixedActionList()
        initReconnectingMap()
      } catch (error) {
        console.error(error)
      } finally {
        tbLoading.value = false
      }
    }

    const { toggleActionEnable, reconnectAction } = useHandleActionItem()
    const enableOrDisableBridge = async (row: BridgeItem) => {
      const { enable } = row
      const sucMessage = enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'
      try {
        await toggleActionEnable(row.id, enable)
        M.success(t(sucMessage))
        listBridge()
      } catch (error) {
        console.error(error)
        row.enable = !row.enable
      }
    }

    const createRuleWithBridge = (bridgeId: string) => {
      ElMessageBox.confirm(t('RuleEngine.useActionCreateRule'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'success',
      })
        .then(() => {
          router.push({ name: 'rule-create', query: { bridgeId } })
        })
        .catch(() => ({}))
    }

    const {
      showSecondConfirm,
      usingBridgeRules,
      currentDeleteBridgeId,
      handleDeleteSuc,
      delBridgeDirection,
      handleDeleteBridge,
    } = useDeleteBridge(listBridge)

    const getBridgeDetailPageRoute = (id: string, tab?: string) => ({
      name: 'action-detail',
      params: { id },
      query: { tab },
    })

    const reconnect = async ({ id }: BridgeItem) => {
      try {
        reconnectingMap.value.set(id, true)
        await reconnectAction(id)
        listBridge()
      } catch (error) {
        //
      } finally {
        reconnectingMap.value.set(id, false)
      }
    }

    onMounted(listBridge)

    return {
      Plus,
      t,
      tl: (key: string) => t('RuleEngine.' + key),
      getGeneralTypeLabel,
      bridgeTb,
      tbLoading,
      getBridgeIcon,
      enableOrDisableBridge,
      showSecondConfirm,
      usingBridgeRules,
      currentDeleteBridgeId,
      handleDeleteSuc,
      handleDeleteBridge,
      delBridgeDirection,
      reconnectingMap,
      ConnectionStatus,
      reconnect,
      createRuleWithBridge,
      getBridgeDetailPageRoute,
    }
  },
})
</script>
