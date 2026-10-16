<!-- Just for authn -->
<template>
  <div class="built-in-config config">
    <el-form
      ref="formCom"
      :model="builtConfig"
      :rules="rules"
      class="create-form"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-row :gutter="20" v-if="authType === 'authz'">
        <el-col :span="12">
          <el-form-item prop="max_rules">
            <template #label>
              <FormItemLabel :label="$t('Auth.maxRules')" :desc="$t('Auth.maxRulesDesc')" />
            </template>
            <CustomInputNumber v-model="builtConfig.max_rules" />
          </el-form-item>
        </el-col>
        <PreconditionFormItem v-model="builtConfig.precondition" auth-type="authz" />
      </el-row>
      <el-row :gutter="20" v-else>
        <template v-if="type !== 'scram'">
          <el-col :span="12">
            <el-form-item :label="$t('Auth.userIdType')" required prop="user_id_type">
              <el-select v-model="builtConfig.user_id_type">
                <el-option value="username" />
                <el-option value="clientid" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('passwordMode')" prop="autogenerate_password" required>
              <el-select v-model="builtConfig.autogenerate_password" @change="handleModeChange">
                <el-option :value="true" :label="tl('generatedPasswordMode')" />
                <el-option :value="false" :label="tl('manualPasswordMode')" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="builtConfig.autogenerate_password" :span="24" class="mb-4">
            <el-alert :title="tl('generatedPasswordModeDesc')" type="info" :closable="false" />
          </el-col>
          <password-hash-algorithm-form-items v-else v-model="builtConfig" is-built-in-database />
        </template>
        <template v-else>
          <el-col :span="12">
            <el-form-item :label="$t('Auth.passwordHash')">
              <el-select v-model="builtConfig.algorithm" clearable>
                <el-option value="sha256" />
                <el-option value="sha512" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('iterationCount')">
              <CustomInputNumber v-model="builtConfig.iteration_count" />
            </el-form-item>
          </el-col>
        </template>
        <PreconditionFormItem v-model="builtConfig.precondition" />
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import PasswordHashAlgorithmFormItems from './PasswordHashAlgorithmFormItems.vue'
import PreconditionFormItem from './PreconditionFormItem.vue'
import { createBuiltinHash, isBuiltinHashSupported } from '@/common/authnBuiltinPassword'
import type { FormRules } from 'element-plus'

export default defineComponent({
  name: 'BuiltInConfig',

  components: {
    PasswordHashAlgorithmFormItems,
    PreconditionFormItem,
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
    /**
     * mechanism type in authn
     */
    type: {
      type: String,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const { tl } = useI18nTl('Auth')

    const builtConfig = computed<any>({
      get: () => props.modelValue,
      set: (value) => ctx.emit('update:modelValue', value),
    })
    let manualHash =
      builtConfig.value.autogenerate_password === false
        ? cloneDeep(builtConfig.value.password_hash_algorithm)
        : undefined
    const handleModeChange = (generated: boolean) => {
      builtConfig.value.autogenerate_password = generated
      if (generated) {
        manualHash = cloneDeep(builtConfig.value.password_hash_algorithm)
      }
      builtConfig.value.password_hash_algorithm =
        !generated && manualHash && isBuiltinHashSupported(manualHash)
          ? cloneDeep(manualHash)
          : createBuiltinHash(generated)
      nextTick(() => formCom.value?.clearValidate())
    }

    const formCom = ref()
    const { createRequiredRule, createNumRangeRule } = useFormRules()
    const { passwordHashRules } = usePasswordHashRules()
    const rules: FormRules = {
      user_id_type: createRequiredRule(tl('userIdType')),
      autogenerate_password: createRequiredRule(tl('passwordMode')),
      ...passwordHashRules,
      'password_hash_algorithm.iterations': [
        { required: true, type: 'integer', min: 1, message: tl('positiveIntegerRequired') },
      ],
      'password_hash_algorithm.dk_length': [
        {
          validator: (_rule: any, value: unknown, callback: (error?: Error) => void) => {
            callback(
              value === '' ||
                value === undefined ||
                (typeof value === 'number' && Number.isInteger(value) && value > 0)
                ? undefined
                : new Error(tl('positiveIntegerRequired')),
            )
          },
        },
      ],
      max_rules: createNumRangeRule(1),
    }

    const validate = async () => {
      await formCom.value?.validate()
      if (
        props.authType === 'authn' &&
        props.type === 'password_based' &&
        !builtConfig.value.autogenerate_password &&
        !isBuiltinHashSupported(builtConfig.value.password_hash_algorithm)
      ) {
        ElMessage.error(tl('unsupportedBuiltinHash'))
        throw new Error('Unsupported built-in password hash')
      }
      return true
    }
    return {
      tl,
      builtConfig,
      formCom,
      rules,
      validate,
      handleModeChange,
    }
  },
})
</script>

<style lang="scss">
@use '../style/authConfig.scss';
</style>
