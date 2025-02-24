<template>
  <el-form-item class="custom-form-item" v-bind="$attrs">
    <template v-if="$slots.label" #label>
      <slot name="label"></slot>
    </template>

    <slot name="default" v-if="!readonly"> </slot>
    <p v-else class="value">{{ valueForShow }}</p>
  </el-form-item>
</template>

<script setup lang="ts">
const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * for some fields, the value to show is not the value for edit
   */
  value: {
    type: [String, Number, Boolean],
  },
})

/**
 * !!! Note that if the modelValue changes after the component is loaded,
 * it will not cause the view to change
 */
const valueForShow = ref<string | number | boolean>('')

const slots = useSlots()
const getValue = () => {
  try {
    if (props.value) {
      valueForShow.value = props.value
      return
    }
    const defaultSlot = slots.default
    if (isFunction(defaultSlot)) {
      const slotValue = defaultSlot()?.[0]
      valueForShow.value = slotValue?.props?.modelValue
    }
  } catch (error) {
    console.error('Can not get value')
  }
}

onMounted(() => {
  if (props.readonly) {
    getValue()
  }
})
</script>
