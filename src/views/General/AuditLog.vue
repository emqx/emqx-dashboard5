<template>
  <div class="audit-log" v-loading.lock="isInitializing">
    <div v-if="!isAuditEnabled" class="no-log-tip">
      <img src="@/assets/img/log_disabled.png" alt="" width="375" />
      <p>{{ tl('auditLogDesc') }}</p>
      <el-button class="confirm-btn" type="primary" :loading="isEnabling" @click="enableModule">
        {{ t('Base.enable') }}
      </el-button>
    </div>
    <template v-else>
      <el-form class="search-wrapper" @keyup.enter="search">
        <el-row :gutter="20">
          <el-col v-bind="colProps">
            <div class="time-range">
              <el-date-picker
                v-model="filterParams.gte_created_at"
                type="datetime"
                :placeholder="t('LogTrace.startTime')"
              />
              <span class="separator">-</span>
              <el-date-picker
                v-model="filterParams.lte_created_at"
                type="datetime"
                :placeholder="t('LogTrace.endTime')"
              />
            </div>
          </el-col>
          <el-col v-bind="colProps">
            <el-select v-model="filterParams.from" :placeholder="tl('sourceType')" clearable>
              <el-option
                v-for="{ value, label } in sourceTypeOpt"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-col>
          <el-col v-bind="colProps">
            <el-input v-model="filterParams.source" :placeholder="tl('opSource')" />
          </el-col>
          <el-col v-bind="colProps">
            <el-input v-model="filterParams.source_ip" placeholder="IP" />
          </el-col>
          <el-col v-bind="colProps">
            <el-select
              v-model="filterParams.operation_id"
              filterable
              clearable
              allow-create
              :placeholder="tl('opName')"
            >
              <el-option
                v-for="{ value, label } in opNameList"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-col>
          <template class="more" v-if="showMoreQuery">
            <el-col v-bind="colProps">
              <el-select
                v-model="filterParams.operation_result"
                class="comparator"
                :placeholder="tl('operationResult')"
                clearable
              >
                <el-option
                  v-for="{ value, label } in requestResultOpt"
                  :key="value"
                  :label="label"
                  :value="value"
                />
              </el-select>
            </el-col>
          </template>
          <el-col
            v-bind="showMoreQuery ? { sm: 24, md: 24, lg: 12 } : { ...colProps, lg: 18 }"
            class="col-oper"
          >
            <el-button type="primary" plain :icon="Search" @click="search">
              {{ t('Base.search') }}
            </el-button>
            <el-button :icon="RefreshLeft" @click="resetFilter">
              {{ t('Base.reset') }}
            </el-button>
            <el-tooltip
              :content="!showMoreQuery ? t('Base.showMore') : $t('Base.lessMore')"
              placement="top"
            >
              <el-button
                class="icon-button"
                plain
                :icon="showMoreQuery ? ArrowUp : ArrowDown"
                @click="showMoreQuery = !showMoreQuery"
              >
              </el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form>
      <div class="app-wrapper" v-loading="isTableLoading">
        <div class="section-header">
          <div></div>
          <!-- TODO:router -->
          <el-button
            :icon="Setting"
            :disabled="!$hasPermission('put')"
            @click="$router.push({ name: 'log' })"
          >
            {{ t('Base.setting') }}
          </el-button>
        </div>
        <el-table :data="tableData">
          <el-table-column :label="tl('opTime')">
            <template #default="{ row }">
              {{ formatDate(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="operation_type" :label="tl('info')">
            <template #default="{ row }">
              <template
                v-if="row.from !== AuditLogFrom.cli && row.from !== AuditLogFrom.erlang_console"
              >
                {{ getLabelFromOpts(row.operation_type, opTypeList) || row.operation_type }}:
                {{ getLabelFromOpts(row.operation_id, opNameList) || row.operation_id }}
              </template>
              <template v-else>
                {{ Array.isArray(row.args) ? row.args.join(' ') : row.args }}
              </template>
              <template
                v-if="
                  row.http_request.bindings && Object.keys(row.http_request.bindings).length > 0
                "
              >
                <InfoTooltip popper-class="code-popper">
                  <template #content>
                    <CodeView
                      lang="json"
                      :code="stringifyObjSafely(row.http_request.bindings)"
                      :show-copy-btn="false"
                    />
                  </template>
                </InfoTooltip>
              </template>
            </template>
          </el-table-column>
          <el-table-column :label="tl('opSource')">
            <template #default="{ row }">
              {{ getLabelFromOpts(row.from, sourceTypeOpt) }}
              <br />
              {{ getSourceData(row) }}
            </template>
          </el-table-column>
          <el-table-column label="IP">
            <template #default="{ row }">
              {{ row.source_ip || '--' }}
            </template>
          </el-table-column>
          <el-table-column :label="tl('operationResult')">
            <template #default="{ row }">
              {{ getLabelFromOpts(row.operation_result, requestResultOpt) || '--' }}
            </template>
          </el-table-column>
        </el-table>
        <div class="emq-table-footer">
          <common-pagination v-model:metaData="pageMeta" @loadPage="getData"></common-pagination>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { getLogConfigs, updateLogConfigs } from '@/api/config'
import { queryAuditLogs } from '@/api/systemModule'
import { SEARCH_FORM_RES_PROPS as colProps } from '@/common/constants'
import {
  getLabelFromValueInOptionList as getLabelFromOpts,
  stringifyObjSafely,
} from '@/common/tools'
import CodeView from '@/components/CodeView.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import commonPagination from '@/components/commonPagination.vue'
import useI18nTl from '@/hooks/useI18nTl'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import {
  AuditLogFrom,
  AuditLogItem,
  AuditLogOperationResult,
  GetAuditParams,
} from '@/types/typeAlias'
import { ArrowDown, ArrowUp, RefreshLeft, Search, Setting } from '@element-plus/icons-vue'
import { pickBy } from 'lodash'
import moment from 'moment'
import { Ref, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import resourceDict from './resource_dict.json'

const { t, tl } = useI18nTl('General')
const { state } = useStore()

const isAuditEnabled = ref(false)
const isEnabling = ref(false)

const sourceTypeOpt = [
  { value: AuditLogFrom.dashboard, label: 'Dashboard' },
  { value: AuditLogFrom.rest_api, label: 'REST API' },
  { value: AuditLogFrom.cli, label: 'CLI' },
  { value: AuditLogFrom.erlang_console, label: tl('console') },
  { value: AuditLogFrom.event, label: tl('event') },
]
const requestResultOpt = [
  { value: AuditLogOperationResult.success, label: t('Exhook.success') },
  { value: AuditLogOperationResult.failure, label: t('Exhook.failure') },
]
const langKey = state.lang === 'zh' ? 'zh' : 'en'
const opTypeList = Object.entries(resourceDict.types).map(([key, value]) => ({
  value: key,
  label: value[langKey],
}))
const opNameList = Object.entries(resourceDict.names).map(([key, value]) => ({
  value: key,
  label: value[langKey],
}))

const filterParams: Partial<GetAuditParams> = reactive({
  gte_created_at: '',
  lte_created_at: '',
  from: undefined,
  source: '',
  source_ip: '',
  operation_id: '',

  operation_type: '',
  operation_result: undefined,
})
const showMoreQuery = ref(false)

const isInitializing = ref(false)
const isTableLoading = ref(false)
const tableData: Ref<Array<AuditLogItem>> = ref([])
const { pageMeta, pageParams, setPageMeta } = usePaginationWithHasNext()

const confirmAuditLogEnabled = async () => {
  try {
    const { audit } = await getLogConfigs()
    isAuditEnabled.value = !!audit?.enable
  } catch (error) {
    //
  }
}
const handleTimeStr = (time: string | number) => new Date(time).getTime()
const handleParams = (params: GetAuditParams) => {
  if (params.gte_created_at) {
    params.gte_created_at = handleTimeStr(params.gte_created_at)
  }
  if (params.lte_created_at) {
    params.lte_created_at = handleTimeStr(params.lte_created_at)
  }
  return params
}
const getData = async () => {
  const filters = pickBy(filterParams, Boolean)
  const params = handleParams({ ...pageParams.value, ...filters })
  try {
    // if is initializing, do not set isTableLoading
    isTableLoading.value = !isInitializing.value
    const { data, meta } = await queryAuditLogs(params)
    tableData.value = data
    setPageMeta(meta)
  } catch (error) {
    //
  } finally {
    isTableLoading.value = false
  }
}

const search = async () => {
  pageMeta.value.page = 1
  getData()
}
const resetFilter = async () => {
  Object.keys(filterParams).forEach((key) => {
    filterParams[key as keyof Partial<GetAuditParams>] = undefined
  })
  search()
}

const init = async () => {
  try {
    isInitializing.value = true
    await confirmAuditLogEnabled()
    if (isAuditEnabled.value) {
      await getData()
    }
  } catch (error) {
    //
  } finally {
    isInitializing.value = false
  }
}
const formatDate = (ipt: string) => moment(ipt).format('YYYY-MM-DD HH:mm:ss')

const typesUseNodeAsInfo: Array<string> = [
  AuditLogFrom.cli,
  AuditLogFrom.erlang_console,
  AuditLogFrom.event,
]
const getSourceData = (row: AuditLogItem) => {
  const { from, node, source } = row
  if (from && typesUseNodeAsInfo.includes(from)) {
    return `${t('Clients.node')}: ${node || ''}`
  }
  const label = from === AuditLogFrom.rest_api ? 'API Key' : tl('user')
  return `${label}: ${source}`
}

const enableModule = async () => {
  try {
    isEnabling.value = true
    await updateLogConfigs({ audit: { enable: true } } as any)
    init()
  } catch (error) {
    //
  } finally {
    isEnabling.value = false
  }
}

init()
</script>

<style lang="scss">
@import '~@/style/management.scss';
.audit-log {
  .no-log-tip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    padding-top: 160px;
    img {
      margin-bottom: 20px;
    }
    p {
      width: 360px;
      margin-bottom: 20px;
    }
    .confirm-btn {
      width: 100px;
    }
  }
  .search-wrapper {
    .time-range {
      display: flex;
      align-items: center;
      .separator {
        flex-grow: 0;
        padding: 0 4px;
      }
    }
  }
}
</style>
