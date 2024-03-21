import { getUser, removeUser, setUser } from '@/common/auth'
import { UserInfo } from '@/types/common'
import { LicenseData } from '@/types/dashboard'
import { LicenseCustomerType } from '@/types/enum'
import { RuleEvent } from '@/types/rule'
import { createStore } from 'vuex'

const getLang = () => {
  let lang = localStorage.getItem('language')
  if (!lang) {
    lang = navigator.language.startsWith('zh') ? 'zh' : 'en'
    localStorage.setItem('language', lang)
  }
  return lang
}

const getTheme = () => {
  const theme = localStorage.getItem('theme')
  if (theme && ['light', 'dark'].includes(theme)) {
    return theme
  }
  return 'light'
}

const getSyncOSTheme = () => {
  const syncOsTheme = localStorage.getItem('syncOsTheme') || 'true'
  if (syncOsTheme === 'undefined') {
    return true
  }
  return JSON.parse(syncOsTheme)
}

const getLeftBarCollapse = () => {
  const leftBarCollapse = localStorage.getItem('leftBarCollapse') || 'true'
  if (leftBarCollapse === 'undefined') {
    return true
  }
  return JSON.parse(leftBarCollapse)
}

const getHideLeftMenu = () => sessionStorage.getItem('hideLeftMenu') === 'true'

const getLoginBackend = () => {
  const loginBackend = localStorage.getItem('loginBackend') || 'local'
  if (loginBackend === 'undefined') {
    return 'local'
  }
  return loginBackend
}

export default createStore({
  state: {
    user: (getUser() || {}) as UserInfo,
    theme: getTheme(),
    syncOsTheme: getSyncOSTheme(),
    lang: getLang(),
    leftBarCollapse: getLeftBarCollapse(),
    hideLeftMenu: getHideLeftMenu(),
    alertCount: 0,
    request_queue: 0,
    edition: localStorage.getItem('edition'),
    afterCurrentUserPwdChanged: false,
    schemaStoreMap: new Map(),
    licenseData: {} as LicenseData,
    ruleEventList: [] as Array<RuleEvent>,
    ruleEventRequest: undefined as undefined | Promise<any>,
    abortControllers: [] as AbortController[],
    loginBackend: getLoginBackend(),
  },
  actions: {
    SET_ALERT_COUNT({ commit }, count = 0) {
      commit('SET_ALERT_COUNT', count)
    },
    SET_LANGUAGE({ commit }, lang) {
      commit('SET_LANGUAGE', lang)
    },
    SET_LEFT_BAR_COLLAPSE({ commit }, collapse = false) {
      commit('SET_LEFT_BAR_COLLAPSE', !!collapse)
    },
    UPDATE_USER_INFO({ commit }, userInfo = {}) {
      commit('UPDATE_USER_INFO', userInfo)
    },
    SET_REQ_CHANGE({ commit }, addOrDone = true) {
      commit('SET_REQ_CHANGE', !!addOrDone)
    },
    UPDATE_SETTINGS({ commit }, settings = {}) {
      commit('UPDATE_SETTINGS', settings)
    },
    UPDATE_LOGIN_BACKEND({ commit }, loginBackend) {
      commit('UPDATE_LOGIN_BACKEND', loginBackend)
    },
  },
  mutations: {
    SET_ALERT_COUNT(state, count) {
      state.alertCount = count
    },
    UPDATE_USER_INFO(state, userInfo) {
      const { logOut = false } = userInfo
      if (logOut) {
        removeUser()
      } else {
        setUser(userInfo)
      }
      state.user = userInfo
    },
    SET_LEFT_BAR_COLLAPSE(state, collapse) {
      localStorage.setItem('leftBarCollapse', !!collapse as any)
      state.leftBarCollapse = !!collapse
    },
    SET_HIDE_LEFT_MENU(state, hide: boolean) {
      sessionStorage.setItem('hideLeftMenu', hide ? 'true' : 'false')
      state.hideLeftMenu = hide
    },
    SET_LANGUAGE(state, lang) {
      localStorage.setItem('language', lang)
      lang ?? localStorage.removeItem('language')
      if (lang && state.lang !== lang) {
        location.reload()
      }
    },
    UPDATE_LOGIN_BACKEND(state, loginBackend) {
      loginBackend
        ? localStorage.setItem('loginBackend', loginBackend)
        : localStorage.removeItem('loginBackend')
      state.loginBackend = loginBackend
    },
    SET_REQ_CHANGE(state, addOrDone) {
      addOrDone ? ++state.request_queue : --state.request_queue
    },
    UPDATE_EDITION(state, edition) {
      edition ? localStorage.setItem('edition', edition) : localStorage.removeItem('edition')
      state.edition = edition
    },
    UPDATE_SETTINGS(state, { lang, theme, syncOsTheme }) {
      localStorage.setItem('language', lang ?? state.lang)
      localStorage.setItem('theme', theme ?? state.theme)
      localStorage.setItem('syncOsTheme', JSON.stringify(syncOsTheme))
      if (
        (lang && state.lang !== lang) ||
        (theme && state.theme !== theme) ||
        state.syncOsTheme !== syncOsTheme
      ) {
        state.lang = lang ?? state.lang
        state.theme = theme ?? state.theme
        state.syncOsTheme = syncOsTheme
        location.reload()
      }
    },
    SET_AFTER_CURRENT_USER_PWD_CHANGED(state, payload: boolean) {
      state.afterCurrentUserPwdChanged = payload
    },
    SET_SCHEMA_DATA(state, payload: { key: string; data: any }) {
      state.schemaStoreMap.set(payload.key, payload.data)
    },
    SET_LICENSE_DATA(state, license: LicenseData) {
      state.licenseData = license
    },
    SET_RULE_EVENT_LIST(state, payload: RuleEvent[]) {
      state.ruleEventList = payload
    },
    SET_RULE_EVENT_REQUEST(state, payload: Promise<any>) {
      state.ruleEventRequest = payload
    },
    ADD_ABORT_CONTROLLER(state, controller) {
      state.abortControllers.push(controller)
    },
    CLEAR_ABORT_CONTROLLERS(state) {
      state.abortControllers.forEach((controller) => {
        controller.abort()
      })
      state.abortControllers = []
    },
    REMOVE_ABORT_CONTROLLER(state, controller: AbortController) {
      const index = state.abortControllers.indexOf(controller)
      if (index !== -1) {
        state.abortControllers.splice(index, 1)
      }
    },
  },
  getters: {
    edition: (state) => {
      const { edition } = state
      if (!edition) return 0b10 //default to broker
      const e = String(edition).toLowerCase()
      return e == 'enterprise' ? 0b01 : 0b10
    },
    isDev() {
      return process.env.NODE_ENV === 'development'
    },
    getSchema(state) {
      return (key: string) => {
        return state.schemaStoreMap.get(key)
      }
    },
    isEvaluationLicense(state) {
      return state.licenseData.customer_type === LicenseCustomerType.Evaluation
    },
  },
})
