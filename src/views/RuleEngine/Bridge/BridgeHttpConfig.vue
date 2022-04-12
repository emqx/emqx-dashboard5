<template>
  <div class="bridge-config">
    <el-form
      ref="formCom"
      label-position="top"
      :disabled="disabled"
      :rules="formRules"
      :model="httpBridgeVal"
    >
      <div class="part-header">{{ tl('baseInfo') }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('name')" required prop="name">
            <el-input v-model="httpBridgeVal.name" :disabled="edit" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl('mappingInfo') }}</div>
      <p class="block-primary-desc">{{ tl('bridgeDataInDesc') }}</p>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('localTopic')">
            <el-input
              v-model="httpBridgeVal.local_topic"
              :placeholder="tl('outBridgeLocalTopicPlaceholder')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <p class="block-primary-desc">{{ tl('bridgeDataOutDesc') }}</p>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('method')" required prop="method">
            <el-select v-model="httpBridgeVal.method">
              <el-option
                v-for="item in ['post', 'get', 'put', 'delete']"
                :value="item"
                :label="String(item).toUpperCase()"
                :key="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'URL'" required prop="url">
            <template #label>
              <label>URL</label>
              <InfoTooltip :content="tl('httpBridgeURLFieldDesc')" />
            </template>
            <el-input v-model="httpBridgeVal.url" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="tl('headers')">
            <key-and-value-editor v-model="httpBridgeVal.headers" class="kv-editor" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item>
            <template #label>
              <label>{{ tl('body') }}</label>
              <i18n-t class="payload-desc" keypath="RuleEngine.payloadDesc" tag="p">
                <a href="TODO:" target="_blank">{{ tl('payloadTempSyntax') }}</a>
              </i18n-t>
            </template>
            <div class="monaco-container">
              <Monaco
                :id="createRandomString()"
                v-model="httpBridgeVal.body"
                lang="json"
                json-without-validate
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl('connSetting') }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="'Pool size'" required prop="pool_size">
            <el-input v-model.number="httpBridgeVal.pool_size" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('enablePipeline')">
            <el-select v-model="httpBridgeVal.enable_pipelining">
              <el-option v-for="ep in [true, false]" :key="ep" :value="ep" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('connTimeout')">
            <el-input v-model.number="httpBridgeVal.connect_timeout[0]">
              <template #append>
                <el-select v-model="httpBridgeVal.connect_timeout[1]">
                  <el-option value="s" />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('reqTimeout')">
            <el-input v-model.number="httpBridgeVal.request_timeout[0]">
              <template #append>
                <el-select v-model="httpBridgeVal.request_timeout[1]">
                  <el-option value="s" />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('errRetry')" required prop="max_retries">
            <el-input v-model.number="httpBridgeVal.max_retries" />
          </el-form-item>
        </el-col>
      </el-row>
      <CommonTLSConfig class="tls-config-form" v-model="tlsParams" />
    </el-form>
  </div>
</template>

<script lang="ts">
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import { computed, defineComponent, ref, watch, onMounted } from 'vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import _ from 'lodash'
import { transformUnitArrayToStr, transformStrToUnitArray } from '@/common/utils'
import { HTTPBridge } from '@/types/rule'
import Monaco from '@/components/Monaco.vue'
import { createRandomString } from '@/common/tools'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import InfoTooltip from '@/components/InfoTooltip.vue'

type HTTPFormData = Omit<HTTPBridge, 'connect_timeout' | 'request_timeout'> & {
  connect_timeout: [number, string]
  request_timeout: [number, string]
}

export default defineComponent({
  components: {
    KeyAndValueEditor,
    Monaco,
    InfoTooltip,
    CommonTLSConfig,
  },
  name: '',
  props: {
    tls: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    modelValue: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, context) {
    const { tl } = useI18nTl('RuleEngine')
    const httpBridgeDefaultVal = {
      name: '',
      local_topic: '',
      method: 'post',
      url: 'http://',
      headers: {
        'content-type': 'application/json',
      },
      body: '${payload}',
      pool_size: 4,
      enable_pipelining: true,
      connect_timeout: [5, 's'],
      request_timeout: [5, 's'],
      max_retries: 3,
    }

    let modelValueCache = ''
    const httpBridgeVal = ref({
      ..._.cloneDeep(httpBridgeDefaultVal),
      // FIXME: Use an existing component
      ...transformStrToUnitArray(props.modelValue, ['connect_timeout', 'request_timeout']),
    })

    const tlsParams = computed(() => props.tls)

    const { createRequiredRule, createIntFieldRule } = useFormRules()
    const formCom = ref()
    const formRules = ref({
      name: createRequiredRule(tl('name')),
      method: createRequiredRule(tl('method'), 'select'),
      url: createRequiredRule('URL'),
      pool_size: [...createRequiredRule('Pool size'), ...createIntFieldRule(1)],
      max_retries: [...createRequiredRule(tl('errRetry')), ...createIntFieldRule(1)],
    })

    const initHttpBridgeVal = () => {
      httpBridgeVal.value = {
        ..._.cloneDeep(httpBridgeDefaultVal),
        ...transformStrToUnitArray(props.modelValue, ['connect_timeout', 'request_timeout']),
      }
    }

    const updateModelValue = (val: HTTPFormData) => {
      const value = transformUnitArrayToStr(val)
      modelValueCache = JSON.stringify(value)
      context.emit('update:modelValue', value)
    }

    const validate = () => {
      return formCom.value.validate()
    }

    const clearValidate = () => {
      return formCom.value.clearValidate()
    }

    watch(
      () => _.cloneDeep(httpBridgeVal.value),
      (val) => {
        updateModelValue(val)
      },
    )

    watch(
      () => props.modelValue,
      (val) => {
        if (JSON.stringify(val) !== modelValueCache) {
          initHttpBridgeVal()
        }
      },
    )

    onMounted(() => {
      updateModelValue(httpBridgeVal.value)
    })

    return {
      tl,
      createRandomString,
      formCom,
      formRules,
      tlsParams,
      httpBridgeVal,
      validate,
      clearValidate,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/style/rule.scss';
.tls-config-form {
  margin-top: 20px;
  :deep(.TLS-base-config) {
    .TLS-base-config-title {
      font-size: 16px;
    }
  }
  :deep(.TLS-enable-config) {
    .TLS-input {
      width: 100%;
    }
  }
}

.payload-desc {
  margin-top: 0;
  margin-bottom: 0;
  color: var(--el-text-color-secondary);
}
.monaco-container {
  margin-top: 12px;
}
</style>
