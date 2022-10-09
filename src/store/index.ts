import { createStore } from 'vuex'

const getLang = () => {
  const lang = localStorage.getItem('language')
  if (lang && ['zh', 'en'].includes(lang)) {
    return lang
  }
  return 'en'
}

const getTheme = () => {
  const theme = localStorage.getItem('theme')
  if (theme && ['light', 'dark'].includes(theme)) {
    return theme
  }
  return 'dark'
}

const getSyncOSTheme = () => {
  const syncOsTheme = localStorage.getItem('syncOsTheme') || 'false'
  if (syncOsTheme === 'undefined') {
    return false
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

export default createStore({
  state: {
    user: JSON.parse(<string>localStorage.getItem('user') || '{}') || {},
    theme: getTheme(),
    syncOsTheme: getSyncOSTheme(),
    lang: getLang(),
    leftBarCollapse: getLeftBarCollapse(),
    alertCount: 0,
    selectedModule: JSON.parse(<string>localStorage.getItem('selectedModule')),
    request_queue: 0,
    edition: localStorage.getItem('edition'),
    afterCurrentUserPwdChanged: false,
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
  },
  mutations: {
    SET_ALERT_COUNT(state, count) {
      state.alertCount = count
    },
    UPDATE_USER_INFO(state, userInfo) {
      const { logOut = false } = userInfo
      if (logOut) {
        localStorage.removeItem('user')
      } else {
        localStorage.setItem('user', JSON.stringify(userInfo))
      }
      state.user = userInfo
    },
    SET_LEFT_BAR_COLLAPSE(state, collapse) {
      localStorage.setItem('leftBarCollapse', !!collapse as any)
      state.leftBarCollapse = !!collapse
    },
    SET_LANGUAGE(state, lang) {
      localStorage.setItem('language', lang)
      lang ?? localStorage.removeItem('language')
      if (lang && state.lang !== lang) {
        location.reload()
      }
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
  },
})
