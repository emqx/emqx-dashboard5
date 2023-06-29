import { RULE_INPUT_EVENT_PREFIX, RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'
import { BridgeItem, RuleEvent } from '@/types/rule'
import * as monaco from 'monaco-editor'
import { Ref, ref } from 'vue'
import useI18nTl from '../useI18nTl'
import useRuleSourceEvents from './rule/useRuleSourceEvents'
import keysInRule from './KeysInRule.json'
import { camelCase } from 'lodash'

const { syntaxKeys, allFieldsCanUse, builtInSQLFuncs, jqFunc } = keysInRule

interface EventDepItem {
  label: string
  kind: monaco.languages.CompletionItemKind
  documentation?: string | monaco.IMarkdownString
  insertText: string
  insertTextRules?: monaco.languages.CompletionItemInsertTextRule
}

export default (): {
  completionProvider: Ref<monaco.languages.CompletionItemProvider | undefined>
  hoverProvider: Ref<monaco.languages.HoverProvider | undefined>
  setExtDepData: ({
    events,
    bridges,
  }: {
    events: Array<RuleEvent>
    bridges: Array<BridgeItem>
  }) => void
} => {
  const { tl } = useI18nTl('RuleSyntax')
  const completionProvider: Ref<undefined | monaco.languages.CompletionItemProvider> =
    ref(undefined)
  const hoverProvider: Ref<undefined | monaco.languages.HoverProvider> = ref(undefined)

  let eventList: Array<RuleEvent> = []
  let eventDependencyProposals: Array<EventDepItem> = []

  let bridgeList: Array<string> = []
  let bridgeDependencyProposals: Array<EventDepItem> = []

  const { eventDoNotNeedShow, isMsgPubEvent, getEventLabel, getEventDesc } = useRuleSourceEvents()

  const isInEventList = (eventStr: string) => eventList.some(({ event }) => event === eventStr)

  const syntaxKeyDependencyProposals = syntaxKeys.map((key) => {
    const ret: EventDepItem = {
      label: key,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: key,
    }
    ret.documentation = tl(`${key.toLowerCase()}Desc`)
    return ret
  })

  const fieldsDependencyProposals = allFieldsCanUse.map((field) => ({
    label: field,
    kind: monaco.languages.CompletionItemKind.Field,
    insertText: field,
  }))

  const createFuncDoc = (funcName: string) => ({
    value: `<b>${tl(`${camelCase(funcName)}Desc`)}</b><br /><br />${tl('parameter')}<br />${tl(
      `${camelCase(funcName)}Params`,
    )}<br /><br />${tl('returned')}<br />${tl(`${camelCase(funcName)}Returns`)}`,
    supportHtml: true,
  })

  /**
   * To confirm whether the word under the mouse cursor is a function
   */
  const funcArr: Array<string> = []

  const builtInFuncsDependencyProposals = (
    Object.keys(builtInSQLFuncs) as Array<keyof typeof builtInSQLFuncs>
  )
    .reduce((arr: Array<EventDepItem>, currentType) => {
      const funArr = builtInSQLFuncs[currentType]
      funcArr.push(...funArr)
      const currentDep = funArr.map((funcName: string) => ({
        label: funcName,
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: createFuncDoc(funcName),
        insertText: `${funcName}(\${1})`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      }))
      return [...arr, ...currentDep] as Array<EventDepItem>
    }, [])
    .concat(
      jqFunc.map((func) => ({
        label: func,
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: createFuncDoc(func),
        insertText: `${func}(\${1})`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      })),
    )

  const getEventForHover = (
    content: monaco.editor.IWordAtPosition,
    line: string,
    model: monaco.editor.ITextModel,
    nowPosition: monaco.Position,
  ) => {
    const { word, startColumn, endColumn } = content
    let eventTypeStr = word
    // string for secondary verification
    let subStr = ''
    if (eventTypeStr === RULE_INPUT_EVENT_PREFIX.slice(1, -1)) {
      const column = endColumn + 2
      eventTypeStr = model.getWordAtPosition({ ...nowPosition, column })?.word || ''
      if (isInEventList(RULE_INPUT_EVENT_PREFIX + eventTypeStr)) {
        subStr = line.slice(startColumn - 2, endColumn + 1 + eventTypeStr.length - 1)
      }
    } else if (isInEventList(RULE_INPUT_EVENT_PREFIX + word)) {
      subStr = line.slice(startColumn - RULE_INPUT_EVENT_PREFIX.length - 1, endColumn - 1)
    }
    if (subStr && subStr.indexOf(RULE_INPUT_EVENT_PREFIX + eventTypeStr) > -1) {
      return RULE_INPUT_EVENT_PREFIX + eventTypeStr
    }

    return undefined
  }

  const createDoc = (event: RuleEvent) => ({
    supportHtml: true,
    value: `<b>${getEventLabel(event.title)}</b><br />${getEventDesc(event.event)}`,
  })

  const createEventDependencyProposals = () => {
    eventDependencyProposals = eventList.reduce((arr: Array<EventDepItem>, item: RuleEvent) => {
      return [
        ...arr,
        {
          label: `"${item.event}"`,
          kind: monaco.languages.CompletionItemKind.Method,
          documentation: createDoc(item),
          insertText: `"${item.event}"`,
        },
      ] as Array<EventDepItem>
    }, [])
  }

  const createBridgeDependencyProposals = () => {
    bridgeDependencyProposals = bridgeList.map((id) => {
      const bridgeStr = `"${RULE_INPUT_BRIDGE_TYPE_PREFIX}${id}"`
      return {
        label: bridgeStr,
        kind: monaco.languages.CompletionItemKind.Method,
        insertText: bridgeStr,
      }
    })
  }

  const generateSuggestions = (
    dependencyProposals: Array<EventDepItem>,
    range: {
      startLineNumber: number
      endLineNumber: number
      startColumn: number
      endColumn: number
    },
  ) => dependencyProposals.map((item) => ({ ...item, range }))

  const createProviders = () => {
    completionProvider.value = {
      provideCompletionItems: function (
        model: monaco.editor.ITextModel,
        position: monaco.Position,
      ) {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }
        const suggestions = generateSuggestions(eventDependencyProposals, range)
          .concat(generateSuggestions(bridgeDependencyProposals, range))
          .concat(generateSuggestions(syntaxKeyDependencyProposals, range))
          .concat(generateSuggestions(fieldsDependencyProposals, range))
          .concat(generateSuggestions(builtInFuncsDependencyProposals, range))
        return { suggestions }
      },
    }
    hoverProvider.value = {
      provideHover: function (model: monaco.editor.ITextModel, position: monaco.Position) {
        const content = model.getWordAtPosition(position)
        const lineContent = model.getLineContent(position.lineNumber)
        if (!content || !lineContent) {
          return
        }
        /* IS EVENT */
        const eventStr = getEventForHover(content, lineContent, model, position)
        if (eventStr) {
          const event = eventList.find(({ event }) => event === eventStr) as RuleEvent
          return {
            contents: [
              { supportHtml: true, value: `<b>${getEventLabel(event.title)}</b>` },
              { value: getEventDesc(event.event) },
            ],
          }
        }
        const { word } = content
        /* IS KEYWORD */
        const keyword = syntaxKeyDependencyProposals.find(({ label }) => label === word)
        if (keyword) {
          return { contents: [{ value: keyword.documentation as string }] }
        }
        const func = builtInFuncsDependencyProposals.find(({ label }) => label === word)
        /* IS FUNC */
        if (func) {
          return { contents: [func.documentation as monaco.IMarkdownString] }
        }
      },
    }
  }

  const setExtDepData = ({
    events,
    bridges,
  }: {
    events: Array<RuleEvent>
    bridges: Array<BridgeItem>
  }) => {
    eventList = events.filter(
      ({ event }) => !(eventDoNotNeedShow.includes(event) || isMsgPubEvent(event)),
    )
    bridgeList = bridges.map(({ id }) => id)
    createEventDependencyProposals()
    createBridgeDependencyProposals()
    createProviders()
  }

  return {
    completionProvider,
    hoverProvider,
    setExtDepData,
  }
}
