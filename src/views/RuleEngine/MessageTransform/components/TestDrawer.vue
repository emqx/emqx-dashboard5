<template>
  <el-drawer
    class="test-transform-drawer"
    v-model="showDrawer"
    destroy-on-close
    :title="tl('preview')"
    size="700px"
  >
    <el-form ref="FormRef" :model="formData" :rules="rules" label-position="top">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item prop="peername" :label="t('Clients.peername')">
            <el-input v-model="formData.peername" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="clientid" :label="t('Clients.clientid')">
            <el-input v-model="formData.clientid" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="username" :label="t('Clients.username')">
            <el-input v-model="formData.username" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="topic" :label="t('Clients.topic')">
            <el-input v-model="formData.topic" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="qos" label="QoS">
            <el-select v-model="formData.qos">
              <el-option v-for="item in QoSOptions" :key="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="retain" label="Retain">
            <el-switch v-model="formData.retain" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="payload" label="Payload" required>
            <div class="monaco-container">
              <Monaco
                :id="createRandomString()"
                v-model="formData.payload"
                class="payload"
                :lang="PayloadShowByType.JSON"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <AdvancedSettingContainer :button-text="tl('clientAttrsAndUserProps')">
        <el-form-item prop="user_property" :label="tl('userProperties')">
          <KeyAndValueEditor v-model="formData.user_property" />
        </el-form-item>
        <el-form-item prop="pub_props">
          <PubProps v-model="(formData as any).pub_props" path="formData.pub_props" :span="12" />
        </el-form-item>
        <el-form-item prop="client_attrs" :label="t('Clients.clientAttrs')">
          <KeyAndValueEditor v-model="formData.client_attrs" />
        </el-form-item>
      </AdvancedSettingContainer>
    </el-form>
    <el-button
      type="primary"
      :disabled="!$hasPermission('post')"
      :loading="isLoading"
      @click="submit"
    >
      {{ tl('runTheTransformation') }}
    </el-button>
    <div class="test-result" v-if="testResult">
      <div class="result-hd">
        <p class="result-title">{{ tl('transformationResult') }}</p>
        <el-tooltip effect="dark" placement="top" :content="t('Base.copy')">
          <el-button type="primary" class="btn-copy" link>
            <el-icon class="icon-copy" :size="18" @click="copyText(testResult)">
              <CopyDocument />
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <div class="monaco-container">
        <Monaco :id="createRandomString()" v-model="testResult" class="payload" lang="json" />
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { testMessageTransform } from '@/api/messageTransformation'
import { PayloadShowByType, QoSLevel } from '@/types/enum'
import { MessageTransform, TestMessageTransformData } from '@/types/typeAlias'
import { CopyDocument } from '@element-plus/icons-vue'
import { stringifyObjSafely } from '@emqx/shared-ui-utils'
import PubProps from '../../components/PubProps.vue'

const props = defineProps<{
  modelValue: boolean
  messageTransform: MessageTransform
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const isLoading = ref(false)

const { t, tl } = useI18nTl('RuleEngine')

const showDrawer: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const FormRef = ref()

const createRawFormData = () => ({
  peername: '',
  clientid: '',
  username: '',
  qos: QoSLevel.QoS0,
  retain: false,
  topic: '',
  payload: '',
  pub_props: {},
  client_attrs: {},
  user_property: {},
})
const formData = ref<TestMessageTransformData['message']>(createRawFormData())

const testResult = ref<string | undefined>(undefined)

watch(showDrawer, (val) => {
  if (!val) {
    testResult.value = undefined
    formData.value = createRawFormData()
  }
})

const { createRequiredRule } = useFormRules()
const rules = {
  topic: createRequiredRule(t('Clients.topic')),
  payload: createRequiredRule('Payload'),
}

const { copyText } = useCopy()

const { handleDataBeforeSubmit } = handleTransformData()

const submit = async () => {
  try {
    isLoading.value = true
    await customValidate(FormRef.value)
    const ret = await testMessageTransform({
      message: checkNOmitFromObj(formData.value),
      transformation: handleDataBeforeSubmit(props.messageTransform),
    } as any)
    testResult.value = stringifyObjSafely(ret, 2)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss">
.test-transform-drawer {
  .monaco-container {
    height: 160px;
  }
  .test-result {
    margin-top: 24px;
  }
  .test-result {
    .result-hd {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
  }
}
</style>
