<template>
  <div class="jwt-config config">
    <div class="create-form-title">
      {{ $t('Auth.validMethod') }}
    </div>
    <el-radio-group v-model="jwtConfig.use_jwks">
      <el-radio :label="false" border> JWT </el-radio>
      <el-radio :label="true" border> JWKS </el-radio>
    </el-radio-group>
    <div class="create-form-title">
      {{ $t('Auth.config') }}
    </div>
    <el-form class="create-form" label-position="top">
      <el-row :gutter="20">
        <template v-if="jwtConfig.use_jwks === false">
          <el-col :span="12">
            <el-form-item :label="$t('Auth.algorithm')">
              <el-select v-model="jwtConfig.algorithm">
                <el-option value="hmac-based"></el-option>
                <el-option value="public-key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="jwtConfig.algorithm === 'hmac-based'">
            <el-col :span="12">
              <el-form-item label="Secret">
                <template #label>
                  Secret
                  <InfoTooltip
                    v-if="jwtConfig.secret_base64_encoded"
                    :content="$t('Auth.jwtBase64Tips')"
                  />
                </template>
                <el-input v-model="jwtConfig.secret"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Secret Base64 Encoded">
                <el-select v-model="jwtConfig.secret_base64_encoded">
                  <el-option :value="true" label="True"></el-option>
                  <el-option :value="false" label="False"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <el-col v-else-if="jwtConfig.algorithm === 'public-key'" :span="24">
            <el-form-item label="Public Key">
              <el-input type="textarea" :rows="4" v-model="jwtConfig.certificate"></el-input>
            </el-form-item>
          </el-col>
        </template>
        <template v-else>
          <el-col :span="12">
            <el-form-item label="JWKS Server">
              <el-input v-model="jwtConfig.endpoint"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Auth.refreshInterval')">
              <el-input v-model="jwtConfig.refresh_interval"></el-input>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="24">
          <el-form-item label="Verify Claims">
            <key-and-value-editor
              v-model="jwtConfig.verify_claims"
              :custom-label="{
                key: 'JWT Payload',
                value: 'Client Info',
              }"
            ></key-and-value-editor>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'

export default defineComponent({
  name: 'JwtConfig',
  components: {
    KeyAndValueEditor,
    InfoTooltip,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  setup(props, ctx) {
    const jwtConfig = reactive(props.modelValue)
    watch(jwtConfig, (value) => {
      ctx.emit('update:modelValue', value)
    })
    return {
      jwtConfig,
    }
  },
})
</script>

<style lang="scss">
@import '../style/authConfig.scss';
</style>
