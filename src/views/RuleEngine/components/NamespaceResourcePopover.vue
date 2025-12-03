<template>
  <el-popover
    class="box-item"
    effect="dark"
    placement="top-start"
    :width="280"
    :teleported="teleported"
  >
    <div>
      <i18n-t keypath="RuleEngine.namespaceResourceTip" tag="div" scope="global">
        <template #target>
          <span>{{ targetLabel }}</span>
        </template>
        <template #namespace>
          <span class="font-bold">{{ namespace }}</span>
        </template>
      </i18n-t>
    </div>

    <template #reference>
      <slot name="default"></slot>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    targetLabel?: string
    namespace?: string
    teleported?: boolean
  }>(),
  {
    teleported: true,
  },
)

const { t } = useI18nTl('RuleEngine')
</script>
