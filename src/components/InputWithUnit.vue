<template>
  <el-input
    class="input-with-unit"
    v-model="numPart"
    :disabled="disabled"
    :readonly="disabledOpt && unit === disabledOpt.value"
    @change="$emit('change')"
    :placeholder="numberPlaceholder"
  >
    <template #append>
      <span class="single-unit" v-if="units && units.length === 1">
        {{ units[0].label }}
      </span>
      <el-select
        v-if="units && units.length > 1"
        v-model="unit"
        :disabled="disabled"
        @change="$emit('change')"
      >
        <el-option
          v-if="disabledOpt"
          :value="disabledOpt.value"
          :label="disabledOpt.label.toString()"
        />
        <el-option v-for="{ label, value } in units" :key="value" :value="value" :label="label" />
      </el-select>
    </template>
  </el-input>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InputWithUnit',
})
</script>

<script setup lang="ts">
import { defineProps, defineEmits, PropType, computed, WritableComputedRef, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
  },
  units: {
    type: Array as PropType<Array<{ label: string; value: string } | string>>,
  },
  defaultUnit: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  numberPlaceholder: {
    type: String,
    default: '',
  },
  /**
   * When this option is selected, the input box will be disabled
   */
  disabledOpt: {
    type: Object as PropType<{
      value: string | number | boolean
      label: number | string
    }>,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const units = props.units?.map((unit) => {
  if (typeof unit === 'string') {
    return { label: unit, value: unit }
  }
  return {
    label: unit.label,
    value: unit.value,
  }
})

const strRegExp = computed(() => {
  return new RegExp(
    `^(?<numberPart>\\d+(\\.\\d*)?)?(?<unit>${units?.map(({ value }) => value).join('|')})$`,
  )
})
const backupRegExp = computed(() => {
  return new RegExp(`^(?<numberPart>.*)(?<unit>${units?.map(({ value }) => value).join('|')})$`)
})

const numPartRegExp = /^-?\d+(\.\d+)?$/
const specialStatusNumPartRegExp = /^(\.|\.\d+|\d+\.)$/

const modelValueMatchReg = computed(() => {
  if (typeof props.modelValue !== 'string') {
    return undefined
  }
  return props.modelValue.match(strRegExp.value)
})

// handle chaos input
const modelValueMatchBackupReg = computed(() => {
  if (typeof props.modelValue !== 'string') {
    return undefined
  }
  return props.modelValue.match(backupRegExp.value)
})

const numPart: WritableComputedRef<string> = computed({
  get() {
    const { disabledOpt } = props
    if (disabledOpt && props.modelValue === disabledOpt.value) {
      return '0'
    }
    const { numberPart = '' } =
      modelValueMatchReg.value?.groups || modelValueMatchBackupReg.value?.groups || {}
    return numberPart.trim() || ''
  },
  set(val) {
    let value = val
    if (!numPartRegExp.test(value) && !specialStatusNumPartRegExp.test(value)) {
      const num = parseFloat(value)
      value = Number.isNaN(num) ? '' : num.toString()
    } else if (numPartRegExp.test(value)) {
      value = parseFloat(value).toString()
    }

    const isValidNum = value === '' || value === undefined || value === null
    if (isValidNum) {
      selectedUnit.value = unit.value
    }
    inputValue.value = !isValidNum ? value + unit.value : ''
  },
})

/**
 * handle the situation that does not input num but selected unit
 */
let selectedUnit = ref('')
const unit: WritableComputedRef<string> = computed({
  get() {
    const { disabledOpt } = props
    if (disabledOpt && props.modelValue === disabledOpt.value) {
      return disabledOpt.value
    }

    const { unit = '' } =
      modelValueMatchReg.value?.groups || modelValueMatchBackupReg.value?.groups || {}
    if (unit !== '') {
      return unit
    }

    if (!props.modelValue && units && units.length > 0) {
      if (selectedUnit.value) {
        return selectedUnit.value
      }
      if (props.defaultUnit && units.some(({ value }) => value === props.defaultUnit)) {
        return props.defaultUnit
      }
      return units[0].value
    }
    return ''
  },
  set(val) {
    const { disabledOpt } = props
    if (disabledOpt) {
      // old value is disabledOpt.value
      if (props.modelValue === disabledOpt.value) {
        inputValue.value = `0${val}`
      } else {
        // new value is disabledOpt.value
        inputValue.value = val
      }
      return
    }

    if (numPart.value) {
      inputValue.value = (numPart.value || '') + val
    } else {
      selectedUnit.value = val
      inputValue.value = ''
    }
  },
})

const inputValue: WritableComputedRef<string> = computed({
  get() {
    return props.modelValue || ''
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>

<style lang="scss">
.input-with-unit {
  .single-unit {
    display: block;
    width: 100%;
    padding: 0 11px;
    text-align: left;
    color: var(--el-input-text-color, var(--color-text-primary));
  }
}
</style>
