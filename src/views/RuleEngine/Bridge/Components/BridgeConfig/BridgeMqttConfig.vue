<template>
  <div class="bridge-config">
    <el-form
      ref="formCom"
      label-position="top"
      :model="mqttBridgeVal"
      :rules="formRules"
      :disabled="disabled"
    >
      <template v-if="!disabled">
        <el-row :gutter="26">
          <el-col :span="12">
            <el-form-item :label="tl('name')" required prop="name">
              <el-input v-model="mqttBridgeVal.name" :disabled="edit" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
      </template>
      <!-- Source -->
      <template v-if="mqttBridgeVal.direction === MQTTBridgeDirection.In">
        <el-row :gutter="26">
          <el-col :span="24">
            <ConnectorMqttConfig
              v-model="mqttBridgeVal.connector"
              connector-field="connector"
              :edit="edit"
            />
          </el-col>
        </el-row>
        <el-divider />
        <el-row :gutter="26">
          <el-col :span="12">
            <el-form-item required prop="remote_topic">
              <template #label>
                <label>{{ $t('Base.topic') }}</label>
                <InfoTooltip :content="tl('mqttSourceRemoteTopicDesc')" />
              </template>
              <el-input v-model="mqttBridgeVal.remote_topic" placeholder="t/#" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="QoS">
              <el-select v-model="mqttBridgeVal.remote_qos">
                <el-option v-for="qos in QoSOptions" :key="qos" :value="qos" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <!-- Sink -->
      <template v-else>
        <el-row :gutter="26">
          <el-col :span="24">
            <ConnectorMqttConfig
              v-model="mqttBridgeVal.connector"
              connector-field="connector"
              :edit="edit"
            />
          </el-col>
        </el-row>
        <el-divider />
        <el-row :gutter="26">
          <el-col :span="12">
            <el-form-item required prop="remote_topic">
              <template #label>
                <label>{{ $t('Base.topic') }}</label>
                <InfoTooltip :content="tl('remoteTopicDesc')" />
              </template>
              <el-input
                v-model="mqttBridgeVal.remote_topic"
                :placeholder="tl('remoteTopicPlaceholder')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="QoS">
              <el-select v-model="mqttBridgeVal.remote_qos">
                <el-option v-for="qos in QoSOptions" :key="qos" :value="qos" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Retain">
              <el-checkbox :label="'Retain'" border v-model="mqttBridgeVal.retain" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row v-if="isShowPayload">
        <el-col :span="24">
          <el-form-item>
            <template #label>
              <label>{{ tl('payload') }}</label>
              <i18n-t class="payload-desc" keypath="RuleEngine.payloadDesc" tag="p">
                <a :href="docMap.bridgePayload" target="_blank">{{ tl('payloadTempSyntax') }}</a>
              </i18n-t>
            </template>
            <div class="monaco-container">
              <Monaco
                :id="createRandomString()"
                v-model="mqttBridgeVal.payload"
                lang="json"
                json-without-validate
                :disabled="disabled"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'BridgeMqttConfig',
})
</script>

<script lang="ts" setup>
import { defineProps, onMounted, ref, PropType, watch, defineEmits, Ref, defineExpose } from 'vue'
import _ from 'lodash'
import { MQTTIn, MQTTOut } from '@/types/rule'
import { QoSOptions } from '@/common/constants'
import InfoTooltip from '@/components/InfoTooltip.vue'
import Monaco from '@/components/Monaco.vue'
import { createRandomString } from '@/common/tools'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { MQTTBridgeDirection } from '@/types/enum'
import useDocLink from '@/hooks/useDocLink'
import useSSL from '@/hooks/useSSL'
import ConnectorMqttConfig from '@/views/RuleEngine/Connector/ConnectorMqttConfig.vue'

type MQTTBridge = MQTTIn | MQTTOut

const prop = defineProps({
  modelValue: {
    type: Object as PropType<MQTTBridge>,
    required: false,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  edit: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])

const { createSSLForm } = useSSL()

const mqttBridgeDefaultVal = {
  name: '',
  connector: {
    ssl: createSSLForm(),
  },
  direction: MQTTBridgeDirection.Out,
  retain: false,
  payload: '${payload}',
  remote_topic: '',
  remote_qos: 1,
  local_qos: 1,
}

let modelValueCache = ''
const mqttBridgeVal: Ref<MQTTBridge> = ref({
  payload: '',
} as MQTTBridge)

const { tl, t } = useI18nTl('RuleEngine')
const { docMap } = useDocLink()

const { createRequiredRule } = useFormRules()
const formCom = ref()
const formRules = computed(() => ({
  name: createRequiredRule(tl('name')),
  connector: {
    server: createRequiredRule(tl('brokerAddress')),
  },
  remote_topic: createRequiredRule(t('Base.topic')),
}))

const isShowPayload = computed(() => mqttBridgeVal.value.direction !== MQTTBridgeDirection.In)

const initMqttBridgeVal = async () => {
  mqttBridgeVal.value = {
    ..._.cloneDeep(mqttBridgeDefaultVal),
    ..._.cloneDeep(prop.modelValue),
  }
}

const transformData = (val: MQTTBridge) => {
  let data = {
    ..._.cloneDeep(val),
  }
  if (val.direction === MQTTBridgeDirection.Out) {
    Reflect.deleteProperty(data, 'local_qos')
  }
  return data
}

const updateModelValue = (val: MQTTBridge) => {
  const value = transformData(val)
  modelValueCache = JSON.stringify(value)
  emit('update:modelValue', value)
}

const validate = () => {
  return formCom.value.validate()
}

const clearValidate = () => {
  return formCom.value?.clearValidate()
}

watch(() => _.cloneDeep(mqttBridgeVal.value), updateModelValue)

watch(
  () => prop.modelValue,
  (val) => {
    if (JSON.stringify(val) !== modelValueCache) {
      initMqttBridgeVal()
    }
  },
)

initMqttBridgeVal()

onMounted(() => {
  updateModelValue(mqttBridgeVal.value)
})

defineExpose({ validate, clearValidate })
</script>

<style lang="scss" scoped>
@import '@/style/rule.scss';
.monaco-container {
  margin-top: 12px;
  height: 200px;
}
.payload-desc {
  margin: 8px 0;
  color: var(--el-text-color-secondary);
}
</style>
