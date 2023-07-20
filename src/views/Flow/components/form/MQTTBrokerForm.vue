<template>
  <el-form
    ref="FormCom"
    label-width="200px"
    class="mqtt-broker-form bridge-config"
    label-position="right"
    hide-required-asterisk
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
    @keyup.enter="saveConfig()"
  >
    <el-form-item :label="tl('name')" required prop="name">
      <el-input v-model="record.name" :disabled="edit" />
    </el-form-item>
    <ConnectorMqttConfig v-model="record" :edit="edit" :col-span="24" />
    <div v-if="direction === BridgeDirection.Ingress">
      <p class="sub-block-title tip">{{ tl('remoteBroker') }}</p>
      <el-form-item :prop="['ingress', 'remote', 'topic']">
        <template #label>
          <FormItemLabel :label="t('Base.topic')" :desc="tl('ingressRemoteTopicDesc')" />
        </template>
        <el-input v-model="record.ingress.remote.topic" placeholder="t/#" />
      </el-form-item>
      <el-form-item label="QoS">
        <el-select v-model="record.ingress.remote.qos">
          <el-option v-for="qos in MQTTingressRemoteQoS" :key="qos" :value="qos" />
        </el-select>
      </el-form-item>
      <p class="sub-block-title tip">{{ tl('localBroker') }}</p>
      <MQTTBridgeTransConfiguration
        v-model="record.ingress.local"
        put-desc-in-tooltip
        path="ingress.locale"
        :direction="MQTTBridgeDirection.In"
        :topic-desc="tl('ingressLocalTopicDesc')"
      />
      <el-form-item :prop="['ingress', 'pool_size']">
        <template #label>
          <FormItemLabel
            :label="tl('clientPoolsize')"
            :desc="tl('ingressPoolSizeDesc')"
            desc-marked
          />
        </template>
        <el-input v-model.number="record.ingress.pool_size" />
      </el-form-item>
    </div>
    <div v-if="direction === BridgeDirection.Egress">
      <p class="sub-block-title tip">{{ tl('remoteBroker') }}</p>
      <MQTTBridgeTransConfiguration
        v-model="record.egress.remote"
        put-desc-in-tooltip
        path="egress.remote"
        :direction="MQTTBridgeDirection.Out"
        :topic-desc="tl('egressRemoteTopicDesc')"
      />
      <p class="sub-block-title tip">{{ tl('localBroker') }}</p>
      <el-form-item :prop="['egress', 'local', 'topic']">
        <template #label>
          <FormItemLabel :label="t('Base.topic')" :desc="tl('egressLocalTopicDesc')" />
        </template>
        <el-input v-model="record.egress.local.topic" placeholder="t/#" />
      </el-form-item>
      <el-form-item :prop="['egress', 'pool_size']">
        <template #label>
          <FormItemLabel
            :label="tl('clientPoolsize')"
            :desc="tl('egressPoolSizeDesc')"
            desc-marked
          />
        </template>
        <el-input v-model.number="record.egress.pool_size" />
      </el-form-item>
    </div>
    <el-divider />
    <BridgeResourceOpt v-model="record.resource_opts" :col-span="24" />
  </el-form>
</template>

<script setup lang="ts">
import { MQTTingressRemoteQoS } from '@/common/constants'
import FormItemLabel from '@/components/FormItemLabel.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, MQTTBridgeDirection } from '@/types/enum'
import BridgeResourceOpt from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeResourceOpt.vue'
import ConnectorMqttConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/ConnectorMqttConfig.vue'
import MQTTBridgeTransConfiguration from '@/views/RuleEngine/Bridge/Components/MQTTBridgeTransConfiguration.vue'
import { PropType, computed, defineEmits, defineExpose, defineProps, ref } from 'vue'

const FormCom = ref()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  edit: {
    type: Boolean,
  },
  direction: {
    type: Number as PropType<BridgeDirection>,
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const { t, tl } = useI18nTl('RuleEngine')

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const { createRequiredRule } = useFormRules()
const rules = {
  server: createRequiredRule(tl('brokerAddress')),
  ingress: { remote: { topic: createRequiredRule(t('Base.topic')) } },
  egress: { remote: { topic: createRequiredRule(t('Base.topic')) } },
}

const saveConfig = () => {
  emit('save', record.value)
}

const validate = () => FormCom.value.validate()

defineExpose({ validate })
</script>

<style lang="scss">
.mqtt-broker-form {
  .sub-block-title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
}
</style>
