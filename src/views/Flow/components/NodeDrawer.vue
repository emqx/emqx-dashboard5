<template>
  <el-drawer
    v-model="showDialog"
    size="40%"
    custom-class="node-drawer"
    :title="title"
    :z-index="1999"
    :close-on-click-modal="false"
    @closed="handleDrawerClosed"
  >
    <template v-if="getFormComponent(type)">
      <component ref="FormCom" :is="getFormComponent(type)" v-model="record" @save="save" />
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
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { isFunction, cloneDeep } from 'lodash'

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

const { getDrawerTitle, getFormComponent, getFormDataByType } = useNodeDrawer()
const title = computed(() => getDrawerTitle(props.type))

const record = ref({})

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

watch(showDialog, (val) => {
  if (val) {
    record.value = props.formData ? cloneDeep(props.formData) : getFormDataByType(props.type)
  }
})
</script>

<style lang="scss"></style>
