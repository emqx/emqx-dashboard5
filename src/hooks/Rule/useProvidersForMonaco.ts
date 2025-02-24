import { BridgeItem, RuleEvent } from '@/types/rule'
import * as monaco from 'monaco-editor'
import keysInRule from './KeysInRule'

const { syntaxKeys, fieldsCanUse, builtInSQLFuncs, jqFunc } = keysInRule

interface EventDepItem {
  label: string
  kind: monaco.languages.CompletionItemKind
  documentation?: string | monaco.IMarkdownString
  insertText: string
  insertTextRules?: monaco.languages.CompletionItemInsertTextRule
}

interface TextRange {
  startLineNumber: number
  endLineNumber: number
  startColumn: number
  endColumn: number
}

export const useProviderUtils = (): {
  createCompletionProvider: (
    proposals: Array<EventDepItem>,
  ) => monaco.languages.CompletionItemProvider
} => {
  const generateSuggestions = (dependencyProposals: Array<EventDepItem>, range: TextRange) =>
    dependencyProposals.map((item) => ({ ...item, range }))

  const createCompletionProvider = (proposals: Array<EventDepItem>) => {
    return {
      provideCompletionItems: async function (
        model: monaco.editor.ITextModel,
        position: monaco.Position,
      ) {
        // Wait for the trigger character to be entered into the editor
        await waitAMoment()
        const { column } = position
        const triggerStr = model.getValueInRange({
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: column - 1,
          endColumn: column,
        })
        const isTriggeredByCharacter = /\w/.test(triggerStr)
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          // -1 is for the `${`/`"$`, +1 is for the `}`/`"`
          startColumn: word.startColumn - (isTriggeredByCharacter ? 0 : 1),
          endColumn: word.endColumn + 1,
        }
        const suggestions = generateSuggestions(proposals, range)
        return { suggestions }
      },
    }
  }

  return {
    createCompletionProvider,
  }
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

  let fieldsDependencyProposals: Array<{
    label: string
    kind: monaco.languages.CompletionItemKind
    insertText: string
  }> = []

  const initFieldsDependencyProposals = (totalEvents: Array<RuleEvent>) => {
    const allFieldList = [
      ...new Set(
        totalEvents.reduce(
          (arr: Array<string>, { columns }) => {
            arr.push(...columns)
            return arr
          },
          [...fieldsCanUse],
        ),
      ),
    ]
    fieldsDependencyProposals = allFieldList.map((field) => ({
      label: field,
      kind: monaco.languages.CompletionItemKind.Field,
      insertText: field,
    }))
  }

  const createFuncDoc = (funcName: string) => ({
    value: `<b>${tl(`${camelCase(funcName)}Desc`)}</b><br /><br />${tl('parameter')}<br />${tl(
      `${camelCase(funcName)}Params`,
    )}<br /><br />${tl('returned')}<br />${tl(`${camelCase(funcName)}Returns`)}`,
    supportHtml: true,
  })

  const generateFuncProposal = (funcName: string) => ({
    label: funcName,
    kind: monaco.languages.CompletionItemKind.Function,
    documentation: createFuncDoc(funcName),
    insertText: `${funcName}(\${1})`,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  })

  const builtInFuncsDependencyProposals = builtInSQLFuncs
    .map((funcName) => generateFuncProposal(funcName))
    .concat(jqFunc.map((funcName) => generateFuncProposal(funcName)))

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

  const { createCompletionProvider } = useProviderUtils()

  const createProviders = () => {
    completionProvider.value = {
      ...createCompletionProvider([
        ...eventDependencyProposals,
        ...bridgeDependencyProposals,
        ...syntaxKeyDependencyProposals,
        ...fieldsDependencyProposals,
        ...builtInFuncsDependencyProposals,
      ]),
      triggerCharacters: ['"', '$'],
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
    initFieldsDependencyProposals(events)
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

export const useAvailableProviders = (): {
  sql: Ref<string> | undefined
  completionProvider: ComputedRef<monaco.languages.CompletionItemProvider | undefined>
} => {
  const { sql, availablePlaceholders } = useSQLAvailablePlaceholder()
  const { createCompletionProvider } = useProviderUtils()

  const createPlaceholderProposals = (placeholders: string) => ({
    label: placeholders,
    kind: monaco.languages.CompletionItemKind.Field,
    insertText: placeholders,
  })

  const completionProvider = computed<undefined | monaco.languages.CompletionItemProvider>(() => {
    const proposals = availablePlaceholders.value.map((field) => createPlaceholderProposals(field))
    return { ...createCompletionProvider(proposals), triggerCharacters: ['$'] }
  })

  return {
    sql,
    completionProvider,
  }
}
