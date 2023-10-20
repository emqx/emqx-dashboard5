<template>
  <el-form
    ref="formCom"
    label-position="top"
    require-asterisk-position="right"
    class="bridge-config bridge-kafka-config"
    :rules="formRules"
    :model="formData"
    :validate-on-rule-change="false"
  >
    <el-row :gutter="26">
      <el-col :span="colSpan">
        <CustomFormItem :label="tl('name')" prop="name" :readonly="readonly">
          <InputSelect
            v-if="isCreateBridgeInFlow"
            v-model="formData.name"
            :options="nameOptions"
            @change="handleNameChange"
          />
          <el-input v-else v-model="formData.name" :disabled="edit" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan" v-if="!fixedRole">
        <CustomFormItem>
          <template #label>
            <span>{{ tl('role') }}</span>
            <InfoTooltip>
              <template #content> <MarkdownContent :content="tl('roleDesc')" /> </template>
            </InfoTooltip>
          </template>
          <el-select v-model="role" :disabled="edit" @change="handleRoleChanged">
            <el-option
              v-for="{ value, label } in roleMap"
              :key="value"
              :value="value"
              :label="label"
            />
          </el-select>
        </CustomFormItem>
      </el-col>
    </el-row>

    <el-divider />

    <el-row :gutter="26">
      <el-col :span="colSpan">
        <CustomFormItem prop="bootstrap_hosts" :readonly="readonly">
          <template #label>
            <span>{{ getText('bootstrap_hosts.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getText('bootstrap_hosts.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-input v-model="formData.bootstrap_hosts" />
        </CustomFormItem>
      </el-col>

      <el-col :span="colSpan">
        <el-form-item :label="t('components.authentication')">
          <el-select v-model="authType" v-if="!readonly">
            <el-option
              v-for="{ value, label } in authTypeOptList"
              :key="value"
              :value="value"
              :label="label"
            />
          </el-select>
          <p class="value" v-else>{{ getLabelFromValueInOptionList(authType, authTypeOptList) }}</p>
        </el-form-item>
      </el-col>
      <!-- For Basic -->
      <template v-if="authType === AuthType.Basic">
        <el-col :span="colSpan">
          <el-form-item prop="authentication.mechanism">
            <template #label>
              <span>{{ tl('mechanism') }}</span>
              <InfoTooltip :content="tl('mechanismDesc')" />
            </template>
            <el-select v-model="formData.authentication.mechanism" v-if="!readonly">
              <el-option
                v-for="{ value, label } in mechanismOptList"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
            <p class="value" v-else>
              {{
                getLabelFromValueInOptionList(formData.authentication.mechanism, mechanismOptList)
              }}
            </p>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem
            prop="authentication.username"
            :label="tl('username')"
            :readonly="readonly"
          >
            <el-input v-model="formData.authentication.username" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem
            prop="authentication.password"
            :label="tl('password')"
            :readonly="readonly"
          >
            <el-input
              v-model="formData.authentication.password"
              type="password"
              autocomplete="one-time-code"
              show-password
            />
          </CustomFormItem>
        </el-col>
      </template>
      <!-- For Kerberos -->
      <template v-else-if="authType === AuthType.Kerberos">
        <el-col :span="colSpan">
          <CustomFormItem prop="authentication.kerberos_principal" :readonly="readonly">
            <template #label>
              <span>{{ tl('kerberosPrincipal') }}</span>
              <InfoTooltip>
                <template #content>
                  <p v-safe-html="tl('kerberosPrincipalDesc')"></p>
                </template>
              </InfoTooltip>
            </template>
            <el-input v-model="formData.authentication.kerberos_principal" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="authentication.kerberos_keytab_file" :readonly="readonly">
            <template #label>
              <span>{{ tl('kerberosKeytabFile') }}</span>
              <InfoTooltip :content="tl('kerberosKeytabFileDesc')" />
            </template>
            <el-input
              v-model="formData.authentication.kerberos_keytab_file"
              :placeholder="tl('filePathPlease')"
            />
          </CustomFormItem>
        </el-col>
      </template>

      <!-- ssl -->
      <el-col :span="24">
        <CommonTLSConfig
          v-model="formData.ssl"
          :is-edit="edit || copy"
          :content="tl('kafkaSniDesc')"
          :readonly="readonly"
        />
      </el-col>

      <el-col :span="24"><el-divider /></el-col>

      <!-- producer -->
      <template v-if="role === Role.Producer">
        <el-col :span="colSpan" v-if="formData.local_topic">
          <CustomFormItem prop="local_topic" :readonly="readonly">
            <template #label>
              <span>{{ getText('mqtt_topic.label') }}</span>
              <InfoTooltip :content="getText('mqtt_topic.desc')" />
            </template>
            <el-input v-model="formData.local_topic" />
          </CustomFormItem>
        </el-col>
        <el-col :span="24">
          <KafkaProducerConfig
            v-if="producerComponents.kafka"
            v-model="formData.kafka"
            :colSpan="colSpan"
            :headers-properties="
              producerComponents?.kafka?.properties?.kafka_ext_headers?.items?.properties
            "
            :schema-components="getProducerPropItem('kafka').properties"
            :readonly="readonly"
          />
        </el-col>
      </template>

      <!-- Consumer -->
      <template v-else>
        <el-col :span="colSpan">
          <CustomFormItem prop="key_encoding_mode" :readonly="readonly">
            <template #label>
              <FormItemLabel
                :label="getText('consumer_key_encoding_mode.label')"
                :desc="getText('consumer_key_encoding_mode.desc')"
                desc-marked
              />
            </template>
            <el-select v-model="formData.key_encoding_mode">
              <el-option
                v-for="item in getConsumerPropItem('key_encoding_mode').symbols || []"
                :key="item"
                :value="item"
                :label="getOptLabel(item)"
              />
            </el-select>
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="value_encoding_mode" :readonly="readonly">
            <template #label>
              <FormItemLabel
                :label="getText('consumer_value_encoding_mode.label')"
                :desc="getText('consumer_value_encoding_mode.desc')"
                desc-marked
              />
            </template>
            <el-select v-model="formData.value_encoding_mode">
              <el-option
                v-for="item in getConsumerPropItem('value_encoding_mode').symbols || []"
                :key="item"
                :value="item"
                :label="getOptLabel(item)"
              />
            </el-select>
          </CustomFormItem>
        </el-col>
        <el-col :span="24">
          <CustomFormItem prop="topic_mapping">
            <template #label>
              <span>{{ getText('consumer_topic_mapping.label') }}</span>
              <InfoTooltip :content="getText('consumer_topic_mapping.desc')" />
            </template>
            <ObjectArrayEditor
              v-if="consumerComponents.topic_mapping"
              prop-key="topic_mapping"
              v-model="formData.topic_mapping"
              :properties="consumerComponents?.topic_mapping?.items?.properties"
              :edit-mode="colSpan === 12 ? 'table' : 'list'"
              :readonly="readonly"
            />
          </CustomFormItem>
        </el-col>
        <el-col :span="24">
          <KafkaConsumerConfig
            v-model="formData.kafka"
            :colSpan="colSpan"
            :readonly="readonly"
            :schema-components="getConsumerPropItem('kafka').properties"
          />
        </el-col>
      </template>
    </el-row>

    <!-- socket opt -->
    <AdvancedSettingContainer>
      <el-row :gutter="26">
        <el-col :span="colSpan">
          <CustomFormItem prop="min_metadata_refresh_interval" :readonly="readonly">
            <template #label>
              <span>{{ getText('min_metadata_refresh_interval.label') }}</span>
              <InfoTooltip :content="getText('min_metadata_refresh_interval.desc')" />
            </template>
            <TimeInputWithUnitSelect v-model="formData.min_metadata_refresh_interval" />
          </CustomFormItem>
        </el-col>

        <el-col :span="colSpan">
          <CustomFormItem prop="metadata_request_timeout" :readonly="readonly">
            <template #label>
              <span>{{ getText('metadata_request_timeout.label') }}</span>
              <InfoTooltip :content="getText('metadata_request_timeout.desc')" />
            </template>
            <TimeInputWithUnitSelect v-model="formData.metadata_request_timeout" />
          </CustomFormItem>
        </el-col>

        <el-col :span="colSpan">
          <CustomFormItem prop="connect_timeout" :readonly="readonly">
            <template #label>
              <span>{{ getText('connect_timeout.label') }}</span>
              <InfoTooltip :content="getText('connect_timeout.desc')" />
            </template>
            <TimeInputWithUnitSelect v-model="formData.connect_timeout" />
          </CustomFormItem>
        </el-col>
        <!-- PRODUCER -->
        <template v-if="role === Role.Producer">
          <el-col :span="colSpan">
            <CustomFormItem prop="kafka.max_batch_bytes" :readonly="readonly">
              <template #label>
                <span>{{ getText('max_batch_bytes.label') }}</span>
                <InfoTooltip :content="getText('max_batch_bytes.desc')" />
              </template>
              <InputWithUnit v-model="formData.kafka.max_batch_bytes" :units="usefulMemoryUnit" />
            </CustomFormItem>
          </el-col>
          <el-col :span="colSpan">
            <CustomFormItem prop="kafka.required_acks" :readonly="readonly">
              <template #label>
                <span>{{ getText('required_acks.label') }}</span>
                <InfoTooltip>
                  <template #content>
                    <MarkdownContent :content="getText('required_acks.desc')" />
                  </template>
                </InfoTooltip>
              </template>
              <el-select v-model="formData.kafka.required_acks">
                <el-option
                  v-for="item in getProducerPropItem('kafka.required_acks').symbols || []"
                  :key="item"
                  :value="item"
                  :label="item"
                />
              </el-select>
            </CustomFormItem>
          </el-col>
          <el-col :span="colSpan">
            <CustomFormItem prop="kafka.partition_count_refresh_interval" :readonly="readonly">
              <template #label>
                <span>{{ getText('partition_count_refresh_interval.label') }}</span>
                <InfoTooltip>
                  <template #content>
                    <MarkdownContent :content="getText('partition_count_refresh_interval.desc')" />
                  </template>
                </InfoTooltip>
              </template>
              <TimeInputWithUnitSelect v-model="formData.kafka.partition_count_refresh_interval" />
            </CustomFormItem>
          </el-col>
          <el-col :span="colSpan">
            <CustomFormItem prop="kafka.max_inflight" :readonly="readonly">
              <template #label>
                <span>{{ getText('max_inflight.label') }}</span>
                <InfoTooltip :content="getText('max_inflight.desc')" />
              </template>
              <el-input v-model="formData.kafka.max_inflight" />
            </CustomFormItem>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item prop="kafka.query_mode">
              <template #label>
                <span>{{ getText('query_mode.label') }}</span>
                <InfoTooltip :content="getText('query_mode.desc')" />
              </template>
              <el-select v-model="formData.kafka.query_mode" v-if="!readonly">
                <el-option
                  v-for="item in getProducerPropItem('kafka.query_mode').symbols || []"
                  :key="item"
                  :value="item"
                  :label="t(`SchemaSymbolLabel.${item}`)"
                />
              </el-select>
              <p class="value" v-else>{{ t(`SchemaSymbolLabel.${formData.kafka.query_mode}`) }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <CustomFormItem prop="kafka.sync_query_timeout" :readonly="readonly">
              <template #label>
                <span>{{ getText('sync_query_timeout.label') }}</span>
                <InfoTooltip :content="getText('sync_query_timeout.desc')" />
              </template>
              <TimeInputWithUnitSelect v-model="formData.kafka.sync_query_timeout" />
            </CustomFormItem>
          </el-col>
          <el-col :span="colSpan">
            <CustomFormItem prop="kafka.buffer.mode" :readonly="readonly">
              <template #label>
                <span>{{ getText('buffer_mode.label') }}</span>
                <InfoTooltip>
                  <template #content>
                    <MarkdownContent :content="getText('buffer_mode.desc')" />
                  </template>
                </InfoTooltip>
              </template>
              <el-select v-model="formData.kafka.buffer.mode">
                <el-option
                  v-for="item in getProducerPropItem('kafka.buffer.mode').symbols || []"
                  :key="item"
                  :value="item"
                  :label="item"
                />
              </el-select>
            </CustomFormItem>
          </el-col>
          <el-col :span="colSpan">
            <CustomFormItem prop="kafka.buffer.per_partition_limit" :readonly="readonly">
              <template #label>
                <span>{{ getText('buffer_per_partition_limit.label') }}</span>
                <InfoTooltip :content="getText('buffer_per_partition_limit.desc')" />
              </template>
              <InputWithUnit
                v-model="formData.kafka.buffer.per_partition_limit"
                :units="usefulMemoryUnit"
              />
            </CustomFormItem>
          </el-col>
          <el-col :span="colSpan">
            <CustomFormItem prop="kafka.buffer.segment_bytes" :readonly="readonly">
              <template #label>
                <span>{{ getText('buffer_segment_bytes.label') }}</span>
                <InfoTooltip>
                  <template #content>
                    <MarkdownContent :content="getText('buffer_segment_bytes.desc')" />
                  </template>
                </InfoTooltip>
              </template>
              <InputWithUnit
                v-model="formData.kafka.buffer.segment_bytes"
                :units="usefulMemoryUnit"
              />
            </CustomFormItem>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item prop="kafka.buffer.memory_overload_protection">
              <template #label>
                <span>{{ getText('buffer_memory_overload_protection.label') }}</span>
                <InfoTooltip>
                  <template #content>
                    <MarkdownContent :content="getText('buffer_memory_overload_protection.desc')" />
                  </template>
                </InfoTooltip>
              </template>
              <el-switch
                v-model="formData.kafka.buffer.memory_overload_protection"
                :disabled="readonly"
              />
            </el-form-item>
          </el-col>
        </template>

        <!-- CONSUMER -->
        <template v-else>
          <el-col :span="colSpan">
            <CustomFormItem prop="kafka.max_batch_bytes" :readonly="readonly">
              <template #label>
                <FormItemLabel
                  :label="getText('consumer_max_batch_bytes.label')"
                  :desc="getText('consumer_max_batch_bytes.desc')"
                  desc-marked
                />
              </template>
              <InputWithUnit v-model="formData.kafka.max_batch_bytes" :units="usefulMemoryUnit" />
            </CustomFormItem>
          </el-col>
          <el-col :span="colSpan">
            <CustomFormItem prop="kafka.offset_commit_interval_seconds" :readonly="readonly">
              <template #label>
                <FormItemLabel
                  :label="getText('consumer_offset_commit_interval_seconds.label')"
                  :desc="getText('consumer_offset_commit_interval_seconds.desc')"
                  desc-marked
                />
              </template>
              <TimeInputWithUnitSelect
                v-model="formData.kafka.offset_commit_interval_seconds"
                :enabled-units="['s']"
              />
            </CustomFormItem>
          </el-col>
        </template>

        <el-col :span="colSpan">
          <CustomFormItem prop="socket_opts.sndbuf" :readonly="readonly">
            <template #label>
              <span>{{ getText('socket_send_buffer.label') }}</span>
              <InfoTooltip :content="getText('socket_send_buffer.desc')" />
            </template>
            <InputWithUnit v-model="formData.socket_opts.sndbuf" :units="usefulMemoryUnit" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="socket_opts.recbuf" :readonly="readonly">
            <template #label>
              <span>{{ getText('socket_receive_buffer.label') }}</span>
              <InfoTooltip :content="getText('socket_receive_buffer.desc')" />
            </template>
            <InputWithUnit v-model="formData.socket_opts.recbuf" :units="usefulMemoryUnit" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="socket_opts.tcp_keepalive" :readonly="readonly">
            <template #label>
              <FormItemLabel
                :label="getText('tcp_keepalive.label')"
                :desc="getText('tcp_keepalive.desc')"
                desc-marked
              />
            </template>
            <el-input v-model="formData.socket_opts.tcp_keepalive" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="socket_opts.nodelay" :readonly="readonly">
            <template #label>
              <FormItemLabel
                :label="getText('socket_nodelay.label')"
                :desc="getText('socket_nodelay.desc')"
                desc-marked
              />
            </template>
            <el-switch v-model="formData.socket_opts.nodelay" />
          </CustomFormItem>
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
import {
  fillEmptyValueToUndefinedField,
  getLabelFromValueInOptionList,
  usefulMemoryUnit,
  waitAMoment,
} from '@/common/tools'
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'
import CustomFormItem from '@/components/CustomFormItem.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import InputSelect from '@/components/InputSelect.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import ObjectArrayEditor from '@/components/ObjectArrayEditor.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useReuseBridgeInFlow from '@/hooks/Flow/useReuseBridgeInFlow'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import useGetInfoFromComponents from '@/hooks/Rule/bridge/useGetInfoFromComponents'
import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import useSchemaForm from '@/hooks/Schema/useSchemaForm'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, BridgeType, KafkaType, Role } from '@/types/enum'
import { OtherBridge } from '@/types/rule'
import { Properties } from '@/types/schemaForm'
import { isEqual, pick } from 'lodash'
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
import KafkaConsumerConfig from './KafkaConsumerConfig.vue'
import KafkaProducerConfig from './KafkaProducerConfig.vue'
import { useSymbolLabel } from '@/hooks/Schema/useItemLabelAndDesc'

enum AuthType {
  None,
  Basic,
  Kerberos,
}

enum BasicAuthEncryptType {
  Plain = 'plain',
  SHA256 = 'scram_sha_256',
  SHA512 = 'scram_sha_512',
}

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
  fixedRole: {
    type: String as PropType<Role>,
  },
  isUsingInFlow: {
    type: Boolean,
  },
})
const emit = defineEmits(['update:modelValue', 'init'])

const { t, tl } = useI18nTl('RuleEngine')
const { getOptLabel } = useSymbolLabel()
const getText = (key: string) => t(`BridgeSchema.emqx_ee_bridge_kafka.${key}`)

const {
  components: producerComponents,
  schemaLoadPromise,
  getComponents,
} = useSchemaForm(`/api/v5/schemas/bridges`, {
  ref: '#/components/schemas/bridge_kafka.post_producer',
})
const { getPropItem: getProducerPropItem } = useGetInfoFromComponents(producerComponents)
const consumerComponents: Ref<Properties> = ref({})
const addLabelForProps = (type: 'consumer' | 'producer', props: Properties) => {
  Object.entries(props).forEach(([, value]) => {
    // Distinguish the description of the duplicate `MQTT Topic` field for Consumer and Producer.
    if (type === 'consumer' && value.key === 'mqtt_topic') {
      value.description = getText('consumer_mqtt_topic.desc')
    } else {
      value.description = getText(`${value.key}.desc`)
    }
    value.label = getText(`${value.key}.label`)
  })
  return props
}

const getKafkaAllRoleComponents = async () => {
  await schemaLoadPromise
  consumerComponents.value = getComponents({
    ref: '#/components/schemas/bridge_kafka.post_consumer',
  })
  if (consumerComponents.value.topic_mapping.items.properties) {
    consumerComponents.value.topic_mapping.items.properties = addLabelForProps(
      'consumer',
      consumerComponents.value.topic_mapping.items.properties as Properties,
    )
  }
  if (producerComponents.value.kafka.properties?.kafka_ext_headers.items) {
    producerComponents.value.kafka.properties.kafka_ext_headers.items.properties = addLabelForProps(
      'producer',
      producerComponents.value.kafka.properties.kafka_ext_headers.items.properties as Properties,
    )
  }
}
getKafkaAllRoleComponents()
const { getPropItem: getConsumerPropItem } = useGetInfoFromComponents(consumerComponents)

const isEditingConsumer =
  (props.edit || props.copy) && props.modelValue?.type === KafkaType.Consumer
const role = ref<Role>(props.fixedRole || (isEditingConsumer ? Role.Consumer : Role.Producer))
const roleMap = [
  { value: Role.Producer, label: tl('producer') },
  { value: Role.Consumer, label: tl('consumer') },
]
const { createKafkaDefaultValCommonPart, createRawKafkaProducerForm, createRawKafkaConsumerForm } =
  useBridgeFormCreator()

const getDefaultForm = () =>
  role.value === Role.Producer ? createRawKafkaProducerForm() : createRawKafkaConsumerForm()

const formCom = ref()
const { createRequiredRule, createCommonIdRule } = useFormRules()
const { ruleWhenEditing } = useSpecialRuleForPassword(props)
const formRules = computed<any>(() => {
  const ret = {
    name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
    bootstrap_hosts: createRequiredRule(getText('bootstrap_hosts.label')),
    authentication: {
      mechanism: createRequiredRule(tl('mechanism')),
      username: createRequiredRule(tl('username')),
      password: [...createRequiredRule(tl('password')), ...ruleWhenEditing],
      kerberos_keytab_file: createRequiredRule(tl('kerberosKeytabFile')),
      kerberos_principal: createRequiredRule(tl('kerberosPrincipal')),
    },
    kafka: { topic: createRequiredRule(tl('kafkaProducerTopic')) },
    topic_mapping: [{ message: tl('topicMappingRequired'), required: true }],
  }
  return ret
})

const formData: Ref<OtherBridge> = ref(getDefaultForm())

const { isCreateBridgeInFlow, isBridgeSelected, getBridgesInSameType, handleNameChange } =
  useReuseBridgeInFlow(
    BridgeType.Kafka,
    props,
    formData,
    role.value === Role.Consumer ? BridgeDirection.Ingress : BridgeDirection.Egress,
  )
const nameOptions = computed(() => getBridgesInSameType()?.map(({ name }) => name))
watch(isBridgeSelected, async (nVal, oVal) => {
  if (!nVal && oVal) {
    const name = formData.value.name
    formData.value = Object.assign(getDefaultForm(), { name })
    await waitAMoment()
    formCom.value?.clearValidate?.()
  }
})

const colSpan = computed(() => (props.isUsingInFlow ? 24 : 12))

const updateParentBridgeData = () => {
  emit('update:modelValue', formData.value)
}

const commonPartKeys = Object.keys(createKafkaDefaultValCommonPart())
const handleRoleChanged = () => {
  if (role.value === Role.Consumer) {
    formData.value = { ...createRawKafkaConsumerForm(), ...pick(formData.value, commonPartKeys) }
  } else {
    formData.value = { ...createRawKafkaProducerForm(), ...pick(formData.value, commonPartKeys) }
  }
}

watch(formData, updateParentBridgeData, { deep: true })

const initFormData = async () => {
  if (!props.modelValue) {
    return
  }
  if (props.edit || props.copy) {
    role.value = props.modelValue.type === KafkaType.Consumer ? Role.Consumer : Role.Producer
    formData.value = fillEmptyValueToUndefinedField(
      props.modelValue as Record<string, any>,
      getDefaultForm(),
    )
    emit('init', formData.value)
  } else {
    formData.value = { ...formData.value, ...props.modelValue }
  }
}

const judgeAuthType = () => {
  const auth = formData.value.authentication
  if (auth === 'none') {
    return AuthType.None
  }
  if (typeof auth === 'object') {
    if ('mechanism' in auth) {
      return AuthType.Basic
    }
    if ('kerberos_principal' in auth) {
      return AuthType.Kerberos
    }
  }
  return AuthType.None
}
const authType = computed({
  get: judgeAuthType,
  set(val) {
    if (val === AuthType.None) {
      formData.value.authentication = 'none'
    } else if (val === AuthType.Basic) {
      formData.value.authentication = {
        mechanism: '',
        username: '',
        password: '',
      }
    } else if (val === AuthType.Kerberos) {
      formData.value.authentication = {
        kerberos_principal: '',
        kerberos_keytab_file: '',
      }
    }
  },
})
const authTypeOptList = [
  { value: AuthType.None, label: t('Base.none') },
  { value: AuthType.Basic, label: tl('basicAuth') },
  { value: AuthType.Kerberos, label: 'Kerberos' },
]
const mechanismOptList = [
  { value: BasicAuthEncryptType.Plain, label: 'Plain' },
  { value: BasicAuthEncryptType.SHA256, label: 'SHA256' },
  { value: BasicAuthEncryptType.SHA512, label: 'SHA512' },
]

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
