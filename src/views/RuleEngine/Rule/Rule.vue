<template>
  <div class="rule">
    <RuleFilterForm
      class="search-wrapper without-padding-top"
      :initial-value="filterParams"
      @search="searchRule"
    />
    <div class="app-wrapper">
      <div class="section-header">
        <div></div>
        <div>
          <el-button type="primary" :icon="Plus" @click="$router.push({ name: 'rule-create' })">
            {{ tl('create', 'Base') }}
          </el-button>
          <el-button type="primary" :icon="Refresh" @click="getRulesList">
            {{ $t('Base.refresh') }}
          </el-button>
        </div>
      </div>
      <el-table :data="ruleTable" v-loading="ruleLoading">
        <el-table-column label="ID" show-overflow-tooltip>
          <template #default="{ row }">
            <router-link
              :to="{ name: 'rule-detail', params: { id: row.id } }"
              class="table-data-without-break"
            >
              {{ row.id }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column :label="tl('source')">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top-start" popper-class="code-popper">
              <template #content>
                <CodeView lang="sql" :code="row.sql" :show-copy-btn="false" />
              </template>
              <div class="inputs-container">
                <el-tag class="input-item" type="info" v-for="item in row.from" :key="item">{{
                  item
                }}</el-tag>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="enable" :label="$t('Base.isEnabled')">
          <template #default="{ row }">
            <OperateWebhookAssociatedPopover
              :disabled="!judgeIsWebhookRule(row)"
              :name="row.id"
              :operation="`${t('Base.enable')}${tl('or')}${t('Base.disable')}`"
              :targetLabel="tl('rule')"
            >
              <el-switch
                v-model="row.enable"
                :disabled="judgeIsWebhookRule(row)"
                @change="startOrStopRule(row)"
              />
            </OperateWebhookAssociatedPopover>
          </template>
        </el-table-column>
        <el-table-column prop="description" :label="tl('note')"></el-table-column>
        <el-table-column :label="tl('actionsCount')">
          <template #default="{ row }">
            {{ row.actions?.length }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Base.operation')">
          <template #default="{ row }">
            <el-button
              size="small"
              @click="
                $router.push({
                  name: 'rule-detail',
                  params: { id: row.id },
                  query: { tab: 'settings' },
                })
              "
            >
              {{ $t('Base.setting') }}
            </el-button>
            <OperateWebhookAssociatedPopover
              :disabled="!judgeIsWebhookRule(row)"
              :name="row.id"
              :operation="tl('moreOperation')"
              :targetLabel="tl('rule')"
            >
              <TableItemDropDown
                :row-data="row"
                :disabled="judgeIsWebhookRule(row)"
                @copy="copyRuleItem(row)"
                @delete="deleteRule"
              />
            </OperateWebhookAssociatedPopover>
          </template>
        </el-table-column>
      </el-table>
      <div class="emq-table-footer">
        <commonPagination :meta-data="pageMeta" @load-page="getRulesList" />
      </div>
    </div>
  </div>
  <DeleteWebhookAssociatedTip
    v-model="showDeleteWebhookAssociatedTip"
    type="rule"
    :name="currentDelId"
  />
  <DeleteRuleConfirm v-model="showDeleteConfirm" :rule="currentRule" @submitted="handleDeleteSuc" />
</template>

<script lang="ts" setup>
import { getRules, updateRules } from '@/api/ruleengine'
import CodeView from '@/components/CodeView.vue'
import commonPagination from '@/components/commonPagination.vue'
import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import usePagination from '@/hooks/usePagination'
import usePaginationRemember from '@/hooks/usePaginationRemember'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import { FilterParamsForQueryRules, RuleItem } from '@/types/rule'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { ElMessage as M } from 'element-plus'
import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import DeleteWebhookAssociatedTip from '../components/DeleteWebhookAssociatedTip.vue'
import OperateWebhookAssociatedPopover from '../components/OperateWebhookAssociatedPopover.vue'
import TableItemDropDown from '../components/TableItemDropDown.vue'
import DeleteRuleConfirm from './components/DeleteRuleConfirm.vue'
import RuleFilterForm from './components/RuleFilterForm.vue'

const { t } = useI18n()
const router = useRouter()
const ruleTable: Ref<Array<RuleItem>> = ref([])
const ruleLoading: Ref<boolean> = ref(false)

const { resetPageNum } = usePagination()
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()
let filterParams: Ref<FilterParamsForQueryRules> = ref({})
const { updateParams, checkParamsInQuery } = usePaginationRemember('rule-detail')
const getParamsFormQuery = () => {
  const { pageParams, filterParams: f } = checkParamsInQuery()
  pageMeta.value = { ...pageMeta.value, ...pageParams }
  filterParams.value = f
}
getParamsFormQuery()

const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const getRulesList = async () => {
  ruleLoading.value = true
  try {
    const { data = [], meta } = await getRules({ ...pageParams.value, ...filterParams.value })
    ruleTable.value = data
    setPageMeta(meta)
    updateParams({ ...pageParams.value, ...filterParams.value })
  } catch (error) {
    ruleTable.value = []
    initPageMeta()
  } finally {
    ruleLoading.value = false
  }
}

const searchRule = (filterParamsData: FilterParamsForQueryRules) => {
  filterParams.value = filterParamsData
  pageMeta.value.page = 1
  getRulesList()
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

const copyRuleItem = (rule: RuleItem) => {
  router.push({ name: 'rule-create', query: { target: rule.id, action: 'copy' } })
}

const currentDelId = ref('')
const showDeleteWebhookAssociatedTip = ref(false)
const { judgeIsWebhookRule } = useWebhookUtils()

const showDeleteConfirm = ref(false)
const currentRule = ref<undefined | RuleItem>(undefined)
const deleteRule = async (rule: RuleItem) => {
  const { id } = rule || {}
  if (!id) {
    return
  }
  if (judgeIsWebhookRule(rule)) {
    currentDelId.value = id
    showDeleteWebhookAssociatedTip.value = true
    return
  }
  currentRule.value = rule
  showDeleteConfirm.value = true
}

const handleDeleteSuc = () => {
  pageMeta.value.page = resetPageNum(ruleTable.value, pageMeta.value.page)
  getRulesList()
}

onMounted(() => {
  getRulesList()
})
</script>

<style lang="scss" scoped>
.section-header {
  margin-top: 0;
}
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
.inputs-container {
  display: flex;
  flex-direction: column;
  width: fit-content;
}
.input-item {
  height: 26px;
  max-width: 150px;

  :deep(.el-tag__content) {
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
  }
  &:not(:first-child) {
    margin-top: 8px;
  }
}
</style>

<style lang="scss">
.code-popper.el-popper {
  padding: 0;
  .code-view {
    margin: 0;
  }
  .hljs {
    padding: 12px;
  }
}
</style>
