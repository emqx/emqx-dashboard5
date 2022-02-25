<template>
  <div class="">
    <el-tabs tab-position="left" @tab-click="clickTab">
      <template v-for="pane in panes" :key="pane">
        <el-tab-pane :label="tl(`${pane}`)" :lazy="true">
          <div class="sec-header-title">
            {{ tl(`${pane}`) }}
          </div>
          <component
            :is="pane"
            class="item-page"
            :translate="tl"
            :ref="(el) => setPaneRef(el, pane)"
          ></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import Retainer from './components/retainer.vue'
import Rewrite from './components/rewrite.vue'
import Subscribe from './components/subscribe.vue'
import Postpone from './components/postpone.vue'
import Message from './components/message.vue'
import useI18nTl from '@/hooks/useI18nTl'

export default defineComponent({
  components: {
    Rewrite,
    Retainer,
    Subscribe,
    Postpone,
    Message,
  },
  setup() {
    let panes = ref(['retainer', 'rewrite', 'subscribe', 'postpone', 'message'])

    let panesRef = {}

    const { tl } = useI18nTl('Advanced')

    const clickTab = async function (tab) {
      let tabName = panes.value[tab.index]
      if (panesRef[tabName]) {
        panesRef[tabName].reloading()
      }
    }

    const setPaneRef = (el, pane) => {
      if (el) {
        panesRef[pane] = el
      }
    }

    return {
      panes,
      tl,
      clickTab,
      setPaneRef,
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
.no-tab-wrapper {
  margin: 20px;
}
</style>
