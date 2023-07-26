<template>
  <el-form
    ref="FormCom"
    label-width="80px"
    class="function-block"
    label-position="right"
    hide-required-asterisk
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
      >
        <el-option v-for="item in COMMON_FIELDS" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item :label="tl('transform')" prop="func.name">
      <el-select v-model="record.func.name">
        <el-option-group
          v-for="group in funcOptList"
          :key="group.groupLabel"
          :label="group.groupLabel"
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
    <el-form-item :label="tl('alias')" prop="alias">
      <el-input v-model="record.alias" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineProps, defineEmits } from 'vue'
import useRuleFunc from '@/hooks/useRuleFunc'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('Flow')

const { funcOptList } = useRuleFunc()

const COMMON_FIELDS: Array<string> = []

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { createRequiredRule } = useFormRules()
const rules = computed(() => {
  const ret = {
    field: createRequiredRule(t('component.field')),
  }
  return ret
})
</script>

<style lang="scss">
.function-block {
  padding: 24px;
  border-radius: 8px;
  background-color: var(--color-bg-mdcode);
}
</style>
