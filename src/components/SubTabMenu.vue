<template>
  <div class="sub-tab-menu">
    <el-tabs tab-position="left" type="card" @tab-click="clickTab">
      <template v-for="pane in panes" :key="pane">
        <el-tab-pane :label="tl(pane)" :lazy="true">
          <div class="sec-header-title">
            {{ tl(pane) }}
          </div>
          <slot :pane="pane"></slot>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useI18nTl from '@/hooks/useI18nTl'
import { SubTabComponent } from '@/types/config'

export default defineComponent({
  props: {
    panes: {
      type: Array as PropType<string[]>,
      required: true,
    },
    i18nKeyword: {
      type: String,
      required: true,
    },
  },
  emits: ['tab-click'],
  setup(props, ctx) {
    const { tl } = useI18nTl(props.i18nKeyword)

    const clickTab = async function (tab: SubTabComponent) {
      window.scrollTo(0, 0)
      ctx.emit('tab-click', tab)
    }

    return {
      tl,
      clickTab,
    }
  },
})
</script>

<style lang="scss">
.sub-tab-menu {
  .el-tabs.el-tabs--left {
    .el-tabs__header.is-left {
      border-radius: 8px;
      position: fixed;
      z-index: 1;
      .el-tabs__active-bar {
        background-color: var(--color-border-table);
      }
      .el-tabs__item {
        border: 1px solid var(--color-border-table);
        background-color: var(--color-bg-primary);
        border-left: 1px solid var(--color-border-table);
        border-top: none;
        &:first-child {
          border-top: 1px solid var(--color-border-table) !important;
          border-radius: 8px 8px 0 0;
        }
        &:last-child {
          border-radius: 0 0 8px 8px;
          border-bottom: 1px solid var(--color-border-table) !important;
        }
      }
      .el-tabs__item.is-left.is-active {
        border-right: 1px solid var(--color-border-table) !important;
      }
    }
    .el-tabs__content {
      padding-left: 130px;
    }
  }
  .el-tabs.el-tabs--card.el-tabs--top {
    .el-tabs__content {
      padding-left: 0px;
    }
  }
}
</style>
