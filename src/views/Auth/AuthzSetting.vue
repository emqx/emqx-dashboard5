<template>
  <div class="authz-setting app-wrapper">
    <detail-header :item="{ name: $t('Auth.authzSetting'), path: '/authorization' }" />
    <el-row :gutter="26">
      <el-col :span="12">
        <el-card class="app-card">
          <el-form :model="record" label-position="top">
            <section>
              <el-form-item :label="$t('Auth.enableCache')">
                <el-switch v-model="record.cache.enable" />
              </el-form-item>
              <template v-if="record.cache.enable">
                <el-form-item :label="$t('Auth.maxSize')">
                  <el-input v-model.number="record.cache.max_size" placeholder="32"></el-input>
                </el-form-item>
                <el-form-item :label="$t('Auth.ttl')">
                  <InputWithUnit
                    v-model="record.cache.ttl"
                    :units="timeUnits"
                    number-placeholder="1"
                  />
                </el-form-item>
              </template>
            </section>
            <section>
              <el-form-item :label="$t('Auth.noMatch')">
                <el-select v-model="record.no_match">
                  <el-option value="allow"></el-option>
                  <el-option value="deny"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('Auth.denyAction')">
                <el-select v-model="record.deny_action">
                  <el-option value="ignore"></el-option>
                  <el-option value="disconnect"></el-option>
                </el-select>
              </el-form-item>
            </section>
          </el-form>
          <el-button @click="$router.push('/authorization')">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button type="primary" @click="save">{{ $t('Base.save') }}</el-button>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="app-card block-clear-card">
          <el-row>
            <el-col :span="24">
              <div class="part-header">{{ titleCase($t('Auth.clearCache')) }}</div>
              <p class="block-desc">{{ $t('Auth.clearCacheDesc') }}</p>
              <el-button type="danger" plain @click="clearCache">{{
                $t('Auth.clearCache')
              }}</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AuthzSetting',
}
</script>

<script setup>
import { ref } from 'vue'
import DetailHeader from '@/components/DetailHeader.vue'
import { listAuthzSetting, updateAuthzSetting, clearCache as requestClearCache } from '@/api/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { titleCase } from '@/common/tools'
import InputWithUnit from '@/components/InputWithUnit.vue'

const { t } = useI18n()
const router = useRouter()

const record = ref({
  cache: {},
})

const timeUnits = [
  { value: 's', label: t('Base.second') },
  { value: 'm', label: t('Base.minute') },
  { value: 'h', label: t('Base.hour') },
]

const loadData = async () => {
  const res = await listAuthzSetting()
  if (res.cache === undefined) {
    res.cache = {
      enable: false,
    }
  }
  if (res) {
    record.value = res
  }
}

const save = async function () {
  await updateAuthzSetting(record.value)
  ElMessage.success(t('Base.updateSuccess'))
  router.push({ name: 'authorization' })
}

const clearCache = async () => {
  await ElMessageBox.confirm(t('Auth.clearCacheConfirm'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
  await requestClearCache()
  ElMessage.success(t('Auth.clearedSuccessfully'))
}

loadData()
</script>

<style lang="scss">
.authz-setting {
  .el-form {
    margin-bottom: 24px;
  }
  .block-desc {
    margin: 24px 0;
    color: var(--el-text-color-secondary);
  }
}
</style>
