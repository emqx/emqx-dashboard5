<template>
  <div class="sso app-wrapper with-padding-top" v-loading="isLoading">
    <el-row class="sso-list" :gutter="24">
      <el-col :span="6" class="sso-item" v-for="item in MFAList" :key="item.method">
        <el-card class="sso-item-card">
          <div class="card-db">
            <div class="img-container vertical-align-center">
              <img width="64" :src="getMethodIcon(item.method)" :alt="`icon-${item.method}`" />
            </div>
            <p class="backend-name">{{ getMethodLabel(item.method) }}</p>
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
import { getMfaList } from '@/api/systemModule'
import { getImg } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { MfaTotpSetupRespMethod } from '@/types/schemas/dashboard.schemas'
import { MfaTotpConfig } from '@/types/typeAlias'
import { computed, ComputedRef, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'

type MFAItem = MfaTotpConfig & { isCreated: boolean }

const { t, tl } = useI18nTl('General')
const router = useRouter()

const createdMFAList: Ref<Array<MfaTotpConfig>> = ref([])
const isLoading = ref(false)

const mfaMethodList = Object.entries(MfaTotpSetupRespMethod).map(([, value]) => value)
const MFAList: ComputedRef<Array<MFAItem>> = computed(() => {
  return mfaMethodList.map((method) => {
    const createdItem = createdMFAList.value.find((item) => item.method === method)
    return createdItem
      ? { ...createdItem, isCreated: true }
      : { method, enable: false, isCreated: false }
  })
})

const getMethodIcon = (method: string) => {
  try {
    return getImg(`img/${method}.png`)
  } catch (error) {
    return ''
  }
}

const getMethodLabel = (method: string) => {
  return method.toUpperCase()
}

const getList = async () => {
  try {
    isLoading.value = true
    createdMFAList.value = await getMfaList()
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
getList()

const goDetailPage = ({ method }: MFAItem) => {
  router.push({ name: 'mfa-detail', params: { method } })
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
