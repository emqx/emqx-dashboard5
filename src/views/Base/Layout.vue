<template>
  <div>
    <el-container>
      <el-aside :style="{ width: leftBarCollapse ? '80px' : '200px' }">
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
        <el-main :style="{ margin: 0, marginLeft: elMainStyle }">
          <el-header :style="{ left: elMainStyle, height: 'auto' }">
            <nav-header></nav-header>
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
          </el-header>

          <div
            class="main-content"
            :class="{
              'larger-margin-top': hasSubMenu && showSubMenu,
              'is-full-height': fullHeight,
            }"
          >
            <router-view v-slot="{ Component, route }">
              <keep-alive>
                <component v-if="keepAlive" :is="Component" :key="route.fullPath" />
              </keep-alive>
            </router-view>
            <router-view v-if="!keepAlive" />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import LeftBar from './LeftBar.vue'
import NavHeader from './NavHeader.vue'
import { routes } from '@/router'
import { useStore } from 'vuex'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { Expand, Fold } from '@element-plus/icons-vue'
import EMQXVersion from '@/components/EMQXVersion.vue'

const ROUTE_NAMES_NEED_FULL_HEIGHT = ['flow', 'flow-create']

export default defineComponent({
  name: 'Layout',
  components: {
    NavHeader,
    LeftBar,
    Expand,
    Fold,
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

    const edition = computed(() => {
      return store.state.edition
    })
    const leftBarCollapse = computed(() => {
      return store.state.leftBarCollapse
    })
    const elMainStyle = computed(() => {
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
      const { meta, children, path } = topLvRoute.value
      const showSubMenuInFirstLevel = meta.showSubMenuInFirstLevel || false
      if (showSubMenuInFirstLevel) {
        return children.some(
          ({ path: childPath }: { path: any }) => `${path}/${childPath}` === route.path,
        )
      }
      return true
    })
    const fullHeight = computed(() => {
      const { name } = route
      return name && ROUTE_NAMES_NEED_FULL_HEIGHT.includes(name as string)
    })
    return {
      store,
      route,
      edition,
      elMainStyle,
      topLvRoute,
      defaultSubMenu,
      hasSubMenu,
      showSubMenu,
      leftBarCollapse,
      fullHeight,
      kebab2pascal,
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
  background-color: #1f303c;
  height: 100vh;
  .footer-menu {
    cursor: pointer;
    z-index: 100;
    position: fixed;
    box-sizing: border-box;
    bottom: 0;
    height: 36px;
    background-color: #1f303c;
    transition: all 0.3s;
    &:hover {
      background-color: #2f4656;
    }
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
  background-color: var(--color-bg-main);
}

.el-container {
  min-height: 100vh;
}

.logo {
  position: fixed;
  background-color: var(--color-bg-menu);
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
  padding-left: 21px;
  img {
    width: 200px;
    height: 43px;
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
  transition: none;
  padding: 0 22px;
}

.main-content {
  $normal-margin-top: 60px;
  $larger-margin-top: 120px;
  position: relative;
  margin-top: $normal-margin-top;
  &.is-full-height {
    height: calc(100vh - #{$normal-margin-top});
  }
  &.larger-margin-top {
    margin-top: $larger-margin-top;
    &.is-full-height {
      height: calc(100vh - #{$larger-margin-top});
    }
  }
}
</style>
