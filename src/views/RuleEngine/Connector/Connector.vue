<template>
  <div class="connectors">
    <div class="app-wrapper">
      <div
        class="section-header"
        :class="{ 'is-empty-state': isEmpty && !namespaceFilter && !isLoading }"
      >
        <el-row :gutter="20" justify="space-between">
          <el-col v-bind="colProps">
            <NamespaceSelect
              v-if="isMultiTenancyEnabled && !isNamespaceUser"
              v-model="namespaceFilter"
              :placeholder="t('BasicConfig.namespace')"
              :global="{ enable: true, value: GLOBAL_NAMESPACE_VALUE }"
              @clear="getList"
              @change="getList"
            />
          </el-col>
          <el-col v-bind="colProps">
            <div class="flex justify-end">
              <LinkButton
                :icon="Setting"
                :to="{ name: 'rule-engine-security' }"
                :disabled="!$hasPermission('post')"
              >
                <span> {{ t('BasicConfig.ssrfPolicy') }}</span>
              </LinkButton>
              <CreateButton
                v-if="!isEmpty || namespaceFilter || isLoading"
                @click="$router.push({ name: 'connector-create' })"
              />
            </div>
          </el-col>
        </el-row>
      </div>
      <template v-if="!isEmpty || namespaceFilter || isLoading">
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
              <OperationDisabledPopover
                :disabled-by-webhook="!judgeIsWebhookConnector(row)"
                :name="row.name"
                :namespace="row.namespace"
                :target-label="t('components.connector')"
                :operation="`${t('Base.enable')}${tl('or')}${t('Base.disable')}`"
              >
                <template #default="{ disabledOpByNsResource }">
                  <el-switch
                    :model-value="row.enable"
                    :disabled="
                      !$hasPermission('put') ||
                      judgeIsWebhookConnector(row) ||
                      disabledOpByNsResource
                    "
                    @update:modelValue="enableOrDisableConnector(row)"
                  />
                </template>
              </OperationDisabledPopover>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isMultiTenancyEnabled && !isNamespaceUser"
            prop="namespace"
            :label="t('BasicConfig.namespace')"
            :min-width="108"
          />
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
                  <TableButton
                    v-if="isErrorStatus(row)"
                    :disabled="!$hasPermission('post') || row.canNotView"
                    :loading="reconnectingMap.get(row.id)"
                    @click="reconnect(row)"
                  >
                    {{ $t('RuleEngine.reconnect') }}
                  </TableButton>
                  <TableButton
                    :disabled="row.canNotView"
                    @click="$router.push(getDetailPageRoute(row))"
                  >
                    {{ $t('Base.setting') }}
                  </TableButton>
                  <OperationDisabledPopover
                    :disabled-by-webhook="!judgeIsWebhookConnector(row)"
                    :name="row.name"
                    :namespace="row.namespace"
                    :operation="tl('moreOperation')"
                    :target-label="t('components.connector')"
                  >
                    <template #default="{ disabledOpByNsResource }">
                      <TableItemDropDown
                        :can-create-rule="row.type !== BridgeType.SysKeeperProxy"
                        :row-data="row"
                        :disabled="
                          row.canNotView || judgeIsWebhookConnector(row) || disabledOpByNsResource
                        "
                        @copy="copyConnectorItem(row)"
                        @create-rule="createRuleWithConnector(row)"
                        @delete="handleDeleteConnector(row, getList)"
                      />
                    </template>
                  </OperationDisabledPopover>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div v-else class="connector-empty-state">
        <div class="empty-state-header">
          <h3 class="empty-state-title">{{ tl('selectConnectorTypeToCreate') }}</h3>
          <p class="empty-state-desc">{{ tl('connectorEmptyStateDesc') }}</p>
        </div>
        <ConnectorTypeCards @select="handleTypeSelect" />
      </div>
    </div>
    <CreateRuleWithConnector v-model="showCreateRuleDialog" :connector="createdConnector" />
  </div>
  <DelConnectorTip v-model="showDelTip" :connector="currentConnector" />
  <DisableConnectorConfirm
    v-model="showDisableConfirm"
    v-bind="{ connector: currentConnector as Connector }"
    @submitted="getList"
  />
</template>

<script setup lang="ts">
import { BridgeType, ConnectionStatus } from '@/types/enum'
import {
  GLOBAL_NAMESPACE_VALUE,
  SEARCH_FORM_RES_PROPS as colProps,
  type NamespaceSelection,
} from '@/common/constants'
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import { BridgeItem, Connector } from '@/types/rule'
import { Setting } from '@element-plus/icons-vue'
import OperationDisabledPopover from '../components/OperationDisabledPopover.vue'
import TableItemDropDown from '../components/TableItemDropDown.vue'
import TargetItemStatus from '../components/TargetItemStatus.vue'
import CreateRuleWithConnector from './components/CreateRuleWithConnector.vue'
import DelConnectorTip from './components/DelConnectorTip.vue'
import DisableConnectorConfirm from './components/DisableConnectorConfirm.vue'
import ConnectorTypeCards from './components/ConnectorTypeCards.vue'

const route = useRoute()
const router = useRouter()

const store = useStore()
const isMultiTenancyEnabled = useMultiTenancyEnabled()
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)

const isLoading = ref<boolean>(false)
const tableData = ref<Array<Connector | BridgeItem>>([])

const namespaceFromRoute = route.query.ns
const namespaceFilter = ref<NamespaceSelection | undefined>(
  typeof namespaceFromRoute === 'string' ? namespaceFromRoute : undefined,
)

const reconnectingMap = ref<Map<string, boolean>>(new Map())

// Empty state detection
const isEmpty = computed(() => !isLoading.value && tableData.value.length === 0)

const { t, tl } = useI18nTl('RuleEngine')

const { getConnectorList } = useConnectorList()
const { getListNamespaceParams } = useListNsParams()
const getList = async () => {
  try {
    isLoading.value = true
    const nsParams = getListNamespaceParams(namespaceFilter.value)
    tableData.value = await getConnectorList(nsParams)
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
} = useHandleConnectorItem()
const { judgeIsWebhookConnector } = useWebhookUtils()

const reconnect = async (connector: Connector) => {
  const { id } = connector
  try {
    reconnectingMap.value.set(id, true)
    await reconnectConnector(connector)
    getList()
  } catch (error) {
    //
  } finally {
    reconnectingMap.value.set(id, false)
  }
}

const { getNsParams } = useNsParams()
const getDetailPageRoute = ({ id, namespace }: Connector) => ({
  name: 'connector-detail',
  params: { id },
  query: getNsParams(namespace),
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

const handleTypeSelect = (type: BridgeType) => {
  router.push({
    name: 'connector-create',
    query: { type, autoAdvance: 'true' },
  })
}

const { getBridgeIcon } = useBridgeTypeIcon()
const { getTypeStr } = useConnectorTypeValue()

getList()
</script>

<style lang="scss">
.connectors {
  .section-header.is-empty-state {
    max-width: 1400px;
    margin-right: auto;
    margin-left: auto;
    padding-right: 24px;
    padding-left: 24px;
  }

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

  .connector-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 24px 40px;
    max-width: 1400px;
    margin: 0 auto;

    .empty-state-header {
      text-align: center;
      margin-bottom: 40px;

      .empty-state-title {
        font-size: 24px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0 0 12px 0;
      }

      .empty-state-desc {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin: 0;
        max-width: 600px;
      }
    }
  }
}
</style>
