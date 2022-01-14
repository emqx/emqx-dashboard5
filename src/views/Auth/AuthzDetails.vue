<template>
  <div class="auth auth-details app-wrapper">
    <back-button back-url="/authorization">
      {{ $t('Auth.backAuthzList') }}
    </back-button>
    <div class="section-header" v-loading.lock="authzDetailLock">
      <div class="section-header__block">
        <div>
          <img :src="currImg" width="90" />
        </div>
        <div class="section-header__title">
          {{ titleMap[type] }}
        </div>
      </div>
      <div>
        <el-button type="danger" size="small" @click="handleDelete">
          {{ $t('Base.delete') }}
        </el-button>
        <el-button size="small" @click="handleUpdate(configData)">
          {{ configData.enable ? $t('Auth.disable') : $t('Auth.enable') }}
        </el-button>
      </div>
    </div>
    <el-tabs v-if="!authzDetailLock">
      <el-tab-pane v-if="type === 'built-in-database'" :label="$t('Auth.userConfig')" :lazy="true">
        <built-in-manager></built-in-manager>
      </el-tab-pane>
      <el-tab-pane v-else :label="$t('Auth.config')" :lazy="true">
        <el-card shadow="never">
          <database-config
            v-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(type)"
            :database="type"
            v-model="configData"
            auth-type="authz"
          ></database-config>
          <file-config v-else-if="type === 'file'" v-model="configData"></file-config>
          <http-config
            v-else-if="type === 'http'"
            auth-type="authz"
            v-model="configData"
          ></http-config>
          <el-button type="primary" @click="handleUpdate">
            {{ $t('Base.update') }}
          </el-button>
          <!-- <el-button @click="handleTest">
          {{ $t('Base.test') }}
        </el-button> -->
          <el-button @click="$router.push('/authorization')">
            {{ $t('Base.cancel') }}
          </el-button>
        </el-card>
      </el-tab-pane>
      <el-tab-pane class="empty-tab"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import BackButton from './components/BackButton.vue'
import { loadAuthz, deleteAuthz, updateAuthz } from '@/api/auth'
import FileConfig from './components/FileConfig.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import useAuthzCreate from '@/hooks/Auth/useAuthzCreate'
import BuiltInManager from './components/BuiltInManager.vue'
import HttpConfig from './components/HttpConfig.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox as MB, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'AuthzDetails',
  components: {
    BackButton,
    FileConfig,
    DatabaseConfig,
    BuiltInManager,
    HttpConfig,
  },
  setup() {
    const authzDetailLock = ref(false)
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()

    const titleMap = {
      mysql: 'MySQL',
      file: 'File',
      postgresql: 'PostgreSQL',
      http: 'HTTP Server',
      mongodb: 'MongoDB',
      redis: 'Redis',
      'built-in-database': 'Built-in database',
    }
    const configData = ref({
      ssl: { enable: false },
    })
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
    const handleUpdate = async function ({ enable }) {
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
    loadData()
    return {
      type,
      currImg,
      titleMap,
      authzDetailLock,
      configData,
      handleDelete,
      handleUpdate,
    }
  },
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
