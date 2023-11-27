<template>
  <el-form
    ref="formCom"
    label-position="top"
    require-asterisk-position="right"
    class="bridge-influxdb-config bridge-config"
    :rules="formRules"
    :model="formData"
    :disabled="disabled"
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
      <el-col :span="colSpan">
        <el-form-item :label="tl('influxDBVersion')">
          <el-select
            v-model="formData.type"
            :disabled="edit || isBridgeSelected"
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
      <el-col :span="colSpan">
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
      <el-col :span="colSpan" v-if="formData.type === InfluxDBType.v1">
        <CustomFormItem prop="database" :readonly="readonly">
          <template #label>
            <span>{{ tl('database') }}</span>
            <InfoTooltip :content="tl('databaseDesc')" />
          </template>
          <el-input v-model="formData.database" />
        </CustomFormItem>
      </el-col>
      <template v-if="formData.type === InfluxDBType.v1">
        <el-col :span="colSpan">
          <CustomFormItem prop="username" :readonly="readonly">
            <template #label>
              <span>{{ tl('username') }}</span>
              <InfoTooltip :content="tl('usernameDesc')" />
            </template>
            <el-input v-model="formData.username" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
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
        <el-col :span="colSpan">
          <CustomFormItem prop="token" :readonly="readonly">
            <template #label>
              <span>{{ getText('token.label') }}</span>
              <InfoTooltip :content="getText('token.desc')" />
            </template>
            <el-input v-model="formData.token" type="password" show-password />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="org" :readonly="readonly">
            <template #label>
              <span>{{ getText('org.label') }}</span>
              <InfoTooltip :content="getText('org.desc')" />
            </template>
            <el-input v-model="formData.org" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="bucket" :readonly="readonly">
            <template #label>
              <span>{{ getText('bucket.label') }}</span>
              <InfoTooltip :content="getText('bucket.desc')" />
            </template>
            <el-input v-model="formData.bucket" />
          </CustomFormItem>
        </el-col>
      </template>

      <el-col :span="colSpan">
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
        <el-form-item label-width="0px">
          <InfluxdbWriteSyntaxInput
            v-model="formData.write_syntax"
            ref="writeSyntaxInputCom"
            :write-syntax-prop-item="getPropItem('write_syntax')"
            :readonly="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <AdvancedSettingContainer>
      <el-row :gutter="26">
        <BridgeResourceOpt
          v-model="formData.resource_opts"
          with-batch-config
          :readonly="readonly"
          :colSpan="colSpan"
        />
      </el-row>
    </AdvancedSettingContainer>
  </el-form>
</template>

<script setup lang="ts">
import {
  fillEmptyValueToUndefinedField,
  getAPIPath,
  getLabelFromValueInOptionList,
  waitAMoment,
} from '@/common/tools'
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'
import CustomFormItem from '@/components/CustomFormItem.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import InputSelect from '@/components/InputSelect.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useReuseBridgeInFlow from '@/hooks/Flow/useReuseBridgeInFlow'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import useGetInfoFromComponents from '@/hooks/Rule/bridge/useGetInfoFromComponents'
import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import useSchemaForm from '@/hooks/Schema/useSchemaForm'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType, InfluxDBType } from '@/types/enum'
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
  disabled: {
    type: Boolean,
  },
  isUsingInFlow: {
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue', 'init'])

const { tl, t } = useI18nTl('RuleEngine')
const getText = (key: string) => t(`BridgeSchema.emqx_ee_bridge_influxdb.${key}`)

const PROTOCOL_VERSION_OPT = [
  { value: InfluxDBType.v1, label: 'v1' },
  { value: InfluxDBType.v2, label: 'v2' },
]

const { components } = useSchemaForm(getAPIPath(`/schemas/bridges`), {
  ref: '#/components/schemas/bridge_influxdb.post_api_v2',
})
const { getPropItem } = useGetInfoFromComponents(components)

const { createRawInfluxDBForm: createDefaultValue } = useBridgeFormCreator()

const formData: Ref<OtherBridge> = ref(createDefaultValue())
const formCom = ref()
const writeSyntaxInputCom = ref()

const { createRequiredRule, createCommonIdRule } = useFormRules()
const commonRules = computed(() => ({
  name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
  server: createRequiredRule(getText('server.label')),
  write_syntax: createRequiredRule(getText('write_syntax.label')),
}))

const { ruleWhenEditing } = useSpecialRuleForPassword(props)
const rulesForV1 = computed(() => ({
  database: createRequiredRule(getText('database.label')),
  password: ruleWhenEditing,
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

const colSpan = computed(() => (props.isUsingInFlow ? 24 : 12))

const { isCreateBridgeInFlow, isBridgeSelected, getBridgesInSameType, handleNameChange } =
  useReuseBridgeInFlow(BridgeType.InfluxDB, props, formData)
const nameOptions = computed(() => getBridgesInSameType().map(({ name }) => name))
watch(isBridgeSelected, async (nVal, oVal) => {
  if (!nVal && oVal) {
    formData.value = Object.assign(createDefaultValue(), { name: formData.value.name })
    await waitAMoment()
    formCom.value?.clearValidate?.()
  }
})

const initFormData = async () => {
  if (!props.modelValue) {
    return
  }
  if (props.edit || props.copy) {
    formData.value = fillEmptyValueToUndefinedField(
      cloneDeep(props.modelValue),
      createDefaultValue(),
    ) as BridgeItem
    emit('init', formData.value)
  } else {
    formData.value = { ...formData.value, ...props.modelValue }
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
