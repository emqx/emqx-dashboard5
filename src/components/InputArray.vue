<template>
  <el-input
    class="input-array"
    v-model.trim="inputValue"
    type="textarea"
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
