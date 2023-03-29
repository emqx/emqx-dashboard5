<template>
  <div class="bridge-config bridge-kafka-config">
    <el-form
      ref="formCom"
      label-position="top"
      :rules="formRules"
      :model="formData"
      :validate-on-rule-change="false"
    >
      <el-row :gutter="26">
        <el-col :span="12">
          <el-form-item :label="tl('name')" prop="name">
            <el-input v-model="formData.name" :disabled="edit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
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
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider />

      <el-row :gutter="26">
        <el-col :span="12">
          <el-form-item prop="bootstrap_hosts">
            <template #label>
              <span>{{ getProducerPropItem('bootstrap_hosts').label }}</span>
              <InfoTooltip>
                <template #content>
                  <MarkdownContent :content="getProducerPropItem('bootstrap_hosts').description" />
                </template>
              </InfoTooltip>
            </template>
            <el-input v-model="formData.bootstrap_hosts" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="min_metadata_refresh_interval">
            <template #label>
              <span>{{ getProducerPropItem('min_metadata_refresh_interval').label }}</span>
              <InfoTooltip
                :content="getProducerPropItem('min_metadata_refresh_interval').description"
              />
            </template>
            <TimeInputWithUnitSelect v-model="formData.min_metadata_refresh_interval" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="t('components.authentication')">
            <el-select v-model="authType">
              <el-option
                v-for="{ value, label } in authTypeOptList"
                :key="value"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- For Basic -->
        <template v-if="authType === AuthType.Basic">
          <el-col :span="12">
            <el-form-item prop="authentication.mechanism">
              <template #label>
                <span>{{ tl('mechanism') }}</span>
                <InfoTooltip :content="tl('mechanismDesc')" />
              </template>
              <el-select v-model="formData.authentication.mechanism">
                <el-option
                  v-for="{ value, label } in mechanismOptList"
                  :key="value"
                  :label="label"
                  :value="value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="authentication.username" :label="tl('username')">
              <el-input v-model="formData.authentication.username" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="authentication.password" :label="tl('password')">
              <el-input
                v-model="formData.authentication.password"
                type="password"
                autocomplete="one-time-code"
                show-password
              />
            </el-form-item>
          </el-col>
        </template>
        <!-- For Kerberos -->
        <template v-else-if="authType === AuthType.Kerberos">
          <el-col :span="12">
            <el-form-item prop="authentication.kerberos_principal">
              <template #label>
                <span>{{ tl('kerberosPrincipal') }}</span>
                <InfoTooltip>
                  <template #content>
                    <p v-safe-html="tl('kerberosPrincipalDesc')"></p>
                  </template>
                </InfoTooltip>
              </template>
              <el-input v-model="formData.authentication.kerberos_principal" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="authentication.kerberos_keytab_file">
              <template #label>
                <span>{{ tl('kerberosKeytabFile') }}</span>
                <InfoTooltip :content="tl('kerberosKeytabFileDesc')" />
              </template>
              <el-input
                v-model="formData.authentication.kerberos_keytab_file"
                :placeholder="tl('filePathPlease')"
              />
            </el-form-item>
          </el-col>
        </template>

        <el-col :span="12">
          <el-form-item prop="metadata_request_timeout">
            <template #label>
              <span>{{ getProducerPropItem('metadata_request_timeout').label }}</span>
              <InfoTooltip :content="getProducerPropItem('metadata_request_timeout').description" />
            </template>
            <TimeInputWithUnitSelect v-model="formData.metadata_request_timeout" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="connect_timeout">
            <template #label>
              <span>{{ getProducerPropItem('connect_timeout').label }}</span>
              <InfoTooltip :content="getProducerPropItem('connect_timeout').description" />
            </template>
            <TimeInputWithUnitSelect v-model="formData.connect_timeout" />
          </el-form-item>
        </el-col>
        <!-- ssl -->
        <el-col :span="24">
          <CommonTLSConfig v-model="formData.ssl" :is-edit="edit" :content="tl('kafkaSniDesc')" />
        </el-col>

        <el-col :span="24"><el-divider /></el-col>

        <!-- producer -->
        <template v-if="role === Role.Producer">
          <el-col :span="12">
            <el-form-item prop="local_topic">
              <template #label>
                <span>{{ getProducerPropItem('local_topic').label }}</span>
                <InfoTooltip :content="getProducerPropItem('local_topic').description" />
              </template>
              <el-input v-model="formData.local_topic" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <KafkaProducerConfig
              v-model="formData.kafka"
              :schema-components="getProducerPropItem('kafka').properties"
            />
          </el-col>
        </template>

        <!-- Consumer -->
        <template v-else>
          <el-col :span="12">
            <el-form-item prop="key_encoding_mode">
              <template #label>
                <span>{{ getConsumerPropItem('key_encoding_mode').label }}</span>
                <InfoTooltip>
                  <template #content>
                    <MarkdownContent
                      :content="getConsumerPropItem('key_encoding_mode').description"
                    />
                  </template>
                </InfoTooltip>
              </template>
              <el-select v-model="formData.key_encoding_mode">
                <el-option
                  v-for="item in getConsumerPropItem('key_encoding_mode').symbols || []"
                  :key="item"
                  :value="item"
                  :label="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="value_encoding_mode">
              <template #label>
                <span>{{ getConsumerPropItem('value_encoding_mode').label }}</span>
                <InfoTooltip>
                  <template #content>
                    <MarkdownContent
                      :content="getConsumerPropItem('value_encoding_mode').description"
                    />
                  </template>
                </InfoTooltip>
              </template>
              <el-select v-model="formData.value_encoding_mode">
                <el-option
                  v-for="item in getConsumerPropItem('value_encoding_mode').symbols || []"
                  :key="item"
                  :value="item"
                  :label="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="topic_mapping">
              <template #label>
                <span>{{ getConsumerPropItem('topic_mapping').label }}</span>
                <InfoTooltip :content="getConsumerPropItem('topic_mapping').description" />
              </template>
              <ObjectArrayEditor
                v-model="formData.topic_mapping"
                :properties="consumerComponents?.topic_mapping?.properties"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <KafkaConsumerConfig
              v-model="formData.kafka"
              :schema-components="getConsumerPropItem('kafka').properties"
            />
          </el-col>
        </template>

        <el-col :span="24"><el-divider /></el-col>

        <!-- socket opt -->
        <el-col :span="12">
          <el-form-item prop="socket_opts.sndbuf">
            <template #label>
              <span>{{ getProducerPropItem('socket_opts.sndbuf').label }}</span>
              <InfoTooltip :content="getProducerPropItem('socket_opts.sndbuf').description" />
            </template>
            <InputWithUnit v-model="formData.socket_opts.sndbuf" :units="usefulMemoryUnit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="socket_opts.recbuf">
            <template #label>
              <span>{{ getProducerPropItem('socket_opts.recbuf').label }}</span>
              <InfoTooltip :content="getProducerPropItem('socket_opts.recbuf').description" />
            </template>
            <InputWithUnit v-model="formData.socket_opts.recbuf" :units="usefulMemoryUnit" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { fillEmptyValueToUndefinedField, usefulMemoryUnit } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import ObjectArrayEditor from '@/components/ObjectArrayEditor.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useSchemaForm from '@/hooks/Config/useSchemaForm'
