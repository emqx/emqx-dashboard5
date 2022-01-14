<template>
  <div>
    <el-container>
      <el-aside :style="{ width: leftBarCollapse ? '80px' : '200px' }">
        <router-link to="/">
          <div :class="['logo', leftBarCollapse ? 'logo-colap' : '']">
            <img
              class="logo-img"
              src="@/assets/img/logo-broker@2x.png"
              alt="broker"
              v-if="edition == 0b10"
            />
            <img
              class="logo-img-ent"
              src="@/assets/img/logo-ent@2x.png"
              alt="enterprise"
              v-if="edition == 0b01"
            />
          </div>
        </router-link>
        <left-bar></left-bar>
      </el-aside>
      <el-container class="layout">
        <el-main style="margin: 0; padding: 0" :style="{ marginLeft: elMainStyle }">
          <el-header :style="{ left: elMainStyle, height: 'auto' }">
            <nav-header></nav-header>
            <el-menu
              v-if="hasSubMenu"
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
              marginTop: hasSubMenu ? '120px' : '70px',
            }"
          >
            <router-view v-slot="{ Component, route }">
              <keep-alive>
                <component :is="Component" :key="route.fullPath" v-if="route.meta.keepAlive" />
              </keep-alive>
              <component :is="Component" :key="route.fullPath" v-if="!route.meta.keepAlive" />
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import LeftBar from './LeftBar'
import NavHeader from './NavHeader'
import { routes } from '@/router'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',

  components: {
    NavHeader,
    LeftBar,
  },

  data() {
    return {}
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
  },
}
</script>

<style lang="scss" scoped>
.el-aside {
  background-color: #282e38ff;
  transition: all 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  overflow-x: hidden;

  // scrollbar-width: none;
  // &::-webkit-scrollbar {
  //   width: 0;
  // }
}

.el-main {
  transition: margin-left 0.3s;
}

.el-container {
  min-height: 100vh;
}

.logo {
  width: 200px;
  height: 60px;
  line-height: 60px;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  justify-content: center;
  z-index: 100;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  // padding: 0 20px;
  background: rgb(47, 53, 63);

  .logo-img {
    width: 156px;
    transition: all 0.3s;
  }
  .logo-img-ent {
    width: 162px;
    transition: all 0.3s;
  }
}

.logo-colap {
  width: 80px;
  .logo-img {
    width: 195px;
    margin-left: 165px;
  }
  .logo-img-ent {
    width: 222px;
    margin-left: 195px;
  }
}

.el-header {
  padding: 0;
  right: 0;
  position: fixed;
  z-index: 101;
  transition: all 0.3s;
  // border-bottom: 1px solid #eeeef7ff;
}

.top-submenu {
  transition: none;
  padding: 0 30px;
}
</style>
