<template>
  <div :class="['auth', 'auth-details', !gateway && 'app-wrapper']">
    <back-button back-url="/authentication" v-if="!gateway">
      {{ $t("Auth.backAuthnList") }}
    </back-button>
    <div class="section-header" v-loading.lock="authnDetailLock">
      <div class="section-header__block">
        <template v-if="!gateway">
          <div>
            <img
              v-if="configData.mechanism !== 'jwt'"
              :src="currImg"
              width="90"
            />
          </div>
          <div>
            <div class="section-header__title">
              {{ titleMap[currBackend] }}
            </div>
            <el-tag type="info" size="mini">
              {{ configData.mechanism }}
            </el-tag>
          </div>
        </template>
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
      <el-tab-pane :label="$t('Auth.config')" :lazy="true">
        <template v-if="configData.mechanism !== 'jwt'">
          <database-config
            v-if="
              ['mysql', 'postgresql', 'mongodb', 'redis'].includes(currBackend)
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
        <el-button type="primary" @click="handleUpdate" size="small">
          {{ $t("Base.update") }}
        </el-button>
        <!-- <el-button @click="handleTest">
          {{ $t('Base.test') }}
        </el-button> -->
        <el-button @click="$router.push('/authentication')" size="small">
          {{ $t("Base.cancel") }}
        </el-button>
      </el-tab-pane>
      <el-tab-pane
        v-if="currBackend === 'built-in-database'"
        :label="$t('Auth.userConfig')"
        :lazy="true"
      >
        <data-manager
          :field="configData.user_id_type"
          :gateway="gateway"
        ></data-manager>
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
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessageBox as MB, ElMessage as M } from "element-plus";

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
    gateway: {
      type: String,
      requierd: false,
      default: "",
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
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

    const loadData = async function () {
      authnDetailLock.value = true;
      const res =
        props.gatewayInfo || (await loadAuthn(id.value).catch(() => {}));
      authnDetailLock.value = false;

      if (res) {
        currBackend.value = res.backend || res.mechanism;
        configData.value = res;
      }
    };
    const titleMap = {
      mysql: "MySQL",
      postgresql: "PostgreSQL",
      http: "HTTP Server",
      "built-in-database": "Built in Database",
      jwt: "JWT",
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
      let res;
      if (props.gateway) {
        res = await props.updateFunc(data).catch(() => {});
      } else {
        res = await updateAuthn(id, data).catch(() => {});
        if (res) {
          M.success(t("Base.updateSuccess"));
          router.push({ name: "authentication" });
        }
      }
    };
    const handleDelete = async function () {
      MB.confirm(t("General.confirmDelete"), {
        confirmButtonText: t("Base.confirm"),
        cancelButtonText: t("Base.cancel"),
        type: "warning",
      })
        .then(async () => {
          let res;
          if (props.gateway) {
            res = await props.deleteFunc();
          } else {
            res = await deleteAuthn(configData.value.id).catch(() => {});
            if (res) {
              M.success(t("Base.deleteSuccess"));
              router.push({ name: "authentication" });
            }
          }
        })
        .catch(() => {});
    };
    return {
      currBackend,
      currImg,
      titleMap,
      configData,
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
