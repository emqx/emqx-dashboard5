<template>
  <InputWithUnit
    class="time-input-with-unit-select"
    v-model="inputValue"
    :units="unitList"
    :disabled="disabled"
    @change="$emit('change')"
  />
</template>

<script lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { defineComponent } from 'vue'
import InputWithUnit from './InputWithUnit.vue'

export default defineComponent({
  name: 'TimeInputWithUnitSelect',
  components: {
    InputWithUnit,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    inputValue: {
      get() {
        return this.modelValue
      },
      set(val: string) {
        this.$emit('update:modelValue', val)
      },
    },
  },
  setup() {
    const { tl } = useI18nTl('Base')
    const unitList = [
      { value: 'h', label: tl('hour') },
      { value: 'm', label: tl('minute') },
      { value: 's', label: tl('second') },
      { value: 'ms', label: tl('milliseconds') },
    ]

    return { unitList }
  },
})
</script>
