<template>
  <div class="app-wrapper flow" v-loading="isDataLoading">
    <div class="pagination-wrap">
      <el-pagination
        hide-on-single-page
        layout="prev, next"
        :total="rulePageData.count"
        :page-size="RULE_MAX_NUM_PER_PAGE"
        @update:current-page="showOtherPageRuleData"
      />
    </div>
    <div class="topology-wrap">
      <div id="rule-topology" ref="topologyDiagramCanvasEle" v-if="!isNoData"></div>
      <p class="topology-placeholder" v-else>{{ t('Base.noData') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RULE_MAX_NUM_PER_PAGE } from '@/common/constants'
import useTopology from '@/hooks/Rule/topology/useTopology'
import { useI18n } from 'vue-i18n'

const { isDataLoading, topologyDiagramCanvasEle, isNoData, rulePageData, showOtherPageRuleData } =
  useTopology()

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.flow {
  margin-bottom: 0px;
}
.topology-wrap {
  border: 1px solid var(--color-border-normal);
  background-color: var(--color-bg-split);
}

:deep(.topology-node-tooltip) {
  width: 260px;
  padding: 16px 12px;

  ul {
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
    list-style: none;
  }
  li {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    label {
      flex-shrink: 0;
      padding-right: 16px;
    }
    span {
      word-break: break-all;
      word-wrap: wrap;
      text-align: right;
    }
  }
  .simple-info {
    margin: 0;
    word-break: break-all;
    word-wrap: wrap;
  }

  .sql-container {
    background-color: var(--color-title-primary);
    margin-top: 8px;
    padding: 4px;
    overflow-x: scroll;
  }
}
.topology-placeholder {
  line-height: 700px;
  text-align: center;
  font-size: 24px;
  color: var(--el-text-color-secondary);
}
:deep(.g6-component-tooltip) {
  border: none;
  border-radius: 0;
  font-size: 14px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 0;
  box-shadow: none;
}
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  .el-pagination {
    padding: 0;
    margin-bottom: 12px;
  }
}
</style>
