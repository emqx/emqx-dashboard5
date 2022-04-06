import { ref, Ref, watch } from 'vue'
import { SHOW_PAYLOAD_BY_WHICH_OPTION_LIST } from '@/common/constants'
import { encode, decode } from 'js-base64'
import { PayloadShowByType } from '@/types/enum'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

/**
 * format obj str
 */
const plainToJSONStr = (str: string): Promise<string> => {
  try {
    return Promise.resolve(JSON.stringify(JSON.parse(str), null, 2))
  } catch (error) {
    return Promise.reject('invalid JSON input: ' + str)
  }
}

const plainToHex = (str: string): Promise<string> => {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16)
  }
  return Promise.resolve(result)
}

const hexToPlain = (hex: string): Promise<string> => {
  try {
    return Promise.resolve(decodeURIComponent(hex.replace(/(..)/g, '%$1')))
  } catch (e) {
    return Promise.reject('Invalid hex input: ' + hex)
  }
}

const base64ToPlaintext = (base64Text: string): Promise<string> => {
  try {
    return Promise.resolve(decode(base64Text))
  } catch (error) {
    return Promise.reject('Invalid base64 input: ' + base64Text)
  }
}

const JSONStrToPlain = (JSONStr: string): Promise<string> => {
  try {
    return Promise.resolve(JSON.stringify(JSON.parse(JSONStr)))
  } catch (error) {
    return Promise.reject(error)
  }
}

const transPayload = async (content: string, from: PayloadShowByType, to: PayloadShowByType) => {
  let ret = content
  try {
    if (from !== PayloadShowByType.Plaintext) {
      switch (from) {
        case PayloadShowByType.Base64:
          ret = await base64ToPlaintext(ret)
          break
        case PayloadShowByType.JSON:
          ret = await JSONStrToPlain(ret)
          break
        case PayloadShowByType.Hex:
          ret = await hexToPlain(ret)
          break
      }
    }
    if (to === PayloadShowByType.Plaintext) {
      return ret
    }
    if (to === PayloadShowByType.Base64) {
      return encode(ret)
    }
    if (to === PayloadShowByType.JSON) {
      return plainToJSONStr(ret)
    }
    if (to === PayloadShowByType.Hex) {
      return plainToHex(ret)
    }
    return ret
  } catch (error: any) {
    ElMessage.error(error)
    return ret
  }
}

export default () => {
  // when the payload is too large, the value will be null
  const rawText: Ref<string | null> = ref('')
  const payloadShowBy = ref(SHOW_PAYLOAD_BY_WHICH_OPTION_LIST[0])
  const payloadShowByOptions = SHOW_PAYLOAD_BY_WHICH_OPTION_LIST

  const setRawText = (base64Text: string | null): void => {
    rawText.value = base64Text
  }

  const payloadForShow = ref('')

  const setValueForShow = async () => {
    const value = await transPayload(
      rawText.value || '',
      PayloadShowByType.Base64,
      payloadShowBy.value,
    )
    payloadForShow.value = value
  }

  watch(payloadShowBy, setValueForShow)
  watch(rawText, setValueForShow)

  return {
    payloadForShow,
    payloadShowBy,
    payloadShowByOptions,
    setRawText,
  }
}
