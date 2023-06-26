<template>
  <div class="bridge-config">
    <el-form
      ref="formCom"
      label-position="top"
      require-asterisk-position="right"
      :rules="formRules"
      :model="httpBridgeVal"
    >
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
          <el-form-item :label="tl('connectionPoolSize')" required prop="pool_size">
            <el-input v-model.number="httpBridgeVal.pool_size" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('poolType')" prop="pool_type">
            <el-select v-model="httpBridgeVal.pool_type">
              <el-option
                v-for="item in ['random', 'hash']"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('connTimeout')">
            <TimeInputWithUnitSelect
              v-model="httpBridgeVal.connect_timeout"
              :enabled-units="['s']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('httpPipeline')">
            <CustomInputNumber
              v-model="httpBridgeVal.enable_pipelining"
              controls-position="right"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <CommonTLSConfig
        class="tls-config-form"
        v-model="httpBridgeVal.ssl"
        :is-edit="edit || copy"
      />
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
        <BridgeResourceOpt
          v-model="httpBridgeVal.resource_opts"
          :with-request-timeout-config="true"
        />
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { createRandomString, fillEmptyValueToUndefinedField } from '@/common/tools'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import Monaco from '@/components/Monaco.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import useDocLink from '@/hooks/useDocLink'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeItem, HTTPBridge } from '@/types/rule'
import { cloneDeep } from 'lodash'
import { PropType, Ref, defineComponent, onMounted, ref, watch } from 'vue'
import BridgeResourceOpt from './BridgeResourceOpt.vue'

export default defineComponent({
  components: {
    KeyAndValueEditor,
    Monaco,
    InfoTooltip,
    CommonTLSConfig,
    TimeInputWithUnitSelect,
    BridgeResourceOpt,
    CustomInputNumber,
  },
  name: '',
  props: {
    modelValue: {
      type: Object as PropType<HTTPBridge | BridgeItem>,
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
    const { createRawHTTPForm } = useBridgeFormCreator()

    let modelValueCache = ''
    const httpBridgeVal: Ref<HTTPBridge> = ref(createRawHTTPForm())

    const { createRequiredRule, createIntFieldRule, createCommonIdRule } = useFormRules()
    const formCom = ref()
    const formRules = ref({
      name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
      method: createRequiredRule(tl('method'), 'select'),
      url: createRequiredRule('URL'),
      pool_size: [...createRequiredRule(tl('connectionPoolSize')), ...createIntFieldRule(1)],
    })

    const initHttpBridgeVal = () => {
      if (props.edit || props.copy) {
        const defaultValue = { ...createRawHTTPForm(), headers: {} }
        httpBridgeVal.value = fillEmptyValueToUndefinedField(
          cloneDeep(props.modelValue),
          defaultValue,
        ) as HTTPBridge
        context.emit('init', httpBridgeVal.value)
      }
    }

    const updateModelValue = (value: HTTPBridge) => {
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
      () => cloneDeep(httpBridgeVal.value),
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
