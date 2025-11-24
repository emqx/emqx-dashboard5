<template>
  <el-menu
    router
    mode="horizontal"
    class="authn-menu-tab"
    :ellipsis="false"
    :default-active="defaultSubMenu"
  >
    <el-menu-item
      v-for="{ routeName, label } in subMenuList"
      :key="routeName"
      :index="routeName"
      :route="{ name: routeName }"
    >
      {{ label }}
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import {} from 'vue'

const { t, tl } = useI18nTl('Auth')
const subMenuList = [
  {
    routeName: 'authentication-default',
    label: t('Base.default'),
  },
  {
    routeName: 'authentication-extended',
    label: t('Auth.extended'),
  },
]

const route = useRoute()
const defaultSubMenu = computed<string>(() => route.name?.toString() ?? '')
</script>

<style lang="scss">
.authn-menu-tab {
  margin: 24px 24px 32px;
}
</style>
