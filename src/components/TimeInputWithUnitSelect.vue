<template>
  <el-input class="time-input-with-unit-select" v-model.number.trim="timeValue">
    <template #append>
      <el-select v-model="unit">
        <el-option value="h" :label="$t('Base.hour')" />
        <el-option value="m" :label="$t('Base.minute')" />
        <el-option value="s" :label="$t('Base.second')" />
        <el-option value="ms" :label="$t('Base.milliseconds')" />
      </el-select>
    </template>
  </el-input>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TimeInputWithUnitSelect',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  computed: {
    inputValue: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
    timeValue: {
      get() {
        return this.inputValue.replace(this.unit, '')
      },
      set(val) {
        this.inputValue = val + this.unit
      },
    },
    unit: {
      get() {
        return this.inputValue.replace(/[0-9]+/g, '')
      },
      set(val) {
        this.inputValue = this.timeValue + val
      },
    },
  },
})
</script>
