<template>
  <div class="app-wrapper gateway-detail with-padding-bottom">
    <detail-header :item="{ name: transGatewayName(gname), path: '/gateway' }">
      <template #content>
        <div class="vertical-align-center">
          <img
            class="g-icon"
            :class="{ 'img-black': gname === 'stomp' }"
            :src="getImg(`gateway/${gname}.png`)"
            :alt="`${gname}-icon`"
          />
          <p class="block-title">{{ transGatewayName(gname) }}</p>
          <el-tag type="info" class="section-status">
            <CheckIcon
              :status="
                gInfo.status === GatewayStatus.Running ? CheckStatus.Check : CheckStatus.Close
              "
              size="small"
            />
            <span>{{ getGatewayStatusLabel(gInfo.status) }}</span>
          </el-tag>
        </div>
      </template>
    </detail-header>
    <el-menu router :default-active="matchedUrl" :ellipsis="false" mode="horizontal">
      <template v-for="item in types" :key="item">
        <el-menu-item :index="`${item}`">{{ tl(item) }}</el-menu-item>
      </template>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { getGateway } from '@/api/gateway'
import { useGatewayStatus } from '@/hooks/useTransName'
import { CheckStatus, GatewayName, GatewayStatus } from '@/types/enum'

const gInfo = ref<Record<string, any>>({})
const route = useRoute()
const gname = computed(() => String(route.params.name).toLowerCase() as GatewayName)
const types = computed(() => {
  const comonTypes = ['settings', 'clients', 'listeners']
  if (gname.value !== GatewayName.JT808) {
    comonTypes.splice(2, 0, 'auth')
  }
  return comonTypes
})
const { transGatewayName } = useTransName()
const { getGatewayStatusLabel } = useGatewayStatus()
const { tl } = useI18nTl('Gateway')
const matchedUrl = computed(() => {
  const currentPath = route.path || ''
  return (
    types.value.find((v) => {
      return currentPath.match(v)
    }) || types.value[0]
  )
})

const loadGatewayInfo = async () => {
  try {
    gInfo.value = await getGateway(gname.value)
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
    .check-icon {
      margin-right: 4px;
    }
  }
  .g-icon {
    width: 40px;
    height: 40px;
  }
  .el-menu--horizontal {
    margin-bottom: 24px;
  }
  .el-form {
    margin-bottom: 24px;
  }
}
</style>
