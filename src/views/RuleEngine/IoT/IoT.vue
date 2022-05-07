<template>
  <div class="app-wrapper iot">
    <div class="section-header">
      <div></div>
      <div>
        <el-button type="primary" :icon="Plus" @click="$router.push({ name: 'iot-create' })">
          {{ tl('createIoTRule') }}
        </el-button>
      </div>
    </div>
    <el-table :data="ruleTable" v-loading="iotLoading">
      <el-table-column :label="tl('name')" :min-width="92">
        <template #default="{ row }">
          <router-link :to="{ name: 'iot-detail', params: { id: row.id } }">
            {{ row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="tl('source')" :min-width="92">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top-start" popper-class="code-popper">
            <template #content>
              <CodeView lang="sql" :code="row.sql" />
            </template>
            <div>
              <span class="input-item" v-for="item in row.from" :key="item">{{ item }}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="tl('sqlMatched')" :min-width="118">
        <template #default="{ row }">
          {{ row.metrics?.['sql.matched'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('sqlFailed')" :min-width="98">
        <template #default="{ row }">
          {{ row.metrics?.['sql.failed.exception'] }}
        </template>
      </el-table-column>
      <el-table-column :label="`${tl('executionSpeed')}(msg/s)`" :min-width="120">
        <template #default="{ row }">
          {{ row.metrics?.['sql.matched.rate'] }}
        </template>
      </el-table-column>
      <el-table-column prop="enable" :label="$t('Base.isEnabled')" :min-width="92">
        <template #default="{ row }">
          <el-switch v-model="row.enable" @change="startOrStopRule(row)" />
        </template>
      </el-table-column>
      <el-table-column :label="tl('createdAt')" sortable :min-width="124">
        <template #default="{ row }">
          {{ row.created_at && moment(row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" :min-width="172">
        <template #default="{ row }">
          <el-button
            size="small"
            @click="$router.push({ name: 'iot-detail', params: { id: row.id } })"
          >
            {{ $t('Base.setting') }}
          </el-button>
          <TableItemDropDown
            :row-data="row"
            @resetStatistics="resetRuleItemStatistics(row)"
            @copy="copyRuleItem(row)"
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
import { getRules, updateRules, deleteRules, resetRuleMetrics } from '@/api/ruleengine'
import moment from 'moment'
import { RuleItem } from '@/types/rule'
import { ElMessageBox as MB, ElMessage as M } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import TableItemDropDown from './components/TableItemDropDown.vue'
import CodeView from '@/components/CodeView.vue'
import useCopyRule from '@/hooks/Rule/rule/useCopyRule'

const { t } = useI18n()
const ruleTable: Ref<Array<RuleItem>> = ref([])
const iotLoading: Ref<boolean> = ref(false)
const { copyRule } = useCopyRule()

const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const getRulesList = async () => {
  iotLoading.value = true
  try {
    ruleTable.value = await getRules()
  } catch (error) {
    console.error(error)
  } finally {
    iotLoading.value = false
  }
}

const startOrStopRule = async (row: RuleItem) => {
  try {
    await updateRules(row.id, { enable: row.enable })
    M.success(t(row.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'))
  } catch (error) {
    console.error(error)
    row.enable = !row.enable
  }
}

const resetRuleItemStatistics = async ({ id }: RuleItem) => {
  await MB.confirm(t('RuleEngine.resetMetricsConfirm', { target: tl('rule') }))
  await resetRuleMetrics(id)
  M.success(tl('resetSuccessfully'))
  getRulesList()
}

const copyRuleItem = (rule: RuleItem) => {
  copyRule(rule)
}

const submitDeleteRules = async ({ id }: RuleItem) => {
  if (!id) return
  await MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
  iotLoading.value = true

  try {
    await deleteRules(id)
    M.success(t('Base.deleteSuccess'))
    iotLoading.value = false
    getRulesList()
  } catch (error) {
    console.error(error)
  }
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
.input-item {
  display: block;
  &:not(:last-child)::after {
    content: ',';
  }
}
</style>
<style lang="scss">
.code-popper.el-popper {
  padding: 0;
  .code-view {
    margin: 0;
    padding: 12px;
  }
}
</style>
