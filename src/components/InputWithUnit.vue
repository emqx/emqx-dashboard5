<template>
  <el-input
    class="time-input-with-unit-select"
    v-model.number.trim="numPart"
    :disabled="disabled"
    @change="$emit('change')"
    :placeholder="numberPlaceholder"
  >
    <template #append>
      <el-select v-model="unit" :disabled="disabled" @change="$emit('change')">
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
import { defineProps, defineEmits, PropType, computed, WritableComputedRef } from 'vue'
// TODO:handle user random input
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

const modelValueMatchReg = computed(() => {
  return props.modelValue?.match(strRegExp.value)
})

const numPart: WritableComputedRef<string> = computed({
  get() {
    if (modelValueMatchReg.value) {
      const { numberPart = '' } = modelValueMatchReg.value.groups || {}
      return numberPart
    }
    return ''
  },
  set(val) {
    inputValue.value = val + unit.value
  },
})

const unit: WritableComputedRef<string> = computed({
  get() {
    if (modelValueMatchReg.value) {
      const { unit = '' } = modelValueMatchReg.value.groups || {}
      return unit
    }
    // handle chaos input
    const { unit } = props.modelValue?.match(backupRegExp.value)?.groups || {}
    if (unit) {
      return unit
    }
    if (!props.modelValue) {
      if (units && units.length > 0) {
        if (props.defaultUnit && units.some(({ value }) => value === props.defaultUnit)) {
          return props.defaultUnit
        }
        return units[0].value
      }
      return ''
    }
    return ''
  },
  set(val) {
    inputValue.value = (numPart.value || '') + val
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
