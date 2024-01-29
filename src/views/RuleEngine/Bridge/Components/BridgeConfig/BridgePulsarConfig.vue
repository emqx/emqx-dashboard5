<template>
  <el-form
    v-if="showForm"
    ref="formCom"
    label-position="top"
    require-asterisk-position="right"
    class="bridge-config bridge-pulsar-config"
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
        <!-- FIXME: maybe remove in new design? -->
        <el-col :span="colSpan" v-if="!isRoleHidden">
          <el-form-item>
            <template #label>
              <span>{{ tl('role') }}</span>
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
    </template>

    <el-row :gutter="26">
      <el-col :span="colSpan">
        <CustomFormItem prop="servers" :readonly="readonly">
          <template #label>
            <FormItemLabel v-bind="getLabelProps('servers')" />
          </template>
          <el-input v-model="formData.servers" />
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
          <p class="value" v-else>
            {{ getLabelFromValueInOptionList(authType, authTypeOptList) }}
          </p>
        </el-form-item>
      </el-col>
      <!-- For Basic -->
      <template v-if="authType === AuthType.Basic">
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
      <el-col v-else-if="authType === AuthType.Token" :span="colSpan">
        <CustomFormItem prop="authentication.jwt" :readonly="readonly">
          <template #label>
            <FormItemLabel v-bind="getLabelProps('authentication.jwt')" />
          </template>
          <el-input
            v-model="formData.authentication.jwt"
            type="password"
            autocomplete="one-time-code"
            show-password
          />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="pulsar_topic" :readonly="readonly">
          <template #label>
            <FormItemLabel v-bind="getLabelProps('pulsar_topic')" />
          </template>
          <el-input v-model="formData.pulsar_topic" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="strategy" :readonly="readonly">
          <template #label>
            <FormItemLabel v-bind="getLabelProps('strategy')" />
          </template>
          <el-select v-model="formData.strategy">
            <el-option
              v-for="item in getPropItem('strategy').symbols || []"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="compression" :readonly="readonly">
          <template #label>
            <FormItemLabel v-bind="getLabelProps('compression')" />
          </template>
          <el-select v-model="formData.compression">
            <el-option
              v-for="item in getPropItem('compression').symbols || []"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </CustomFormItem>
      </el-col>

      <!-- ssl -->
      <el-col :span="24">
        <CommonTLSConfig v-model="formData.ssl" :is-edit="edit || copy" :readonly="readonly" />
      </el-col>
      <el-col :span="24"><el-divider /></el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="message.key" :readonly="readonly">
          <template #label>
            <FormItemLabel v-bind="getLabelProps('message.key')" />
          </template>
          <el-input type="textarea" rows="4" v-model="formData.message.key" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="message.value" :readonly="readonly">
          <template #label>
            <FormItemLabel v-bind="getLabelProps('message.value')" />
          </template>
          <el-input type="textarea" rows="4" v-model="formData.message.value" />
        </CustomFormItem>
      </el-col>
    </el-row>
    <AdvancedSettingContainer>
      <el-row :gutter="26">
        <el-col :span="colSpan">
          <CustomFormItem prop="sync_timeout" :readonly="readonly">
            <template #label>
              <FormItemLabel v-bind="getLabelProps('sync_timeout')" />
            </template>
            <TimeInputWithUnitSelect v-model="formData.sync_timeout" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="retention_period" :readonly="readonly">
            <template #label>
              <FormItemLabel v-bind="getLabelProps('retention_period')" />
            </template>
            <Oneof
              :items="getPropItem('retention_period').oneOf"
              v-model="formData.retention_period"
            />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="send_buffer" :readonly="readonly">
            <template #label>
              <FormItemLabel v-bind="getLabelProps('send_buffer')" />
            </template>
            <InputWithUnit v-model="formData.send_buffer" :units="usefulMemoryUnit" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="batch_size" :readonly="readonly">
            <template #label>
              <FormItemLabel v-bind="getResourceOptLabelProp('batch_size')" />
            </template>
            <el-input v-model="formData.batch_size" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="max_batch_bytes" :readonly="readonly">
            <template #label>
              <FormItemLabel v-bind="getLabelProps('max_batch_bytes')" />
            </template>
            <InputWithUnit v-model="formData.max_batch_bytes" :units="usefulMemoryUnit" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="connect_timeout" :readonly="readonly">
            <template #label>
              <FormItemLabel v-bind="getLabelProps('connect_timeout')" />
            </template>
            <TimeInputWithUnitSelect v-model="formData.connect_timeout" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="buffer.mode" :readonly="readonly">
            <template #label>
              <FormItemLabel v-bind="getLabelProps('buffer.mode')" />
            </template>
            <el-select v-model="formData.buffer.mode">
              <el-option
                v-for="item in getPropItem('buffer.mode').symbols || []"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="buffer.per_partition_limit" :readonly="readonly">
            <template #label>
              <FormItemLabel v-bind="getLabelProps('buffer.per_partition_limit')" />
            </template>
            <InputWithUnit
              v-model="formData.buffer.per_partition_limit"
              :units="usefulMemoryUnit"
            />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="buffer.segment_bytes" :readonly="readonly">
            <template #label>
              <FormItemLabel v-bind="getLabelProps('buffer.segment_bytes')" />
            </template>
            <InputWithUnit v-model="formData.buffer.segment_bytes" :units="usefulMemoryUnit" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item prop="buffer.memory_overload_protection">
            <template #label>
              <FormItemLabel v-bind="getLabelProps('buffer.memory_overload_protection')" />
            </template>
            <el-switch v-model="formData.buffer.memory_overload_protection" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="resource_opts.start_timeout" :readonly="readonly">
            <template #label>
              <FormItemLabel v-bind="getResourceOptLabelProp('start_timeout')" />
            </template>
            <TimeInputWithUnitSelect v-model="formData.resource_opts.start_timeout" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="resource_opts.health_check_interval" :readonly="readonly">
            <template #label>
              <FormItemLabel v-bind="getResourceOptLabelProp('health_check_interval')" />
            </template>
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
import InputWithUnit from '@/components/InputWithUnit.vue'
import Oneof from '@/components/Oneof.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useGetInfoFromComponents from '@/hooks/Rule/bridge/useGetInfoFromComponents'
import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import useSchemaForm from '@/hooks/Schema/useSchemaForm'
import useSchemaRecord from '@/hooks/Schema/useSchemaRecord'
import useI18nTl from '@/hooks/useI18nTl'
import useSSL from '@/hooks/useSSL'
import { OtherBridge } from '@/types/rule'
import { isEqual, snakeCase } from 'lodash'
import { Ref, computed, defineEmits, defineExpose, defineProps, onMounted, ref, watch } from 'vue'

