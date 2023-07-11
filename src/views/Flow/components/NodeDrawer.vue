<template>
  <el-drawer
    v-model="showDialog"
    custom-class="node-drawer"
    :size="width"
    :title="title"
    :z-index="1999"
    :close-on-click-modal="false"
    @closed="handleDrawerClosed"
  >
    <template v-if="getFormComponent(type)">
      <component
        ref="FormCom"
        :is="getFormComponent(type)"
        v-model="record"
        v-bind="getFormComponentProps(type)"
        @save="save"
      />
    </template>
    <template #footer>
      <div>
        <el-button @click="cancel">{{ tl('cancel') }}</el-button>
        <el-button type="primary" @click="save">{{ tl('done') }}</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import useNodeDrawer from '@/hooks/Flow/useNodeDrawer'
import useNodeForm from '@/hooks/Flow/useNodeForm'
import useI18nTl from '@/hooks/useI18nTl'
import { cloneDeep, isFunction } from 'lodash'
import { Ref, computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    default: '',
  },
  formData: {
    type: Object,
  },
  generateBridgeName: {
    type: Function,
  },
})
const emit = defineEmits(['update:modelValue', 'save', 'close'])

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { tl } = useI18nTl('Base')

const FormCom = ref()

const {
  getDrawerTitle,
  drawerDefaultWidth,
  getDrawerWidth,
  getFormComponent,
  getFormComponentProps,
} = useNodeDrawer()
const title = computed(() => (props.type ? getDrawerTitle(props.type) : ''))
const width = computed(() => (props.type ? getDrawerWidth(props.type) : drawerDefaultWidth))

const record: Ref<Record<string, any>> = ref({})

const cancel = () => {
  showDialog.value = false
}

const save = async () => {
  try {
    if (FormCom.value.validate && isFunction(FormCom.value.validate)) {
      await FormCom.value.validate()
    }
    emit('save', record.value)
  } catch (error) {
    //
  }
}

const handleDrawerClosed = () => {
  emit('close')
}

const { getFormDataByType, isBridgeType } = useNodeForm()
watch(showDialog, (val) => {
  if (!val) return
  const { formData, type, generateBridgeName } = props
  if (formData) {
    record.value = cloneDeep(formData)
    return
  }
  record.value = getFormDataByType(type)
  if (isBridgeType(type) && isFunction(generateBridgeName)) {
    record.value.name = generateBridgeName()
  }
})
</script>

<style lang="scss">
.node-drawer {
  .bridge-config {
    $input-append-width: 120px;
    .el-form-item__content,
    .oneof-item {
      > .el-input:not(.el-input-group--append),
      > .el-select {
        width: calc(100% - #{$input-append-width});
      }
    }
    .one-of {
      width: 100%;
    }
    .monaco-container {
      width: calc(100% - #{$input-append-width} / 2);
    }
  }
}
</style>
