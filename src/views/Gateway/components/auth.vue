<template>
  <div>
    <div class="auth-create" v-if="!hasAuth" v-loading="loadingAuth">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="openAuthCreate()"
      >
        {{ tl("addAuth") }}
      </el-button>
      <div class="tips">
        {{ tl("noAuthTips") }}
      </div>
    </div>
    <div v-else>
      <authn-details
        :gateway-info="hasAuth"
        :update-func="authUpdate"
        :delete-func="authDelete"
      ></authn-details>
    </div>
    <el-dialog v-model="createDialog">
      <authn-create
        :gateway="true"
        :cancel-func="cancelCreate"
        :create-func="authCreate"
      ></authn-create>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted, ref } from "vue";
import {
  getGatewayAuth,
  updateGatewayAuth,
  deleteGatewayAuth,
  addGatewayAuth,
} from "@/api/gateway";
import AuthnCreate from "../../Auth/AuthnCreate.vue";
import AuthnDetails from "../../Auth/AuthnDetails.vue";
import { Message } from "element-plus";
import i18n from "@/i18n";

export default defineComponent({
  name: "GatewayDetailAuth",
  components: { AuthnCreate, AuthnDetails },
  data: function () {
    return {
      name: String(this.$route.params.name).toLowerCase(),
    };
  },
  setup() {
    let createDialog = ref(false);
    let vm = getCurrentInstance();
    let hasAuth = ref(false);
    let loadingAuth = ref(true);

    const tl = function (key, collection = "Gateway") {
      return this.$t(collection + "." + key);
    };

    const openAuthCreate = async function () {
      createDialog.value = true;
    };

    const authInfo = async function () {
      loadingAuth.value = true;
      let name = String(vm.data.name).toLowerCase();
      let res = await getGatewayAuth(name).catch(() => {});
      if (res === 204) {
        hasAuth.value = false;
      } else if (res) {
        hasAuth.value = res;
      }
      loadingAuth.value = false;
    };
    const cancelCreate = function () {
      createDialog.value = false;
    };

    const authCreate = async function (data) {
      const gData = {
        backend: data.backend || "",
        mechanism: data.mechanism || "",
        id: "",
        enable: true,
        password_hash_algorithm: data.config.password_hash_algorithm,
        user_id_type: data.backend.user_id_type || "",
      };
      let name = String(vm.data.name).toLowerCase();
      console.log(data);
      let res = await addGatewayAuth(name).catch(() => {});
      if (res) {
        createDialog.value = false;
        Message.success(i18n.t("Base.createSuccess"));
      }
    };

    const authUpdate = async function (data) {
      const gData = {
        backend: data.backend || "",
        mechanism: data.mechanism || "",
        id: "",
        enable: true,
        password_hash_algorithm: data.config.password_hash_algorithm,
        user_id_type: data.backend.user_id_type || "",
      };
      let name = String(vm.data.name).toLowerCase();
      console.log(data);
      let res = await updateGatewayAuth(name).catch(() => {});
      if (res) {
        Message.success(i18n.t("Base.updateSuccess"));
      }
    };

    const authDelete = async function (data) {
      let name = String(vm.data.name).toLowerCase();
      let res = await deleteGatewayAuth(name).catch(() => {});
      if (res) {
        hasAuth.value = false;
        Message.success(i18n.t("Base.deleteSuccess"));
      }
    };

    onMounted(() => {
      authInfo();
    });

    return {
      tl,
      openAuthCreate,
      createDialog,
      hasAuth,
      cancelCreate,
      authCreate,
      loadingAuth,
      authUpdate,
      authDelete,
    };
  },
});
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

.el-dialog__wrapper ::v-deep {
  .el-dialog {
    width: 80%;
  }
}
</style>
