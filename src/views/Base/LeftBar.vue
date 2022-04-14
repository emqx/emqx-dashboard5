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
                  <use :xlink:href="`#${menu.icon}-${theme}`"></use>
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
                <use :xlink:href="`#${menu.icon}-${theme}`"></use>
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
import '@/assets/fonts/iconfont'

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
    const dashboard = [
      {
        title: 'dashboard',
        path: '/dashboard',
      },
      {
        title: 'alarm',
        path: '/alarm',
      },
    ]

    const management = [
      {
        title: 'clients',
        path: '/clients',
      },
      {
        title: 'topics',
        path: '/topics',
      },
      {
        title: 'subscriptions',
        path: '/subscriptions',
      },
    ]

    const authentication = [
      {
        title: 'authentication',
        path: '/authentication',
      },
      {
        title: 'authorization',
        path: '/authorization',
      },
    ]

    const ruleengine = [
      { title: 'iot', path: '/iot' },
      { title: 'bridge', path: '/bridge' },
      { title: 'flow-chart', path: '/flow-chart' },
    ]

    const system = [
      { title: 'users', path: '/users' },
      {
        title: 'blacklist',
        path: '/blacklist',
      },
      {
        title: 'gateway',
        path: '/gateway',
      },
      {
        title: 'exhook',
        path: '/exhook',
      },
      {
        title: 'APIKey',
        path: '/APIKey',
      },
    ]

    const diagnose = [
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
      {
        title: 'basic-config',
        path: '/basic-config',
      },
      {
        title: 'listener',
        path: '/listener',
      },
      {
        title: 'advanced',
        path: '/advanced',
      },
      {
        title: 'config-docs',
        path: '/config-docs',
      },
    ]

    menus.value = [
      {
        title: 'monitoring',
        icon: 'icon-monitoring',
        c: dashboard,
      },
      {
        title: 'management',
        icon: 'icon-management',
        c: management,
      },
      {
        title: 'auth',
        icon: 'icon-authentication',
        c: authentication,
      },
      {
        title: 'ruleengine',
        icon: 'icon-a-ruleengine',
        c: ruleengine,
      },
      {
        title: 'plugins',
        icon: 'icon-plugins',
        path: '/plugins',
      },
      {
        title: 'configuration',
        icon: 'icon-configuration',
        c: config,
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
    return {
      store,
      theme,
      leftBarCollapse,
      defaultSelectedKeys,
      menus,
    }
  },
})
</script>

<style lang="scss">
.left-bar {
  transition: all 0.3s;
  padding: 64px 0;
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
