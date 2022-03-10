<template>
  <div class="basic-config">
    <SubTabMenu
      v-slot="{ pane }"
      :panes="panes"
      i18nKeyword="BasicConfig"
      @tab-click="handleClickTab"
    >
      <component :is="pane" class="item-page" :ref="(el) => setPaneRef(el, pane)"></component>
    </SubTabMenu>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import axios from 'axios'
import SubTabMenu from '@/components/SubTabMenu.vue'
import useSubTabMenu from '@/hooks/useSubTabMenu'
import Cluster from './components/Cluster.vue'
import Log from './components/Log.vue'
import Dashboard from './components/Dashboard.vue'
import Zone from './components/Zone.vue'

export default defineComponent({
  name: 'BasicConfig',
  components: {
    SubTabMenu,
    Cluster,
    Log,
    Dashboard,
    Zone,
  },
  setup() {
    const panes = ref(['cluster', 'zone', 'log', 'dashboard'])
    const { handleClickTab, setPaneRef } = useSubTabMenu(panes.value)
    const schemaRequest = axios.create({
      baseURL: '',
    })
    const schema = ref({})
    provide('schema', schema)
    const loadSchemaConfig = async () => {
      try {
        const res = await schemaRequest.get('static/schema.json')
        if (res.data) {
          schema.value = res.data
        }
      } catch (error) {
        // ignore error
      }
    }
    loadSchemaConfig()
    return {
      panes,
      schema,
      handleClickTab,
      setPaneRef,
    }
  },
})
</script>

<style lang="scss">
.basic-config {
  .sec-header-title {
    padding: 20px;
    padding-left: 34px;
  }
}
</style>
