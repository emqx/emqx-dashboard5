<template>
  <div class="sso app-wrapper" v-loading="isLoading">
    <el-row class="sso-list">
      <el-col :span="6" class="sso-item" v-for="item in SSOList" :key="item.backend">
        <el-card>
          <div class="card-hd">{{ getBackendLabel(item.backend) }}</div>
          <div class="card-ft space-between">
            <el-tag :type="item.enable ? 'success' : 'info'">
              {{ tl(item.enable ? 'ssoEnabled' : 'ssoDisabled') }}
            </el-tag>
            <el-button link type="primary" @click="goDetailPage(item)">
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
import { computed, ComputedRef, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'

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

const goDetailPage = ({ backend, enable = true, isCreated }: SSOItem) => {
  router.push({
    name: 'SSO-detail',
    params: { backend },
    query: { enable: enable.toString(), isCreated: isCreated.toString() },
  })
}
</script>

<style lang="scss">
.sso {
  .sso-list {
    list-style: none;
  }
  .card-hd {
    margin-bottom: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
