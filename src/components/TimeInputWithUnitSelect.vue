<template>
  <el-input
    class="time-input-with-unit-select"
    type="number"
    v-model.number.trim="timeValue"
    :disabled="disabled"
    @change="$emit('change')"
  >
    <template #append>
      <el-select v-model="unit" :disabled="disabled" @change="$emit('change')">
        <el-option value="h" :label="$t('Base.hour')" />
        <el-option value="m" :label="$t('Base.minute')" />
        <el-option value="s" :label="$t('Base.second')" />
        <el-option value="ms" :label="$t('Base.milliseconds')" />
      </el-select>
    </template>
  </el-input>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TimeInputWithUnitSelect',
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
    timeValue: {
      get() {
        return this.inputValue.replace(this.unit, '')
      },
      set(val: string) {
        this.inputValue = val + this.unit
      },
    },
    unit: {
      get() {
        return this.inputValue.replace(/[0-9]+/g, '')
      },
      set(val: string) {
        this.inputValue = this.timeValue + val
      },
    },
  },
})
</script>
