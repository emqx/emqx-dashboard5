<template>
  <div class="kafka-producer-kafka-config">
    <el-row :gutter="26">
      <el-col :span="12">
        <el-form-item prop="kafka.max_batch_bytes">
          <template #label>
            <span>{{ getText('max_batch_bytes.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getText('max_batch_bytes.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <InputWithUnit v-model="kafkaConfig.max_batch_bytes" :units="usefulMemoryUnit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="kafka.offset_reset_policy">
          <template #label>
            <span>{{ getText('offset_reset_policy.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getText('offset_reset_policy.desc')" />
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
            <span>{{ getText('offset_commit_interval_seconds.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getText('offset_commit_interval_seconds.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <TimeInputWithUnitSelect
            v-model="kafkaConfig.offset_commit_interval_seconds"
            :enabled-units="['s']"
          />
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
import useI18nTl from '@/hooks/useI18nTl'
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
const { tl } = useI18nTl('BridgeSchema.emqx_ee_bridge_kafka')
const getText = (key: string) => tl(`consumer_${key}`)

const kafkaConfig = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>
