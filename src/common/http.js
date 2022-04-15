import axios from 'axios'
import { ElMessage as M } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { toLogin } from '@/router'
import store from '@/store'
import _ from 'lodash'

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })
let respSet = new Set()

Object.assign(axios.defaults, {
  baseURL: '/api/v5',
  timeout: 20000,
})

axios.interceptors.request.use(
  (config) => {
    const { user } = store.state
    if (user.token) {
      config.headers = {
        Authorization: 'Bearer ' + user.token,
      }
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
        if (status === 404 && error.config.handle404Self);
        else if (data?.code || data?.message)
          M.error(status + ' ' + data?.code + ':' + data?.message)
        else M.error(status + ' Network error')

        if (status === 401) {
          toLogin()
        }
      }
    } else {
      if (!respSet.has(0)) {
        M.error('Some error occurred')
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
