<template>
  <div class="bridge-influxdb-config bridge-config">
    <el-form
      ref="formCom"
      label-position="top"
      require-asterisk-position="right"
      :rules="formRules"
      :model="formData"
      :validate-on-rule-change="false"
    >
      <el-row :gutter="26">
        <el-col :span="12">
          <CustomFormItem :label="tl('name')" prop="name" :readonly="readonly">
            <el-input v-model="formData.name" :disabled="edit" />
          </CustomFormItem>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('influxDBVersion')">
            <el-select
              v-model="formData.type"
              :disabled="edit"
              @change="handleVersionChanged"
              v-if="!readonly"
            >
              <el-option
                v-for="{ value, label } in PROTOCOL_VERSION_OPT"
                :value="value"
                :key="value"
                :label="label"
              />
            </el-select>
            <p class="value" v-else>
              {{ getLabelFromValueInOptionList(formData.type, PROTOCOL_VERSION_OPT) }}
            </p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider />
      <el-row :gutter="26">
        <el-col :span="12">
          <CustomFormItem prop="server" :readonly="readonly">
            <template #label>
              <span>{{ getText('server.label') }}</span>
              <InfoTooltip>
                <template #content>
                  <MarkdownContent :content="getText('server.desc')" />
                </template>
              </InfoTooltip>
            </template>
            <el-input v-model="formData.server" />
          </CustomFormItem>
        </el-col>
        <!-- For v1 -->
        <el-col :span="12" v-if="formData.type === InfluxDBType.v1">
          <CustomFormItem prop="database" :readonly="readonly">
            <template #label>
              <span>{{ tl('database') }}</span>
              <InfoTooltip :content="tl('databaseDesc')" />
            </template>
            <el-input v-model="formData.database" />
          </CustomFormItem>
        </el-col>
        <template v-if="formData.type === InfluxDBType.v1">
          <el-col :span="12">
            <CustomFormItem prop="username" :readonly="readonly">
              <template #label>
                <span>{{ tl('username') }}</span>
                <InfoTooltip :content="tl('usernameDesc')" />
              </template>
              <el-input v-model="formData.username" />
            </CustomFormItem>
          </el-col>
          <el-col :span="12">
            <CustomFormItem prop="password" :readonly="readonly">
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
            </CustomFormItem>
          </el-col>
        </template>
        <!-- For v2 -->
        <template v-if="formData.type === InfluxDBType.v2">
          <el-col :span="12">
            <CustomFormItem prop="token" :readonly="readonly">
              <template #label>
                <span>{{ getText('token.label') }}</span>
                <InfoTooltip :content="getText('token.desc')" />
              </template>
              <el-input v-model="formData.token" type="password" show-password />
            </CustomFormItem>
          </el-col>
          <el-col :span="12">
            <CustomFormItem prop="org" :readonly="readonly">
              <template #label>
                <span>{{ getText('org.label') }}</span>
                <InfoTooltip :content="getText('org.desc')" />
              </template>
              <el-input v-model="formData.org" />
            </CustomFormItem>
          </el-col>
          <el-col :span="12">
            <CustomFormItem prop="bucket" :readonly="readonly">
              <template #label>
                <span>{{ getText('bucket.label') }}</span>
                <InfoTooltip :content="getText('bucket.desc')" />
              </template>
              <el-input v-model="formData.bucket" />
            </CustomFormItem>
          </el-col>
        </template>

        <el-col :span="12">
          <el-form-item prop="precision">
            <template #label>
              <span>{{ getText('precision.label') }}</span>
              <InfoTooltip :content="getText('precision.desc')" />
            </template>
            <el-select v-model="formData.precision" v-if="!readonly">
              <el-option
                v-for="{ value, label } in getPrecisionOpts()"
                :value="value"
                :key="value"
                :label="label"
              />
            </el-select>
            <p class="value" v-else>
              {{ t(`General.${formData.precision === 's' ? 'sec' : formData.precision}`) }}
            </p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <CommonTLSConfig
            class="tls-config-form"
            v-model="formData.ssl"
            :is-edit="edit || copy"
            :readonly="readonly"
          />
        </el-col>
        <el-col :span="24"><el-divider /></el-col>

        <el-col :span="24">
          <el-form-item>
            <InfluxdbWriteSyntaxInput
              v-model="formData.write_syntax"
              ref="writeSyntaxInputCom"
              :write-syntax-prop-item="getPropItem('write_syntax')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24"><el-divider /></el-col>
        <BridgeResourceOpt
          v-model="formData.resource_opts"
          with-batch-config
          :readonly="readonly"
        />
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { fillEmptyValueToUndefinedField, getLabelFromValueInOptionList } from '@/common/tools'
import CustomFormItem from '@/components/CustomFormItem.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useGetInfoFromComponents from '@/hooks/Rule/bridge/useGetInfoFromComponents'
import useResourceOpt from '@/hooks/Rule/bridge/useResourceOpt'
import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import useSchemaForm from '@/hooks/Schema/useSchemaForm'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import useSSL from '@/hooks/useSSL'
import { InfluxDBType } from '@/types/enum'
import { BridgeItem, OtherBridge } from '@/types/rule'
import { cloneDeep, isEqual } from 'lodash'
import { Ref, computed, defineEmits, defineExpose, defineProps, ref, watch } from 'vue'
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
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'init'])

const { tl, t } = useI18nTl('RuleEngine')
const getText = (key: string) => t(`BridgeSchema.emqx_ee_bridge_influxdb.${key}`)

const PROTOCOL_VERSION_OPT = [
  { value: InfluxDBType.v1, label: 'v1' },
  { value: InfluxDBType.v2, label: 'v2' },
]

const { components } = useSchemaForm(`/api/v5/schemas/bridges`, {
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

const { createRequiredRule, createCommonIdRule } = useFormRules()
const commonRules = computed(() => ({
  name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
  server: createRequiredRule(getText('server.label')),
  write_syntax: createRequiredRule(getText('write_syntax.label')),
}))

const { ruleWhenTestConnection } = useSpecialRuleForPassword(props)
const rulesForV1 = computed(() => ({
  database: createRequiredRule(getText('database.label')),
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

const getPrecisionOpts = () => {
  const rawPrecisionOpts: Array<string> = getPropItem('precision').symbols || []
  return rawPrecisionOpts.map((item) => ({
    value: item,
    label: t(`General.${item === 's' ? 'sec' : item}`),
  }))
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
