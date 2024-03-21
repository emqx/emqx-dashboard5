<template>
  <el-container>
    <el-aside v-if="!hideLeftMenu" :style="{ width: leftBarCollapse ? '80px' : '200px' }">
      <div :class="['logo', leftBarCollapse ? 'logo-colap' : '']">
        <img src="@/assets/img/emqx-logo.png" alt="emqx-logo" />
      </div>
      <left-bar></left-bar>
      <div class="footer-menu" :style="{ width: leftBarCollapse ? '79px' : '199px' }">
        <a
          class="footer-menu-item"
          @click="
            () => {
              store.dispatch('SET_LEFT_BAR_COLLAPSE', !leftBarCollapse)
            }
          "
        >
          <i :class="['iconfont', 'icon-fold', leftBarCollapse ? 'rotate' : '']"></i>
          <EMQXVersion v-show="!leftBarCollapse" />
        </a>
      </div>
    </el-aside>
    <el-container class="layout">
      <el-header :style="{ left: elMainStyle, height: 'auto' }">
        <nav-header></nav-header>
      </el-header>
      <el-main :style="{ marginLeft: elMainStyle }">
        <div class="main-content">
          <el-scrollbar>
            <h1 class="header-title">
              {{ !isNotFound ? $t(`components.${firstPath}`) : $t('Base.pageNotFound') }}
            </h1>
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
                  {{ $t(`components.${kebab2pascal(route.path)}`) }}
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
</template>

<script lang="ts">
import LeftBar from './LeftBar.vue'
import NavHeader from './NavHeader.vue'
import LicenseTipDialog from './LicenseTipDialog.vue'
import { routes } from '@/router'
import { useStore } from 'vuex'
import { computed, defineComponent, ref, watch, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { loadLicenseInfo } from '@/api/common'
import EMQXVersion from '@/components/EMQXVersion.vue'

const routesNeedCollapseMenu = ['flow-create', 'flow-detail']
const routesNeedFullHeight = ['flow', ...routesNeedCollapseMenu]

export default defineComponent({
  name: 'Layout',
  components: {
    NavHeader,
    LeftBar,
    LicenseTipDialog,
    EMQXVersion,
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
    const hideLeftMenu = computed(() => store.state.hideLeftMenu)
    const elMainStyle = computed(() => {
      if (hideLeftMenu.value) {
        return '8px'
      }
      return !leftBarCollapse.value ? '200px' : '80px'
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
      showLicenseTipDialog.value =
        (isEvaluationLicense.value &&
          localStorage.getItem('licenseTipVisible') !== false.toString()) ||
        store.state.licenseData.expiry
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
    watch(route, () => {
      setHeaderTitle()
    })
    setHeaderTitle()
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
      hideLeftMenu,
      fullHeight,
      kebab2pascal,
      isNotFound,
      firstPath,
    }
  },
})
</script>

<style lang="scss" scoped>
.el-aside {
  transition: all 0.3s;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  overflow-x: hidden;
  background-color: var(--color-bg);
  height: 100vh;
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
      color: #fff;
      .iconfont {
        transition: all 0.3s;
        color: #fff;
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
  transition: margin-left 0.3s;
  background-color: var(--color-bg);
  height: 100vh;
  .main-content {
    background-color: var(--color-bg-content);
    margin-top: 60px;
    margin-right: 8px;
    border-radius: 8px;
    position: relative;
    height: 100%;
    height: calc(100% - 68px); /* 60px + 12px padding */
    overflow: hidden;
  }
}

$title-size: 22px;
$title-margin: 22px;
.header-title {
  font-size: $title-size;
  margin-top: $title-margin;
  margin-bottom: $title-margin;
}

.el-container {
  min-height: 100vh;
}

.logo {
  position: fixed;
  background-color: var(--color-bg);
  height: 60px;
  line-height: 60px;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: 100;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  padding-left: 20px;
  img {
    max-width: initial;
    max-height: 100%;
    height: 36px;
    transition: all 0.3s;
  }
}

.logo.logo-colap {
  width: 60px;
  padding-left: 25px;
  img {
    height: 36px;
  }
}

.el-header {
  padding: 0;
  right: 0;
  position: fixed;
  z-index: 101;
  transition: all 0.3s;
}

.top-submenu {
  margin: 0 24px;
  margin-bottom: 24px;
}

// 60px is header height
.is-full-height {
  height: calc(100vh - 60px - #{$title-size} - #{$title-margin} * 2);
}
</style>
