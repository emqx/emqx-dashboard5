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
                <span>{{ $t(`components.${menu.title}`) }}</span>
              </template>
              <template v-for="item in menu.c" :key="item.title">
                <el-menu-item :index="item.path">
                  <template #title>
                    {{ $t(`components.${item.title}`) }}
                  </template>
                </el-menu-item>
              </template>
            </el-sub-menu>
          </template>
          <template v-else>
            <el-menu-item :key="menu.title" :index="menu.path">
              <i :class="['iconx', menu.icon]"></i>
              <span>{{ $t(`components.${menu.title}`) }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: "LeftBar",
  data() {
    return {
      menus: [],
      // defaultOpenKeys: [],
    };
  },
  computed: {
    leftBarCollapse() {
      return this.$store.state.leftBarCollapse;
    },
    defaultSelectedKeys() {
      const { path } = this.$route;
      return `/${path.split("/")[1]}`;
    },
  },
  created() {
    let dashboard = [
      {
        title: "dashboard",
        path: "/dashboard",
      },
      {
        title: "alarm",
        path: "/alarm",
      },
      {
        title: "tools",
        path: "/tools",
      },
    ];

    let management = [
      {
        title: "clients",
        path: "/clients",
      },
      {
        title: "topics",
        path: "/topics",
      },
      {
        title: "subscriptions",
        path: "/subscriptions",
      },
    ];

    let authentication = [
      {
        title: "authentication",
        path: "/authentication",
      },
      {
        title: "authorization",
        path: "/authorization",
      },
    ];

    let ruleengine = [
      { title: "iot", path: "/iot" },
      { title: "bridge", path: "/bridge" },
    ];

    let system = [
      { title: "users", path: "/users" },
      {
        title: "blacklist",
        path: "/blacklist",
      },
      {
        title: "gateway",
        path: "/gateway",
      },
    ];

    let config = [
      {
        title: "advanced",
        path: "/advanced",
      },
    ];

    this.menus = [
      {
        title: "monitoring",
        icon: "icon-monitoring",
        c: dashboard,
      },
      {
        title: "management",
        icon: "icon-management",
        c: management,
      },
      {
        title: "auth",
        icon: "icon-authentication",
        c: authentication,
      },
      {
        title: "ruleengine",
        icon: "icon-configuration",
        c: ruleengine,
      },
      {
        title: "system",
        icon: "icon-system",
        c: system,
      },
      {
        title: "configuration",
        icon: "icon-configuration",
        c: config,
      },
      // {
      //   title: 'ruleengine',
      //   icon: 'icon-guizeyinqing',
      //   path: '/ruleengine',
      // },
      // {
      //   title: 'modules',
      //   path: '/modules',
      //   icon: 'icon-changjingguanli',
      // },
      // {
      //   title: 'setting',
      //   path: '/setting',
      //   icon: 'icon-icon_shezhi',
      // },
      // {
      //   title: 'general',
      //   icon: 'icon-fenzuguanli',
      //   path: '/general',
      // },
    ];
  },
};
</script>

<style lang="scss" scoped>
.left-bar {
  margin-top: 60px;
  height: calc(100vh - 60px);
  transition: all 0.3s;

  .el-menu--collapse {
    width: 80px;

    & i {
      margin-left: 10px;
    }
  }
}
</style>
