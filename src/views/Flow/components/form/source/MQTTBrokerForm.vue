<template>
  <el-form
    ref="FormCom"
    label-width="240px"
    class="mqtt-broker-form"
    label-position="right"
    hide-required-asterisk
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
    @keyup.enter="saveConfig()"
  ></el-form>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, defineEmits } from 'vue'

const FormCom = ref()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const rules = {}

const saveConfig = () => {
  emit('save', record.value)
}
</script>

<style lang="scss"></style>
