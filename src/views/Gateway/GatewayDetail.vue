<template>
  <div class="app-wrapper gateway-detail">
    <detail-header :item="{ name: transGatewayName(gname), path: '/gateway' }">
      <template #content>
        <div class="vertical-align-center">
          <span class="g-icon" :class="[`g-${gname}`, gname === 'stomp' ? 'img-black' : '']"></span>
          <p class="block-title">{{ transGatewayName(gname) }}</p>
          <el-tag type="info" class="section-status">
            <span class="vertical-align-center">
              <CheckIcon
                class="status"
                size="small"
                :status="gInfo.status === 'running' ? CheckStatus.Check : CheckStatus.Close"
              />
              <span class="text-status" :class="gInfo.status === 'running' ? 'success' : 'danger'">
                {{ statusLabel }}
              </span>
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
import { computed, ref } from 'vue'
import { getGateway } from '@/api/gateway'
import { useRoute } from 'vue-router'
import DetailHeader from '@/components/DetailHeader.vue'
import { CheckStatus, GatewayName } from '@/types/enum'
import useTransName from '@/hooks/useTransName'
import useI18nTl from '@/hooks/useI18nTl'
import CheckIcon from '@/components/CheckIcon.vue'

const gInfo = ref<Record<string, any>>({})
const route = useRoute()
const gname = computed(() => String(route.params.name).toLowerCase() as GatewayName)
const types = computed(() => {
  const comonTypes = ['settings', 'clients', 'listeners']
  if (gname.value !== 'jt808') {
    comonTypes.splice(2, 0, 'auth')
  }
  return comonTypes
})
const { transGatewayName } = useTransName()
const { t, tl } = useI18nTl('Gateway')
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

const getStatusLabel = (status: string) => {
  if (status === 'running') {
    return t('Dashboard.running')
  }
  return t('Dashboard.stopped')
}
const statusLabel = computed(() => getStatusLabel(gInfo.value?.status))
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
  .el-icon.check-icon {
    margin-right: 4px;
  }
}
</style>
