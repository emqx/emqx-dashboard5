<template>
  <div class="bridge-config">
    <el-form
      ref="formCom"
      label-position="top"
      :model="mqttBridgeVal"
      :rules="formRules"
      :validate-on-rule-change="false"
    >
      <el-row :gutter="26">
        <el-col :span="12">
          <el-form-item :label="tl('name')" required prop="name">
            <el-input v-model="mqttBridgeVal.name" :disabled="edit" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider />
      <el-row :gutter="26">
        <el-col :span="24">
          <ConnectorMqttConfig v-model="mqttBridgeVal" :edit="edit" />
        </el-col>
      </el-row>
      <div class="direction">
        <label>{{ tl('ingress') }}</label>
        <InfoTooltip :content="tl('ingressHelp')" />
        <p class="payload-desc">{{ tl('ingressDesc') }}</p>
        <el-switch v-model="enableIngress" />
        <el-collapse-transition>
          <el-row v-show="enableIngress" class="direction-body" :gutter="26">
            <el-col :span="12">
              <label>{{ tl('remoteBroker') }}</label>
              <el-card class="with-border" shadow="never">
                <el-form-item :prop="['ingress', 'remote', 'topic']" :required="enableIngress">
                  <template #label>
                    <label>{{ t('Base.topic') }}</label>
                    <InfoTooltip :content="tl('ingressRemoteTopicDesc')" />
                  </template>
                  <el-input v-model="mqttBridgeVal.ingress.remote.topic" placeholder="t/#" />
                </el-form-item>
                <el-form-item label="QoS">
                  <el-select v-model="mqttBridgeVal.ingress.remote.qos">
                    <el-option v-for="qos in QoSOptions" :key="qos" :value="qos" />
                  </el-select>
                </el-form-item>
              </el-card>
            </el-col>
            <el-col :span="12">
              <label>{{ tl('localBroker') }}</label>
              <el-card class="with-border" shadow="never">
                <MQTTBridgeTransConfiguration
                  v-model="mqttBridgeVal.ingress.local"
                  path="ingress.locale"
                  :direction="MQTTBridgeDirection.In"
                  :topic-desc="tl('ingressLocalTopicDesc')"
                />
              </el-card>
            </el-col>
          </el-row>
        </el-collapse-transition>
      </div>
      <div class="direction">
        <label>{{ tl('egress') }}</label>
        <InfoTooltip :content="tl('egressHelp')" />
        <p class="payload-desc">{{ tl('egressDesc') }}</p>
        <el-switch v-model="enableEgress" />
        <el-collapse-transition>
          <el-row v-show="enableEgress" class="direction-body" :gutter="26">
            <el-col :span="12">
              <label>{{ tl('remoteBroker') }}</label>
              <el-card class="with-border" shadow="never">
                <MQTTBridgeTransConfiguration
                  v-model="mqttBridgeVal.egress.remote"
                  path="egress.remote"
                  :direction="MQTTBridgeDirection.Out"
                  :topic-desc="tl('egressRemoteTopicDesc')"
                />
              </el-card>
            </el-col>
            <el-col :span="12">
              <label>{{ tl('localBroker') }}</label>
              <el-card class="with-border" shadow="never">
                <el-form-item :prop="['egress', 'local', 'topic']">
                  <template #label>
                    <label>{{ t('Base.topic') }}</label>
                    <InfoTooltip :content="tl('egressLocalTopicDesc')" />
                  </template>
                  <el-input v-model="mqttBridgeVal.egress.local.topic" placeholder="t/#" />
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>
        </el-collapse-transition>
      </div>
      <el-divider />
      <el-row :gutter="26">
        <BridgeResourceOpt v-model="mqttBridgeVal.resource_opts" />
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { fillEmptyValueToUndefinedField } from '@/common/tools'

export default defineComponent({
  name: 'BridgeMqttConfig',
})
</script>

<script lang="ts" setup>
import {
  defineProps,
  onMounted,
  ref,
  PropType,
  watch,
  defineEmits,
  Ref,
  defineExpose,
  computed,
} from 'vue'
import _ from 'lodash'
import { MQTTBridge } from '@/types/rule'
import { QoSOptions } from '@/common/constants'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { MQTTBridgeDirection } from '@/types/enum'
import useSSL from '@/hooks/useSSL'
import ConnectorMqttConfig from '@/views/RuleEngine/Connector/ConnectorMqttConfig.vue'
import MQTTBridgeTransConfiguration from '../MQTTBridgeTransConfiguration.vue'
import BridgeResourceOpt from './BridgeResourceOpt.vue'
import useResourceOpt from '@/hooks/Rule/bridge/useResourceOpt'

