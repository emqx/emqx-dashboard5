<template>
  <el-form
    ref="PluginForm"
    class="plugin-form-kit"
    :rules="rules"
    :model="validationModel"
    :disabled="saveLoading"
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
        @password-edited="editedPasswords.add($event)"
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
import { createPluginPasswordForm } from '@/hooks/Plugins/pluginPasswordForm'

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

const passwordForm = shallowRef(createPluginPasswordForm(props.data, props.layouts.$form))
const configsForm = ref(passwordForm.value.values)
const editedPasswords = ref(new Set<string>())
// Validate the actual values, so a six-character mask cannot fail password rules.
const validationModel = computed(() =>
  passwordForm.value.restore(configsForm.value, editedPasswords.value),
)

const resetForm = (data: Record<string, any>) => {
  passwordForm.value = createPluginPasswordForm(data, props.layouts.$form)
  configsForm.value = passwordForm.value.values
  editedPasswords.value = new Set()
}

const saveLoading = ref(false)

const { t } = useI18n()

const { rules } = useGenPluginFormRules({
  formConfigs: props.layouts.$form,
})

watch(
  () => [props.data, props.layouts],
  () => resetForm(props.data),
  { deep: true },
)

async function save() {
  try {
    saveLoading.value = true
    const valid = await PluginForm.value.validate()
    if (!valid) {
      return
    }
    const data = passwordForm.value.restore(configsForm.value, editedPasswords.value)
    await props.saveFunc(data)
    resetForm(data)
    ElMessage.success(t('Base.updateSuccess'))
    emit('saved', configsForm.value)
  } catch (error) {
    //
  } finally {
    saveLoading.value = false
  }
}
</script>
