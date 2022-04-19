<template>
  <div class="app-wrapper subscriptions">
    <el-form @keyup.enter="handleSearch">
      <el-row class="search-wrapper" :gutter="20">
        <el-col :span="6">
          <el-select v-model="fuzzyParams.node" :placeholder="$t('Clients.node')" clearable>
            <el-option v-for="item in currentNodes" :value="item.node" :key="item.node"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="fuzzyParams.clientid"
            :placeholder="$t('Clients.clientId')"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="6" class="form-item-col">
          <el-row class="form-item-row">
            <el-col :span="8">
              <el-select v-model="fuzzyParams.match" class="match">
                <el-option label="filter" value="match_topic"></el-option>
                <el-option label="topic" value="topic"></el-option>
              </el-select>
            </el-col>
            <el-col :span="16">
              <el-input v-model="fuzzyParams.topic" type="text" clearable> </el-input>
            </el-col>
          </el-row>
        </el-col>

        <template v-if="showMoreQuery">
          <el-col :span="6">
            <el-select v-model="fuzzyParams.qos" clearable placeholder="QoS">
              <el-option :value="0"></el-option>
              <el-option :value="1"></el-option>
              <el-option :value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="fuzzyParams.share_group"
              type="text"
              :placeholder="$t('Subs.share')"
              clearable
            >
            </el-input>
          </el-col>
        </template>
        <el-col class="col-oper" :span="6">
          <el-button type="primary" :icon="Search" @click="handleSearch">
            {{ $t('Clients.search') }}
          </el-button>
          <el-button type="primary" plain :icon="RefreshRight" @click="handleResetSerach">
            {{ $t('Clients.reset') }}
          </el-button>
          <el-icon class="show-more" @click="showMoreQuery = !showMoreQuery">
            <ArrowUp v-if="showMoreQuery" />
            <ArrowDown v-else />
          </el-icon>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="clientid" :label="$t('Clients.clientId')"></el-table-column>
      <el-table-column prop="topic" :label="$t('Subs.topic')"></el-table-column>
      <el-table-column prop="qos" label="QoS"></el-table-column>
    </el-table>

    <div class="emq-table-footer">
      <common-pagination
        v-model:metaData="pageMeta"
        @loadPage="loadNodeSubscriptions"
      ></common-pagination>
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

const pageMeta = ref({})
const showMoreQuery = ref(false)
const tableData = ref([])
const params = ref({})
const lockTable = ref(true)
const currentNodes = ref<NodeMsg[]>([])
const fuzzyParams = ref({
  match: 'match_topic',
  node: '',
  topic: '',
  clientid: '',
  share_group: '',
  qos: '',
})
const handleSearch = async () => {
  params.value = genQueryParams(fuzzyParams.value)
  loadNodeSubscriptions({ page: 1 })
}
const handleResetSerach = async () => {
  fuzzyParams.value = {
    match: 'match_topic',
    node: '',
    topic: '',
    clientid: '',
    share_group: '',
    qos: '',
  }
  params.value = genQueryParams(fuzzyParams.value)
  loadNodeSubscriptions({ page: 1 })
}

const genQueryParams = (params: Record<string, any>) => {
  const { clientid, qos, share_group, node, topic, match } = params
  let newParams: Record<string, any> = {
    clientid: clientid === '' ? undefined : clientid ?? undefined,
    qos: qos === '' ? undefined : qos,
    share_group: share_group || undefined,
    node: node || undefined,
  }
  if (topic) {
    newParams[match] = topic
  }

  return newParams
}
const loadData = async () => {
  const res = await loadNodes()
  if (res) currentNodes.value = res
}
const loadNodeSubscriptions = async (_params = {}) => {
  lockTable.value = true
  const sendParams = {
    ..._params,
    ...pageMeta,
    ...params.value,
  }
  Reflect.deleteProperty(sendParams, 'count')
  const res = await listSubscriptions(sendParams).catch(() => {
    lockTable.value = false
  })
  if (res) {
    const { data = [], meta = {} } = res
    tableData.value = data
    lockTable.value = false
    pageMeta.value = meta
  } else {
    tableData.value = []
    lockTable.value = false
    pageMeta.value = {}
  }
}
loadData()
loadNodeSubscriptions()
</script>

<style lang="scss">
@import '~@/style/management.scss';
</style>
