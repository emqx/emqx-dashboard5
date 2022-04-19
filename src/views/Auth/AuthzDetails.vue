<template>
  <div class="auth auth-details app-wrapper">
    <detail-header :item="{ name: titleMap[type], path: '/authorization' }" />
    <div class="section-header" v-loading.lock="authzDetailLock">
      <div class="section-header__block">
        <div>
          <img :src="currImg" width="64" />
        </div>
        <div>
          <div class="info-tags">
            <AuthItemStatus is-tag :metrics="authMetrics" :enable="configData.enable" />
          </div>
        </div>
      </div>
      <div>
        <el-button type="danger" @click="handleDelete">
          {{ $t('Base.delete') }}
        </el-button>
        <el-button @click="handleUpdate(configData)">
          {{ configData.enable ? $t('Base.disable') : $t('Base.enable') }}
        </el-button>
      </div>
    </div>
    <el-tabs v-if="!authzDetailLock">
      <el-tab-pane v-if="hasMetrics(configData)" :label="$t('Base.overview')" :lazy="true">
        <AuthItemOverview :metrics="authMetrics" type="authz" />
      </el-tab-pane>
      <el-tab-pane v-if="type === 'built_in_database'" :label="$t('Auth.userConfig')" :lazy="true">
        <built-in-manager></built-in-manager>
      </el-tab-pane>
      <el-tab-pane v-else :label="$t('Base.setting')" :lazy="true">
        <el-card>
          <database-config
            v-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(type)"
            ref="formCom"
            :database="type"
            v-model="configData"
            auth-type="authz"
          />
          <file-config v-else-if="type === 'file'" ref="formCom" v-model="configData"></file-config>
          <http-config
            v-else-if="type === 'http'"
            ref="formCom"
            auth-type="authz"
            v-model="configData"
          ></http-config>
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
      <el-tab-pane class="empty-tab"></el-tab-pane>
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
import BuiltInManager from './components/BuiltInManager.vue'
import HttpConfig from './components/HttpConfig.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox as MB, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { jumpToErrorFormItem } from '@/common/tools'
import AuthItemOverview from './components/AuthItemOverview.vue'
import { queryAuthzItemMetrics } from '@/api/auth'
import { hasMetrics } from '@/hooks/Auth/useAuthz'
import AuthItemStatus from './components/AuthItemStatus.vue'

export default defineComponent({
  name: 'AuthzDetails',
  components: {
    DetailHeader,
    FileConfig,
    DatabaseConfig,
    BuiltInManager,
    HttpConfig,
    AuthItemOverview,
    AuthItemStatus,
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()

    const authzDetailLock = ref(false)
    const { titleMap } = useAuth()
    const configData = ref({
      ssl: { enable: false },
    })
    const authMetrics = ref(undefined)

    const formCom = ref()

    const type = computed(function () {
      return route.params.type
    })
    const currImg = computed(() => {
      if (type.value) {
        return require(`@/assets/img/${type.value}.png`)
      }
      return ''
    })

    const loadData = async function () {
      authzDetailLock.value = true
      const res = await loadAuthz(type.value).catch(() => {
        authzDetailLock.value = false
      })
      authzDetailLock.value = false
      if (res) {
        configData.value = res
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

    const handleUpdate = async function ({ enable }) {
      let isVerified = true
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
      const data = create(configData.value, type.value)
      if (enable !== undefined) {
        data.enable = !enable
      }
      await updateAuthz(type.value, data)
      ElMessage.success(t('Base.updateSuccess'))
      router.push({ name: 'authorization' })
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
      if (hasMetrics(configData.value)) {
        getAuthzMetrics()
      }
    }

    initData()

    return {
      type,
      currImg,
      titleMap,
      authzDetailLock,
      configData,
      authMetrics,
      formCom,
      hasMetrics,
      handleDelete,
      handleUpdate,
    }
  },
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
