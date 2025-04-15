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
            <el-input v-model="record.ns" :disabled="!!props.namespace" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxSessions')">
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
            <div class="section-title">{{ tl('targetLimiter', { target: tl('tenant') }) }}</div>
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
              <el-form-item>
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
              <el-form-item>
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
              <el-form-item>
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
              <el-form-item>
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
            <div class="section-title">{{ tl('targetLimiter', { target: tl('client') }) }}</div>
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
              <el-form-item>
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
              <el-form-item>
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
              <el-form-item>
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
              <el-form-item>
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
        </template>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="showDialog = false">{{ t('Base.cancel') }}</el-button>
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
const createEmptyLimiterConfig = () => ({
  bytes: createEmptyRateConfig(),
  messages: createEmptyRateConfig(),
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
const rules = {
  ns: createRequiredRule(tl('namespace')),
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
  get: () => record.value.config.session?.max_sessions ?? INFINITY_VALUE,
  set: (val) => {
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

  tenantLimiter.value = enabled ? createEmptyLimiterConfig() : 'disabled'
}

const toggleClientLimiter = (enabled: boolean) => {
  if (!record.value.config.limiter) {
    record.value.config.limiter = {}
  }

  clientLimiter.value = enabled ? createEmptyLimiterConfig() : 'disabled'
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
}
</style>
