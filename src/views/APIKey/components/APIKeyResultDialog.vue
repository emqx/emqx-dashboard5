<template>
  <el-dialog
    v-model="showDialog"
    :width="600"
    custom-class="API-key-result-dialog"
    :title="$t('Base.createSuccess')"
    :z-index="2000"
  >
    <p class="result-tip">{{ $t('APIKey.resultTip') }}</p>
    <el-form ref="formCom" label-position="top">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="API Key">
            <el-row :gutter="12">
              <el-col :span="21">
                <el-input v-model="APIKeyData.api_key" disabled />
              </el-col>
              <el-col :span="3">
                <el-button @click="copyText(APIKeyData.api_key)">{{ $t('Base.copy') }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Secret Key">
            <el-row :gutter="12">
              <el-col :span="21">
                <el-input v-model="APIKeyData.api_secret" disabled />
              </el-col>
              <el-col :span="3">
                <el-button @click="copyText(APIKeyData.api_secret)">
                  {{ $t('Base.copy') }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">{{ $t('APIKey.close') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits, ref, Ref, watch, PropType } from 'vue'
import { ElDialog } from 'element-plus'
import { APIKey } from '@/types/systemModule'
import useCopy from '@/hooks/useCopy'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object as PropType<APIKey>,
  },
})

const emit = defineEmits(['update:modelValue'])
const APIKeyData: Ref<APIKey> = ref({} as APIKey)

const { copyText } = useCopy()
const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, async (val) => {
  if (val && props.data) {
    APIKeyData.value = props.data
  }
})
</script>

<style lang="scss">
.API-key-result-dialog {
  .result-tip {
    margin-top: 0;
    margin-bottom: 20px;
  }
  .el-col {
    .el-button {
      width: 100%;
    }
  }
  .el-input.is-disabled .el-input__inner,
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: var(--color-bg-primary);
    border-color: var(--color-border-primary);
    color: var(--color-text-primary);
  }
}
</style>
