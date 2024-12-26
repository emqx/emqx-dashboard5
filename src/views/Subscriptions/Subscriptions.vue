<template>
  <ListCard class="subscriptions">
    <el-form class="search-wrapper without-padding-top" @keyup.enter="handleSearch">
      <el-row :gutter="16">
        <el-col v-bind="colProps">
          <el-select
            v-model="fuzzyParams.node"
            :placeholder="$t('Clients.node')"
            clearable
            @clear="handleSearch"
          >
            <el-option v-for="item in currentNodes" :value="item.node" :key="item.node" />
          </el-select>
        </el-col>
        <el-col v-bind="colProps">
          <el-input
            v-model="fuzzyParams.clientid"
            :placeholder="$t('Clients.clientId')"
            clearable
            @clear="handleSearch"
          />
        </el-col>
        <el-col v-bind="colProps" class="form-item-col">
          <el-input
            v-model="fuzzyParams.match_topic"
            type="text"
            clearable
            :placeholder="$t('Clients.topic')"
            class="topic-input"
            @clear="handleSearch"
          >
            <template #suffix>
              <InfoTooltip>
                <template #content>
                  <p>{{ $t('Clients.wildcardSupported') }}</p>
                  <p>{{ $t('Clients.topicFilterDesc') }}</p>
                </template>
              </InfoTooltip>
            </template>
          </el-input>
        </el-col>
        <template v-if="showMoreQuery">
          <el-col v-bind="colProps">
            <el-select v-model="fuzzyParams.qos" clearable placeholder="QoS" @clear="handleSearch">
              <el-option :value="0" />
              <el-option :value="1" />
              <el-option :value="2" />
            </el-select>
          </el-col>
          <el-col v-bind="colProps">
            <el-input
              v-model="fuzzyParams.share_group"
              type="text"
              :placeholder="$t('Subs.share')"
              clearable
              @clear="handleSearch"
            />
          </el-col>
          <el-col class="hidden-md-and-down" :span="12" />
        </template>
        <el-col class="col-oper" v-bind="colProps">
          <SearchButton @click="handleSearch" />
          <ResetButton @click="handleReset" />
          <el-tooltip
            :content="!showMoreQuery ? $t('Base.showMore') : $t('Base.lessMore')"
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
    <div>
      <div class="section-header">
        <div></div>
        <RefreshButton @click="loadTableData" />
      </div>
      <el-table :data="tableData" v-loading.lock="lockTable">
        <el-table-column prop="clientid" :label="$t('Clients.clientId')">
          <template #default="{ row }">
            <CommonOverflowTooltip :content="row.clientid" />
          </template>
        </el-table-column>
        <el-table-column prop="topic" :label="$t('Subs.topic')">
          <template #default="{ row }">
            <CommonOverflowTooltip :content="row.topic" />
          </template>
        </el-table-column>
        <el-table-column prop="qos" label="QoS" />
        <el-table-column prop="nl" :label="$t('Clients.noLocal')">
          <template #default="{ row }">
            {{ getLabelFromValueInOptionList(row.nl, noLocalOpts) }}
          </template>
        </el-table-column>
        <el-table-column prop="rap" :label="$t('Clients.retainAsPublished')">
          <template #default="{ row }">
            {{ getLabelFromValueInOptionList(row.rap, retainAsPublishedOpts) }}
          </template>
        </el-table-column>
        <el-table-column prop="rh" :label="$t('Clients.retainHandling')" />
      </el-table>
      <div class="emq-table-footer">
        <common-pagination v-model:metaData="pageMeta" @loadPage="loadTableData" />
      </div>
    </div>
  </ListCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Subscriptions',
})
</script>

<script lang="ts" setup>
import { listSubscriptions } from '@/api/common'
import { SEARCH_FORM_RES_PROPS as colProps } from '@/common/constants'
import { getLabelFromValueInOptionList } from '@/common/tools'
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useMQTTVersion5NewConfig from '@/hooks/useMQTTVersion5NewConfig'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import useClusterNodes from '@/hooks/useClusterNodes'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import CommonPagination from '../../components/commonPagination.vue'
import 'element-plus/theme-chalk/display.css'

const showMoreQuery = ref(false)
const tableData = ref([])
const params = ref({})
const lockTable = ref(true)
const { nodes: currentNodes } = useClusterNodes()
const fuzzyParams = ref({
  node: '',
  match_topic: '',
  clientid: '',
  share_group: '',
  qos: '',
})
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()
const { noLocalOpts, retainAsPublishedOpts } = useMQTTVersion5NewConfig()
const handleSearch = () => {
  params.value = genQueryParams(fuzzyParams.value)
  loadTableData({ page: 1 })
}
const handleReset = () => {
  fuzzyParams.value = {
    node: '',
    match_topic: '',
    clientid: '',
    share_group: '',
    qos: '',
  }
  handleSearch()
}
const genQueryParams = (params: Record<string, any>) => {
  const { clientid, qos, share_group, node, match_topic } = params
  let newParams: Record<string, any> = {
    clientid: clientid === '' ? undefined : clientid ?? undefined,
    qos: qos === '' ? undefined : qos,
    share_group: share_group || undefined,
    node: node || undefined,
    match_topic: match_topic || undefined,
  }

  return newParams
}

const loadTableData = async (_params = {}) => {
  lockTable.value = true
  const sendParams = { ...pageParams.value, ...params.value, ..._params }
  try {
    const { data = [], meta = {} } = await listSubscriptions(sendParams)
    tableData.value = data
    setPageMeta(meta)
  } catch (error) {
    tableData.value = []
    initPageMeta()
  } finally {
    lockTable.value = false
  }
}

loadTableData()
</script>

<style lang="scss">
@import '~@/style/management.scss';
.subscriptions {
  .search-wrapper {
    margin-top: -12px;
  }
}
.info-tooltip {
  p {
    margin: 0;
  }
}
.topic-input {
  .icon-question {
    width: 12px;
    height: 12px;
    border-radius: 8px;
    line-height: 1;
    transform: scale(1);
  }
}
</style>
