<template>
  <template v-if="!disabledByWebhook">
    <OperateWebhookAssociatedPopover
      :teleported="teleported"
      :disabled="disabledByWebhook"
      :target-label="targetLabel"
      :operation="operation"
      :namespace="namespace"
      :name="name"
    >
      <slot name="default"></slot>
    </OperateWebhookAssociatedPopover>
  </template>
  <template v-else-if="!disabledByNsResource">
    <NamespaceResourcePopover
      :namespace="namespace"
      :target-label="targetLabel"
      :teleported="teleported"
    >
      <slot name="default" :disabledOpByNsResource="!disabledByNsResource"></slot>
    </NamespaceResourcePopover>
  </template>
  <template v-else>
    <slot name="default"></slot>
  </template>
</template>

<script setup lang="ts">
import OperateWebhookAssociatedPopover from './OperateWebhookAssociatedPopover.vue'
import NamespaceResourcePopover from './NamespaceResourcePopover.vue'

const props = withDefaults(
  defineProps<{
    /**
     * this `disabled` means disabled popover
     * means user can op
     */
    disabledByWebhook?: boolean
    targetLabel?: string
    operation?: string
    teleported?: boolean
    namespace?: string
    /**
     * webhook name,if not set, route will go to list page, otherwise will go to detail page
     */
    name?: string
  }>(),
  {
    disabledByWebhook: true,
    teleported: true,
  },
)

const store = useStore()
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)

const disabledByNsResource = computed(() => !(!isNamespaceUser.value && !!props.namespace))
</script>
