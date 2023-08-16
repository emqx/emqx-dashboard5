<template>
  <el-dialog
    v-model="showDialog"
    width="440px"
    class="common-dialog copy-bridge-name-dialog"
    :close-on-click-modal="false"
    :show-close="false"
    destroy-on-close
    @keyup.enter.prevent="submit()"
    @submit.prevent
  >
    <div class="dialog-bd">
      <el-icon class="icon-warning" :size="22"><Warning /></el-icon>
      <el-form
        ref="FormCom"
        label-position="right"
        :rules="rules"
        :model="record"
        @keyup.enter.prevent="submit"
      >
        <p class="desc">{{ tl('nameInputDesc') }}</p>
        <el-form-item prop="name">
          <el-input v-model="record.name" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" @click="submit">
          {{ t('Base.save') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { Warning } from '@element-plus/icons-vue'
import { computed, defineEmits, defineProps, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const { t, tl } = useI18nTl('Flow')

const FormCom = ref()

const record = ref({ name: '', desc: '' })

const { createRequiredRule, createCommonIdRule } = useFormRules()
const rules = { name: [...createRequiredRule(t('Base.name')), ...createCommonIdRule()] }

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const submit = async () => {
  try {
    await FormCom.value.validate()
    emit('save', record.value.name)
    showDialog.value = false
  } catch (error) {
    //
  }
}
</script>

<style lang="scss">
.copy-bridge-name-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 24px;
  }
  .el-dialog__footer {
    padding-top: 0;
    padding-bottom: 24px;
  }
  .dialog-bd {
    display: flex;
    align-items: flex-start;
  }
  .icon-warning {
    margin-right: 16px;
    color: #ffc53d;
  }
  .desc {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
  }
  .el-form {
    flex-grow: 1;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
