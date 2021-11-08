<template>
  <div class="auth auth-details app-wrapper">
    <back-button back-url="/authentication">
      {{ $t("Auth.backAuthnList") }}
    </back-button>
    <div class="section-header" v-loading.lock="authnDetailLock">
      <div class="section-header__block">
        <div>
          <img
            v-if="configData.mechanism !== 'jwt'"
            :src="currImg"
            width="56px"
          />
        </div>
        <div>
          <div class="section-header__title">
            {{ titleMap[currBackend] || "JWT" }}
          </div>
          <el-tag type="info" size="mini">
            {{ configData.mechanism }}
          </el-tag>
        </div>
      </div>
      <div>
        <el-button type="danger" size="small" @click="handleDelete">
          {{ $t("Base.delete") }}
        </el-button>
        <el-button size="small" @click="handleUpdate(configData)">
          {{ configData.enable ? $t("Auth.disable") : $t("Auth.enable") }}
        </el-button>
      </div>
    </div>
    <el-tabs v-if="!authnDetailLock">
      <el-tab-pane
        v-if="currBackend === 'built-in-database'"
        :label="$t('Auth.dataConfig')"
        :lazy="true"
      >
        <data-manager
          v-model="dataManager"
          :field="configData.user_id_type"
        ></data-manager>
      </el-tab-pane>
      <el-tab-pane :label="$t('Auth.config')" :lazy="true">
        <el-card shadow="never">
          <template v-if="!authnDetailLock">
            <template v-if="configData.mechanism !== 'jwt'">
              <database-config
                v-if="
                  ['mysql', 'postgresql', 'mongodb', 'redis'].includes(
                    currBackend
                  )
                "
                :database="currBackend"
                v-model="configData"
                auth-type="authn"
              ></database-config>
              <http-config
                auth-type="authn"
                v-else-if="currBackend === 'http'"
                v-model="configData"
              ></http-config>
              <built-in-config
                v-else-if="currBackend === 'built-in-database'"
                :type="configData.mechanism"
                v-model="configData"
              ></built-in-config>
            </template>
            <jwt-config v-else v-model="configData"></jwt-config>
          </template>
          <el-button type="primary" @click="handleUpdate">
            {{ $t("Base.update") }}
          </el-button>
          <!-- <el-button @click="handleTest">
          {{ $t('Base.test') }}
        </el-button> -->
          <el-button @click="$router.push('/authentication')">
            {{ $t("Base.cancel") }}
          </el-button>
        </el-card>
      </el-tab-pane>
      <el-tab-pane></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref } from "vue";
import { loadAuthn } from "@/api/auth";
import BackButton from "./components/BackButton.vue";
import DatabaseConfig from "./components/DatabaseConfig.vue";
import HttpConfig from "./components/HttpConfig.vue";
import BuiltInConfig from "./components/BuiltInConfig.vue";
import JwtConfig from "./components/JwtConfig.vue";
import DataManager from "./components/DataManager.vue";
import { updateAuthn, deleteAuthn } from "@/api/auth";
import useAuthnCreate from "@/hooks/Auth/useAuthnCreate";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "AuthnDetails",
  components: {
    DatabaseConfig,
    BackButton,
    HttpConfig,
    BuiltInConfig,
    DataManager,
    JwtConfig,
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
  },
  setup(props) {
    const route = useRoute();
    const authnDetailLock = ref(false);
    const id = computed(function () {
      return route.params.id;
    });
    const configData = ref({
      ssl: { enable: false },
    });
    const currBackend = ref("");
    const currImg = computed(() => {
      if (currBackend.value) {
        return require(`@/assets/img/${currBackend.value}.png`);
      }
      return "";
    });
    const dataManager = reactive({
      user_id: "",
      password: "",
      is_superuser: false,
    });
    const loadData = async function () {
      authnDetailLock.value = true;
      const res =
        props.gatewayInfo || (await loadAuthn(id.value).catch(() => {}));
      authnDetailLock.value = false;

      if (res) {
        currBackend.value = res.backend;
        configData.value = res;
      }
    };
    const titleMap = {
      mysql: "MySQL",
      postgresql: "PostgreSQL",
      http: "HTTP Server",
      "built-in-database": "Built in Database",
    };
    loadData();
    const handleUpdate = async function ({ enable }) {
      const { create } = useAuthnCreate();
      const { id } = configData.value;
      const data = create(
        configData.value,
        configData.value.backend,
        configData.value.mechanism
      );
      if (enable !== undefined) {
        data.enable = !enable;
      }
      await updateAuthn(id, data);
      this.$message.success(this.$t("Base.updateSuccess"));
      this.$router.push({ name: "authentication" });
    };
    const handleDelete = async function () {
      this.$confirm(this.$t("General.confirmDelete"), {
        confirmButtonText: this.$t("Base.confirm"),
        cancelButtonText: this.$t("Base.cancel"),
        type: "warning",
      })
        .then(async () => {
          await deleteAuthn(configData.value.id);
          this.$t("Base.deleteSuccess");
          this.$router.push({ name: "authentication" });
        })
        .catch(() => {});
    };
    return {
      currBackend,
      currImg,
      titleMap,
      configData,
      dataManager,
      authnDetailLock,
      handleUpdate,
      handleDelete,
    };
  },
});
</script>

<style lang="scss">
@import "./style/auth.scss";
</style>
