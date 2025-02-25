<template>
  <el-form
    ref="FormCom"
    label-width="100px"
    class="message-form"
    label-position="right"
    hide-required-asterisk
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
    @keyup.enter.prevent="saveConfig()"
    @submit.prevent
  >
    <CustomFormItem prop="topic" :label="tl('topic')" :readonly="readonly">
      <el-input v-model="record.topic" />
    </CustomFormItem>
  </el-form>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  existedTopics: {
    type: Array as PropType<Array<string>>,
  },
  readonly: {
    type: Boolean,
    default: false,
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

const { createRequiredRule, createMqttSubscribeTopicRule } = useFormRules()
const rules = computed(() => {
  const ret = {
    topic: [
      ...createRequiredRule(tl('topic')),
      ...createMqttSubscribeTopicRule(),
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
