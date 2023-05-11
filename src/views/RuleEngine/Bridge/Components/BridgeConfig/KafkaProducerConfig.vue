<template>
  <div class="kafka-producer-kafka-config">
    <el-row :gutter="26">
      <el-col :span="12">
        <el-form-item prop="kafka.topic">
          <template #label>
            <span>{{ tl('kafka_topic.label') }}</span>
            <InfoTooltip :content="tl('kafka_topic.desc')" />
          </template>
          <el-input v-model="kafkaConfig.topic" />
        </el-form-item>
      </el-col>
      <el-col :span="12" />
      <el-col :span="12">
        <el-form-item prop="kafka.message.key">
          <template #label>
            <span>{{ tl('kafka_message_key.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('kafka_message_key.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-input type="textarea" rows="4" v-model="kafkaConfig.message.key" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="kafka.message.value">
          <template #label>
            <span>{{ tl('kafka_message_value.label') }}</span>
            <InfoTooltip>
              <template #content>
                <p v-safe-html="tl('kafka_message_value.desc')"></p>
              </template>
            </InfoTooltip>
          </template>
          <el-input type="textarea" rows="4" v-model="kafkaConfig.message.value" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="kafka.message.timestamp">
          <template #label>
            <span>{{ tl('kafka_message_timestamp.label') }}</span>
            <InfoTooltip>
              <template #content>
                <p v-safe-html="tl('kafka_message_timestamp.desc')"></p>
              </template>
            </InfoTooltip>
          </template>
          <el-input v-model="kafkaConfig.message.timestamp" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="kafka.max_batch_bytes">
          <template #label>
            <span>{{ tl('max_batch_bytes.label') }}</span>
            <InfoTooltip :content="tl('max_batch_bytes.desc')" />
          </template>
          <InputWithUnit v-model="kafkaConfig.max_batch_bytes" :units="usefulMemoryUnit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="kafka.compression" :label="tl('compression.label')">
          <el-select v-model="kafkaConfig.compression">
            <el-option
              v-for="item in getPropItem('compression').symbols || []"
              :key="item"
              :value="item"
              :label="te(`RuleEngine.${item}`) ? $t(`RuleEngine.${item}`) : item"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="kafka.partition_strategy">
          <template #label>
            <span>{{ tl('partition_strategy.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('partition_strategy.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-select v-model="kafkaConfig.partition_strategy">
            <el-option
              v-for="item in getPropItem('partition_strategy').symbols || []"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="kafka.required_acks">
          <template #label>
            <span>{{ tl('required_acks.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('required_acks.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-select v-model="kafkaConfig.required_acks">
            <el-option
              v-for="item in getPropItem('required_acks').symbols || []"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="kafka.partition_count_refresh_interval">
          <template #label>
            <span>{{ tl('partition_count_refresh_interval.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('partition_count_refresh_interval.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <TimeInputWithUnitSelect v-model="kafkaConfig.partition_count_refresh_interval" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="kafka.max_inflight">
          <template #label>
            <span>{{ tl('max_inflight.label') }}</span>
            <InfoTooltip :content="tl('max_inflight.desc')" />
          </template>
          <el-input v-model="kafkaConfig.max_inflight" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="kafka.buffer.mode">
          <template #label>
            <span>{{ tl('buffer_mode.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('buffer_mode.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-select v-model="kafkaConfig.buffer.mode">
            <el-option
              v-for="item in getPropItem('buffer.mode').symbols || []"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="kafka.buffer.per_partition_limit">
          <template #label>
            <span>{{ tl('buffer_per_partition_limit.label') }}</span>
            <InfoTooltip :content="tl('buffer_per_partition_limit.desc')" />
          </template>
          <InputWithUnit
            v-model="kafkaConfig.buffer.per_partition_limit"
            :units="usefulMemoryUnit"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="kafka.buffer.segment_bytes">
          <template #label>
            <span>{{ tl('buffer_segment_bytes.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('buffer_segment_bytes.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <InputWithUnit v-model="kafkaConfig.buffer.segment_bytes" :units="usefulMemoryUnit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="kafka.buffer.memory_overload_protection">
          <template #label>
            <span>{{ tl('buffer_memory_overload_protection.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('buffer_memory_overload_protection.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-switch v-model="kafkaConfig.buffer.memory_overload_protection" />
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
const { tl, te } = useI18nTl('BridgeSchema.emqx_ee_bridge_kafka')

const kafkaConfig = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>
