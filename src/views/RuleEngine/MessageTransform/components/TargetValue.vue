<template>
  <template v-if="canGetSubTarget(targetValue.targetBelong)">
    <div
      v-if="isPubPropsParent"
      class="el-input el-input-group el-input-group--prepend el-input--suffix input-target-value"
    >
      <div class="el-input-group__prepend">
        <el-cascader v-model="targetValue.targetBelong" v-bind="cascaderProps" />
      </div>
      <div class="el-input__wrapper mock-wrapper">
        <el-select v-model="targetValue.targetValue" @blur="handleBlur">
          <el-option v-for="item in pubPropsKeys" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
    </div>
    <el-input
      v-else
      class="input-target-value"
      v-model="targetValue.targetValue"
      :validate-event="false"
      :readonly="isExpression"
      @click="handleClickInput"
    >
      <template #prepend>
        <el-cascader v-model="targetValue.targetBelong" v-bind="cascaderProps" />
      </template>
      <template #suffix v-if="isExpression">
        <el-button link type="primary" @click="openContentDialog">
          {{ t('Base.edit') }}
        </el-button>
      </template>
    </el-input>
  </template>
  <el-cascader v-else v-model="targetValue.targetBelong" v-bind="cascaderProps" />
  <SQLContentDialog
    v-model="showSQLContentDialog"
    :sql="targetValue.targetValue"
    :title="tl('pleaseEnterExp')"
    @submit="handleSQLContentDialogSubmitted"
  />
</template>

<script setup lang="ts">
import {
  AvailableKey,
  TARGET_EXPRESSION,
  useMessageTransformForm,
} from '@/hooks/Rule/transform/useMessageTransform'

import SQLContentDialog from '../../components/SQLContentDialog.vue'

const { availablePropKeyMap, targetBelongOpts } = useMessageTransformForm()

type TargetValue = { targetBelong: string; targetValue?: string } & unknown

const props = defineProps<{
  modelValue: TargetValue
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: TargetValue): void
  (e: 'blur'): void
}>()

const { t, tl } = useI18nTl('RuleEngine')

const targetValue = computed({
  get: () => props.modelValue,
  set: (val: TargetValue) => {
    emit('update:modelValue', val)
  },
})

const { canGetSubTarget } = useMessageTransformForm()

const handleBelongChanged = () => {
  if (targetValue.value.targetValue) {
    targetValue.value.targetValue = ''
  }
}

const isExpression = computed(() => targetValue.value.targetBelong === TARGET_EXPRESSION)

const showSQLContentDialog = ref(false)

const openContentDialog = () => {
  showSQLContentDialog.value = true
}
const handleClickInput = () => {
  if (isExpression.value) {
    openContentDialog()
  }
}
const handleSQLContentDialogSubmitted = (sql: string) => {
  targetValue.value.targetValue = sql
}

const detectIsPubPropsParent = (value: string) => value === `${AvailableKey.PubProps}.`
const isPubPropsParent = computed(() => detectIsPubPropsParent(targetValue.value.targetBelong))
const pubPropsKeys = availablePropKeyMap.get(AvailableKey.PubProps)?.keys || []

const handleBlur = () => emit('blur')

const cascaderProps = {
  options: targetBelongOpts,
  showAllLevels: false,
  props: { emitPath: false },
  filterable: true,
  onBlur: handleBlur,
  onChange: handleBelongChanged,
}
</script>

<style lang="scss">
.input-target-value {
  .mock-wrapper {
    padding: 0;
    .el-input,
    .el-select {
      margin-right: 0;
    }
    .el-input__wrapper {
      box-shadow: none;
      background-color: transparent;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .el-input-group--prepend .el-input-group__prepend {
    width: 130px;
  }
}
</style>
