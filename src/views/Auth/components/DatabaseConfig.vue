<template>
  <div class="database-config config">
    <!-- Connect -->
    <div class="part-header">
      {{ $t('Auth.connect') }}
    </div>
    <el-form
      ref="formCom"
      class="create-form"
      label-position="top"
      :model="databaseConfig"
      :rules="rules"
    >
      <el-row :gutter="20">
        <el-col v-if="isRedis" :span="12">
          <el-form-item :label="$t('Auth.redisType')">
            <el-select v-model="databaseConfig.redis_type">
              <el-option value="single" :label="$t('Auth.single')" />
              <el-option value="sentinel" label="Sentinel" />
              <el-option value="cluster" label="Cluster" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB" :span="12">
          <el-form-item :label="$t('Auth.mongoType')">
            <el-select v-model="databaseConfig.mongo_type">
              <el-option value="single" :label="$t('Auth.single')" />
              <el-option value="rs" label="Replica Set" />
              <el-option value="sharded" label="Sharding" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isServers" :span="12">
          <el-form-item :label="$t('Auth.servers')" required prop="servers">
            <el-input v-model="databaseConfig.servers" type="textarea" :rows="3" />
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <el-form-item :label="$t('Auth.server')" required prop="server">
            <el-input v-model="databaseConfig.server" />
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB && databaseConfig.mongo_type !== 'single'" :span="12">
          <el-form-item label="Replica Set Name">
            <el-input v-model="databaseConfig.replica_set_name" />
          </el-form-item>
        </el-col>
        <!-- Redis -->
        <el-col v-if="isRedis && databaseConfig.redis_type === 'sentinel'" :span="12">
          <el-form-item :label="$t('Auth.sentinel')">
            <el-input v-model="databaseConfig.sentinel" />
          </el-form-item>
        </el-col>
        <!-- Basic -->
        <el-col :span="12">
          <el-form-item :label="$t('Auth.database')" :required="isDatabaseRequired" prop="database">
            <el-input v-model="databaseConfig.database" />
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB" :span="12">
          <el-form-item label="Collection">
            <el-input v-model="databaseConfig.collection" />
          </el-form-item>
        </el-col>
        <el-col v-if="!isRedis" :span="12">
          <el-form-item :label="$t('Base.userName')">
            <el-input v-model="databaseConfig.username" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Base.password')">
            <el-input v-model="databaseConfig.password" type="password" />
          </el-form-item>
        </el-col>
        <template v-if="isMongoDB && databaseConfig.mongo_type === 'rs'">
          <el-col :span="12">
            <el-form-item :label="$t('Auth.readMode')">
              <el-select v-model="databaseConfig.r_mode">
                <el-option value="master" label="master" />
                <el-option value="slave_ok" label="slave_ok" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="databaseConfig.mongo_type === 'rs'" :span="12">
            <el-form-item :label="$t('Auth.writeMode')">
              <el-select v-model="databaseConfig.w_mode">
                <el-option value="safe" label="safe" />
                <el-option value="unsafe" label="unsafe" />
              </el-select>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>

    <!-- TLS -->
    <TLS-config v-model="databaseConfig.ssl" />
    <div class="part-header">
      {{ $t('Auth.connectConfig') }}
    </div>
    <el-form class="create-form" label-position="top">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Pool size">
            <el-input v-model.number="databaseConfig.pool_size" />
          </el-form-item>
        </el-col>
        <el-col v-if="!isMongoDB" :span="12">
          <el-form-item :label="$t('Auth.reconnect')">
            <el-select v-model="databaseConfig.auto_reconnect">
              <el-option :value="true" label="True" />
              <el-option :value="false" label="False" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isMongoDB" :span="12">
          <el-form-item :label="$t('Auth.connectTimeout')">
            <time-input-with-unit-select v-model="databaseConfig.topology.connect_timeout_ms" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="part-header">
      {{ authType === 'authn' ? $t('Auth.authnConfig') : $t('Auth.authzConfig') }}
      <el-button class="help-btn" size="small" @click="toggleNeedHelp">
        {{ $t('Base.help') }}
      </el-button>
    </div>
    <el-form class="create-form" label-position="top">
      <el-row :gutter="20">
        <!-- MySQL & PgSQL -->
        <template v-if="isMySQL || isPgSQL">
          <el-col :span="24">
            <el-form-item label="SQL">
              <el-input v-model="databaseConfig.query" type="textarea" :rows="6" />
              <el-button class="bottom-btn" size="small" @click="setDefaultContent('query')">
                {{ $t('Auth.setDefault') }}
              </el-button>
            </el-form-item>
          </el-col>
        </template>
        <!-- Mongodb -->
        <template v-else-if="isMongoDB">
          <el-col :span="24">
            <el-form-item :label="$t('Auth.selector')">
              <el-input v-model="databaseConfig.selector" type="textarea" :rows="6" />
              <el-button class="bottom-btn" size="small" @click="setDefaultContent('selector')">
                {{ $t('Auth.setDefault') }}
              </el-button>
            </el-form-item>
          </el-col>
        </template>
        <template v-else-if="isRedis">
          <el-col :span="24">
            <el-form-item :label="$t('Auth.cmd')">
              <el-input v-model="databaseConfig.cmd" type="textarea" :rows="6" />
              <el-button class="bottom-btn" size="small" @click="setDefaultContent('cmd')">
                {{ $t('Auth.setDefault') }}
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
                    ? $t('Auth.exampleDataStructures')
                    : isRedis
                    ? $t('Auth.exampleDataCmd')
                    : $t('Auth.sqlHelpContent')
                }}
              </div>
              <code-view
                :lang="isMongoDB ? 'javascript' : isRedis ? 'bash' : 'sql'"
                :code="helpContent"
              />
              <el-button @click="copyText(helpContent)">
                {{ $t('Base.copy') }}
              </el-button>
            </div>
          </el-col>
        </el-collapse-transition>
        <template v-if="authType === 'authn'">
          <el-col v-if="isMySQL" :span="12">
            <el-form-item :label="$t('Auth.queryTimeout')">
              <time-input-with-unit-select v-model="databaseConfig.query_timeout" />
            </el-form-item>
          </el-col>
          <el-col v-if="isMongoDB" :span="12">
            <el-form-item :label="$t('Auth.passwordHashField')">
              <el-input v-model="databaseConfig.password_hash_field" placeholder="password_hash" />
            </el-form-item>
          </el-col>
          <password-hash-algorithm-form-items v-model="databaseConfig" />
          <el-col v-if="isMongoDB" :span="12">
            <el-form-item :label="$t('Auth.saltField')">
              <el-input v-model="databaseConfig.salt_field" placeholder="salt" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Auth.saltPosition')">
              <el-select v-model="databaseConfig.password_hash_algorithm.salt_position">
                <el-option value="prefix" />
                <el-option value="suffix" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isMongoDB" :span="12">
            <el-form-item :label="$t('Auth.superuserField')">
              <el-input
                v-model="databaseConfig.is_superuser_field"
                :placeholder="$t('Auth.isSuperuser')"
              />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CodeView from '@/components/CodeView.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import PasswordHashAlgorithmFormItems from './PasswordHashAlgorithmFormItems.vue'
