<template>
  <div class="settings-dropdown">
    <el-form class="configuration-form" label-position="top" :model="record">
      <el-form-item prop="lang">
        <template #label>
          <FormItemLabel :label="tl('language')" :desc="tl('languageTip')" />
        </template>
        <el-select v-model="record.lang" @click.stop @change="handleLangChange">
          <el-option
            v-for="lang in langOption"
            :key="lang.value"
            :value="lang.value"
            :label="lang.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="themeMode">
        <template #label>
          <FormItemLabel :label="tl('theme')" :desc="tl('themeTip')" />
        </template>
        <div class="theme-selector">
          <el-radio-group v-model="record.themeMode" size="small" @change="handleThemeChange">
            <el-radio-button value="light">
              <el-icon><Sunny /></el-icon>
            </el-radio-button>
            <el-radio-button value="dark">
              <el-icon><Moon /></el-icon>
            </el-radio-button>
            <el-radio-button value="os">
              <el-icon><Monitor /></el-icon>
            </el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item prop="enableSQLAI">
        <template #label>
          <FormItemLabel :label="tl('enableSQLAI')" :desc="tl('enableSQLAITip')" />
        </template>
        <el-switch v-model="record.enableSQLAI" @change="handleAIChange" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'Settings',
})
</script>

<script lang="ts" setup>
import { Sunny, Moon, Monitor } from '@element-plus/icons-vue'

const record = reactive({
  lang: 'en',
  themeMode: 'os',
  enableSQLAI: true,
})

const store = useStore()
record.lang = store.state.lang
record.enableSQLAI = store.state.enableSQLAI
if ('syncOsTheme' in store.state) {
  record.themeMode = store.state.syncOsTheme ? 'os' : store.state.theme
}

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

const saveSetting = async () => {
  const settings = {
    lang: record.lang,
    syncOsTheme: record.themeMode === 'os',
    theme: record.themeMode === 'os' ? store.state.theme : record.themeMode,
    enableSQLAI: record.enableSQLAI,
  }
  await store.dispatch('UPDATE_SETTINGS', settings)
}

const handleLangChange = async () => {
  await saveSetting()
}

const handleThemeChange = async () => {
  await saveSetting()
}

const handleAIChange = async () => {
  await saveSetting()
}
</script>

<style lang="scss">
.settings-dropdown {
  min-width: 240px;
  padding: 12px;

  .el-form-item {
    margin-bottom: 16px;
  }

  .el-select {
    width: 100%;
  }

  .theme-selector {
    .el-radio-group {
      display: flex;
      width: 100%;
      height: 32px;

      .el-radio-button {
        flex: 1;

        .el-radio-button__inner {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;

          .el-icon {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
