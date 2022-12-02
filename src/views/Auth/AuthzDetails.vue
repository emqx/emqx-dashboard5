<template>
  <div class="auth auth-details app-wrapper">
    <detail-header :item="{ name: titleMap[type], path: '/authorization' }" />
    <div class="section-header">
      <div class="section-header__block">
        <div>
          <img :src="currImg" width="64" />
        </div>
        <div>
          <div class="info-tags">
            <AuthItemStatus is-tag :metrics="authMetrics" />
          </div>
        </div>
      </div>
      <div>
        <el-button @click="handleUpdate(configData)">
          {{ configData.enable ? $t('Base.disable') : $t('Base.enable') }}
        </el-button>
        <el-button type="danger" plain @click="handleDelete">
          {{ $t('Base.delete') }}
        </el-button>
      </div>
    </div>
    <el-tabs type="card" class="detail-tabs" v-loading.lock="authzDetailLock" v-model="currTab">
      <el-tab-pane :label="$t('Base.overview')" name="overview" :lazy="true">
        <AuthItemOverview
          :metrics="authMetrics"
          type="authz"
          :refresh-loading="refreshLoading"
          @refresh="handleRefresh"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="type === 'built_in_database'"
        :label="$t('Auth.permissions')"
        name="users"
        :lazy="true"
      >
        <authz-manager />
      </el-tab-pane>
      <el-tab-pane v-else :label="$t('Base.setting')" name="settings" :lazy="true">
        <el-card>
          <database-config
            v-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(type)"
            ref="formCom"
            :database="type"
            v-model="configData"
            auth-type="authz"
            is-edit
          />
          <file-config v-else-if="type === 'file'" ref="formCom" v-model="configData" />
          <http-config
            v-else-if="type === 'http'"
            ref="formCom"
            auth-type="authz"
            v-model="configData"
            is-edit
          />
          <el-button @click="$router.push('/authorization')">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleUpdate">
            {{ $t('Base.update') }}
          </el-button>
          <!-- <el-button @click="handleTest">
            {{ $t('Base.test') }}
          </el-button> -->
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import DetailHeader from '@/components/DetailHeader.vue'
import { loadAuthz, deleteAuthz, updateAuthz } from '@/api/auth'
import FileConfig from './components/FileConfig.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import useAuthzCreate from '@/hooks/Auth/useAuthzCreate'
import useAuth from '@/hooks/Auth/useAuth'
import AuthzManager from './components/AuthzManager.vue'
import HttpConfig from './components/HttpConfig.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox as MB, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { jumpToErrorFormItem } from '@/common/tools'
import AuthItemOverview from './components/AuthItemOverview.vue'
import { queryAuthzItemMetrics } from '@/api/auth'
import AuthItemStatus from './components/AuthItemStatus.vue'
import { checkNOmitFromObj } from '@/common/tools.ts'
import useToggleAuthStatus from '@/hooks/Auth/useToggleAuthStatus'

export default defineComponent({
  name: 'AuthzDetails',
  components: {
    DetailHeader,
    FileConfig,
    DatabaseConfig,
    AuthzManager,
    HttpConfig,
    AuthItemOverview,
    AuthItemStatus,
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const refreshLoading = ref(false)
    const authzDetailLock = ref(false)
    const { titleMap } = useAuth()
    const configData = ref({
      ssl: { enable: false },
    })
    const authMetrics = ref(undefined)
    const formCom = ref()
    const currTab = ref('overview')
    const queryTab = computed(() => {
      return route.query.tab
    })
    if (queryTab.value) {
      currTab.value = queryTab.value
    }

    const type = computed(function () {
      return route.params.type
    })
    const currImg = computed(() => {
      if (type.value) {
        return require(`@/assets/img/${type.value}.png`)
      }
      return ''
    })
    const { toggleAuthStatus } = useToggleAuthStatus()

    const loadData = async function () {
      authzDetailLock.value = true
      try {
        configData.value = await loadAuthz(type.value)
      } catch (error) {
        //
      } finally {
        authzDetailLock.value = false
      }
    }
    const handleRefresh = async () => {
      refreshLoading.value = true
      try {
        await getAuthzMetrics()
      } catch (error) {
        // ignore error
      } finally {
        refreshLoading.value = false
      }
    }
    const getAuthzMetrics = async () => {
      try {
        const data = await queryAuthzItemMetrics(type.value)
        authMetrics.value = data
      } catch (error) {
        //
      }
    }

    /**
     * @param authz has value when the action is update status
     */
    const handleUpdate = async function ({ enable }) {
      let isVerified = true
      try {
        if (formCom.value) {
          await formCom.value.validate().catch(() => {
            isVerified = false
            jumpToErrorFormItem()
          })
        }
        if (!isVerified) {
          return
        }
        const { create } = useAuthzCreate()
        const data = checkNOmitFromObj(create(configData.value, type.value))
        if (enable !== undefined) {
          await toggleAuthStatus(data, 'authz')
          getAuthzMetrics()
        } else {
          await updateAuthz(type.value, data)
          ElMessage.success(t('Base.updateSuccess'))
        }
        enable === undefined ? router.push({ name: 'authorization' }) : loadData()
      } catch (error) {
        //
      }
    }

    const handleDelete = async function () {
      MB.confirm(t('Base.confirmDelete'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          await deleteAuthz(type.value)
          t('Base.deleteSuccess')
          router.push({ name: 'authorization' })
        })
        .catch(() => {})
    }

    const initData = async () => {
      await loadData()
      getAuthzMetrics()
    }

    initData()

    return {
      type,
      currImg,
      currTab,
      titleMap,
      authzDetailLock,
      configData,
      authMetrics,
      formCom,
      refreshLoading,
      handleDelete,
      handleUpdate,
      handleRefresh,
    }
  },
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
