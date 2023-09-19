<template>
  <div class="sso-detail">
    <el-form
      class="exhook-create-form"
      ref="formCom"
      label-position="top"
      require-asterisk-position="right"
      :model="formData"
      :rules="rules"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item required prop="name" :label="tl('name')">
            <el-input v-model="formData.name" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { computed, ref } from 'vue'
import useFormRules from '@/hooks/useFormRules'
import { useRoute } from 'vue-router'

const formData = ref({})
const { tl } = useI18nTl('General')

const route = useRoute()
const name = computed(() => route.params.name)

const { createRequiredRule, createIntFieldRule, createCommonIdRule } = useFormRules()

const rules = {
  name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
  url: createRequiredRule('URL'),
  pool_size: [...createRequiredRule('Pool Size'), ...createIntFieldRule()],
  failed_action: createRequiredRule(tl('failedAction'), 'select'),
  auto_reconnect: createRequiredRule(tl('autoReconnectInterval'), 'input'),
}
</script>

<style lang="scss"></style>
