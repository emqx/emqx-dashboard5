<template>
  <el-col :span="21" class="custom-col">
    <el-form-item>
      <template #label>
        <FormItemLabel
          :label="tl('maxShardMessageBytes')"
          :desc="tl('maxShardMessageBytesDesc', { target: confLabel })"
          desc-marked
        />
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
        <FormItemLabel
          :label="tl('maxShardMessageCount')"
          :desc="tl('maxShardMessageCountDesc', { target: confLabel })"
          desc-marked
        />
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

const confLabel = computed(() => {
  return props.conf === 'queue'
    ? t("components['message-queue']")
    : t("components['message-stream']")
})
</script>

<style lang="scss"></style>
