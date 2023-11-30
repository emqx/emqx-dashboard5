<template>
  <div class="jt808-basic">
    <el-form label-position="top" v-model="jValue">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input v-model="jValue.mountpoint" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxLenOfFrame')">
            <CustomInputNumber
              v-model.number="jValue.frame.max_length"
              :min="0"
              controls-position="right"
              :placeholder="String(createDefault().frame.max_length)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('retryInterval')">
            <TimeInputWithUnitSelect
              v-model="jValue.retry_interval"
              :number-placeholder="parseInt(createDefault().retry_interval).toString()"
              :enabled-units="['s']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxRetryTimes')">
            <CustomInputNumber
              v-model.number="jValue.max_retry_times"
              :min="0"
              controls-position="right"
              :placeholder="String(createDefault().max_retry_times)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('msgQueueLen')">
            <CustomInputNumber
              v-model.number="jValue.message_queue_len"
              :min="0"
              controls-position="right"
              :placeholder="String(createDefault().message_queue_len)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <TimeInputWithUnitSelect
              v-model="jValue.idle_timeout"
              :number-placeholder="parseInt(createDefault().idle_timeout).toString()"
              :enabled-units="['s', 'ms']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="tl('useLog')">
            <el-switch v-model="jValue.enable_stats" />
          </el-form-item>
        </el-col>
        <!-- Proto -->
        <el-col :span="12">
          <el-form-item :label="tl('registry')">
            <template #label>
              <FormItemLabel :label="tl('registry')" :desc="tl('registryDesc')" desc-marked />
            </template>
            <el-input v-model="jValue.proto.registry" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('authenticationUrl')">
            <template #label>
              <FormItemLabel
                :label="tl('authenticationUrl')"
                :desc="tl('authenticationUrlDesc')"
                desc-marked
              />
            </template>
            <el-input v-model="jValue.proto.authentication" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('upTopic')">
            <el-input v-model="jValue.proto.up_topic" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('dnTopic')">
            <el-input v-model="jValue.proto.dn_topic" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('allowAnonymous')">
            <el-switch v-model="jValue.proto.allow_anonymous" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch, defineProps, defineEmits } from 'vue'
import _ from 'lodash'
import useI18nTl from '@/hooks/useI18nTl'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'

const props = defineProps({
  value: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:value'])

const createDefault = () => ({
  frame: {
    max_length: 8192,
  },
  proto: {
    allow_anonymous: true,
    registry: undefined,
    authentication: undefined,
    up_topic: 'jt808/${clientid}/${phone}/up',
    dn_topic: 'jt808/${clientid}/${phone}/dn',
  },
  mountpoint: 'jt808/${clientid}/',
  retry_interval: '8s',
  max_retry_times: 3,
  message_queue_len: 10,
  enable_stats: true,
  idle_timeout: '30s',
})

const jValue = reactive(_.merge(createDefault(), props.value))

const { tl } = useI18nTl('Gateway')

watch(jValue, (v) => {
  emit('update:value', v)
})
onMounted(() => {
  emit('update:value', jValue)
})
</script>
