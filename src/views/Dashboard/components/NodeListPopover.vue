<template>
  <el-card class="node-list-popover with-border">
    <div class="popover-hd">
      <el-input v-model="filter">
        <template #prefix>
          <Search class="w-4 h-4" />
        </template>
      </el-input>
    </div>
    <div class="popover-bd">
      <div class="list-block" v-for="(value, key) in nodeList" :key="key">
        <div class="list-hd">
          {{ key === 'unknown' ? t('Dashboard.unknownRoleNodes') : startCase(key) }}
        </div>
        <div class="list-bd">
          <ul>
            <li class="node-item" v-for="nodeItem in value" :key="nodeItem.node">
              <button type="button" class="node-select" @click="emit('select', nodeItem.node)">
                <NodeStatusLabel :status="nodeItem.node_status" />
                <span class="node-name">{{ nodeItem.node }}</span>
              </button>
            </li>
          </ul>
          <p class="tip placeholder" v-if="value.length === 0">{{ tl('noData') }}</p>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { NodeInfo } from '@/types/dashboard'
import { Search } from 'lucide-vue-next'
import NodeStatusLabel from '@/components/NodeStatusLabel.vue'
import { groupNodesByRole } from '@/common/nodeStatus'

const props = defineProps({
  nodes: {
    type: Array as PropType<Array<NodeInfo>>,
    default: () => [],
  },
})

const { t, tl } = useI18nTl('Base')
const emit = defineEmits<{ (event: 'select', node: string): void }>()

const filter = ref('')
const nodeList = computed(() =>
  groupNodesByRole(props.nodes.filter((node) => node.node.includes(filter.value))),
)
</script>

<style lang="scss">
.node-list-popover {
  width: 430px;
  padding: 16px;
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-card);
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
    border-radius: var(--border-radius-small);
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .node-item {
    position: relative;
    padding-left: 16px;
    padding-right: 16px;
    line-height: 24px;
    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }
  .node-select {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    border: none;
    padding: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
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
