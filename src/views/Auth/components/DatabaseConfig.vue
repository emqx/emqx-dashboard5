<template>
  <div class="database-config config">
    <!-- Connect -->
    <div class="part-header">
      {{ $t("Auth.connect") }}
    </div>
    <el-form class="create-form" label-position="top" size="small">
      <el-row :gutter="20">
        <el-col v-if="isRedis" :span="12">
          <el-form-item :label="$t('Auth.redisType')">
            <el-select v-model="databaseConfig.redis_type">
              <el-option value="single" :label="$t('Auth.single')"></el-option>
              <el-option value="sentinel" label="Sentinel"></el-option>
              <el-option value="cluster" label="Cluster"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB" :span="12">
          <el-form-item :label="$t('Auth.mongoType')">
            <el-select v-model="databaseConfig.mongo_type">
              <el-option value="single" :label="$t('Auth.single')"></el-option>
              <el-option value="rs" label="Replica Set"></el-option>
              <el-option value="sharded" label="Sharding"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          v-if="
            (isMongoDB && databaseConfig.mongo_type !== 'single') ||
            (isRedis && databaseConfig.redis_type !== 'single')
          "
          :span="12"
        >
          <el-form-item :label="$t('Auth.servers')">
            <el-input
              v-model="databaseConfig.servers"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <el-form-item :label="$t('Auth.server')">
            <el-input v-model="databaseConfig.server"></el-input>
          </el-form-item>
        </el-col>
        <el-col
          v-if="isMongoDB && databaseConfig.mongo_type !== 'single'"
          :span="12"
        >
          <el-form-item label="Replica Set Name">
            <el-input v-model="databaseConfig.replica_set_name"></el-input>
          </el-form-item>
        </el-col>
        <!-- Redis -->
        <el-col
          v-if="isRedis && databaseConfig.redis_type !== 'single'"
          :span="12"
        >
          <el-form-item :label="$t('Auth.sentinel')">
            <el-input v-model="databaseConfig.sentinel"></el-input>
          </el-form-item>
        </el-col>
        <!-- Basic -->
        <el-col :span="12">
          <el-form-item :label="$t('Auth.database')">
            <el-input v-model="databaseConfig.database"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB" :span="12">
          <el-form-item label="Collection">
            <el-input v-model="databaseConfig.collection"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="!isRedis" :span="12">
          <el-form-item :label="$t('Base.userName')">
            <el-input v-model="databaseConfig.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Base.password')">
            <el-input
              v-model="databaseConfig.password"
              type="password"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- TLS -->
    <TLS-config v-model="databaseConfig.ssl"></TLS-config>
    <div class="part-header">
      {{ $t("Auth.connectConfig") }}
    </div>
    <el-form class="create-form" label-position="top" size="small">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Pool size">
            <el-input v-model.number="databaseConfig.pool_size"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="!isMongoDB" :span="12">
          <el-form-item :label="$t('Auth.reconnect')">
            <el-select v-model="databaseConfig.auto_reconnect">
              <el-option :value="true" label="True"></el-option>
              <el-option :value="false" label="False"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB" :span="12">
          <el-form-item :label="$t('Auth.connectTimeout')">
            <el-input
              v-model.number="databaseConfig.topology.connect_timeout_ms"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="part-header">
      {{
        authType === "authn" ? $t("Auth.authnConfig") : $t("Auth.authzConfig")
      }}
      <el-button class="help-btn" size="mini" @click="needHelp = !needHelp">
        {{ $t("Base.help") }}
      </el-button>
    </div>
    <el-form class="create-form" label-position="top" size="small">
      <el-row :gutter="20">
        <!-- MySQL & PgSQL -->
        <template v-if="isMySQL || isPgSQL">
          <el-col :span="24">
            <el-form-item label="SQL">
              <el-input
                v-model="databaseConfig.query"
                type="textarea"
                :rows="6"
              ></el-input>
              <el-button
                class="bottom-btn"
                size="mini"
                @click="setDefaultContent('query')"
              >
                {{ $t("Auth.setDefault") }}
              </el-button>
            </el-form-item>
          </el-col>
        </template>
        <!-- Mongodb -->
        <template v-else-if="isMongoDB">
          <el-col :span="24">
            <el-form-item :label="$t('Auth.selector')">
              <el-input
                v-model="databaseConfig.selector"
                type="textarea"
                :rows="6"
              ></el-input>
              <el-button
                class="bottom-btn"
                size="mini"
                @click="setDefaultContent('selector')"
              >
                {{ $t("Auth.setDefault") }}
              </el-button>
            </el-form-item>
          </el-col>
        </template>
        <template v-else-if="isRedis">
          <el-col :span="24">
            <el-form-item :label="$t('Auth.cmd')">
              <el-input
                v-model="databaseConfig.query"
                type="textarea"
                :rows="6"
              ></el-input>
              <el-button
                class="bottom-btn"
                size="mini"
                @click="setDefaultContent('cmd')"
              >
                {{ $t("Auth.setDefault") }}
              </el-button>
            </el-form-item>
          </el-col>
        </template>
        <el-collapse-transition>
          <el-col v-if="needHelp" :span="24">
            <div class="help-block">
              <div class="part-header">
                {{
                  isMongoDB
                    ? $t("Auth.exampleDataStructures")
                    : isRedis
                    ? $t("Auth.exampleDataCmd")
                    : $t("Auth.sqlHelpContent")
                }}
              </div>
              <code-view
                :lang="isMongoDB ? 'javascript' : isRedis ? 'bash' : 'sql'"
                :code="helpContent"
              ></code-view>
              <el-button size="small">
                {{ $t("Base.copy") }}
              </el-button>
            </div>
          </el-col>
        </el-collapse-transition>
        <template v-if="authType === 'authn'">
          <el-col v-if="isMySQL" :span="12">
            <el-form-item :label="$t('Auth.queryTimeout')">
              <time-input-with-unit-select
                v-model="databaseConfig.query_timeout"
              ></time-input-with-unit-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isMongoDB" :span="12">
            <el-form-item :label="$t('Auth.passwordHashField')">
              <el-input
                v-model="databaseConfig.password_hash_field"
                placeholder="password_hash"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Auth.passwordHash')">
              <el-select v-model="databaseConfig.password_hash_algorithm">
                <el-option
                  v-for="item in HashOptions"
                  :key="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isMongoDB" :span="12">
            <el-form-item :label="$t('Auth.saltField')">
              <el-input
                v-model="databaseConfig.salt_field"
                placeholder="salt"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Auth.saltPosition')">
              <el-select v-model="databaseConfig.salt_position">
                <el-option value="prefix"></el-option>
                <el-option value="suffix"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isMongoDB" :span="12">
            <el-form-item :label="$t('Auth.superuserField')">
              <el-input
                v-model="databaseConfig.is_superuser_field"
                :placeholder="$t('Auth.isSuperuser')"
              ></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import CodeView from "@/components/CodeView";
