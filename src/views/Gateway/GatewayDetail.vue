<template>
  <div class="app-wrapper gateway-detail">
    <detail-header :item="{ name: transGatewayName(gname), path: '/gateway' }">
      <template #content>
        <div class="vertical-align-center">
          <span class="g-icon" :class="[`g-${gname}`, gname === 'stomp' ? 'img-black' : '']"></span>
          <p class="block-title">{{ transGatewayName(gname) }}</p>
          <el-tag type="info" class="section-status">
            <span>
              <i :class="['status', gInfo.status !== 'running' && 'stopped']" />
              <span>{{ gInfo.status }}</span>
            </span>
          </el-tag>
        </div>
      </template>
    </detail-header>
    <el-menu router :default-active="matchedUrl" mode="horizontal">
      <template v-for="item in types" :key="item">
        <el-menu-item :index="`${item}`">{{ tl(item) }}</el-menu-item>
      </template>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { getGateway } from '@/api/gateway'
import DetailHeader from '@/components/DetailHeader.vue'
import { GatewayName } from '@/types/enum'

const gInfo = ref<Record<string, any>>({})
const route = useRoute()
const types = ['settings', 'clients', 'auth', 'listeners']
const gname = String(route.params.name).toLowerCase() as GatewayName
const { transGatewayName } = useTransName()
const { tl } = useI18nTl('Gateway')
const matchedUrl = computed(() => {
  const currentPath = route.path || ''
  return (
    types.find((v) => {
      return currentPath.match(v)
    }) || types[0]
  )
})

const loadGatewayInfo = async () => {
  try {
    gInfo.value = await getGateway(gname)
  } catch (error) {
    gInfo.value = {}
  }
}
loadGatewayInfo()
</script>

<style lang="scss">
.gateway-detail {
  .section-header:not(:first-of-type) {
    padding-right: 1px;
    margin-top: 0px;
  }
  .el-tabs.detail-tabs .el-tabs__header {
    padding: 0px;
  }
  .detail-top {
    display: flex;
    align-items: center;
  }
  .el-page-header__content {
    line-height: 1;
  }
  .g-icon::before {
    width: 40px;
    height: 40px;
    content: '';
    display: inline-block;
    background-size: contain;
  }
  .el-menu--horizontal {
    margin-bottom: 24px;
  }
  .el-form {
    margin-bottom: 24px;
  }
}
</style>
