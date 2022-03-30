<template>
  <div class="app-wrapper gateway">
    <el-table :data="tbData" v-loading="tbLoading">
      <el-table-column :label="tl('name')">
        <template #default="{ row }">
          <span :class="`g-${row.name} g-icon`"></span>
          <span class="g-title">{{ transGatewayName(row.name) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('status')" sortable width="120">
        <template #default="{ row }">
          <span :class="['status', { disabled: !isRunning(row.status) }]">{{
            isRunning(row.status) ? tl('running') : tl('stopped')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('listeners')" width="120" sortable>
        <template #default="{ row }">
          {{ (row.listeners && row.listeners.length) || 0 }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('connection')">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            effect="dark"
            :content="`${row.current_connections || 0}/${row.max_connections || 0}`"
          >
            <el-progress
              :stroke-width="16"
              :percentage="calcPercentage(row.current_connections, row.max_connections, false)"
              :format="() => {}"
            ></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="scope">
          <el-button
            size="small"
            :disabled="isUnload(scope.row.status)"
            @click="
              $router.push({
                name: 'gateway-detail-basic',
                params: { name: scope.row.name },
              })
            "
            >{{ tl('setting') }}</el-button
          >
          <el-button
            size="small"
            :disabled="isUnload(scope.row.status)"
            @click="
              $router.push({
                name: 'gateway-detail-auth',
                params: { name: scope.row.name },
              })
            "
            >{{ tl('auth') }}</el-button
          >
          <el-dropdown
            placement="bottom-start"
            @visible-change="dropdownVChange(scope.row)"
            @command="dropdownHandler"
          >
            <el-button size="small">
              {{ tl('more') }}
              <el-icon>
                <CaretBottom v-if="!scope.row[dropdownExclusiveKey]" />
                <CaretTop v-else />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu class="no-dropdown-arrow">
                <el-dropdown-item
                  :disabled="!isRunning(scope.row.status)"
                  :command="{
                    name: 'gateway-detail-clients',
                    params: { name: scope.row.name },
                  }"
                  >{{ tl('clients') }}</el-dropdown-item
                >
                <el-dropdown-item :command="{ name: 'gateway-enable', data: scope.row }">{{
                  isRunning(scope.row.status) ? tl('disable') : tl('enable')
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { getGatewayList, updateGateway } from '@/api/gateway'
import { calcPercentage, caseInsensitiveCompare } from '@/common/utils'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElMessage as M } from 'element-plus'
import { CaretBottom, CaretTop } from '@element-plus/icons-vue'
import useTransName from '@/hooks/useTransName'

export default defineComponent({
  name: 'Gateway',
  components: { CaretBottom, CaretTop },
  setup() {
    const { t } = useI18n()
    let tbData = ref<any[]>([])
    let tbLoading = ref(false)
    let dropdownExclusiveKey = '_drop'
    const enableStr = 'running'
    const disableStr = 'stopped'
    const unloadStr = 'unload'
    const router = useRouter()

    const { transGatewayName } = useTransName()

    const tl = function (key: string, collection = 'Gateway') {
      return t(collection + '.' + key)
    }

    const isRunning = (status: string) => {
      return caseInsensitiveCompare(status, enableStr)
    }

    const isUnload = (status: string) => {
      return caseInsensitiveCompare(status, unloadStr)
    }

    const loadGateway = async () => {
      tbLoading.value = true
      let res = await getGatewayList().catch(() => {})
      if (res) {
        let pendingData: any[] = []
        Array.prototype.forEach.call(res, (v) => {
          pendingData.push({ ...v, ...{ [dropdownExclusiveKey]: false } })
        })
        tbData.value = pendingData
      } else {
        tbData.value = []
      }
      tbLoading.value = false
    }

    const dropdownVChange = (row: any) => {
      return Object.assign(row, {
        [dropdownExclusiveKey]: !row[dropdownExclusiveKey],
      })
    }

    const dropdownHandler = function (command: { name: string; data: any } | undefined) {
      if (!command) return
      if (typeof command == 'object') {
        if (command.name.match(/gateway-detail-.*/i)) {
          router.push(command)
          return
        } else {
          switch (command.name) {
            case 'gateway-enable':
              gatewayStartStop(command.data)
              break
          }
        }
      }
    }

    const gatewayStartStop = async function (instance: any) {
      const { name } = instance
      if (isUnload(instance.status)) {
        router.push({ name: 'gateway-create', params: { name: name } })
      } else {
        tbLoading.value = true
        let body = { enable: !isRunning(instance.status) }
        let res = await updateGateway(name, body).catch(() => {})
        if (res) {
          M({
            type: 'success',
            message: isRunning(instance.status)
              ? t('Base.disabledSuccess')
              : t('Base.enableSuccess'),
          })
          instance.status = isRunning(instance.status) ? disableStr : enableStr
        }
        tbLoading.value = false
      }
    }

    onMounted(loadGateway)

    return {
      tl,
      tbLoading,
      tbData,
      calcPercentage,
      isRunning,
      isUnload,
      dropdownVChange,
      dropdownExclusiveKey,
      dropdownHandler,
      transGatewayName,
    }
  },
})
</script>

<style lang="scss">
.gateway {
  .el-table {
    .status {
      color: #00b299;
      &.disabled {
        color: #e34242;
      }
    }
  }
  .g-icon::before {
    width: 60px;
    height: 60px;
    content: '';
    display: inline-block;
    background-size: contain;
  }
  .g-title {
    vertical-align: 23px;
    padding: 0 5px;
  }
}
</style>
