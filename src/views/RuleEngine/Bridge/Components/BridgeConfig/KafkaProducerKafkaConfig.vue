<template>
  <div class="kafka-producer-kafka-config">
    <el-row :gutter="26">
      <el-col :span="12">
        <el-form-item prop="producer.kafka.topic">
          <template #label>
            <span>{{ getPropItem('topic').label }}</span>
            <InfoTooltip :content="getPropItem('topic').description" />
          </template>
          <el-input v-model="kafkaConfig.topic" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="producer.kafka.message.key">
          <template #label>
            <span>{{ getPropItem('message.key').label }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getPropItem('message.key').description" />
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
            <span>{{ getPropItem('message.value').label }}</span>
            <InfoTooltip>
              <template #content>
                <p v-safe-html="getPropItem('message.value').description"></p>
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
            <span>{{ getPropItem('message.timestamp').label }}</span>
            <InfoTooltip>
              <template #content>
                <p v-safe-html="getPropItem('message.timestamp').description"></p>
              </template>
            </InfoTooltip>
          </template>
          <el-input v-model="kafkaConfig.message.timestamp" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="producer.kafka.max_batch_bytes">
          <template #label>
            <span>{{ getPropItem('max_batch_bytes').label }}</span>
            <InfoTooltip :content="getPropItem('max_batch_bytes').description" />
          </template>
          <InputWithUnit v-model="kafkaConfig.max_batch_bytes" :units="usefulMemoryUnit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="producer.kafka.compression" :label="getPropItem('compression').label">
          <el-select v-model="kafkaConfig.compression">
            <el-option
              v-for="item in getPropItem('compression').symbols || []"
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
            <span>{{ getPropItem('partition_strategy').label }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getPropItem('partition_strategy').description" />
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
        <el-form-item prop="producer.kafka.required_acks">
          <template #label>
            <span>{{ getPropItem('required_acks').label }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getPropItem('required_acks').description" />
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
        <el-form-item prop="producer.kafka.partition_count_refresh_interval">
          <template #label>
            <span>{{ getPropItem('partition_count_refresh_interval').label }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent
                  :content="getPropItem('partition_count_refresh_interval').description"
                />
              </template>
            </InfoTooltip>
          </template>
          <TimeInputWithUnitSelect v-model="kafkaConfig.partition_count_refresh_interval" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="producer.kafka.max_inflight">
          <template #label>
            <span>{{ getPropItem('max_inflight').label }}</span>
            <InfoTooltip :content="getPropItem('max_inflight').description" />
          </template>
          <el-input v-model="kafkaConfig.max_inflight" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="producer.kafka.buffer.mode">
          <template #label>
            <span>{{ getPropItem('buffer.mode').label }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getPropItem('buffer.mode').description" />
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
        <el-form-item prop="producer.kafka.buffer.per_partition_limit">
          <template #label>
            <span>{{ getPropItem('buffer.per_partition_limit').label }}</span>
            <InfoTooltip :content="getPropItem('buffer.per_partition_limit').description" />
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
            <span>{{ getPropItem('buffer.segment_bytes').label }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="getPropItem('buffer.segment_bytes').description" />
              </template>
            </InfoTooltip>
          </template>
          <InputWithUnit v-model="kafkaConfig.buffer.segment_bytes" :units="usefulMemoryUnit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="producer.kafka.buffer.memory_overload_protection">
          <template #label>
            <span>{{ getPropItem('buffer.memory_overload_protection').label }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent
                  :content="getPropItem('buffer.memory_overload_protection').description"
                />
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
import Monaco from '@/components/Monaco.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useSchemaForm from '@/hooks/Config/useSchemaForm'
import useGetInfoFromComponents from '@/hooks/Rule/bridge/useGetInfoFromComponents'
import { computed, defineEmits, defineProps } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  modelValue: {
    type: Object,
  },
})

const emit = defineEmits(['update:modelValue'])

const { state } = useStore()

const { components } = useSchemaForm(`static/bridge-api-${state.lang}.json`, {
  ref: '#/components/schemas/bridge_kafka.producer_kafka_opts',
})
const { getPropItem } = useGetInfoFromComponents(components)

const kafkaConfig = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>
