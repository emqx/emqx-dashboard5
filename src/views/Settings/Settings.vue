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
            <el-button type="primary" :loading="saveLoading" @click="handleSave">
              {{ $t('Base.apply') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  name: 'Settings',
})
</script>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import useI18nTl from '@/hooks/useI18nTl'
import { getTeleStatus, updateTeleStatus } from '@/api/config'
import { useI18n } from 'vue-i18n'
import { TeleStatus } from '@/types/config'

const record = reactive({
  lang: 'en',
  theme: 'dark',
  syncOsTheme: false,
  enable: false,
})
const teleConfigs = ref<TeleStatus>({
  enable: true,
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
const saveLoading = ref(false)
const { t } = useI18n()
const loadData = async () => {
  const res = await getTeleStatus()
  if (res) {
    record.enable = res.enable
    teleConfigs.value = res
  }
}
const reloading = () => {
  loadData()
}
loadData()
const handleSave = async () => {
  saveLoading.value = true
  const data = {
    enable: record.enable,
  }
  try {
    if (teleConfigs.value.enable === record.enable) {
      saveLoading.value = false
      return
    }
    await updateTeleStatus(data)
    ElMessage.success(t('Base.updateSuccess'))
    reloading()
  } catch (error) {
    // ignore error
  } finally {
    store.dispatch('UPDATE_SETTINGS', record)
    saveLoading.value = false
  }
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
