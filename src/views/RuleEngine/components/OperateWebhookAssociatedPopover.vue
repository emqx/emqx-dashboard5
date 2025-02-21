<template>
  <el-popover
    class="box-item"
    effect="dark"
    placement="top-start"
    :width="280"
    :teleported="teleported"
    :disabled="disabled"
  >
    <div>
      <i18n-t keypath="RuleEngine.handleWebhookAssociatedTip" tag="div" scope="global">
        <template #target>
          <span>{{ targetLabel }}</span>
        </template>
        <template #operation>
          <span>{{ lowerCase(operation) }}</span>
        </template>
        <template #page>
          <router-link :to="route"> Webhook {{ t('RuleEngine.page') }} </router-link>
        </template>
      </i18n-t>
    </div>

    <template #reference>
      <slot name="default"></slot>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { DetailTab } from '@/types/enum'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    targetLabel?: string
    operation?: string
    teleported?: boolean
    /**
     * webhook name,if not set, route will go to list page, otherwise will go to detail page
     */
    name?: string
  }>(),
  {
    disabled: true,
    teleported: true,
  },
)

const { t } = useI18nTl('RuleEngine')

const route = computed(() => {
  if (!props.name) {
    return { name: 'webhook' }
  }
  return {
    name: 'webhook-detail',
    params: { name: props.name },
    query: { tab: DetailTab.Setting },
  }
})
</script>
