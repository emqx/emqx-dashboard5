<template>
  <el-form
    ref="FormCom"
    label-width="160px"
    class="webhook-form tong-form"
    :rules="rules"
    :model="formData"
  >
    <el-form-item prop="name" :label="tl('name')">
      <el-input class="name-input" v-model="formData.name" :disabled="isEdit">
        <template #append>{{ WEBHOOK_SUFFIX }}</template>
      </el-input>
    </el-form-item>
    <el-form-item prop="rule.description" :label="tl('note')">
      <el-input v-model="formData.rule.description" />
    </el-form-item>
    <el-form-item prop="rule.sql" :label="tl('trigger')" class="item-trigger">
      <Trigger ref="TriggerCom" v-model="formData.rule.sql" />
    </el-form-item>
    <el-form-item :label="getLabel('method')" prop="action.action.parameters.method">
      <el-select v-model="formData.action.parameters.method">
        <el-option
          v-for="item in ['post', 'get', 'put', 'delete']"
          :value="item"
          :label="String(item).toUpperCase()"
          :key="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="'URL'" prop="connector.url">
      <template #label>
        <label>URL</label>
        <InfoTooltip :content="tl('httpBridgeURLFieldDesc')" />
      </template>
      <el-input v-model="formData.connector.url" />
      <el-button
        link
        class="btn-test"
        type="primary"
        :disabled="!$hasPermission('post')"
        :loading="isTesting"
        @click="handleTestConnectivity"
      >
        {{ tl('testConnectivity') }}
      </el-button>
    </el-form-item>
    <el-form-item :label="tl('headers')" class="item-headers">
      <KeyAndValueEditor v-model="formData.connector.headers" type="list" />
    </el-form-item>
    <AdvancedSettingContainer>
      <el-form-item prop="connector.resource_opts.start_timeout">
        <template #label>
          <FormItemLabel
            :label="t('BridgeSchema.common.start_timeout.label')"
            :desc="t('BridgeSchema.common.start_timeout.desc')"
          />
        </template>
        <TimeInputWithUnitSelect v-model="formData.connector.resource_opts.start_timeout" />
      </el-form-item>
      <BridgeResourceOpt
        v-model="formData.action.resource_opts"
        :col-span="24"
        :with-start-timeout-config="false"
      />
      <CommonTLSConfig class="tls-config-form" v-model="formData.connector.ssl" :is-edit="isEdit" />
      <el-form-item :label="getCommonText('connect_timeout.label')">
        <TimeInputWithUnitSelect
          v-model="formData.connector.connect_timeout"
          :enabled-units="['s']"
        />
      </el-form-item>
      <el-form-item :label="tl('connectionPoolSize')" prop="connector.pool_size">
        <el-input v-model.number="formData.connector.pool_size" />
      </el-form-item>
      <el-form-item :label="getCommonText('pool_type.label')" prop="connector.pool_type">
        <el-select v-model="formData.connector.pool_type">
          <el-option v-for="item in ['random', 'hash']" :key="item" :value="item" :label="item" />
        </el-select>
      </el-form-item>
      <el-form-item :label="getLabel('enable_pipelining')">
        <CustomInputNumber v-model="formData.connector.enable_pipelining" />
      </el-form-item>
    </AdvancedSettingContainer>
  </el-form>
</template>

<script setup lang="ts">
import { WEBHOOK_SUFFIX } from '@/common/constants'
import { getKeywordsFromSQL } from '@/common/tools'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useHandleConnectorItem from '@/hooks/Rule/connector/useHandleConnectorItem'
import useWebhookForm from '@/hooks/Webhook/useWebhookForm'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { FormRules } from '@/types/common'
import { WebhookForm, WebhookItem } from '@/types/webhook'
import BridgeResourceOpt from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeResourceOpt.vue'
import { ElMessage } from 'element-plus'
import type { PropType, WritableComputedRef } from 'vue'
import { computed, defineEmits, defineExpose, defineProps, ref, watch } from 'vue'
import Trigger from './Trigger.vue'
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<WebhookForm | WebhookItem>,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('RuleEngine')
const getText = (key: string) => t(`BridgeSchema.http.${key}`)
const getLabel = (key: string) => getText(`${key}.label`)
const getCommonText = (key: string) => t(`BridgeSchema.common.${key}`)
const FormCom = ref()
const TriggerCom = ref()

const formData: WritableComputedRef<WebhookForm | WebhookItem> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { createRequiredRule, createCommonIdRule, createIntFieldRule } = useFormRules()
const rules: FormRules = {
  name: [...createRequiredRule(t('Base.name')), ...createCommonIdRule()],
  'connector.url': createRequiredRule(t('URL')),
  'rule.sql': [
    {
      validator(rules, value) {
        const { fromStr } = getKeywordsFromSQL(value)
        return !fromStr
          ? [new Error(t('Rule.selectFieldRequiredError', { name: tl('trigger') }))]
          : []
      },
      trigger: 'blur',
    },
  ],

  'connector.pool_size': [...createIntFieldRule(1)],
}

watch(
  () => formData.value.rule.sql,
  () => {
    FormCom.value.clearValidate(['rule.sql'])
  },
)

const validate = () => {
  return Promise.all([FormCom.value.validate(), TriggerCom.value.validate()])
}

const isTesting = ref(false)
const { getActionNameByName } = useWebhookForm()
const { testConnectivity } = useHandleConnectorItem()
const handleTestConnectivity = async () => {
  try {
    await FormCom.value.validate()
    isTesting.value = true
    const data = formData.value.connector
    data.name = getActionNameByName(formData.value.name)
    await testConnectivity(data)
    ElMessage.success(tl('connectionSuccessful'))
  } catch (error) {
    //
  } finally {
    isTesting.value = false
  }
}

defineExpose({ validate })
</script>

<style lang="scss">
.webhook-form {
  .el-form-item {
    width: 500px;
    &.item-trigger {
      width: 100%;
      .el-form-item {
        width: 100%;
      }
    }
    &.item-headers {
      width: 664px;
    }
  }
  .el-form-item {
    margin-bottom: 24px;
  }
  .el-form-item__label {
    padding-right: 16px;
  }
  .TLS-enable-config .TLS-input {
    width: 100%;
  }
  .one-of,
  .key-and-value-editor,
  .webhook-trigger {
    width: 100%;
  }
  .btn-test {
    position: absolute;
    top: 50%;
    right: -16px;
    transform: translate(100%, -50%);
  }
  .name-input {
    .el-input-group__append {
      justify-content: flex-start;
      padding: 0 12px;
    }
  }
  &.tong-form {
    .advanced-settings-btn {
      margin-left: 160px;
    }
  }
}
</style>
