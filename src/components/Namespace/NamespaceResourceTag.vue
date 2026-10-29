<template>
  <el-tag v-if="namespace && !isNamespaceUser" type="info">
    {{ t('RuleEngine.namespaceResourceLabel', { namespace }) }}
  </el-tag>
</template>

<script setup lang="ts">
defineProps<{ namespace?: string | null }>()

const { t } = useI18n()
const store = useStore()
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
</script>
