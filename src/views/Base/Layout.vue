<template>
  <el-container>
    <el-header :style="{ height: 'auto' }">
      <nav-header
        :title="!isNotFound ? $t(`components.${firstPath}`) : $t('Base.pageNotFound')"
        @open-quick-panel="openQuickPanel"
      />
    </el-header>
    <el-container class="layout">
      <el-aside :style="{ width: leftBarCollapse ? '52px' : '240px' }">
        <left-bar></left-bar>
        <div class="footer-menu" :style="{ width: leftBarCollapse ? '51px' : '239px' }">
          <a
            class="footer-menu-item"
            :class="{ 'is-collapsed': leftBarCollapse }"
            @click="
              () => {
                store.dispatch('SET_LEFT_BAR_COLLAPSE', !leftBarCollapse)
              }
            "
          >
            <EMQXVersion v-show="!leftBarCollapse" />
            <div class="icon-wrapper">
              <i :class="['iconfont', 'icon-fold', leftBarCollapse ? 'rotate' : '']"></i>
            </div>
          </a>
        </div>
      </el-aside>
      <el-main :style="{ marginLeft: elMainStyle }">
        <div class="main-content">
          <el-scrollbar>
            <el-menu
              v-if="hasSubMenu && showSubMenu"
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
    :max-connection="store.state.licenseData.max_connections"
  />
  <QuickPanel v-model="showQuickPanel" />
</template>

<script lang="ts">
import { loadLicenseInfo } from '@/api/common'
import EMQXVersion from '@/components/EMQXVersion.vue'
import { routes } from '@/router'
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useStore } from 'vuex'
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
    EMQXVersion,
    QuickPanel,
  },
  props: {
    keepAlive: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const kebab2pascal = (s: string) => String(s).replace(/-([a-z])/g, (s, m1) => m1.toUpperCase())
    const store = useStore()
    const route = useRoute()

    const showLicenseTipDialog = ref(false)
    const isEvaluationLicense = computed(() => store.getters.isEvaluationLicense)

    const edition = computed(() => {
      return store.state.edition
    })
    const leftBarCollapse = computed(() => {
      return store.state.leftBarCollapse
    })
    const elMainStyle = computed(() => {
      return !leftBarCollapse.value ? '240px' : '52px'
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

    const tryOpenLicenseDialog = () => {
      showLicenseTipDialog.value = isEvaluationLicense.value || store.state.licenseData.expiry
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
      let { path } = route || []
      let _firstPath = path.split('/')[1]
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
      edition,
      elMainStyle,
      topLvRoute,
      defaultSubMenu,
      hasSubMenu,
      showSubMenu,
      leftBarCollapse,
      fullHeight,
      kebab2pascal,
      isNotFound,
      firstPath,
      showQuickPanel,
      openQuickPanel,
    }
  },
})
</script>

<style lang="scss" scoped>
$padding: 8px;
$header-heigh: 60px;

.el-aside {
  transition: all 0.3s;
  position: fixed;
  top: $header-heigh;
  bottom: 0;
  left: 0;
  z-index: 100;
  overflow-x: hidden;
  height: calc(100vh - #{$header-heigh});
  .footer-menu {
    cursor: pointer;
    z-index: 100;
    position: fixed;
    box-sizing: border-box;
    bottom: 0;
    height: 16px + 28px;
    line-height: 1;
    border-top: 1px solid #ffffff24;
    transition: all 0.3s;
    .footer-menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px 16px;
      height: 100%;
      color: var(--color-grey-2);
      &.is-collapsed {
        padding-left: 0;
        padding-right: 0;
        justify-content: center;
      }
      .icon-wrapper {
        padding: 4px;
        background-color: var(--color-grey-11);
      }
      .iconfont {
        display: block;
        transition: all 0.3s;
        &.rotate {
          transform: rotateY(180deg);
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
  transition: margin-left 0.3s;
  background-color: var(--color-bg);
  height: 100vh;
  .main-content {
    background-color: var(--color-grey-11);
    margin-top: $header-heigh;
    position: relative;
    height: 100%;
    height: calc(100% - #{$header-heigh}); /* 60px + 12px padding */
    overflow: hidden;
  }
}

.el-header {
  padding: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 101;
  transition: all 0.3s;
}

.top-submenu {
  margin: 24px 24px 32px;
  .el-menu-item {
    padding-left: 0;
    padding-right: 0;
    margin-right: 16px;
    &:not(:first-child) {
      margin-left: 16px;
    }
  }
}

// 60px is header height
.is-full-height {
  height: calc(100vh - #{$header-heigh} - #{$padding});
}
</style>
