import { useMessageTemplate } from '../MessageQueue/useMessageQueue'

const useMessageStream = () => {
  const { tl } = useI18nTl('MessageStream')

  const { messageTemplate } = useMessageTemplate()

  const descForKeyExpression = `${tl('keyExpressionDesc')}<br />${messageTemplate}`

  return {
    descForKeyExpression,
  }
}

export default useMessageStream
