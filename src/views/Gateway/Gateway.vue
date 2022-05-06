<template>
  <div class="app-wrapper gateway">
    <el-table :data="tbData" v-loading="tbLoading">
      <el-table-column :label="tl('name')" :min-width="180">
        <template #default="{ row }">
          <span :class="`g-${row.name} g-icon`"></span>
          <span class="g-title">{{ transGatewayName(row.name) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('status')" width="120" :min-width="128">
        <template #default="{ row }">
          <span :class="['status', { disabled: !isRunning(row.status) }]">{{
            isRunning(row.status) ? tl('running') : tl('stopped')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('listeners')"
        sortable
        :min-width="132"
        :sort-by="(row) => row.listeners?.length || 0"
      >
        <template #default="{ row }">
          {{ row.listeners?.length || 0 }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('connection')" :min-width="140">
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
      <el-table-column :label="$t('Base.operation')" :min-width="336">
        <template #default="{ row }">
          <el-button size="small" :disabled="isUnload(row.status)" @click="goSettingPage(row)">
            {{ tl('setting') }}
          </el-button>
          <el-button size="small" :disabled="isUnload(row.status)" @click="goGatewayAuthPage(row)">
            {{ tl('auth') }}
          </el-button>
          <el-button size="small" :disabled="!isRunning(row.status)" @click="goClientPage(row)">
            {{ tl('clients') }}
          </el-button>
          <el-button size="small" @click="gatewayStartStop(row)">
            {{ isRunning(row.status) ? tl('disable') : tl('enable') }}
          </el-button>
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
import useTransName from '@/hooks/useTransName'

export default defineComponent({
  name: 'Gateway',
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

    const goSettingPage = ({ name }: { name: string }) => {
      router.push({ name: 'gateway-detail-basic', params: { name } })
    }

    const goGatewayAuthPage = ({ name }: { name: string }) => {
      router.push({ name: 'gateway-detail-auth', params: { name } })
    }

    const goClientPage = ({ name }: { name: string }) => {
      router.push({ name: 'gateway-detail-clients', params: { name } })
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
      transGatewayName,
      goSettingPage,
      goGatewayAuthPage,
      goClientPage,
      gatewayStartStop,
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
