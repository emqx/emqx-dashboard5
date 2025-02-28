<template>
  <div>
    <el-form label-position="top">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item prop="connection_required">
            <template #label>
              <FormItemLabel
                :label="tl('connectionRequire')"
                :desc="tl('connectionRequireDesc')"
                desc-marked
              />
            </template>
            <BooleanSelect v-model="cValue.connection_required" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('notifyType')">
            <el-select v-model="cValue.notify_type">
              <el-option value="qos" />
              <el-option value="con" />
              <el-option value="non" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="cValue.connection_required === true">
          <el-form-item :label="tl('heartbeat')">
            <TimeInputWithUnitSelect
              v-model="cValue.heartbeat"
              :number-placeholder="parseInt(cValueDefault.heartbeat).toString()"
              :enabled-units="['s']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('subQos')">
            <el-select v-model="cValue.subscribe_qos">
              <el-option v-for="item in qosOptions" :key="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('pubQos')">
            <el-select v-model="cValue.publish_qos">
              <el-option v-for="item in qosOptions" :key="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input v-model="cValue.mountpoint" :placeholder="cValueDefault.mountpoint" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="tl('useLog')">
            <el-switch v-model="cValue.enable_stats" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { CoapGatewayConfig } from '@/types/typeAlias'

const props = defineProps<{
  value?: CoapGatewayConfig
}>()

const emit = defineEmits<{
  (e: 'update:value', value: CoapGatewayConfig): void
}>()

const createDefault = () => ({
  connection_required: false,
  heartbeat: '30s',
  notify_type: 'qos',
  enable_stats: true,
  subscribe_qos: 'coap',
  publish_qos: 'coap',
  mountpoint: '',
})

const cValueDefault = createDefault()

const { t } = useI18n()

const cValue = reactive(merge(createDefault(), props.value))

const qosOptions = ['coap', 'qos0', 'qos1', 'qos2']

const checkHeartBeat = (source: Record<string, any>) => {
  if (!source.connection_required) {
    Reflect.deleteProperty(source, 'heartbeat')
  } else if (source.connection_required && !source.heartbeat) {
    source.heartbeat = createDefault().heartbeat
  }
  return source
}

watch(
  () => cValue.connection_required,
  () => {
    emit('update:value', checkHeartBeat(cValue))
  },
)

onMounted(() => {
  emit('update:value', checkHeartBeat(cValue))
})

const tl = (key: string, collection = 'Gateway') => t(collection + '.' + key)
</script>
