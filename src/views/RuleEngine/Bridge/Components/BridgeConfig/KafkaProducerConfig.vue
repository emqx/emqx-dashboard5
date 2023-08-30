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
    </el-row>
  </div>
</template>

<script setup lang="ts">
import CustomFormItem from '@/components/CustomFormItem.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import ObjectArrayEditor from '@/components/ObjectArrayEditor.vue'
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
