<template>
  <div class="plugin-info">
    <p class="plugin-info-hd">
      {{ tl('basicInformation') }}
    </p>
    <div class="plugin-info-content">
      <PluginInfoItem :label="tl('name')">
        {{ pluginData.name }}
      </PluginInfoItem>
      <PluginInfoItem :label="tl('version')">
        {{ pluginData.rel_vsn }}
      </PluginInfoItem>
      <PluginInfoItem :label="tl('author')">
        {{ getPluginAuthorString(pluginData) }}
      </PluginInfoItem>

      <PluginInfoItem label="Repository">
        <!-- TODO:icon -->
        <a :href="pluginData.repo" class="link-repository" target="_blank">
          {{ pluginData.repo }}
        </a>
      </PluginInfoItem>
      <PluginInfoItem :label="tl('recentlySubmitted')">
        {{ pluginData.git_commit_or_build_date }}
      </PluginInfoItem>

      <PluginInfoItem :label="`EMQX ${tl('version')}`">
        {{ pluginData.compatibility?.emqx }}
      </PluginInfoItem>
      <PluginInfoItem :label="tl('compiledUser')">
        {{ pluginData.builder?.name }}
      </PluginInfoItem>
      <PluginInfoItem :label="tl('pluginDesc')">
        {{ pluginData.description }}
      </PluginInfoItem>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PluginInfo',
})
</script>

<script lang="ts" setup>
import { PluginItem } from '@/types/plugin'
import { PropType, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import PluginInfoItem from './PluginInfoItem.vue'
import usePluginItem from '@/hooks/Plugins/usePluginItem'

const props = defineProps({
  pluginData: {
    type: Object as PropType<PluginItem>,
    default: () => ({
      metadata: {},
    }),
  },
})

const { t } = useI18n()
const tl = (key: string, module = 'Plugins') => t(`${module}.${key}`)

const { getPluginAuthorString } = usePluginItem()
</script>

<style lang="scss" scoped>
.plugin-info {
  padding: 28px 24px;
  background: linear-gradient(33deg, #1bcba90c 0%, #2369ff0c 46%, #876eff0c 100%);
}
.plugin-info-hd {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #1d1d1d;
  line-height: 22px;
}
.link-repository {
  color: inherit;
  &:hover {
    text-decoration: underline;
  }
}
</style>
