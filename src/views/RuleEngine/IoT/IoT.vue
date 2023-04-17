<template>
  <div class="iot">
    <RuleFilterForm class="search-wrapper" :initial-value="filterParams" @search="searchRule" />
    <div class="app-wrapper">
      <div class="section-header">
        <div></div>
        <div>
          <el-button type="primary" :icon="Plus" @click="$router.push({ name: 'iot-create' })">
            {{ tl('create', 'Base') }}
          </el-button>
          <el-button type="primary" :icon="Refresh" @click="getRulesList">
            {{ $t('Base.refresh') }}
          </el-button>
        </div>
      </div>
      <el-table :data="ruleTable" v-loading="iotLoading">
        <el-table-column label="ID" show-overflow-tooltip>
          <template #default="{ row }">
            <router-link
              :to="{ name: 'iot-detail', params: { id: row.id } }"
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
            <el-switch v-model="row.enable" @change="startOrStopRule(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="description" :label="tl('note')"></el-table-column>
        <el-table-column :label="tl('createdAt')">
          <template #default="{ row }">
            {{ row.created_at && moment(row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Base.operation')">
          <template #default="{ row }">
            <el-button
              size="small"
              @click="
                $router.push({
                  name: 'iot-detail',
                  params: { id: row.id },
                  query: { tab: 'settings' },
                })
              "
            >
              {{ $t('Base.setting') }}
            </el-button>
            <TableItemDropDown
              :row-data="row"
              @copy="copyRuleItem(row)"
              @delete="submitDeleteRules"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="emq-table-footer">
        <commonPagination :meta-data="pageMeta" @load-page="getRulesList" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { deleteRules, getRules, updateRules } from '@/api/ruleengine'
import CodeView from '@/components/CodeView.vue'
import commonPagination from '@/components/commonPagination.vue'
import usePagination from '@/hooks/usePagination'
import usePaginationQuery from '@/hooks/usePaginationQuery'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import { FilterParamsForQueryRules, RuleItem } from '@/types/rule'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { ElMessage as M, ElMessageBox as MB } from 'element-plus'
import moment from 'moment'
import { Ref, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import TableItemDropDown from '../components/TableItemDropDown.vue'
import RuleFilterForm from './components/RuleFilterForm.vue'

const { t } = useI18n()
const router = useRouter()
const ruleTable: Ref<Array<RuleItem>> = ref([])
const iotLoading: Ref<boolean> = ref(false)

const { resetPageNum } = usePagination()
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()
let filterParams: Ref<FilterParamsForQueryRules> = ref({})
const { setParamsToQuery, checkParamsInQuery } = usePaginationQuery()
const getParamsFormQuery = () => {
  const { pageParams, filterParams: f } = checkParamsInQuery()
  pageMeta.value = { ...pageMeta.value, ...pageParams }
  filterParams.value = f
}
getParamsFormQuery()

const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const getRulesList = async () => {
  iotLoading.value = true
  try {
    const { data = [], meta } = await getRules({ ...pageParams.value, ...filterParams.value })
    ruleTable.value = data
    setPageMeta(meta)
    setParamsToQuery({ ...pageParams.value, ...filterParams.value })
  } catch (error) {
    ruleTable.value = []
    initPageMeta()
  } finally {
    iotLoading.value = false
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
  router.push({ name: 'iot-create', query: { target: rule.id, action: 'copy' } })
}

const submitDeleteRules = async ({ id }: RuleItem) => {
  if (!id) return
  await MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    confirmButtonClass: 'confirm-danger',
    type: 'warning',
  })
  iotLoading.value = true

  try {
    await deleteRules(id)
    M.success(t('Base.deleteSuccess'))
    pageMeta.value.page = resetPageNum(ruleTable.value, pageMeta.value.page)
    getRulesList()
  } catch (error) {
    console.error(error)
  } finally {
    iotLoading.value = false
  }
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
