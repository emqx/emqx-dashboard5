<template>
  <el-dialog
    v-model="showDialog"
    align-center
    destroy-on-close
    width="600px"
    :title="tl('restore')"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <p class="restore-confirm-message">{{ confirmMessage }}</p>
    <el-checkbox v-model="allowSecurityProfileMismatch">
      {{ tl('allowSecurityProfileMismatch') }}
    </el-checkbox>
    <TipContainer
      v-if="allowSecurityProfileMismatch"
      class="security-profile-mismatch-warning"
      :content="tl('securityProfileMismatchWarning')"
    />
    <template #footer>
      <div class="dialog-align-footer">
        <CancelButton @click="cancel" />
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          :loading="loading"
          @click="confirm"
        >
          {{ t('Base.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  namespace?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'confirm', allowSecurityProfileMismatch: boolean): void
  (e: 'cancel'): void
}>()

const { t, tl } = useI18nTl('General')

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const allowSecurityProfileMismatch = ref(false)
const confirmMessage = computed(() =>
  props.namespace
    ? tl('confirmNamespaceRestore', { namespace: props.namespace })
    : tl('confirmRestore'),
)

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      allowSecurityProfileMismatch.value = false
    }
  },
)

const cancel = () => {
  showDialog.value = false
  emit('cancel')
}

const confirm = () => {
  emit('confirm', allowSecurityProfileMismatch.value)
}
</script>

<style lang="scss" scoped>
.restore-confirm-message {
  margin: 0 0 16px;
}

.security-profile-mismatch-warning {
  margin-top: 12px;
}
</style>
