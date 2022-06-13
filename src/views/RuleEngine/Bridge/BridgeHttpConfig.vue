<template>
  <div class="bridge-config">
    <el-form
      ref="formCom"
      label-position="top"
      :disabled="disabled"
      :rules="formRules"
      :model="httpBridgeVal"
    >
      <div>
        <el-row :gutter="26">
          <el-col :span="12">
            <el-form-item :label="tl('name')" required prop="name">
              <el-input v-model="httpBridgeVal.name" :disabled="edit" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="26">
        <el-col :span="12">
          <el-form-item :label="tl('bridgeUsage')">
            <el-select v-model="isForwardFromLocalTopic" :disabled="edit">
              <el-option
                v-for="item in [
                  { label: tl('iotAndLocalTopic'), value: true },
                  { label: tl('justIot'), value: false },
                ]"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isForwardFromLocalTopic" :span="12">
          <el-form-item :label="tl('localTopic')" prop="local_topic">
            <el-input v-model="httpBridgeVal.local_topic" placeholder="t/#" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <p class="block-desc">
            {{
              isForwardFromLocalTopic
                ? tl('bridgeSinkForwardFromLocalTopicDesc')
                : tl('bridgeSinkNotForwardFromLocalTopicDesc')
            }}
          </p>
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
        <el-col :span="24">
          <el-form-item>
            <template #label>
              <label>{{ tl('body') }}</label>
              <i18n-t class="payload-desc" keypath="RuleEngine.payloadDesc" tag="p">
                <a :href="docMap.home" target="_blank">{{ tl('payloadTempSyntax') }}</a>
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
      <CommonTLSConfig class="tls-config-form" v-model="tlsParams" :is-edit="edit" />
    </el-form>
  </div>
</template>

<script lang="ts">
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import { computed, defineComponent, ref, watch, onMounted, Ref } from 'vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import _ from 'lodash'
import { transformUnitArrayToStr } from '@/common/utils'
import { HTTPBridge } from '@/types/rule'
import Monaco from '@/components/Monaco.vue'
import { createRandomString } from '@/common/tools'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useDocLink from '@/hooks/useDocLink'
import InputWithUnit from '@/components/InputWithUnit.vue'

export default defineComponent({
  components: {
    KeyAndValueEditor,
    Monaco,
    InfoTooltip,
    CommonTLSConfig,
    InputWithUnit,
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
    const { docMap } = useDocLink()
    const httpBridgeDefaultVal: HTTPBridge = {
      name: '',
      local_topic: '',
      method: 'post',
      url: 'http://',
      headers: {
        'content-type': 'application/json',
      },
      body: '${payload}',
      pool_size: 4,
      enable_pipelining: 100,
      connect_timeout: '5s',
      request_timeout: '5s',
      max_retries: 3,
    } as HTTPBridge
    const isForwardFromLocalTopic: Ref<boolean> = ref(true)

    let modelValueCache = ''
    const httpBridgeVal: Ref<HTTPBridge> = ref(_.cloneDeep(httpBridgeDefaultVal))

    const tlsParams = computed(() => props.tls)

    const { createRequiredRule, createIntFieldRule } = useFormRules()
    const formCom = ref()
    const formRules = ref({
      name: createRequiredRule(tl('name')),
      local_topic: createRequiredRule(tl('localTopic')),
      method: createRequiredRule(tl('method'), 'select'),
      url: createRequiredRule('URL'),
      pool_size: [...createRequiredRule('Pool size'), ...createIntFieldRule(1)],
      max_retries: [...createRequiredRule(tl('errRetry')), ...createIntFieldRule(1)],
    })

    const initHttpBridgeVal = () => {
      if (props.modelValue.local_topic === undefined) {
        isForwardFromLocalTopic.value = false
      }
      httpBridgeVal.value = { ..._.cloneDeep(httpBridgeDefaultVal), ...props.modelValue }
      if (!isForwardFromLocalTopic.value) {
        handleIsForwardToLocalTopicChangedInSinkType()
      }
    }

    const handleIsForwardToLocalTopicChangedInSinkType = () => {
      if (!isForwardFromLocalTopic.value) {
        httpBridgeVal.value = _.omit(httpBridgeVal.value, 'local_topic') as any
      } else {
        httpBridgeVal.value = {
          ...httpBridgeVal.value,
          local_topic: httpBridgeDefaultVal.local_topic,
        }
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
      tlsParams,
      httpBridgeVal,
      docMap,
      isForwardFromLocalTopic,
      handleIsForwardToLocalTopicChangedInSinkType,
      validate,
      clearValidate,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/style/rule.scss';
.tls-config-form {
  :deep(.TLS-base-config) {
    .TLS-base-config-title {
      font-size: 14px;
      font-weight: normal;
    }
  }
  :deep(.TLS-enable-config) {
    .TLS-input {
      width: 100%;
    }
  }
}

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
