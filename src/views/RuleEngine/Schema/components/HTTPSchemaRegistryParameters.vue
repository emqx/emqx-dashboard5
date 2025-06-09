<template>
  <el-row :gutter="24">
    <el-col :span="8">
      <el-form-item prop="parameters.url">
        <template #label>
          <FormItemLabel label="URL" :desc="t('RuleEngine.externalHttpUrlDesc')" desc-marked />
        </template>
        <el-input v-model="formData.url" />
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item prop="parameters.external_params">
        <template #label>
          <FormItemLabel
            :label="t('RuleEngine.externalParams')"
            :desc="t('RuleEngine.externalParamsDesc')"
            desc-marked
          />
        </template>
        <el-input v-model="formData.external_params" />
      </el-form-item>
    </el-col>
    <el-col :span="16">
      <el-form-item prop="parameters.headers">
        <template #label>
          <FormItemLabel :label="t('RuleEngine.headers')" />
        </template>
        <KeyAndValueEditor v-model="formData.headers" />
      </el-form-item>
    </el-col>
    <el-col :span="16">
      <CommonTLSConfig class="http-ssl-config" v-model="formData.ssl" :is-edit="isEdit" />
    </el-col>
  </el-row>
  <AdvancedSettingContainer>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item prop="parameters.pool_type">
          <template #label>
            <FormItemLabel
              :label="getHTTPConnectorText('pool_type', 'label')"
              :desc="getHTTPConnectorText('pool_type', 'desc')"
              desc-marked
            />
          </template>
          <el-select v-model="formData.pool_type" :default-value="'random'">
            <el-option v-for="item in ['random', 'hash']" :key="item" :value="item" :label="item" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item prop="parameters.pool_size" :label="t('RuleEngine.connectionPoolSize')">
          <CustomInputNumber v-model="formData.pool_size" :min="1" />
        </el-form-item>
      </el-col>
      <el-col :span="8" />
      <el-col :span="8">
        <el-form-item prop="parameters.connect_timeout" :label="tl('connectTimeout')">
          <TimeInputWithUnitSelect v-model="formData.connect_timeout" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item prop="parameters.max_inactive">
          <template #label>
            <FormItemLabel
              :label="getHTTPConnectorText('max_inactive', 'label')"
              :desc="getHTTPConnectorText('max_inactive', 'desc')"
              desc-marked
            />
          </template>
          <TimeInputWithUnitSelect v-model="formData.max_inactive" :default-value="10" />
        </el-form-item>
      </el-col>
      <el-col :span="8" />
      <el-col :span="8">
        <el-form-item prop="parameters.max_retries">
          <template #label>
            <FormItemLabel
              :label="getHTTPConnectorText('max_retries', 'label')"
              :desc="getHTTPConnectorText('max_retries', 'desc')"
              desc-marked
            />
          </template>
          <CustomInputNumber v-model="formData.max_retries" :min="0" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item prop="parameters.enable_pipelining" :label="tl('httpPipelining')">
          <CustomInputNumber v-model="formData.enable_pipelining" :min="1" />
        </el-form-item>
      </el-col>
      <el-col :span="8" />
      <el-col :span="8">
        <el-form-item prop="parameters.request_timeout" :label="tl('requestTimeout')">
          <TimeInputWithUnitSelect v-model="formData.request_timeout" />
        </el-form-item>
      </el-col>
    </el-row>
  </AdvancedSettingContainer>
</template>

<script setup lang="ts">
import FormItemLabel from '@/components/FormItemLabel.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRegistryExternalHttpParameters } from '@/types/rule'

const props = defineProps<{
  modelValue: SchemaRegistryExternalHttpParameters
  isEdit: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: SchemaRegistryExternalHttpParameters): void
}>()

const formData = computed<SchemaRegistryExternalHttpParameters>({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('Auth')
const getHTTPConnectorText = (key: string, type: 'label' | 'desc') =>
  t(`BridgeSchema.common.${key}.${type}`)
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 22px;
}
.http-ssl-config {
  :deep(.TLS-input) {
    width: 100%;
  }
}
</style>