import useGetInfoFromComponents from '@/hooks/Rule/bridge/useGetInfoFromComponents'
import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import useSSL from '@/hooks/useSSL'
import { KafkaType } from '@/types/enum'
import { OtherBridge } from '@/types/rule'
import { Properties } from '@/types/schemaForm'
import { isEqual, pick } from 'lodash'
import { computed, defineEmits, defineExpose, defineProps, onMounted, ref, Ref, watch } from 'vue'
import { useStore } from 'vuex'
import KafkaConsumerConfig from './KafkaConsumerConfig.vue'
import KafkaProducerConfig from './KafkaProducerConfig.vue'

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

enum Role {
  Producer,
  Consumer,
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
})
const emit = defineEmits(['update:modelValue', 'init'])

const { state } = useStore()
const { t, tl } = useI18nTl('RuleEngine')

const {
  components: producerComponents,
  schemaLoadPromise,
  getComponents,
} = useSchemaForm(`static/bridge-api-${state.lang}.json`, {
  ref: '#/components/schemas/bridge_kafka.post_producer',
})
const { getPropItem: getProducerPropItem } = useGetInfoFromComponents(producerComponents)
const consumerComponents: Ref<Properties> = ref({})
const getConsumerComponents = async () => {
  await schemaLoadPromise
  consumerComponents.value = getComponents({
    ref: '#/components/schemas/bridge_kafka.post_consumer',
  })
}
getConsumerComponents()
const { getPropItem: getConsumerPropItem } = useGetInfoFromComponents(consumerComponents)

