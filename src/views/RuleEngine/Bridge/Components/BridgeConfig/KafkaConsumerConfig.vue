<template>
  <div class="kafka-producer-kafka-config">
    <el-row :gutter="26">
      <el-col :span="12">
        <el-form-item prop="kafka.max_batch_bytes">
          <template #label>
            <span>{{ getPropItem('max_batch_bytes').label }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getPropItem('max_batch_bytes').description" />
              </template>
            </InfoTooltip>
          </template>
          <InputWithUnit v-model="kafkaConfig.max_batch_bytes" :units="usefulMemoryUnit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="kafka.offset_reset_policy">
          <template #label>
            <span>{{ getPropItem('offset_reset_policy').label }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getPropItem('offset_reset_policy').description" />
              </template>
            </InfoTooltip>
          </template>
          <el-select v-model="kafkaConfig.offset_reset_policy">
            <el-option
              v-for="item in getPropItem('offset_reset_policy').symbols || []"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="kafka.offset_commit_interval_seconds">
          <template #label>
            <span>{{ getPropItem('offset_commit_interval_seconds').label }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent
                  :content="getPropItem('offset_commit_interval_seconds').description"
                />
              </template>
            </InfoTooltip>
          </template>
          <TimeInputWithUnitSelect :enabled-units="['s']" v-model="secondProxy" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { usefulMemoryUnit } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useGetInfoFromComponents from '@/hooks/Rule/bridge/useGetInfoFromComponents'
import { computed, defineEmits, defineProps, PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<any>,
  },
  schemaComponents: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const components = computed(() => props.schemaComponents)
const { getPropItem } = useGetInfoFromComponents(components)

const kafkaConfig = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const secondProxy = computed({
  get() {
    if (!props.modelValue.offset_commit_interval_seconds) {
      return undefined
    }
    return props.modelValue.offset_commit_interval_seconds + 's'
  },
  set(val) {
    if (val && !Number.isNaN(parseFloat(val))) {
      kafkaConfig.value.offset_commit_interval_seconds = parseFloat(val)
    } else {
      kafkaConfig.value.offset_commit_interval_seconds = undefined
    }
  },
})
</script>
