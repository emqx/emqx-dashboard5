<template>
  <el-col :span="colSpan">
    <el-form-item :prop="getProp('enable')">
      <template #label>
        <FormItemLabel :label="getLabel('oauth2')" :desc="getDesc('oauth2')" desc-marked />
      </template>
      <el-switch :model-value="record.enable" @change="handleEnableChange" />
    </el-form-item>
  </el-col>

  <el-col v-if="record.enable" :span="24" class="http-oauth2-config">
    <div class="http-oauth2-config__container">
      <el-row :gutter="20">
        <el-col :span="colSpan">
          <el-form-item :prop="getProp('token_endpoint')">
            <template #label>
              <FormItemLabel
                :label="getLabel('oauth2_token_endpoint')"
                :desc="getDesc('oauth2_token_endpoint')"
                desc-marked
              />
            </template>
            <el-input v-model="record.token_endpoint" />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item :prop="getProp('client_id')">
            <template #label>
              <FormItemLabel
                :label="getLabel('oauth2_client_id')"
                :desc="getDesc('oauth2_client_id')"
                desc-marked
              />
            </template>
            <el-input v-model="record.client_id" />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item :prop="getProp('client_secret')">
            <template #label>
              <FormItemLabel
                :label="getLabel('oauth2_client_secret')"
                :desc="getDesc('oauth2_client_secret')"
                desc-marked
              />
            </template>
            <CustomInputPassword v-model="record.client_secret" />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item :prop="getProp('scope')">
            <template #label>
              <FormItemLabel
                :label="getLabel('oauth2_scope')"
                :desc="getDesc('oauth2_scope')"
                desc-marked
              />
            </template>
            <el-input v-model="record.scope" />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item :prop="getProp('timeout')">
            <template #label>
              <FormItemLabel
                :label="getLabel('oauth2_timeout')"
                :desc="getDesc('oauth2_timeout')"
                desc-marked
              />
            </template>
            <TimeInputWithUnitSelect v-model="record.timeout" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <CommonTLSConfig
            v-model="record.ssl"
            :is-edit="isEdit"
            :base-path="getProp('ssl')"
            :managed-cert-conf-columns="managedCertConfColumns"
          />
        </el-col>
      </el-row>
    </div>
  </el-col>
</template>

<script setup lang="ts">
import { SSL } from '@/types/common'

interface OAuth2Config {
  enable: boolean
  client_id?: string
  client_secret?: string
  token_endpoint?: string
  scope?: string
  timeout?: string
  ssl?: SSL
}

const props = withDefaults(
  defineProps<{
    modelValue?: OAuth2Config
    propPrefix?: string
    colSpan?: number
    isEdit?: boolean
    managedCertConfColumns?: number
  }>(),
  {
    propPrefix: 'oauth2',
    colSpan: 12,
    isEdit: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: OAuth2Config): void
}>()

const { t } = useI18n()
const { createSSLForm } = useSSL()

const record = computed<OAuth2Config>({
  get() {
    return props.modelValue ?? { enable: false }
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const getText = (key: string, type: 'label' | 'desc') => t(`BridgeSchema.http.${key}.${type}`)
const getLabel = (key: string) => getText(key, 'label')
const getDesc = (key: string) => getText(key, 'desc')
const getProp = (key: string) => `${props.propPrefix}.${key}`

const handleEnableChange = (enable: boolean | string | number) => {
  if (!enable) {
    record.value = { enable: false }
    return
  }
  record.value = {
    client_id: '',
    client_secret: '',
    token_endpoint: '',
    scope: '',
    timeout: '5s',
    ...record.value,
    enable: true,
    ssl: record.value.ssl ?? createSSLForm(),
  }
}

onBeforeMount(() => {
  if (!props.modelValue) {
    record.value = { enable: false }
  } else if (props.modelValue.enable) {
    record.value = {
      timeout: '5s',
      ...props.modelValue,
      ssl: props.modelValue.ssl ?? createSSLForm(),
    }
  }
})
</script>

<style lang="scss">
.http-oauth2-config {
  margin-bottom: 24px;

  .http-oauth2-config__container {
    padding: 20px;
    background-color: var(--color-bg-split);
    border: 1px solid var(--color-border-primary);
    border-radius: 8px;
  }
}
</style>
