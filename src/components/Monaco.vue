<template>
  <div :id="`monaco-${id}`" class="monaco-view"></div>
</template>

<script>
import * as monaco from "monaco-editor";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
// import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
// import { createMonacoComplete, createMonacoHover } from "@/common/monacoUtils";

export default {
  name: "Monaco",

  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
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
  },
  setup(prop) {
    const editor = ref({});
    // const editValue = computed(() => {
    //   console.log(prop.value + "changed");
    //   return prop.value;
    // });

    const initEditor = () => {
      const id = `monaco-${prop.id}`;
      const defaultOptions = {
        value: prop.value,
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
      };

      editor.value = monaco.editor.create(
        document.getElementById(id),
        defaultOptions
      );

      // console.log(editor.value.getModel());
    };

    onMounted(() => {
      initEditor();
      if (prop.scrollLoading) editor.value.onDidScrollChange(prop.scrollFunc);
    });

    onUnmounted(() => {
      // editor.value.dispose();
    });

    watch(
      () => prop.value,
      (val, val2) => {
        // editor.value.setValue(val);
      }
    );
  },
};
</script>

<style lang="scss">
.monaco-view {
  height: 100%;
  position: relative;
}
</style>
