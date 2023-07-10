<template>
  <div class="bridge-config">
    <el-form
      ref="formCom"
      label-position="top"
      require-asterisk-position="right"
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
          <ConnectorMqttConfig v-model="mqttBridgeVal" :edit="edit" :copy="copy" />
        </el-col>
      </el-row>
      <div class="direction">
        <label>{{ tl('ingress') }}</label>
        <InfoTooltip :content="tl('ingressHelp')" />
        <p class="payload-desc">{{ tl('ingressDesc') }}</p>
        <el-switch v-model="enableIngress" @change="handleIngressChanged" />
        <el-collapse-transition>
          <div v-show="enableIngress">
            <el-card class="with-border" shadow="never">
              <el-row class="direction-body" :gutter="52">
                <el-col :span="12">
                  <label>{{ tl('remoteBroker') }}</label>
                  <el-form-item :prop="['ingress', 'remote', 'topic']" :required="enableIngress">
                    <template #label>
                      <label>{{ t('Base.topic') }}</label>
                      <InfoTooltip :content="tl('ingressRemoteTopicDesc')" />
                    </template>
                    <el-input v-model="mqttBridgeVal.ingress.remote.topic" placeholder="t/#" />
                  </el-form-item>
                  <el-form-item label="QoS">
                    <el-select v-model="mqttBridgeVal.ingress.remote.qos">
                      <el-option v-for="qos in ingressRemoteQoS" :key="qos" :value="qos" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <label>{{ tl('localBroker') }}</label>
                  <MQTTBridgeTransConfiguration
                    v-model="mqttBridgeVal.ingress.local"
                    path="ingress.locale"
                    :direction="MQTTBridgeDirection.In"
                    :topic-desc="tl('ingressLocalTopicDesc')"
                  />
                </el-col>
              </el-row>
            </el-card>
            <el-row :gutter="26">
              <el-col :span="12">
                <el-form-item :prop="['ingress', 'pool_size']">
                  <template #label>
                    <FormItemLabel
                      :label="tl('clientPoolsize')"
                      :desc="tl('ingressPoolSizeDesc')"
                      desc-marked
                    />
                  </template>
                  <el-input v-model.number="mqttBridgeVal.ingress.pool_size" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
      </div>
      <div class="direction">
        <label>{{ tl('egress') }}</label>
        <InfoTooltip :content="tl('egressHelp')" />
        <p class="payload-desc">{{ tl('egressDesc') }}</p>
        <el-switch v-model="enableEgress" @change="handleEgressChanged" />
        <el-collapse-transition>
          <div v-show="enableEgress">
            <el-card class="with-border" shadow="never">
              <el-row class="direction-body" :gutter="52">
                <el-col :span="12">
                  <label>{{ tl('remoteBroker') }}</label>
                  <MQTTBridgeTransConfiguration
                    v-model="mqttBridgeVal.egress.remote"
                    path="egress.remote"
                    :direction="MQTTBridgeDirection.Out"
                    :topic-desc="tl('egressRemoteTopicDesc')"
                  />
                </el-col>
                <el-col :span="12">
                  <label>{{ tl('localBroker') }}</label>
                  <el-form-item :prop="['egress', 'local', 'topic']">
                    <template #label>
                      <label>{{ t('Base.topic') }}</label>
                      <InfoTooltip :content="tl('egressLocalTopicDesc')" />
                    </template>
                    <el-input v-model="mqttBridgeVal.egress.local.topic" placeholder="t/#" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <el-row :gutter="26">
              <el-col :span="12">
                <el-form-item :prop="['egress', 'pool_size']">
                  <template #label>
                    <FormItemLabel
                      :label="tl('clientPoolsize')"
                      :desc="tl('egressPoolSizeDesc')"
                      desc-marked
                    />
                  </template>
                  <el-input v-model.number="mqttBridgeVal.egress.pool_size" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
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

export default defineComponent({
  name: 'BridgeMqttConfig',
})
</script>

<script lang="ts" setup>
import { QoSOptions } from '@/common/constants'
import { fillEmptyValueToUndefinedField, waitAMoment } from '@/common/tools'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { MQTTBridgeDirection, QoSLevel } from '@/types/enum'
import { BridgeItem, MQTTBridge } from '@/types/rule'
import { ElMessage } from 'element-plus'
import _ from 'lodash'
import {
  PropType,
  Ref,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  onMounted,
  ref,
  watch,
} from 'vue'
import MQTTBridgeTransConfiguration from '../MQTTBridgeTransConfiguration.vue'
import BridgeResourceOpt from './BridgeResourceOpt.vue'
import ConnectorMqttConfig from './ConnectorMqttConfig.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<MQTTBridge | BridgeItem>,
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

const { createRawMQTTForm: createMQTTBridgeDefaultVal } = useBridgeFormCreator()
const mqttBridgeVal: Ref<MQTTBridge> = ref(createMQTTBridgeDefaultVal() as any)
const enableIngress = ref(false)
const enableEgress = ref(false)

/**
 * If the ingress/egress configuration was enabled before and then turned off,
 * in order for the user to enable the ingress/egress configuration again during the same edit,
 * the following variable storage is used
 */
let preIngressTopic = ''
let preEgressTopic = ''

const { tl, t } = useI18nTl('RuleEngine')

const { createRequiredRule, createCommonIdRule } = useFormRules()
const formCom = ref()
const { ruleWhenTestConnection } = useSpecialRuleForPassword(props)
const formRules = computed(() => ({
  name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
  server: createRequiredRule(tl('brokerAddress')),
  remote_topic: createRequiredRule(t('Base.topic')),
  ingress: enableIngress.value
    ? { remote: { topic: createRequiredRule(t('Base.topic')) } }
    : undefined,
  egress: enableEgress.value
    ? { remote: { topic: createRequiredRule(t('Base.topic')) } }
    : undefined,
  password: ruleWhenTestConnection,
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

const ingressRemoteQoS = ref(QoSOptions.filter((item) => item !== QoSLevel.QoS2))

const handleIngressChanged = async () => {
  const topicTarget = mqttBridgeVal.value.ingress?.remote || {}
  if (!enableIngress.value && topicTarget.topic) {
    preIngressTopic = topicTarget.topic
    await waitAMoment(200)
    topicTarget.topic = ''
  } else if (enableIngress.value && preIngressTopic) {
    topicTarget.topic = preIngressTopic
  }
}
const handleEgressChanged = async () => {
  const topicTarget = mqttBridgeVal.value.egress?.remote || {}
  if (!enableEgress.value && topicTarget.topic) {
    preEgressTopic = topicTarget.topic
    await waitAMoment(200)
    topicTarget.topic = ''
  } else if (enableEgress.value && preEgressTopic) {
    topicTarget.topic = preEgressTopic
  }
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

initMqttBridgeVal()

onMounted(() => {
  updateModelValue(mqttBridgeVal.value)
})

defineExpose({ validate, clearValidate })
</script>

<style lang="scss" scoped>
.direction {
  margin-bottom: 18px;
  .payload-desc {
    margin: 12px 0 14px 0;
    line-height: 1.6;
  }
  .el-card {
    margin-top: 12px;
    margin-bottom: 16px;

    :deep(.el-card__body) {
      padding-top: 8px;
      padding-bottom: 16px;
    }
  }
  .direction-body {
    margin-top: 16px;

    .el-col-12 + .el-col-12 {
      border-left: 1px solid var(--el-border-color-light);
    }
    .el-col > label {
      margin-bottom: 8px;
      display: inline-block;
    }
  }
}
</style>
