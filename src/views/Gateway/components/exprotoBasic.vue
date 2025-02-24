<template>
  <div>
    <el-form label-position="top">
      <div>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item :label="tl('useLog')">
              <BooleanSelect v-model="eValue.enable_stats" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('idleTime')">
              <TimeInputWithUnitSelect
                v-model="eValue.idle_timeout"
                number-placeholder="3"
                :enabled-units="['s']"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Mount Setting -->
      <div>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item :label="tl('mountPoint')">
              <el-input v-model="eValue.mountpoint" :placeholder="eValueDefault.mountpoint" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Adapter -->
      <div>
        <div class="part-header">{{ tl('grpcListener') }}</div>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item :label="tl('lAddress')">
              <el-input v-model="eValue.server.bind" :placeholder="eValueDefault.server.bind" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="tls-config-form">
          <TLSEnableConfig
            v-model="(eValue.server as any).ssl_options"
            :is-edit="isEdit"
            :show-sni="false"
            :verify-label="tl('tlsVerifyClient', 'Base')"
          />
        </div>
      </div>

      <!-- Handler -->
      <div>
        <div class="part-header">{{ tl('grpcConnection') }}</div>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item :label="'Server'">
              <el-input
                v-model="eValue.handler.address"
                :placeholder="eValueDefault.handler.address"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <CommonTLSConfig
          class="tls-config-form"
          v-model="(eValue.handler as any).ssl_options"
          :is-edit="isEdit"
        />
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ExprotoGatewayConfig } from '@/types/typeAlias'

const props = defineProps<{
  value?: ExprotoGatewayConfig
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:value', value: Record<string, any>): void
}>()

const createDefaultValue = () => ({
  enable_stats: true,
  idle_timeout: '30s',
  mountpoint: '',
  handler: {
    address: 'http://127.0.0.1:9001',
    ssl_options: {
      certfile: '',
      keyfile: '',
      cacertfile: '',
      enable: false,
    },
  },
  server: {
    bind: '0.0.0.0:9100',
    ssl_options: {
      certfile: '',
      keyfile: '',
      cacertfile: '',
    },
  },
})

const eValueDefault = createDefaultValue()

const { t } = useI18n()

const eValue = reactive(_.merge(createDefaultValue(), props.value || {}))

watch(
  () => _.cloneDeep(eValue),
  (v) => {
    emit('update:value', v)
  },
)

onMounted(() => {
  emit('update:value', eValue)
})

const tl = (key: string, collection = 'Gateway') => t(collection + '.' + key)
</script>

<style lang="scss" scoped>
.tls-config-form {
  margin-top: 20px;

  :deep(.TLS-base-config) .TLS-base-config-title {
    color: var(--el-text-color-regular);
    font-size: 16px;
  }
  :deep(.TLS-enable-config) {
    .TLS-input {
      width: 75%;
    }
  }
}
</style>
