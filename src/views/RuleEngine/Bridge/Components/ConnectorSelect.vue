<template>
  <el-select v-model="selected">
    <el-option v-for="{ id, name } in connectorOpts" :label="name" :value="id" :key="id" />
  </el-select>
</template>

<script lang="ts" setup>
import { getConnectors } from '@/api/connector'
import { BridgeType } from '@/types/enum'
import { Connector } from '@/types/rule'
import { computed, defineEmits, defineProps, ref } from 'vue'

const props = defineProps<{
  modelValue: string
  type: BridgeType
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selected = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const totalConnectorList = ref<Array<Connector>>([])
;(async () => {
  try {
    totalConnectorList.value = await getConnectors()
  } catch (error) {
    //
  }
})()

const connectorOpts = computed(() => {
  if (!props.type) {
    return []
  }
  return totalConnectorList.value.filter((item) => item.type === props.type)
})
</script>
