<template>
  <div class="http-config config">
    <el-form
      ref="formCom"
      class="create-form"
      label-position="top"
      require-asterisk-position="right"
      :model="httpConfig"
      :rules="rules"
    >
      <!-- HTTP -->
      <div class="config-sub-block">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('Auth.method')" required prop="method">
              <el-select v-model="httpConfig.method" @change="handleMethodChanged">
                <el-option value="get" label="GET" />
                <el-option value="post" label="POST" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required prop="url">
              <template #label>
                <FormItemLabel label="URL" :desc="tl('httpURLDesc')" desc-marked />
              </template>
              <el-input v-model="httpConfig.url" />
            </el-form-item>
          </el-col>
          <template v-if="supportsDynamicHostname">
            <el-col :span="12">
              <el-form-item prop="hostname_resolution" required>
                <template #label>
                  <FormItemLabel
                    :label="tl('hostnameResolution')"
                    :desc="tl('hostnameResolutionDesc')"
                    desc-marked
                  />
                </template>
                <el-select v-model="httpConfig.hostname_resolution">
                  <el-option value="static" :label="tl('hostnameResolutionStatic')" />
                  <el-option value="dynamic" :label="tl('hostnameResolutionDynamic')" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="isDynamicHostname" :span="12">
              <el-form-item prop="allowed_hosts" :required="requiresAllowedHosts">
                <template #label>
                  <FormItemLabel
                    :label="tl('allowedHosts')"
                    :desc="tl('allowedHostsDesc')"
                    desc-marked
                  />
                </template>
                <ArrayEditorInput v-model="httpConfig.allowed_hosts" />
              </el-form-item>
            </el-col>
          </template>
          <PreconditionFormItem v-model="httpConfig.precondition" :auth-type="authType" />

          <el-col :span="24">
            <el-form-item>
              <FormItemLabel
                :label="$t('RuleEngine.headers')"
                :desc="isMethodGet ? tl('httpHeaderDesc') : undefined"
                desc-marked
              />
              <key-and-value-editor v-model="httpConfig.headers" />
            </el-form-item>
          </el-col>
          <HttpOAuth2Config v-if="supportsOAuth2" v-model="httpConfig.oauth2" :is-edit="isEdit" />
          <el-col :span="12" v-if="type === 'scram'">
            <el-form-item :label="tl('passwordHash')">
              <el-select v-model="httpConfig.algorithm" clearable>
                <el-option value="sha256" />
                <el-option value="sha512" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!-- TLS -->
            <CommonTLSConfig class="TLS-config" v-model="httpConfig.ssl" :is-edit="isEdit" />
          </el-col>
        </el-row>
      </div>

      <!-- Auth Config -->
      <div class="config-sub-block">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item class="label-whole-line" prop="body">
              <template #label>
                <FormItemLabel
                  :label="$t('RuleEngine.body')"
                  :desc="tl('httpBodyTip')"
                  desc-marked
                />
                <el-button size="small" @click="setDefaultContent" class="button-in-label-line">
                  {{ $t('Auth.setDefault') }}
                </el-button>
                <el-button class="help-btn" size="small" @click="toggleNeedHelp">
                  {{ $t('Base.help') }}
                </el-button>
              </template>
              <el-collapse-transition>
                <div class="help-container" v-if="needHelp">
                  <HelpBlock :auth-type="authType" database-type="http" />
                </div>
              </el-collapse-transition>
              <div class="viewer-container" ref="monacoContainer">
                <monaco id="acl-file-editor" v-model="httpConfig.body" lang="json" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- Connect Config -->
        <AdvancedSettingContainer>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('RuleEngine.connectionPoolSize')" prop="pool_size">
                <CustomInputNumber v-model="httpConfig.pool_size" :min="minPoolSize" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('Auth.connectTimeout')">
                <time-input-with-unit-select v-model="httpConfig.connect_timeout" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <template #label>
                  <FormItemLabel
                    :label="t('BridgeSchema.common.max_inactive.label')"
                    :desc="t('BridgeSchema.common.max_inactive.desc')"
                  />
                </template>
                <time-input-with-unit-select v-model="httpConfig.max_inactive" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('Auth.httpPipelining')">
                <CustomInputNumber v-model="httpConfig.enable_pipelining" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('Auth.requestTimeout')">
                <time-input-with-unit-select v-model="httpConfig.request_timeout" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="type === 'scram'">
              <el-form-item :label="tl('iterationCount')">
                <CustomInputNumber v-model="httpConfig.iteration_count" />
              </el-form-item>
            </el-col>
          </el-row>
        </AdvancedSettingContainer>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import HelpBlock from './HelpBlock.vue'
