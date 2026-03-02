import { getMessageStreamList } from '@/api/messageStream'
import { useMessageTemplate } from '../MessageQueue/useMessageQueue'

const useMessageStream = () => {
  const { tl } = useI18nTl('MessageStream')

  const { messageTemplate } = useMessageTemplate()

  const notEnabledStatuses = [503, 404]
  const getStreamEnabledFromList = async () => {
    try {
      await getMessageStreamList({ limit: 1 }, { errorsHandleCustom: notEnabledStatuses })
      return Promise.resolve(true)
    } catch (error: any) {
      if (error.status && notEnabledStatuses.includes(error.status)) {
        return Promise.resolve(false)
      }
      return Promise.reject(error)
    }
  }

  const descForKeyExpression = `${tl('keyExpressionDesc')}<br />${messageTemplate}`

  return {
    getStreamEnabledFromList,
    descForKeyExpression,
  }
}

export default useMessageStream
