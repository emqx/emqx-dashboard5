<template>
  <div class="plugins app-wrapper">
    <div class="section-header">
      <div class="filters">
        <el-input :placeholder="$t('Plugins.searchPlaceholder')" v-model="keyForSearch" />
        <el-radio-group v-model="filterStatus">
          <el-radio-button v-for="{ label, value } in statusOptions" :key="value" :label="value">
            {{ label }}
            ({{ statusCounter[value] }})
          </el-radio-button>
        </el-radio-group>
      </div>
      <el-button type="primary" @click="goInstall">{{ tl('installPlugin') }}</el-button>
    </div>
    <el-table
      :data="pluginListToShow"
      v-loading="isTableLoading"
      ref="tableCom"
      row-key="name"
      class="table-with-draggable"
    >
      <el-table-column :label="tl('name')">
        <template #default="{ row }">
          <i class="icon icon-plugin"></i>
          <div class="plugin-info-hd">
            <router-link :to="detailLink(row)">{{ row.name }}</router-link>
            <span>{{ row.rel_vsn }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="tl('author')">
        <template #default="{ row }">{{ getPluginAuthorString(row) }}</template>
      </el-table-column>
      <el-table-column :label="tl('status')">
        <template #default="{ row }">
          <el-tooltip placement="left" popper-class="tooltip-node-status-list">
            <span>
              <el-badge is-dot :type="dotClass(getTheWorstStatus(row))" />
              <span class="text-status" :class="statusTextClass(getTheWorstStatus(row))">
                {{ statusText(getTheWorstStatus(row)) }}
              </span>
            </span>
            <template #content>
              <div class="status-detail">
                <ul class="node-status-list">
                  <li
                    class="node-status-item"
                    v-for="{ node, status } in row.running_status"
                    :key="node"
                  >
                    <span class="text-status" :class="statusTextClass(status)">
                      {{ statusText(status) }}
                    </span>
                    <span class="node-name">{{ node }}</span>
                  </li>
                </ul>
              </div>
            </template>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button
            size="small"
            v-if="pluginTotalStatus(row) === PluginStatus.Running"
            @click="handleDisable(row)"
          >
            {{ tl('stop') }}
          </el-button>
          <el-button
            size="small"
            v-else-if="pluginTotalStatus(row) === PluginStatus.Stopped"
            @click="handleEnable(row)"
          >
            {{ tl('start') }}
          </el-button>
          <TableItemDropdown
            :row-data="row"
            :filtered="isTableFiltered"
            @move-to-top="moveToTop"
            @move-to-bottom="moveToBottom"
            @uninstall="handleUninstall"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { PluginStatus } from '@/types/enum'
import { useI18n } from 'vue-i18n'
import { computed, ComputedRef, nextTick, ref } from 'vue'
import { PluginItem } from '@/types/plugin'
import usePluginStatus from '@/hooks/Plugins/usePluginStatus'
import { useRouter } from 'vue-router'
import usePluginItem from '@/hooks/Plugins/usePluginItem'
import TableItemDropdown from './components/TableItemDropdown.vue'
import usePaging, { FilterItem } from '@/hooks/usePaging'
import { queryPlugins } from '@/api/plugins'
import { SortableEvent } from 'sortablejs'
import useSortableTable from '@/hooks/useSortableTable'
import useMove from '@/hooks/useMove'

const router = useRouter()
const { t } = useI18n()
const tl = (key: string, moduleName = 'Plugins') => {
  return t(`${moduleName}.${key}`)
}
const { dotClass, statusText, statusTextClass } = usePluginStatus(tl)
const VALUE_FOR_NOT_FILTER = 'all'
const statusOptions = [
  {
    label: tl('all', 'Base'),
    value: VALUE_FOR_NOT_FILTER,
  },
  {
    label: tl('active'),
    value: PluginStatus.Running,
  },
  {
    label: tl('inactive'),
    value: PluginStatus.Stopped,
  },
]
const filterStatus = ref(VALUE_FOR_NOT_FILTER)
const keyForSearch = ref('')

const isTableLoading = ref(false)

const {
  disablePlugin,
  enablePlugin,
  uninstall,
  getPluginAuthorString,
  getTheWorstStatus,
  pluginTotalStatus,
  movePluginToTop,
  movePluginToBottom,
  movePluginBeforeAnotherPlugin,
  movePluginAfterAnotherPlugin,
} = usePluginItem()
const { totalData, setTotalData, getAPageData } = usePaging()

const isTableFiltered = computed(
  () => !!(filterStatus.value !== VALUE_FOR_NOT_FILTER || keyForSearch.value),
)

/**
 * Filtered by the search
 */
const pluginsListAfterSearch: ComputedRef<Array<PluginItem>> = computed(() => {
  const filters: Array<FilterItem> = [{ key: 'name', value: keyForSearch.value }]
  const { data } = getAPageData({ page: 1, limit: totalData.value.length }, filters)
  return data
})

/**
 * Filtered by search and status selection
 */
const pluginListToShow = computed(() => {
  if (filterStatus.value === VALUE_FOR_NOT_FILTER) {
    return pluginsListAfterSearch.value
  }
  return pluginsListAfterSearch.value.filter(
    (item) => getTheWorstStatus(item) === filterStatus.value,
  )
})

const statusCounter = computed(() => {
  return {
    [VALUE_FOR_NOT_FILTER]: pluginsListAfterSearch.value.length,
    [PluginStatus.Running]: pluginsListAfterSearch.value.filter(
      (item) => getTheWorstStatus(item) === PluginStatus.Running,
    ).length,
    [PluginStatus.Stopped]: pluginsListAfterSearch.value.filter(
      (item) => getTheWorstStatus(item) === PluginStatus.Stopped,
    ).length,
  }
})

const goInstall = () => {
  router.push({ name: 'plugin-install' })
}

const emptyTotalData = () => {
  setTotalData([])
}

const queryListData = async () => {
  try {
    isTableLoading.value = true
    const data = await queryPlugins()
    setTotalData(data)
    await nextTick()
    initSortable()
  } catch (error) {
    console.error(error)
  } finally {
    isTableLoading.value = false
  }
}

const moveToTop = async (plugin: PluginItem) => {
  try {
    await movePluginToTop(plugin)
  } catch (error) {
    console.error(error)
  } finally {
    queryListData()
  }
}

const moveToBottom = async (plugin: PluginItem) => {
  try {
    await movePluginToBottom(plugin)
  } catch (error) {
    console.error(error)
  } finally {
    queryListData()
  }
}

const { handleDragEvent } = useMove(
  {
    moveToBottom: movePluginToBottom,
    moveToTop: movePluginToTop,
    moveBeforeAnotherTarget: movePluginBeforeAnotherPlugin,
    moveAfterAnotherTarget: movePluginAfterAnotherPlugin,
  },
  emptyTotalData,
  queryListData,
)

const handleOrderChanged = async (evt: SortableEvent) => {
  const { newIndex, oldIndex } = evt
  if (newIndex === undefined || oldIndex === undefined) {
    return
  }
  handleDragEvent(newIndex, oldIndex, pluginListToShow.value, isTableFiltered.value)
}
const { tableCom, initSortable } = useSortableTable(handleOrderChanged)

const detailLink = ({ name, rel_vsn }: PluginItem) => ({
  name: 'plugin-detail',
  params: {
    pluginName: name,
    pluginVersion: rel_vsn,
  },
})

const handleEnable = async (plugin: PluginItem) => {
  try {
    await enablePlugin(plugin)
    queryListData()
  } catch (error) {
    console.error(error)
  }
}

const handleDisable = async (plugin: PluginItem) => {
  try {
    await disablePlugin(plugin)
    queryListData()
  } catch (error) {
    console.error(error)
  }
}

const handleUninstall = async (plugin: PluginItem) => {
  try {
    await uninstall(plugin)
    queryListData()
  } catch (error) {
    console.error(error)
  }
}

queryListData()
</script>

<style lang="scss">
.plugins {
  .filters {
    .el-input,
    .el-radio-group {
      vertical-align: top;
    }
    .el-input {
      width: 300px;
      margin-right: 24px;
    }
    .el-radio-group {
      display: inline-block;
    }
  }
  .node-status-item {
    display: flex;
    justify-content: space-between;
  }
  .icon-plugin {
    display: inline-block;
    vertical-align: top;
    width: 32px;
    height: 32px;
    margin-right: 10px;
    background-color: #f4f6fb;
  }
  .plugin-info-hd {
    position: relative;
    top: -4px;
    display: inline-block;
    vertical-align: top;

    a {
      display: block;
      line-height: 18px;
    }
    span {
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
