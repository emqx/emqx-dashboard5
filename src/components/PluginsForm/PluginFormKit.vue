<template>
  <el-form
    ref="PluginForm"
    class="plugin-form-kit"
    :rules="rules"
    :model="configsForm"
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
        <el-button type="primary" @click="save" :loading="saveLoading">
          {{ $t('Base.saveChanges') }}
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { PluginUIConfigs } from '@/types/plugin'
import PluginFormKitItem from './PluginFormKitItem.vue'
import usePluginGenFormRules from '@/hooks/Plugins/useGenPluginFormRules'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

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

const configsForm = ref(_.cloneDeep(props.data))

const saveLoading = ref(false)

const { t } = useI18n()

const { rules } = usePluginGenFormRules({
  formConfigs: props.layouts.$form,
})

watch(
  () => props.data,
  (val) => {
    nextTick(() => {
      configsForm.value = _.cloneDeep(val)
    })
  },
  { deep: true },
)

async function save() {
  try {
    saveLoading.value = true
    const valid = await PluginForm.value.validate()
    if (!valid) {
      return
    }
    await props.saveFunc(configsForm.value)
    ElMessage.success(t('Base.updateSuccess'))
    emit('saved', configsForm.value)
  } catch (error) {
    //
  } finally {
    saveLoading.value = false
  }
}
</script>
