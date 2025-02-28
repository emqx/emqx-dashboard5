<template>
  <div class="ocpp-basic">
    <el-form label-position="top" :model="oValue">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input v-model="oValue.mountpoint" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('defaultHeartbeatInterval')">
            <TimeInputWithUnitSelect
              v-model="oValue.default_heartbeat_interval"
              :number-placeholder="parseInt(createDefault().default_heartbeat_interval).toString()"
              :enabled-units="['h', 's', 'ms']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('heartbeatCheckingTimesBackoff')">
            <template #label>
              <FormItemLabel
                :label="tl('heartbeatCheckingTimesBackoff')"
                :desc="tl('heartbeatCheckingTimesBackoffDesc')"
              />
            </template>
            <CustomInputNumber
              v-model.number="oValue.heartbeat_checking_times_backoff"
              :min="0"
              controls-position="right"
              :placeholder="String(createDefault().heartbeat_checking_times_backoff)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('messageFormatChecking')">
            <el-select v-model="oValue.message_format_checking">
              <el-option label="All" value="all"></el-option>
              <el-option label="Upstream Only" value="upstream_only"></el-option>
              <el-option label="Downstream Only" value="dnstream_only"></el-option>
              <el-option label="Disable" value="disable"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('jsonSchemaDir')">
            <el-input v-model="oValue.json_schema_dir" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('jsonSchemaIdPrefix')">
            <el-input v-model="oValue.json_schema_id_prefix" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <TimeInputWithUnitSelect
              v-model="oValue.idle_timeout"
              :number-placeholder="parseInt(createDefault().idle_timeout).toString()"
              :enabled-units="['s', 'ms']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="tl('useLog')">
            <el-switch v-model="oValue.enable_stats" />
          </el-form-item>
        </el-col>
        <!-- Upstream -->
        <el-col :span="24">
          <el-divider>{{ tl('upstream') }}</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('upstreamTopic')">
            <el-input v-model="oValue.upstream.topic" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('upstreamReplyTopic')">
            <el-input v-model="oValue.upstream.reply_topic" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('upstreamErrorTopic')">
            <el-input v-model="oValue.upstream.error_topic" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="tl('topicOverrideMapping')">
            <KeyAndValueEditor v-model="oValue.upstream.topic_override_mapping" />
          </el-form-item>
        </el-col>
        <!-- Dnstream -->
        <el-col :span="24">
          <el-divider>{{ tl('dnstream') }}</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('dnstreamTopic')">
            <el-input v-model="oValue.dnstream.topic" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('dnstreamMaxMqueueLen')">
            <CustomInputNumber
              v-model.number="oValue.dnstream.max_mqueue_len"
              :min="0"
              controls-position="right"
              :placeholder="String(createDefault().dnstream.max_mqueue_len)"
            />
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
  mountpoint: 'ocpp/',
  default_heartbeat_interval: '60s',
  heartbeat_checking_times_backoff: 1,
  upstream: {
    topic: 'cp/${cid}',
    topic_override_mapping: {}, // You need to fill this with the default structure of topic_override_mapping
    reply_topic: 'cp/${cid}/Reply',
    error_topic: 'cp/${cid}/Reply',
  },
  dnstream: {
    topic: 'cs/${cid}',
    max_mqueue_len: 100,
  },
  message_format_checking: 'all', // This is assuming that 'all' is the default value
  json_schema_dir: '${application_priv}/schemas',
  json_schema_id_prefix: 'urn:OCPP:1.6:2019:12:',
  idle_timeout: '30s',
  enable_stats: true,
})

const oValue = reactive(merge(createDefault(), props.value))

const { tl } = useI18nTl('Gateway')

watch(oValue, (v) => {
  emit('update:value', v)
})
onMounted(() => {
  emit('update:value', oValue)
})
</script>
