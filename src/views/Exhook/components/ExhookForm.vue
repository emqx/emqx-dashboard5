<template>
  <el-form
    class="exhook-create-form"
    ref="formCom"
    label-position="top"
    :model="formData"
    :rules="rules"
    size="small"
  >
    <div class="form-sub-block">
      <p class="form-sub-block-title">{{ tl('basicInfo') }}</p>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item required prop="name" :label="tl('name')">
            <el-input v-model="formData.name" :disabled="isEdit" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <div class="form-sub-block">
      <p class="form-sub-block-title">{{ tl('connectionParameters') }}</p>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item required prop="url" label="URL">
            <el-input v-model="formData.url" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item required prop="pool_size" label="Pool Size">
            <el-input v-model.number="formData.pool_size" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item required prop="request_timeout" :label="tl('requestTimeOut')">
            <el-input v-model="formData.request_timeout" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item required prop="failed_action" :label="tl('failedAction')">
            <el-select v-model="formData.failed_action">
              <el-option :label="ExhookFailedAction.Deny" :value="ExhookFailedAction.Deny" />
              <el-option :label="ExhookFailedAction.Ignore" :value="ExhookFailedAction.Deny" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item required prop="auto_reconnect" :label="tl('autoReconnect')">
            <el-select v-model="formData.auto_reconnect">
              <el-option label="true" :value="true" />
              <el-option label="false" :value="false" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <CommonTLSConfig v-model="formData.ssl" />
  </el-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ExhookFailedAction } from '@/types/enum'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'

export default defineComponent({
  name: 'ExhookForm',
})
</script>

<script setup lang="ts">
import {
  ref,
  defineProps,
  defineEmits,
  defineExpose,
  computed,
  PropType,
  WritableComputedRef,
} from 'vue'
import { Exhook, ExhookFormForCreate } from '@/types/systemModule'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: Object as PropType<Exhook | ExhookFormForCreate>,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const formData: WritableComputedRef<Exhook | ExhookFormForCreate> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { t } = useI18n()
const tl = (key: string, moduleName = 'Exhook') => t(`${moduleName}.${key}`)

const formCom = ref()
// TODO:
const rules = []

const validate = async () => formCom.value.validate()

defineExpose({
  validate,
})
</script>
