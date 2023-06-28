<template>
  <el-drawer
    v-model="showDialog"
    size="40%"
    custom-class="node-drawer"
    :title="title"
    :z-index="1999"
    :close-on-click-modal="false"
  >
    <template v-if="getFormComponent(type)">
      <component :is="getFormComponent(type)" />
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
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineEmits, defineProps } from 'vue'
import useNodeDrawer from '@/hooks/Flow/useNodeDrawer'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { tl } = useI18nTl('Base')

const { getDrawerTitle, getFormComponent } = useNodeDrawer()
const title = computed(() => getDrawerTitle(props.type))

const cancel = () => {
  showDialog.value = false
}

const save = () => {}
</script>

<style lang="scss"></style>
