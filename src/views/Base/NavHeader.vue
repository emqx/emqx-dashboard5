<template>
  <div class="nav-header">
    <div class="header-left">
      <router-link :class="['logo']" to="/">
        <img src="@/assets/img/tongtech.svg" alt="emqx-logo" />
      </router-link>
      <h1 class="header-title">{{ title }}</h1>
    </div>
    <div class="pull-right">
      <div class="quick-panel-enter" @click="openQuickPanel">
        <div class="enter-hd">
          <el-icon :size="16"><Search /></el-icon>
          <span>{{ t('Base.quickFind') }}</span>
        </div>
        <div class="enter-ft">
          <span class="icon-key is-cmd" v-if="isMac">⌘</span>
          <span class="icon-key" v-else>Ctrl</span>
          <span class="icon-key">K</span>
        </div>
      </div>
      <el-button class="go-link" v-if="isEvaluationLicense" @click="routeToContactUs">
        {{ $t('Base.contactUs') }}<el-icon><right /></el-icon>
      </el-button>
      <el-tooltip effect="dark" :content="alertText" placement="bottom" :show-arrow="false">
        <div class="func-item">
          <el-badge :is-dot="!!alertCount">
            <router-link class="link-alarm" to="/alarm">
              <el-icon class="bell"><bell /></el-icon>
            </router-link>
          </el-badge>
        </div>
      </el-tooltip>

      <el-tooltip
        effect="dark"
        :content="$t('components.help')"
        placement="bottom"
        :show-arrow="false"
      >
        <a href="javascript:;" @click="handleShowHelp" class="link-help">
          <i class="iconfont icon-question"></i>
        </a>
      </el-tooltip>

      <el-tooltip
        effect="dark"
        :content="$t('components.settings')"
        placement="bottom"
        :show-arrow="false"
      >
        <div class="func-item">
          <a class="settings-alarm" href="javascript:;" @click="handleShowSettings">
            <el-icon class="settings"><Setting /></el-icon>
          </a>
        </div>
      </el-tooltip>

      <el-dropdown placement="bottom" @command="handleDropdownCommand">
        <div class="func-item">
          <span class="user-avatar">{{ user.username?.substr(0, 1).toUpperCase() }}</span>
          <span>{{ user.username }}</span>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="users">
              {{ $t('components.usersManagement') }}
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              {{ $t('components.logOut') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <settings v-model="showSettings" />
    <help v-model="showHelp" />
  </div>
</template>

<script lang="ts">
import { loadAlarm, logout as queryLogout } from '@/api/common'
import { toLogin } from '@/router'
import { useStore } from 'vuex'
import { Right, Bell, Setting, Search } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useDocLink from '@/hooks/useDocLink'
import useEditionConfigs from '@/hooks/useEditionConfigs'
import { IS_ENTERPRISE } from '@/common/constants'
import Settings from '../Settings/Settings.vue'
import Help from '../Settings/Help.vue'

export default defineComponent({
  name: 'NavHeader',
  components: {
    Right,
    Bell,
    Setting,
    Settings,
    Help,
    Search,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  setup(props, ctx) {
    const { appLogo } = useEditionConfigs()
    const showSettings = ref(false)
    const showHelp = ref(false)
    const store = useStore()
    const { t } = useI18n()
    const router = useRouter()
    const alertCount = computed(() => {
      return store.state.alertCount
    })
    const leftBarCollapse = computed(() => {
      return store.state.leftBarCollapse
    })
    const user = computed(() => {
      return store.state.user
    })
    const alertText = computed(() => {
      return alertCount.value > 0
        ? `${t('components.theSystemHas')} ${alertCount.value} ${t(
            'components.noteAlertClickView',
          )}`
        : t('components.noWarning')
    })
    const isEvaluationLicense = computed(() => store.getters.isEvaluationLicense)

    const visibilityChangeFunc = () => {
      return document.visibilityState === 'visible' && loadData()
    }

    const loadData = async () => {
      try {
        const { data } = await loadAlarm()
        store.dispatch('SET_ALERT_COUNT', (data || []).length)
      } catch (error) {
        //
      }
    }
    const logout = () => {
      ElMessageBox.confirm(t('components.whetherToLogOutOrNot'), {
        confirmButtonText: t('components.signOut'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action !== 'confirm') {
            done()
            return
          }

          instance.confirmButtonLoading = true

          try {
            const { user, loginBackend } = store.state
            await queryLogout(user.username, loginBackend)
            toLogin()
            ElNotification.success(t('components.loggedOut'))
            done()
          } catch (error) {
            instance.confirmButtonLoading = false
            instance.confirmButtonText = t('components.signOut')
            done()
          }
        },
      })
    }

    const handleDropdownCommand = (command: string) => {
      if (!command) {
        return
      }
      if (command === 'logout') {
        return logout()
      }
      router.currentRoute.value.name !== command && router.push({ name: command })
    }
    const { docMap } = useDocLink()
    const routeToContactUs = () => {
      const windowUrl = window.open(docMap.contactUs)
      if (windowUrl) {
        windowUrl.opener = null
      }
    }
    const handleShowSettings = () => {
      showSettings.value = true
    }
    const handleShowHelp = () => {
      showHelp.value = true
    }

    const isMac = computed(() => /Mac/.test(navigator.userAgent))
    const openQuickPanel = () => {
      ctx.emit('open-quick-panel')
    }
    loadData()
    onMounted(() => {
      document.addEventListener('visibilitychange', visibilityChangeFunc)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('visibilitychange', visibilityChangeFunc)
    })
    return {
      t,
      IS_ENTERPRISE,
      appLogo,
      showSettings,
      showHelp,
      store,
      leftBarCollapse,
      alertCount,
      alertText,
      user,
      isEvaluationLicense,
      routeToContactUs,
      handleDropdownCommand,
      logout,
      visibilityChangeFunc,
      handleShowSettings,
      handleShowHelp,
      isMac,
      openQuickPanel,
    }
  },
})
</script>

<style lang="scss" scoped>
$header-heigh: 52px;

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $header-heigh;
  padding: 0 12px 0 8px;
  background-color: #272e3d;
  left: 200px;
  z-index: 100;
  transition: all 0.3s;
  .user-avatar {
    width: 21px;
    height: 21px;
    background: var(--color-blue-grey);
    color: #fff;
    display: inline-block;
    text-align: center;
    line-height: 21px;
    border-radius: 50%;
    margin-right: 10px;
    margin-left: 4px;
  }
}

.logo {
  height: $header-heigh;
  line-height: $header-heigh;
  top: 0;
  left: 0;
  margin-right: 16px;
  z-index: 100;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  img {
    max-width: initial;
    max-height: 100%;
    height: 36px;
    transition: all 0.3s;
  }
}

.header-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.header-title {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 22px;
  color: #fff;
}

.pull-right {
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  align-items: center;
}

.quick-panel-enter {
  display: flex;
  height: 32px;
  width: 360px;
  padding: 4px 16px;
  margin-right: 20px;
  justify-content: space-between;
  align-items: center;
  border: 1px solid transparent;
  background: #27353e;
  color: #a7abb1;
  cursor: pointer;
  font-family: 'PingFang SC';
  &:hover {
    border-color: var(--color-primary);
  }
  .enter-hd,
  .enter-ft {
    display: flex;
    align-items: center;
  }
  .enter-hd {
    font-size: 14px;
    .el-icon {
      margin-right: 10px;
      color: #fff;
    }
  }
  .icon-key {
    height: 20px;
    min-width: 20px;
    padding: 4px;
    margin-left: 4px;
    text-align: center;
    line-height: 1;
    font-size: 11px;
    color: #fff;
    background: rgba(255, 255, 255, 0.14);
    &.is-cmd {
      font-size: 12px;
    }
  }
}

.func-item {
  padding: 0 9px;
  transition: all 0.3s;
  cursor: pointer;
  color: #fff;
}

.el-badge {
  &:deep(.is-fixed) {
    right: 5px;
    top: 3px;
    width: 8px;
    height: 8px;
    padding: 0;
  }
}

.el-button.go-link {
  background-color: transparent;
  color: #fff;
  border: 1px solid var(--color-border-primary);
  margin-right: 9px;
  .el-icon {
    padding-left: 10px;
    width: 24px;
    height: 24px;
  }
  &:hover {
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }
}
.link-alarm,
.settings-alarm {
  width: 24px;
  height: 24px;
  display: inline-block;
}
.link-help {
  margin: 9px;
}
.el-icon.bell,
.el-icon.settings {
  color: #fff;
  font-size: 21px;
  width: 24px;
  height: 24px;
  position: relative;
  top: 1px;
}
.icon-question {
  color: #fff;
  font-size: 21px;
}
</style>
