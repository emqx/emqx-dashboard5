<template>
  <div class="sub-tab-menu">
    <el-tabs tab-position="left" @tab-click="clickTab">
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
      ctx.emit('tab-click', tab)
    }

    return {
      tl,
      clickTab,
    }
  },
})
</script>

<style lang="scss" scoped>
$mid-menu-width: 160px;

.sec-header-title {
  font-size: 24px;
  font-weight: 700;
  padding: 0 20px 15px;
}
:deep(.el-tabs--left) {
  .el-tabs__header.is-left {
    position: fixed;
    background-color: #fff;
    z-index: 100;
    width: $mid-menu-width;
    margin-top: -9px;
  }
  .el-tabs__content {
    margin-left: $mid-menu-width;
  }
}

:deep(.item-page) {
  &.no-tab-wrapper {
    margin: 20px;
  }

  .el-tabs__content {
    margin-left: 0;
  }

  .section-header {
    > :first-child {
      font-size: 18px;
    }
  }

  .part-header {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .el-tab-pane {
    margin: 20px;
  }
}
</style>
