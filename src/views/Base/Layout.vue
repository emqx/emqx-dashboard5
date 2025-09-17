<template>
  <el-container>
    <el-header :style="{ height: 'auto' }">
      <nav-header
        :title="!isNotFound ? $t(`components.${firstPath}`) : $t('Base.pageNotFound')"
        @open-quick-panel="openQuickPanel"
      />
    </el-header>
    <el-container class="layout">
      <el-aside :style="{ width: leftBarCollapse ? '80px' : '200px' }">
        <left-bar></left-bar>
        <div class="footer-menu" :style="{ width: leftBarCollapse ? '79px' : '199px' }">
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
      <el-main>
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

<script lang="ts">
import { loadLicenseInfo } from '@/api/common'
import { routes } from '@/router'
import LeftBar from './LeftBar.vue'
import LicenseTipDialog from './LicenseTipDialog.vue'
import NavHeader from './NavHeader.vue'
import QuickPanel from './QuickPanel.vue'

const routesNeedCollapseMenu = ['flow-create', 'flow-detail']
const routesNeedFullHeight = ['flow', ...routesNeedCollapseMenu]

export default defineComponent({
  name: 'Layout',
  components: {
    NavHeader,
    LeftBar,
    LicenseTipDialog,
    QuickPanel,
  },
  props: {
    keepAlive: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const showLicenseTipDialog = ref(false)
    const isEvaluationLicense = computed(() => store.getters.isEvaluationLicense)

    const leftBarCollapse = computed(() => {
      return store.state.leftBarCollapse
    })
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
    return {
      store,
      route,
      showLicenseTipDialog,
      topLvRoute,
      defaultSubMenu,
      hasSubMenu,
      showSubMenu,
      leftBarCollapse,
      fullHeight,
      isNotFound,
      firstPath,
      showQuickPanel,
      openQuickPanel,
    }
  },
})
</script>

<style lang="scss" scoped>
.el-aside {
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
    height: 36px;
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

$header-heigh: 60px;

.el-main {
  transition: margin-left 0.3s;
  background-color: var(--color-bg);
  .main-content {
    background-color: var(--color-bg-content);
    position: relative;
    height: 100%;
    overflow: hidden;
  }
}

.el-header {
  padding: 0;
  z-index: 101;
  border-bottom: 1px solid var(--color-border-card);
  transition: all 0.3s;
}

.top-submenu {
  margin: 24px 24px 32px;
}

// 60px is header height
.is-full-height {
  height: calc(100vh - #{$header-heigh});
}
</style>
