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

export default defineComponent({
  name: 'BasicConfig',
  components: {
    SubTabMenu,
    Cluster,
  },
  setup() {
    const panes = ref(['cluster'])
    const { handleClickTab, setPaneRef } = useSubTabMenu(panes.value)
    const schemaRequest = axios.create({
      baseURL: '',
    })
    const schema = ref({})
    provide('schema', schema)
    const loadSchemaConfig = async () => {
      const res = await schemaRequest.get('static/schema.json')
      if (res.data) {
        schema.value = res.data
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

<style lang="scss" scoped></style>
