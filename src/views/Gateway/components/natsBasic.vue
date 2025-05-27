<template>
  <div class="nats-basic">
    <el-form label-position="top" :model="nValue">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('serverName')">
            <el-input v-model="nValue.server_name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input v-model="nValue.mountpoint" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('defaultHeartbeatInterval')">
            <TimeInputWithUnitSelect
              v-model="nValue.default_heartbeat_interval"
              :number-placeholder="parseInt(nValueDefault.default_heartbeat_interval).toString()"
              :enabled-units="['s']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('heartbeatWaitTimeout')">
            <TimeInputWithUnitSelect
              v-model="nValue.heartbeat_wait_timeout"
              :number-placeholder="parseInt(nValueDefault.heartbeat_wait_timeout).toString()"
              :enabled-units="['s']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <template #label>
              <FormItemLabel
                :label="t('Extension.maxPayloadSize')"
                :desc="tl('maxPayloadSizeDesc')"
              />
            </template>
            <CustomInputNumber
              v-model.number="nValue.protocol.max_payload_size"
              :min="0"
              :placeholder="String(nValueDefault.protocol.max_payload_size)"
            >
              <template #suffix>
                <span>Bytes</span>
              </template>
            </CustomInputNumber>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <TimeInputWithUnitSelect
              v-model="nValue.idle_timeout"
              :number-placeholder="parseInt(nValueDefault.idle_timeout).toString()"
              :enabled-units="['s']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-switch v-model="nValue.enable_stats" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="24">
          <el-divider> {{ tl('clientInfoOverride') }} </el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('Base.username')">
            <el-input v-model="nValue.clientinfo_override.username" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('Base.password')">
            <el-input v-model="nValue.clientinfo_override.password" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('Base.clientid')">
            <el-input v-model="nValue.clientinfo_override.clientid" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
type NatsGatewayConfig = Record<string, any>

const props = withDefaults(
  defineProps<{
    value: NatsGatewayConfig
  }>(),
  {
    value: () => ({}),
  },
)

const emit = defineEmits<{
  (e: 'update:value', value: NatsGatewayConfig): void
}>()

const createDefault = () => ({
  server_id: '',
  server_name: 'emq_nats_gateway',
  default_heartbeat_interval: '30s',
  heartbeat_wait_timeout: '5s',
  protocol: {
    max_payload_size: 1048576,
  },
  mountpoint: '',
  enable_stats: true,
  idle_timeout: '30s',
  clientinfo_override: {
    username: '',
    password: '',
    clientid: '',
  },
})

const nValueDefault = createDefault()
const nValue = reactive(merge(createDefault(), props.value))
const { t, tl } = useI18nTl('Gateway')

watch(nValue, (v) => {
  emit('update:value', v)
})
onMounted(() => {
  emit('update:value', nValue)
})
</script>
