<template>
  <div class="app-wrapper subscriptions">
    <el-form @keyup.enter="handleSearch">
      <el-row class="search-wrapper" :gutter="20">
        <el-col :span="6">
          <el-select
            v-model="fuzzyParams.node"
            :placeholder="$t('Clients.node')"
            clearable
            @clear="handleSearch"
          >
            <el-option v-for="item in currentNodes" :value="item.node" :key="item.node" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="fuzzyParams.clientid"
            :placeholder="$t('Clients.clientId')"
            clearable
            @clear="handleSearch"
          />
        </el-col>
        <el-col :span="6" class="form-item-col">
          <el-input
            v-model="fuzzyParams.match_topic"
            type="text"
            clearable
            placeholder="Topic"
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
          <el-col :span="6">
            <el-select v-model="fuzzyParams.qos" clearable placeholder="QoS" @clear="handleSearch">
              <el-option :value="0" />
              <el-option :value="1" />
              <el-option :value="2" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="fuzzyParams.share_group"
              type="text"
              :placeholder="$t('Subs.share')"
              clearable
              @clear="handleSearch"
            />
          </el-col>
        </template>
        <el-col class="col-oper" :span="6">
          <el-button type="primary" plain :icon="Search" @click="handleSearch">
            {{ $t('Base.search') }}
          </el-button>
          <el-button type="primary" :icon="RefreshRight" @click="loadTableData">
            {{ $t('Base.refresh') }}
          </el-button>
          <el-icon class="show-more" @click="showMoreQuery = !showMoreQuery">
            <ArrowUp v-if="showMoreQuery" />
            <ArrowDown v-else />
          </el-icon>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="clientid" :label="$t('Clients.clientId')" show-overflow-tooltip>
        <template #default="{ row }">
          <p class="table-data-without-break keep-spaces">{{ row.clientid }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="topic" :label="$t('Subs.topic')" show-overflow-tooltip>
        <template #default="{ row }">
          <p class="table-data-without-break keep-spaces">{{ row.topic }}</p>
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Subscriptions',
})
</script>

<script lang="ts" setup>
import { listSubscriptions, loadNodes } from '@/api/common'
import CommonPagination from '../../components/commonPagination.vue'
import { Search, ArrowDown, ArrowUp, RefreshRight } from '@element-plus/icons-vue'
import { NodeMsg } from '@/types/dashboard'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { getLabelFromValueInOptionList } from '@/common/tools'
import useMQTTVersion5NewConfig from '@/hooks/useMQTTVersion5NewConfig'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'

const showMoreQuery = ref(false)
const tableData = ref([])
const params = ref({})
const lockTable = ref(true)
const currentNodes = ref<NodeMsg[]>([])
const fuzzyParams = ref({
  node: '',
  match_topic: '',
  clientid: '',
  share_group: '',
  qos: '',
})
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()
const { noLocalOpts, retainAsPublishedOpts } = useMQTTVersion5NewConfig()
const handleSearch = async () => {
  params.value = genQueryParams(fuzzyParams.value)
  loadTableData({ page: 1 })
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
const loadNode = async () => {
  const res = await loadNodes()
  if (res) currentNodes.value = res
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

loadNode()
loadTableData()
</script>

<style lang="scss">
@import '~@/style/management.scss';
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
