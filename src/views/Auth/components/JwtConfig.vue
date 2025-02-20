<template>
  <div class="jwt-config config">
    <el-radio-group v-model="jwtConfig.use_jwks" @change="handleUseJWKSChanged">
      <el-radio-button :value="false" border> JWT </el-radio-button>
      <el-radio-button :value="true" border> JWKS </el-radio-button>
    </el-radio-group>
    <el-form
      ref="formCom"
      :model="jwtConfig"
      :rules="rules"
      class="create-form"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-row :gutter="20">
        <!-- JWT -->
        <el-col :span="12">
          <el-form-item :label="$t('Auth.from')" required prop="from">
            <el-select v-model="jwtConfig.from">
              <el-option value="username" />
              <el-option value="password" />
            </el-select>
          </el-form-item>
        </el-col>
        <template v-if="jwtConfig.use_jwks === false">
          <el-col :span="12">
            <el-form-item :label="$t('Auth.algorithm')" required prop="algorithm">
              <el-select v-model="jwtConfig.algorithm">
                <el-option value="hmac-based" />
                <el-option value="public-key" />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="jwtConfig.algorithm === 'hmac-based'">
            <el-col :span="12">
              <el-form-item label="Secret" required prop="secret">
                <template #label>
                  Secret
                  <InfoTooltip
                    v-if="jwtConfig.secret_base64_encoded"
                    :content="$t('Auth.jwtBase64Tips')"
                  />
                </template>
                <CustomInputPassword v-model="jwtConfig.secret" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('Auth.secret_base64_encoded')">
                <el-switch v-model="jwtConfig.secret_base64_encoded"></el-switch>
              </el-form-item>
            </el-col>
          </template>
          <el-col v-else-if="jwtConfig.algorithm === 'public-key'" :span="24">
            <el-form-item label="Public Key" prop="public_key">
              <el-input type="textarea" :rows="4" v-model="jwtConfig.public_key" />
            </el-form-item>
          </el-col>
        </template>
        <!-- JWKS -->
        <template v-else>
          <el-col :span="12">
            <el-form-item label="JWKS Endpoint" required prop="endpoint">
              <el-input v-model="jwtConfig.endpoint" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Auth.refreshInterval')">
              <el-input
                class="time-input-with-unit-select"
                v-model.number="jwtConfig.refresh_interval"
              >
                <template #append><span class="unit-for-input">s</span></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('RuleEngine.headers')">
              <key-and-value-editor v-model="jwtConfig.headers" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <CommonTLSConfig v-model="jwtConfig.ssl" :is-edit="isEdit" />
          </el-col>
        </template>
        <el-col :span="24">
          <el-form-item :label="$t('Auth.disconnect_after_expire')">
            <el-switch v-model="jwtConfig.disconnect_after_expire"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Payload">
            <key-and-value-editor
              v-model="jwtConfig.verify_claims"
              :custom-label="{
                key: 'Claim',
                value: 'Expected Value',
              }"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import InfoTooltip from '@/components/InfoTooltip.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useJWTConfigForm from '@/hooks/Auth/useJWTConfigForm'
import useSSL from '@/hooks/useSSL'

export default defineComponent({
  name: 'JwtConfig',
  components: {
    KeyAndValueEditor,
    InfoTooltip,
    CommonTLSConfig,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
    },
  },
  setup(props, ctx) {
    const jwtConfig = reactive(props.modelValue)
    const { formCom, rules, validate } = useJWTConfigForm()

    const { createSSLForm } = useSSL()
    const handleUseJWKSChanged = (val: boolean | string | number): any => {
      if (val && !('ssl' in jwtConfig)) {
        jwtConfig.ssl = createSSLForm()
      }
    }

    watch(jwtConfig, (value) => {
      ctx.emit('update:modelValue', value)
    })
    return {
      jwtConfig,
      formCom,
      rules,
      handleUseJWKSChanged,
      validate,
    }
  },
})
</script>

<style lang="scss">
@use '../style/authConfig.scss';
.jwt-config {
  .el-radio-group {
    margin: 12px 0 32px 0;
  }
}
</style>
