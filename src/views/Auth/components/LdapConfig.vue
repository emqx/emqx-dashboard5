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
              <el-input type="password" v-model="ldapConfig.password" />
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
            <!-- Password Attribute -->
            <el-col :span="12">
              <el-form-item :label="tl('password_attribute')" prop="password_attribute">
                <template #label>
                  {{ tl('password_attribute') }}
                  <InfoTooltip
                    v-if="ldapConfig.password_attribute"
                    :content="tl('password_attribute_desc')"
                  />
                </template>
                <el-input v-model="ldapConfig.password_attribute" />
              </el-form-item>
            </el-col>

            <!-- Is Superuser Attribute -->
            <el-col :span="12">
              <el-form-item :label="tl('is_superuser_attribute')" prop="is_superuser_attribute">
                <template #label>
                  {{ tl('is_superuser_attribute') }}
                  <InfoTooltip
                    v-if="ldapConfig.is_superuser_attribute"
                    :content="tl('is_superuser_attribute_desc')"
                  />
                </template>
                <el-input v-model="ldapConfig.is_superuser_attribute" />
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
import { PropType, ref, defineProps, watch, defineEmits, defineExpose } from 'vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useLdapConfigFrom from '@/hooks/Auth/useLdapConfigForm'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useI18nTl from '@/hooks/useI18nTl'
import Monaco from '@/components/Monaco.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'

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

watch(ldapConfig, (value) => {
  emit('update:modelValue', value)
})
</script>

<style lang="scss">
@import '../style/authConfig.scss';
.ldap-config.config {
  .viewer-container {
    height: 200px;
  }
}
</style>
