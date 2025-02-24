<template>
  <el-row class="mqtt-bridge-trans-configuration" :gutter="26">
    <el-col :span="colSpan">
      <CustomFormItem :prop="getProp('topic')" :readonly="readonly">
        <template #label>
          <label>{{ t('Base.topic') }}</label>
          <InfoTooltip :content="topicDesc" />
        </template>
        <el-input v-model="config.topic" />
      </CustomFormItem>
    </el-col>
    <el-col :span="colSpan">
      <CustomFormItem label="QoS" :readonly="readonly">
        <el-select v-model="config.qos" :placeholder="tl('selectOrInput')" filterable allow-create>
          <el-option v-for="qos in QoSOptions" :key="qos" :value="qos" />
        </el-select>
      </CustomFormItem>
    </el-col>
    <el-col :span="colSpan">
      <CustomFormItem label="Retain" :readonly="readonly">
        <el-select
          v-model="config.retain"
          :placeholder="tl('selectOrInput')"
          filterable
          allow-create
        >
          <el-option label="true" :value="true" />
          <el-option label="false" :value="false" />
          <el-option label="${flags.retain}" value="${flags.retain}" />
        </el-select>
      </CustomFormItem>
    </el-col>
    <el-col :span="12" />
    <el-col :span="colSpan">
      <el-form-item>
        <template #label>
          <label>{{ tl('payload') }}</label>
          <InfoTooltip
            :content="`${putDescInTooltip ? tl('payloadDesc') + ' ' : ''}${tl('payloadExample')}`"
          />
          <p class="payload-desc" v-if="!putDescInTooltip">{{ tl('payloadDesc') }}</p>
        </template>
        <div class="monaco-container">
          <Monaco
            :id="createRandomString()"
            v-model="config.payload"
            lang="json"
            json-without-validate
            :disabled="readonly || disabled"
          />
        </div>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { QoSOptions as defaultQoSOptions } from '@/common/constants'
import { createRandomString } from '@/common/tools'
import { MQTTBridgeTransConfiguration } from '@/types/rule'

const props = defineProps({
  modelValue: {
    type: Object as PropType<MQTTBridgeTransConfiguration>,
    required: true,
  },
  path: {
    type: String,
  },
  topicDesc: {
    type: String,
    default: '',
  },
  putDescInTooltip: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
  },
  disabled: {
    type: Boolean,
  },
  colSpan: {
    type: Number,
    default: 24,
  },
})

const emit = defineEmits(['update:modelValue'])

const { tl, t } = useI18nTl('RuleEngine')

const QoSOptions = [...defaultQoSOptions, '${qos}']

const config = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const getProp = (key: string) => (props.path ? `${props.path}.${key}` : key)
</script>

<style class="scss" scoped>
.payload-desc {
  margin: 8px 0;
  color: var(--el-text-color-secondary);
}
.monaco-container {
  margin-top: 12px;
  height: 200px;
}
</style>
