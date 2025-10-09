<template>
  <div class="nav-header">
    <div class="logo">
      <img :src="appLogo" alt="emqx-logo" />
    </div>
    <Breadcrumb />
    <div class="pull-right">
      <LicensePromotion v-if="!isNamespaceUser" />
      <div class="cluster-desc" v-if="clusterDesc">
        <span class="cluster-desc-label">{{ t('Base.clusterDesc') }}:</span>
        <div v-if="clusterDesc" class="cluster-desc-content">
          <CommonOverflowTooltip :content="clusterDesc" />
        </div>
        <span v-else>-</span>
        <LinkButton class="is-link" :to="{ name: 'cluster' }" :icon="Edit" />
      </div>
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
        <el-dropdown trigger="click" :hide-on-click="false">
          <div class="func-item settings-trigger">
            <el-icon class="settings"><Setting /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="settings-dropdown-menu">
              <Settings />
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
    <help v-model="showHelp" />
  </div>
</template>

<script lang="ts" setup>
import { getClusterNodes, loadAlarm } from '@/api/common'
import { Right, Bell, Setting, Search, Edit } from '@element-plus/icons-vue'
import Settings from '../Settings/Settings.vue'
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
  .user-avatar {
    width: 32px;
    height: 32px;
    background: var(--color-border-primary);
    display: inline-block;
    text-align: center;
    line-height: 32px;
    border-radius: 50%;
    margin-right: 10px;
    margin-left: 4px;
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
  height: 26px;
  width: 240px;
  padding: 4px 16px;
  margin-right: 16px;
  justify-content: space-between;
  align-items: center;
  border-radius: var(--el-border-radius-base);
  border: 1px solid transparent;
  background: var(--color-primary-card-bg);
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
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.14);
    &.is-cmd {
      font-size: 12px;
    }
  }
}

.cluster-desc {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 4px;
  text-align: right;
  cursor: default;
  .cluster-desc-label {
    margin-right: 4px;
  }
  .is-link {
    color: inherit;
  }
}
.cluster-desc-content {
  max-width: 100px;
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
.link-alarm {
  width: 24px;
  height: 24px;
  display: inline-block;
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
  margin: 12px;
}
.el-icon.bell,
.el-icon.settings {
  font-size: 21px;
  width: 24px;
  height: 24px;
  position: relative;
  top: 1px;
}
.icon-question {
  font-size: 21px;
}
</style>
