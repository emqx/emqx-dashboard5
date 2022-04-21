<template>
  <div class="built-in-config config">
    <div class="create-form-title">Built-in Database</div>
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
            <el-form-item :label="$t('Auth.userIdType')">
              <el-select v-model="builtConfig.user_id_type">
                <el-option value="username" />
                <el-option value="clientid" />
              </el-select>
            </el-form-item>
          </el-col>
          <password-hash-algorithm-form-items v-model="builtConfig" />
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
import { defineComponent, reactive, watch, ref } from 'vue'
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
    type: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const builtConfig = reactive(props.modelValue) as any

    const formCom = ref()
    const rules = {}

    const validate = () => Promise.resolve(true)

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
