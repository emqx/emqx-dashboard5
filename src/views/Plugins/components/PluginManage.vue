<template>
  <div class="plugin-manage">Plugin Manage</div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import usePluginRenderForm from '@/hooks/Plugins/usePluginRenderForm'

const props = defineProps({
  pluginName: {
    type: String,
    required: true,
  },
})

usePluginRenderForm({ name: props.pluginName })
</script>
