import CodeView from '@/components/CodeView.vue'
import i18n from '@/i18n'
import { isJSONString, parseJSONSafely } from '@emqx/shared-ui-utils'
import { AxiosResponse } from 'axios'
import copy from 'copy-to-clipboard'
import { ElButton } from 'element-plus'

interface EMQXErrorMessage {
  value?: unknown
  reason?: string | Record<string, unknown>
  path?: string
  matched_type?: string
  kind?: string
  mismatches?: Record<string, EMQXErrorMessage>
  unmatched?: string
  unknown?: string
}
const getStructuredErrorMessage = (
  data: AxiosResponse['data'],
  status: number,
): VNode | undefined => {
  try {
    const { code, message } = data
    const obj: EMQXErrorMessage = parseJSONSafely(message) ?? {}
    if (!(obj.kind && obj.reason)) {
      return undefined
    }
    const { t, te } = i18n.global as any
    const { kind, reason, value, path, ...others } = obj
    const sortedObj: EMQXErrorMessage = { kind, reason, value, path, ...others }
    const copyText = (text: string) => {
      try {
        copy(text)
        ElMessage.success(t('Base.copied'))
      } catch (error) {
        ElMessage.success(t('Base.opErr'))
      }
    }
    const infoList = []
    const withKindLabel = te('HTTPError.kind_' + kind)
    const withReasonLabel = te('HTTPError.reason_' + reason)
    if (withKindLabel) {
      infoList.push(`${t('HTTPError.errorKind')} ${t('HTTPError.kind_' + kind)}`)
    }
    if (withReasonLabel) {
      infoList.push(`${t('HTTPError.errorReason')} ${t('HTTPError.reason_' + reason)}`)
    }
    withKindLabel && delete sortedObj.kind
    withReasonLabel && delete sortedObj.reason
    const codeContent = JSON.stringify(sortedObj, null, 2)
    return h('div', { class: 'max-w-lg' }, [
      h('div', `${status} ${code ?? ''}`),
      ...infoList.map((item) => h('div', { class: 'mt-1' }, item)),
      h(CodeView, { code: codeContent, lang: 'json', maxHeight: 300 }),
      h('div', { class: 'flex justify-end' }, [
        h(ElButton, { size: 'small', onClick: () => copyText(stringifyObjSafely(data)) }, () =>
          t('Base.copyRawResponse'),
        ),
      ]),
    ])
  } catch (error) {
    return undefined
  }
}

const getHTTPErrorMessage = (data: AxiosResponse['data'], status: number): string | VNode => {
  if (!data) {
    return `${status} Network error`
  }
  if (typeof data !== 'object') {
    return `${status}: ${data.toString()}`
  }
  const { code, message } = data
  if (code || message) {
    let structuredErrorMessage = undefined
    if (isJSONString(message)) {
      structuredErrorMessage = getStructuredErrorMessage(data, status)
    }
    if (structuredErrorMessage) {
      return structuredErrorMessage
    }
    const popupMsg = message
      ? typeof message === 'object'
        ? JSON.stringify(message)
        : message.toString()
      : ''
    return `${status} ${code ?? ''}: ${popupMsg}`
  }
  return `${status}: ${stringifyObjSafely(data)}`
}

export default getHTTPErrorMessage
