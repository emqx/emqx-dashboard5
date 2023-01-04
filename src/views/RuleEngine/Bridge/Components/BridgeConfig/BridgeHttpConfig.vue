<template>
  <div class="bridge-config">
    <el-form ref="formCom" label-position="top" :rules="formRules" :model="httpBridgeVal">
      <el-row :gutter="26">
        <el-col :span="12">
          <el-form-item :label="tl('name')" required prop="name">
            <el-input v-model="httpBridgeVal.name" :disabled="edit" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider />
      <el-row :gutter="26">
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
      <el-row :gutter="26">
        <el-col :span="12">
          <el-form-item :label="'Pool size'" required prop="pool_size">
            <el-input v-model.number="httpBridgeVal.pool_size" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('errRetry')" required prop="max_retries">
            <el-input v-model.number="httpBridgeVal.max_retries" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('connTimeout')">
            <InputWithUnit v-model="httpBridgeVal.connect_timeout" :units="['s']" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('reqTimeout')">
            <InputWithUnit v-model="httpBridgeVal.request_timeout" :units="['s']" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('httpPipeline')">
            <el-input-number
              v-model="httpBridgeVal.enable_pipelining"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <CommonTLSConfig class="tls-config-form" v-model="httpBridgeVal.ssl" :is-edit="edit" />
      <el-divider />
      <el-row :gutter="26">
        <el-col :span="24">
          <el-form-item>
            <template #label>
              <label>{{ tl('body') }}</label>
              <InfoTooltip :content="tl('payloadExample')" />
              <p class="payload-desc">{{ tl('payloadDesc') }}</p>
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
      <el-divider />
      <el-row :gutter="26">
        <BridgeResourceOpt v-model="httpBridgeVal.resource_opts" />
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch, PropType } from 'vue'
import { createRandomString } from '@/common/tools'
import { transformUnitArrayToStr } from '@/common/utils'
import InfoTooltip from '@/components/InfoTooltip.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import Monaco from '@/components/Monaco.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useResourceOpt from '@/hooks/Rule/bridge/useResourceOpt'
import useDocLink from '@/hooks/useDocLink'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import useSSL from '@/hooks/useSSL'
import { HTTPBridge } from '@/types/rule'
import _ from 'lodash'
import BridgeResourceOpt from './BridgeResourceOpt.vue'

export default defineComponent({
  components: {
    KeyAndValueEditor,
    Monaco,
    InfoTooltip,
    CommonTLSConfig,
    InputWithUnit,
    BridgeResourceOpt,
  },
  name: '',
  props: {
    modelValue: {
      type: Object as PropType<HTTPBridge>,
      required: false,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      required: false,
      default: false,
    },
    copy: {
      type: Boolean,
    },
  },
  setup(props, context) {
    const { tl } = useI18nTl('RuleEngine')
    const { docMap } = useDocLink()
    const { createDefaultResourceOptsForm } = useResourceOpt()
    const { createSSLForm } = useSSL()
    const createHttpBridgeDefaultVal = (): HTTPBridge =>
      ({
        name: '',
        method: 'post',
        url: 'http://',
        headers: {
          'content-type': 'application/json',
        },
        body: '',
        pool_size: 4,
        enable_pipelining: 100,
        connect_timeout: '5s',
        request_timeout: '5s',
        max_retries: 3,
        resource_opts: createDefaultResourceOptsForm({ inflight: true }),
        ssl: createSSLForm(),
      } as HTTPBridge)

    let modelValueCache = ''
    const httpBridgeVal: Ref<HTTPBridge> = ref(createHttpBridgeDefaultVal())

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
      if (props.edit || props.copy) {
        httpBridgeVal.value = { ..._.cloneDeep(createHttpBridgeDefaultVal()), ...props.modelValue }
      }
    }

    const updateModelValue = (val: HTTPBridge) => {
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

    initHttpBridgeVal()

    return {
      tl,
      createRandomString,
      formCom,
      formRules,
      httpBridgeVal,
      docMap,
      validate,
      clearValidate,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/style/rule.scss';
.payload-desc {
  margin-top: 4px;
  margin-bottom: 0;
  color: var(--el-text-color-secondary);
}
.monaco-container {
  margin-top: 12px;
  height: 200px;
}
</style>
