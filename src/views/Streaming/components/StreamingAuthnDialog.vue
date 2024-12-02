<template>
  <el-dialog v-model="showDialog" :title="`TODO:`" destroy-on-close width="700px">
    <StreamingAuthForm :lang="state.lang" v-model="record" />
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="showDialog = false">{{ t('Base.cancel') }}</el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          @click="submit"
          :loading="isSubmitting"
        >
          {{ isEdit ? t('Base.update') : t('Base.add') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { createStreamingAuthn } from '@/api/streaming'
import useI18nTl from '@/hooks/useI18nTl'
import { StreamingAuthn } from '@/types/typeAlias'
import { StreamingAuthForm } from '@emqx/shared-ui-components'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps<{
  modelValue: boolean
  data?: StreamingAuthn
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const { state } = useStore()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})
watch(showDialog, (val) => {
  if (!val) {
    record.value = createRawAuthn()
  }
})

const isEdit = computed(() => !!props.data)

const { t, tl } = useI18nTl('streaming')

const createRawAuthn = (): StreamingAuthn => ({} as StreamingAuthn)

const record = ref<StreamingAuthn>(createRawAuthn())

const FormCom = ref()

const isSubmitting = ref(false)
const submit = async () => {
  try {
    await FormCom.value.validate()
    isSubmitting.value = true
    await createStreamingAuthn(record.value)
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss"></style>
