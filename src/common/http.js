import axios from 'axios'
import { ElNotification } from 'element-plus'
import CustomMessage from '@/common/CustomMessage'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { toLogin } from '@/router'
import store from '@/store'
import { stringifyObjSafely } from '@emqx/shared-ui-utils'
import _ from 'lodash'
import { API_BASE_URL, REQUEST_TIMEOUT_CODE } from '@/common/constants'
import { BAD_TOKEN, TOKEN_TIME_OUT, NAME_PWD_ERROR } from '@/common/customErrorCode'
import i18n from '@/i18n'

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })
let respSet = new Set()
const resetRespSet = () => (respSet = new Set())

Object.assign(axios.defaults, {
  baseURL: API_BASE_URL,
  timeout: 20000,
})

axios.interceptors.request.use(
  (config) => {
    const { user } = store.state
    config.headers = {
      Authorization: 'Bearer ' + user.token,
    }
    const controller = new AbortController()
    config.signal = controller.signal
    config.controller = controller
    store.commit('ADD_ABORT_CONTROLLER', controller)
    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

axios.interceptors.request.use(async (config) => {
  if (!config.doNotTriggerProgress) {
    if (!store.state.request_queue) {
      NProgress.start()
    }
    await store.dispatch('SET_REQ_CHANGE', true)
  }
  return config
})

const isTokenExpired = (status, data) =>
  status === 401 && [BAD_TOKEN, TOKEN_TIME_OUT].includes(data.code)

const readBlobResponse = async (data) => {
  try {
    const ret = await data.text()
    return JSON.parse(ret)
  } catch (error) {
    return {}
  }
}

const getErrorMessage = (data, status) => {
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
  (response) => {
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
  async (error) => {
    if (!error.config.doNotTriggerProgress) {
      setProgressBarDone()
    }

    //throttle concurrent responses with unique status code
    if (error.response) {
      if (error.response.data instanceof Blob) {
        error.response.data = await readBlobResponse(error.response.data)
      }

      let { data, status } = error.response

      if (!respSet.has(status)) {
        respSet.add(status)

        const doNotPopupAfterPwdChanged = status === 401 && store.state.afterCurrentUserPwdChanged
        if (isTokenExpired(status, data)) {
          if (doNotPopupAfterPwdChanged) {
            store.commit('SET_AFTER_CURRENT_USER_PWD_CHANGED', false)
          } else {
            ElNotification.error(i18n.global.t('Base.tokenExpiredMsg'))
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
            ElNotification.error(i18n.global.t('Base.namePwdError'))
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
          CustomMessage.error(i18n.global.t('Base.networkError'))
        }
        respSet.add(0)
      }
    }

    if (store.state.request_queue === 0) respSet = new Set()
    _.throttle(resetRespSet, 2000, { trailing: false })
    // Remove AbortController
    const controller = error.config.controller
    store.commit('REMOVE_ABORT_CONTROLLER', controller)

    return Promise.reject(error)
  },
)

async function setProgressBarDone() {
  await store.dispatch('SET_REQ_CHANGE', false)
  let queueLen = store.state.request_queue
  if (queueLen > 0) {
    NProgress.inc()
  } else {
    NProgress.done()
  }
}

export default axios
