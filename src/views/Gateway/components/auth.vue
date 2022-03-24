<template>
  <div>
    <div class="auth-create" v-if="!hasAuth" v-loading="loadingAuth">
      <el-button type="primary" :icon="Plus" @click="openAuthCreate()">
        {{ tl('addAuth') }}
      </el-button>
      <div class="tips">
        {{ tl('noAuthTips') }}
      </div>
    </div>
    <div v-else>
      <authn-details
        :gateway-info="hasAuth"
        :update-func="authUpdate"
        :delete-func="authDelete"
        :gateway="name"
      ></authn-details>
    </div>
    <el-dialog v-model="createDialog" width="80%">
      <authn-create
        :gateway="true"
        :cancel-func="cancelCreate"
        :create-func="authCreate"
      ></authn-create>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { getGatewayAuth, updateGatewayAuth, deleteGatewayAuth, addGatewayAuth } from '@/api/gateway'
import AuthnCreate from '../../Auth/AuthnCreate.vue'
import AuthnDetails from '../../Auth/AuthnDetails.vue'
import { ElMessage as M } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'GatewayDetailAuth',
  components: { AuthnCreate, AuthnDetails },
  setup() {
    let createDialog = ref(false)
    let hasAuth = ref(false)
    let loadingAuth = ref(true)
    const { t } = useI18n()
    const route = useRoute()
    const gname = String(route.params.name).toLowerCase()

    const openAuthCreate = async function () {
      createDialog.value = true
    }

    const authInfo = async function () {
      loadingAuth.value = true
      let res = await getGatewayAuth(gname).catch(() => {})
      if (res === 204) {
        hasAuth.value = false
      } else if (res) {
        hasAuth.value = res
      }
      loadingAuth.value = false
    }
    const cancelCreate = function () {
      createDialog.value = false
    }

    const authCreate = async function (data) {
      const gData = {
        ...data.data,
        enable: true,
      }
      let res = await addGatewayAuth(gname, gData).catch(() => {})
      if (res) {
        createDialog.value = false
        M.success(t('Base.createSuccess'))
        authInfo()
      }
    }

    const authUpdate = async function (data) {
      let res = await updateGatewayAuth(gname, data).catch(() => {})
      if (res) {
        M.success(t('Base.updateSuccess'))
        authInfo()
      }
    }

    const authDelete = async function () {
      let res = await deleteGatewayAuth(gname).catch(() => {})
      if (res) {
        hasAuth.value = false
        M.success(t('Base.deleteSuccess'))
      }
    }

    onMounted(() => {
      authInfo()
    })

    return {
      Plus,
      tl: (key, collection = 'Gateway') => t(collection + '.' + key),
      openAuthCreate,
      createDialog,
      hasAuth,
      cancelCreate,
      authCreate,
      loadingAuth,
      authUpdate,
      authDelete,
      name: gname,
    }
  },
})
</script>

<style lang="scss" scoped>
.auth-create {
  text-align: center;
  margin: 20px auto;
  .tips {
    width: 60%;
    margin: 20px auto;
  }
}

.el-dialog__wrapper :deep(.el-dialog) {
  width: 80%;
}
</style>
