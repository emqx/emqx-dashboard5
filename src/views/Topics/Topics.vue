<template>
  <div class="app-wrapper topics">
    <el-form @keyup.enter="handleSearch">
      <el-row class="search-wrapper">
        <el-col :span="8">
          <el-input
            v-model="searchValue"
            size="small"
            :placeholder="$t('Topics.topic')"
          ></el-input>
        </el-col>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleSearch"
        >
          {{ $t("Clients.search") }}
        </el-button>
      </el-row>
    </el-form>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column
        prop="topic"
        :label="$t('Topics.topic')"
        sortable
      ></el-table-column>
      <el-table-column
        prop="node"
        :label="$t('Clients.node')"
        sortable
      ></el-table-column>
    </el-table>

    <div class="emq-table-footer">
      <common-pagination
        v-model:metaData="pageMeta"
        @loadPage="loadTopics"
      ></common-pagination>
    </div>
  </div>
</template>

<script>
import { listTopics } from "@/api/common";
import CommonPagination from "../../components/commonPagination.vue";

export default {
  name: "Topics",
  components: {
    CommonPagination,
  },
  data() {
    return {
      tableData: [],
      searchValue: "",
      lockTable: true,
      params: {},
      pageMeta: {},
    };
  },
  mounted: function () {
    // this.$refs.p.$emit("loadPage");
    this.loadTopics();
  },
  methods: {
    async handleSearch() {
      const topic = this.searchValue.trim();
      this.params.topic = topic;
      this.loadTopics({ page: 1 });
      // this.$refs.p.$emit("loadPage", 1);
    },

    async loadTopics(params = {}) {
      this.lockTable = true;
      const sendParams = { ...this.params, ...this.pageMeta, ...params };
      Reflect.deleteProperty(sendParams, "count");
      const res = await listTopics(sendParams).catch(() => {});
      if (res) {
        const { data = [], meta = {} } = res;
        this.tableData = data;
        this.lockTable = false;

        this.pageMeta = meta;
      } else {
        this.tableData = [];
        this.lockTable = false;
        this.pageMeta = {};
      }
    },
  },
};
</script>
