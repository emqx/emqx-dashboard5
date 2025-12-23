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
      </el-form>
      <el-divider>
        <span class="text-nowrap">{{ t('BasicConfig.namespaceRelatedConfig') }}</span>
      </el-divider>
      <!-- MQTT -->
      <el-form class="configuration-form" label-position="top" :model="namespaceMqttConfig">
        <el-form-item prop="tns">
          <template #label>
            <FormItemLabel
              :max-height="300"
              :label="tl('takeNamespaceFrom')"
              :desc="tl('takeNamespaceFromDesc')"
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
            v-model="namespaceMqttConfig.clientid_override"
            :items="[{ type: 'string' }, { type: 'enum', symbols: ['disabled'] }]"
          />
        </el-form-item>
      </el-form>
      <!-- LISTENER -->
      <el-form class="configuration-form" label-position="top" :model="defaultTcpNamespaceConfig">
        <el-form-item prop="mountpoint">
          <template #label>
            <FormItemLabel :label="tl('defaultTCPListenerMountpoint')" />
          </template>
          <el-input v-model="defaultTcpNamespaceConfig.mountpoint" />
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
import parseHoconToObject from 'hocon-parser'

const MULTI_TENANCY_KEY = 'multi_tenancy'

const { t } = useI18n()

const record = ref({
  default_max_sessions: 1000,
  allow_only_managed_namespaces: false,
})

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
    const temp = await getConfigs(MULTI_TENANCY_KEY)
    record.value = parseHoconToObject(temp)?.[MULTI_TENANCY_KEY]
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const FormRef = ref()
const updateNamespaceConfig = async () => {
  try {
    await FormRef.value.validate()
    const data = `multi_tenancy {
    allow_only_managed_namespaces = ${record.value.allow_only_managed_namespaces}, 
    default_max_sessions = ${record.value.default_max_sessions}
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
getNamespaceMqttConfig()

/* LISTENER */
const { defaultTcpNamespaceConfig, getNamespaceListenerConfig, updateNamespaceListenerConfig } =
  useNamespaceListenerConfig()
getNamespaceListenerConfig()

/* AUTHZ */
const { namespaceAuthzConfig, getNamespaceAuthzConfig, updateNamespaceAuthzConfig } =
  useNamespaceAuthzConfig()
getNamespaceAuthzConfig()

const handleOpen = async () => {
  try {
    isLoading.value = true
    await Promise.allSettled([
      getNamespaceConfigs(),
      getNamespaceMqttConfig(),
      getNamespaceListenerConfig(),
      getNamespaceAuthzConfig(),
    ])
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const submit = async () => {
  try {
    await Promise.allSettled([
      updateNamespaceConfig(),
      updateNamespaceMqttConfig(),
      updateNamespaceListenerConfig(),
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
