<template>
  <el-card class="node-list-popover with-border">
    <div class="popover-hd">
      <el-input v-model="filter" :prefix-icon="Search" />
    </div>
    <div class="popover-bd">
      <div class="list-block" v-for="(value, key) in nodeList" :key="key">
        <div class="list-hd">{{ startCase(key) }}</div>
        <div class="list-bd">
          <ul>
            <li class="node-item" v-for="nodeItem in value" :key="nodeItem.node">
              <i class="node-status-dot" :class="`is-${nodeItem.node_status}`"></i>
              <p class="node-name">{{ nodeItem.node }}</p>
            </li>
          </ul>
          <p class="tip placeholder" v-if="value.length === 0">{{ tl('noData') }}</p>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { NodeInfo } from '@/types/dashboard'
import { Search } from '@element-plus/icons-vue'
import { startCase } from 'lodash'
import { ComputedRef, PropType, computed, defineProps, ref } from 'vue'

interface NodeList {
  core: Array<NodeInfo>
  replicant: Array<NodeInfo>
}

const props = defineProps({
  nodes: {
    type: Array as PropType<Array<NodeInfo>>,
    default: () => [],
  },
})

const { tl } = useI18nTl('Base')

const filter = ref('')
const nodeList: ComputedRef<NodeList> = computed(() => {
  return props.nodes.reduce(
    (obj: NodeList, nodeItem) => {
      if (nodeItem.node.indexOf(filter.value) > -1) {
        obj[nodeItem.role].push(nodeItem)
      }
      return obj
    },
    { core: [], replicant: [] } as NodeList,
  )
})
</script>

<style lang="scss">
@use 'sass:math';

.node-list-popover {
  width: 430px;
  padding: 16px;
  border: 1px solid var(--color-border-card);
  border-radius: 16px;
  box-shadow: 0px 2px 4px var(--color-shadow-primary);
  background: var(--color-bg-content);
  .popover-hd {
    margin-bottom: 16px;
  }
  .popover-bd {
    max-height: 280px;
    overflow-y: scroll;
  }
  .list-hd {
    /* Auto layout */
    display: flex;
    align-items: center;
    padding: 4px 16px;
    height: 32px;
    background: var(--color-bg-split);
    border-radius: 8px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .node-item {
    position: relative;
    padding-left: 16px + 14px;
    padding-right: 16px;
    line-height: 24px;
    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }
  .node-status-dot {
    position: absolute;
    left: 16px;
    top: math.div(24px - 8px, 2);
  }
  .node-name {
    word-wrap: break-word;
  }
  .placeholder {
    text-align: center;
    margin: 16px auto;
  }
}
</style>
