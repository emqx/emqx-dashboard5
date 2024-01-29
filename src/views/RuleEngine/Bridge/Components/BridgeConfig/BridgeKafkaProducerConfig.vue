<template>
  <el-form
    ref="formCom"
    label-position="top"
    require-asterisk-position="right"
    class="bridge-config bridge-kafka-config"
    :rules="formRules"
    :model="formData"
    :disabled="disabled"
    :validate-on-rule-change="false"
  >
    <el-row :gutter="26">
      <el-col :span="colSpan" v-if="!hideName">
        <CustomFormItem :label="tl('name')" prop="name" :readonly="readonly">
          <el-input v-model="formData.name" :disabled="edit" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem :label="t('components.connector')" prop="connector" :readonly="readonly">
          <ConnectorSelect v-model="formData.connector" :type="BridgeType.KafkaProducer" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem :label="t('Flow.description')" prop="description" :readonly="readonly">
          <el-input v-model="formData.description" />
        </CustomFormItem>
      </el-col>
    </el-row>
    <el-divider />

    <el-row :gutter="26">
      <template v-if="formData.local_topic">
        <el-col :span="colSpan">
          <CustomFormItem prop="local_topic" :readonly="readonly">
            <template #label>
              <span>{{ getText('mqtt_topic.label') }}</span>
              <InfoTooltip :content="getText('mqtt_topic.desc')" />
            </template>
            <el-input v-model="formData.local_topic" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan" />
      </template>
      <el-col :span="colSpan">
        <CustomFormItem prop="parameters.topic" :readonly="readonly">
          <template #label>
            <span>{{ getText('topic.label') }}</span>
            <InfoTooltip :content="getText('topic.desc')" />
          </template>
          <el-input v-model="formData.parameters.topic" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan" />
      <el-col :span="colSpan">
        <CustomFormItem prop="parameters.kafka_headers" :readonly="readonly">
          <template #label>
            <span>{{ getText('kafka_headers.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getText('kafka_headers.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-input v-model="formData.parameters.kafka_headers" placeholder="${pub_props}" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item prop="parameters.kafka_header_value_encode_mode">
          <template #label>
            <span>{{ getText('kafka_header_value_encode_mode.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getText('kafka_header_value_encode_mode.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-select v-model="formData.parameters.kafka_header_value_encode_mode" v-if="!readonly">
            <el-option
              v-for="item in getProducerPropItem('parameters.kafka_header_value_encode_mode')
                .symbols || []"
              :key="item"
              :value="item"
              :label="getOptLabel(item)"
            />
          </el-select>
          <p class="value" v-else>
            {{ formData.parameters.kafka_header_value_encode_mode.toUpperCase() }}
          </p>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="parameters.kafka_ext_headers">
          <template #label>
            <span>{{ getText('kafka_ext_headers.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getText('kafka_ext_headers.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <ObjectArrayEditor
            v-model="formData.parameters.kafka_ext_headers"
            :properties="
              producerComponents?.parameters?.properties?.kafka_ext_headers?.items?.properties
            "
            prop-key="parameters.kafka_ext_headers"
            :edit-mode="colSpan === 12 ? 'table' : 'list'"
            :readonly="readonly"
          />
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="parameters.message.key" :readonly="readonly">
          <template #label>
            <FormItemLabel :label="getText('key.label')" :desc="getText('key.desc')" desc-marked />
          </template>
          <el-input type="textarea" rows="4" v-model="formData.parameters.message.key" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="parameters.message.value" :readonly="readonly">
          <template #label>
            <FormItemLabel
              :label="getText('value.label')"
              :desc="getText('value.desc')"
              desc-marked
            />
          </template>
          <el-input type="textarea" rows="4" v-model="formData.parameters.message.value" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="parameters.message.timestamp" :readonly="readonly">
          <template #label>
            <span>{{ getText('kafka_message_timestamp.label') }}</span>
            <InfoTooltip>
              <template #content>
                <p v-safe-html="getText('kafka_message_timestamp.desc')"></p>
              </template>
            </InfoTooltip>
          </template>
          <el-input v-model="formData.parameters.message.timestamp" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item prop="parameters.compression" :label="getText('compression.label')">
          <el-select v-model="formData.parameters.compression" v-if="!readonly">
            <el-option
              v-for="item in getProducerPropItem('parameters.compression').symbols || []"
              :key="item"
              :value="item"
              :label="te(`RuleEngine.${item}`) ? $t(`RuleEngine.${item}`) : item"
            />
          </el-select>
          <p class="value" v-else>
            {{
              te(`RuleEngine.${formData.parameters.compression}`)
                ? $t(`RuleEngine.${formData.parameters.compression}`)
                : formData.parameters.compression
            }}
          </p>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="parameters.partition_strategy" :readonly="readonly">
          <template #label>
            <span>{{ getText('partition_strategy.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getText('partition_strategy.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-select v-model="formData.parameters.partition_strategy">
            <el-option
              v-for="item in getProducerPropItem('parameters.partition_strategy').symbols || []"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </CustomFormItem>
      </el-col>
    </el-row>

    <!-- socket opt -->
    <AdvancedSettingContainer>
      <el-row :gutter="26">
        <el-col :span="colSpan">
          <CustomFormItem prop="parameters.max_batch_bytes" :readonly="readonly">
            <template #label>
              <span>{{ getText('max_batch_bytes.label') }}</span>
              <InfoTooltip :content="getText('max_batch_bytes.desc')" />
            </template>
            <InputWithUnit
              v-model="formData.parameters.max_batch_bytes"
              :units="usefulMemoryUnit"
            />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="parameters.required_acks" :readonly="readonly">
            <template #label>
              <span>{{ getText('required_acks.label') }}</span>
              <InfoTooltip>
                <template #content>
                  <MarkdownContent :content="getText('required_acks.desc')" />
                </template>
              </InfoTooltip>
            </template>
            <el-select v-model="formData.parameters.required_acks">
              <el-option
                v-for="item in getProducerPropItem('parameters.required_acks').symbols || []"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="parameters.partition_count_refresh_interval" :readonly="readonly">
            <template #label>
              <span>{{ getText('partition_count_refresh_interval.label') }}</span>
              <InfoTooltip>
                <template #content>
                  <MarkdownContent :content="getText('partition_count_refresh_interval.desc')" />
                </template>
              </InfoTooltip>
            </template>
            <TimeInputWithUnitSelect
              v-model="formData.parameters.partition_count_refresh_interval"
            />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="parameters.max_inflight" :readonly="readonly">
            <template #label>
              <span>{{ getText('max_inflight.label') }}</span>
              <InfoTooltip :content="getText('max_inflight.desc')" />
            </template>
            <el-input v-model="formData.parameters.max_inflight" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item prop="parameters.query_mode">
            <template #label>
              <span>{{ getCommonText('query_mode.label') }}</span>
              <InfoTooltip :content="getCommonText('query_mode.desc')" />
            </template>
            <el-select v-model="formData.parameters.query_mode" v-if="!readonly">
              <el-option
                v-for="item in getProducerPropItem('parameters.query_mode').symbols || []"
                :key="item"
                :value="item"
                :label="t(`SchemaSymbolLabel.${item}`)"
              />
            </el-select>
            <p class="value" v-else>
              {{ t(`SchemaSymbolLabel.${formData.parameters.query_mode}`) }}
            </p>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="parameters.sync_query_timeout" :readonly="readonly">
            <template #label>
              <span>{{ getText('sync_query_timeout.label') }}</span>
              <InfoTooltip :content="getText('sync_query_timeout.desc')" />
            </template>
            <TimeInputWithUnitSelect v-model="formData.parameters.sync_query_timeout" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="parameters.buffer.mode" :readonly="readonly">
            <template #label>
              <span>{{ getText('mode.label') }}</span>
              <InfoTooltip>
                <template #content>
                  <MarkdownContent :content="getText('mode.desc')" />
                </template>
              </InfoTooltip>
            </template>
            <el-select v-model="formData.parameters.buffer.mode">
              <el-option
                v-for="item in getProducerPropItem('parameters.buffer.mode').symbols || []"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="parameters.buffer.per_partition_limit" :readonly="readonly">
            <template #label>
              <span>{{ getText('per_partition_limit.label') }}</span>
              <InfoTooltip :content="getText('per_partition_limit.desc')" />
            </template>
            <InputWithUnit
              v-model="formData.parameters.buffer.per_partition_limit"
              :units="usefulMemoryUnit"
            />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="parameters.buffer.segment_bytes" :readonly="readonly">
            <template #label>
              <span>{{ getText('segment_bytes.label') }}</span>
              <InfoTooltip>
                <template #content>
                  <MarkdownContent :content="getText('segment_bytes.desc')" />
                </template>
              </InfoTooltip>
            </template>
            <InputWithUnit
              v-model="formData.parameters.buffer.segment_bytes"
              :units="usefulMemoryUnit"
            />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item prop="parameters.buffer.memory_overload_protection">
            <template #label>
              <span>{{ getText('memory_overload_protection.label') }}</span>
              <InfoTooltip>
                <template #content>
                  <MarkdownContent :content="getText('memory_overload_protection.desc')" />
                </template>
              </InfoTooltip>
            </template>
            <el-switch
              v-model="formData.parameters.buffer.memory_overload_protection"
              :disabled="readonly"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem
            prop="resource_opts.health_check_interval"
            :label="t('RuleEngine.healthCheckInterval')"
            :readonly="readonly"
          >
            <TimeInputWithUnitSelect v-model="formData.resource_opts.health_check_interval" />
          </CustomFormItem>
        </el-col>
      </el-row>
    </AdvancedSettingContainer>
  </el-form>
</template>

<script setup lang="ts">
import { fillEmptyValueToUndefinedField, getAPIPath, usefulMemoryUnit } from '@/common/tools'
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'
import CustomFormItem from '@/components/CustomFormItem.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import ObjectArrayEditor from '@/components/ObjectArrayEditor.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import useGetInfoFromComponents from '@/hooks/Rule/bridge/useGetInfoFromComponents'
import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import { useSymbolLabel } from '@/hooks/Schema/useItemLabelAndDesc'
import useSchemaForm from '@/hooks/Schema/useSchemaForm'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { OtherBridge } from '@/types/rule'
import { Properties } from '@/types/schemaForm'
import { isEqual } from 'lodash'
import { Ref, computed, defineEmits, defineExpose, defineProps, onMounted, ref, watch } from 'vue'
import ConnectorSelect from '../ConnectorSelect.vue'

const props = defineProps({
  modelValue: {
    type: Object,
  },
  edit: {
    type: Boolean,
  },
  copy: {
    type: Boolean,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
  },
  /**
   * for rule
   */
  hideName: {
    type: Boolean,
    default: false,
  },
  isUsingInFlow: {
    type: Boolean,
  },
})
const emit = defineEmits(['update:modelValue', 'init'])

const { t, tl, te } = useI18nTl('RuleEngine')
const getText = (key: string) => t(`BridgeSchema.kafka_producer.${key}`)
const getCommonText = (key: string) => t(`BridgeSchema.common.${key}`)
const { getOptLabel } = useSymbolLabel()

const { components: producerComponents, schemaLoadPromise } = useSchemaForm(
  getAPIPath(`/schemas/actions`),
  {
    ref: '#/components/schemas/bridge_kafka.post_bridge_v2',
  },
)
const { getPropItem: getProducerPropItem } = useGetInfoFromComponents(producerComponents)
const addLabelForProps = (props: Properties) => {
  Object.entries(props).forEach(([, value]) => {
    // Distinguish the description of the duplicate `MQTT Topic` field for Consumer and Producer.
    value.description = getText(`${value.key}.desc`)
    value.label = getText(`${value.key}.label`)
  })
  return props
}

const addLabel = async () => {
  await schemaLoadPromise
  if (producerComponents.value.parameters.properties?.kafka_ext_headers.items) {
    producerComponents.value.parameters.properties.kafka_ext_headers.items.properties =
      addLabelForProps(
        producerComponents.value.parameters.properties.kafka_ext_headers.items
          .properties as Properties,
      )
  }
}
addLabel()

const { createRawKafkaProducerForm } = useBridgeFormCreator()

const getDefaultForm = createRawKafkaProducerForm

const formCom = ref()
const { createRequiredRule, createCommonIdRule } = useFormRules()
const { ruleWhenEditing } = useSpecialRuleForPassword(props)
const formRules = computed<any>(() => {
  const ret = {
    name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
    connector: createRequiredRule(t('components.connector'), 'select'),
    authentication: {
      mechanism: createRequiredRule(tl('mechanism')),
      username: createRequiredRule(tl('username')),
      password: [...createRequiredRule(tl('password')), ...ruleWhenEditing],
      kerberos_keytab_file: createRequiredRule(tl('kerberosKeytabFile')),
      kerberos_principal: createRequiredRule(tl('kerberosPrincipal')),
    },
    parameters: { topic: createRequiredRule(tl('kafkaProducerTopic')) },
    topic_mapping: [{ message: tl('topicMappingRequired'), required: true }],
  }
  return ret
})

const formData: Ref<OtherBridge> = ref(getDefaultForm())

const colSpan = computed(() => (props.isUsingInFlow ? 24 : 12))

const updateParentBridgeData = () => {
  emit('update:modelValue', formData.value)
}

watch(formData, updateParentBridgeData, { deep: true })

const initFormData = async () => {
  if (!props.modelValue) {
    return
  }
  if (props.edit || props.copy) {
    formData.value = fillEmptyValueToUndefinedField(
      props.modelValue as Record<string, any>,
      getDefaultForm(),
    )
    emit('init', formData.value)
  } else {
    formData.value = { ...formData.value, ...props.modelValue }
  }
}

const validate = () => {
  return formCom.value.validate()
}

const clearValidate = () => {
  return formCom.value?.clearValidate()
}

watch(
  () => props.modelValue,
  (val) => {
    if (!isEqual(val, formData.value)) {
      initFormData()
    }
  },
)

onMounted(() => {
  updateParentBridgeData()
})
initFormData()

defineExpose({ validate, clearValidate })
</script>

<style lang="scss">
@import '~@/style/rule.scss';
</style>
