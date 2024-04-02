<template>
  <div class="plugin-manage">
    <plugin-form-kit v-if="uiConfigs" :data="record" :layouts="uiConfigs" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import usePluginRenderForm from '@/hooks/Plugins/usePluginRenderForm'
import PluginFormKit from '@/components/PluginsForm/PluginFormKit.vue'

const props = defineProps({
  pluginName: {
    type: String,
    required: true,
  },
})

const { record, uiConfigs } = usePluginRenderForm({ name: props.pluginName })

function handleSubmit(data: Record<string, any>) {
  console.log(JSON.stringify(data, null, 2))
}
</script>
