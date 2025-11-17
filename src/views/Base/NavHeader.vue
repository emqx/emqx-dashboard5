<template>
  <div class="nav-header">
    <div class="logo">
      <img :src="appLogo" alt="emqx-logo" />
    </div>
    <Breadcrumb />
    <div class="pull-right">
      <LicensePromotion v-if="!isNamespaceUser" />
      <el-tooltip
        v-if="clusterDesc !== undefined"
        class="cluster-desc-tooltip"
        effect="dark"
        placement="bottom"
        :show-arrow="false"
      >
        <template #content>
          <div class="cluster-desc-tooltip-content">
            <span class="cluster-desc-tooltip-label">{{ t('Base.clusterDesc') }}:</span>
            <span class="cluster-desc-tooltip-text">{{ clusterDescDisplay }}</span>
          </div>
        </template>
        <div class="cluster-desc">
          <div class="cluster-desc-content">
            <span v-if="clusterDescTrimmed" class="cluster-desc-text">{{
              clusterDescTrimmed
            }}</span>
            <span v-else class="cluster-desc-placeholder">-</span>
          </div>
          <LinkButton class="is-link cluster-desc-edit" :to="{ name: 'cluster' }">
            <SquarePen class="w-4 h-4" />
          </LinkButton>
        </div>
      </el-tooltip>
      <div class="quick-panel-enter" @click="openQuickPanel">
        <div class="flex items-center gap-2">
          <Search :size="16" class="text-gray-400" />
          <span class="text-sm">{{ t('Base.quickFind') }}</span>
        </div>
        <div class="flex items-center gap-1">
          <kbd class="kbd-key" v-if="isMac">⌘</kbd>
          <kbd class="kbd-key" v-else>Ctrl</kbd>
          <kbd class="kbd-key">K</kbd>
        </div>
      </div>

      <el-button class="go-link" v-if="isEvaluationLicense" @click="routeToContactUs">
        {{ $t('Base.contactUs') }}<ArrowRight class="arrow-icon" />
      </el-button>
      <el-tooltip effect="dark" :content="alertText" placement="bottom" :show-arrow="false">
        <div class="func-item">
          <el-badge :is-dot="!!alertCount">
            <router-link class="link-alarm" to="/alarm">
              <Bell class="bell" />
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
        <div class="func-item">
          <a href="javascript:;" @click="handleShowHelp" class="link-help">
            <HelpCircle class="icon-question" />
          </a>
        </div>
      </el-tooltip>

      <el-tooltip
        effect="dark"
        :content="$t('components.settings')"
        placement="bottom"
        :show-arrow="false"
      >
        <el-dropdown trigger="click" :hide-on-click="false">
          <div class="func-item settings-trigger">
            <SettingsIcon class="settings" />
          </div>
          <template #dropdown>
            <el-dropdown-menu class="settings-dropdown-menu">
              <Settings />
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>

      <el-dropdown placement="bottom" @command="handleDropdownCommand" popper-class="user-dropdown">
        <div class="func-item user-menu-trigger">
          <span class="user-avatar">{{ user.username?.substr(0, 1).toUpperCase() }}</span>
          <ChevronDown class="w-4 h-4" />
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled class="user-info-item">
              <div class="flex items-center gap-2">
                <span class="user-avatar-small">
                  {{ user.username?.substr(0, 1).toUpperCase() }}
                </span>
                <span class="font-medium">{{ user.username }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided command="users">
              <Users class="w-4 h-4 mr-2" />
              {{ $t('components.usersManagement') }}
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              <LogOut class="w-4 h-4 mr-2" />
              {{ $t('components.logOut') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <help v-model="showHelp" />
  </div>
</template>

<script lang="ts" setup>
import { getClusterNodes, loadAlarm } from '@/api/common'
import Settings from '../Settings/Settings.vue'
import {
  SquarePen,
  Search,
  ArrowRight,
  Bell,
  HelpCircle,
  Settings as SettingsIcon,
  ChevronDown,
  Users,
  LogOut,
} from 'lucide-vue-next'
import Help from '../Settings/Help.vue'
import LicensePromotion from '@/components/LicensePromotion.vue'
import Breadcrumb from './Breadcrumb.vue'

const emit = defineEmits<{
  (e: 'open-quick-panel'): void
}>()

const showHelp = ref(false)
const store = useStore()
const { t } = useI18n()
const router = useRouter()
const { docMap } = useDocLink()

const { appLogo } = useEditionConfigs()

const alertCount = computed(() => store.state.alertCount)
const clusterDesc = computed(() => store.state.clusterDesc)
const clusterDescTrimmed = computed(() => {
  const rawDesc = clusterDesc.value ?? ''
  return rawDesc.toString().trim()
})
const clusterDescDisplay = computed(() => {
  return clusterDescTrimmed.value || '-'
})
const user = computed(() => {
  return store.state.user
})
const alertText = computed(() => {
  return alertCount.value > 0
    ? `${t('components.theSystemHas')} ${alertCount.value} ${t('components.noteAlertClickView')}`
    : t('components.noWarning')
})
const isEvaluationLicense = computed(() => store.getters.isEvaluationLicense)
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)

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
const getClusterDesc = async () => {
  const { description } = await getClusterNodes()
  store.commit('SET_CLUSTER_DESC', description)
}
getClusterDesc()
const { handleLogOut } = useLogOut()
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
        await handleLogOut()
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

const routeToContactUs = () => {
  const windowUrl = window.open(docMap.contactUs)
  if (windowUrl) {
    windowUrl.opener = null
  }
}

const handleShowHelp = () => {
  showHelp.value = true
}

const isMac = computed(() => /Mac/.test(navigator.userAgent))
const openQuickPanel = () => {
  emit('open-quick-panel')
}
loadData()
onMounted(() => {
  document.addEventListener('visibilitychange', visibilityChangeFunc)
})
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', visibilityChangeFunc)
})
</script>

