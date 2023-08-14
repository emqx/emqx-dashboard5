<template>
  <div class="kafka-producer-kafka-config">
    <el-row :gutter="26">
      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.topic" :readonly="readonly">
          <template #label>
            <span>{{ tl('kafka_topic.label') }}</span>
            <InfoTooltip :content="tl('kafka_topic.desc')" />
          </template>
          <el-input v-model="kafkaConfig.topic" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan"></el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.kafka_headers" :readonly="readonly">
          <template #label>
            <span>{{ tl('kafka_headers.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('kafka_headers.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-input v-model="kafkaConfig.kafka_headers" placeholder="${pub_props}" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item prop="kafka.kafka_header_value_encode_mode">
          <template #label>
            <span>{{ tl('kafka_header_value_encode_mode.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('kafka_header_value_encode_mode.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-select v-model="kafkaConfig.kafka_header_value_encode_mode" v-if="!readonly">
            <el-option value="none" label="NONE" />
            <el-option value="json" label="JSON" />
          </el-select>
          <p class="value" v-else>{{ kafkaConfig.kafka_header_value_encode_mode.toUpperCase() }}</p>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="kafka.kafka_ext_headers">
          <template #label>
            <span>{{ tl('kafka_ext_headers.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('kafka_ext_headers.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <ObjectArrayEditor
            v-model="kafkaConfig.kafka_ext_headers"
            :properties="props.headersProperties"
            prop-key="kafka.kafka_ext_headers"
            :edit-mode="colSpan === 12 ? 'table' : 'list'"
            :readonly="readonly"
          />
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.message.key" :readonly="readonly">
          <template #label>
            <FormItemLabel
              :label="tl('kafka_message_key.label')"
              :desc="tl('kafka_message_key.desc')"
              desc-marked
            />
          </template>
          <el-input type="textarea" rows="4" v-model="kafkaConfig.message.key" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.message.value" :readonly="readonly">
          <template #label>
            <FormItemLabel
              :label="tl('kafka_message_value.label')"
              :desc="tl('kafka_message_value.desc')"
              desc-marked
            />
          </template>
          <el-input type="textarea" rows="4" v-model="kafkaConfig.message.value" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.message.timestamp" :readonly="readonly">
          <template #label>
            <span>{{ tl('kafka_message_timestamp.label') }}</span>
            <InfoTooltip>
              <template #content>
                <p v-safe-html="tl('kafka_message_timestamp.desc')"></p>
              </template>
            </InfoTooltip>
          </template>
          <el-input v-model="kafkaConfig.message.timestamp" />
        </CustomFormItem>
      </el-col>

      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.max_batch_bytes" :readonly="readonly">
          <template #label>
            <span>{{ tl('max_batch_bytes.label') }}</span>
            <InfoTooltip :content="tl('max_batch_bytes.desc')" />
          </template>
          <InputWithUnit v-model="kafkaConfig.max_batch_bytes" :units="usefulMemoryUnit" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item prop="kafka.compression" :label="tl('compression.label')">
          <el-select v-model="kafkaConfig.compression" v-if="!readonly">
            <el-option
              v-for="item in getPropItem('compression').symbols || []"
              :key="item"
              :value="item"
              :label="te(`RuleEngine.${item}`) ? $t(`RuleEngine.${item}`) : item"
            />
          </el-select>
          <p class="value" v-else>
            {{
              te(`RuleEngine.${kafkaConfig.compression}`)
                ? $t(`RuleEngine.${kafkaConfig.compression}`)
                : kafkaConfig.compression
            }}
          </p>
        </el-form-item>
      </el-col>

      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.partition_strategy" :readonly="readonly">
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
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.required_acks" :readonly="readonly">
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
        </CustomFormItem>
      </el-col>

      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.partition_count_refresh_interval" :readonly="readonly">
          <template #label>
            <span>{{ tl('partition_count_refresh_interval.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('partition_count_refresh_interval.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <TimeInputWithUnitSelect v-model="kafkaConfig.partition_count_refresh_interval" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.max_inflight" :readonly="readonly">
          <template #label>
            <span>{{ tl('max_inflight.label') }}</span>
            <InfoTooltip :content="tl('max_inflight.desc')" />
          </template>
          <el-input v-model="kafkaConfig.max_inflight" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item prop="kafka.query_mode">
          <template #label>
            <span>{{ tl('query_mode.label') }}</span>
            <InfoTooltip :content="tl('query_mode.desc')" />
          </template>
          <el-select v-model="kafkaConfig.query_mode" v-if="!readonly">
            <el-option
              v-for="item in getPropItem('query_mode').symbols || []"
              :key="item"
              :value="item"
              :label="t(`SchemaSymbolLabel.${item}`)"
            />
          </el-select>
          <p class="value" v-else>{{ t(`SchemaSymbolLabel.kafkaConfig.query_mode`) }}</p>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.sync_query_timeout" :readonly="readonly">
          <template #label>
            <span>{{ tl('sync_query_timeout.label') }}</span>
            <InfoTooltip :content="tl('sync_query_timeout.desc')" />
          </template>
          <TimeInputWithUnitSelect v-model="kafkaConfig.sync_query_timeout" />
        </CustomFormItem>
      </el-col>

      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.buffer.mode" :readonly="readonly">
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
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.buffer.per_partition_limit" :readonly="readonly">
          <template #label>
            <span>{{ tl('buffer_per_partition_limit.label') }}</span>
            <InfoTooltip :content="tl('buffer_per_partition_limit.desc')" />
          </template>
          <InputWithUnit
            v-model="kafkaConfig.buffer.per_partition_limit"
            :units="usefulMemoryUnit"
          />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.buffer.segment_bytes" :readonly="readonly">
          <template #label>
            <span>{{ tl('buffer_segment_bytes.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('buffer_segment_bytes.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <InputWithUnit v-model="kafkaConfig.buffer.segment_bytes" :units="usefulMemoryUnit" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item prop="kafka.buffer.memory_overload_protection">
          <template #label>
            <span>{{ tl('buffer_memory_overload_protection.label') }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="tl('buffer_memory_overload_protection.desc')" />
              </template>
            </InfoTooltip>
          </template>
          <el-switch v-model="kafkaConfig.buffer.memory_overload_protection" :disabled="readonly" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { usefulMemoryUnit } from '@/common/tools'
import CustomFormItem from '@/components/CustomFormItem.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import ObjectArrayEditor from '@/components/ObjectArrayEditor.vue'
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
  headersProperties: {
    type: Object,
    default: () => ({}),
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
const components = computed(() => props.schemaComponents)
const { getPropItem } = useGetInfoFromComponents(components)
const { t, tl, te } = useI18nTl('BridgeSchema.emqx_ee_bridge_kafka')

const kafkaConfig = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>
