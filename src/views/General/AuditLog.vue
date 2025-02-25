<template>
  <div class="audit-log" :class="{ 'is-loading': isInitializing }" v-loading.lock="isInitializing">
    <div v-if="!isInitializing && !isAuditEnabled" class="no-log-tip">
      <img src="@/assets/img/log_disabled.png" alt="" width="375" />
      <p>{{ tl('auditLogDesc') }}</p>
      <el-button
        class="confirm-btn"
        type="primary"
        :loading="isEnabling"
        :disabled="!$hasPermission('put')"
        @click="enableModule"
      >
        {{ t('Base.enable') }}
      </el-button>
    </div>
    <template v-else-if="!isInitializing && isAuditEnabled">
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
          <el-col v-if="notSupportHTTPFilter" v-bind="{ ...colProps, lg: 12 }" class="col-oper">
            <SearchButton @click="search" />
            <ResetButton @click="resetFilter" />
          </el-col>
        </el-row>
        <div class="http-filter" v-if="!notSupportHTTPFilter">
          <p class="tip http-filter-desc">{{ tl('httpFilterParamsDesc') }}</p>
          <el-row :gutter="20">
            <el-col v-bind="colProps">
              <el-input v-model="filterParams.source" :placeholder="tl('opSource')" />
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
            <el-col v-bind="colProps">
              <el-input v-model="filterParams.source_ip" placeholder="IP" />
            </el-col>
            <template v-if="showMoreQuery">
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
            <el-col v-bind="showMoreQuery ? { sm: 24, md: 24, lg: 24 } : colProps" class="col-oper">
              <SearchButton @click="search" />
              <ResetButton @click="resetFilter" />
              <ShowMoreButton v-model="showMoreQuery" />
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div class="app-wrapper" v-loading="isTableLoading">
        <div class="section-header">
          <div></div>
          <!-- TODO:router -->
          <el-button
            :icon="Setting"
            :disabled="!$hasPermission('put')"
            @click="$router.push({ name: 'log', query: { tab: 'audit' } })"
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
                {{ getLogInfo(row) }}
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
              {{ getSourceType(row.from) }}
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
import { Setting } from '@element-plus/icons-vue'

import dayjs from 'dayjs'

import resourceDictArr from './resource_dict.json'

interface LabelItem {
  en: string
  zh: string
}

interface DictItem {
  label: LabelItem
  typeLabel: LabelItem
}

const METHOD_PATH_CONNECTOR = ':'

const { t, tl } = useI18nTl('General')
const { state } = useStore()

const isAuditEnabled = ref(false)
const isEnabling = ref(false)

const sourceTypeOpt = [
  { value: AuditLogFrom.dashboard, label: 'Dashboard' },
  { value: AuditLogFrom.rest_api, label: 'REST API' },
  { value: AuditLogFrom.cli, label: 'CLI' },
  { value: AuditLogFrom.erlang_console, label: tl('console') },
]
const requestResultOpt = [
  { value: AuditLogOperationResult.success, label: t('Base.success') },
  { value: AuditLogOperationResult.failure, label: t('Base.failed') },
]

const gatewayPathReg = /\/gateway/
const addBlockToLabel = (nameLabel: LabelItem, typeLabel: LabelItem): LabelItem => {
  return (Object.keys(nameLabel) as Array<keyof LabelItem>).reduce((result: LabelItem, key) => {
    result[key] = `(${typeLabel[key]})${nameLabel[key]}`
    return result
  }, {} as LabelItem)
}
const resourceDict = resourceDictArr.reduce((obj: Record<string, DictItem>, dictItem) => {
  const { method, path, operation_name_label, operation_label: typeLabel } = dictItem
  const label = gatewayPathReg.test(path)
    ? addBlockToLabel(operation_name_label, typeLabel)
    : operation_name_label
  obj[`${method}:${path}`] = { label, typeLabel }
  return obj
}, {})

const langKey = state.lang === 'zh' ? 'zh' : 'en'
const opNameList = Object.entries(resourceDict).map(([key, { label }]) => ({
  value: key,
  label: label[langKey],
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

const notHTTPType: Array<string> = [AuditLogFrom.cli, AuditLogFrom.erlang_console]
const notSupportHTTPFilter = computed(() => {
  return filterParams.from && notHTTPType.includes(filterParams.from)
})

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
const splitter = new RegExp(`${METHOD_PATH_CONNECTOR}(.*)`)
const getIdAndMethodFromOperationId = (operationId: string) => {
  const [method, id]: Array<any> = operationId.split(splitter)
  return { method, id }
}
const handleParams = (params: GetAuditParams) => {
  if (params.gte_created_at) {
    params.gte_created_at = handleTimeStr(params.gte_created_at)
  }
  if (params.lte_created_at) {
    params.lte_created_at = handleTimeStr(params.lte_created_at)
  }
  if (params.operation_id) {
    const { method, id } = getIdAndMethodFromOperationId(params.operation_id)
    params.http_method = method
    params.operation_id = id
  }
  return params
}
const checkParams = (params: GetAuditParams): Promise<boolean> => {
  const { gte_created_at, lte_created_at } = params
  if (gte_created_at && lte_created_at && gte_created_at > lte_created_at) {
    ElMessage.warning(tl('timeRangeError'))
    return Promise.reject(false)
  }
  return Promise.resolve(true)
}
const getData = async () => {
  const filters = pickBy(filterParams, Boolean)
  const params = handleParams({ ...pageParams.value, ...filters })
  try {
    await checkParams(params)
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
const formatDate = (ipt: string) => dayjs(ipt).format('YYYY-MM-DD HH:mm:ss')

const isFromSSO = (from: string) => ['oidc', 'saml'].includes(from)
const getSourceType = (value: string) => {
  if (isFromSSO(value)) {
    return toUpper(value)
  }
  if (value === 'unknown') {
    return t('RuleEngine.unknown')
  }
  return getLabelFromOpts(value, sourceTypeOpt)
}

const typesUseNodeAsInfo: Array<string> = [AuditLogFrom.cli, AuditLogFrom.erlang_console]
const getSourceData = (row: AuditLogItem) => {
  const { from, node, source } = row
  if (from && typesUseNodeAsInfo.includes(from)) {
    return `${t('Clients.node')}: ${node || ''}`
  }
  const label = from === AuditLogFrom.rest_api ? 'API Key' : tl('user')
  return `${label}: ${source}`
}

const getLogInfo = ({ operation_id, http_method, operation_type }: AuditLogItem) => {
  const key = `${http_method}${METHOD_PATH_CONNECTOR}${operation_id}`
  if (key in resourceDict) {
    const { label, typeLabel } = resourceDict[key as keyof typeof resourceDict]
    return `${typeLabel[langKey]}: ${label[langKey]}`
  }
  return `${operation_type}: ${operation_id}`
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
@import '@/style/management.scss';
.audit-log {
  &.is-loading {
    min-height: 320px;
  }
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
  .http-filter {
    margin-top: 16px;
    padding-top: 16px;
  }
  .http-filter-desc {
    opacity: 0.8;
  }
}
.code-popper.el-popper {
  padding: 0;
  .code-view {
    margin: 0;
  }
  .hljs {
    padding: 12px;
    border: none;
  }
}
</style>
