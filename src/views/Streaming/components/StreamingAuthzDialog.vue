<template>
  <el-dialog v-model="showDialog" :title="`TODO:`" destroy-on-close width="700px">
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
import { createStreamingAuthz } from '@/api/streaming'
import useI18nTl from '@/hooks/useI18nTl'
import { StreamingAuthz } from '@/types/typeAlias'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})
watch(showDialog, (val) => {
  if (!val) {
    record.value = createRawAuthz()
  }
})

const { t, tl } = useI18nTl('streaming')

const createRawAuthz = (): StreamingAuthz => ({} as StreamingAuthz)

const record = ref<StreamingAuthz>(createRawAuthz())

const FormCom = ref()

const isSubmitting = ref(false)
const submit = async () => {
  try {
    await FormCom.value.validate()
    isSubmitting.value = true
    await createStreamingAuthz(record.value)
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss"></style>
