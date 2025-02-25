<template>
  <div class="plugin-manage">
    <el-skeleton v-if="isDetailLoading" :rows="6" animated />
    <div v-else-if="!isDetailLoading && pluginWithConfig">
      <plugin-form-kit
        v-if="uiConfigs"
        :data="record"
        :layouts="uiConfigs"
        :save-func="handleSubmit"
        @saved="fetchPluginConfigs(pluginName, pluginVersion)"
      />
      <template v-else>
        <el-skeleton v-if="schemaLoading" :rows="6" animated />
        <div v-else>{{ $t('Plugins.noPluginConfig') }}</div>
      </template>
    </div>
    <div v-else-if="!isDetailLoading && !pluginWithConfig">
      {{ $t('Plugins.noPluginConfig') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import useRenderPluginForm from '@/hooks/Plugins/useRenderPluginForm'
import PluginFormKit from '@/components/PluginsForm/PluginFormKit.vue'

const props = defineProps({
  pluginName: {
    type: String,
    required: true,
  },
  pluginVersion: {
    type: String,
    required: true,
  },
  pluginWithConfig: {
    type: Boolean,
    default: false,
  },
  isDetailLoading: {
    type: Boolean,
    default: false,
  },
})

watch(
  () => props.pluginWithConfig,
  async (val) => {
    if (val) {
      await fetchPluginSchema(props.pluginName, props.pluginVersion)
      await fetchPluginConfigs(props.pluginName, props.pluginVersion)
    }
  },
)

const {
  record,
  uiConfigs,
  schemaLoading,
  fetchPluginSchema,
  fetchPluginConfigs,
  savePluginsConfigs,
} = useRenderPluginForm()

async function handleSubmit(data: Record<string, any>) {
  return await savePluginsConfigs(props.pluginName, props.pluginVersion, data)
}
</script>
