<template>
  <el-col :span="12">
    <el-form-item prop="precondition">
      <template #label>
        <FormItemLabel
          :label="$t('Auth.precondition')"
          :desc="tl('preconditionDesc')"
          desc-marked
          :max-height="240"
        />
      </template>
      <el-input v-model="precondition" />
    </el-form-item>
  </el-col>
</template>

<script setup lang="ts">
const { tl } = useI18nTl('Auth')

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const precondition = computed({
  get() {
    return props.modelValue ?? ''
  },
  set(value: string) {
    emit('update:modelValue', value)
  },
})
</script>
