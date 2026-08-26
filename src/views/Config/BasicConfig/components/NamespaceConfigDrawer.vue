<template>
  <el-drawer
    :title="t('components.settings')"
    v-model="showDrawer"
    size="500px"
    destroy-on-close
    class="settings"
    @open="handleOpen"
  >
    <div v-loading="isLoading">
      <el-form
        ref="FormRef"
        class="configuration-form"
        label-position="top"
        :model="record"
        :rules="rules"
      >
        <el-form-item prop="allow_only_managed_namespaces">
          <template #label>
            <FormItemLabel
              :label="tl('allowOnlyManagedNamespaces')"
              :desc="tl('allowOnlyManagedNamespacesDesc')"
            />
          </template>
          <el-switch v-model="record.allow_only_managed_namespaces" />
        </el-form-item>
        <el-form-item prop="default_max_sessions">
          <template #label>
            <FormItemLabel :label="tl('defaultMaxSessions')" :desc="tl('defaultMaxSessionsDesc')" />
          </template>
          <Oneof
            class="in-one-row"
            v-model="record.default_max_sessions"
            :items="[{ type: 'number' }, { symbols: [INFINITY_VALUE], type: 'enum' }]"
          />
        </el-form-item>
        <el-form-item prop="deny_namespaces">
          <template #label>
            <FormItemLabel
              :max-height="360"
              :label="tl('deniedNamespaceNames')"
              :desc="tl('deniedNamespaceNamesDesc')"
              desc-marked
            />
          </template>
          <ArrayEditor v-model="record.deny_namespaces" />
        </el-form-item>
      </el-form>
      <el-divider>
        <span class="text-nowrap">{{ t('BasicConfig.namespaceRelatedConfig') }}</span>
      </el-divider>
      <!-- MQTT -->
      <el-form
        ref="namespaceMqttFormRef"
        class="configuration-form"
        label-position="top"
        :rules="namespaceMqttRules"
        :model="namespaceMqttConfig"
      >
        <el-form-item>
          <template #label>
            <FormItemLabel
              :label="tl('namespaceResolutionTiming')"
              :desc="tl('namespaceResolutionTimingDesc')"
            />
          </template>
          <el-radio-group v-model="namespaceSourceTiming">
            <el-radio :value="NamespaceSourceTiming.BeforeAuth">
              {{ tl('beforeAuthentication') }}
            </el-radio>
            <el-radio :value="NamespaceSourceTiming.AfterAuth">
              {{ tl('afterAuthentication') }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="namespaceSourceTiming === NamespaceSourceTiming.AfterAuth"
          prop="post_auth_tns_expression"
        >
          <template #label>
            <FormItemLabel
              :max-height="360"
              :label="tl('takeNamespaceFrom')"
              :desc="tl('postAuthTnsExpressionDesc')"
              desc-marked
            />
          </template>
          <el-input v-model="record.post_auth_tns_expression" />
        </el-form-item>
        <el-form-item v-else prop="tns">
          <template #label>
            <FormItemLabel
              :max-height="300"
              :label="tl('takeNamespaceFrom')"
              :desc="tl('takeNamespaceFromBeforeAuthDesc')"
              desc-marked
            />
          </template>
          <el-input v-model="namespaceMqttConfig.tns" />
        </el-form-item>

        <el-form-item prop="clientid_override">
          <template #label>
            <FormItemLabel
              :max-height="300"
              :label="tl('clientIdIsolation')"
              :desc="tl('clientIdIsolationDesc')"
              desc-marked
            />
          </template>
          <Oneof
            class="in-one-row"
            :model-value="namespaceMqttConfig.clientid_override"
            :items="[{ type: 'string' }, { type: 'enum', symbols: [CLIENT_ID_OVERRIDE_DISABLED] }]"
            @update:model-value="handleClientIdOverrideChange"
          />
        </el-form-item>
        <el-form-item prop="namespace_as_mountpoint">
          <template #label>
            <FormItemLabel
              :max-height="300"
              :label="tConfigText('namespace_as_mountpoint.label')"
              :desc="tConfigText('namespace_as_mountpoint.desc')"
              desc-marked
            />
          </template>
          <el-switch v-model="namespaceMqttConfig.namespace_as_mountpoint" />
        </el-form-item>
      </el-form>
      <!-- AUTHZ -->
      <el-form class="configuration-form" label-position="top" :model="namespaceAuthzConfig">
        <el-form-item prop="include_mountpoint">
          <template #label>
            <FormItemLabel
              :label="t('Auth.includeMountpoint')"
              :desc="t('Auth.includeMountpointDesc')"
            />
          </template>
          <el-switch v-model="namespaceAuthzConfig.include_mountpoint" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button type="primary" @click="submit">
        {{ t('Base.confirm') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { getConfigs, putConfigs } from '@/api/config'
import { FormInstance } from 'element-plus'

const CLIENT_ID_OVERRIDE_DISABLED = 'disabled'
const DEFAULT_OVERRIDE_EXP = `concat([client_attrs.tns, '-', clientid])`
const DEFAULT_DENY_NAMESPACES = ['global', 'undefined', 'null', 'none']

const MULTI_TENANCY_KEY = 'multi_tenancy'
enum NamespaceSourceTiming {
  BeforeAuth = 'before_auth',
  AfterAuth = 'after_auth',
}

const { t } = useI18n()

type MultiTenancyConfig = {
  default_max_sessions: number | string
  allow_only_managed_namespaces: boolean
  post_auth_tns_expression: string
  deny_namespaces: string[]
}

const createDefaultRecord = (): MultiTenancyConfig => ({
  default_max_sessions: 1000,
  allow_only_managed_namespaces: false,
  post_auth_tns_expression: '',
  deny_namespaces: [...DEFAULT_DENY_NAMESPACES],
})
type MultiTenancyConfig = ReturnType<typeof createDefaultRecord>
type MultiTenancyConfigsResponse = Partial<
  Record<typeof MULTI_TENANCY_KEY, Partial<MultiTenancyConfig>>
>
const record = ref(createDefaultRecord())
const namespaceSourceTiming = ref<NamespaceSourceTiming>(NamespaceSourceTiming.BeforeAuth)

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
})
const emit = defineEmits(['update:modelValue'])
const showDrawer: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const { tl } = useI18nTl('BasicConfig')
const tConfigText = (key: string) => t(`ConfigSchema.${key}`)

const sessionsPattern = /^(\d+|infinity)$/
const rules = {
  default_max_sessions: [
    {
      pattern: /^(\d+|infinity)$/,
      validator(rule: any, value: string, callback: (error?: Error) => void) {
        if (!sessionsPattern.test(value)) {
          callback(new Error(t('Rule.formatError')))
        }
        callback()
      },
    },
  ],
}

const isLoading = ref(false)
const getNamespaceConfigs = async () => {
  try {
    isLoading.value = true
    const temp = await getConfigs<MultiTenancyConfigsResponse>(MULTI_TENANCY_KEY)
    const nextRecord = {
      ...createDefaultRecord(),
      ...(temp[MULTI_TENANCY_KEY] ?? {}),
    }
    record.value = nextRecord
    namespaceSourceTiming.value = nextRecord.post_auth_tns_expression
      ? NamespaceSourceTiming.AfterAuth
      : NamespaceSourceTiming.BeforeAuth
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const FormRef = ref()
const syncNamespaceSourceConfig = () => {
  if (namespaceSourceTiming.value === NamespaceSourceTiming.BeforeAuth) {
    record.value.post_auth_tns_expression = ''
  } else {
    namespaceMqttConfig.value.tns = ''
  }
}
const updateNamespaceConfig = async () => {
  try {
    await FormRef.value.validate()
    const data = `multi_tenancy {
    allow_only_managed_namespaces = ${record.value.allow_only_managed_namespaces}, 
    default_max_sessions = ${record.value.default_max_sessions},
    post_auth_tns_expression = ${JSON.stringify(record.value.post_auth_tns_expression ?? '')},
    deny_namespaces = ${JSON.stringify(record.value.deny_namespaces ?? [])}
}`
    await putConfigs(data)
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}

/* MQTT */
const { namespaceMqttConfig, getNamespaceMqttConfig, updateNamespaceMqttConfig } =
  useNamespaceMqttConfig()
const namespaceMqttFormRef = useTemplateRef<FormInstance>('namespaceMqttFormRef')
const namespaceMqttRules = {
  clientid_override: [
    {
      validator(_rules: any, value: string, cb: (error?: Error) => void) {
        let error = undefined
        if (!value) {
          error = new Error(t('Rule.inputRequired'))
        }
        cb(error)
      },
    },
  ],
}
const handleClientIdOverrideChange = (val: string) => {
  if (namespaceMqttConfig.value.clientid_override === CLIENT_ID_OVERRIDE_DISABLED && !val) {
    namespaceMqttConfig.value.clientid_override = DEFAULT_OVERRIDE_EXP
  } else {
    namespaceMqttConfig.value.clientid_override = val
  }
}

/* AUTHZ */
const { namespaceAuthzConfig, getNamespaceAuthzConfig, updateNamespaceAuthzConfig } =
  useNamespaceAuthzConfig()

const handleOpen = async () => {
  try {
    isLoading.value = true
    await Promise.all([getNamespaceConfigs(), getNamespaceMqttConfig(), getNamespaceAuthzConfig()])
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const submit = async () => {
  try {
    syncNamespaceSourceConfig()
    await namespaceMqttFormRef.value?.validate()
    await Promise.all([
      updateNamespaceConfig(),
      updateNamespaceMqttConfig(),
      updateNamespaceAuthzConfig(),
    ])
    ElMessage.success(t('Base.updateSuccess'))
    showDrawer.value = false
  } catch (error) {
    //
  }
}
</script>

<style lang="scss">
.settings {
  .el-form-item {
    margin-bottom: 24px;
  }
}
</style>
