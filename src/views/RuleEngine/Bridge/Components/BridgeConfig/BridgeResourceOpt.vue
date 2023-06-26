<template>
  <el-col :span="colSpan">
    <el-form-item prop="resource_opts.worker_pool_size">
      <template #label>
        <FormItemLabel :label="tl('worker_pool_size.label')" :desc="tl('worker_pool_size.desc')" />
      </template>
      <el-input v-model="resourceOptForm.worker_pool_size" />
    </el-form-item>
  </el-col>
  <el-col :span="colSpan" v-if="withRequestTimeoutConfig">
    <el-form-item prop="resource_opts.request_ttl">
      <template #label>
        <FormItemLabel
          :label="tl('request_ttl.label')"
          :desc="tl('request_ttl.desc')"
          desc-marked
        />
      </template>
      <Oneof
        v-model="resourceOptForm.request_ttl"
        :items="[{ type: 'duration' }, { symbols: ['infinity'], type: 'enum' }]"
      />
    </el-form-item>
  </el-col>
  <el-col :span="colSpan">
    <el-form-item prop="resource_opts.health_check_interval">
      <template #label>
        <FormItemLabel
          :label="tl('health_check_interval.label')"
          :desc="tl('health_check_interval.desc')"
        />
      </template>
      <TimeInputWithUnitSelect v-model="resourceOptForm.health_check_interval" />
    </el-form-item>
  </el-col>
  <!-- QUEUE -->
  <el-col :span="colSpan">
    <el-form-item prop="resource_opts.max_buffer_bytes">
      <template #label>
        <FormItemLabel :label="tl('max_buffer_bytes.label')" :desc="tl('max_buffer_bytes.desc')" />
      </template>
      <InputWithUnit :units="['MB', 'GB', 'KB']" v-model="resourceOptForm.max_buffer_bytes" />
    </el-form-item>
  </el-col>
  <!-- BATCH -->
  <template v-if="withBatchConfig">
    <el-col :span="colSpan">
      <el-form-item prop="resource_opts.batch_size">
        <template #label>
          <FormItemLabel :label="tl('batch_size.label')" :desc="tl('batch_size.desc')" />
        </template>
        <el-input v-model="resourceOptForm.batch_size" />
      </el-form-item>
    </el-col>
  </template>

  <!-- QUERY MODE -->
  <el-col :span="colSpan">
    <el-form-item prop="resource_opts.query_mode">
      <template #label>
        <FormItemLabel :label="tl('query_mode.label')" :desc="tl('query_mode.desc')" />
      </template>
      <el-select v-model="resourceOptForm.query_mode">
        <el-option
          v-for="item in ['sync', 'async']"
          :value="item"
          :key="item"
          :label="$t(`RuleEngine.${item}`)"
        />
      </el-select>
    </el-form-item>
  </el-col>
  <el-col :span="colSpan" v-if="canConfigInflightWindow && resourceOptForm.query_mode === 'async'">
    <el-form-item prop="inflight_window">
      <template #label>
        <FormItemLabel :label="tl('inflight_window.label')" :desc="tl('inflight_window.desc')" />
      </template>
      <el-input v-model="resourceOptForm.inflight_window" />
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
  withRequestTimeoutConfig: {
    type: Boolean,
    default: true,
  },
  colSpan: {
    type: Number,
    default: 12,
  },
})

const emit = defineEmits(['update:modelValue'])

const { tl } = useI18nTl('BridgeSchema.emqx_resource_schema')

const resourceOptForm = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const canConfigInflightWindow = computed(() => resourceOptForm.value.inflight_window !== undefined)
</script>
