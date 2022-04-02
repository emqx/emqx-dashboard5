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
                <i :class="['iconx', menu.icon]"></i>
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
              <i :class="['iconx', menu.icon]"></i>
              <p class="menu-item-title first-level">{{ $t(`components.${menu.title}`) }}</p>
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
        icon: 'icon-ruleengine',
        c: ruleengine,
      },
      {
        title: 'plugins',
        icon: 'icon-plugin',
        path: '/plugins',
      },
      {
        title: 'configuration',
        icon: 'icon-configuration',
        c: config,
      },
      {
        title: 'diagnose',
        icon: 'icon-diagnose',
        c: diagnose,
      },
      {
        title: 'system',
        icon: 'icon-system',
        c: system,
      },
    ]
    return {
      leftBarCollapse,
      defaultSelectedKeys,
      menus,
    }
  },
})
</script>

<style lang="scss">
.left-bar {
  height: calc(100vh - 60px);
  transition: all 0.3s;
  .el-menu.el-menu--collapse {
    width: 80px;
    .el-sub-menu__title,
    .el-menu-item {
      margin: 0px 6px;
      padding: 0px 13px !important;
    }
    .menu-item-title {
      padding-left: 26px;
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
}
</style>
