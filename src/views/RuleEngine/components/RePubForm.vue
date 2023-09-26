<template>
  <el-form
    ref="FormCom"
    label-width="120px"
    class="message-form"
    label-position="right"
    hide-required-asterisk
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
    @keyup.enter="saveConfig()"
  >
    <CustomFormItem :label="$t('Base.topic')" required prop="args.topic" :readonly="readonly">
      <el-input v-model="record.args.topic" />
    </CustomFormItem>
    <CustomFormItem label="QoS" :readonly="readonly">
      <el-select
        v-model="record.args.qos"
        :placeholder="tl('selectOrInput')"
        filterable
        allow-create
      >
        <el-option v-for="item in QoSOptions" :value="item" :key="item" />
      </el-select>
    </CustomFormItem>
    <CustomFormItem label="Retain" :readonly="readonly">
      <el-select
        v-model="record.args.retain"
        :placeholder="tl('selectOrInput')"
        filterable
        allow-create
      >
        <el-option label="true" :value="true" />
        <el-option label="false" :value="false" />
        <el-option label="${flags.retain}" value="${flags.retain}" />
      </el-select>
    </CustomFormItem>
    <CustomFormItem label="Payload">
      <template #label>
        <FormItemLabel label="Payload" :desc="`${tl('payloadDesc')} ${tl('payloadExample')}`" />
      </template>
      <div class="monaco-container">
        <Monaco
          v-model="record.args.payload"
          lang="json"
          json-without-validate
          :disabled="readonly"
          :id="createRandomString()"
        />
      </div>
    </CustomFormItem>
  </el-form>
</template>

<script setup lang="ts">
import { QoSOptions as defaultQoSOptions } from '@/common/constants'
import { createRandomString } from '@/common/tools'
import CustomFormItem from '@/components/CustomFormItem.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import Monaco from '@/components/Monaco.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineEmits, defineExpose, defineProps, ref } from 'vue'

const FormCom = ref()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const { tl } = useI18nTl('RuleEngine')

const QoSOptions = [...defaultQoSOptions, '${qos}']

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { createRequiredRule, createMqttPublishTopicRule } = useFormRules()
const rules = { 'args.topic': [...createRequiredRule('Topic'), ...createMqttPublishTopicRule()] }

const saveConfig = () => {
  emit('save', record.value)
}

const validate = () => FormCom.value.validate()

defineExpose({ validate })
</script>

<style lang="scss"></style>