import TLSConfig from './TLSConfig.vue'
import useDatabaseConfig from '@/hooks/Auth/useDatabaseConfig'
import useCopy from '@/hooks/useCopy'
import useDatabaseConfigForm from '@/hooks/Auth/useDatabaseConfigForm'

export default defineComponent({
  name: 'DatabaseConfig',
  components: { CodeView, TLSConfig, TimeInputWithUnitSelect, PasswordHashAlgorithmFormItems },

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
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const { databaseConfig, defaultContent, helpContent } = useDatabaseConfig(props, ctx)
    const {
      formCom,
      rules,
      isMongoDB,
      isRedis,
      isMySQL,
      isPgSQL,
      isServers,
      isDatabaseRequired,
      validate,
    } = useDatabaseConfigForm(props, databaseConfig)
    const needHelp = ref(false)
    const setDefaultContent = (dataKey: string) => {
      databaseConfig[dataKey] = defaultContent.value
    }

    const { copySuccess, copyText } = useCopy(() => {
      needHelp.value = false
    })
    const toggleNeedHelp = async () => {
      needHelp.value = !needHelp.value
    }

    return {
      formCom,
      rules,
      isMongoDB,
      isRedis,
      isMySQL,
      isPgSQL,
      isServers,
      needHelp,
      helpContent,
      databaseConfig,
      isDatabaseRequired,
      validate,
      setDefaultContent,
      copySuccess,
      copyText,
      toggleNeedHelp,
    }
  },
})
</script>

<style lang="scss">
@import '../style/authConfig.scss';
</style>
