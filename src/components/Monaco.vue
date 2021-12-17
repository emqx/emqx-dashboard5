<template>
  <div :id="`monaco-${id}`" class="monaco-view"></div>
</template>

<script>
import * as monaco from "monaco-editor";
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

  data() {
    return {
      editor: null,
      providerDisposeID: null,
      hoverDisposeID: null,
      sqlHints: [
        {
          name: "SELECT",
          type: "Keyword",
          detail: "SQL",
          documentation: "SQL selector.",
        },
        {
          name: "FROM",
          type: "Keyword",
          detail: "SQL",
          documentation: "What event.",
        },
        {
          name: "WHERE",
          type: "Keyword",
          detail: "SQL",
          documentation:
            "Filters a result set to include only records that fulfill a specified condition. ",
        },
        {
          name: "and",
          type: "Keyword",
          detail: "SQL",
          documentation: "Operator.",
        },
        {
          name: "or",
          type: "Keyword",
          detail: "SQL",
          documentation: "Operator.",
        },
      ],
    };
  },

  watch: {
    // value(val) {
    //   if (this.editor) {
    //     if (val !== this.editor.getValue()) {
    //       this.editor.setValue(val);
    //     }
    //   }
    // },
    // lang() {
    //   if (this.editor) {
    //     this.editor.dispose();
    //     this.initEditor();
    //   }
    // },
  },

  created() {
    window.onresize = () => {
      console.log("resize");
      //   if (this.editor) {
      //     this.editor.layout();
      //   }
    };
    // if (this.provider.length) {
    //   this.registerCustomHintsProvider();
    //   this.registerCustomHoverProvider();
    // }
  },

  mounted() {
    this.initEditor();
  },
  // beforeUpdate() {
  //   this.editor.dispose();
  // },

  beforeUnmount() {
    if (this.editor) {
      // this.editor.getModel().dispose();
      this.editor.dispose();
      // this.editor = null;
    }
    // if (this.providerDisposeID) {
    //   this.providerDisposeID.dispose();
    // }
    // if (this.hoverDisposeID) {
    //   this.hoverDisposeID.dispose();
    // }
  },

  methods: {
    initEditor() {
      const id = `monaco-${this.id}`;
      const defaultOptions = {
        value: this.value,
        language: this.lang,
        readOnly: this.disabled,
        // fontSize: 12,
        // automaticLayout: true,
        // scrollBeyondLastLine: false,
        theme: "vs",
        minimap: {
          enabled: false,
        },
        // hover: {
        //   delay: 500,
        //   enabled: true,
        // },
      };
      const options = this.beforeMonacoCreate(defaultOptions);
      // Create
      this.editor = monaco.editor.create(document.getElementById(id), options);
      // event changed
      // this.editor.onDidChangeModelContent((event) => {
      //   const value = this.editor.getValue();
      //   if (value !== this.value) {
      //     this.$emit("input", value, event);
      //     this.$emit("change", value, event);
      //   }
      // });
      // Qucik save method
      // eslint-disable-next-line
      // this.editor.addCommand(
      //   monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
      //   () => {
      //     this.$emit("qucik-save", this.value);
      //   }
      // );
      // Update editor options
      // this.editor.getModel().updateOptions({ tabSize: 2 });

      if (this.scrollLoading) this.editor.onDidScrollChange(this.scrollFunc);
    },
    beforeMonacoCreate(options) {
      // if (this.warp) {
      //   const warpOptions = {
      //     wordWrap: "on",
      //     wrappingIndent: "indent",
      //   };
      //   Object.assign(options, warpOptions);
      // }
      return options;
    },
    // getHints() {
    //   const $hints = [...this.provider];
    //   if (this.lang === "sql") {
    //     $hints.push(...this.sqlHints);
    //   }
    //   return $hints;
    // },
    // registerCustomHintsProvider() {
    //   this.providerDisposeID = monaco.languages.registerCompletionItemProvider(
    //     this.lang,
    //     {
    //       provideCompletionItems: (model, position) => {
    //         const wordObj = model.getWordUntilPosition(position);
    //         const hints = this.getHints(wordObj);
    //         const range = {
    //           startLineNumber: position.lineNumber,
    //           endLineNumber: position.lineNumber,
    //           startColumn: wordObj.startColumn,
    //           endColumn: wordObj.endColumn,
    //         };
    //         return {
    //           suggestions: createMonacoComplete(hints, range, wordObj),
    //         };
    //       },
    //       triggerCharacters: [" "],
    //     }
    //   );
    // },
    // registerCustomHoverProvider() {
    //   monaco.languages.register({ id: this.lang });
    //   this.hoverDisposeID = monaco.languages.registerHoverProvider(this.lang, {
    //     provideHover: (model, position) => {
    //       if (!model.getWordAtPosition(position)) {
    //         return {};
    //       }
    //       const { word } = model.getWordAtPosition(position);
    //       return {
    //         contents: createMonacoHover(word, this.provider),
    //       };
    //     },
    //   });
    // },
  },
};
</script>

<style lang="scss">
.monaco-view {
  height: 100%;
  position: relative;
}
</style>
