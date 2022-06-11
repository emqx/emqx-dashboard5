<!-- Just for authn -->
<template>
  <div class="built-in-config config">
    <el-form
      ref="formCom"
      :model="builtConfig"
      :rules="rules"
      class="create-form"
      label-position="top"
    >
      <el-row :gutter="20">
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
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { defineComponent, reactive, watch, ref } from 'vue'
import PasswordHashAlgorithmFormItems from './PasswordHashAlgorithmFormItems.vue'
import { usePasswordHashRules } from '@/hooks/Auth/usePasswordHashAlgorithmData'

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
    const { createRequiredRule } = useFormRules()
    const { passwordHashRules } = usePasswordHashRules()
    const rules = {
      user_id_type: createRequiredRule(tl('userIdType')),
      ...passwordHashRules,
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
@import '../style/authConfig.scss';
</style>
