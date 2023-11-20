<template>
  <div class="app-wrapper gateway-detail">
    <detail-header :item="{ name: transGatewayName(gname), path: '/gateway' }" />
    <div class="section-header">
      <div>
        <span class="g-icon" :class="[`g-${gname}`, gname === 'stomp' ? 'img-black' : '']"></span>
        <span class="title-n-status">
          <el-tag type="info" class="section-status">
            <span>
              <i :class="['status', gInfo.status !== 'running' && 'stopped']" />
              <span>{{ gInfo.status }}</span>
            </span>
          </el-tag>
        </span>
      </div>
    </div>
    <el-menu router :default-active="matchedUrl" mode="horizontal">
      <template v-for="item in types" :key="item">
        <el-menu-item :index="`${item}`">{{ tl(item) }}</el-menu-item>
      </template>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getGateway } from '@/api/gateway'
import { useRoute } from 'vue-router'
import DetailHeader from '@/components/DetailHeader.vue'
import { GatewayName } from '@/types/enum'
import useTransName from '@/hooks/useTransName'
import useI18nTl from '@/hooks/useI18nTl'

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
  .g-icon::before {
    width: 60px;
    height: 60px;
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
