<template>
  <div>
    <el-container>
      <el-aside :style="{ width: leftBarCollapse ? '80px' : '200px' }">
        <router-link to="/">
          <div :class="['logo', leftBarCollapse ? 'logo-colap' : '']">
            <img v-if="edition == 0b10" src="@/assets/img/emqx-logo.png" alt="emqx-logo" />
          </div>
        </router-link>
        <left-bar></left-bar>
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
                <el-menu-item :index="topLvRoute.path + '/' + route.path">
                  {{ $t(`components.${kebab2pascal(route.path)}`) }}
                </el-menu-item>
              </template>
            </el-menu>
          </el-header>

          <div
            :style="{
              position: 'relative',
              marginTop: hasSubMenu && showSubMenu ? '120px' : '60px',
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

<script>
import LeftBar from './LeftBar.vue'
import NavHeader from './NavHeader.vue'
import { routes } from '@/router'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  components: {
    NavHeader,
    LeftBar,
  },

  props: {
    keepAlive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    kebab2pascal(s) {
      return String(s).replace(/-([a-z])/g, (s, m1) => m1.toUpperCase())
    },
  },
  computed: {
    ...mapGetters(['edition']),
    leftBarCollapse() {
      return this.$store.state.leftBarCollapse
    },
    elMainStyle() {
      return !this.leftBarCollapse ? '200px' : '80px'
    },
    topLvRoute() {
      const { path } = this.$route
      const topLvRoute = routes.find((v) => {
        return v.path !== '/' && path.indexOf(v.path) >= 0
      })
      return topLvRoute || {}
    },
    defaultSubMenu() {
      const { children, path: topPath } = this.topLvRoute
      const { path } = this.$route
      const childRoute = Array.prototype.find.call(children, (v) => path.indexOf(v.path) >= 0) || {}
      return `${topPath}/${childRoute && childRoute.path}` || null
    },
    hasSubMenu() {
      const { meta } = this.topLvRoute
      return meta && meta.subMenu
    },
    showSubMenu() {
      const { meta, children, path } = this.topLvRoute
      const showSubMenuInFirstLevel = meta.showSubMenuInFirstLevel || false
      if (showSubMenuInFirstLevel) {
        return children.some(({ path: childPath }) => `${path}/${childPath}` === this.$route.path)
      }
      return true
    },
  },
}
</script>

<style lang="scss" scoped>
.el-aside {
  transition: all 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  overflow-x: hidden;
  border-right: 1px solid var(--color-border-menu);
}

.el-main {
  transition: margin-left 0.3s;
  background-color: var(--color-bg-main);
}

.el-container {
  min-height: 100vh;
}

.logo {
  width: 200px;
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
    width: 96px;
    height: 33px;
    transition: all 0.3s;
  }
}

.logo.logo-colap {
  width: 80px;
  padding-left: 25px;
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
  padding: 0 30px;
}
</style>
