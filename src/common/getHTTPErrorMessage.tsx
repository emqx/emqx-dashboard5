import CodeView from '@/components/CodeView.vue'
import i18n from '@/i18n'
import { isJSONString, parseJSONSafely } from '@emqx/shared-ui-utils'
import { AxiosResponse } from 'axios'
import copy from 'copy-to-clipboard'
import { ElButton, ElTag } from 'element-plus'
import { ClipboardCopy } from 'lucide-vue-next'

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

interface ErrorMessageProps {
  statusCode: number
  statusText: string
  errorKind?: string
  errorPath?: string
  errorType?: string
  codeContent?: string
  rawData?: unknown
}

const getStructuredErrorBody = (data: AxiosResponse['data'], status: number): VNode | undefined => {
  try {
    const { code, message } = data
    const obj: EMQXErrorMessage = parseJSONSafely(message) ?? {}
    if (!(obj.kind && obj.reason)) {
      return undefined
    }

    const { t, te } = i18n.global as any
    const tl = (key: string) => t(`Base.${key}`)

    const { kind, path, matched_type, ...others } = obj
    const sortedObj: EMQXErrorMessage = { ...others }

    const withKindLabel = te('HTTPError.kind_' + kind)
    const errorKindLabel = withKindLabel ? t('HTTPError.kind_' + kind) : ''
    if (withKindLabel) {
      delete sortedObj.kind
    }

    const codeContent = JSON.stringify(sortedObj, null, 2)

    const props: ErrorMessageProps = {
      statusCode: status,
      statusText: code ?? 'Bad Request',
      errorKind: kind,
      errorPath: path,
      errorType: matched_type,
      codeContent,
      rawData: data,
    }

    const VNode = (
      <>
        {errorKindLabel && (
          <ElTag type="danger" effect="plain" class="mb-2" round>
            {errorKindLabel}
          </ElTag>
        )}

        {props.errorType && (
          <div class="flex items-center mb-3 info-item py-1 px-2 rounded-sm">
            <label class="flex-shrink-0 w-12 tip">{t('Alarm.type')}</label>
            <span class="font-mono break-all">{props.errorType}</span>
          </div>
        )}

        {props.errorPath && (
          <div class="flex items-center mb-3 info-item  py-1 px-2 rounded-sm">
            <label class="flex-shrink-0 w-12 tip">{tl('path')}</label>
            <span class="font-mono break-all">{props.errorPath}</span>
          </div>
        )}

        {props.codeContent && <CodeView code={props.codeContent} lang="json" maxHeight={300} />}
      </>
    )
    return VNode
  } catch (error) {
    return undefined
  }
}

const getErrorMessage = (data: AxiosResponse['data'], status: number): string | VNode => {
  try {
    let title: string = status.toString()
    let bodyVNode: undefined | VNode = undefined
    if (!data) {
      bodyVNode = <div>Network error</div>
    } else if (typeof data !== 'object') {
      bodyVNode = <div>{data.toString()}</div>
    } else {
      const { code, message } = data
      title += ` ${code ?? ''}`
      if (!code && !message) {
        bodyVNode = <div>{stringifyObjSafely(data)}</div>
      } else if (typeof message === 'object') {
        bodyVNode = (
          <>
            <div class="font-mono break-all">{message.toString()}</div>
          </>
        )
      } else {
        if (isJSONString(message)) {
          const structuredBodyVNode = getStructuredErrorBody(data, status)
          if (structuredBodyVNode) {
            bodyVNode = structuredBodyVNode
          } else {
            const parsed = parseJSONSafely(message)
            const display = parsed ? JSON.stringify(parsed, null, 2) : message
            bodyVNode = <CodeView code={display} lang="json" maxHeight={300} />
          }
        } else {
          bodyVNode = (
            <>
              <div class="font-mono break-words">{message.toString()}</div>
            </>
          )
        }
      }
    }
    const { t } = i18n.global as any
    const tl = (key: string) => t(`Base.${key}`)
    const copyText = () => {
      try {
        copy(stringifyObjSafely(data))
        ElMessage.success(t('Base.copied'))
      } catch (error) {
        ElMessage.error(t('Base.opErr'))
      }
    }
    const VNode = (
      <div class="error-message max-w-xl rounded-lg overflow-hidden shadow-lg">
        <header class="error-header px-6 py-4">
          <div class="text-base font-semibold mb-1">{tl('requestFailed')}</div>
          <div class="opacity-90">{title}</div>
        </header>
        <div class="p-6 error-body">
          <el-scrollbar max-height="400px">
            {bodyVNode}
            <div class="flex justify-end mt-4">
              <ElButton
                text
                class="inline-flex items-center gap-1"
                icon={<ClipboardCopy />}
                onClick={copyText}
              >
                <span>{tl('copyErrorInfo')}</span>
              </ElButton>
            </div>
          </el-scrollbar>
        </div>
      </div>
    )
    return VNode
  } catch (error) {
    return data.toString()
  }
}

export default getErrorMessage