import TimeInputWithUnitSelect from "@/components/TimeInputWithUnitSelect.vue";
import TLSConfig from "./TLSConfig.vue";
import usePassword from "@/hooks/usePassword";
import useDatabaseConfig from "@/hooks/Auth/useDatabaseConfig";
import useCopy from "@/hooks/useCopy";

export default defineComponent({
  name: "DatabaseConfig",
  components: { CodeView, TLSConfig, TimeInputWithUnitSelect },

  props: {
    database: {
      required: true,
      type: String,
    },
    modelValue: {
      required: true,
      type: Object,
    },
    authType: {
      required: true,
      type: String,
    },
  },
  emits: ["update:modelValue"],
  setup(props, ctx) {
    const { databaseConfig, defaultContent, helpContent } = useDatabaseConfig(
      props,
      ctx
    );
    const needHelp = ref(false);
    const setDefaultContent = (dataKey) => {
      databaseConfig[dataKey] = defaultContent.value;
    };
    const isMongoDB = computed(() => props.database === "mongodb");
    const isRedis = computed(() => props.database === "redis");
    const isMySQL = computed(() => props.database === "mysql");
    const isPgSQL = computed(() => props.database === "postgresql");
    const { copySuccess } = useCopy(() => {
      needHelp.value = false;
    });
    const { HashOptions } = usePassword();
    return {
      isMongoDB,
      isRedis,
      isMySQL,
      isPgSQL,
      needHelp,
      helpContent,
      databaseConfig,
      setDefaultContent,
      copySuccess,
      HashOptions,
    };
  },
});
</script>

<style lang="scss">
@import "../style/authConfig.scss";
</style>
