<template>
  <el-dialog
    v-model="showDialog"
    :title="t('Base.createTarget', { target: 'Stream' })"
    destroy-on-close
    width="700px"
  >
    <StreamForm :lang="locale" v-model="record" :rules="rules" :tip-component="InfoTooltip" />
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="showDialog = false">{{ t('Base.cancel') }}</el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          @click="submit"
          :loading="isSubmitting"
        >
          {{ t('Base.create') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { createStream } from '@/api/streaming'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useFormRules from '@/hooks/useFormRules'
import { Stream, StreamType } from '@/types/typeAlias'
import { StreamForm } from '@emqx/shared-ui-components'
import { useLocale } from '@emqx/shared-ui-utils'
import { ElMessage } from 'element-plus'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'submitted'): void
}>()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})
watch(showDialog, (val) => {
  if (!val) {
    record.value = createRawStream()
  }
})

const { t, locale } = useI18n()
const { t: sharedT } = useLocale(locale.value)
const tl = (key: string) => sharedT(`streaming.${key}`)

const createRawStream = (): Stream => ({
  stream_name: '',
  mqtt_topic_filter: '',
  stream_type: StreamType.default,
  partition_number: -1,
})

const record = ref<Stream>(createRawStream())

const FormCom = ref()

const { createRequiredRule } = useFormRules()
const rules = {
  stream_name: [
    ...createRequiredRule(tl('streamName')),
    { pattern: /^[a-z\d][\w.-]{0,63}$/i, message: tl('streamNameFormatTip') },
  ],
  mqtt_topic_filter: [
    ...createRequiredRule(tl('mqttTopic')),
    { pattern: /^[\w./+%$:#@&{} -]{1,128}$/, message: tl('mqttTopicFormatTip') },
  ],
  stream_type: createRequiredRule(tl('streamType')),
  partition_number: createRequiredRule(tl('partitionNum')),
}

const isSubmitting = ref(false)
const submit = async () => {
  try {
    await FormCom.value.validate()
    isSubmitting.value = true
    await createStream(record.value)
    emit('submitted')
    showDialog.value = false
    ElMessage.success(t('Base.createSuccess'))
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss"></style>
