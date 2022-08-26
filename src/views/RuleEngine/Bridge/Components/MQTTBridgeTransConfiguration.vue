<template>
  <el-form-item :prop="getProp('topic')">
    <template #label>
      <!-- <label>{{ isIngress ? tl('localTopic') : tl('remoteTopic') }}</label> -->
      <label>{{ t('Base.topic') }}</label>
      <InfoTooltip :content="tl(isIngress ? 'mqttSourceLocalTopicLabel' : 'remoteTopicDesc')" />
    </template>
    <el-input v-model="config.topic" />
    <!-- :placeholder="isIngress ? tl('remoteTopicPlaceholder') : ''" -->
  </el-form-item>
  <el-form-item label="QoS">
    <el-select v-model="config.qos">
      <el-option v-for="qos in QoSOptions" :key="qos" :value="qos" />
    </el-select>
  </el-form-item>
  <el-form-item label="Retain">
    <el-checkbox :label="'Retain'" border v-model="config.retain" />
  </el-form-item>
  <el-row :gutter="26">
    <el-col :span="24">
      <el-form-item>
        <template #label>
          <label>{{ tl('payload') }}</label>
          <i18n-t class="payload-desc" keypath="RuleEngine.payloadDesc" tag="p" scope="global">
            <a :href="docMap.bridgePayload" target="_blank">{{ tl('payloadTempSyntax') }}</a>
          </i18n-t>
        </template>
        <div class="monaco-container">
          <Monaco
            :id="createRandomString()"
            v-model="config.payload"
            lang="json"
            json-without-validate
            :disabled="disabled"
          />
        </div>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { QoSOptions } from '@/common/constants'
import { createRandomString } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import Monaco from '@/components/Monaco.vue'
import useDocLink from '@/hooks/useDocLink'
import useI18nTl from '@/hooks/useI18nTl'
import { MQTTBridgeDirection } from '@/types/enum'
import { computed, defineEmits, defineProps, PropType } from 'vue'
import { MQTTBridgeTransConfiguration } from '@/types/rule'

const props = defineProps({
  modelValue: {
    type: Object as PropType<MQTTBridgeTransConfiguration>,
    required: true,
  },
  disabled: {
    type: Boolean,
  },
  path: {
    type: String,
  },
  direction: {
    type: String as PropType<MQTTBridgeDirection>,
  },
})

const emit = defineEmits(['update:modelValue'])

const { tl, t } = useI18nTl('RuleEngine')
const { docMap } = useDocLink()

const config = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const isIngress = computed(() => props.direction === MQTTBridgeDirection.In)

const getProp = (key: string) => (props.path ? '' : `${props.path}.${key}`)
</script>

<style class="scss">
.payload-desc {
  margin: 8px 0;
  color: var(--el-text-color-secondary);
}
</style>
