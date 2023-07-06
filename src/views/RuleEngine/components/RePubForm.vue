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
    <el-form-item :label="$t('Base.topic')" required prop="topic">
      <el-input v-model="record.topic" />
    </el-form-item>
    <el-form-item label="QoS">
      <el-select v-model="record.qos" :placeholder="tl('selectOrInput')" filterable allow-create>
        <el-option v-for="item in QoSOptions" :value="item" :key="item" />
      </el-select>
    </el-form-item>
    <el-form-item label="Retain">
      <el-select v-model="record.retain" :placeholder="tl('selectOrInput')" filterable allow-create>
        <el-option label="true" :value="true" />
        <el-option label="false" :value="false" />
        <el-option label="${flags.retain}" value="${flags.retain}" />
      </el-select>
    </el-form-item>
    <el-form-item label="Payload">
      <template #label>
        <FormItemLabel label="Payload" :desc="`${tl('payloadDesc')} ${tl('payloadExample')}`" />
      </template>
      <div class="monaco-container">
        <Monaco
          :id="createRandomString()"
          v-model="record.payload"
          lang="json"
          json-without-validate
        />
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { QoSOptions as defaultQoSOptions } from '@/common/constants'
import { createRandomString } from '@/common/tools'
import FormItemLabel from '@/components/FormItemLabel.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineEmits, defineProps, ref } from 'vue'

const FormCom = ref()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
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

const { createRequiredRule } = useFormRules()
const rules = { topic: createRequiredRule('Topic') }

const saveConfig = () => {
  emit('save', record.value)
}
</script>

<style lang="scss"></style>
