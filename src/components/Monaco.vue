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
import { defineProps, defineEmits, onMounted, onUnmounted, watch, nextTick } from 'vue'

/**
 * for placeholder to show full desc
 */
const DESC_SUFFIX = '    '

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
  decorationFunc: {
    type: Function,
  },
  jsonWithoutValidate: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'change'])

// ❗️ editor instance can not be reactive, otherwise it will cause the page to get stuck for unknown reasons
let editor = null

const setJSONValidate = () => {
  if (prop.lang === 'json') {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: !prop.jsonWithoutValidate,
    })
  }
}

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
      alwaysConsumeMouseWheel: false,
    },
    // hover: {
    //   delay: 500,
    //   enabled: true,
    // },
  }
  setJSONValidate()
  editor = monaco.editor.create(document.getElementById(id), defaultOptions)
  editor.onDidChangeModelContent(async (event) => {
    const value = editor.getValue()
    if (value !== editor.modelValue) {
      emit('update:modelValue', value, event)
      emit('change', value)
    }
  })
}

let decorations = []
const handleLineDecoration = () => {
  const createLineDecoration = prop.decorationFunc
  editor.onDidFocusEditorText(() => {
    let curLineNumber = -1
    editor?.onDidChangeCursorPosition((e) => {
      const { lineNumber } = e.position
      if (lineNumber === curLineNumber) {
        return
      }
      curLineNumber = lineNumber
      decorations = editor?.deltaDecorations(decorations, [])
      const lineContent = editor.getModel()?.getLineContent(lineNumber)
      const endColumn = lineContent?.length + 1
      setTimeout(() => {
        decorations = editor?.deltaDecorations(decorations, [
          {
            range: new monaco.Range(lineNumber, 1, lineNumber, endColumn),
            options: {
              after: {
                content: createLineDecoration(lineContent) + DESC_SUFFIX,
                inlineClassName: 'my-inline-decoration',
              },
            },
          },
        ])
      }, 128)
    })
  })
  editor.onDidBlurEditorText(() => {
    decorations = editor?.deltaDecorations(decorations, [])
  })
}

onMounted(() => {
  initEditor()
  if (prop.decorationFunc && typeof prop.decorationFunc === 'function') {
    handleLineDecoration()
  }
  if (prop.scrollLoading) editor.onDidScrollChange(prop.scrollFunc)
})

onUnmounted(() => {
  editor?.dispose()
})

watch(
  () => prop.modelValue,
  (val) => {
    if (val !== editor.getValue()) {
      editor.setValue(val)
    }
  },
)

watch(
  () => prop.lang,
  async () => {
    editor?.dispose()
    await nextTick()
    initEditor()
  },
)
</script>

<style lang="scss">
.monaco-view {
  height: 100%;
  position: relative;
}
.my-inline-decoration {
  position: relative;
  left: 50px;
  color: #dadada !important;
  user-select: none;
}
</style>
