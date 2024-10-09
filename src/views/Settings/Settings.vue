<template>
  <el-drawer
    :title="$t('components.settings')"
    v-model="showDrawer"
    size="350px"
    destroy-on-close
    class="settings"
  >
    <el-form
      class="configuration-form"
      label-position="top"
      require-asterisk-position="left"
      :model="record"
    >
      <el-row class="settings-form">
        <el-col :span="24">
          <el-form-item prop="lang">
            <template #label>
              <FormItemLabel :label="tl('language')" :desc="tl('languageTip')" />
            </template>
            <el-select v-model="record.lang">
              <el-option
                v-for="lang in langOption"
                :key="lang.value"
                :value="lang.value"
                :label="lang.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <template #label>
              <FormItemLabel :label="tl('syncOsTheme')" :desc="tl('syncOsThemeTip')" />
            </template>
            <el-switch v-model="record.syncOsTheme" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="theme">
            <template #label>
              <FormItemLabel :label="tl('theme')" :desc="tl('themeTip')" />
            </template>
            <el-select v-model="record.theme" :disabled="record.syncOsTheme">
              <el-option
                v-for="theme in themeOption"
                :key="theme.value"
                :value="theme.value"
                :label="theme.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="!IS_ENTERPRISE" :span="24">
          <el-form-item>
            <template #label>
              <FormItemLabel
                :label="$t('BasicConfig.enableTelemetry')"
                :desc="$t('BasicConfig.telemetryTip')"
                desc-marked
              />
            </template>
            <el-switch v-model="record.enable" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" :loading="saveLoading" @click="handleSave">
        {{ $t('Base.apply') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts">
import type { WritableComputedRef } from 'vue'
import { computed, defineComponent, reactive, ref } from 'vue'

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
import FormItemLabel from '@/components/FormItemLabel.vue'
import { IS_ENTERPRISE } from '@/common/constants'

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
const props = defineProps({
  modelValue: {
    type: Boolean,
  },
})
const emit = defineEmits(['update:modelValue'])
const showDrawer: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
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
  if (IS_ENTERPRISE) {
    return
  }
  const res = await getTeleStatus()
  if (res) {
    record.enable = res.enable
    teleConfigs.value = res
  }
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
    if (!IS_ENTERPRISE) {
      await updateTeleStatus(data)
    }
    ElMessage.success(t('Base.updateSuccess'))
    loadData()
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
  .el-form-item {
    margin-bottom: 24px;
  }
}
</style>
