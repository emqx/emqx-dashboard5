<template>
  <div class="sso app-wrapper with-padding-top" v-loading="isLoading">
    <el-row class="sso-list" :gutter="24">
      <el-col :span="6" class="sso-item" v-for="item in SSOList" :key="item.backend">
        <el-card class="sso-item-card">
          <div class="card-db">
            <div class="img-container vertical-align-center">
              <img width="64" :src="getBackendIcon(item.backend)" :alt="`icon-${item.backend}`" />
            </div>
            <p class="backend-name">{{ getBackendLabel(item.backend) }}</p>
          </div>
          <div class="card-ft space-between">
            <div class="sso-status vertical-align-center">
              <i class="node-status-dot" :class="item.enable ? 'is-running' : 'is-stopped'"></i>
              <span> {{ tl(item.enable ? 'ssoEnabled' : 'ssoDisabled') }}</span>
            </div>
            <el-button
              link
              type="primary"
              :disabled="!$hasPermission('put')"
              @click="goDetailPage(item)"
            >
              {{ t(`Base.${item.enable ? 'edit' : 'enable'}`) }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { getSSOList } from '@/api/sso'
import useI18nTl from '@/hooks/useI18nTl'
import { useSSOBackendsLabel } from '@/hooks/SSO/useSSO'
import {
  DashboardSsoBackendStatus,
  DashboardSsoBackendStatusBackend,
} from '@/types/schemas/dashboardSingleSignOn.schemas'

type SSOItem = DashboardSsoBackendStatus & { isCreated: boolean }

const { t, tl } = useI18nTl('General')
const router = useRouter()

const createdSSOList: Ref<Array<DashboardSsoBackendStatus>> = ref([])
const isLoading = ref(false)

const SSOBackendList = Object.entries(DashboardSsoBackendStatusBackend).map(([, value]) => value)
const SSOList: ComputedRef<Array<SSOItem>> = computed(() => {
  return SSOBackendList.map((backend) => {
    const createdItem = createdSSOList.value.find((item) => item.backend === backend)
    return createdItem
      ? { ...createdItem, isCreated: true }
      : { backend, enable: false, isCreated: false }
  })
})

const { getBackendLabel } = useSSOBackendsLabel()
const getBackendIcon = (backend: string) => {
  try {
    return getImg(`img/${backend}.png`)
  } catch (error) {
    return ''
  }
}

const getList = async () => {
  try {
    isLoading.value = true
    createdSSOList.value = await getSSOList()
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
getList()

const goDetailPage = ({ backend }: SSOItem) => {
  router.push({ name: 'SSO-detail', params: { backend } })
}
</script>

<style lang="scss">
.sso {
  .sso-list {
    list-style: none;
  }
  .sso-item-card {
    .el-card__body {
      padding: 0;
    }
  }
  $padding-side: 32px;
  .card-db {
    display: flex;
    align-items: center;
    padding: 24px $padding-side;
    border-bottom: 1px solid var(--el-border-color-light);
    .img-container {
      height: 64px;
    }
    img {
      margin-right: 24px;
    }
    .backend-name {
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .card-ft {
    padding: 8px $padding-side;
    line-height: 24px;
  }
  .node-status-dot {
    margin-right: 8px;
  }
}
</style>
