<template>
  <div class="advanced">
    <SubTabMenu v-slot="{ pane }" :panes="panes" i18nKeyword="Advanced" @tab-click="handleClickTab">
      <component
        :is="pane"
        class="item-page"
        :translate="tl"
        :ref="(el) => setPaneRef(el, pane)"
      ></component>
    </SubTabMenu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Retainer from './components/retainer.vue'
import Rewrite from './components/rewrite.vue'
import Subscribe from './components/subscribe.vue'
import Postpone from './components/postpone.vue'
import Message from './components/message.vue'
import SubTabMenu from '@/components/SubTabMenu.vue'
import useI18nTl from '@/hooks/useI18nTl'
import useSubTabMenu from '@/hooks/useSubTabMenu'

export default defineComponent({
  name: 'Advanced',
  components: {
    Rewrite,
    Retainer,
    Subscribe,
    Postpone,
    Message,
    SubTabMenu,
  },
  setup() {
    const panes = ref(['retainer', 'rewrite', 'subscribe', 'postpone', 'message'])
    const { tl } = useI18nTl('Advanced')
    const { handleClickTab, setPaneRef } = useSubTabMenu(panes.value)

    return {
      panes,
      tl,
      handleClickTab,
      setPaneRef,
    }
  },
})
</script>

<style lang="scss" scoped></style>
