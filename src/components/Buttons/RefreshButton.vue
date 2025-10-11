<template>
  <el-button v-if="noText" @click="handleClick">
    <Icon
      icon="lucide:refresh-cw"
      :class="isSpinning ? 'animate-spin' : ''"
      class="transition-transform duration-600"
    />
  </el-button>
  <el-button v-else @click="handleClick">
    <Icon
      icon="lucide:refresh-cw"
      :class="isSpinning ? 'animate-spin' : ''"
      class="mr-2 transition-transform duration-600"
    />
    <template v-if="!$slots.default">
      {{ t('Base.refresh') }}
    </template>
    <slot />
  </el-button>
</template>

<script setup lang="ts">
defineProps<{
  noText?: boolean
}>()

const { t } = useI18n()
const isSpinning = ref(false)

const handleClick = () => {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 600)
}
</script>
