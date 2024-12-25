<template>
  <div class="connectors">
    <div class="app-wrapper">
      <div class="section-header">
        <div></div>
        <CreateButton @click="$router.push({ name: 'connector-create' })" />
      </div>
      <el-table :data="tableData" ref="TableCom" row-key="id" v-loading.lock="isLoading">
        <el-table-column :label="tl('name')" :min-width="120">
          <template #default="{ row }">
            <el-tooltip
              class="box-item"
              effect="dark"
              placement="top"
              :disabled="!row.canNotView"
              :content="tl('canNotViewConnectorTip')"
            >
              <div class="tooltip-content">
                <router-link
                  :to="row.canNotView ? '' : getDetailPageRoute(row)"
                  class="first-column-with-icon-type link-detail"
                  :class="{ 'is-disabled': row.canNotView }"
                >
                  <img v-if="row.type" class="icon-type" :src="getBridgeIcon(row.type)" />
                  <div class="name-type-block">
                    <span class="name-data">
                      {{ row.name }}
                    </span>
                    <span class="type-data">{{ getTypeStr(row.type) }}</span>
                  </div>
                </router-link>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="tl('connectionStatus')">
          <template #default="{ row }">
            <TargetItemStatus type="connector" :target="row" />
          </template>
        </el-table-column>
        <el-table-column prop="enable" :label="$t('Base.isEnabled')" :min-width="92">
          <template #default="{ row }">
            <OperateWebhookAssociatedPopover
              :disabled="!judgeIsWebhookConnector(row)"
              :name="row.name"
              :operation="`${t('Base.enable')}${tl('or')}${t('Base.disable')}`"
              :targetLabel="tl('action')"
            >
              <el-switch
                :model-value="row.enable"
                :disabled="judgeIsWebhookConnector(row)"
                @update:modelValue="enableOrDisableConnector(row)"
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
            <el-tooltip
              class="box-item"
              effect="dark"
              placement="top-start"
              :disabled="!row.canNotView"
              :content="tl('canNotViewConnectorTip')"
            >
              <div class="tooltip-content">
                <el-button
                  size="small"
                  v-if="isErrorStatus(row)"
                  :disabled="row.canNotView"
                  :loading="reconnectingMap.get(row.id)"
                  @click="reconnect(row)"
                >
                  {{ $t('RuleEngine.reconnect') }}
                </el-button>
                <el-button
                  size="small"
                  :disabled="row.canNotView"
                  @click="$router.push(getDetailPageRoute(row))"
                >
                  {{ $t('Base.setting') }}
                </el-button>
                <OperateWebhookAssociatedPopover
                  :disabled="!judgeIsWebhookConnector(row)"
                  :name="row.name"
                  :operation="tl('moreOperation')"
                  :targetLabel="t('components.connector')"
                >
                  <TableItemDropDown
                    can-create-rule
                    :row-data="row"
                    :disabled="row.canNotView || judgeIsWebhookConnector(row)"
                    @copy="copyConnectorItem(row)"
                    @create-rule="createRuleWithConnector(row)"
                    @delete="handleDeleteConnector(row, getList)"
                  />
                </OperateWebhookAssociatedPopover>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <CreateRuleWithConnector v-model="showCreateRuleDialog" :connector="createdConnector" />
  </div>
  <DelConnectorTip v-model="showDelTip" :connector="currentConnector" />
  <DeleteWebhookAssociatedTip
    v-model="showDeleteWebhookAssociatedTip"
    type="connector"
    :name="currentDelName"
  />
  <DisableConnectorConfirm
    v-model="showDisableConfirm"
    :connector="(currentConnector as Connector)"
    @submitted="getList"
  />
</template>

<script setup lang="ts">
import { useBridgeTypeIcon, useConnectorTypeValue } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useConnectorList from '@/hooks/Rule/connector/useConnectorList'
import useHandleConnectorItem from '@/hooks/Rule/connector/useHandleConnectorItem'
import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import useI18nTl from '@/hooks/useI18nTl'
import { ConnectionStatus } from '@/types/enum'
import { BridgeItem, Connector } from '@/types/rule'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DeleteWebhookAssociatedTip from '../components/DeleteWebhookAssociatedTip.vue'
import OperateWebhookAssociatedPopover from '../components/OperateWebhookAssociatedPopover.vue'
import TableItemDropDown from '../components/TableItemDropDown.vue'
import TargetItemStatus from '../components/TargetItemStatus.vue'
import CreateRuleWithConnector from './components/CreateRuleWithConnector.vue'
import DelConnectorTip from './components/DelConnectorTip.vue'
import DisableConnectorConfirm from './components/DisableConnectorConfirm.vue'

const router = useRouter()

const isLoading = ref<boolean>(false)
const tableData = ref<Array<Connector | BridgeItem>>([])

const reconnectingMap = ref<Map<string, boolean>>(new Map())

const { t, tl } = useI18nTl('RuleEngine')

const { getConnectorList } = useConnectorList()
const getList = async () => {
  try {
    isLoading.value = true
    tableData.value = await getConnectorList()
    initReconnectingMap()
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const initReconnectingMap = () => {
  reconnectingMap.value = new Map()
  tableData.value.forEach(({ id }) => reconnectingMap.value.set(id, false))
}

const isErrorStatus = ({ status }: Connector) =>
  status === ConnectionStatus.Disconnected || status === ConnectionStatus.Inconsistent

const {
  handleDeleteConnector,
  reconnectConnector,
  showDisableConfirm,
  currentConnector,
  handleToggleConnectorEnable,
  showDelTip,
  currentDelName,
  showDeleteWebhookAssociatedTip,
} = useHandleConnectorItem()
const { judgeIsWebhookConnector } = useWebhookUtils()

const reconnect = async ({ id }: Connector) => {
  try {
    reconnectingMap.value.set(id, true)
    await reconnectConnector(id)
    getList()
  } catch (error) {
    //
  } finally {
    reconnectingMap.value.set(id, false)
  }
}

const getDetailPageRoute = ({ id }: Connector) => ({
  name: 'connector-detail',
  params: { id },
})

const enableOrDisableConnector = async (connector: Connector) => {
  try {
    await handleToggleConnectorEnable(connector, getList)
  } catch (error) {
    //
  }
}

const showCreateRuleDialog = ref(false)
const createdConnector = ref<undefined | Connector>(undefined)
const createRuleWithConnector = async (connector: Connector) => {
  showCreateRuleDialog.value = true
  createdConnector.value = connector
}

const copyConnectorItem = ({ id }: Connector) => {
  router.push({ name: 'connector-create', query: { action: 'copy', target: id } })
}

const { getBridgeIcon } = useBridgeTypeIcon()
const { getTypeStr } = useConnectorTypeValue()

getList()
</script>

<style lang="scss">
.connectors {
  .tooltip-content {
    width: -webkit-fit-content;
    width: fit-content;
  }
  .link-detail {
    &.is-disabled {
      .name-data {
        color: var(--color-text-primary);
      }
    }
  }
}
</style>
