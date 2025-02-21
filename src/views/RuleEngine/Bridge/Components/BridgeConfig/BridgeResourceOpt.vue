<template>
  <el-col :span="colSpan" v-if="withStartTimeoutConfig">
    <CustomFormItem prop="resource_opts.start_timeout" :readonly="readonly">
      <template #label>
        <FormItemLabel :label="tl('start_timeout.label')" :desc="tl('start_timeout.desc')" />
      </template>
      <TimeInputWithUnitSelect v-model="resourceOptForm.start_timeout" />
    </CustomFormItem>
  </el-col>
  <el-col :span="colSpan">
    <CustomFormItem prop="resource_opts.worker_pool_size" :readonly="readonly">
      <template #label>
        <FormItemLabel :label="tl('worker_pool_size.label')" :desc="tl('worker_pool_size.desc')" />
      </template>
      <el-input v-model="resourceOptForm.worker_pool_size" />
    </CustomFormItem>
  </el-col>
  <el-col :span="colSpan" v-if="withRequestTimeoutConfig">
    <CustomFormItem prop="resource_opts.request_ttl" :readonly="readonly">
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
    </CustomFormItem>
  </el-col>
  <el-col :span="colSpan">
    <CustomFormItem prop="resource_opts.health_check_interval" :readonly="readonly">
      <template #label>
        <FormItemLabel
          :label="tl('health_check_interval.label')"
          :desc="tl('health_check_interval.desc')"
        />
      </template>
      <TimeInputWithUnitSelect v-model="resourceOptForm.health_check_interval" />
    </CustomFormItem>
  </el-col>
  <!-- QUEUE -->
  <el-col :span="colSpan">
    <CustomFormItem prop="resource_opts.max_buffer_bytes" :readonly="readonly">
      <template #label>
        <FormItemLabel :label="tl('max_buffer_bytes.label')" :desc="tl('max_buffer_bytes.desc')" />
      </template>
      <InputWithUnit :units="['MB', 'GB', 'KB']" v-model="resourceOptForm.max_buffer_bytes" />
    </CustomFormItem>
  </el-col>
  <!-- BATCH -->
  <template v-if="withBatchConfig">
    <el-col :span="colSpan">
      <CustomFormItem prop="resource_opts.batch_size" :readonly="readonly">
        <template #label>
          <FormItemLabel :label="tl('batch_size.label')" :desc="tl('batch_size.desc')" />
        </template>
        <el-input v-model="resourceOptForm.batch_size" />
      </CustomFormItem>
    </el-col>
  </template>

  <!-- QUERY MODE -->
  <el-col :span="colSpan">
    <el-form-item prop="resource_opts.query_mode">
      <template #label>
        <FormItemLabel :label="tl('query_mode.label')" :desc="tl('query_mode.desc')" />
      </template>
      <el-select v-model="resourceOptForm.query_mode" v-if="!readonly">
        <el-option
          v-for="item in ['sync', 'async']"
          :value="item"
          :key="item"
          :label="$t(`RuleEngine.${item}`)"
        />
      </el-select>
      <p class="value" v-else>{{ $t(`RuleEngine.${resourceOptForm.query_mode}`) }}</p>
    </el-form-item>
  </el-col>
  <el-col :span="colSpan" v-if="canConfigInflightWindow && resourceOptForm.query_mode === 'async'">
    <CustomFormItem prop="inflight_window" :readonly="readonly">
      <template #label>
        <FormItemLabel :label="tl('inflight_window.label')" :desc="tl('inflight_window.desc')" />
      </template>
      <el-input v-model="resourceOptForm.inflight_window" />
    </CustomFormItem>
  </el-col>
</template>

<script setup lang="ts">
import CustomFormItem from '@/components/CustomFormItem.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import Oneof from '@/components/Oneof.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  withStartTimeoutConfig: {
    type: Boolean,
    default: true,
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
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const { tl } = useI18nTl('BridgeSchema.common')

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
