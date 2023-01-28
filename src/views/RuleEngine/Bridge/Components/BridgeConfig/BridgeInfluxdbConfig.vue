<template>
  <div class="bridge-influxdb-config">
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
          <el-form-item :label="tl('influxDBVersion')">
            <el-select v-model="formData.type" :disabled="edit" @change="handleVersionChanged">
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
              <span>{{ getPropItem('server').label }}</span>
              <InfoTooltip>
                <template #content>
                  <MarkdownContent :content="getPropItem('server').description" />
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
        <template v-if="formData.type === InfluxDBType.v1">
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
              <el-input
                v-model="formData.password"
                type="password"
                autocomplete="one-time-code"
                show-password
              />
            </el-form-item>
          </el-col>
        </template>
        <!-- For v2 -->
        <template v-if="formData.type === InfluxDBType.v2">
          <el-col :span="12">
            <el-form-item prop="token">
              <template #label>
                <span>{{ getPropItem('token').label }}</span>
                <InfoTooltip :content="getPropItem('token').description" />
              </template>
              <el-input v-model="formData.token" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="org">
              <template #label>
                <span>{{ getPropItem('org').label }}</span>
                <InfoTooltip :content="getPropItem('org').description" />
              </template>
              <el-input v-model="formData.org" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="bucket">
              <template #label>
                <span>{{ getPropItem('bucket').label }}</span>
                <InfoTooltip :content="getPropItem('bucket').description" />
              </template>
              <el-input v-model="formData.bucket" />
            </el-form-item>
          </el-col>
        </template>

        <el-col :span="12">
          <el-form-item prop="precision">
            <template #label>
              <span>{{ getPropItem('precision').label }}</span>
              <InfoTooltip :content="getPropItem('precision').description" />
            </template>
            <el-select v-model="formData.precision">
              <el-option
                v-for="item in getPropItem('precision').symbols || []"
                :value="item"
                :key="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <CommonTLSConfig class="tls-config-form" v-model="formData.ssl" :is-edit="edit" />
        </el-col>
        <el-col :span="24"><el-divider /></el-col>

        <el-col :span="24">
          <el-form-item :label="tl('dataDefinition')">
            <!-- TODO: DESC -->
            <template #label>
              <span>{{ tl('dataDefinition') }}</span>
              <p class="label-desc">
                {{ tl('dataDefinitionDesc') }}
              </p>
            </template>
            <InfluxdbWriteSyntaxInput
              v-model="formData.write_syntax"
              ref="writeSyntaxInputCom"
              :write-syntax-prop-item="getPropItem('write_syntax')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24"><el-divider /></el-col>
        <BridgeResourceOpt v-model="formData.resource_opts" with-batch-config />
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { fillEmptyValueToUndefinedField } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useSchemaForm from '@/hooks/Config/useSchemaForm'
import useGetInfoFromComponents from '@/hooks/Rule/bridge/useGetInfoFromComponents'
import useResourceOpt from '@/hooks/Rule/bridge/useResourceOpt'
import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import useSSL from '@/hooks/useSSL'
import { InfluxDBType } from '@/types/enum'
import { BridgeItem, OtherBridge } from '@/types/rule'
import { cloneDeep, isEqual } from 'lodash'
import { computed, defineEmits, defineExpose, defineProps, ref, Ref, watch } from 'vue'
import { useStore } from 'vuex'
import BridgeResourceOpt from './BridgeResourceOpt.vue'
import InfluxdbWriteSyntaxInput from './InfluxdbWriteSyntaxInput.vue'

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
  /**
   * add special rule to the password field
   */
  validateForTestConnection: {
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue', 'init'])

const { state } = useStore()
const { tl } = useI18nTl('RuleEngine')

const PROTOCOL_VERSION_OPT = [
  { value: InfluxDBType.v1, label: 'v1' },
  { value: InfluxDBType.v2, label: 'v2' },
]

const { components } = useSchemaForm(`static/bridge-api-${state.lang}.json`, {
  ref: '#/components/schemas/bridge_influxdb.post_api_v2',
})
const { getPropItem } = useGetInfoFromComponents(components)

const { createSSLForm } = useSSL()
const { createDefaultResourceOptsForm } = useResourceOpt()

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
  resource_opts: createDefaultResourceOptsForm({ inflight: true, batch: true }),
})

const formData: Ref<OtherBridge> = ref(createDefaultValue())
const formCom = ref()
const writeSyntaxInputCom = ref()

const { createRequiredRule } = useFormRules()
const commonRules = computed(() => ({
  name: createRequiredRule(tl('name')),
  server: createRequiredRule(getPropItem('server').label),
  write_syntax: createRequiredRule(getPropItem('write_syntax').label),
}))

const { ruleWhenTestConnection } = useSpecialRuleForPassword(props)
const rulesForV1 = computed(() => ({
  database: createRequiredRule(getPropItem('database').label),
  password: ruleWhenTestConnection,
}))

const rulesForV2 = {
  token: createRequiredRule(tl('token')),
  org: createRequiredRule(tl('org')),
  bucket: createRequiredRule(tl('bucket')),
}

const formRules = computed(() => ({
  ...commonRules.value,
  ...(formData.value.type === InfluxDBType.v1 ? rulesForV1.value : rulesForV2),
}))

const initFormData = async () => {
  if ((props.edit || props.copy) && props.modelValue) {
    formData.value = fillEmptyValueToUndefinedField(
      cloneDeep(props.modelValue),
      createDefaultValue(),
    ) as BridgeItem
    emit('init', formData.value)
  }
}

watch(
  () => formData.value,
  () => {
    emit('update:modelValue', formData.value)
  },
  { deep: true },
)

watch(
  () => props.modelValue,
  (val) => {
    if (!isEqual(val, formData.value)) {
      initFormData()
    }
  },
)

const handleVersionChanged = () => {
  if (formData.value.type === InfluxDBType.v2) {
    formData.value.username = ''
    formData.value.password = ''
  } else {
    formData.value.token = ''
  }
}

const validate = () => {
  return Promise.all([formCom.value.validate(), writeSyntaxInputCom.value.validate()])
}

const clearValidate = () => {
  formCom.value?.clearValidate()
  writeSyntaxInputCom.value?.clearValidate()
  return
}

initFormData()

defineExpose({ validate, clearValidate })
</script>

<style lang="scss" scoped>
.label-desc {
  margin: 8px 0 0;
  color: var(--color-text-secondary);
}
</style>
