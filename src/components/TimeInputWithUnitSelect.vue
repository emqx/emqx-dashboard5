<template>
  <CustomInputNumber v-if="showNumInput" class="time-input-with-unit-select" v-model="inputValue" />
  <InputWithUnit
    v-else
    class="time-input-with-unit-select"
    :modelValue="inputValue as string"
    :units="unitList"
    :disabled="disabled"
    :default-unit="defaultUnitValue"
    :number-placeholder="numberPlaceholder"
    @update:model-value="handleInputUpdated"
    @change="$emit('change')"
  />
</template>

<script lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import CustomInputNumber from './CustomInputNumber.vue'
import InputWithUnit from './InputWithUnit.vue'

export default defineComponent({
  name: 'TimeInputWithUnitSelect',
  components: {
    InputWithUnit,
    CustomInputNumber,
  },
  props: {
    modelValue: {
      type: [String, Number] as PropType<string | number>,
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

    const inputValue: WritableComputedRef<string | number> = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        context.emit('update:modelValue', val)
      },
    })

    const handleInputUpdated = (val: string | number) => {
      inputValue.value = val
    }

    const unitList = computed(() => {
      return totalUnitList.filter(({ value }) => props.enabledUnits.includes(value))
    })

    /**
     * Make sure the config can be displayed
     */
    const showNumInput = computed(() => {
      return inputValue.value !== undefined && typeof inputValue.value === 'number'
    })

    const defaultUnitValue = computed(() => {
      if (!isUndefined(props.defaultUnit)) {
        return props.defaultUnit
      }
      return props.enabledUnits.includes('s') ? 's' : props.enabledUnits[0]
    })

    return { inputValue, unitList, showNumInput, defaultUnitValue, handleInputUpdated }
  },
})
</script>