import PreconditionFormItem from './PreconditionFormItem.vue'
import HttpOAuth2Config from '@/components/HttpOAuth2Config.vue'

export default defineComponent({
  name: 'HttpConfig',
  components: {
    HelpBlock,
    HttpOAuth2Config,
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
    isEdit: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '',
    },
  },
  setup(props, ctx) {
    const { tl, t } = useI18nTl('Auth')
    const httpJSON: {
      username: string
      password?: string
    } = {
      username: '${username}',
    }
    if (props.authType === 'authn') {
      httpJSON.password = '${password}'
    }
    const defaultContent = JSON.stringify(httpJSON, null, 2)
    const httpConfig = ref(props.modelValue)
    const supportsDynamicHostname = computed(() => props.type !== 'scram')
    const supportsOAuth2 = computed(() => props.authType !== 'authn' || props.type !== 'scram')
    const ensureHostnameResolutionFields = () => {
      if (!supportsDynamicHostname.value) {
        return
      }
      httpConfig.value.hostname_resolution ??= 'static'
      if (!Array.isArray(httpConfig.value.allowed_hosts)) {
        httpConfig.value.allowed_hosts = []
      }
    }
    ensureHostnameResolutionFields()
    if (supportsOAuth2.value && !httpConfig.value.oauth2) {
      httpConfig.value.oauth2 = { enable: false }
    }
    const { formCom, rules, validate } = useHTTPConfigForm(
      httpConfig,
      () => supportsDynamicHostname.value,
    )
    watch(httpConfig.value, (value) => {
      ctx.emit('update:modelValue', value)
    })

    watch(
      () => props.modelValue,
      (val) => {
        if (!isEqual(val, httpConfig.value)) {
          httpConfig.value = val
          ensureHostnameResolutionFields()
          stringifyBody()
        }
      },
    )

    const needHelp = ref(false)

    const isMethodGet = computed(() => httpConfig.value.method === 'get')
    const isDynamicHostname = computed(
      () => supportsDynamicHostname.value && httpConfig.value.hostname_resolution === 'dynamic',
    )
    const requiresAllowedHosts = computed(() => {
      const authority = httpConfig.value.url?.match(/^[a-z][a-z\d+.-]*:\/\/([^/?#]*)/i)?.[1]
      return isDynamicHostname.value && (authority?.includes('${') ?? false)
    })
    const minPoolSize = computed(() => (isDynamicHostname.value ? 0 : 1))
    const { factory } = useAuthnCreate()
    /**
     * just for get headers
     */
    const { headers: defaultHeaders } = factory('password_based', 'http')
    const handleMethodChanged = () => {
      if (isMethodGet.value && isEqual(httpConfig.value.headers, defaultHeaders)) {
        httpConfig.value.headers = {}
      } else if (!isMethodGet.value && isEqual(httpConfig.value.headers, {})) {
        httpConfig.value.headers = defaultHeaders
      }
    }

    const stringifyBody = () => {
      const { body } = httpConfig.value || {}
      if (!body) {
        return
      }
      if (typeof body === 'object') {
        httpConfig.value.body = JSON.stringify(body, null, 2)
      }
    }

    const toggleNeedHelp = async () => {
      needHelp.value = !needHelp.value
    }
    const setDefaultContent = async () => {
      await ElMessageBox.confirm(tl('setDefaultConfirm'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
      httpConfig.value.body = defaultContent
    }

    stringifyBody()

    return {
      t,
      tl,
      httpConfig,
      needHelp,
      formCom,
      rules,
      isMethodGet,
      supportsDynamicHostname,
      supportsOAuth2,
      isDynamicHostname,
      requiresAllowedHosts,
      minPoolSize,
      handleMethodChanged,
      validate,
      toggleNeedHelp,
      setDefaultContent,
    }
  },
})
</script>

<style lang="scss">
@use '../style/authConfig.scss';
.http-config.config {
  .viewer-container {
    height: 200px;
  }
}
</style>
