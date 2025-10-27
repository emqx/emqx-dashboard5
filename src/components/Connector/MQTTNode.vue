<!-- Component for mqtt connector `static_clientids` `node` -->
<template>
  <el-tooltip :disabled="!disabled" :content="tl('canNotEditNode')">
    <el-input v-model="inputValue" v-bind="$attrs" :disabled="disabled" />
  </el-tooltip>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  edit: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const initValue = ref('')
const disabled = computed(() => props.edit && !!initValue.value)
const { tl } = useI18nTl('RuleEngine')

onMounted(() => {
  initValue.value = props.modelValue
})
</script>
