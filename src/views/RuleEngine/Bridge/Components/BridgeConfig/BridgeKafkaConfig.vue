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
      </el-row>

      <el-divider />

      <el-row :gutter="26">
        <el-col :span="12">
          <el-form-item prop="bootstrap_hosts">
            <template #label>
              <span>{{ tl('bootstrapHosts') }}</span>
              <!-- TODO: markdown -->
              <InfoTooltip>
                <template #content>
                  <MarkdownContent :content="tl('bootstrapHostsDesc')" />
                </template>
              </InfoTooltip>
            </template>
            <el-input v-model="formData.bootstrap_hosts" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="min_metadata_refresh_interval">
            <template #label>
              <span>{{ tl('minMetadataRefreshInterval') }}</span>
              <InfoTooltip :content="tl('minMetadataRefreshIntervalDesc')" />
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
              <span>{{ tl('metadataRequestTimeout') }}</span>
              <InfoTooltip :content="tl('metadataRequestTimeoutDesc')" />
            </template>
            <TimeInputWithUnitSelect v-model="formData.metadata_request_timeout" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="connect_timeout">
            <template #label>
              <span>{{ tl('connTimeout') }}</span>
              <InfoTooltip :content="tl('connectTimeoutDesc')" />
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
        <el-col :span="24">
          <el-tabs v-model="activeDirection" type="card">
            <el-tab-pane :label="tl('producer')" :name="StreamDirection.In" lazy>
              <p class="trans-desc">{{ tl('producerDesc') }}</p>
              <el-card class="app-card with-border" shadow="never">
                <p class="broker-block-title">MQTT</p>
                <el-row :gutter="26">
                  <el-col :span="12">
                    <el-form-item prop="producer.mqtt.topic" :label="t('Base.topic')">
                      <el-input v-model="formData.producer.mqtt.topic" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-card>
              <el-card class="app-card with-border" shadow="never">
                <p class="broker-block-title">Kafka</p>
                <KafkaProducerKafkaConfig v-model="formData.producer.kafka" />
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-col>

        <el-col :span="24"><el-divider /></el-col>

        <!-- socket opt -->
        <el-col :span="12">
          <el-form-item prop="socket_opts.sndbuf">
            <template #label>
              <span>{{ tl('sndbuf') }}</span>
              <InfoTooltip :content="tl('sndbufDesc')" />
            </template>
            <InputWithUnit v-model="formData.socket_opts.sndbuf" :units="usefulMemoryUnit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="socket_opts.recbuf">
            <template #label>
              <span>{{ tl('recbuf') }}</span>
              <InfoTooltip :content="tl('recbufDesc')" />
            </template>
            <InputWithUnit v-model="formData.socket_opts.recbuf" :units="usefulMemoryUnit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="socket_opts.nodelay">
            <template #label>
              <span>{{ tl('nodelay') }}</span>
              <InfoTooltip :content="tl('nodelayDesc')" />
            </template>
            <el-switch v-model="formData.socket_opts.nodelay" />
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
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import useSSL from '@/hooks/useSSL'
import { defineExpose, defineProps, ref, computed, Ref, defineEmits, watch, onMounted } from 'vue'
import KafkaProducerKafkaConfig from './KafkaProducerKafkaConfig.vue'
import { BridgeType } from '@/types/enum'
import MarkdownContent from '@/components/MarkdownContent.vue'
import { isEqual } from 'lodash'

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

enum StreamDirection {
  In,
  Out,
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

const { t, tl } = useI18nTl('RuleEngine')

const { createSSLForm } = useSSL()
const createDefaultValue = () => ({
  type: BridgeType.Kafka,
  name: '',
  bootstrap_hosts: '',
  connect_timeout: '5s',
  min_metadata_refresh_interval: '3s',
  metadata_request_timeout: '5s',
  authentication: 'none',
  producer: {
    mqtt: {
      topic: '',
    },
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
        memory_overload_protection: true,
      },
    },
  },
  socket_opts: {
    sndbuf: '1024KB',
    recbuf: '1024KB',
    nodelay: true,
  },
  ssl: createSSLForm(),
})

const formCom = ref()
const { createRequiredRule } = useFormRules()
const formRules = {
  name: createRequiredRule(tl('name')),
  bootstrap_hosts: createRequiredRule(tl('bootstrapHosts')),
  authentication: {
    mechanism: createRequiredRule(tl('mechanism')),
    username: createRequiredRule(tl('username')),
    password: createRequiredRule(tl('password')),
    kerberos_keytab_file: createRequiredRule(tl('kerberosKeytabFile')),
    kerberos_principal: createRequiredRule(tl('kerberosPrincipal')),
  },
  producer: {
    kafka: {
      topic: createRequiredRule(tl('kafkaProducerTopic')),
    },
  },
}

const formData: Ref<any> = ref(createDefaultValue())

const updateParentBridgeData = () => {
  emit('update:modelValue', formData.value)
}

watch(formData.value, updateParentBridgeData)

const resetFormDataWhenEdit = () => {
  if ((props.edit || props.copy) && props.modelValue) {
    formData.value = fillEmptyValueToUndefinedField(
      props.modelValue as Record<string, any>,
      createDefaultValue(),
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

const activeDirection = ref(StreamDirection.In)

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
  if (!props.edit) {
    updateParentBridgeData()
  } else if (props.edit && props.modelValue) {
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
