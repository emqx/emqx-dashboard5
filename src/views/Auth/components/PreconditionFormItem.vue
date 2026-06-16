<template>
  <el-col :span="12">
    <el-form-item prop="precondition">
      <template #label>
        <FormItemLabel
          :label="$t('Auth.precondition')"
          :desc="desc"
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

const props = withDefaults(
  defineProps<{
    modelValue?: string
    authType?: 'authn' | 'authz'
  }>(),
  {
    authType: 'authn',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const desc = computed(() =>
  props.authType === 'authz' ? tl('authzPreconditionDesc') : tl('preconditionDesc'),
)

const precondition = computed({
  get() {
    return props.modelValue ?? ''
  },
  set(value: string) {
    emit('update:modelValue', value)
  },
})
</script>
