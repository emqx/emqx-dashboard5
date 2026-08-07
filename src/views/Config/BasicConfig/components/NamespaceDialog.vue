<template>
  <el-dialog
    :title="dialogTitle"
    v-model="showDialog"
    width="800px"
    class="namespace-dialog"
    destroy-on-close
  >
    <el-form
      ref="FormCom"
      :model="record"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      @keyup.enter="save()"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="tl('namespace')" prop="ns">
            <el-input v-if="!props.namespace" v-model="record.ns" />
            <div v-else class="namespace-display">
              <CommonOverflowTooltip :content="record.ns" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxSessions')" prop="config.session.max_sessions">
            <Oneof
              class="in-one-row"
              v-model="sessionMaxValue"
              :items="[{ type: 'number' }, { symbols: [INFINITY_VALUE], type: 'enum' }]"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- Tenant Limiter -->
      <div class="config-section">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-divider />
            <div class="section-title">
              <span>{{ tl('targetLimiter', { target: tl('tenant') }) }}</span>
              <InfoTooltip>
                <template #content>
                  <MarkdownContent :content="tl('tenantLimiterDesc')" />
                </template>
              </InfoTooltip>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('enableTargetLimiter', { target: tl('tenant') })">
              <el-switch
                :model-value="isActiveTenantLimiter"
                @change="(val) => toggleTenantLimiter(Boolean(val))"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <template v-if="isActiveTenantLimiter">
          <el-row :gutter="20">
            <!-- Tenant Bytes Limiter -->
            <el-col :span="12">
              <el-form-item prop="config.limiter.tenant.bytes.rate">
                <template #label>
                  <FormItemLabel
                    :label="getSchemaText('bytes_rate.label')"
                    :desc="getTenantConfigDesc('bytes_rate')"
                    desc-marked
                  />
                </template>
                <el-input v-model="tenantBytes.rate" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="config.limiter.tenant.bytes.burst">
                <template #label>
                  <FormItemLabel
                    :label="getSchemaText('bytes_burst.label')"
                    :desc="getTenantConfigDesc('bytes_burst')"
                    desc-marked
                  />
                </template>
                <el-input v-model="tenantBytes.burst" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!-- Tenant Messages Limiter -->
            <el-col :span="12">
              <el-form-item prop="config.limiter.tenant.messages.rate">
                <template #label>
                  <FormItemLabel
                    :label="getSchemaText('messages_rate.label')"
                    :desc="getTenantConfigDesc('messages_rate')"
                    desc-marked
                  />
                </template>
                <el-input v-model="tenantMessages.rate" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="config.limiter.tenant.messages.burst">
                <template #label>
                  <FormItemLabel
                    :label="getSchemaText('messages_burst.label')"
                    :desc="getTenantConfigDesc('messages_burst')"
                    desc-marked
                  />
                </template>
                <el-input v-model="tenantMessages.burst" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </div>

      <!-- Client Limiter -->
      <div class="config-section">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-divider />
            <div class="section-title">
              <span>{{ tl('targetLimiter', { target: tl('client') }) }}</span>
              <InfoTooltip>
                <template #content>
                  <MarkdownContent :content="tl('clientLimiterDesc')" />
                </template>
              </InfoTooltip>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('enableTargetLimiter', { target: tl('client') })">
              <el-switch
                :model-value="isActiveClientLimiter"
                @change="(val) => toggleClientLimiter(Boolean(val))"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <template v-if="isActiveClientLimiter">
          <el-row :gutter="20">
            <!-- Client Bytes Limiter -->
            <el-col :span="12">
              <el-form-item prop="config.limiter.client.bytes.rate">
                <template #label>
                  <FormItemLabel
                    :label="getSchemaText('bytes_rate.label')"
                    :desc="getClientConfigDesc('bytes_rate')"
                    desc-marked
                  />
                </template>
                <el-input v-model="clientBytes.rate" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="config.limiter.client.bytes.burst">
                <template #label>
                  <FormItemLabel
                    :label="getSchemaText('bytes_burst.label')"
                    :desc="getClientConfigDesc('bytes_burst')"
                    desc-marked
                  />
                </template>
                <el-input v-model="clientBytes.burst" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!-- Client Messages Limiter -->
            <el-col :span="12">
              <el-form-item prop="config.limiter.client.messages.rate">
                <template #label>
                  <FormItemLabel
                    :label="getSchemaText('messages_rate.label')"
                    :desc="getClientConfigDesc('messages_rate')"
                    desc-marked
                  />
                </template>
                <el-input v-model="clientMessages.rate" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="config.limiter.client.messages.burst">
                <template #label>
                  <FormItemLabel
                    :label="getSchemaText('messages_burst.label')"
                    :desc="getClientConfigDesc('messages_burst')"
                    desc-marked
                  />
                </template>
                <el-input v-model="clientMessages.burst" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!-- Client Delivery Bytes Limiter -->
            <el-col :span="12">
              <el-form-item prop="config.limiter.client.delivery_bytes.rate">
                <template #label>
                  <FormItemLabel
                    :label="getSchemaText('delivery_bytes_rate.label')"
                    :desc="getSchemaText('delivery_bytes_rate.desc')"
                    desc-marked
                  />
                </template>
                <el-input v-model="clientDeliveryBytes.rate" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="config.limiter.client.delivery_bytes.burst">
                <template #label>
                  <FormItemLabel
                    :label="getSchemaText('delivery_bytes_burst.label')"
                    :desc="getSchemaText('delivery_bytes_burst.desc')"
                    desc-marked
                  />
                </template>
                <el-input v-model="clientDeliveryBytes.burst" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!-- Client Delivery Messages Limiter -->
            <el-col :span="12">
              <el-form-item prop="config.limiter.client.delivery_messages.rate">
                <template #label>
                  <FormItemLabel
                    :label="getSchemaText('delivery_messages_rate.label')"
                    :desc="getSchemaText('delivery_messages_rate.desc')"
                    desc-marked
                  />
                </template>
                <el-input v-model="clientDeliveryMessages.rate" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="config.limiter.client.delivery_messages.burst">
                <template #label>
                  <FormItemLabel
                    :label="getSchemaText('delivery_messages_burst.label')"
                    :desc="getSchemaText('delivery_messages_burst.desc')"
                    desc-marked
                  />
                </template>
                <el-input v-model="clientDeliveryMessages.burst" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-align-footer">
        <CancelButton @click="showDialog = false" />
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          @click="save"
          :loading="submitLoading"
        >
          {{ props.namespace ? t('Base.update') : t('Base.create') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'
import useNamespace from '@/hooks/Config/useNamespace'
import { NamespaceItem } from '@/types/config'
import { toLower } from 'lodash'

const props = defineProps<{
  modelValue: boolean
  namespace?: NamespaceItem
}>()
const emit = defineEmits(['update:modelValue', 'submitted'])

const { t, tl } = useI18nTl('BasicConfig')
const getSchemaText = (key: string) => t(`ConfigSchema.${key}`)
const emptyMeaningDesc = / If empty, it means no limit\.|；为空时表示不限制/
const getClientConfigDesc = (key: string) => {
  return getSchemaText(`${key}.desc`).replace(emptyMeaningDesc, '')
}
const clientText = /a single client|单个客户端/
const getTenantConfigDesc = (key: string) => {
  const desc = getClientConfigDesc(key)
  return desc.replace(clientText, toLower(tl('currentTenant')))
}

const createEmptyRateConfig = () => ({ rate: '', burst: '' })
const createEmptyTenantLimiterConfig = () => ({
  bytes: createEmptyRateConfig(),
  messages: createEmptyRateConfig(),
})
const createEmptyClientLimiterConfig = () => ({
  bytes: createEmptyRateConfig(),
  messages: createEmptyRateConfig(),
  delivery_bytes: createEmptyRateConfig(),
  delivery_messages: createEmptyRateConfig(),
})
const generateRawRecord = (): NamespaceItem => ({
  ns: '',
  config: {
    limiter: { tenant: 'disabled', client: 'disabled' },
    session: { max_sessions: INFINITY_VALUE },
  },
})

const submitLoading = ref(false)
const record = ref(generateRawRecord())
const { createRequiredRule } = useFormRules()
const createLimiterRule = (label: string) => [
  ...createRequiredRule(label),
  { pattern: LIMITER_REG, message: t('Rule.formatError'), trigger: 'blur' },
]
const rules = {
  ns: createRequiredRule(tl('namespace')),
  'config.session.max_sessions': [
    {
      validator: (rule: any, value: string | number, callback: (error?: Error) => void) => {
        let error: Error | undefined
        if (isUndefined(value)) {
          error = new Error(t('Rule.formatError'))
        }
        callback(error)
      },
    },
  ],
  'config.limiter.tenant.bytes.rate': createLimiterRule(getSchemaText('bytes_rate.label')),
  'config.limiter.tenant.bytes.burst': createLimiterRule(getSchemaText('bytes_burst.label')),
  'config.limiter.tenant.messages.rate': createLimiterRule(getSchemaText('messages_rate.label')),
  'config.limiter.tenant.messages.burst': createLimiterRule(getSchemaText('messages_burst.label')),
  'config.limiter.client.bytes.rate': createLimiterRule(getSchemaText('bytes_rate.label')),
  'config.limiter.client.bytes.burst': createLimiterRule(getSchemaText('bytes_burst.label')),
  'config.limiter.client.messages.rate': createLimiterRule(getSchemaText('messages_rate.label')),
  'config.limiter.client.messages.burst': createLimiterRule(getSchemaText('messages_burst.label')),
  'config.limiter.client.delivery_bytes.rate': createLimiterRule(
    getSchemaText('delivery_bytes_rate.label'),
  ),
  'config.limiter.client.delivery_bytes.burst': createLimiterRule(
    getSchemaText('delivery_bytes_burst.label'),
  ),
  'config.limiter.client.delivery_messages.rate': createLimiterRule(
    getSchemaText('delivery_messages_rate.label'),
  ),
  'config.limiter.client.delivery_messages.burst': createLimiterRule(
    getSchemaText('delivery_messages_burst.label'),
  ),
}
const FormCom = ref()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const dialogTitle = computed(() => {
  return `${props.namespace ? t('Base.edit') : t('Base.create')}${t('Base.wordBdy')}${tl('namespace')}`
})

// Session config handler
const sessionMaxValue = computed({
  get() {
    const currentVal = record.value.config.session?.max_sessions
    return currentVal === INFINITY_VALUE ? INFINITY_VALUE : currentVal
  },
  set(val) {
    if (!record.value.config.session) {
      record.value.config.session = {}
    }
    record.value.config.session.max_sessions = val
  },
})

const tenantLimiter = computed({
  get() {
    return record.value.config.limiter?.tenant
  },
  set(val) {
    if (!record.value.config.limiter) {
      record.value.config.limiter = {}
    }
    record.value.config.limiter.tenant = val
  },
})

// Computed properties to handle tenant limiter
const isActiveTenantLimiter = computed(() => {
  return tenantLimiter.value !== 'disabled' && !!tenantLimiter.value
})

const tenantBytes = computed({
  get: () => {
    if (isActiveTenantLimiter.value && typeof tenantLimiter.value !== 'string') {
      return tenantLimiter.value?.bytes || createEmptyRateConfig()
    }
    return createEmptyRateConfig()
  },
  set: (val) => {
    if (tenantLimiter.value !== 'disabled' && tenantLimiter.value) {
      tenantLimiter.value.bytes = val
    }
  },
})

const tenantMessages = computed({
  get: () => {
    if (isActiveTenantLimiter.value && typeof tenantLimiter.value !== 'string') {
      return tenantLimiter.value?.messages || createEmptyRateConfig()
    }
    return createEmptyRateConfig()
  },
  set: (val) => {
    if (tenantLimiter.value !== 'disabled' && tenantLimiter.value) {
      tenantLimiter.value.messages = val
    }
  },
})

const clientLimiter = computed({
  get() {
    return record.value.config.limiter?.client
  },
  set(val) {
    if (!record.value.config.limiter) {
      record.value.config.limiter = {}
    }
    record.value.config.limiter.client = val
  },
})
// Computed properties to handle client limiter
const isActiveClientLimiter = computed(() => {
  return clientLimiter.value !== 'disabled' && !!clientLimiter.value
})

const clientBytes = computed({
  get: () => {
    if (isActiveClientLimiter.value && typeof clientLimiter.value !== 'string') {
      return clientLimiter.value?.bytes || createEmptyRateConfig()
    }
    return createEmptyRateConfig()
  },
  set: (val) => {
    if (clientLimiter.value !== 'disabled' && clientLimiter.value) {
      clientLimiter.value.bytes = val
    }
  },
})

const clientMessages = computed({
  get: () => {
    if (isActiveClientLimiter.value && typeof clientLimiter.value !== 'string') {
      return clientLimiter.value?.messages || createEmptyRateConfig()
    }
    return createEmptyRateConfig()
  },
  set: (val) => {
    if (clientLimiter.value !== 'disabled' && clientLimiter.value) {
      clientLimiter.value.messages = val
    }
  },
})

const clientDeliveryBytes = computed({
  get: () => {
    if (isActiveClientLimiter.value && typeof clientLimiter.value !== 'string') {
      return clientLimiter.value?.delivery_bytes || createEmptyRateConfig()
    }
    return createEmptyRateConfig()
  },
  set: (val) => {
    if (clientLimiter.value !== 'disabled' && clientLimiter.value) {
      clientLimiter.value.delivery_bytes = val
    }
  },
})

const clientDeliveryMessages = computed({
  get: () => {
    if (isActiveClientLimiter.value && typeof clientLimiter.value !== 'string') {
      return clientLimiter.value?.delivery_messages || createEmptyRateConfig()
    }
    return createEmptyRateConfig()
  },
  set: (val) => {
    if (clientLimiter.value !== 'disabled' && clientLimiter.value) {
      clientLimiter.value.delivery_messages = val
    }
  },
})

watch(showDialog, async (value: boolean) => {
  if (!value) {
    await waitAMoment(200)
    record.value = generateRawRecord()
  } else if (props.namespace) {
    // Clone the namespace data if editing
    record.value = cloneDeep(props.namespace)
  }
})

// Toggle functions for limiter switches
const toggleTenantLimiter = (enabled: boolean) => {
  if (!record.value.config.limiter) {
    record.value.config.limiter = {}
  }
  tenantLimiter.value = enabled ? createEmptyTenantLimiterConfig() : 'disabled'
}

const toggleClientLimiter = (enabled: boolean) => {
  if (!record.value.config.limiter) {
    record.value.config.limiter = {}
  }
  clientLimiter.value = enabled ? createEmptyClientLimiterConfig() : 'disabled'
}

const { createNamespace, updateNamespaceConfig } = useNamespace()

const save = async () => {
  try {
    await FormCom.value.validate()
    const data = cloneDeep(record.value)
    submitLoading.value = true
    try {
      const request = props.namespace ? updateNamespaceConfig : createNamespace
      await request(checkNOmitFromObj(data) as NamespaceItem)
      ElMessage.success(props.namespace ? t('Base.updateSuccess') : t('Base.createSuccess'))
      showDialog.value = false
      emit('submitted')
    } catch (error) {
      //
    } finally {
      submitLoading.value = false
    }
  } catch (error) {
    //
  }
}
</script>

<style lang="scss">
.namespace-dialog {
  .config-section {
    .section-title {
      font-weight: 500;
      margin-bottom: 16px;
    }
  }
  .el-divider {
    margin-top: 4px;
  }

  .namespace-display {
    display: block;
    box-sizing: border-box;
    width: 100%;
    padding: 1px 11px;
    line-height: var(--el-input-height, 32px);
    height: var(--el-input-height, 32px);
    background-color: var(--el-disabled-bg-color);
    border: 1px solid var(--el-disabled-border-color);
    border-radius: var(--el-input-border-radius, 4px);
    color: var(--el-text-color-placeholder);
    cursor: not-allowed;
    overflow: hidden;
    white-space: nowrap;
    .common-overflow-tooltip {
      display: block;
      width: 100%;
    }
  }
}
</style>
