<template>
  <el-input
    class="input-array"
    v-model.trim="inputValue"
    type="textarea"
    :disabled="disabled"
    @blur="handleBlur"
  ></el-input>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InputArray',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputValue: '',
    }
  },
  watch: {
    modelValue(val) {
      this.inputValue = val.join(',')
    },
  },
  methods: {
    handleBlur() {
      this.$emit('update:modelValue', this.inputValue.split(','))
    },
  },
})
</script>
