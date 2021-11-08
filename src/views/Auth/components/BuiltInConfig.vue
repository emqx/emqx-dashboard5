<template>
  <div class="built-in-config config">
    <div class="create-form-title">Build-in-Database</div>
    <el-row :gutter="20">
      <el-form class="create-form">
        <template v-if="type !== 'scram'">
          <el-col :span="12">
            <el-form-item :label="$t('Auth.userIdType')">
              <el-select v-model="builtConfig.user_id_type">
                <el-option value="username"></el-option>
                <el-option value="clientid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Auth.passwordHash')">
              <el-select v-model="builtConfig.password_hash_algorithm.name">
                <el-option
                  v-for="item in HashOptions"
                  :key="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-if="builtConfig.password_hash_algorithm.name === 'bcrypt'"
            :span="12"
          >
            <el-form-item label="Salt Rounds">
              <el-input
                v-model="builtConfig.password_hash_algorithm.salt_rounds"
              ></el-input>
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
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from "vue";
import usePassword from "@/hooks/usePassword";

export default defineComponent({
  name: "BuiltInConfig",

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
  emits: ["update:modelValue"],
  setup(props, ctx) {
    const builtConfig = reactive(props.modelValue);
    watch(builtConfig, (value) => {
      ctx.emit("update:modelValue", value);
    });
    const { HashOptions } = usePassword();
    return {
      HashOptions,
      builtConfig,
    };
  },
});
</script>

<style lang="scss">
@import "../style/authConfig.scss";
</style>
