<template>
  <div class="left-bar" :style="{ width: leftBarCollapse ? '80px' : '200px' }">
    <el-scrollbar>
      <el-menu
        :default-active="defaultSelectedKeys"
        :collapse="leftBarCollapse"
        router
        :collapse-transition="false"
      >
        <template v-for="(menu, i) in menus" :key="menu.title">
          <template v-if="menu.c">
            <el-sub-menu :index="'' + i" :key="i">
              <template #title>
                <svg class="icon menu-icon" aria-hidden="true">
                  <use :xlink:href="setIcon(menu)"></use>
                </svg>
                <p class="menu-item-title first-level">
                  {{ $t(`components.${menu.title}`) }}
                </p>
              </template>
              <template v-for="item in menu.c" :key="item.title">
                <el-menu-item :index="item.path">
                  <template #title>
                    <p class="menu-item-title">
                      {{ $t(`components.${item.title}`) }}
                    </p>
                  </template>
                </el-menu-item>
              </template>
            </el-sub-menu>
          </template>
          <template v-else>
            <el-menu-item :key="menu.title" :index="menu.path">
              <svg class="icon menu-icon" aria-hidden="true">
                <use :xlink:href="setIcon(menu)"></use>
              </svg>
              <p class="menu-item-title first-level">
                {{ $t(`components.${menu.title}`) }}
              </p>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { IS_ENTERPRISE } from '@/common/constants'

if (IS_ENTERPRISE) {
  require('@/assets/iconfont/enterprise/iconfont.js')
} else {
  require('@/assets/iconfont/open/iconfont.js')
}

interface Menu {
  title: string
  path?: string
  icon?: string
  c?: Menu[]
}

export default defineComponent({
  name: 'Leftbar',
  setup() {
    const menus = ref<Menu[]>([])
    const store = useStore()
    const route = useRoute()
    const leftBarCollapse = computed(() => {
      return store.state.leftBarCollapse
    })
    const theme = computed(() => {
      return store.state.theme
    })
    const defaultSelectedKeys = computed(() => {
      const { path } = route
      return `/${path.split('/')[1]}`
    })

    const authentication = [
      {
        title: 'authentication',
        path: '/authentication',
      },
      {
        title: 'authorization',
        path: '/authorization',
      },
      {
        title: 'blacklist',
        path: '/blacklist',
      },
    ]

    const ruleengine = [
      { title: 'bridge', path: '/bridge' },
      { title: 'rules', path: '/rules' },
      { title: 'flow', path: '/flow' },
    ]

    const extensions = [
      {
        title: 'gateway',
        path: '/gateway',
      },
      {
        title: 'exhook',
        path: '/exhook',
      },
      {
        title: 'plugins',
        path: '/plugins',
      },
    ]

    const system = [
      { title: 'users', path: '/users' },
      {
        title: 'APIKey',
        path: '/APIKey',
      },
      { title: 'settings', path: '/settings' },
      { title: 'help', path: '/help' },
      // {
      //   title: 'dashboard-http',
      //   path: '/dashboard-http',
      // },
    ]

    const diagnose = [
      {
        title: 'alarm',
        path: '/alarm',
      },
      {
        title: 'websocket',
        path: '/websocket',
      },
      {
        title: 'topic-metrics',
        path: '/topic-metrics',
      },
      {
        title: 'slow-sub',
        path: '/slow-sub',
      },
      {
        title: 'log-trace',
        path: '/log-trace',
      },
    ]

    const config = [
      // {
      //   title: 'cluster',
      //   path: '/cluster',
      // },
      {
        title: 'listener',
        path: '/listener',
      },
      {
        title: 'mqtt',
        path: '/mqtt',
      },
      // {
      //   title: 'limiter',
      //   path: '/limiter',
      // },
      {
        title: 'log',
        path: '/log',
      },
      {
        title: 'monitoring',
        path: '/monitoring',
      },
    ]

    menus.value = [
      {
        title: 'dashboard',
        icon: 'icon-monitoring',
        path: '/dashboard',
      },
      {
        title: 'connections',
        icon: 'icon-connections',
        path: '/connections',
      },
      {
        title: 'subscriptions',
        icon: 'icon-subscriptions',
        path: '/subscriptions',
      },
      {
        title: 'retained',
        icon: 'icon-retained',
        path: '/retained',
      },
      {
        title: 'auth',
        icon: 'icon-authentication',
        c: authentication,
      },
      {
        title: 'ruleengine',
        icon: 'icon-integration',
        c: ruleengine,
      },
      {
        title: 'configuration',
        icon: 'icon-configuration',
        c: config,
      },
      {
        title: 'extensions',
        icon: 'icon-extensions',
        c: extensions,
      },
      {
        title: 'diagnose',
        icon: 'icon-diagnosis',
        c: diagnose,
      },
      {
        title: 'system',
        icon: 'icon-system',
        c: system,
      },
    ]
    const setIcon = (menu: Record<string, any>) => {
      let iconPath = `#${menu.icon}-${theme.value}`
      const setSelectedIcon = (path: string, title: string) => {
        if (path === title) {
          iconPath = `#${menu.icon}-${theme.value}-selected`
        }
      }
      const currRoute = route.path.split('/')[1]
      if (menu.c) {
        menu.c.forEach((child: Record<string, any>) => {
          setSelectedIcon(currRoute, child.title)
        })
      } else {
        setSelectedIcon(currRoute, menu.title)
      }
      return iconPath
    }
    return {
      store,
      theme,
      leftBarCollapse,
      defaultSelectedKeys,
      menus,
      setIcon,
    }
  },
})
</script>

<style lang="scss">
.left-bar {
  transition: all 0.3s;
  height: 100%;
  padding: 64px 0;
  background-color: var(--color-bg-primary);
  .el-menu.el-menu--collapse {
    width: 80px;
    .el-sub-menu__title,
    .el-menu-item {
      margin: 0px 6px;
      padding: 0px 20px !important;
    }
    .menu-item-title {
      padding-left: 26px;
      opacity: 0;
    }
    .el-sub-menu {
      .menu-item-title {
        padding-left: 26px;
      }
    }
    & i {
      margin-left: 6px;
    }
  }
  .el-scrollbar {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .el-scrollbar__bar.is-horizontal {
      display: none;
    }
  }
  .icon.menu-icon {
    font-size: 24px;
    flex-shrink: 0;
  }
}
</style>
