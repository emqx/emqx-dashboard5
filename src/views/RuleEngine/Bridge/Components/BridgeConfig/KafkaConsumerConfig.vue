<template>
  <div class="kafka-producer-kafka-config">
    <el-row :gutter="26">
      <el-col :span="colSpan">
        <CustomFormItem prop="kafka.offset_reset_policy" :readonly="readonly">
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
        </CustomFormItem>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import CustomFormItem from '@/components/CustomFormItem.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
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
