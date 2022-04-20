<template>
  <el-select class="DTLS-version-select" v-model="selected" multiple>
    <el-option v-for="item in versionOptions" :key="item" :value="item" :label="item" />
  </el-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DTLSVersionSelect',
})
</script>

<script setup lang="ts">
import { defineProps, computed, PropType, WritableComputedRef, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<string>>,
  },
})
const emit = defineEmits(['update:modelValue'])

const versionOptions = ['dtlsv1.2', 'dtlsv1']

const selected: WritableComputedRef<Array<string>> = computed({
  get() {
    return props.modelValue || []
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>
