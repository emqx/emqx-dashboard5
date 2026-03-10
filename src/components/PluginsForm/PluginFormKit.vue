<template>
  <el-form
    ref="PluginForm"
    class="plugin-form-kit"
    :rules="rules"
    :model="configsForm"
    scroll-to-error
    :scroll-into-view-options="{ behavior: 'smooth' }"
    label-position="top"
  >
    <el-row :gutter="20">
      <plugin-form-kit-item
        v-for="(configs, name) in layouts.$form"
        v-model="configsForm[name]"
        :key="name"
        :name="name as string"
        :form-configs="configs"
      />
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-button
          type="primary"
          @click="save"
          :loading="saveLoading"
          :disabled="!$hasPermission('put')"
        >
          {{ $t('Base.saveChanges') }}
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { PluginUIConfigs } from '@/types/plugin'
import PluginFormKitItem from './PluginFormKitItem.vue'

const props = defineProps({
  data: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  layouts: {
    type: Object as PropType<PluginUIConfigs>,
    default: null,
  },
  // async function
  saveFunc: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['saved'])

const PluginForm = ref()

const configsForm = ref(cloneDeep(props.data))

const saveLoading = ref(false)

const { t } = useI18n()

const { rules } = useGenPluginFormRules({
  formConfigs: props.layouts.$form,
})

// Provide failed field paths so map-records-editor can expand only entries with errors
const validationFailedFields = ref<Record<string, any>>({})
provide('pluginFormValidationFailed', validationFailedFields)

watch(
  () => props.data,
  (val) => {
    nextTick(() => {
      configsForm.value = cloneDeep(val)
    })
  },
  { deep: true },
)

async function save() {
  try {
    saveLoading.value = true
    await PluginForm.value.validate()
    await props.saveFunc(configsForm.value)
    ElMessage.success(t('Base.updateSuccess'))
    emit('saved', configsForm.value)
  } catch (error: any) {
    // el-form validate() rejects with { [fieldProp]: rules[] } on validation failure
    validationFailedFields.value =
      error && typeof error === 'object' && !(error instanceof Error) ? error : {}
  } finally {
    saveLoading.value = false
  }
}
</script>
