<template>
  <InputWithUnit
    class="time-input-with-unit-select"
    v-model="inputValue"
    :units="unitList"
    :disabled="disabled"
    :default-unit="defaultUnit"
    :number-placeholder="numberPlaceholder"
    @change="$emit('change')"
  />
</template>

<script lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { defineComponent, PropType, computed } from 'vue'
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
    enabledUnits: {
      type: Array as PropType<Array<string>>,
      default: () => ['ms', 's', 'm', 'h'],
    },
    numberPlaceholder: {
      type: String,
      default: '',
    },
    defaultUnit: {
      type: String,
    },
  },
  setup(props, context) {
    const { tl, t } = useI18nTl('Base')
    const totalUnitList = [
      { value: 'ms', label: tl('milliseconds') },
      { value: 's', label: tl('second') },
      { value: 'm', label: tl('minute') },
      { value: 'h', label: tl('hour') },
      { value: 'd', label: t('Base.day', 1) },
    ]

    const inputValue = computed({
      get() {
        return props.modelValue
      },
      set(val: string) {
        context.emit('update:modelValue', val)
      },
    })

    const unitList = computed(() => {
      return totalUnitList.filter(({ value }) => props.enabledUnits.includes(value))
    })

    return { inputValue, unitList }
  },
})
</script>
