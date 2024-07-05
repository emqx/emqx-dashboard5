<template>
  <template v-if="canGetSubTarget(targetValue.targetBelong)">
    <div
      v-if="isPubPropsParent"
      class="el-input el-input-group el-input-group--prepend el-input--suffix input-target-value"
    >
      <div class="el-input-group__prepend">
        <el-cascader
          v-model="targetValue.targetBelong"
          :options="targetBelongOpts"
          :show-all-levels="false"
          :props="{ emitPath: false }"
          @change="handleBelongChanged"
        />
      </div>
      <div class="el-input__wrapper mock-wrapper">
        <el-select v-model="targetValue.targetValue">
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
        <el-cascader
          v-model="targetValue.targetBelong"
          :options="targetBelongOpts"
          :show-all-levels="false"
          :props="{ emitPath: false }"
          @change="handleBelongChanged"
        />
      </template>
      <template #suffix v-if="isExpression">
        <el-button link type="primary" @click="openContentDialog">
          {{ t('Base.edit') }}
        </el-button>
      </template>
    </el-input>
  </template>

  <el-cascader
    v-else
    v-model="targetValue.targetBelong"
    :options="targetBelongOpts"
    :show-all-levels="false"
    :props="{ emitPath: false }"
  />
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
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineEmits, defineProps, ref } from 'vue'
import SQLContentDialog from '../../components/SQLContentDialog.vue'

const { availablePropKeyMap, targetBelongOpts } = useMessageTransformForm()

type TargetValue = { targetBelong: string; targetValue?: string } & unknown

const props = defineProps<{
  modelValue: TargetValue
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: TargetValue): void
}>()

const { t, tl } = useI18nTl('RuleEngine')

const targetValue = computed({
  get: () => props.modelValue,
  set: (val: TargetValue) => {
    emit('update:modelValue', val)
  },
})

const { canGetSubTarget } = useMessageTransformForm()

const handleBelongChanged = (val: string) => {
  if (!canGetSubTarget(val) && targetValue.value.targetValue) {
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

const isPubPropsParent = computed(
  () => targetValue.value.targetBelong === `${AvailableKey.PubProps}.`,
)
const pubPropsKeys = availablePropKeyMap.get(AvailableKey.PubProps)?.keys || []
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
}
</style>
