<template>
  <el-input
    v-if="canSetSubTarget(targetValue.targetBelong)"
    v-model="targetValue.targetValue"
    style="max-width: 600px"
    placeholder="Please input"
  >
    <template #prepend>
      <el-select v-model="targetValue.targetBelong">
        <el-option v-for="item in targetBelongOpts" :key="item" :label="item" :value="item" />
      </el-select>
    </template>
  </el-input>
  <el-select v-else v-model="targetValue.targetBelong">
    <el-option v-for="item in targetBelongOpts" :key="item" :label="item" :value="item" />
  </el-select>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
import { TargetBelong, useMessageTransformForm } from '@/hooks/Rule/transform/useMessageTransform'

const { targetBelongOpts } = useMessageTransformForm()

type TargetValue = { targetBelong: TargetBelong; targetValue?: string } & unknown

const props = defineProps<{
  modelValue: TargetValue
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: TargetValue): void
}>()

const targetValue = computed({
  get: () => props.modelValue,
  set: (val: TargetValue) => {
    emit('update:modelValue', val)
  },
})

const { canSetSubTarget } = useMessageTransformForm()
</script>

<style lang="scss"></style>
