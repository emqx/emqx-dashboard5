<template>
  <div class="settings app-wrapper">
    <el-card class="config-card">
      <el-form class="schema-form" :model="record" label-position="top">
        <el-row class="settings-form">
          <el-col :span="16">
            <el-form-item :label="tl('language')" prop="lang">
              <p class="item-desc">{{ tl('languageTip') }}</p>
              <el-select v-model="record.lang">
                <el-option
                  v-for="lang in langOption"
                  :key="lang.value"
                  :value="lang.value"
                  :label="lang.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item :label="tl('syncOsTheme')">
              <p class="item-desc">{{ tl('syncOsThemeTip') }}</p>
              <el-switch v-model="record.syncOsTheme"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item :label="tl('theme')" prop="theme">
              <p class="item-desc">{{ tl('themeTip') }}</p>
              <el-select v-model="record.theme" :disabled="record.syncOsTheme">
                <el-option
                  v-for="theme in themeOption"
                  :key="theme.value"
                  :value="theme.value"
                  :label="theme.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-button type="primary" @click="handleSave">
              {{ $t('Base.apply') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Settings',
})
</script>

<script lang="ts" setup>
const record = reactive({
  lang: 'en',
  theme: 'light',
  syncOsTheme: false,
})
const store = useStore()
record.lang = store.state.lang
record.theme = store.state.theme
record.syncOsTheme = store.state.syncOsTheme

const { tl } = useI18nTl('Settings')
const langOption = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'zh',
    label: '简体中文',
  },
]
const themeOption = [
  {
    value: 'light',
    label: tl('light'),
  },
  {
    value: 'dark',
    label: tl('dark'),
  },
]
const handleSave = () => {
  store.dispatch('UPDATE_SETTINGS', record)
}
</script>

<style lang="scss">
.settings {
  .settings-form {
    [class*='el-col-'] {
      padding: 0;
    }
    .el-col-16 {
      max-width: 51%;
    }
    .el-form-item {
      margin: 12px 0;
    }
    .el-button {
      margin: 24px 0 0 18px;
    }
  }
}
</style>
