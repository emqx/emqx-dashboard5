<template>
  <el-dialog
    v-model="showDialog"
    :title="t('Base.createTarget', { target: 'Stream' })"
    destroy-on-close
    width="700px"
  >
    <StreamForm :lang="state.lang" v-model="record" :tip-component="InfoTooltip" />
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
import useI18nTl from '@/hooks/useI18nTl'
import { Stream } from '@/types/typeAlias'
import { StreamForm } from '@emqx/shared-ui-components'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useStore } from 'vuex'

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
    record.value = createRawStream()
  }
})

const { t, tl } = useI18nTl('streaming')
const { state } = useStore()

const createRawStream = (): Stream => ({} as Stream)

const record = ref<Stream>(createRawStream())

const FormCom = ref()

const isSubmitting = ref(false)
const submit = async () => {
  try {
    await FormCom.value.validate()
    isSubmitting.value = true
    await createStream(record.value)
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss"></style>
