<template>
  <div class="plugin-manage">
    <plugin-form-kit v-if="uiConfigs" :data="record" :layouts="uiConfigs" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import useRenderPluginForm from '@/hooks/Plugins/useRenderPluginForm'
import PluginFormKit from '@/components/PluginsForm/PluginFormKit.vue'

const props = defineProps({
  pluginName: {
    type: String,
    required: true,
  },
})

const { record, uiConfigs, fetchPluginConfigs } = useRenderPluginForm()

fetchPluginConfigs(props.pluginName)

function handleSubmit(data: Record<string, any>) {
  console.log(JSON.stringify(data, null, 2))
  // TODO: Implement API usage here
}
</script>
