<template>
  <el-table :data="dataList" :empty-text="emptyTip" v-loading="isLoading" row-key="id">
    <el-table-column :label="tl('name')" :min-width="120">
      <template #default="{ row }">
        <router-link :to="getDetailPageRoute(row.id)" class="first-column-with-icon-type">
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
        <router-link :to="ruleFilterRoute(row.id)">
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
            :disabled="judgeIsWebhookAction(row)"
            @change="toggleEnable(row)"
          />
        </OperateWebhookAssociatedPopover>
      </template>
    </el-table-column>
    <el-table-column
      prop="description"
      :label="t('BridgeSchema.common.description.label')"
      :min-width="108"
    />
    <el-table-column :label="t('Base.lastModified')" :min-width="162">
      <template #default="{ row }">
        {{ dateFormat(row.last_modified_at) }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('Base.operation')" :min-width="168">
      <template #default="{ row }">
        <TableButton
          v-if="
            row.enable &&
            (row.status === ConnectionStatus.Disconnected ||
              row.status === ConnectionStatus.Inconsistent)
          "
          :loading="reconnectingMap.get(row.id) ?? false"
          @click="reconnect(row)"
        >
          {{ $t('RuleEngine.reconnect') }}
        </TableButton>
        <TableButton @click="$router.push(getDetailPageRoute(row.id, 'settings'))">
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
            @create-rule="createRuleWithTarget(row.id)"
          />
        </OperateWebhookAssociatedPopover>
      </template>
    </el-table-column>
  </el-table>
  <DeleteBridgeSecondConfirm
    v-model="showSecondConfirm"
    :rule-list="usingBridgeRules"
    :id="currentDeleteBridgeId"
    :direction="direction"
    @submitted="handleDeleteSuc"
  />
</template>

<script setup lang="ts">
import { dateFormat } from '@/common/tools'
import useActionList from '@/hooks/Rule/action/useActionList'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import useHandleSourceItem from '@/hooks/Rule/action/useHandleSourceItem'
import useSourceList from '@/hooks/Rule/action/useSourceList'
import useBridgeTypeValue, { useBridgeTypeIcon } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useDeleteBridge from '@/hooks/Rule/bridge/useDeleteBridge'
import useI18nTl from '@/hooks/useI18nTl'
import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import { BridgeDirection, ConnectionStatus } from '@/types/enum'
import { Action, BridgeItem, Source } from '@/types/rule'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'
import DeleteBridgeSecondConfirm from '../Bridge/Components/DeleteBridgeSecondConfirm.vue'
import OperateWebhookAssociatedPopover from './OperateWebhookAssociatedPopover.vue'
import TableItemDropDown from './TableItemDropDown.vue'
import TargetItemStatus from './TargetItemStatus.vue'

const props = defineProps<{
  type: 'source' | 'action'
}>()

const { t, tl } = useI18nTl('RuleEngine')

const dataList = ref<Array<BridgeItem>>([])

const { getSourceList } = useSourceList()
const { getActionList } = useActionList()

const isLoading = ref(false)
const getList = async () => {
  isLoading.value = true
  try {
    const queryFn = props.type === 'source' ? getSourceList : getActionList
    dataList.value = await queryFn()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
getList()

const emptyTip = props.type === 'source' ? tl('sourceEmptyTip') : tl('actionsEmptyTip')

const getDetailPageRoute = (id: string, tab?: string) => ({
  name: `${props.type}-detail`,
  params: { id },
  query: { tab },
})

const ruleFilterRoute = (id: string) => {
  const query = props.type === 'source' ? { source: id } : { action: id }
  return { name: 'rule', query }
}

const { getBridgeIcon } = useBridgeTypeIcon()
const { getGeneralTypeLabel } = useBridgeTypeValue()
const { judgeIsWebhookAction } = useWebhookUtils()

const { toggleSourceEnable, reconnectSource } = useHandleSourceItem()
const { toggleActionEnable, reconnectAction } = useHandleActionItem()

const reconnectingMap = ref<Map<string, boolean>>(new Map())
const reconnect = ({ id }: Source | Action) => {
  try {
    const reconnectFn = props.type === 'source' ? reconnectSource : reconnectAction
    reconnectingMap.value.set(id, true)
    reconnectFn(id)
  } catch (error) {
    //
  } finally {
    reconnectingMap.value.delete(id)
  }
}

const toggleEnable = async (row: Source | Action) => {
  const { enable } = row
  const sucMessage = enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'
  const toggleFn = props.type === 'source' ? toggleSourceEnable : toggleActionEnable
  try {
    await toggleFn(row.id, enable)
    ElMessage.success(t(sucMessage))
    getList()
  } catch (error) {
    console.error(error)
    row.enable = !row.enable
  }
}

const router = useRouter()
const createRuleWithTarget = (id: string) => {
  const confirmContent =
    props.type === 'source' ? tl('useSourceCreateRule') : tl('useActionCreateRule')
  const query = props.type === 'source' ? { sourceId: id } : { actionId: id }
  ElMessageBox.confirm(confirmContent, {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'success',
  })
    .then(() => {
      router.push({ name: 'rule-create', query })
    })
    .catch(() => ({}))
}

const {
  showSecondConfirm,
  usingBridgeRules,
  currentDeleteBridgeId,
  handleDeleteSuc,
  handleDeleteBridge,
} = useDeleteBridge(getList)
const direction = props.type === 'source' ? BridgeDirection.Ingress : BridgeDirection.Egress
</script>

<style lang="scss"></style>
