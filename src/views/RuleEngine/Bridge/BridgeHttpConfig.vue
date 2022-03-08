<template>
  <div class="bridge-config">
    <el-form label-position="top" :disabled="!edit">
      <div class="part-header">{{ tl('baseInfo') }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('name')">
            <el-input v-model="httpBridgeVal.name" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl('mappingInfo') }}</div>
      <p class="block-desc">{{ tl('mappingDesc') }}</p>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('localTopic')">
            <el-input v-model="httpBridgeVal.local_topic" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl('reqSetting') }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('method')">
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
          <el-form-item :label="'URL'">
            <el-input v-model="httpBridgeVal.url"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">Headers</div>
      <el-row>
        <el-col>
          <key-and-value-editor
            v-model="httpBridgeVal.headers"
            class="kv-editor"
          ></key-and-value-editor>
        </el-col>
      </el-row>
      <div class="part-header">Body</div>
      <el-row :gutter="30">
        <!-- <monaco
          id="bridge-body"
          lang="json"
          v-model:value="httpBridgeVal.body"
          class="editor"
        ></monaco> -->
        <el-col :span="24">
          <el-input
            type="textarea"
            rows="10"
            style="margin-top: 20px"
            v-model="httpBridgeVal.body"
          ></el-input>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl('connSetting') }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="'Pool Size'">
            <el-input v-model="httpBridgeVal.pool_size"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('enablePipeline')">
            <el-select v-model="httpBridgeVal.enable_pipelining">
              <el-option v-for="ep in [true, false]" :key="ep" :value="ep"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('connTimeout')">
            <el-input v-model.number="httpBridgeVal.connect_timeout[0]">
              <template #append>
                <el-select v-model="httpBridgeVal.connect_timeout[1]">
                  <el-option value="s"></el-option>
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
                  <el-option value="s"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('errRetry')">
            <el-input v-model="httpBridgeVal.max_retries"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl('tlsConfig') }}</div>

      <TLS-config class="tls-config-form" v-model="tlsParams"></TLS-config>
    </el-form>
  </div>
</template>

<script lang="ts">
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import { useI18n } from 'vue-i18n'
import { computed, defineComponent, ref, Ref, reactive, watch, onMounted } from 'vue'
import TLSConfig from '../components/TLSConfig.vue'
// import { tlsConfig } from "@/types/ruleengine";
import _ from 'lodash'
import Monaco from '@/components/Monaco.vue'
import { transformUnitArrayToStr, transformStrToUnitArray } from '@/common/utils'
import { HTTPBridge } from '@/types/rule'

type HTTPFormData = Omit<HTTPBridge, 'connect_timeout' | 'request_timeout'> & {
  connect_timeout: [number, string]
  request_timeout: [number, string]
}

export default defineComponent({
  components: {
    KeyAndValueEditor,
    TLSConfig,
    // Monaco
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
    edit: {
      type: Boolean,
      required: false,
      default: () => true,
    },
  },
  setup(props, context) {
    const { t } = useI18n()
    // const tlsParams: Ref<tlsConfig> = ref({
    //   enable: false,
    //   verify: false,
    //   certfile: "",
    //   keyfile: "",
    //   cacertfile: "",
    // });
    const httpBridgeDefaultVal = {
      name: '',
      local_topic: '',
      method: 'post',
      url: 'http://localhost:8080/api',
      headers: {
        'content-type': 'application/json',
      },
      body: '',
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
      tl: (key: string) => t('RuleEngine.' + key),
      tlsParams,
      httpBridgeVal,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/style/rule.scss';
.tls-config-form {
  margin-top: 20px;
}
.kv-editor {
  margin-top: 20px;
}
.editor {
  border: var(--el-border-base);
  flex-grow: 1;
  height: 200px;
  margin-top: 20px;
}
</style>
