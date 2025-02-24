import { API_BASE_URL, REQUEST_TIMEOUT_CODE } from '@/common/constants'
import { BAD_TOKEN, MFA_REQUIRED, NAME_PWD_ERROR, TOKEN_TIME_OUT } from '@/common/customErrorCode'
import CustomMessage from '@/common/CustomMessage'
import i18n from '@/i18n'
import { toLogin } from '@/router'
import store from '@/store'
import { stringifyObjSafely } from '@emqx/shared-ui-utils'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

type CustomRequestConfig = InternalAxiosRequestConfig & {
  doNotTriggerProgress?: boolean
  errorsHandleCustom?: number[]
  handleTimeoutSelf?: boolean
  controller?: AbortController
  keepSpaces?: boolean
}

type CustomResponse = AxiosResponse & {
  config: CustomRequestConfig
}

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })
let respSet = new Set<number>()
const resetRespSet = () => (respSet = new Set<number>())

Object.assign(axios.defaults, {
  baseURL: API_BASE_URL,
  timeout: 20000,
})

axios.interceptors.request.use(
  (config: CustomRequestConfig) => {
    const { user } = store.state
    config.headers.Authorization = 'Bearer ' + user.token
    const controller = new AbortController()
    config.signal = controller.signal
    config.controller = controller
    store.commit('ADD_ABORT_CONTROLLER', controller)

    if (
      !config.keepSpaces &&
      config.method &&
      ['post', 'put'].includes(config.method) &&
      isPlainObject(config.data)
    ) {
      config.data = trimValues(config.data)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axios.interceptors.request.use(async (config: CustomRequestConfig) => {
  if (!config.doNotTriggerProgress) {
    if (!store.state.request_queue) {
      NProgress.start()
    }
    await store.dispatch('SET_REQ_CHANGE', true)
  }
  return config
})

const isTokenExpired = (status: number, data: any) =>
  status === 401 && [BAD_TOKEN, TOKEN_TIME_OUT].includes(data.code)

const readBlobResponse = async (data: Blob) => {
  try {
    const ret = await data.text()
    return JSON.parse(ret)
  } catch (error) {
    return {}
  }
}

const getErrorMessage = (data: AxiosResponse['data'], status: number) => {
  if (!data) {
    return `${status} Network error`
  }
  if (typeof data !== 'object') {
    return `${status}: ${data.toString()}`
  }
  const { code, message } = data
  if (code || message) {
    const popupMsg = message
      ? typeof message === 'object'
        ? JSON.stringify(message)
        : message.toString()
      : ''
    return `${status} ${code ?? ''}: ${popupMsg}`
  }
  return `${status}: ${stringifyObjSafely(data)}`
}

/**
 * there are some custom configurations
 * doNotTriggerProgress: The request progress bar is not affected when the request is initiated or after the request is ended
 * errorsHandleCustom: Array<HTTP code> errors are not handled uniformly
 * handleTimeoutSelf: when error.code === 'ECONNABORTED', handle the error if self
 */
axios.interceptors.response.use(
  (response: CustomResponse) => {
    if (!response.config.doNotTriggerProgress) {
      setProgressBarDone()
    }
    if (response.data instanceof Blob) {
      return response
    }

    // Remove AbortController
    const controller = response.config.controller
    store.commit('REMOVE_ABORT_CONTROLLER', controller)
    return response.data || response.status
  },
  async (error: any) => {
    if (!error.config?.doNotTriggerProgress) {
      setProgressBarDone()
    }

    const t: (key: string) => string = (i18n.global as any).t
    //throttle concurrent responses with unique status code
    if (error.response) {
      if (error.response.data instanceof Blob) {
        error.response.data = await readBlobResponse(error.response.data)
      }

      const { data, status } = error.response

      if (!respSet.has(status)) {
        respSet.add(status)

        const doNotPopupAfterPwdChanged = status === 401 && store.state.afterCurrentUserPwdChanged
        if (isTokenExpired(status, data)) {
          if (doNotPopupAfterPwdChanged) {
            store.commit('SET_AFTER_CURRENT_USER_PWD_CHANGED', false)
          } else {
            ElNotification.error(t('Base.tokenExpiredMsg'))
          }
          toLogin()
          // reset set, otherwise will not popup error msg
          window.setTimeout(resetRespSet, 1000)
          return Promise.reject(error)
        }
        // some special cases
        const handleErrorSelf =
          error.config?.errorsHandleCustom &&
          Array.isArray(error.config.errorsHandleCustom) &&
          error.config.errorsHandleCustom.includes(status)
        if (!handleErrorSelf) {
          if (data.code === NAME_PWD_ERROR) {
            ElNotification.error(t('Base.namePwdError'))
          } else if (data.code === MFA_REQUIRED) {
            // do nothing, leave it to the page to do the rest of the processing
          } else {
            CustomMessage.error(getErrorMessage(data, status))
          }
        }

        if (status === 401) {
          toLogin()
        }
      }
    } else {
      const doNotPopupError = error.code === REQUEST_TIMEOUT_CODE && error.config.handleTimeoutSelf
      if (error.code === 'ERR_CANCELED' && error.message === 'canceled') {
        return Promise.reject(error)
      }
      if (!respSet.has(0)) {
        if (!doNotPopupError) {
          CustomMessage.error(t('Base.networkError'))
        }
        respSet.add(0)
      }
    }

    if (store.state.request_queue === 0) {
      respSet = new Set<number>()
    }
    throttle(resetRespSet, 2000, { trailing: false })
    // Remove AbortController
    const controller = error.config.controller
    store.commit('REMOVE_ABORT_CONTROLLER', controller)

    return Promise.reject(error)
  },
)

async function setProgressBarDone() {
  await store.dispatch('SET_REQ_CHANGE', false)
  const queueLen = store.state.request_queue
  if (queueLen > 0) {
    NProgress.inc()
  } else {
    NProgress.done()
  }
}

export default axios
