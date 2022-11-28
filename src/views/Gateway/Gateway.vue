<template>
  <div class="app-wrapper gateway">
    <el-table :data="tbData" v-loading="tbLoading" :row-class-name="getRowClassName">
      <el-table-column :label="tl('name')" :min-width="180">
        <template #default="{ row }">
          <span
            class="g-icon"
            :class="[`g-${row.name}`, row.name === 'stomp' ? 'img-black' : '']"
          ></span>
          <span class="g-title">{{ transGatewayName(row.name) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('connection')" :min-width="160">
        <template #default="{ row }">
          <el-tooltip
            v-if="hasBeenInitialized(row)"
            placement="top"
            effect="dark"
            :content="`${row.current_connections || 0}/${row.max_connections || 0}`"
          >
            <el-progress
              :stroke-width="16"
              :percentage="calcPercentage(row.current_connections, row.max_connections, false)"
              :text-inside="true"
              :format="() => ''"
            >
              <span>{{ row.current_connections || 0 }}</span>
            </el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="tl('listeners')" :min-width="132">
        <template #default="{ row }">
          <span v-if="hasBeenInitialized(row)">
            {{ row.listeners?.length || 0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="enable" :label="$t('Base.isEnabled')" :min-width="100">
        <template #default="{ row }">
          <el-switch
            v-if="hasBeenInitialized(row)"
            v-model="row.status"
            :active-value="GatewayStatus.Running"
            :inactive-value="GatewayStatus.Stopped"
            :before-change="handleSwitchStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" :min-width="276">
        <template #default="{ row }">
          <template v-if="hasBeenInitialized(row)">
            <el-button size="small" :disabled="isUnload(row.status)" @click="goSettingPage(row)">
              {{ t('Base.setting') }}
            </el-button>
            <el-button size="small" :disabled="!isRunning(row.status)" @click="goClientPage(row)">
              {{ tl('connections') }}
            </el-button>
          </template>
          <el-button v-else type="primary" size="small" @click="setupGateway(row)">
            {{ tl('setup') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { getGatewayList, toggleGatewayEnable } from '@/api/gateway'
import { calcPercentage, caseInsensitiveCompare } from '@/common/utils'
import useI18nTl from '@/hooks/useI18nTl'
import useTransName from '@/hooks/useTransName'
import { GatewayStatus } from '@/types/enum'
import { ElMessage as M, ElMessageBox } from 'element-plus'
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GatewayItem } from '@/types/gateway'

export default defineComponent({
  name: 'Gateway',
  setup() {
    let tbData = ref<GatewayItem[]>([])
    let tbLoading = ref(false)
    const enableStr = GatewayStatus.Running
    const disableStr = GatewayStatus.Stopped
    const unloadStr = GatewayStatus.Unloaded
    const router = useRouter()

    const { transGatewayName } = useTransName()

    const { tl, t } = useI18nTl('Gateway')

    const isRunning = (status: string) => caseInsensitiveCompare(status, enableStr)
    const isUnload = (status: string) => caseInsensitiveCompare(status, unloadStr)

    const loadGateway = async () => {
      tbLoading.value = true
      tbData.value = []
      try {
        let res: Array<GatewayItem> = await getGatewayList()
        tbData.value = res.sort((a, b) => a.status.localeCompare(b.status))
      } catch (error) {
        //
      } finally {
        tbLoading.value = false
      }
    }

    const hasBeenInitialized = (item: any) => !isUnload(item.status)

    const getRowClassName = ({ row }: any) => (!hasBeenInitialized(row) ? 'is-disabled' : '')

    const setupGateway = (listener: any) => {
      router.push({ name: 'gateway-create', params: { name: listener.name } })
    }

    const gatewayStartStop = async function (instance: any) {
      const { name } = instance
      try {
        if (isRunning(instance.status)) {
          await ElMessageBox.confirm(tl('disableGatewayTip'), {
            confirmButtonText: t('Base.confirm'),
            cancelButtonText: t('Base.cancel'),
            type: 'warning',
          })
        }
        tbLoading.value = true
        await toggleGatewayEnable(name, !isRunning(instance.status))
        instance.status = isRunning(instance.status) ? disableStr : enableStr
        M.success(isRunning(instance.status) ? t('Base.disabledSuccess') : t('Base.enableSuccess'))
      } catch (error) {
        //
      } finally {
        tbLoading.value = false
      }
    }

    const handleSwitchStatus = (gateway: any) => {
      return () => {
        gatewayStartStop(gateway)
      }
    }

    const goSettingPage = ({ name }: { name: string }) => {
      router.push({ name: 'gateway-detail-settings', params: { name } })
    }

    const goClientPage = ({ name }: { name: string }) => {
      router.push({ name: 'gateway-detail-connections', params: { name } })
    }

    onMounted(loadGateway)

    return {
      t,
      tl,
      tbLoading,
      tbData,
      calcPercentage,
      GatewayStatus,
      isRunning,
      isUnload,
      hasBeenInitialized,
      getRowClassName,
      transGatewayName,
      goSettingPage,
      goClientPage,
      setupGateway,
      handleSwitchStatus,
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
[data-theme='light'] {
  .gateway {
    .el-table__row.is-disabled {
      background-color: #fafdff;
    }
  }
}
[data-theme='dark'] {
  .gateway {
    .el-table__row.is-disabled {
      background-color: #191b24;
    }
  }
}
</style>
