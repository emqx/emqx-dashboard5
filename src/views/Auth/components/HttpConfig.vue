<template>
  <div class="http-config config">
    <el-form
      ref="formCom"
      class="create-form"
      label-position="top"
      :model="httpConfig"
      :rules="rules"
    >
      <!-- HTTP -->
      <div class="config-sub-block">
        <div class="create-form-title">HTTP</div>
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
            <el-form-item label="Headers">
              <key-and-value-editor v-model="httpConfig.headers" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Connect Config -->
      <div class="config-sub-block">
        <div class="create-form-title">{{ $t('Auth.connectConfig') }}</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Pool size">
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
              <el-input-number
                v-model="httpConfig.enable_pipelining"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Auth.requestTimeout')">
              <time-input-with-unit-select v-model="httpConfig.request_timeout" />
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
        <div class="create-form-title">
          {{ authType === 'authn' ? $t('Auth.authnConfig') : $t('Auth.authzConfig') }}
          <el-button class="help-btn" size="small" @click="toggleNeedHelp">
            {{ $t('Base.help') }}
          </el-button>
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Body">
              <div class="viewer-container" ref="monacoContainer">
                <monaco id="acl-file-editor" v-model="httpConfig.body" lang="json" />
              </div>
              <el-button class="bottom-btn" size="small" @click="setDefaultContent">
                {{ $t('Auth.setDefault') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-collapse-transition>
            <el-col v-if="needHelp" :span="24">
              <HelpBlock :auth-type="authType" database-type="http" />
            </el-col>
          </el-collapse-transition>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import Monaco from '@/components/Monaco.vue'
import useHTTPConfigForm from '@/hooks/Auth/useHTTPConfigForm'
import HelpBlock from './HelpBlock.vue'
import { isEqual } from 'lodash'

export default defineComponent({
  name: 'HttpConfig',
  components: {
    KeyAndValueEditor,
    CommonTLSConfig,
    TimeInputWithUnitSelect,
    Monaco,
    HelpBlock,
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
    const setDefaultContent = () => {
      httpConfig.value.body = defaultContent
    }

    stringifyBody()

    return {
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
