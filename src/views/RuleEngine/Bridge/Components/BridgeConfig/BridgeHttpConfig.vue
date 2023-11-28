<template>
  <el-form
    class="bridge-config"
    ref="formCom"
    label-position="top"
    require-asterisk-position="right"
    :rules="formRules"
    :model="httpBridgeVal"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template v-if="!hideName">
      <el-row :gutter="26">
        <el-col :span="colSpan">
          <CustomFormItem :label="tl('name')" required prop="name" :readonly="readonly">
            <InputSelect
              v-if="isCreateBridgeInFlow"
              v-model="httpBridgeVal.name"
              :options="nameOptions"
              @change="handleNameChange"
            />
            <el-input v-else v-model="httpBridgeVal.name" :disabled="edit" />
          </CustomFormItem>
        </el-col>
      </el-row>
      <el-divider />
    </template>
    <el-row :gutter="26">
      <el-col :span="colSpan">
        <el-form-item :label="tl('method')" required prop="method">
          <el-select v-model="httpBridgeVal.method" v-if="!readonly">
            <el-option
              v-for="item in ['post', 'get', 'put', 'delete']"
              :value="item"
              :label="String(item).toUpperCase()"
              :key="item"
            />
          </el-select>
          <p class="value" v-else>{{ httpBridgeVal.method.toUpperCase() }}</p>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem :label="'URL'" required prop="url" :readonly="readonly">
          <template #label>
            <label>URL</label>
            <InfoTooltip :content="tl('httpBridgeURLFieldDesc')" />
          </template>
          <el-input v-model="httpBridgeVal.url" />
        </CustomFormItem>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item :label="tl('headers')">
          <key-and-value-editor
            v-model="httpBridgeVal.headers"
            class="kv-editor"
            :fixed-keys="readonly"
            :readonly="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <CommonTLSConfig
      class="tls-config-form"
      v-model="httpBridgeVal.ssl"
      :readonly="readonly"
      :is-edit="edit || copy"
    />
    <el-divider />
    <el-row :gutter="26">
      <el-col :span="24">
        <el-form-item>
          <template #label>
            <FormItemLabel
              :label="tl('body')"
              :desc="
                colSpan === 12 ? tl('payloadExample') : tl('payloadExample') + tl('payloadDesc')
              "
            />
            <p v-if="colSpan === 12" class="payload-desc">{{ tl('payloadDesc') }}</p>
          </template>
          <div class="monaco-container">
            <Monaco
              v-model="httpBridgeVal.body"
              lang="json"
              json-without-validate
              :disabled="readonly"
              :id="createRandomString()"
            />
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <AdvancedSettingContainer>
      <el-row :gutter="26">
        <el-col :span="colSpan">
          <CustomFormItem :label="tl('poolType')" prop="pool_type" :readonly="readonly">
            <el-select v-model="httpBridgeVal.pool_type">
              <el-option
                v-for="item in ['random', 'hash']"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem prop="pool_size" :readonly="readonly" :label="tl('connectionPoolSize')">
            <el-input v-model.number="httpBridgeVal.pool_size" />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem :label="tl('connTimeout')" :readonly="readonly">
            <TimeInputWithUnitSelect
              v-model="httpBridgeVal.connect_timeout"
              :enabled-units="['s']"
            />
          </CustomFormItem>
        </el-col>
        <el-col :span="colSpan">
          <CustomFormItem :label="tl('httpPipeline')" :readonly="readonly">
            <CustomInputNumber v-model="httpBridgeVal.enable_pipelining" />
          </CustomFormItem>
        </el-col>
        <BridgeResourceOpt
          v-model="httpBridgeVal.resource_opts"
          :with-request-timeout-config="true"
          :col-span="colSpan"
          :readonly="readonly"
        />
      </el-row>
    </AdvancedSettingContainer>
  </el-form>
</template>

<script lang="ts">
import { createRandomString, fillEmptyValueToUndefinedField, waitAMoment } from '@/common/tools'
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'
import CustomFormItem from '@/components/CustomFormItem.vue'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import InputSelect from '@/components/InputSelect.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import Monaco from '@/components/Monaco.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useReuseBridgeInFlow from '@/hooks/Flow/useReuseBridgeInFlow'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import useDocLink from '@/hooks/useDocLink'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { BridgeItem, HTTPBridge } from '@/types/rule'
import { cloneDeep } from 'lodash'
import { PropType, Ref, computed, defineComponent, onMounted, ref, watch } from 'vue'
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
    FormItemLabel,
    CustomFormItem,
    InputSelect,
    AdvancedSettingContainer,
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
    /**
     * readonly and disabled are both for viewing data are used in different places
     */
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * for rule
     */
    hideName: {
      type: Boolean,
      default: false,
    },
    isUsingInFlow: {
      type: Boolean,
      default: false,
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
      pool_size: [...createIntFieldRule(1)],
    })

    const colSpan = computed(() => (props.isUsingInFlow ? 24 : 12))

    const { isCreateBridgeInFlow, isBridgeSelected, getBridgesInSameType, handleNameChange } =
      useReuseBridgeInFlow(BridgeType.Webhook, props, httpBridgeVal)
    const nameOptions = computed(() => getBridgesInSameType().map(({ name }) => name))
    const initRecord = cloneDeep(httpBridgeVal.value)
    watch(isBridgeSelected, async (nVal, oVal) => {
      if (!nVal && oVal) {
        const name = httpBridgeVal.value.name
        httpBridgeVal.value = Object.assign(cloneDeep(initRecord), { name })
        await waitAMoment()
        formCom.value?.clearValidate?.()
      }
    })

    const initHttpBridgeVal = () => {
      if (props.edit || props.copy) {
        const defaultValue = { ...createRawHTTPForm(), headers: {} }
        httpBridgeVal.value = fillEmptyValueToUndefinedField(
          cloneDeep(props.modelValue),
          defaultValue,
        ) as HTTPBridge
        context.emit('init', httpBridgeVal.value)
      } else {
        httpBridgeVal.value = { ...httpBridgeVal.value, ...props.modelValue }
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
      colSpan,
      formRules,
      httpBridgeVal,
      isCreateBridgeInFlow,
      handleNameChange,
      nameOptions,
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
