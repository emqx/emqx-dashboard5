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
    <template v-if="!hideName">
      <el-row :gutter="26">
        <el-col :span="colSpan">
          <CustomFormItem :label="tl('name')" prop="name" :readonly="readonly">
            <el-input v-model="formData.name" :disabled="edit" />
          </CustomFormItem>
        </el-col>
      </el-row>
      <el-divider />
    </template>

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
              v-for="item in getPropItem('key_encoding_mode').symbols || []"
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
              v-for="item in getPropItem('value_encoding_mode').symbols || []"
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
            :disabled="disabled"
          />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.offset_reset_policy" :readonly="readonly">
          <template #label>
            <FormItemLabel
              :label="getText('consumer_offset_reset_policy.label')"
              :desc="getText('consumer_offset_reset_policy.desc')"
              desc-marked
            />
          </template>
          <el-select v-model="formData.kafka.offset_reset_policy">
            <el-option
              v-for="item in getPropItem('kafka.offset_reset_policy').symbols || []"
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

        <!-- CONSUMER -->
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

        <el-col :span="colSpan">
          <CustomFormItem prop="socket_opts.sndbuf" :readonly="readonly">
            <template #label>
              <span>{{ getCommonText('sndbuf.label') }}</span>
              <InfoTooltip :content="getCommonText('sndbuf.desc')" />
            </template>
            <InputWithUnit v-model="formData.socket_opts.sndbuf" :units="usefulMemoryUnit" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="socket_opts.recbuf" :readonly="readonly">
            <template #label>
              <span>{{ getCommonText('recbuf.label') }}</span>
              <InfoTooltip :content="getCommonText('recbuf.desc')" />
            </template>
            <InputWithUnit v-model="formData.socket_opts.recbuf" :units="usefulMemoryUnit" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="socket_opts.tcp_keepalive" :readonly="readonly">
            <template #label>
              <FormItemLabel
                :label="getCommonText('tcp_keepalive.label')"
                :desc="getCommonText('tcp_keepalive.desc')"
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
                :label="getCommonText('nodelay.label')"
                :desc="getCommonText('nodelay.desc')"
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
  getAPIPath,
  getLabelFromValueInOptionList,
  usefulMemoryUnit,
} from '@/common/tools'
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'
import CustomFormItem from '@/components/CustomFormItem.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import ObjectArrayEditor from '@/components/ObjectArrayEditor.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import useGetInfoFromComponents from '@/hooks/Rule/bridge/useGetInfoFromComponents'
import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import { useSymbolLabel } from '@/hooks/Schema/useItemLabelAndDesc'
import useSchemaForm from '@/hooks/Schema/useSchemaForm'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { OtherBridge } from '@/types/rule'
import { Properties } from '@/types/schemaForm'
import { isEqual } from 'lodash'
import { Ref, computed, defineEmits, defineExpose, defineProps, onMounted, ref, watch } from 'vue'

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

const { t, tl } = useI18nTl('RuleEngine')
const { getOptLabel } = useSymbolLabel()
const getText = (key: string) => t(`BridgeSchema.kafka_consumer.${key}`)
const getCommonText = (key: string) => t(`BridgeSchema.common.${key}`)

const { components: consumerComponents, schemaLoadPromise } = useSchemaForm(
  getAPIPath(`/schemas/bridges`),
  { ref: '#/components/schemas/bridge_kafka.post_consumer' },
)
const addLabelForProps = (props: Properties) => {
  Object.entries(props).forEach(([, value]) => {
    // Distinguish the description of the duplicate `MQTT Topic` field for Consumer and Producer.
    if (value.key === 'mqtt_topic') {
      value.description = getText('consumer_mqtt_topic.desc')
    }
    if (value.key === 'kafka_topic') {
      value.description = getText('topic.desc')
    }
    if (value.key === 'kafka_topic') {
      value.label = getText('topic.label')
    } else {
      value.label = getText(`${value.key}.label`)
    }
  })
  return props
}

const addLabelForTopicMapping = async () => {
  await schemaLoadPromise
  if (consumerComponents.value.topic_mapping.items.properties) {
    consumerComponents.value.topic_mapping.items.properties = addLabelForProps(
      consumerComponents.value.topic_mapping.items.properties as Properties,
    )
  }
}
addLabelForTopicMapping()
const { getPropItem } = useGetInfoFromComponents(consumerComponents)

const { createRawKafkaConsumerForm } = useBridgeFormCreator()

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
    topic_mapping: [{ message: tl('topicMappingRequired'), required: true }],
  }
  return ret
})

const formData: Ref<OtherBridge> = ref(createRawKafkaConsumerForm())

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
      createRawKafkaConsumerForm(),
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
