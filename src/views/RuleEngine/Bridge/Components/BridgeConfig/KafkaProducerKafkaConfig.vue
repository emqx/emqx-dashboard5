<template>
  <div class="kafka-producer-kafka-config">
    <el-row :gutter="26">
      <el-col :span="12">
        <el-form-item prop="producer.kafka.topic">
          <template #label>
            <span>{{ tl('kafkaProducerTopic') }}</span>
            <InfoTooltip :content="tl('kafkaProducerTopicDesc')" />
          </template>
          <el-input v-model="kafkaConfig.topic" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="producer.kafka.message.key">
          <template #label>
            <span>{{ tl('kafkaMessageKey') }}</span>
            <InfoTooltip>
              <template #content>
                <p v-safe-html="tl('kafkaMessageKeyDesc')"></p>
              </template>
            </InfoTooltip>
          </template>
          <div class="monaco-container">
            <Monaco :id="createRandomString()" v-model="kafkaConfig.message.key" lang="sql" />
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="producer.kafka.message.value">
          <template #label>
            <span>{{ tl('kafkaMessageValue') }}</span>
            <InfoTooltip>
              <template #content>
                <p v-safe-html="tl('kafkaMessageValueDesc')"></p>
              </template>
            </InfoTooltip>
          </template>
          <div class="monaco-container">
            <Monaco :id="createRandomString()" v-model="kafkaConfig.message.value" lang="sql" />
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="producer.kafka.message.timestamp">
          <template #label>
            <span>{{ tl('kafkaMessageTimestamp') }}</span>
            <InfoTooltip>
              <template #content>
                <p v-safe-html="tl('kafkaMessageTimestampDesc')"></p>
              </template>
            </InfoTooltip>
          </template>
          <el-input v-model="kafkaConfig.message.timestamp" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="producer.kafka.max_batch_bytes">
          <template #label>
            <span>{{ tl('maxBatchBytes') }}</span>
            <InfoTooltip :content="tl('maxBatchBytesDesc')" />
          </template>
          <InputWithUnit v-model="kafkaConfig.max_batch_bytes" :units="usefulMemoryUnit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="producer.kafka.compression" :label="tl('compression')">
          <el-select v-model="kafkaConfig.compression">
            <el-option
              v-for="item in ['no_compression', 'snappy', 'gzip']"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="producer.kafka.partition_strategy">
          <template #label>
            <span>{{ tl('partitionStrategy') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('partitionStrategyDesc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-select v-model="kafkaConfig.partition_strategy">
            <el-option
              v-for="item in ['random', 'key_dispatch']"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="producer.kafka.required_acks">
          <template #label>
            <span>{{ tl('requiredAcks') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('requiredAcksDesc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-select v-model="kafkaConfig.required_acks">
            <el-option
              v-for="item in ['all_isr', 'leader_only', 'none']"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="producer.kafka.partition_count_refresh_interval">
          <template #label>
            <span>{{ tl('partitionCountRefreshInterval') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('partitionCountRefreshIntervalDesc')" />
              </template>
            </InfoTooltip>
          </template>
          <TimeInputWithUnitSelect v-model="kafkaConfig.partition_count_refresh_interval" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="producer.kafka.max_inflight">
          <template #label>
            <span>{{ tl('maxInflight') }}</span>
            <InfoTooltip :content="tl('maxInflightDesc')" />
          </template>
          <el-input v-model="kafkaConfig.max_inflight" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="producer.kafka.buffer.mode">
          <template #label>
            <span>{{ tl('bufferMode') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('bufferModeDesc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-select v-model="kafkaConfig.buffer.mode">
            <el-option
              v-for="item in ['memory', 'disk', 'hybrid']"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="producer.kafka.buffer.per_partition_limit">
          <template #label>
            <span>{{ tl('perPartitionLimit') }}</span>
            <InfoTooltip :content="tl('perPartitionLimitDesc')" />
          </template>
          <InputWithUnit
            v-model="kafkaConfig.buffer.per_partition_limit"
            :units="usefulMemoryUnit"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="producer.kafka.buffer.segment_bytes">
          <template #label>
            <span>{{ tl('segmentBytes') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('segmentBytesDesc')" />
              </template>
            </InfoTooltip>
          </template>
          <InputWithUnit v-model="kafkaConfig.buffer.segment_bytes" :units="usefulMemoryUnit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="producer.kafka.buffer.memory_overload_protection">
          <template #label>
            <span>{{ tl('memoryOverloadProtection') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('memoryOverloadProtectionDesc')" />
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
import { createRandomString, usefulMemoryUnit } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineEmits, defineProps } from 'vue'
import Monaco from '@/components/Monaco.vue'

const props = defineProps({
  modelValue: {
    type: Object,
  },
})

const emit = defineEmits(['update:modelValue'])

const { tl } = useI18nTl('RuleEngine')

const kafkaConfig = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>

<style lang="scss"></style>
