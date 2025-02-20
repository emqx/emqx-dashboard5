<template>
  <div class="ldap-config config">
    <el-form
      ref="formCom"
      class="create-form"
      label-position="top"
      require-asterisk-position="right"
      :model="ldapConfig"
      :rules="rules"
    >
      <!-- LDAP -->
      <div class="config-sub-block">
        <el-row :gutter="20">
          <!-- Server -->
          <el-col :span="12">
            <el-form-item :label="tl('server')" prop="server">
              <el-input v-model="ldapConfig.server" />
            </el-form-item>
          </el-col>

          <!-- Username -->
          <el-col :span="12">
            <el-form-item :label="$t('Base.username')" required prop="username">
              <el-input v-model="ldapConfig.username" />
            </el-form-item>
          </el-col>

          <!-- Password -->
          <el-col :span="12">
            <el-form-item :label="$t('Base.password')" prop="password">
              <CustomInputPassword v-model="ldapConfig.password" />
            </el-form-item>
          </el-col>

          <!-- TLS -->
          <el-col :span="24">
            <CommonTLSConfig class="TLS-config" v-model="ldapConfig.ssl" :is-edit="isEdit" />
            <el-divider />
          </el-col>

          <!-- Connection Pool Size -->
          <el-col :span="12">
            <el-form-item :label="$t('RuleEngine.connectionPoolSize')" prop="pool_size">
              <el-input v-model.number="ldapConfig.pool_size" />
            </el-form-item>
          </el-col>

          <!-- Query Timeout -->
          <el-col :span="12">
            <el-form-item :label="tl('queryTimeout')" prop="query_timeout">
              <time-input-with-unit-select v-model="ldapConfig.query_timeout" />
            </el-form-item>
          </el-col>

          <!-- Base DN -->
          <el-col :span="12">
            <el-form-item :label="tl('base_dn')" prop="base_dn">
              <el-input
                v-model="ldapConfig.base_dn"
                :placeholder="
                  authType === 'authz' ? 'uid=${username},ou=testdevice,dc=emqx,dc=io' : ''
                "
              />
            </el-form-item>
          </el-col>

          <template v-if="authType === 'authn'">
            <el-col :span="12">
              <el-form-item :label="tl('pwdMethod')" prop="method.type">
                <el-select v-model="ldapConfig.method.type">
                  <el-option
                    v-for="{ value, label, desc } in authMethodOpts"
                    :key="value"
                    :value="value"
                    :label="label"
                  >
                    {{ label }}
                    <InfoTooltip :content="desc" />
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="ldapConfig.method.type === LDAPAuthMethod.Hash">
              <!-- Password Attribute -->
              <el-col :span="12">
                <el-form-item :label="tl('password_attribute')" prop="method.password_attribute">
                  <template #label>
                    {{ tl('password_attribute') }}
                    <InfoTooltip
                      v-if="ldapConfig.method.password_attribute"
                      :content="tl('password_attribute_desc')"
                    />
                  </template>
                  <el-input v-model="ldapConfig.method.password_attribute" />
                </el-form-item>
              </el-col>

              <!-- Is Superuser Attribute -->
              <el-col :span="12">
                <el-form-item
                  :label="tl('is_superuser_attribute')"
                  prop="method.is_superuser_attribute"
                >
                  <template #label>
                    {{ tl('is_superuser_attribute') }}
                    <InfoTooltip
                      v-if="ldapConfig.method.is_superuser_attribute"
                      :content="tl('is_superuser_attribute_desc')"
                    />
                  </template>
                  <el-input v-model="ldapConfig.method.is_superuser_attribute" />
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="12" v-else-if="ldapConfig.method.type === LDAPAuthMethod.Bind">
              <el-form-item :label="tl('bind_password')" prop="method.bind_password">
                <template #label>
                  {{ tl('bind_password') }}
                  <InfoTooltip :content="tl('bind_password_desc')" />
                </template>
                <el-input v-model="ldapConfig.method.bind_password" />
              </el-form-item>
            </el-col>
          </template>

          <!-- Filter -->
          <el-col :span="24">
            <el-form-item :label="tl('filter')" prop="filter">
              <div class="viewer-container" ref="monacoContainer">
                <monaco id="ldap-filter-editor" v-model="ldapConfig.filter" lang="plaintext" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useLdapConfigFrom from '@/hooks/Auth/useLdapConfigForm'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useI18nTl from '@/hooks/useI18nTl'
import Monaco from '@/components/Monaco.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { LDAPAuthMethod } from '@/types/enum'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  authType: {
    required: true,
    type: String as PropType<'authn' | 'authz'>,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
const { tl } = useI18nTl('Auth')
const { formCom, rules, validate } = useLdapConfigFrom()
const ldapConfig = ref(props.modelValue)

defineExpose({
  validate,
})

const emit = defineEmits(['update:modelValue'])

const authMethodOpts = [
  { value: LDAPAuthMethod.Hash, label: tl('methodHashLabel'), desc: tl('methodHashDesc') },
  { value: LDAPAuthMethod.Bind, label: tl('methodBindLabel'), desc: tl('methodBindDesc') },
]

watch(ldapConfig, (value) => {
  emit('update:modelValue', value)
})
</script>

<style lang="scss">
@use '../style/authConfig.scss';
.ldap-config.config {
  .viewer-container {
    height: 200px;
  }
}
</style>
