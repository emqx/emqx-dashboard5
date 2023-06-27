<template>
  <el-form
    ref="FormCom"
    label-width="180px"
    class="webhook-form"
    hide-required-asterisk
    :rules="rules"
    :model="formData"
  >
    <el-form-item prop="name" :label="tl('name')">
      <el-input v-model="formData.name" :disabled="isEdit" />
    </el-form-item>
    <el-form-item prop="rule.description" :label="tl('note')">
      <el-input v-model="formData.rule.description" />
    </el-form-item>
    <el-form-item prop="rule.sql" :label="tl('trigger')" class="item-trigger">
      <Trigger ref="TriggerCom" v-model="formData.rule.sql" />
    </el-form-item>
    <el-form-item :label="tl('method')" prop="bridge.method">
      <el-select v-model="formData.bridge.method">
        <el-option
          v-for="item in ['post', 'get', 'put', 'delete']"
          :value="item"
          :label="String(item).toUpperCase()"
          :key="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="'URL'" prop="bridge.url">
      <template #label>
        <label>URL</label>
        <InfoTooltip :content="tl('httpBridgeURLFieldDesc')" />
      </template>
      <el-input v-model="formData.bridge.url" />
      <el-button
        link
        class="btn-test"
        type="primary"
        :loading="isTesting"
        @click="testConnectivity"
      >
        {{ tl('testConnectivity') }}
      </el-button>
    </el-form-item>
    <el-form-item :label="tl('headers')" class="item-headers">
      <KeyAndValueEditor v-model="formData.bridge.headers" type="list" />
    </el-form-item>
    <el-collapse-transition>
      <div v-if="isAdvancedShow">
        <BridgeResourceOpt v-model="formData.bridge.resource_opts" :col-span="24" />
        <CommonTLSConfig class="tls-config-form" v-model="formData.bridge.ssl" :is-edit="isEdit" />
        <el-form-item :label="tl('connTimeout')">
          <TimeInputWithUnitSelect
            v-model="formData.bridge.connect_timeout"
            :enabled-units="['s']"
          />
        </el-form-item>
        <el-form-item :label="tl('connectionPoolSize')" required prop="pool_size">
          <el-input v-model.number="formData.bridge.pool_size" />
        </el-form-item>
        <el-form-item :label="tl('poolType')" prop="pool_type">
          <el-select v-model="formData.bridge.pool_type">
            <el-option v-for="item in ['random', 'hash']" :key="item" :value="item" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="tl('httpPipeline')">
          <CustomInputNumber
            v-model="formData.bridge.enable_pipelining"
            controls-position="right"
          />
        </el-form-item>
      </div>
    </el-collapse-transition>

    <el-button class="btn-skip" type="primary" link @click="toggleAdvancedShow">
      {{ tl('advancedSettings') }}
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { testConnect } from '@/api/ruleengine'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useBridgeDataHandler from '@/hooks/Rule/bridge/useBridgeDataHandler'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { WebhookForm, WebhookItem } from '@/types/webhook'
import BridgeResourceOpt from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeResourceOpt.vue'
import { ElMessage } from 'element-plus'
import { omit } from 'lodash'
import {
  PropType,
  WritableComputedRef,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  ref,
} from 'vue'
import Trigger from './Trigger.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<WebhookForm | WebhookItem>,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('RuleEngine')
const FormCom = ref()
const TriggerCom = ref()

const isAdvancedShow = ref(false)
const toggleAdvancedShow = () => (isAdvancedShow.value = !isAdvancedShow.value)

const formData: WritableComputedRef<WebhookForm | WebhookItem> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { createRequiredRule, createCommonIdRule } = useFormRules()
const rules = {
  name: [...createRequiredRule(t('Base.name')), ...createCommonIdRule()],
}

const validate = () => {
  return Promise.all([FormCom.value.validate(), TriggerCom.value.validate()])
}

const isTesting = ref(false)
const { handleBridgeDataBeforeSubmit } = useBridgeDataHandler()
const testConnectivity = async () => {
  try {
    isTesting.value = true
    const data = await handleBridgeDataBeforeSubmit(formData.value.bridge)
    await testConnect(omit(data, 'id'))
    ElMessage.success(tl('connectionSuccessful'))
  } catch (error) {
    //
  } finally {
    isTesting.value = false
  }
}

defineExpose({ validate })
</script>

<style lang="scss">
.webhook-form {
  .el-form-item {
    width: 40%;
    &.item-trigger {
      width: 100%;
      .el-form-item {
        width: 100%;
      }
    }
    &.item-headers {
      width: 50%;
    }
  }
  .one-of,
  .key-and-value-editor,
  .webhook-trigger {
    width: 100%;
  }
  .btn-test {
    position: absolute;
    top: 50%;
    right: -16px;
    transform: translate(100%, -50%);
  }
}
</style>
