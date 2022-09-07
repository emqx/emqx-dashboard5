<template>
  <div class="bridge-influxdb-config">
    <el-form ref="formCom" label-position="top" :rules="formRules" :model="formData">
      <el-row :gutter="26">
        <el-col :span="12">
          <el-form-item :label="tl('name')" prop="name">
            <el-input v-model="formData.name" :disabled="edit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('influxDBVersion')">
            <el-select v-model="formData.type">
              <el-option
                v-for="{ value, label } in PROTOCOL_VERSION_OPT"
                :value="value"
                :key="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider />
      <el-row :gutter="26">
        <el-col :span="12">
          <el-form-item prop="server">
            <template #label>
              <span>{{ tl('serverHost') }}</span>
              <InfoTooltip>
                <template #content>
                  <p v-html="tl('serverHostDesc')"></p>
                </template>
              </InfoTooltip>
            </template>
            <el-input v-model="formData.server" />
          </el-form-item>
        </el-col>
        <!-- For v1 -->
        <el-col :span="12" v-if="formData.type === InfluxDBType.v1">
          <el-form-item prop="database">
            <template #label>
              <span>{{ tl('database') }}</span>
              <InfoTooltip :content="tl('databaseDesc')" />
            </template>
            <el-input v-model="formData.database" />
          </el-form-item>
        </el-col>
        <!-- For v2 -->
        <el-col :span="12" v-else-if="formData.type === InfluxDBType.v2">
          <el-form-item :label="tl('authType')">
            <el-select v-model="v2AuthType">
              <el-option
                v-for="{ label, value } in V2_AUTH_TYPE_OPT"
                :value="value"
                :key="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <template v-if="showBasicAuthForm">
          <el-col :span="12">
            <el-form-item prop="username">
              <template #label>
                <span>{{ tl('username') }}</span>
                <InfoTooltip :content="tl('usernameDesc')" />
              </template>
              <el-input v-model="formData.username" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="password">
              <template #label>
                <span>{{ tl('password') }}</span>
                <InfoTooltip :content="tl('passwordDesc')" />
              </template>
              <el-input v-model="formData.password" type="password" autocomplete="one-time-code" />
            </el-form-item>
          </el-col>
        </template>
        <!-- For v2 -->
        <el-col
          :span="12"
          v-else-if="formData.type === InfluxDBType.v2 && v2AuthType === V2AuthType.Token"
        >
          <el-form-item prop="token">
            <template #label>
              <span>{{ tl('token') }}</span>
              <InfoTooltip :content="tl('tokenDesc')" />
            </template>
            <el-input v-model="formData.token" />
          </el-form-item>
        </el-col>

        <!-- For v2 -->
        <template v-if="formData.type === InfluxDBType.v2">
          <el-col :span="12">
            <el-form-item prop="org">
              <template #label>
                <span>{{ tl('org') }}</span>
                <InfoTooltip :content="tl('orgDesc')" />
              </template>
              <el-input v-model="formData.org" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="bucket">
              <template #label>
                <span>{{ tl('bucket') }}</span>
                <InfoTooltip :content="tl('bucketDesc')" />
              </template>
              <el-input v-model="formData.bucket" />
            </el-form-item>
          </el-col>
        </template>

        <el-col :span="12">
          <el-form-item prop="precision">
            <template #label>
              <span>{{ tl('precision') }}</span>
              <InfoTooltip :content="tl('precisionDesc')" />
            </template>
            <el-select v-model="formData.precision">
              <el-option
                v-for="item in ['ns', 'us', 'ms', 's', 'm', 'h']"
                :value="item"
                :key="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="resource_opts.worker_pool_size">
            <template #label>
              <span>{{ tl('workerPoolSize') }}</span>
              <InfoTooltip :content="tl('workerPoolSizeDesc')" />
            </template>
            <el-input v-model="formData.resource_opts.worker_pool_size" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="resource_opts.health_check_interval">
            <template #label>
              <span>{{ tl('healthCheckInterval') }}</span>
              <InfoTooltip :content="tl('healthCheckIntervalDesc')" />
            </template>
            <TimeInputWithUnitSelect v-model="formData.resource_opts.health_check_interval" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="resource_opts.auto_restart_interval">
            <template #label>
              <span>{{ tl('autoRestartInterval') }}</span>
              <InfoTooltip :content="tl('autoRestartIntervalDesc')" />
            </template>
            <Oneof
              v-model="formData.resource_opts.auto_restart_interval"
              :items="[{ type: 'duration' }, { symbols: ['infinity'], type: 'enum' }]"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item prop="write_syntax">
            <template #label>
              <span>{{ tl('writeSyntax') }}</span>
              <InfoTooltip popper-class="is-wider">
                <template #content>
                  <p v-html="escapeCode(transLink(tl('writeSyntaxDesc')))"></p>
                </template>
              </InfoTooltip>
            </template>
            <div class="monaco-container">
              <Monaco :id="createRandomString()" v-model="formData.write_syntax" lang="sql" />
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <CommonTLSConfig class="tls-config-form" v-model="formData.ssl" :is-edit="edit" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { createRandomString, escapeCode, transLink } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import Monaco from '@/components/Monaco.vue'
import Oneof from '@/components/Oneof.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { isEqual } from 'lodash'
import { computed, defineEmits, defineProps, ref, watch, defineExpose } from 'vue'
import useSSL from '@/hooks/useSSL'

