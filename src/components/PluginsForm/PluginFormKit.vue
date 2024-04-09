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
        :name="(name as string)"
        :form-configs="configs"
      />
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-button type="primary" @click="save">
          {{ $t('Base.saveChanges') }}
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { PropType, defineProps, defineEmits, ref, watch } from 'vue'
import { PluginUIConfigs } from '@/types/plugin'
import PluginFormKitItem from './PluginFormKitItem.vue'
import _ from 'lodash'
import usePluginGenFormRules from '@/hooks/Plugins/useGenPluginFormRules'

const props = defineProps({
  data: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  layouts: {
    type: Object as PropType<PluginUIConfigs>,
    default: null,
  },
})

const emit = defineEmits(['submit'])

const PluginForm = ref()

const configsForm = ref(_.cloneDeep(props.data))

const { rules } = usePluginGenFormRules({
  formConfigs: props.layouts.$form,
})

watch(
  () => props.data,
  (val) => {
    configsForm.value = _.cloneDeep(val)
  },
  { deep: true },
)

async function save() {
  try {
    await PluginForm.value.validate()
    emit('submit', configsForm.value)
  } catch (error) {
    //
  } finally {
    //
  }
}
</script>
