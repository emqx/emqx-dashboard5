<template>
  <div class="nav-header" :style="{ left: leftBarCollapse ? '201px' : '80px' }">
    <h1 class="header-title">{{ title }}</h1>
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
      <el-button class="go-link" @click="downloadEnterprise" v-if="!IS_ENTERPRISE">
        {{ $t('Base.upgrade') }}<el-icon><right /></el-icon>
      </el-button>

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
import { toLogin } from '@/router'
import { Right, Setting, Search } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import useDocLink from '@/hooks/useDocLink'
import { IS_ENTERPRISE } from '@/common/constants'
import Settings from '../Settings/Settings.vue'
import Help from '../Settings/Help.vue'

export default defineComponent({
  name: 'NavHeader',
  components: {
    Right,
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
    const showSettings = ref(false)
    const showHelp = ref(false)
    const store = useStore()
    const { t } = useI18n()
    const router = useRouter()
    const leftBarCollapse = computed(() => {
      return store.state.leftBarCollapse
    })
    const user = computed(() => {
      return store.state.user
    })

    const logout = () => {
      ElMessageBox.confirm(t('components.whetherToLogOutOrNot'), {
        confirmButtonText: t('components.signOut'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
        .then(() => {
          ElNotification.success(t('components.loggedOut'))
          toLogin()
        })
        .catch(() => {
          // do nothing
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
    const downloadEnterprise = () => {
      const windowUrl = window.open(docMap.upgrade)
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

    return {
      t,
      IS_ENTERPRISE,
      showSettings,
      showHelp,
      store,
      leftBarCollapse,
      user,
      downloadEnterprise,
      handleDropdownCommand,
      logout,
      handleShowSettings,
      handleShowHelp,
      isMac,
      openQuickPanel,
    }
  },
})
</script>

<style lang="scss" scoped>
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 24px;
  background-color: var(--color-bg);
  left: 200px;
  z-index: 100;
  transition: all 0.3s;
  .user-avatar {
    width: 21px;
    height: 21px;
    background: var(--color-stream);
    color: #fff;
    display: inline-block;
    text-align: center;
    line-height: 21px;
    border-radius: 50%;
    margin-right: 10px;
    margin-left: 4px;
  }
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
  margin-right: 24px;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
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
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.14);
    &.is-cmd {
      font-size: 12px;
    }
  }
}

.func-item {
  padding: 0 10px;
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
  margin-right: 12px;
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
.settings-alarm {
  width: 24px;
  height: 24px;
  display: inline-block;
}
.link-help {
  margin: 12px;
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
