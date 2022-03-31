<template>
  <div class="nodes-graph" ref="canvasEle" id="nodes-graph"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NodesGraph',
})
</script>

<script setup lang="ts">
import { defineProps, PropType, watch, defineEmits } from 'vue'
import useDrawNodesGraph from '@/hooks/Overview/useDrawNodesGraph'
import { NodeMsg, NodeStatisticalData } from '@/types/dashboard'

const props = defineProps({
  data: {
    type: Object as PropType<{
      nodes: Array<NodeMsg>
      stats: Array<NodeStatisticalData>
    }>,
    required: true,
  },
})

const emit = defineEmits(['change'])

const { canvasEle, drawNodes } = useDrawNodesGraph(emit)

watch(
  () => props.data,
  () => {
    drawNodes(props.data)
  },
)
</script>

<style lang="scss">
.nodes-graph {
  height: 100%;
}
</style>
