<template>
  <div class="vertical-align-center payload-limit-input">
    <div class="switch-container">
      <el-switch v-model="switchProxy" />
      <span class="tip" v-if="!switchProxy"> {{ t('Extension.unlimited') }} </span>
    </div>

    <el-input v-if="switchProxy" v-model="inputValue">
      <template #append>
        <span class="single-unit"> B </span>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number | undefined
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | undefined): void
}>()

const { t } = useI18nTl('LogTrace')

const UNLIMITED_VALUE = 0

const getValueNumber = (val: string) => {
  const num = parseFloat(val)
  return isNaN(num) ? undefined : num
}

const inputValue = computed<string>({
  get() {
    return props.modelValue?.toString() ?? ''
  },
  set(val: string) {
    emit('update:modelValue', getValueNumber(val))
  },
})
const switchProxy = computed<boolean>({
  get() {
    return inputValue.value === '' || Number(inputValue.value) !== UNLIMITED_VALUE
  },
  set(val: boolean) {
    inputValue.value = !val ? UNLIMITED_VALUE.toString() : ''
  },
})
</script>

<style lang="scss">
.payload-limit-input {
  flex-grow: 1;
  .tip {
    margin-left: 12px;
    color: var(--color-text-secondary);
    opacity: 0.5;
  }
  .switch-container {
    flex-shrink: 0;
    margin-right: 12px;
  }
  .single-unit {
    display: block;
    width: 100%;
    padding: 0 11px;
    text-align: left;
    color: var(--el-input-text-color, var(--color-text-primary));
  }
}
</style>
