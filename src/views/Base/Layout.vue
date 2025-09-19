<template>
  <el-container class="layout">
    <el-header>
      <nav-header
        :title="!isNotFound ? $t(`components.${firstPath}`) : $t('Base.pageNotFound')"
        @open-quick-panel="openQuickPanel"
      />
    </el-header>
    <el-container class="main">
      <el-aside :style="asideStyle">
        <LeftBar />
        <div class="footer-menu" :style="footMenuStyle">
          <div
            class="footer-menu-item"
            @click="
              () => {
                store.dispatch('SET_LEFT_BAR_COLLAPSE', !leftBarCollapse)
              }
            "
          >
            <i :class="['iconfont', 'icon-fold', leftBarCollapse ? 'rotate' : '']"></i>
            <EMQXVersion v-show="!leftBarCollapse" />
          </div>
        </div>
      </el-aside>
      <el-main :style="elMainStyle">
        <div class="main-content">
          <el-scrollbar>
            <el-menu
              v-if="hasSubMenu && showSubMenu"
              :ellipsis="false"
              :default-active="defaultSubMenu"
              :key="defaultSubMenu"
              mode="horizontal"
              router
              class="top-submenu"
            >
              <template
                v-for="route in topLvRoute.children"
                :key="topLvRoute.path + '/' + route.path"
              >
                <el-menu-item
                  v-if="!route.meta?.hideInMenu"
                  :index="topLvRoute.path + '/' + route.path"
                >
                  {{ $t(`components.${route.name}`) }}
                </el-menu-item>
              </template>
            </el-menu>
            <div :class="{ 'is-full-height': fullHeight }">
              <router-view v-slot="{ Component, route }">
                <KeepAlive>
                  <component v-if="keepAlive" :is="Component" :key="route.fullPath" />
                </KeepAlive>
              </router-view>
              <router-view v-if="!keepAlive" />
            </div>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
  </el-container>
  <LicenseTipDialog
    v-model="showLicenseTipDialog"
    :max-sessions="store.state.licenseData.max_sessions"
  />
  <QuickPanel v-model="showQuickPanel" />
</template>

<script lang="ts" setup>
import { loadLicenseInfo } from '@/api/common'
import { routes } from '@/router'
import LeftBar from './LeftBar.vue'
import LicenseTipDialog from './LicenseTipDialog.vue'
import NavHeader from './NavHeader.vue'
import QuickPanel from './QuickPanel.vue'

const LeftBarWidth = {
  collapse: '80px',
  expand: '200px',
}

defineProps<{ keepAlive?: boolean }>()

const routesNeedCollapseMenu = ['flow-create', 'flow-detail']
const routesNeedFullHeight = ['flow', ...routesNeedCollapseMenu]

const store = useStore()
const route = useRoute()

const showLicenseTipDialog = ref(false)
const isEvaluationLicense = computed(() => store.getters.isEvaluationLicense)

const leftBarCollapse = computed(() => store.state.leftBarCollapse)
const asideStyle = computed(() => ({
  width: leftBarCollapse.value ? LeftBarWidth.collapse : LeftBarWidth.expand,
}))
const footMenuStyle = computed(() => ({
  width: parseInt(leftBarCollapse.value ? LeftBarWidth.collapse : LeftBarWidth.expand) - 1 + 'px',
}))
const elMainStyle = computed(() => ({
  paddingLeft: !leftBarCollapse.value ? LeftBarWidth.expand : LeftBarWidth.collapse,
}))
const topLvRoute: any = computed(() => {
  const { path } = route
  const topLvRoute = routes.find((v) => {
    const rootPath = `/${path.split('/')[1]}`
    return v.path !== '/' && rootPath === v.path
  })
  return topLvRoute || {}
})
const defaultSubMenu = computed(() => {
  const { path } = route
  const pathItem = path.split('/')
  if (pathItem.length > 2) {
    return `${topLvRoute.value.path}/${pathItem[2]}`
  }
  return path
})
const hasSubMenu = computed(() => {
  const { meta } = topLvRoute.value
  return meta && meta.subMenu
})
const showSubMenu = computed(() => {
  const { meta } = topLvRoute.value
  const showSubMenuInFirstLevel = meta.showSubMenuInFirstLevel || false
  if (showSubMenuInFirstLevel) {
    const level = route.path.match(/\//g)?.length
    return level && level <= 2
  }
  return true
})

const initLicense = async () => {
  try {
    const res = await loadLicenseInfo()
    await store.commit('SET_LICENSE_DATA', res)
  } catch (error) {
    //
  }
}

const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
const tryOpenLicenseDialog = () => {
  showLicenseTipDialog.value =
    (isEvaluationLicense.value ||
      store.state.licenseData.expiry ||
      store.getters.isCommunityLicense) &&
    !isNamespaceUser.value
}

onMounted(async () => {
  await initLicense()
  tryOpenLicenseDialog()
})

initLicense()

const fullHeight = computed(() => {
  const { name } = route
  return name && routesNeedFullHeight.includes(name as string)
})
const firstPath = ref('')
const isNotFound = ref(false)
const setHeaderTitle = () => {
  const { path } = route || []
  const _firstPath = path.split('/')[1]
  firstPath.value = _firstPath
  isNotFound.value = route.matched?.[1]?.name === 'not-found'
}

onBeforeRouteUpdate((to) => {
  if (
    to &&
    to.name &&
    routesNeedCollapseMenu.includes(to.name.toString()) &&
    !leftBarCollapse.value
  ) {
    store.dispatch('SET_LEFT_BAR_COLLAPSE', true)
  }
})

const showQuickPanel = ref(false)

const openQuickPanel = () => (showQuickPanel.value = true)

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    openQuickPanel()
  }
}
const bindKeyupListener = () => document.addEventListener('keydown', handleKeyDown)
const unbindKeyupListener = () => document.removeEventListener('keydown', handleKeyDown)

onUnmounted(unbindKeyupListener)

watch(route, () => {
  setHeaderTitle()
})
setHeaderTitle()
bindKeyupListener()
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
}
.el-aside {
  position: fixed;
  top: var(--el-header-height);
  left: 0;
  bottom: 0;
  height: calc(100vh - var(--el-header-height));
  transition: all 0.3s;
  z-index: 100;
  overflow-x: hidden;
  background-color: var(--color-bg);
  border-right: 1px solid var(--color-border-card);
  .footer-menu {
    cursor: pointer;
    z-index: 100;
    position: fixed;
    box-sizing: border-box;
    bottom: 0;
    height: var(--left-menu-footer-height);
    background-color: var(--color-bg);
    border-top: 1px solid #ffffff24;
    transition: all 0.3s;
    .footer-menu-item {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 100%;
      .iconfont {
        transition: all 0.3s;
        &.rotate {
          transform: rotate(180deg);
        }
      }
      &:hover {
        .iconfont {
          color: var(--color-primary);
        }
      }
    }
  }
}

.el-main {
  transition: all 0.3s;
  background-color: var(--color-bg);
  .main-content {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
}

.el-header {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0;
  z-index: 101;
  border-bottom: 1px solid var(--color-border-card);
  transition: all 0.3s;
  background-color: var(--color-bg);
}

.main {
  padding-top: var(--el-header-height);
}

.top-submenu {
  margin: 24px 24px 32px;
}

// 60px is header height
.is-full-height {
  height: calc(100vh - var(--el-header-height));
}
</style>
