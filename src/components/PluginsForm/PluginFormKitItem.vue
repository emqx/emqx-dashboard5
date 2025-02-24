<template>
  <el-col v-if="formConfigs.component" class="plugin-form-kit-item" :span="formConfigs.flex">
    <el-form-item :required="formConfigs.required" :prop="name">
      <template #label>
        <FormItemLabel
          :label="formConfigs.label"
          :desc="formConfigs.description ? formConfigs.description : ''"
          desc-marked
        />
      </template>
      <template v-if="formConfigs.component">
        <el-input v-if="formConfigs.component === 'input'" v-model="bindValue"></el-input>
        <custom-input-number
          v-else-if="formConfigs.component === 'input-number'"
          type="number"
          v-model="bindValue"
        ></custom-input-number>
        <el-input
          v-else-if="formConfigs.component === 'input-password'"
          type="password"
          v-model="bindValue"
        ></el-input>
        <el-input
          v-else-if="formConfigs.component === 'input-textarea'"
          type="textarea"
          :rows="3"
          v-model="bindValue"
        ></el-input>
        <array-editor-input
          v-else-if="formConfigs.component === 'input-array'"
          v-model="bindValue"
        ></array-editor-input>
        <el-switch v-else-if="formConfigs.component === 'switch'" v-model="bindValue"></el-switch>
        <el-select v-else-if="formConfigs.component === 'select'" v-model="bindValue">
          <el-option
            v-for="({ label, value }, index) in formConfigs.options"
            :key="index"
            :label="label"
            :value="value"
          ></el-option>
        </el-select>
        <key-value-editor
          v-else-if="formConfigs.component === 'key-value-editor'"
          v-model="bindValue"
        ></key-value-editor>
        <div class="monaco-container" v-else-if="formConfigs.component === 'code-editor'">
          <Monaco :id="createRandomString()" :lang="formConfigs.format" v-model="bindValue" />
        </div>
        <object-array-editor
          v-else-if="formConfigs.component === 'maps-editor'"
          v-model="bindValue"
          :propKey="name"
          in-plugins
          :properties="TransMapsItemsToProperties(formConfigs.items)"
        ></object-array-editor>
      </template>
    </el-form-item>
  </el-col>
  <!-- Recursively call the component itself -->
  <template v-else-if="!formConfigs.component && formConfigs.children">
    <plugin-form-kit-item
      v-for="(value, key) in formConfigs.children"
      :key="key"
      :name="`${name}.${key}`"
      :form-configs="value"
      v-model="bindValue[key]"
    />
  </template>
</template>

<script lang="ts">
export default {
  name: 'PluginFormKitItem',
}
</script>

<script lang="ts" setup>
import { ConfigField } from '@/types/plugin'
import PluginFormKitItem from './PluginFormKitItem.vue'
import CustomInputNumber from '../CustomInputNumber.vue'

const props = defineProps({
  modelValue: [String, Number, Array, Object, Boolean] as PropType<any>,
  name: {
    type: String,
    required: true,
  },
  formConfigs: {
    type: Object as PropType<ConfigField>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const bindValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    bindValue.value = val
  },
)

watch(
  () => bindValue.value,
  (val) => {
    emit('update:modelValue', val)
  },
)

const getPropOrder = (prop: any) => (!isUndefined(prop?.order) ? prop.order : 9999)
const sortProps = (props: any) => {
  if (Object.values(props).every(({ order }: any) => isUndefined(order))) {
    return props
  }
  return Object.entries(props)
    .sort((a, b) => getPropOrder(a[1]) - getPropOrder(b[1]))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
}

function TransMapsItemsToProperties(items: ConfigField['items']) {
  const properties: any = {}
  for (const key in items) {
    const item = items[key]
    properties[key] = {
      type: item.type,
      path: key,
      key: key,
      label: item.label,
      description: item.description,
      order: item?.order,
    }
  }
  return sortProps(properties)
}
</script>
