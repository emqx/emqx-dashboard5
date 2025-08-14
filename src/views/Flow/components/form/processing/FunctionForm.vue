<template>
  <FunctionForm
    ref="FormCom"
    v-model="record"
    :readonly="readonly"
    :monaco-component="Monaco"
    :nodes="nodes"
    :available-fields="availableFields"
    :tip-component="InfoTooltip"
  />
</template>

<script setup lang="ts">
import InfoTooltip from '@/components/InfoTooltip.vue'
import Monaco from '@/components/Monaco.vue'
import { FunctionForm } from '@emqx/shared-ui-components'
import { Node } from '@vue-flow/core'
import { ComputedRef, PropType, computed, defineEmits, defineExpose, defineProps, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<FunctionForm>,
    default: () => ({ form: [] }),
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  nodes: {
    type: Array as PropType<Array<Node>>,
  },
})

const { getAvailableFields } = useFlowAvailableFields()
const availableFields: ComputedRef<Array<string>> = computed(() => {
  return getAvailableFields(props.nodes || [])
})

const emit = defineEmits(['update:modelValue'])

const FormCom = ref()

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const validate = () => {
  return FormCom.value.validate()
}

defineExpose({ validate })
</script>
