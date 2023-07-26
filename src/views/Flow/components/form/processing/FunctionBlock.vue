<template>
  <el-form
    ref="FormCom"
    label-width="80px"
    class="function-block"
    label-position="right"
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
  >
    <el-form-item :label="t('components.field')" prop="field">
      <el-select
        v-model="record.field"
        filterable
        allow-create
        default-first-option
        :reserve-keyword="false"
        @change="handleFieldChanged"
      >
        <el-option v-for="item in COMMON_FIELDS" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('Flow.transform')" prop="func.name">
      <el-select filterable clearable v-model="record.func.name" @change="handleSelectFunc">
        <el-option-group
          v-for="group in funcOptList"
          :key="group.groupLabel"
          :label="tl(group.groupLabel)"
        >
          <el-option
            v-for="item in group.list"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-option-group>
      </el-select>
    </el-form-item>
    <div class="args-block" v-if="showArgsBlock">
      <el-form-item
        v-for="(item, $index) in args"
        :key="`${record.func.name}-${item.name}`"
        :label="item.name"
        :prop="`func.args.${$index}`"
        label-width="120px"
      >
        <el-input v-model="record.func.args[$index]" />
      </el-form-item>
    </div>
    <el-form-item :label="t('Flow.alias')" prop="alias">
      <el-input v-model="record.alias" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import useRuleFunc, { ArgItem } from '@/hooks/useRuleFunc'
import { FormRules } from '@/types/common'
import { computed, defineEmits, defineProps, ref, Ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('Function')

const { funcOptList, getFuncItemByName } = useRuleFunc()

const COMMON_FIELDS: Array<string> = []

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const args: Ref<Array<ArgItem>> = ref([])
const showArgsBlock = ref(false)
const handleSelectFunc = (funcName: string) => {
  if (!funcName) {
    args.value = []
    showArgsBlock.value = false
    record.value.func.args = []
    return
  }
  const func = getFuncItemByName(funcName)
  if (!func) {
    return
  }
  args.value = func.args
  showArgsBlock.value = !(args.value.length === 1 && args.value[0].required)
  if (showArgsBlock.value) {
    record.value.func.args = new Array(args.value.length).fill('')
  } else {
    record.value.func.args = [record.value.field]
  }
}

const { createRequiredRule } = useFormRules()
const rules = computed(() => {
  const ret: FormRules = { field: createRequiredRule(t('component.field')) }
  args.value.forEach((item, index) => {
    if (item.required) {
      // TODO:replace name to label
      ret[`func.args.${index}`] = createRequiredRule(item.name)
    }
  })
  return ret
})
</script>

<style lang="scss">
.function-block {
  padding: 24px;
  border-radius: 8px;
  background-color: var(--color-bg-mdcode);

  .args-block {
    // same as label width
    margin-left: 80px;
    margin-right: 40px;
    margin-bottom: 16px;
    padding: 16px;
    border-radius: 8px;
    background-color: var(--color-bg-main);
  }
}
</style>
