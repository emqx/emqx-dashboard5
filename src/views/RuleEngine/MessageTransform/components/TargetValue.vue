<template>
  <el-input
    v-if="canSetSubTarget(targetValue.targetBelong)"
    class="input-target-value"
    v-model="targetValue.targetValue"
    :readonly="isExpression"
  >
    <template #prepend>
      <el-select v-model="targetValue.targetBelong" @change="handleBelongChanged">
        <el-option v-for="item in targetBelongOpts" :key="item" :label="item" :value="item" />
      </el-select>
    </template>
    <template #suffix v-if="isExpression">
      <el-button link type="primary" @click="openContentDialog">
        {{ t('Base.edit') }}
      </el-button>
    </template>
  </el-input>
  <el-select v-else v-model="targetValue.targetBelong">
    <el-option v-for="item in targetBelongOpts" :key="item" :label="item" :value="item" />
  </el-select>
  <SQLContentDialog
    v-model="showSQLContentDialog"
    :sql="targetValue.targetValue"
    @submit="handleSQLContentDialogSubmitted"
  />
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref } from 'vue'
import {
  useMessageTransformForm,
  TARGET_EXPRESSION,
} from '@/hooks/Rule/transform/useMessageTransform'
import SQLContentDialog from '../../components/SQLContentDialog.vue'
import useI18nTl from '@/hooks/useI18nTl'

const { targetBelongOpts } = useMessageTransformForm()

type TargetValue = { targetBelong: string; targetValue?: string } & unknown

const props = defineProps<{
  modelValue: TargetValue
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: TargetValue): void
}>()

const { t } = useI18nTl('RuleEngine')

const targetValue = computed({
  get: () => props.modelValue,
  set: (val: TargetValue) => {
    emit('update:modelValue', val)
  },
})

const { canSetSubTarget } = useMessageTransformForm()

const handleBelongChanged = (val: string) => {
  if (!canSetSubTarget(val) && targetValue.value.targetValue) {
    targetValue.value.targetValue = ''
  }
}

const isExpression = computed(() => targetValue.value.targetBelong === TARGET_EXPRESSION)

const showSQLContentDialog = ref(false)

const openContentDialog = () => {
  showSQLContentDialog.value = true
}
const handleSQLContentDialogSubmitted = (sql: string) => {
  targetValue.value.targetValue = sql
}
</script>

<style lang="scss"></style>
