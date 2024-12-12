<template>
  <div class="left-bar" :style="{ width: leftBarCollapse ? '52px' : '240px' }">
    <el-scrollbar>
      <el-menu
        :default-active="defaultSelectedKeys"
        :collapse="leftBarCollapse"
        router
        :collapse-transition="false"
      >
        <template v-for="(menu, i) in menus" :key="menu.title">
          <el-sub-menu
            v-if="menu.children"
            :index="'' + i"
            :key="i"
            :popper-class="needFixedHeight(menu) ? 'sub-menu-popper' : ''"
          >
            <template #title>
              <i v-show="leftBarCollapse" :class="['iconfont', menu.icon]"></i>
              <p class="menu-item-title first-level">
                {{ $t(`components.${menu.title}`) }}
              </p>
            </template>
            <el-scrollbar>
              <template v-for="item in menu.children" :key="item.title">
                <el-menu-item v-if="!item.children" :index="item.path">
                  <template #title>
                    <p class="menu-item-title">
                      {{ $t(`components.${item.title}`) }}
                    </p>
                  </template>
                </el-menu-item>
                <el-menu-item-group v-else>
                  <template #title>
                    <p class="menu-item-title group-name">{{ $t(`components.${item.title}`) }}</p>
                  </template>
                  <el-menu-item
                    v-for="level3Item in item.children"
                    :index="level3Item.path"
                    :key="level3Item.title"
                  >
                    <template #title>
                      <p class="menu-item-title">
                        {{ $t(`components.${level3Item.title}`) }}
                      </p>
                    </template>
                  </el-menu-item>
                </el-menu-item-group>
              </template>
            </el-scrollbar>
          </el-sub-menu>
          <el-menu-item v-else :key="menu.title" :index="menu.path">
            <i v-show="leftBarCollapse" :class="['iconfont', menu.icon]"></i>
            <p class="menu-item-title first-level">
              {{ $t(`components.${menu.title}`) }}
            </p>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import useMenus from '@/hooks/useMenus'
import type { Menu } from '@/hooks/useMenus'
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

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

    const headerHeight = 62
    const menuItemHeight = 56
    const needFixedHeight = ({ children }: Menu) => {
      const totalH =
        children?.reduce((totalHeight, { children }) => {
          if (children) {
            return (totalHeight += headerHeight + children.length * menuItemHeight)
          }
          return (totalHeight += menuItemHeight)
        }, 0) || 0
      // 740 is the max height of window to fixed height
      return totalH > 740
    }

    const { menuList } = useMenus()

    menus.value = menuList
    return {
      store,
      theme,
      leftBarCollapse,
      defaultSelectedKeys,
      menus,
      needFixedHeight,
    }
  },
})
</script>

<style lang="scss">
@use 'sass:math';

.left-bar {
  transition: all 0.3s;
  height: 100%;
  padding: 0 0 64px;
  background-color: var(--color-grey-8);
  // border-right: 1px solid var(--color-border-card);
  .el-menu:not(.el-menu--horizontal, .el-menu--popup) .menu-item-title {
    white-space: nowrap;
  }
  .menu-item-title.group-name {
    position: relative;
    left: -23px;
  }
  .el-menu.el-menu--collapse {
    width: 80px;
    .menu-item-title {
      padding-left: 26px;
      opacity: 0;
      left: 0;
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
.sub-menu-popper {
  // set padding right when collapsing
  .el-menu-item-group__title {
    padding-right: 20px;
  }
}
@media screen and (max-height: 920px) {
  .sub-menu-popper {
    .el-menu {
      height: 90vh;
    }
  }
}
</style>