<style lang="scss" scoped>
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding-right: 24px;
  padding-left: 19px;
  left: 200px;
  z-index: 100;
  transition: all 0.3s;
  .user-menu-trigger {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    &:focus,
    &:focus-visible {
      outline: none;
    }
  }

  .user-avatar {
    width: 28px;
    height: 28px;
    background: var(--color-border-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 400;
    border-radius: 50%;
  }

  .user-avatar-small {
    width: 28px;
    height: 28px;
    background: var(--color-border-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 400;
    border-radius: 50%;
  }

  .user-info-item {
    cursor: default !important;
    &:hover {
      background: transparent !important;
    }
  }

  .el-dropdown {
    &:focus,
    &:focus-visible {
      outline: none;
    }
  }
}

.logo {
  background-color: var(--color-bg);
  overflow: hidden;
  z-index: 100;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  margin-right: 12px;
  img {
    max-width: initial;
    max-height: 100%;
    height: 26px;
  }
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
  width: 200px;
  padding: 6px 12px;
  margin-right: 16px;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  border: 1px solid var(--color-border-card);
  background: var(--color-bg-content);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(61, 127, 249, 0.1);
  }

  .kbd-key {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    line-height: 1;
    color: var(--color-text-secondary);
    background: var(--color-bg-split);
    border: 1px solid var(--color-border-card);
    border-radius: 4px;
    box-shadow: 0 1px 0 0 var(--color-border-card);
  }
}

.cluster-desc {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;
  padding: 0 8px;
  height: 32px;
  min-width: 0;
  border-radius: 6px;
  border: 1px solid var(--color-border-card);
  background: var(--color-bg-content);
  cursor: default;
  .cluster-desc-edit {
    margin-left: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    color: var(--color-text-secondary);
    transition:
      color 0.2s,
      background-color 0.2s;
    &:hover {
      color: var(--color-primary);
      background-color: var(--color-primary-soft);
    }
  }
}
.cluster-desc-content {
  display: flex;
  align-items: center;
  flex: 0 0 150px;
  width: 150px;
  min-width: 0;
}
.cluster-desc-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cluster-desc-placeholder {
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.cluster-desc-tooltip {
  display: inline-flex;
  align-items: center;
  height: 32px;
}

.cluster-desc-tooltip-content {
  max-width: 320px;
}

.cluster-desc-tooltip-label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}

.cluster-desc-tooltip-text {
  white-space: normal;
  word-break: break-word;
}

.func-item {
  padding: 0 10px;
  transition: all 0.3s;
  cursor: pointer;
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
  border: 1px solid var(--color-border-primary);
  margin-right: 12px;
  .arrow-icon {
    padding-left: 10px;
    width: 16px;
    height: 16px;
  }
  &:hover {
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }
}
.link-alarm {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}
.settings-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
}
.link-help {
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}
.bell,
.settings,
.icon-question {
  font-size: 20px;
  width: 20px;
  height: 20px;
  color: inherit;
}
</style>

<style lang="scss">
.user-dropdown {
  .el-dropdown-menu {
    min-width: 200px !important;
  }

  .el-dropdown-menu__item {
    padding: 10px 16px !important;
    display: flex;
    align-items: center;

    &:focus,
    &:focus-visible {
      outline: none;
    }
  }
}
</style>
