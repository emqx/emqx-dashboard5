<template>
  <el-form
    ref="FormCom"
    label-width="150px"
    class="message-form"
    label-position="right"
    hide-required-asterisk
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
    @keyup.enter.prevent="saveConfig()"
  >
    <el-form-item :label="tl('topic')" prop="topic">
      <el-input v-model="record.topic" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { PropType, computed, defineEmits, defineExpose, defineProps, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  existedTopics: {
    type: Array as PropType<Array<string>>,
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const { t, tl } = useI18nTl('Base')

const FormCom = ref()

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
    topic: [
      ...createRequiredRule(tl('topic')),
      {
        validator(rules: any, value: string) {
          if (props.existedTopics?.includes(value)) {
            return [new Error(t('Flow.topicExistedError'))]
          }
          return []
        },
      },
    ],
  }
  return ret
})

const saveConfig = () => {
  emit('save', record.value)
}

const validate = () => FormCom.value.validate()

defineExpose({ validate })
</script>

<style lang="scss"></style>
