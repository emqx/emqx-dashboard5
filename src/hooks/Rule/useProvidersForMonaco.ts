import { RULE_INPUT_EVENT_PREFIX } from '@/common/constants'
import { RuleEvent } from '@/types/rule'
import * as monaco from 'monaco-editor'
import { Ref, ref } from 'vue'
import useRuleSourceEvents from './bridge/useRuleSourceEvents'

interface EventDepItem {
  label: string
  kind: monaco.languages.CompletionItemKind.Function
  documentation: string
  insertText: string
}

export default (): {
  completionProvider: Ref<monaco.languages.CompletionItemProvider | undefined>
  hoverProvider: Ref<monaco.languages.HoverProvider | undefined>
  setEventList: (events: Array<RuleEvent>) => void
} => {
  const completionProvider: Ref<undefined | monaco.languages.CompletionItemProvider> =
    ref(undefined)
  const hoverProvider: Ref<undefined | monaco.languages.HoverProvider> = ref(undefined)

  let eventList: Array<RuleEvent> = []
  let eventDependencyProposals: Array<EventDepItem> = []

  const { eventDoNotNeedShow, isMsgPubEvent, getEventLabel, getEventDesc } = useRuleSourceEvents()

  const isInEventList = (eventStr: string) => eventList.some(({ event }) => event === eventStr)

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

  function createEventDependencyProposals() {
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
        const suggestions = eventDependencyProposals.map((item) => ({ ...item, range }))
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
        const eventStr = getEventForHover(content, lineContent, model, position)
        if (!eventStr) {
          return
        }
        const event = eventList.find(({ event }) => event === eventStr) as RuleEvent
        return {
          contents: [
            { supportHtml: true, value: `<b>${getEventLabel(event.title)}</b>` },
            { value: getEventDesc(event.event) },
          ],
        }
      },
    }
  }

  const setEventList = (events: Array<RuleEvent>) => {
    eventList = events.filter(
      ({ event }) => !(eventDoNotNeedShow.includes(event) || isMsgPubEvent(event)),
    )
    createEventDependencyProposals()
    createProviders()
  }
  return {
    completionProvider,
    hoverProvider,
    setEventList,
  }
}
