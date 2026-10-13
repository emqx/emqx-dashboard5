<template>
  <el-dialog
    :model-value="true"
    :title="t('Auth.generatedPassword')"
    width="600px"
    class="generated-password-dialog"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @update:model-value="emit('close')"
  >
    <TipContainer :content="t('Auth.generatedPasswordNotice')" />
    <el-form class="mt-4" label-position="top">
      <el-form-item :label="t('Auth.userId')">
        <el-row class="credential-row" :gutter="12">
          <el-col :span="21">
            <el-input :model-value="userId" readonly />
          </el-col>
          <el-col :span="3">
            <el-button @click="copyText(userId)">{{ t('Base.copy') }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="t('General.password')">
        <el-row class="credential-row" :gutter="12">
          <el-col :span="21">
            <el-input
              :model-value="password"
              readonly
              type="password"
              show-password
              autocomplete="off"
            />
          </el-col>
          <el-col :span="3">
            <el-button @click="copyText(password)">{{ t('Base.copy') }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="emit('close')">{{ t('APIKey.close') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
defineProps<{ userId: string; password: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()
const { t } = useI18n()
const { copyText } = useCopy()
</script>

<style lang="scss" scoped>
.credential-row {
  width: 100%;

  .el-button {
    width: 100%;
  }
}
</style>
