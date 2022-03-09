<template>
  <div class="app-wrapper iot">
    <div class="section-header">
      <div></div>
      <div>
        <el-button
          type="primary"
          :icon="Plus"
          size="small"
          @click="$router.push({ name: 'iot-create' })"
        >
          {{ tl('createIoTRule') }}
        </el-button>
      </div>
    </div>
    <el-table :data="ruleTable" v-loading="iotLoading">
      <el-table-column :label="tl('name')" sortable>
        <template #default="{ row }">
          <router-link :to="{ name: 'iot-detail', params: { id: row.id } }">
            {{ row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="tl('source')" sortable>
        <!-- TODO: highlight -->
        <template #default="{ row }">
          <el-tooltip effect="dark" :content="row.sql" placement="top-start">
            <span>{{ row.from.join(',') }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="tl('sqlMatched')">
        <template #default="{ row }">
          {{ row.metrics?.['sql.matched'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('sqlFailed')">
        <template #default="{ row }">
          {{ row.metrics?.['sql.failed.exception'] }}
        </template>
      </el-table-column>
      <el-table-column :label="`${tl('executionSpeed')}(msg/s)`">
        <template #default="{ row }">
          {{ row.metrics?.['sql.matched.rate'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('status')" sortable>
        <template #default="{ row }">
          <RuleItemStatus :rule="row" />
        </template>
      </el-table-column>
      <el-table-column :label="tl('createdAt')" sortable>
        <template #default="{ row }">
          {{ row.created_at && moment(row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" min-width="100">
        <template #default="{ row }">
          <el-button
            size="mini"
            @click="$router.push({ name: 'iot-detail', params: { id: row.id } })"
          >
            {{ $t('Base.setting') }}
          </el-button>
          <el-button size="mini" @click="startOrStopRule(row)">
            {{ row.enable ? $t('Base.disable') : $t('Base.enable') }}
          </el-button>
          <TableItemDropDown
            :row-data="row"
            @resetStatistics="resetRuleItemStatistics"
            @copy="copyRuleItem"
            @delete="submitDeleteRules"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getRules, updateRules, deleteRules } from '@/api/ruleengine'
import moment from 'moment'
import { RuleItem } from '@/types/rule'
import { ElMessageBox as MB, ElMessage as M } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import TableItemDropDown from './components/TableItemDropDown.vue'
import RuleItemStatus from './components/RuleItemStatus.vue'

const { t } = useI18n()
const ruleTable: Ref<Array<RuleItem>> = ref([])
const iotLoading: Ref<boolean> = ref(false)

const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const getRulesList = async () => {
  iotLoading.value = true
  let res = await getRules().catch(() => {})
  if (res) {
    ruleTable.value = res
  }
  iotLoading.value = false
}

const startOrStopRule = async (row: RuleItem) => {
  iotLoading.value = true
  const res = await updateRules(row.id, {
    enable: !row.enable,
  }).catch(() => {})
  if (res) {
    M({
      type: 'success',
      message: row.enable ? t('Base.disabledSuccess') : t('Base.enableSuccess'),
    })
    getRulesList()
  }
  iotLoading.value = false
}

const resetRuleItemStatistics = () => {
  // TODO:
}

const copyRuleItem = () => {
  // TODO:
}

const submitDeleteRules = async ({ id }: RuleItem) => {
  if (!id) return
  MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
    .then(async () => {
      iotLoading.value = true

      const res = await deleteRules(id).catch(() => {})
      if (res) {
        M({
          type: 'success',
          message: t('Base.deleteSuccess'),
        })
        iotLoading.value = false

        getRulesList()
      }
    })
    .catch(() => {})
}

onMounted(() => {
  getRulesList()
})
</script>

<style lang="scss" scoped>
.el-button-group {
  .el-button {
    &.el-button--default {
      border-color: var(--el-button-border-color);
      min-width: 90px;

      &.active {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
        z-index: 1;
      }

      &:hover {
        color: unset;
      }
    }
  }
}
</style>
