<template>
  <div class="app-wrapper data-bridge">
    <el-table
      class="bridge-table"
      :data="sourceList"
      :empty-text="tl('sourceEmptyTip')"
      v-loading="isLoading"
      row-key="id"
    >
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
          <router-link :to="{ name: 'rule', query: { source: row.id } }">
            {{ row.rules?.length || 0 }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="enable" :label="$t('Base.isEnabled')" :min-width="92">
        <template #default="{ row }">
          <el-switch
            v-model="row.enable"
            :disabled="!$hasPermission('put')"
            @change="toggleEnable(row)"
          />
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
          <TableButton @click="$router.push(getDetailPageRoute(row.id, 'settings'))">
            {{ $t('Base.setting') }}
          </TableButton>
          <TableItemDropDown
            can-create-rule
            :row-data="row"
            :can-copy="false"
            @delete="handleDeleteSource(row)"
            @create-rule="createRuleWithSource(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <DeleteBridgeSecondConfirm
    v-model="showSecondConfirm"
    :rule-list="usingBridgeRules"
    :id="currentDeleteBridgeId"
    :direction="BridgeDirection.Ingress"
    @submitted="handleDeleteSuc"
  />
</template>

<script lang="ts" setup>
import useHandleSourceItem, { useDeleteSource } from '@/hooks/Rule/action/useHandleSourceItem'
import useSourceList from '@/hooks/Rule/action/useSourceList'
import { useBridgeTypeIcon, useBridgeTypeValue } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, ConnectionStatus } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { ElMessageBox, ElMessage as M } from 'element-plus'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DeleteBridgeSecondConfirm from '../Bridge/Components/DeleteBridgeSecondConfirm.vue'
import TableItemDropDown from '../components/TableItemDropDown.vue'
import TargetItemStatus from '../components/TargetItemStatus.vue'

const router = useRouter()

const sourceList = ref<Array<BridgeItem>>([])
const isLoading = ref(false)
const reconnectingMap: Ref<Map<string, boolean>> = ref(new Map())

const { t, tl } = useI18nTl('RuleEngine')
const { getGeneralTypeLabel } = useBridgeTypeValue()
const { getBridgeIcon } = useBridgeTypeIcon()

const initReconnectingMap = () => {
  reconnectingMap.value = new Map()
  sourceList.value.forEach(({ id }) => reconnectingMap.value.set(id, false))
}

const { getSourceList } = useSourceList()
const getList = async function () {
  isLoading.value = true
  try {
    sourceList.value = await getSourceList()
    initReconnectingMap()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const { toggleSourceEnable, reconnectSource } = useHandleSourceItem()
const toggleEnable = async (row: BridgeItem) => {
  const { enable } = row
  const sucMessage = enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'
  try {
    await toggleSourceEnable(row.id, enable)
    M.success(t(sucMessage))
    getList()
  } catch (error) {
    console.error(error)
    row.enable = !row.enable
  }
}

const createRuleWithSource = (sourceId: string) => {
  ElMessageBox.confirm(t('RuleEngine.useSourceCreateRule'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'success',
  })
    .then(() => {
      router.push({ name: 'rule-create', query: { sourceId } })
    })
    .catch(() => ({}))
}

const {
  showSecondConfirm,
  usingBridgeRules,
  currentDeleteBridgeId,
  handleDeleteSuc,
  handleDeleteSource,
} = useDeleteSource(getList)

const getDetailPageRoute = (id: string, tab?: string) => ({
  name: 'source-detail',
  params: { id },
  query: { tab },
})

const reconnect = async ({ id }: BridgeItem) => {
  try {
    reconnectingMap.value.set(id, true)
    await reconnectSource(id)
    getList()
  } catch (error) {
    //
  } finally {
    reconnectingMap.value.set(id, false)
  }
}

getList()
</script>
