<template>
  <el-col :span="12">
    <el-form-item prop="resource_opts.worker_pool_size">
      <template #label>
        <span>{{ tl('workerPoolSize') }}</span>
        <InfoTooltip :content="tl('workerPoolSizeDesc')" />
      </template>
      <el-input v-model="resourceOptForm.worker_pool_size" />
    </el-form-item>
  </el-col>
  <el-col :span="12">
    <el-form-item prop="resource_opts.health_check_interval">
      <template #label>
        <span>{{ tl('healthCheckInterval') }}</span>
        <InfoTooltip :content="tl('healthCheckIntervalDesc')" />
      </template>
      <TimeInputWithUnitSelect v-model="resourceOptForm.health_check_interval" />
    </el-form-item>
  </el-col>
  <el-col :span="12" :class="{ 'col-need-row': canConfigInflightWindow }">
    <el-form-item prop="resource_opts.auto_restart_interval">
      <template #label>
        <span>{{ tl('autoRestartInterval') }}</span>
        <InfoTooltip :content="tl('autoRestartIntervalDesc')" />
      </template>
      <Oneof
        v-model="resourceOptForm.auto_restart_interval"
        :items="[{ type: 'duration' }, { symbols: ['infinity'], type: 'enum' }]"
      />
    </el-form-item>
  </el-col>

  <!-- QUERY MODE -->
  <el-col :span="12">
    <el-form-item prop="resource_opts.query_mode">
      <template #label>
        <span>{{ tl('queryMode') }}</span>
        <InfoTooltip :content="tl('queryModeDesc')" />
      </template>
      <el-select v-model="resourceOptForm.query_mode">
        <el-option v-for="item in ['sync', 'async']" :value="item" :key="item" />
      </el-select>
    </el-form-item>
  </el-col>
  <el-col :span="12" v-if="canConfigInflightWindow && resourceOptForm.query_mode === 'async'">
    <el-form-item prop="async_inflight_window">
      <template #label>
        <span>{{ tl('asyncInflightWindow') }}</span>
        <InfoTooltip>
          <template #content>
            <p v-html="tl('asyncInflightWindowDesc')"></p>
          </template>
        </InfoTooltip>
      </template>
      <el-input v-model="resourceOptForm.async_inflight_window" />
    </el-form-item>
  </el-col>

  <!-- QUEUE -->
  <el-col :span="12" class="col-need-row">
    <el-form-item prop="resource_opts.max_queue_bytes">
      <template #label>
        <span>{{ tl('maxQueueBytes') }}</span>
        <InfoTooltip :content="tl('maxQueueBytesDesc')" />
      </template>
      <InputWithUnit :units="['MB', 'GB', 'KB']" v-model="resourceOptForm.max_queue_bytes" />
    </el-form-item>
  </el-col>
</template>

<script setup lang="ts">
import InfoTooltip from '@/components/InfoTooltip.vue'
import Oneof from '@/components/Oneof.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
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
