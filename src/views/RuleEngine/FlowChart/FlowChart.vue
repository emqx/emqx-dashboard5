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
</style>
