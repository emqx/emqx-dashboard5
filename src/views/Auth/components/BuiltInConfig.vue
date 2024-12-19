<!-- Just for authn -->
<template>
  <div class="built-in-config config">
    <el-form
      ref="formCom"
      :model="builtConfig"
      :rules="rules"
      label-width="200px"
      class="create-form"
    >
      <template :gutter="20" v-if="authType === 'authz'">
        <el-form-item prop="max_rules">
          <template #label>
            <FormItemLabel :label="$t('Auth.maxRules')" :desc="$t('Auth.maxRulesDesc')" />
          </template>
          <CustomInputNumber v-model="builtConfig.max_rules" />
        </el-form-item>
      </template>
      <template :gutter="20" v-else>
        <template v-if="type !== 'scram'">
          <el-form-item :label="$t('Auth.userIdType')" required prop="user_id_type">
            <el-select v-model="builtConfig.user_id_type">
              <el-option value="username" />
              <el-option value="clientid" />
            </el-select>
          </el-form-item>
          <password-hash-algorithm-form-items v-model="builtConfig" is-built-in-database />
        </template>
        <template v-else>
          <el-form-item :label="$t('Auth.passwordHash')">
            <el-select v-model="builtConfig.algorithm" clearable>
              <el-option value="sha256" />
              <el-option value="sha512" />
            </el-select>
          </el-form-item>
          <el-form-item :label="tl('iterationCount')">
            <CustomInputNumber v-model="builtConfig.iteration_count" />
          </el-form-item>
        </template>
      </template>
    </el-form>
  </div>
</template>

<script lang="ts">
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import { usePasswordHashRules } from '@/hooks/Auth/usePasswordHashAlgorithmData'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import type { PropType } from 'vue'
import { defineComponent, reactive, ref, watch } from 'vue'
import PasswordHashAlgorithmFormItems from './PasswordHashAlgorithmFormItems.vue'

export default defineComponent({
  name: 'BuiltInConfig',

  components: {
    PasswordHashAlgorithmFormItems,
    CustomInputNumber,
    FormItemLabel,
  },

  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    authType: {
      required: true,
      type: String as PropType<'authn' | 'authz'>,
    },
    type: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const { tl } = useI18nTl('Auth')

    const builtConfig = reactive(props.modelValue) as any

    const formCom = ref()
    const { createRequiredRule, createNumRangeRule } = useFormRules()
    const { passwordHashRules } = usePasswordHashRules()
    const rules = {
      user_id_type: createRequiredRule(tl('userIdType')),
      ...passwordHashRules,
      max_rules: createNumRangeRule(1),
    }

    const validate = () => {
      return formCom.value?.validate()
    }

    watch(builtConfig, (value) => {
      ctx.emit('update:modelValue', value)
    })
    return {
      tl,
      builtConfig,
      formCom,
      rules,
      validate,
    }
  },
})
</script>

<style lang="scss">
@import '../style/authConfig.scss';
</style>
