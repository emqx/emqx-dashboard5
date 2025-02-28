<template>
  <div class="gbt32960-basic">
    <el-form label-position="top" :model="gbtValue">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input v-model="gbtValue.mountpoint" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('retryInterval')">
            <TimeInputWithUnitSelect
              v-model="gbtValue.retry_interval"
              :number-placeholder="parseInt(createDefault().retry_interval).toString()"
              :enabled-units="['s']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxRetryTimes')">
            <CustomInputNumber
              v-model.number="gbtValue.max_retry_times"
              :min="0"
              controls-position="right"
              :placeholder="String(createDefault().max_retry_times)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('msgQueueLen')">
            <CustomInputNumber
              v-model.number="gbtValue.message_queue_len"
              :min="0"
              controls-position="right"
              :placeholder="String(createDefault().message_queue_len)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <TimeInputWithUnitSelect
              v-model="gbtValue.idle_timeout"
              :number-placeholder="parseInt(createDefault().idle_timeout).toString()"
              :enabled-units="['s', 'ms']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="tl('useLog')">
            <el-switch v-model="gbtValue.enable_stats" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:value'])

const createDefault = () => ({
  mountpoint: 'gbt32960/${clientid}/',
  retry_interval: '8s',
  max_retry_times: 3,
  message_queue_len: 10,
  enable_stats: true,
  idle_timeout: '30s',
})

const gbtValue = reactive(merge(createDefault(), props.value))

const { tl } = useI18nTl('Gateway')

watch(gbtValue, (v) => {
  emit('update:value', v)
})
onMounted(() => {
  emit('update:value', gbtValue)
})
</script>
