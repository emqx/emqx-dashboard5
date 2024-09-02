<template>
  <el-form
    ref="FormCom"
    class="message-form"
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
    :class="{ 'label-align-right': isUsingInFlow }"
    v-bind="formProps"
    @keyup.enter="saveConfig()"
  >
    <el-row :gutter="26">
      <el-col :span="getColSpan(10)">
        <CustomFormItem :label="$t('Base.topic')" required prop="args.topic" :readonly="readonly">
          <el-input v-model="record.args.topic" />
        </CustomFormItem>
      </el-col>
      <el-col :span="getColSpan(6)">
        <CustomFormItem label="QoS" :readonly="readonly">
          <SelectAllowInput v-model="record.args.qos" :options="QoSOptions" />
        </CustomFormItem>
      </el-col>
      <el-col :span="getColSpan(6)">
        <CustomFormItem label="Retain" :readonly="readonly">
          <SelectAllowInput v-model="record.args.retain" :options="retainOptions" />
        </CustomFormItem>
      </el-col>
      <el-col :span="24">
        <CustomFormItem label="Payload">
          <template #label>
            <FormItemLabel
              v-if="isUsingInFlow"
              label="Payload"
              :desc="`${tl('payloadDesc')} ${tl('payloadExample')}`"
            />
            <template v-else>
              <FormItemLabel label="Payload" :desc="`${tl('payloadDesc')}`" />
              <p class="payload-desc">{{ tl('payloadDesc') }}</p>
            </template>
          </template>
          <div class="monaco-container">
            <Monaco
              v-model="record.args.payload"
              lang="json"
              json-without-validate
              :disabled="readonly"
              :id="createRandomString()"
              :completion-provider="completionProvider"
              @keyup.stop
            />
          </div>
        </CustomFormItem>
      </el-col>
      <el-col :span="getColSpan(24)">
        <CustomFormItem :label="tl('pubProp')">
          <el-switch v-model="showPubProps" @change="togglePubPropsEnabled" :disabled="readonly" />
        </CustomFormItem>
      </el-col>
    </el-row>
    <el-collapse-transition>
      <PubProps
        v-if="showPubProps"
        v-model="record.args.mqtt_properties"
        path="record.args.mqtt_properties"
        :span="getColSpan()"
        :readonly="readonly"
        is-repub
      />
    </el-collapse-transition>
    <el-row :gutter="26">
      <el-col :span="getColSpan(24)">
        <CustomFormItem>
          <template #label>
            <FormItemLabel
              :label="tl('directDispatch')"
              :desc="tl('directDispatchDesc')"
              desc-marked
            />
          </template>
          <el-switch v-model="record.args.direct_dispatch" :disabled="readonly" />
        </CustomFormItem>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { QoSOptions as defaultQoSOptions } from '@/common/constants'
import { createRandomString } from '@/common/tools'
import CustomFormItem from '@/components/CustomFormItem.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import SelectAllowInput from '@/components/SelectAllowInput.vue'
import Monaco from '@/components/Monaco.vue'
import { useAvailableProviders } from '@/hooks/Rule/useProvidersForMonaco'
import useSQLAvailablePlaceholder from '@/hooks/Rule/useSQLAvailablePlaceholder'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { RuleEngineBuiltinActionRepublish } from '@/types/schemas/rules.schemas'
import { FormProps } from 'element-plus'
import PubProps from './PubProps.vue'
import type { ComputedRef, PropType } from 'vue'
import { computed, defineEmits, defineExpose, defineProps, ref } from 'vue'

type RePubForm = RuleEngineBuiltinActionRepublish | any

const FormCom = ref()

const props = defineProps({
  modelValue: {
    type: Object as PropType<RePubForm>,
    default: () => ({}),
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  isUsingInFlow: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const { tl } = useI18nTl('RuleEngine')

const withPubProps = (record: RePubForm): boolean => {
  const { mqtt_properties, user_properties } = record.args
  return (
    !!user_properties ||
    (mqtt_properties && Object.entries(mqtt_properties).some(([, value]) => !!value))
  )
}

const showPubProps = ref(withPubProps(props.modelValue))
const togglePubPropsEnabled = (val: string | number | boolean) => {
  if (val === false) {
    const { mqtt_properties } = record.value.args
    record.value.args.user_properties = ''
    if (typeof mqtt_properties === 'object') {
      Object.keys(mqtt_properties).forEach((key) => (mqtt_properties[key] = ''))
    }
  }
}

const { availablePlaceholders } = useSQLAvailablePlaceholder()
const { completionProvider } = useAvailableProviders()

const QoSOptions = [...defaultQoSOptions, '${qos}', ...availablePlaceholders.value]

const retainOptions = [true, false, '${flags.retain}', ...availablePlaceholders.value]

const record = computed({
  get() {
    return { mqtt_properties: {}, ...props.modelValue }
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

const formProps: ComputedRef<Partial<FormProps>> = computed(() => {
  if (props.isUsingInFlow) {
    return {
      labelWidth: '120px',
      labelPosition: 'right',
      hideRequiredAsterisk: true,
    }
  }
  return {
    labelPosition: 'top',
  }
})

const getColSpan = (spanOriginal?: number) => (props.isUsingInFlow ? 24 : spanOriginal || 12)

const validate = () => FormCom.value.validate()

defineExpose({ validate })
</script>

<style lang="scss">
.message-form {
  &.label-align-right {
    .el-form-item__label {
      text-align: right;
    }
  }
}
.option-label {
  float: left;
}

.option-description {
  float: right;
  color: var(--color-text-secondary);
  font-size: 13px;
}
</style>
