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
      <el-table-column :label="tl('associatedRules')" :min-width="120">
        <template #default="{ row }">
          <router-link :to="{ name: 'rule', query: { action: row.id } }">
            {{ row.rules?.length || 0 }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="enable" :label="$t('Base.isEnabled')" :min-width="92">
        <template #default="{ row }">
          <OperateWebhookAssociatedPopover
            :disabled="!judgeIsWebhookAction(row)"
            :name="row.name"
            :operation="`${t('Base.enable')}${tl('or')}${t('Base.disable')}`"
            :targetLabel="tl('action')"
          >
            <el-switch
              v-model="row.enable"
              :disabled="judgeIsWebhookAction(row) || !$hasPermission('put')"
              @change="enableOrDisableBridge(row)"
            />
          </OperateWebhookAssociatedPopover>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        :label="t('BridgeSchema.common.description.label')"
        :min-width="108"
      />
      <el-table-column :label="$t('Base.operation')" :min-width="168">
        <template #default="{ row }">
          <TableButton
            v-if="
              row.enable &&
              (row.status === ConnectionStatus.Disconnected ||
                row.status === ConnectionStatus.Inconsistent)
            "
            :disabled="!$hasPermission('post')"
            :loading="reconnectingMap.get(row.id)"
            @click="reconnect(row)"
          >
            {{ $t('RuleEngine.reconnect') }}
          </TableButton>
          <TableButton @click="$router.push(getBridgeDetailPageRoute(row.id, 'settings'))">
            {{ $t('Base.setting') }}
          </TableButton>
          <OperateWebhookAssociatedPopover
            :disabled="!judgeIsWebhookAction(row)"
            :name="row.name"
            :operation="tl('moreOperation')"
            :targetLabel="tl('action')"
          >
            <TableItemDropDown
              can-create-rule
              :row-data="row"
              :can-copy="false"
              :disabled="judgeIsWebhookAction(row)"
              @delete="handleDeleteBridge(row)"
              @create-rule="createRuleWithBridge(row.id)"
            />
          </OperateWebhookAssociatedPopover>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <DeleteBridgeSecondConfirm
    v-model="showSecondConfirm"
    :rule-list="usingBridgeRules"
    :id="currentDeleteBridgeId"
    :direction="BridgeDirection.Egress"
    @submitted="handleDeleteSuc"
  />
</template>

<script lang="ts" setup>
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import useActionList from '@/hooks/Rule/action/useActionList'
import { useBridgeTypeIcon, useBridgeTypeValue } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useDeleteBridge from '@/hooks/Rule/bridge/useDeleteBridge'
import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, ConnectionStatus } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { ElMessageBox, ElMessage as M } from 'element-plus'
import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import OperateWebhookAssociatedPopover from '../components/OperateWebhookAssociatedPopover.vue'
import TableItemDropDown from '../components/TableItemDropDown.vue'
import TargetItemStatus from '../components/TargetItemStatus.vue'
import DeleteBridgeSecondConfirm from './Components/DeleteBridgeSecondConfirm.vue'

const bridgeTb = ref<Array<BridgeItem>>([])
const tbLoading = ref(false)
const router = useRouter()
const reconnectingMap: Ref<Map<string, boolean>> = ref(new Map())

const { t, tl } = useI18nTl('RuleEngine')
const { getGeneralTypeLabel } = useBridgeTypeValue()
const { getBridgeIcon } = useBridgeTypeIcon()

const initReconnectingMap = () => {
  reconnectingMap.value = new Map()
  bridgeTb.value.forEach(({ id }) => reconnectingMap.value.set(id, false))
}

const { getActionList } = useActionList()
const listBridge = async function () {
  tbLoading.value = true
  try {
    bridgeTb.value = await getActionList()
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

const createRuleWithBridge = (id: string) => {
  ElMessageBox.confirm(t('RuleEngine.useActionCreateRule'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'success',
  })
    .then(() => {
      router.push({ name: 'rule-create', query: { actionId: id } })
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
const { judgeIsWebhookAction } = useWebhookUtils()

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
</script>
