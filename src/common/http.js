import axios from 'axios'
import { ElMessage as M, ElNotification } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { toLogin } from '@/router'
import store from '@/store'
import _ from 'lodash'
import { REQUEST_TIMEOUT_CODE, BAD_TOKEN_CODE } from '@/common/constants'
import i18n from '@/i18n'

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })
let respSet = new Set()

Object.assign(axios.defaults, {
  baseURL: 'api/v5',
  timeout: 20000,
})

axios.interceptors.request.use(
  (config) => {
    const { user } = store.state
    config.headers = {
      Authorization: 'Bearer ' + user.token,
    }
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

const isTokenExpired = (status, data) => status === 401 && data.code === BAD_TOKEN_CODE

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
    if (/\/trace\/.+\/download/.test(response.config.url)) {
      return response
    }
    return response.data || response.status
  },
  (error) => {
    if (!error.config.doNotTriggerProgress) {
      setProgressBarDone()
    }

    //throttle concurrent responses with unique status code
    if (error.response) {
      let { data, status } = error.response

      if (!respSet.has(status)) {
        respSet.add(status)

        if (isTokenExpired(status, data)) {
          ElNotification.error(i18n.global.t('Base.tokenExpiredMsg'))
          toLogin()
          return
        }
        // some special cases
        const handleErrorSelf =
          error.config?.errorsHandleCustom &&
          Array.isArray(error.config.errorsHandleCustom) &&
          error.config.errorsHandleCustom.includes(status)
        const doNotPopupAfterPwdChanged = status === 401 && store.state.afterCurrentUserPwdChanged
        const doNotPopup = handleErrorSelf || doNotPopupAfterPwdChanged
        if (doNotPopup) {
          if (doNotPopupAfterPwdChanged) {
            store.commit('SET_AFTER_CURRENT_USER_PWD_CHANGED', false)
          }
        } else if (data?.code || data?.message) {
          M.error(status + ' ' + data?.code + ':' + data?.message.toString())
        } else {
          M.error(status + ' Network error')
        }

        if (status === 401) {
          toLogin()
        }
      }
    } else {
      const doNotPopupError = error.code === REQUEST_TIMEOUT_CODE && error.config.handleTimeoutSelf
      if (!respSet.has(0)) {
        if (!doNotPopupError) {
          M.error('Some error occurred')
        }
        respSet.add(0)
      }
    }

    if (store.state.request_queue === 0) respSet = new Set()
    _.throttle(
      () => {
        respSet = new Set()
      },
      2000,
      { trailing: false },
    )

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
