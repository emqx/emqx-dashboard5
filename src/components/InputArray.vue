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
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      inputValue: '',
    }
  },
  methods: {
    handleBlur() {
      this.$emit('input', this.inputValue.split(','))
    },
  },
  created() {
    this.inpputValue = this.value.join(',')
  },
})
</script>
