<template>
  <div class="app-wrapper flow-chart">
    <div class="topology-wrap">
      <div id="rule-topology" ref="topologyDiagramCanvasEle"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useTopology from '@/hooks/Rule/useTopology'

const { topologyDiagramCanvasEle } = useTopology()
</script>

<style lang="scss" scoped>
.flow-chart {
  margin-bottom: 30px;
}
.topology-wrap {
  border: 1px solid #ededed;
  background-color: #fafafa;
}

:deep(.topology-node-tooltip) {
  width: 200px;
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
    background-color: #000;
    margin-top: 8px;
    padding: 4px;
  }
}
:deep(.g6-component-tooltip) {
  border: none;
  border-radius: 0;
  font-size: 12px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 0;
  box-shadow: none;
}
</style>
