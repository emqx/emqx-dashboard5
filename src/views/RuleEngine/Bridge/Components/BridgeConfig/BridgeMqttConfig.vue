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
      <el-row :gutter="26">
        <el-col :span="24">
          <ConnectorMqttConfig v-model="mqttBridgeVal" :edit="edit" />
        </el-col>
      </el-row>
      <el-divider />
      <el-tabs v-model="activeDirection" class="trans-tabs" type="card">
        <el-tab-pane :label="tl('ingress')" :name="MQTTBridgeDirection.In" lazy>
          <p class="trans-desc">{{ tl('ingressDesc') }}</p>
          <el-row :gutter="26">
            <el-col :span="12">
              <el-card class="app-card" shadow="never">
                <p class="broker-block-title">{{ tl('remoteBroker') }}</p>
                <el-form-item :prop="['ingress', 'remote', 'topic']">
                  <template #label>
                    <label>{{ t('Base.topic') }}</label>
                    <InfoTooltip :content="tl('mqttSourceRemoteTopicDesc')" />
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
              <el-card class="app-card" shadow="never">
                <p class="broker-block-title">{{ tl('localBroker') }}</p>
                <MQTTBridgeTransConfiguration
                  v-model="mqttBridgeVal.ingress.local"
                  path="ingress.locale"
                  :direction="MQTTBridgeDirection.In"
                />
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="tl('egress')" :name="MQTTBridgeDirection.Out" lazy>
          <p class="trans-desc">{{ tl('egressDesc') }}</p>
          <el-row :gutter="26">
            <el-col :span="12">
              <el-card class="app-card" shadow="never">
                <p class="broker-block-title">{{ tl('localBroker') }}</p>
                <el-form-item :prop="['egress', 'remote', 'topic']">
                  <template #label>
                    <label>{{ t('Base.topic') }}</label>
                    <InfoTooltip :content="tl('outBridgeLocalTopicPlaceholder')" />
                  </template>
                  <el-input v-model="mqttBridgeVal.egress.local.topic" placeholder="t/#" />
                </el-form-item>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="app-card" shadow="never">
                <p class="broker-block-title">{{ tl('remoteBroker') }}</p>
                <MQTTBridgeTransConfiguration
                  v-model="mqttBridgeVal.egress.remote"
                  path="egress.remote"
                  :direction="MQTTBridgeDirection.Out"
                />
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
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
const activeDirection = ref(MQTTBridgeDirection.In)

const { tl, t } = useI18nTl('RuleEngine')

const { createRequiredRule } = useFormRules()
const formCom = ref()
const formRules = computed(() => ({
  name: createRequiredRule(tl('name')),
  connector: {
    server: createRequiredRule(tl('brokerAddress')),
  },
  remote_topic: createRequiredRule(t('Base.topic')),
}))

const initMqttBridgeVal = async () => {
  if (prop.edit) {
    mqttBridgeVal.value = fillEmptyValueToUndefinedField(
      _.cloneDeep(prop.modelValue),
      createMQTTBridgeDefaultVal(),
    )
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
  () => prop.modelValue,
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
@import '@/style/rule.scss';
.monaco-container {
  margin-top: 12px;
  height: 200px;
}

.trans-tabs {
  .trans-desc {
    margin: 20px 0;
    color: var(--color-text-secondary);
  }
  .el-card {
    border: 1px solid var(--el-card-border-color);
  }
  .broker-block-title {
    margin-top: 0;
    font-size: 16px;
  }
}
</style>
