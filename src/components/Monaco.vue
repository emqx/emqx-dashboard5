<template>
  <div :id="`monaco-${id}`" class="monaco-view"></div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Monaco',
})
</script>

<script setup>
import * as monaco from 'monaco-editor'
import { defineProps, defineEmits, onMounted, onUnmounted, watch } from 'vue'

const prop = defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // warp: {
  //   type: Boolean,
  //   default: false,
  // },
  // provider: {
  //   type: Array,
  //   default: () => [],
  // },
  scrollLoading: {
    type: Boolean,
    default: false,
  },
  scrollFunc: {
    type: Function,
    default: () => () => {},
  },
})

const emit = defineEmits(['update:modelValue'])

// ❗️ editor instance can not be reactive, otherwise it will cause the page to get stuck for unknown reasons
let editor = {}
// const editValue = computed(() => {
//   console.log(prop.modelValue + "changed");
//   return prop.modelValue;
// });

const initEditor = () => {
  const id = `monaco-${prop.id}`
  const defaultOptions = {
    value: prop.modelValue,
    language: prop.lang,
    readOnly: prop.disabled,
    // fontSize: 12,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    // theme: "vs",
    minimap: {
      enabled: false,
    },
    scrollbar: {
      verticalScrollbarSize: 6,
      horizontalScrollbarSize: 6,
    },
    // hover: {
    //   delay: 500,
    //   enabled: true,
    // },
  }

  editor = monaco.editor.create(document.getElementById(id), defaultOptions)
  editor.onDidChangeModelContent(async (event) => {
    const value = editor.getValue()
    if (value !== editor.modelValue) {
      emit('update:modelValue', value, event)
    }
  })
}

onMounted(() => {
  initEditor()
  if (prop.scrollLoading) editor.onDidScrollChange(prop.scrollFunc)
})

onUnmounted(() => {
  editor.dispose()
})

watch(
  () => prop.modelValue,
  (val, val2) => {
    // editor.setValue(val);
  },
)
</script>

<style lang="scss">
.monaco-view {
  height: 100%;
  position: relative;
}
</style>
