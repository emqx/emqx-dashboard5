<template>
  <el-col :span="21" class="custom-col">
    <el-form-item>
      <template #label>
        <FormItemLabel v-bind="bytesFormItemLabelProps" desc-marked />
      </template>
      <Oneof
        v-model="record.max_shard_message_bytes"
        :items="[{ type: 'byteSize' }, { symbols: [INFINITY_VALUE], type: 'enum' }]"
      />
    </el-form-item>
  </el-col>
  <el-col :span="21" class="custom-col">
    <el-form-item>
      <template #label>
        <FormItemLabel v-bind="countFormItemLabelProps" desc-marked />
      </template>
      <Oneof
        v-model="record.max_shard_message_count"
        :items="[{ type: 'number' }, { symbols: [INFINITY_VALUE], type: 'enum' }]"
      />
    </el-form-item>
  </el-col>
</template>

<script setup lang="ts">
import { MessageStreamLimits } from '@/types/typeAlias'

const props = defineProps<{
  modelValue: MessageStreamLimits
  conf: 'queue' | 'stream'
}>()
const isQueue = computed(() => props.conf === 'queue')

const emit = defineEmits<{
  (e: 'update:modelValue', value: MessageStreamLimits): void
}>()

const { t, tl } = useI18nTl('BasicConfig')

const record = computed({
  get() {
    return props.modelValue
  },
  set(value: MessageStreamLimits) {
    emit('update:modelValue', value)
  },
})

const bytesFormItemLabelProps = computed(() => {
  return isQueue.value
    ? { label: tl('queueMaxShardMessageBytes'), desc: tl('queueMaxShardMessageBytesDesc') }
    : {
        label: t('MessageStream.maxShardMessageBytes'),
        desc: t('MessageStream.maxShardMessageBytesDesc'),
      }
})

const countFormItemLabelProps = computed(() => {
  return isQueue.value
    ? { label: tl('queueMaxShardMessageCount'), desc: tl('queueMaxShardMessageCountDesc') }
    : {
        label: t('MessageStream.maxShardMessageCount'),
        desc: t('MessageStream.maxShardMessageCountDesc'),
      }
})
</script>

<style lang="scss"></style>
