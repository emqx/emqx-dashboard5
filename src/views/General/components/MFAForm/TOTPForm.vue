<template>
  <el-form class="totp-form" :model="formData" :label-width="190">
    <el-form-item :label="tl('enableMfaMethod', { method: 'TOTP' })">
      <el-switch v-model="formData.enable" />
    </el-form-item>
    <el-form-item :label="tl('interval')">
      <CustomInputNumber v-model="formData.interval_length" />
    </el-form-item>
    <el-form-item :label="tl('tokenLength')">
      <CustomInputNumber v-model="formData.token_length" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MfaTotpConfig } from '@/types/typeAlias'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import useI18nTl from '@/hooks/useI18nTl'

const props = defineProps<{
  modelValue: MfaTotpConfig
}>()
const emit = defineEmits(['update:modelValue'])

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { tl } = useI18nTl('General')
</script>
