<template>
  <div class="mqtt-bridge-trans-configuration">
    <el-form-item :prop="getProp('topic')">
      <template #label>
        <label>{{ t('Base.topic') }}</label>
        <InfoTooltip :content="topicDesc" />
      </template>
      <el-input v-model="config.topic" />
    </el-form-item>
    <el-form-item label="QoS">
      <el-select v-model="config.qos" :placeholder="tl('selectOrInput')" filterable allow-create>
        <el-option v-for="qos in QoSOptions" :key="qos" :value="qos" />
      </el-select>
    </el-form-item>
    <el-form-item label="Retain">
      <el-select v-model="config.retain" :placeholder="tl('selectOrInput')" filterable allow-create>
        <el-option label="true" :value="true" />
        <el-option label="false" :value="false" />
        <el-option label="${flags.retain}" value="${flags.retain}" />
      </el-select>
    </el-form-item>
    <el-row :gutter="26">
      <el-col :span="24">
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
            />
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { QoSOptions as defaultQoSOptions } from '@/common/constants'
import { createRandomString } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import Monaco from '@/components/Monaco.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineEmits, defineProps, PropType } from 'vue'
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
