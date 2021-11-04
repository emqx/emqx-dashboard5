<template>
  <el-input class="time-input-with-unit-select" v-model.number.trim="timeValue">
    <template #append>
      <el-select v-model="unit">
        <el-option value="s" label="s" />
        <el-option value="ms" label="ms" />
      </el-select>
    </template>
  </el-input>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TimeInputWithUnitSelect",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    timeValue: {
      get() {
        return this.inputValue.replace(this.unit, "");
      },
      set(val) {
        this.inputValue = val + this.unit;
      },
    },
    unit: {
      get() {
        return this.inputValue.slice(-2) === "ms" ? "ms" : "s";
      },
      set(val) {
        this.inputValue = this.timeValue + val;
      },
    },
  },
});
</script>
