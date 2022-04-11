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

          <el-icon class="show-more" @click="showMoreQuery = !showMoreQuery">
            <ArrowUp v-if="showMoreQuery" />
            <ArrowDown v-else />
          </el-icon>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="clientid" sortable :label="$t('Clients.clientId')"></el-table-column>
      <el-table-column prop="topic" :label="$t('Subs.topic')" sortable></el-table-column>
      <el-table-column prop="qos" label="QoS" sortable></el-table-column>
    </el-table>

    <div class="emq-table-footer">
      <!-- <custom-pagination
        v-if="count === -1 && tableData.length"
        :hasnext="hasnext"
        :page="params.page"
        @prevClick="handlePrevClick"
        @nextClick="handleNextClick"
      >
      </custom-pagination> -->
      <common-pagination
        v-model:metaData="pageMeta"
        @loadPage="loadNodeSubscriptions"
      ></common-pagination>
    </div>
  </div>
</template>

<script>
// import CustomPagination from '@/components/CustomPagination.vue'
import { listSubscriptions, loadNodes } from '@/api/common'
import CommonPagination from '../../components/commonPagination.vue'
import { Search, ArrowDown, ArrowUp } from '@element-plus/icons-vue'

export default {
  name: 'Subscriptions',

  components: {
    CommonPagination,
    ArrowDown,
    ArrowUp,
    // CustomPagination,
  },

  data() {
    return {
      pageMeta: {},
      showMoreQuery: false,
      tableData: [],
      // hasnext: false,
      params: {},
      lockTable: true,
      currentNodes: [],
      fuzzyParams: {
        match: 'match_topic',
        node: '',
        topic: '',
        clientid: '',
        share_group: '',
        qos: '',
      },
    }
  },

  setup() {
    return {
      Search,
    }
  },

  mounted() {
    this.loadData()
    this.loadNodeSubscriptions()
    // this.$refs.p.$emit("loadPage");
  },

  methods: {
    async handleSearch() {
      this.params = this.genQueryParams(this.fuzzyParams)
      this.loadNodeSubscriptions({ page: 1 })
      // this.$refs.p.$emit("loadPage", 1);
    },
    genQueryParams(params) {
      const { clientid, qos, share_group, node, topic, match } = params
      let newParams = {
        clientid: clientid === '' ? undefined : clientid ?? undefined,
        qos: qos === '' ? undefined : qos,
        share_group: share_group || undefined,
        node: node || undefined,
      }
      if (topic) {
        newParams[match] = topic
      }

      return newParams
    },

    // handlePrevClick() {
    //   if (this.params.page === 1) {
    //     return
    //   }
    //   this.params.page -= 1
    //   const params = this.genQueryParams(this.fuzzyParams)
    //   this.loadNodeSubscriptions(false, params)
    // },
    // handleNextClick() {
    //   if (!this.hasnext) {
    //     return
    //   }
    //   this.params.page += 1
    //   const params = this.genQueryParams(this.fuzzyParams)
    //   this.loadNodeSubscriptions(false, params)
    // },
    async loadData() {
      const res = await loadNodes().catch(() => {})
      if (res) this.currentNodes = res
    },
    async loadNodeSubscriptions(params = {}) {
      this.lockTable = true
      const sendParams = {
        ...this.params,
        ...this.pageMeta,
        ...params,
      }
      Reflect.deleteProperty(sendParams, 'count')
      const res = await listSubscriptions(sendParams).catch(() => {})

      if (res) {
        const { data = [], meta = {} } = res
        this.tableData = data
        this.lockTable = false
        this.pageMeta = meta
        // this.hasnext = meta.hasnext || this.hasnext
      } else {
        this.tableData = []
        this.lockTable = false
        this.pageMeta = {}
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/style/management.scss';
</style>
