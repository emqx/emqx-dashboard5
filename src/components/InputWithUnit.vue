<template>
  <el-input class="time-input-with-unit-select" v-model.number.trim="numPart">
    <template #append>
      <el-select v-model="unit">
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
})

const emit = defineEmits(['update:modelValue'])

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
  return new RegExp(`^(\\d+(\\.\\d*)?)?(${units?.map(({ value }) => value).join('|')})$`)
})

const modelValueMatchReg = computed(() => {
  return props.modelValue?.match(strRegExp.value)
})

const numPart: WritableComputedRef<string> = computed({
  get() {
    if (modelValueMatchReg.value) {
      const [totalStr, numberPart] = modelValueMatchReg.value
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
      const [totalStr, numberPart, decimalPart, unit] = modelValueMatchReg.value
      return unit
    }
    if (!props.modelValue) {
      return units && units.length > 0 ? units[0].value : ''
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
