<template>
  <FilterForm
    class="filter-form"
    ref="FormCom"
    v-model="record"
    :readonly="readonly"
    :monaco-component="Monaco"
  />
</template>

<script setup lang="ts">
import Monaco from '@/components/Monaco.vue'
import { FilterForm } from '@emqx/shared-ui-components'
import {
  PropType,
  WritableComputedRef,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  nextTick,
  onMounted,
  ref,
} from 'vue'

const FormCom = ref()

const props = defineProps({
  modelValue: {
    type: Object as PropType<FilterForm>,
    default: () => createFilterForm(),
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const record: WritableComputedRef<any> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

onMounted(async () => {
  await nextTick()
})

const validate = () => {
  return FormCom.value.validate()
}
defineExpose({ validate })
</script>

<style lang="scss">
.filter-form {
  .monaco-view {
    height: 300px;
    border: 1px solid var(--color-border-primary);
    width: 100%;
  }
}
</style>