const props = defineProps({
  modelValue: {
    type: Object as PropType<MQTTBridge>,
    required: false,
    default: () => ({}),
  },
  edit: {
    type: Boolean,
    default: false,
  },
  copy: {
    type: Boolean,
  },
})
const emit = defineEmits(['update:modelValue', 'init'])

const { createSSLForm } = useSSL()

const createRawTransDefaultVal = () => ({
  topic: '',
  qos: 1,
  payload: '${payload}',
  retain: false,
})

const createIngressDefaultVal = () => ({
  remote: {
    topic: '',
    qos: 1,
  },
  local: createRawTransDefaultVal(),
})
const createEgressDefaultValue = () => ({
  local: {
    topic: '',
  },
  remote: createRawTransDefaultVal(),
})

const { createDefaultResourceOptsForm } = useResourceOpt()

const createMQTTBridgeDefaultVal = () => ({
  enable: true,
  server: '',
  proto_ver: 'v4',
  username: '',
  password: '',
  ssl: createSSLForm(),
  ingress: createIngressDefaultVal(),
  egress: createEgressDefaultValue(),
  resource_opts: createDefaultResourceOptsForm({ inflight: true }),
})

const mqttBridgeVal: Ref<MQTTBridge> = ref(createMQTTBridgeDefaultVal() as any)
const enableIngress = ref(false)
const enableEgress = ref(false)

const { tl, t } = useI18nTl('RuleEngine')

const { createRequiredRule } = useFormRules()
const formCom = ref()
const formRules = computed(() => ({
  name: createRequiredRule(tl('name')),
  connector: {
    server: createRequiredRule(tl('brokerAddress')),
  },
  remote_topic: createRequiredRule(t('Base.topic')),
  ingress: enableIngress.value
    ? { remote: { topic: createRequiredRule(t('Base.topic')) } }
    : undefined,
  egress: enableEgress.value
    ? { remote: { topic: createRequiredRule(t('Base.topic')) } }
    : undefined,
})) as Partial<Record<string, any>>

const initMqttBridgeVal = async () => {
  if (props.edit || props.copy) {
    mqttBridgeVal.value = fillEmptyValueToUndefinedField(
      _.cloneDeep(props.modelValue),
      createMQTTBridgeDefaultVal(),
    ) as MQTTBridge
    const { egress, ingress } = mqttBridgeVal.value
    if (egress?.remote?.topic) {
      enableEgress.value = true
    }
    if (ingress?.remote?.topic) {
      enableIngress.value = true
    }
    emit('init', mqttBridgeVal.value)
  }
}

const updateModelValue = (val: MQTTBridge) => {
  emit('update:modelValue', val)
}

const customValidate = () => {
  const { ingress, egress } = mqttBridgeVal.value
  if (!ingress.remote?.topic && !egress.remote?.topic) {
    ElMessage.error(tl('remoteTopicRequired'))
    return Promise.reject()
  }
  if (ingress.remote?.topic === egress.remote?.topic) {
    ElMessage.error(tl('remoteTopicRepeated'))
    return Promise.reject()
  }
  return Promise.resolve()
}

const validate = async () => {
  try {
    await formCom.value.validate()
    await customValidate()
    return Promise.resolve()
  } catch (error) {
    return Promise.reject()
  }
}

const clearValidate = () => {
  return formCom.value?.clearValidate()
}

watch(() => mqttBridgeVal.value, updateModelValue, { deep: true })

watch(
  () => props.modelValue,
  (val) => {
    if (!_.isEqual(val, mqttBridgeVal.value)) {
      initMqttBridgeVal()
    }
  },
)

watch(
  () => [enableIngress, enableEgress],
  ([val1, val2]) => {
    clearValidate()
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
.direction {
  margin-bottom: 18px;
  .payload-desc {
    margin: 12px 0 14px 0;
    line-height: 1.6;
  }
  .direction-body {
    margin-top: 16px;
    label {
      margin-bottom: 8px;
      display: inline-block;
    }
  }
}
</style>
