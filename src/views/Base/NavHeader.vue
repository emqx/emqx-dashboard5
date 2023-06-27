<template>
  <div class="nav-header" :style="{ left: leftBarCollapse ? '201px' : '80px' }">
    <h1 class="header-title">
      {{ !isNotFound ? $t(`components.${firstPath}`) : $t('Base.pageNotFound') }}
    </h1>
    <div class="pull-right">
      <el-button class="go-link" @click="downloadEnterprise" v-if="!IS_ENTERPRISE">
        {{ $t('Base.upgrade') }}<el-icon><right /></el-icon>
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
import { loadAlarm } from '@/api/common'
import { toLogin } from '@/router'
import { useStore } from 'vuex'
import { Right, Bell, Setting } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import useDocLink from '@/hooks/useDocLink'
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
  },
  setup() {
    const firstPath = ref('')
    const showSettings = ref(false)
    const showHelp = ref(false)
    const store = useStore()
    const { t } = useI18n()
    const route = useRoute()
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
    const isNotFound = ref(false)
    const setHeaderTitle = () => {
      let { path } = route || []
      let _firstPath = path.split('/')[1]
      firstPath.value = _firstPath
      isNotFound.value = route.matched?.[1]?.name === 'not-found'
    }
    watch(route, () => {
      setHeaderTitle()
    })
    const handleShowSettings = () => {
      showSettings.value = true
    }
    const handleShowHelp = () => {
      showHelp.value = true
    }
    loadData()
    setHeaderTitle()
    onMounted(() => {
      document.addEventListener('visibilitychange', visibilityChangeFunc)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('visibilitychange', visibilityChangeFunc)
    })
    return {
      IS_ENTERPRISE,
      showSettings,
      showHelp,
      store,
      isNotFound,
      firstPath,
      leftBarCollapse,
      alertCount,
      alertText,
      user,
      downloadEnterprise,
      handleDropdownCommand,
      logout,
      visibilityChangeFunc,
      handleShowSettings,
      handleShowHelp,
    }
  },
})
</script>

<style lang="scss" scoped>
.nav-header {
  box-shadow: 0px 2px 4px var(--color-shadow-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 24px;
  background-color: var(--color-bg-primary);
  left: 200px;
  z-index: 100;
  transition: all 0.3s;
  border-bottom: 1px solid var(--color-border-card);
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

.pull-right {
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  align-items: center;
}

.func-item {
  padding: 0 10px;
  transition: all 0.3s;
  cursor: pointer;
}

.el-badge {
  &:deep(.is-fixed.is-dot) {
    right: 5px;
    top: 3px;
  }
}

.el-button.go-link {
  background-color: var(--color-bg-primary);
  color: var(--color-title-primary);
  border: 1px solid var(--color-border-primary);
  margin-right: 12px;
  .el-icon {
    padding-left: 10px;
    width: 24px;
    height: 24px;
  }
  &:hover {
    background: var(--bg-hover);
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
  margin: 12px;
}
.el-icon.bell,
.el-icon.settings {
  color: var(--color-title-primary);
  font-size: 21px;
  width: 24px;
  height: 24px;
  position: relative;
  top: 1px;
}
.icon-question {
  color: var(--color-title-primary);
  font-size: 21px;
}
</style>
