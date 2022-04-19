<template>
  <div :class="['auth', 'auth-details', !gateway && 'app-wrapper']">
    <detail-header
      v-if="!gateway"
      :item="{ name: titleMap[currBackend], path: '/authentication' }"
    />
    <div
      :class="{ 'section-header': true, 'embed-gateway': !!gateway }"
      v-loading.lock="authnDetailLock"
    >
      <div class="section-header__block">
        <template v-if="!gateway">
          <div>
            <img v-if="configData.mechanism !== 'jwt'" :src="currImg" width="64" />
          </div>
          <div>
            <div class="info-tags">
              <AuthItemStatus is-tag :metrics="authMetrics" :enable="configData.enable" />
              <el-tag type="info" class="section-status">
                {{ configData.mechanism }}
              </el-tag>
            </div>
          </div>
        </template>
      </div>
      <div>
        <el-button type="danger" plain @click="handleDelete">
          {{ $t('Base.delete') }}
        </el-button>
        <el-button @click="handleUpdate(configData)">
          {{ configData.enable ? $t('Base.disable') : $t('Base.enable') }}
        </el-button>
      </div>
    </div>
    <el-tabs v-if="!authnDetailLock">
      <el-tab-pane
        v-if="hasMetrics(configData) && !gateway"
        :label="$t('Base.overview')"
        :lazy="true"
      >
        <AuthItemOverview :metrics="authMetrics" />
      </el-tab-pane>
      <el-tab-pane :label="$t('Base.setting')" :lazy="true">
        <el-card class="app-card">
          <template v-if="configData.mechanism !== 'jwt'">
            <database-config
              v-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(currBackend)"
              ref="formCom"
              :database="currBackend"
              v-model="configData"
              auth-type="authn"
            ></database-config>
            <http-config
              auth-type="authn"
              v-else-if="currBackend === 'http'"
              ref="formCom"
              v-model="configData"
            ></http-config>
            <built-in-config
              v-else-if="currBackend === 'built_in_database'"
              ref="formCom"
              :type="configData.mechanism"
              v-model="configData"
            ></built-in-config>
          </template>
          <jwt-config ref="formCom" v-else v-model="configData"></jwt-config>
          <el-button @click="$router.push('/authentication')" v-if="!gateway">
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
      <el-tab-pane
        v-if="currBackend === 'built_in_database'"
        :label="$t('Auth.userConfig')"
        :lazy="true"
      >
        <data-manager :field="configData.user_id_type" :gateway="gateway"></data-manager>
      </el-tab-pane>
      <el-tab-pane></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { loadAuthn } from '@/api/auth'
import DatabaseConfig from './components/DatabaseConfig.vue'
import HttpConfig from './components/HttpConfig.vue'
import BuiltInConfig from './components/BuiltInConfig.vue'
import JwtConfig from './components/JwtConfig.vue'
import DataManager from './components/DataManager.vue'
import { updateAuthn, deleteAuthn } from '@/api/auth'
import useAuthnCreate from '@/hooks/Auth/useAuthnCreate'
import useAuth from '@/hooks/Auth/useAuth'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox as MB, ElMessage as M } from 'element-plus'
import { jumpToErrorFormItem } from '@/common/tools'
import AuthItemOverview from './components/AuthItemOverview.vue'
import { queryAuthnItemMetrics } from '@/api/auth'
import { hasMetrics } from '@/hooks/Auth/useAuthn'
import AuthItemStatus from './components/AuthItemStatus.vue'
import DetailHeader from '@/components/DetailHeader.vue'

export default defineComponent({
  name: 'AuthnDetails',
  components: {
    DatabaseConfig,
    HttpConfig,
    BuiltInConfig,
    DataManager,
    JwtConfig,
    AuthItemOverview,
    AuthItemStatus,
    DetailHeader,
  },
  props: {
    gatewayInfo: {
      type: [Object, Boolean],
      required: false,
      default: false,
    },
    updateFunc: {
      type: Function,
      required: false,
      default: () => {},
    },
    deleteFunc: {
      type: Function,
      required: false,
      default: () => {},
    },
    gateway: {
      type: String,
      requierd: false,
      default: '',
    },
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()

    const authnDetailLock = ref(false)

    const id = computed(function () {
      return route.params.id
    })

    const configData = ref({
      ssl: { enable: false },
    })
    const authMetrics = ref(undefined)

    const currBackend = ref('')

    const formCom = ref()

    const currImg = computed(() => {
      if (currBackend.value) {
        return require(`@/assets/img/${currBackend.value}.png`)
      }
      return ''
    })

    const loadData = async function () {
      authnDetailLock.value = true
      const res = props.gatewayInfo || (await loadAuthn(id.value).catch(() => {}))
      authnDetailLock.value = false

      if (res) {
        currBackend.value = res.backend || res.mechanism
        configData.value = res
      }
    }
    const getAuthnMetrics = async () => {
      try {
        const data = await queryAuthnItemMetrics(id.value)
        authMetrics.value = data
      } catch (error) {
        //
      }
    }
    const { titleMap } = useAuth()
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
      const { create } = useAuthnCreate()
      const { id } = configData.value
      const data = create(configData.value, configData.value.backend, configData.value.mechanism)
      if (enable !== undefined) {
        data.enable = !enable
      }
      let res
      if (props.gateway) {
        res = await props.updateFunc(data).catch(() => {})
      } else {
        res = await updateAuthn(id, data).catch(() => {})
        if (res) {
          M.success(t('Base.updateSuccess'))
          loadData()
        }
      }
    }
    const handleDelete = async function () {
      MB.confirm(t('Base.confirmDelete'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          let res
          if (props.gateway) {
            res = await props.deleteFunc()
          } else {
            res = await deleteAuthn(configData.value.id).catch(() => {})
            if (res) {
              M.success(t('Base.deleteSuccess'))
              router.push({ name: 'authentication' })
            }
          }
        })
        .catch(() => {})
    }

    const initData = async () => {
      await loadData()
      if (hasMetrics(configData.value)) {
        getAuthnMetrics()
      }
    }

    initData()

    return {
      currBackend,
      currImg,
      titleMap,
      configData,
      authMetrics,
      authnDetailLock,
      formCom,
      hasMetrics,
      handleUpdate,
      handleDelete,
    }
  },
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