const role = ref<Role>(
  (props.edit || props.copy) && props.modelValue && props.modelValue.type === KafkaType.Consumer
    ? Role.Consumer
    : Role.Producer,
)
const roleMap = [
  { value: Role.Producer, label: tl('producer') },
  { value: Role.Consumer, label: tl('consumer') },
]
const { createSSLForm } = useSSL()
const createDefaultCommonPart = () => ({
  name: '',
  bootstrap_hosts: '',
  connect_timeout: '5s',
  min_metadata_refresh_interval: '3s',
  metadata_request_timeout: '5s',
  authentication: 'none',
  socket_opts: {
    sndbuf: '1024KB',
    recbuf: '1024KB',
  },
  ssl: createSSLForm(),
})
const createDefaultProducerValue = () => ({
  type: KafkaType.Producer,
  ...createDefaultCommonPart(),
  kafka: {
    topic: '',
    message: {
      key: '${.clientid}',
      value: '${.}',
      timestamp: '${.timestamp}',
    },
    max_batch_bytes: '896KB',
    compression: 'no_compression',
    partition_strategy: 'random',
    required_acks: 'all_isr',
    partition_count_refresh_interval: '60s',
    max_inflight: 10,
    buffer: {
      mode: 'memory',
      per_partition_limit: '2GB',
      segment_bytes: '100MB',
      memory_overload_protection: false,
    },
  },
})

const createDefaultConsumer = () => ({
  type: KafkaType.Consumer,
  ...createDefaultCommonPart(),
  topic_mapping: [],
  kafka: {
    max_batch_bytes: '896KB',
    offset_reset_policy: 'latest',
    offset_commit_interval_seconds: 5,
  },
  key_encoding_mode: 'none',
  value_encoding_mode: 'none',
})

const getDefaultForm = () =>
  role.value === Role.Producer ? createDefaultProducerValue() : createDefaultConsumer()

const formCom = ref()
const { createRequiredRule, createCommonIdRule } = useFormRules()
const { ruleWhenTestConnection } = useSpecialRuleForPassword(props)
const formRules = computed(() => {
  const ret = {
    name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
    bootstrap_hosts: createRequiredRule(getProducerPropItem('bootstrap_hosts').label),
    authentication: {
      mechanism: createRequiredRule(tl('mechanism')),
      username: createRequiredRule(tl('username')),
      password: [...createRequiredRule(tl('password')), ...ruleWhenTestConnection],
      kerberos_keytab_file: createRequiredRule(tl('kerberosKeytabFile')),
      kerberos_principal: createRequiredRule(tl('kerberosPrincipal')),
    },
    kafka: { topic: createRequiredRule(tl('kafkaProducerTopic')) },
    topic_mapping: createRequiredRule(getConsumerPropItem('topic_mapping').label),
  }
  return ret
})

const formData: Ref<OtherBridge> = ref(getDefaultForm())

const updateParentBridgeData = () => {
  emit('update:modelValue', formData.value)
}

const commonPartKeys = Object.keys(createDefaultCommonPart())
const handleRoleChanged = () => {
  if (role.value === Role.Consumer) {
    formData.value = { ...createDefaultConsumer(), ...pick(formData.value, commonPartKeys) }
  } else {
    formData.value = { ...createDefaultProducerValue(), ...pick(formData.value, commonPartKeys) }
  }
}

watch(formData, updateParentBridgeData, { deep: true })

const resetFormDataWhenEdit = async () => {
  if ((props.edit || props.copy) && props.modelValue) {
    role.value = props.modelValue.type === KafkaType.Producer ? Role.Producer : Role.Consumer
    formData.value = fillEmptyValueToUndefinedField(
      props.modelValue as Record<string, any>,
      getDefaultForm(),
    )
    emit('init', formData.value)
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
  { value: AuthType.None, label: 'None' },
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
      resetFormDataWhenEdit()
    }
  },
)

onMounted(() => {
  if (!props.edit && !props.copy) {
    updateParentBridgeData()
  } else if ((props.edit || props.copy) && props.modelValue) {
    resetFormDataWhenEdit()
  }
})

defineExpose({ validate, clearValidate })
</script>

<style lang="scss">
@import '~@/style/rule.scss';
.bridge-kafka-config {
  .el-tabs {
    width: 100%;
    .el-card {
      margin-bottom: 16px;
    }
  }
  .broker-block-title {
    margin-top: 0;
    font-size: 16px;
  }
  .trans-desc {
    margin: 20px 0;
  }
}
</style>
