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
              <el-select v-model="httpConfig.method">
                <el-option value="get" label="GET" />
                <el-option value="post" label="POST" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="URL" required prop="url">
              <el-input v-model="httpConfig.url" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('RuleEngine.headers')">
              <key-and-value-editor v-model="httpConfig.headers" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!-- TLS -->
            <CommonTLSConfig class="TLS-config" v-model="httpConfig.ssl" :is-edit="isEdit" />
          </el-col>
          <el-col :span="24"><el-divider /></el-col>
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
                  :desc="tl('httpHeaderTip')"
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
              <el-form-item :label="$t('RuleEngine.connectionPoolSize')">
                <el-input v-model.number="httpConfig.pool_size" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('Auth.connectTimeout')">
                <time-input-with-unit-select v-model="httpConfig.connect_timeout" />
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
          </el-row>
        </AdvancedSettingContainer>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import Monaco from '@/components/Monaco.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useHTTPConfigForm from '@/hooks/Auth/useHTTPConfigForm'
import useI18nTl from '@/hooks/useI18nTl'
import { ElMessageBox } from 'element-plus'
import { isEqual } from 'lodash'
import { defineComponent, PropType, ref, watch } from 'vue'
import HelpBlock from './HelpBlock.vue'

export default defineComponent({
  name: 'HttpConfig',
  components: {
    KeyAndValueEditor,
    CommonTLSConfig,
    TimeInputWithUnitSelect,
    Monaco,
    HelpBlock,
    FormItemLabel,
    CustomInputNumber,
    AdvancedSettingContainer,
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
    const { formCom, rules, validate } = useHTTPConfigForm()
    watch(httpConfig.value, (value) => {
      ctx.emit('update:modelValue', value)
    })

    watch(
      () => props.modelValue,
      (val) => {
        if (!isEqual(val, httpConfig.value)) {
          httpConfig.value = val
          stringifyBody()
        }
      },
    )

    const needHelp = ref(false)

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
      tl,
      httpConfig,
      needHelp,
      formCom,
      rules,
      validate,
      toggleNeedHelp,
      setDefaultContent,
    }
  },
})
</script>

<style lang="scss">
@import '../style/authConfig.scss';
.http-config.config {
  .viewer-container {
    height: 200px;
  }
}
</style>
