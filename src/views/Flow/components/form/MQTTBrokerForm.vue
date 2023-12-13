<template>
  <el-form
    ref="FormCom"
    label-width="152px"
    class="mqtt-broker-form bridge-config"
    label-position="right"
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
  >
    <CustomFormItem :label="tl('name')" required prop="name" :readonly="readonly">
      <InputSelect
        v-if="isCreateBridgeInFlow"
        v-model="record.name"
        :options="nameOptions"
        @change="handleNameChange"
      />
      <el-input v-else v-model="record.name" :disabled="edit" />
    </CustomFormItem>
    <ConnectorMqttConfig v-model="record" :edit="edit" :col-span="24" :readonly="readonly" />
    <div v-if="direction === BridgeDirection.Ingress">
      <p class="sub-block-title tip">{{ tl('remoteBroker') }}</p>
      <CustomFormItem :prop="['ingress', 'remote', 'topic']" :readonly="readonly">
        <template #label>
          <FormItemLabel :label="t('Base.topic')" :desc="tl('ingressRemoteTopicDesc')" />
        </template>
        <el-input v-model="record.ingress.remote.topic" placeholder="t/#" />
      </CustomFormItem>
      <CustomFormItem label="QoS" :readonly="readonly">
        <el-select v-model="record.ingress.remote.qos">
          <el-option v-for="qos in MQTTingressRemoteQoS" :key="qos" :value="qos" />
        </el-select>
      </CustomFormItem>
      <p class="sub-block-title tip">{{ tl('localBroker') }}</p>
      <MQTTBridgeTransConfiguration
        v-model="record.ingress.local"
        put-desc-in-tooltip
        path="ingress.local"
        :direction="MQTTBridgeDirection.In"
        :topic-desc="tl('ingressLocalTopicDesc')"
        :readonly="readonly"
      />
      <CustomFormItem :prop="['ingress', 'pool_size']" :readonly="readonly">
        <template #label>
          <FormItemLabel
            :label="tl('clientPoolsize')"
            :desc="tl('ingressPoolSizeDesc')"
            desc-marked
          />
        </template>
        <el-input v-model.number="record.ingress.pool_size" />
      </CustomFormItem>
    </div>
    <div v-if="direction === BridgeDirection.Egress">
      <p class="sub-block-title tip">{{ tl('remoteBroker') }}</p>
      <MQTTBridgeTransConfiguration
        v-model="record.egress.remote"
        put-desc-in-tooltip
        path="egress.remote"
        :direction="MQTTBridgeDirection.Out"
        :topic-desc="tl('egressRemoteTopicDesc')"
        :readonly="readonly"
      />
      <p class="sub-block-title tip">{{ tl('localBroker') }}</p>
      <CustomFormItem :prop="['egress', 'local', 'topic']" :readonly="readonly">
        <template #label>
          <FormItemLabel :label="t('Base.topic')" :desc="tl('egressLocalTopicDesc')" />
        </template>
        <el-input v-model="record.egress.local.topic" placeholder="t/#" />
      </CustomFormItem>
      <CustomFormItem :prop="['egress', 'pool_size']" :readonly="readonly">
        <template #label>
          <FormItemLabel
            :label="tl('clientPoolsize')"
            :desc="tl('egressPoolSizeDesc')"
            desc-marked
          />
        </template>
        <el-input v-model.number="record.egress.pool_size" />
      </CustomFormItem>
    </div>
    <AdvancedSettingContainer>
      <CustomFormItem>
        <template #label>
          <FormItemLabel :label="tl('retryInterval')" :desc="tl('retryIntervalDesc')" />
        </template>
        <TimeInputWithUnitSelect
          v-model="record.retry_interval"
          :enabled-units="['ms', 's', 'm', 'h', 'd']"
          default-unit="s"
        />
      </CustomFormItem>
      <el-form-item>
        <template #label>
          <FormItemLabel :label="tl('bridgeMode')" :desc="tl('bridgeModeDesc')" />
        </template>
        <el-switch v-model="record.bridge_mode" :disabled="readonly" />
      </el-form-item>
      <BridgeResourceOpt v-model="record.resource_opts" :col-span="24" :readonly="readonly" />
    </AdvancedSettingContainer>
  </el-form>
</template>

<script setup lang="ts">
import { MQTTingressRemoteQoS } from '@/common/constants'
import { waitAMoment } from '@/common/tools'
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'
import CustomFormItem from '@/components/CustomFormItem.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InputSelect from '@/components/InputSelect.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useReuseBridgeInFlow from '@/hooks/Flow/useReuseBridgeInFlow'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, BridgeType, MQTTBridgeDirection } from '@/types/enum'
import BridgeResourceOpt from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeResourceOpt.vue'
import ConnectorMqttConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/ConnectorMqttConfig.vue'
import MQTTBridgeTransConfiguration from '@/views/RuleEngine/Bridge/Components/MQTTBridgeTransConfiguration.vue'
import { cloneDeep } from 'lodash'
import { PropType, computed, defineEmits, defineExpose, defineProps, ref, watch } from 'vue'

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
  readonly: {
    type: Boolean,
  },
  isUsingInFlow: {
    type: Boolean,
    default: true,
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
const { isCreateBridgeInFlow, isBridgeSelected, getBridgesInSameType, handleNameChange } =
  useReuseBridgeInFlow(BridgeType.MQTT, props, record, props.direction)
const nameOptions = computed(() => {
  const bridges = getBridgesInSameType()
  return bridges?.map(({ name }) => name) || []
})
const initRecord = cloneDeep(record.value)
watch(isBridgeSelected, async (nVal, oVal) => {
  if (!nVal && oVal) {
    const name = record.value.name
    record.value = Object.assign(cloneDeep(initRecord), { name })
    await waitAMoment()
    FormCom.value?.clearValidate?.()
  }
})
const {
  createRequiredRule,
  createCommonIdRule,
  createMqttSubscribeTopicRule,
  createMqttPublishTopicRule,
} = useFormRules()
const rules: any = {
  name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
  server: createRequiredRule(tl('brokerAddress')),
  ingress: {
    remote: { topic: [...createRequiredRule(t('Base.topic')), ...createMqttSubscribeTopicRule()] },
    local: {
      topic: [...createMqttPublishTopicRule()],
    },
  },
  egress: {
    remote: { topic: [...createRequiredRule(t('Base.topic')), ...createMqttPublishTopicRule()] },
    local: {
      topic: [...createMqttSubscribeTopicRule()],
    },
  },
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
