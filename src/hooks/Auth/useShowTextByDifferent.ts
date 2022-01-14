import { ref, computed, Ref } from 'vue'
import { SHOW_PAYLOAD_BY_WHICH_OPTION_LIST } from '@/common/constants'
import { encode, decode } from 'js-base64'
import { PayloadShowByType } from '@/types/enum'
import { useI18n } from 'vue-i18n'

export default () => {
  const { t } = useI18n()

  // when the payload is too large, the value will be null
  const rawText: Ref<string | null> = ref('')
  const payloadShowBy = ref(SHOW_PAYLOAD_BY_WHICH_OPTION_LIST[0])
  const payloadShowByOptions = SHOW_PAYLOAD_BY_WHICH_OPTION_LIST

  const setRawText = (base64Text: string | null): void => {
    rawText.value = base64Text
  }

  const base64ToPlaintext = (base64Text: string): string => {
    try {
      return decode(base64Text)
    } catch (error) {
      return base64Text
    }
  }

  const payloadForShow = computed(() => {
    if (rawText.value === null) {
      return t('Auth.payloadTooLargeTip')
    }
    switch (payloadShowBy.value) {
      case PayloadShowByType.Plaintext:
        return base64ToPlaintext(rawText.value)
        break
      case PayloadShowByType.Base64:
        return rawText.value
        break
      default:
        return rawText.value
        break
    }
  })

  return {
    payloadForShow,
    payloadShowBy,
    payloadShowByOptions,
    setRawText,
  }
}
