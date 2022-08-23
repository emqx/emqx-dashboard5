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
          <ConnectorMqttConfig v-model="mqttBridgeVal" />
        </el-col>
      </el-row>
      <el-divider />
      <div>
        <!-- TODO:delete -->
        <h3>INGRESS</h3>
        <el-row :gutter="26">
          <el-col :span="12">
            <el-form-item :prop="['ingress', 'remote', 'topic']">
              <template #label>
                <label>{{ tl('remoteTopic') }}</label>
                <InfoTooltip :content="tl('mqttSourceRemoteTopicDesc')" />
              </template>
              <el-input v-model="mqttBridgeVal.ingress.remote.topic" placeholder="t/#" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="QoS">
              <el-select v-model="mqttBridgeVal.ingress.remote.qos">
                <el-option v-for="qos in QoSOptions" :key="qos" :value="qos" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <MQTTBridgeTransConfiguration
          v-model="mqttBridgeVal.ingress.local"
          path="ingress.locale"
          :direction="MQTTBridgeDirection.In"
        />
      </div>
      <el-divider />
      <div>
        <!-- TODO: -->
        <h3>EGRESS</h3>
        <el-row :gutter="26">
          <el-col :span="12">
            <el-form-item :prop="['egress', 'remote', 'topic']">
              <template #label>
                <label>{{ tl('localTopic') }}</label>
                <InfoTooltip :content="tl('mqttSourceRemoteTopicDesc')" />
              </template>
              <el-input v-model="mqttBridgeVal.egress.local.topic" placeholder="t/#" />
            </el-form-item>
          </el-col>
        </el-row>
        <MQTTBridgeTransConfiguration
          v-model="mqttBridgeVal.egress.remote"
          path="egress.remote"
          :direction="MQTTBridgeDirection.Out"
        />
      </div>
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
import { MQTTIn, MQTTOut } from '@/types/rule'
import { QoSOptions } from '@/common/constants'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { MQTTBridgeDirection } from '@/types/enum'
import useDocLink from '@/hooks/useDocLink'
import useSSL from '@/hooks/useSSL'
import ConnectorMqttConfig from '@/views/RuleEngine/Connector/ConnectorMqttConfig.vue'
import MQTTBridgeTransConfiguration from './Components/MQTTBridgeTransConfiguration.vue'

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

const createRawTransDefaultVal = () => ({
  topic: '',
  qos: 1,
  payload: '${payload}',
  retain: false,
})

const createMQTTBridgeDefaultVal = () => ({
  enable: true,
  server: '',
  proto_ver: 'v4',
  username: '',
  password: '',
  ssl: createSSLForm(),

  ingress: {
    remote: {
      topic: '',
      qos: 1,
    },
    local: createRawTransDefaultVal(),
  },
  egress: {
    local: {
      topic: '',
    },
    remote: createRawTransDefaultVal(),
  },
})

let modelValueCache = ''
const mqttBridgeVal: Ref<MQTTBridge> = ref(createMQTTBridgeDefaultVal() as any)

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
    mqttBridgeVal.value = _.cloneDeep(prop.modelValue)
  } else {
    mqttBridgeVal.value = {
      ...createMQTTBridgeDefaultVal(),
      ..._.cloneDeep(prop.modelValue),
    }
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

watch(mqttBridgeVal, updateModelValue, { deep: true })

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
