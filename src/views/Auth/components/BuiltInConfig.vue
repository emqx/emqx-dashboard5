<template>
  <div class="built-in-config config">
    <div class="create-form-title">Built-in Database</div>
    <el-form class="create-form" size="small" label-position="top">
      <el-row :gutter="20">
        <template v-if="type !== 'scram'">
          <el-col :span="12">
            <el-form-item :label="$t('Auth.userIdType')">
              <el-select v-model="builtConfig.user_id_type">
                <el-option value="username"></el-option>
                <el-option value="clientid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <password-hash-algorithm-form-items v-model="builtConfig" />
          <el-col :span="12">
            <el-form-item :label="$t('Auth.saltPosition')">
              <el-select v-model="builtConfig.password_hash_algorithm.salt_position">
                <el-option value="prefix"></el-option>
                <el-option value="suffix"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </template>
        <el-col v-else :span="12">
          <el-form-item :label="$t('Auth.passwordHash')">
            <el-select v-model="builtConfig.algorithm">
              <el-option value="sha256"></el-option>
              <el-option value="sha512"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from 'vue'
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
    const builtConfig = reactive(props.modelValue)
    watch(builtConfig, (value) => {
      ctx.emit('update:modelValue', value)
    })
    return {
      builtConfig,
    }
  },
})
</script>

<style lang="scss">
@import '../style/authConfig.scss';
</style>