const props = defineProps({
  modelValue: {
    type: Object,
  },
  edit: {
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue'])

const { tl } = useI18nTl('RuleEngine')

const enum InfluxDBType {
  v1 = 'influxdb_api_v1',
  v2 = 'influxdb_api_v2',
}
const enum V2AuthType {
  Token = 'token',
  Basic = 'basic',
}

const PROTOCOL_VERSION_OPT = [
  { value: InfluxDBType.v1, label: 'v1' },
  { value: InfluxDBType.v2, label: 'v2' },
]
const V2_AUTH_TYPE_OPT = [
  { value: V2AuthType.Token, label: tl('token') },
  { value: V2AuthType.Basic, label: tl('basicAuth') },
]

const { createSSLForm } = useSSL()
const createDefaultValue = () => ({
  type: InfluxDBType.v2,
  name: '',
  local_topic: '',
  write_syntax: '',
  server: '127.0.0.1:8086',
  precision: 'ms',
  database: '',
  username: '',
  password: '',
  ssl: createSSLForm(),
  bucket: '',
  org: '',
  token: '',
  // TODO: use func
  resource_opts: {
    worker_pool_size: 16,
    health_check_interval: '15s',
    auto_restart_interval: '60s',
    query_mode: 'sync',
    async_inflight_window: 100,
    enable_batch: false,
    batch_size: 100,
    batch_time: '10ms',
    enable_queue: false,
    max_queue_bytes: '1GB',
  },
})

const formData = ref({ ...createDefaultValue(), ...props.modelValue })
const formCom = ref()

const v2AuthType = ref(V2AuthType.Token)

const { createRequiredRule } = useFormRules()
const commonRules = {
  name: createRequiredRule(tl('name')),
  server: createRequiredRule(tl('serverHost')),
  write_syntax: createRequiredRule(tl('writeSyntax')),
}

const rulesForV1 = {
  database: createRequiredRule(tl('database')),
}

const rulesForV2 = {
  token: createRequiredRule(tl('token')),
  org: createRequiredRule(tl('org')),
  bucket: createRequiredRule(tl('bucket')),
  username: createRequiredRule(tl('username')),
  password: createRequiredRule(tl('password')),
}

const formRules = computed(() => ({
  ...commonRules,
  ...(formData.value.type === InfluxDBType.v1 ? rulesForV1 : rulesForV2),
}))

const showBasicAuthForm = computed(
  () =>
    formData.value.type === InfluxDBType.v1 ||
    (formData.value.type === InfluxDBType.v2 && v2AuthType.value === V2AuthType.Basic),
)

watch(formData.value, () => {
  emit('update:modelValue', formData.value)
})

watch(
  () => props.modelValue,
  (val) => {
    if (!isEqual(val, formData.value)) {
      formData.value = { ...createDefaultValue(), ...val }
    }
  },
)

const validate = () => {
  return formCom.value.validate()
}

const clearValidate = () => {
  return formCom.value?.clearValidate()
}

defineExpose({ validate, clearValidate })
</script>

<style lang="scss"></style>
