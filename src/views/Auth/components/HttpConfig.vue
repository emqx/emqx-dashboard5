<template>
  <div class="http-config config">
    <div class="create-form-title">HTTP</div>
    <el-form class="create-form" label-position="top">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('Auth.method')">
            <el-select v-model="httpConfig.method">
              <el-option value="get" label="GET"></el-option>
              <el-option value="post" label="POST"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="URL">
            <el-input v-model="httpConfig.url"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Headers">
            <key-and-value-editor v-model="httpConfig.headers"></key-and-value-editor>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="create-form-title">
      {{ $t('Auth.connectConfig') }}
    </div>
    <el-form class="create-form" label-position="top">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Pool size">
            <el-input v-model.number="httpConfig.pool_size"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Auth.connectTimeout')">
            <time-input-with-unit-select v-model="httpConfig.connect_timeout" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Auth.enablePipelining')">
            <el-select v-model="httpConfig.enable_pipelining">
              <el-option :value="true" label="True"></el-option>
              <el-option :value="false" label="False"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- TLS -->
    <TLS-config v-model="httpConfig.ssl"></TLS-config>
    <div class="create-form-title">
      {{ authType === 'authn' ? $t('Auth.authnConfig') : $t('Auth.authzConfig') }}
      <el-button class="help-btn" size="small" @click="toggleNeedHelp">
        {{ $t('Base.help') }}
      </el-button>
    </div>
    <el-form class="create-form" label-position="top">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('Auth.requestTimeout')">
            <time-input-with-unit-select v-model="httpConfig.request_timeout" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Body">
            <div class="viewer-container" ref="monacoContainer">
              <monaco id="acl-file-editor" v-model="httpConfig.body" lang="json"></monaco>
            </div>
            <el-button class="bottom-btn" size="small" @click="setDefaultContent">
              {{ $t('Auth.setDefault') }}
            </el-button>
          </el-form-item>
        </el-col>
        <el-collapse-transition>
          <el-col v-if="needHelp" :span="24">
            <div class="help-block">
              <div class="create-form-title">
                {{ $t('Auth.exampleDataCmd') }}
              </div>
              <code-view lang="javascript" :code="helpContent"></code-view>
              <el-button @click="copyText(helpContent)">
                {{ $t('Base.copy') }}
              </el-button>
            </div>
          </el-col>
        </el-collapse-transition>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import CodeView from '@/components/CodeView.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import TLSConfig from './TLSConfig.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import useCopy from '@/hooks/useCopy'
import Monaco from '@/components/Monaco.vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'HttpConfig',
  components: {
    KeyAndValueEditor,
    CodeView,
    TLSConfig,
    TimeInputWithUnitSelect,
    Monaco,
  },

  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    authType: {
      required: true,
      type: String,
    },
  },
  setup(props, ctx) {
    const route = useRoute()
    const defaultContent = JSON.stringify(
      {
        username: '${username}',
        password: '${password}',
      },
      null,
      2,
    )
    const httpConfig = reactive(props.modelValue)
    watch(httpConfig, (value) => {
      ctx.emit('update:modelValue', value)
    })
    const needHelp = ref(false)
    const helpContent = `
      const express = require('express')
      const app = express()
      app.use(express.json())

      app.post('/login', (req, res) {
        let data = {
          // @enum = success, failed, ignore
          result: 'failed',
          // enable and set superuser
          // is_superuser: true,
        }
        const { username, password } = req.body
        if (['admin', 'guest'].includes(username) && password === 'public') {
          data.result = 'success'
          if (username === 'admin') {
            data.is_superuser = true
          }
        } else if (username === '') {
          data.result = 'ignored'
        } else {
          data.result = 'failed'
        }
        // response with JSON
        res.json(data)
      })
    `
    const id = computed(function () {
      const { id, type } = route.params
      return id || type
    })
    if (id.value) {
      const { body } = httpConfig
      httpConfig.body = JSON.stringify(body, null, 2)
    }
    const { copySuccess, copyText } = useCopy(() => {
      needHelp.value = false
    })
    const toggleNeedHelp = async () => {
      needHelp.value = !needHelp.value
    }
    const setDefaultContent = () => {
      httpConfig.body = defaultContent
    }
    return {
      helpContent,
      httpConfig,
      needHelp,
      toggleNeedHelp,
      copyText,
      copySuccess,
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
