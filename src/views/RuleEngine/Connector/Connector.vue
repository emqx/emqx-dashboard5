<template>
  <div class="connectors">
    <div class="app-wrapper">
      <div class="section-header">
        <div></div>
        <el-button type="primary" :icon="Plus" @click="$router.push({ name: 'connector-create' })">
          {{ tl('create') }}
        </el-button>
      </div>
      <el-table :data="tableData" ref="TableCom" row-key="id" v-loading.lock="isLoading">
        <el-table-column :label="tl('name')" :min-width="120">
          <template #default="{ row }">
            <router-link :to="getDetailPageRoute(row)" class="first-column-with-icon-type">
              <img v-if="row.type" class="icon-type" :src="getBridgeIcon(row.type)" />
              <div class="name-type-block">
                <span class="name-data">
                  {{ row.name }}
                </span>
                <span class="type-data">{{ getTypeStr(row.type) }}</span>
              </div>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column :label="tl('connectionStatus')">
          <template #default="{ row }">
            <TargetItemStatus :target="row" />
          </template>
        </el-table-column>
        <!-- <el-table-column :label="tl('associativeDataBridge')">
          <template #default="{ row }"> TODO:{{ row.XXXXXXX }} </template>
        </el-table-column> -->
        <el-table-column :label="$t('Base.operation')" :min-width="168">
          <template #default="{ row }">
            <el-button
              size="small"
              v-if="isErrorStatus(row)"
              :loading="reconnectingMap.get(row.id)"
              @click="reconnect(row)"
            >
              {{ $t('RuleEngine.reconnect') }}
            </el-button>
            <el-button size="small" @click="$router.push(getDetailPageRoute(row))">
              {{ $t('Base.setting') }}
            </el-button>
            <!-- TODO:disable del -->
            <!-- :disable-del="row.XXXXXX" -->
            <TableItemDropDown
              :row-data="row"
              @copy="copyConnectorItem(row)"
              @delete="handleDeleteConnector(row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBridgeTypeIcon, useConnectorTypeValue } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useHandleConnectorItem from '@/hooks/Rule/connector/useHandleConnectorItem'
import useMixedConnectorList from '@/hooks/Rule/connector/useMixedConnectorList'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { ConnectionStatus } from '@/types/enum'
import { BridgeItem, Connector } from '@/types/rule'
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TableItemDropDown from '../components/TableItemDropDown.vue'
import TargetItemStatus from '../components/TargetItemStatus.vue'

const router = useRouter()

const isLoading = ref<boolean>(false)
const tableData = ref<Array<Connector | BridgeItem>>([])

const reconnectingMap = ref<Map<string, boolean>>(new Map())

const { tl } = useI18nTl('RuleEngine')

const { getMixedConnectorList } = useMixedConnectorList()
const getList = async () => {
  try {
    isLoading.value = true
    tableData.value = await getMixedConnectorList()
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

const { deleteConnector, reconnectConnector } = useHandleConnectorItem()

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

const copyConnectorItem = ({ id }: Connector) => {
  router.push({ name: 'connector-create', query: { action: 'copy', target: id } })
}

// TODO:TODO:TODO:
const { confirmDel } = useOperationConfirm()
const handleDeleteConnector = async ({ id }: Connector) => {
  // TODO:can not delete connector which associated with action
  // if (XXXXX) {
  //   return
  // }
  try {
    await confirmDel(() => deleteConnector(id))
    getList()
  } catch (error) {
    //
  }
}

const { getBridgeIcon } = useBridgeTypeIcon()
const { getTypeStr } = useConnectorTypeValue()

getList()
</script>

<style lang="scss"></style>