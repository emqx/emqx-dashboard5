<template>
  <div class="basic-config app-wrapper">
    <el-card class="config-card">
      <SubTabMenu
        v-slot="{ pane }"
        :panes="panes"
        i18nKeyword="BasicConfig"
        @tab-click="handleClickTab"
      >
        <component
          :is="pane"
          class="item-page"
          :ref="(el: Element) => setPaneRef(el, pane)"
        ></component>
      </SubTabMenu>
    </el-card>
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
import Telemetry from './components/Telemetry.vue'
import Rate from './components/Rate.vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'BasicConfig',
  components: {
    SubTabMenu,
    Cluster,
    Log,
    Dashboard,
    Zone,
    Telemetry,
    Rate,
  },
  setup() {
    const panes = ref(['cluster', 'zone', 'log', 'dashboard', 'telemetry', 'rate'])
    const { handleClickTab, setPaneRef } = useSubTabMenu(panes.value)
    const schemaRequest = axios.create({
      baseURL: '',
    })
    const store = useStore()
    const schema = ref({})
    provide('schema', schema)
    const loadSchemaConfig = async () => {
      try {
        const configPath = `static/hot-config-schema-${store.state.lang}.json`
        const res = await schemaRequest.get(configPath)
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
  margin-bottom: 36px;
  .sec-header-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-title-primary);
    margin-left: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--color-border-table);
  }
  .config-card {
    min-height: 300px;
  }
}
</style>
