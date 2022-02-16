<template>
  <div class="app-wrapper">
    <div class="part-header">Overview</div>
    <div class="topology-wrap">
      <div id="rule-topology" ref="topologyDiagramCanvasEle"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RuleTopology',
})
</script>

<script lang="ts" setup>
import useTopology from '@/hooks/Rule/useTopology'

const { topologyDiagramCanvasEle } = useTopology()
</script>

<style lang="scss" scoped>
.part-header {
  margin-bottom: 30px;
}
.topology-wrap {
  border: 1px solid #ededed;
  background-color: #fafafa;
}
</style>