enum AuthType {
  None,
  Basic,
  Token,
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
  isRoleHidden: {
    type: Boolean,
    default: false,
  },
  isUsingInFlow: {
    type: Boolean,
  },
})
const emit = defineEmits(['update:modelValue', 'init'])

const { t, tl } = useI18nTl('RuleEngine')

const getPulsarText = (key: string) => t(`BridgeSchema.pulsar.${key}`)
const getLabelProps = (key: string) => ({
  label: getPulsarText(`${snakeCase(key)}.label`),
  desc: getPulsarText(`${snakeCase(key)}.desc`),
  descMarked: true,
})
const getResourceOptLabelProp = (key: string) => ({
  label: t(`BridgeSchema.common.${key}.label`),
  desc: t(`BridgeSchema.common.${key}.desc`),
  descMarked: true,
})

const role = ref<Role>(Role.Producer)
const roleMap = [
  { value: Role.Producer, label: tl('producer') },
  // { value: Role.Consumer, label: tl('consumer') },
]

const { components, rules, schemaLoadPromise } = useSchemaForm(
  getAPIPath('/schemas/bridges'),
  { ref: `#/components/schemas/bridge_pulsar.post_producer` },
  true,
)
const { getPropItem } = useGetInfoFromComponents(components)
const { initRecordByComponents } = useSchemaRecord()
const { createSSLForm } = useSSL()

const createRawFormData = () =>
  Object.assign(initRecordByComponents(components.value), { ssl: createSSLForm() })

const initRecord = () => {
  if (Object.keys(components.value).length === 0) {
    return
  }
  if (!props.edit && !props.copy) {
    formData.value = {
      ...createRawFormData(),
      ...(props.modelValue || {}),
    }
    emit('init', formData.value)
  }
}

const formCom = ref()
const { ruleWhenEditing } = useSpecialRuleForPassword(props)
const formRules = computed(() => {
  const prePwdRule: any = rules.value?.['authentication.password'] || []
  return { ...rules.value, ['authentication.password']: [...prePwdRule, ...ruleWhenEditing] }
})

const formData: Ref<OtherBridge> = ref({
  authentication: 'none',
  message: {},
  resource_opts: {},
  buffer: {},
})

const colSpan = computed(() => (props.isUsingInFlow ? 24 : 12))

const updateParentBridgeData = () => {
  emit('update:modelValue', formData.value)
}

const resetFormDataWhenEdit = async () => {
  await schemaLoadPromise
  if ((props.edit || props.copy) && props.modelValue) {
    formData.value = fillEmptyValueToUndefinedField(
      props.modelValue as Record<string, any>,
      initRecordByComponents(components.value),
    )
    emit('init', formData.value)
  }
}

const handleRoleChanged = () => {
  //
}

const judgeAuthType = () => {
  const auth = formData.value.authentication
  if (auth === 'none') {
    return AuthType.None
  }
  if (typeof auth === 'object') {
    if ('username' in auth) {
      return AuthType.Basic
    }
    if ('jwt' in auth) {
      return AuthType.Token
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
      formData.value.authentication = { username: '', password: '' }
    } else if (val === AuthType.Token) {
      formData.value.authentication = { jwt: '' }
    }
  },
})
const authTypeOptList = [
  { value: AuthType.None, label: 'None' },
  { value: AuthType.Basic, label: tl('basicAuth') },
  { value: AuthType.Token, label: 'Token' },
]

const validate = () => {
  return formCom.value.validate()
}

const clearValidate = () => {
  return formCom.value?.clearValidate()
}

watch(formData, updateParentBridgeData, { deep: true })

watch(components, initRecord)

watch(
  () => props.modelValue,
  (val) => {
    if (!isEqual(val, formData.value)) {
      resetFormDataWhenEdit()
    }
  },
)

onMounted(() => {
  if ((props.edit || props.copy || props.readonly) && props.modelValue) {
    resetFormDataWhenEdit()
  }
})

/**
 * Here, because the CustomFormItem component can't know the change
 * of the slot's modelValue accordingly, it can't display the form
 * item value in real time, so it displays the form after the schema is loaded.
 */
const showForm = ref(false)
const detectLoadStatus = async () => {
  await schemaLoadPromise
  showForm.value = true
}

initRecord()
detectLoadStatus()

defineExpose({ validate, clearValidate })
</script>
