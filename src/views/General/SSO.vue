<template>
  <div class="sso app-wrapper" v-loading="isLoading">
    <el-row class="sso-list">
      <el-col :span="6" class="sso-item" v-for="item in ssoList" :key="item.backend">
        <el-card>
          <div class="card-hd">{{ item.backend }}</div>
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
import type { DashboardSsoBackendStatus } from '@/types/schemas/dashboardSingleSignOn.schemas'
import { ref, Ref } from 'vue'
import { useRouter } from 'vue-router'

const { t, tl } = useI18nTl('General')
const router = useRouter()

const ssoList: Ref<Array<DashboardSsoBackendStatus>> = ref([])
const isLoading = ref(false)

const getList = async () => {
  try {
    isLoading.value = true
    ssoList.value = await getSSOList()
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
getList()

const goDetailPage = ({ backend }: DashboardSsoBackendStatus) => {
  router.push({ name: 'SSO-detail', params: { backend } })
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
