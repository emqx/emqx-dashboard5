<template>
  <el-col :span="12">
    <el-form-item prop="resource_opts.worker_pool_size">
      <template #label>
        <FormItemLabel :label="tl('workerPoolSize')" :desc="tl('workerPoolSize')" />
      </template>
      <el-input v-model="resourceOptForm.worker_pool_size" />
    </el-form-item>
  </el-col>
  <el-col :span="12">
    <el-form-item prop="resource_opts.request_timeout">
      <template #label>
        <FormItemLabel :label="tl('requestTimeout')" :desc="tl('requestTimeoutDesc')" desc-marked />
      </template>
      <Oneof
        v-model="resourceOptForm.request_timeout"
        :items="[{ type: 'duration' }, { symbols: ['infinity'], type: 'enum' }]"
      />
    </el-form-item>
  </el-col>
  <el-col :span="12">
    <el-form-item prop="resource_opts.health_check_interval">
      <template #label>
        <FormItemLabel :label="tl('healthCheckInterval')" :desc="tl('healthCheckIntervalDesc')" />
      </template>
      <TimeInputWithUnitSelect v-model="resourceOptForm.health_check_interval" />
    </el-form-item>
  </el-col>
  <el-col :span="12">
    <el-form-item prop="resource_opts.auto_restart_interval">
      <template #label>
        <FormItemLabel
          :label="tl('autoRestartInterval')"
          :desc="tl('autoRestartIntervalDesc') + tl('autoRestartIntervalValueDesc')"
        />
      </template>
      <Oneof
        v-model="resourceOptForm.auto_restart_interval"
        :items="[{ type: 'duration' }, { symbols: ['infinity'], type: 'enum' }]"
      />
    </el-form-item>
  </el-col>
  <!-- QUEUE -->
  <el-col :span="12">
    <el-form-item prop="resource_opts.max_queue_bytes">
      <template #label>
        <FormItemLabel :label="tl('maxQueueBytes')" :desc="tl('maxQueueBytesDesc')" />
      </template>
      <InputWithUnit :units="['MB', 'GB', 'KB']" v-model="resourceOptForm.max_queue_bytes" />
    </el-form-item>
  </el-col>
  <!-- BATCH -->
  <template v-if="withBatchConfig">
    <el-col :span="12">
      <el-form-item prop="resource_opts.batch_size">
        <template #label>
          <FormItemLabel :label="tl('batchSize')" :desc="tl('batchSize')" />
        </template>
        <el-input v-model="resourceOptForm.batch_size" />
      </el-form-item>
    </el-col>
  </template>

  <!-- QUERY MODE -->
  <el-col :span="12">
    <el-form-item prop="resource_opts.query_mode">
      <template #label>
        <FormItemLabel :label="tl('queryMode')" :desc="tl('queryMode')" />
      </template>
      <el-select v-model="resourceOptForm.query_mode">
        <el-option v-for="item in ['sync', 'async']" :value="item" :key="item" />
      </el-select>
    </el-form-item>
  </el-col>
  <el-col :span="12" v-if="canConfigInflightWindow && resourceOptForm.query_mode === 'async'">
    <el-form-item prop="async_inflight_window">
      <template #label>
        <FormItemLabel :label="tl('asyncInflightWindow')" :desc="tl('asyncInflightWindowDesc')" />
      </template>
      <el-input v-model="resourceOptForm.async_inflight_window" />
    </el-form-item>
  </el-col>
</template>

<script setup lang="ts">
import FormItemLabel from '@/components/FormItemLabel.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import Oneof from '@/components/Oneof.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  withBatchConfig: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const { tl } = useI18nTl('RuleEngine')

const resourceOptForm = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const canConfigInflightWindow = computed(
  () => resourceOptForm.value.async_inflight_window !== undefined,
)
</script>
