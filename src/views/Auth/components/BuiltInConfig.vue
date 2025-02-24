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
          <password-hash-algorithm-form-items v-model="builtConfig" is-built-in-database />
        </template>
        <el-col v-else :span="12">
          <el-form-item :label="$t('Auth.passwordHash')">
            <el-select v-model="builtConfig.algorithm" clearable>
              <el-option value="sha256" />
              <el-option value="sha512" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import PasswordHashAlgorithmFormItems from './PasswordHashAlgorithmFormItems.vue'

export default defineComponent({
  name: 'BuiltInConfig',

  components: {
    PasswordHashAlgorithmFormItems,
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
      builtConfig,
      formCom,
      rules,
      validate,
    }
  },
})
</script>

<style lang="scss">
@use '../style/authConfig.scss';
</style>
