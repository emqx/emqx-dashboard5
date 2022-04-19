<template>
  <div class="authz-setting app-wrapper">
    <detail-header :item="{ name: $t('Auth.authzSetting'), path: '/authorization' }" />
    <el-card class="app-card">
      <el-row>
        <el-col :span="12">
          <el-form :model="record" label-position="top">
            <section>
              <div class="part-header">{{ $t('Auth.basicSettings') }}</div>
              <el-form-item label="No Match">
                <el-select v-model="record.no_match">
                  <el-option value="allow"></el-option>
                  <el-option value="deny"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Deny Action">
                <el-select v-model="record.deny_action">
                  <el-option value="ignore"></el-option>
                  <el-option value="disconnect"></el-option>
                </el-select>
              </el-form-item>
            </section>
            <section>
              <div class="part-header">{{ $t('Auth.authzCache') }}</div>
              <el-form-item :label="$t('Auth.enableCache')">
                <BooleanSelect
                  v-model="record.cache.enable"
                  :true-label="$t('Base.yes')"
                  :false-label="$t('Base.no')"
                />
              </el-form-item>
              <template v-if="record.cache.enable">
                <el-form-item :label="$t('Auth.maxSize')">
                  <el-input v-model.number="record.cache.max_size" placeholder="32"></el-input>
                </el-form-item>
                <el-form-item :label="$t('Auth.ttl')">
                  <el-input v-model.number="record.cache.ttl" placeholder="1">
                    <template #append>
                      <el-select v-model="record.cache.unit">
                        <el-option value="s" :label="$t('Base.second')"></el-option>
                        <el-option value="m" :label="$t('Base.minute')"></el-option>
                        <el-option value="h" :label="$t('Base.hour')"></el-option>
                      </el-select>
                    </template>
                  </el-input>
                </el-form-item>
              </template>
            </section>
          </el-form>
          <el-button @click="$router.push('/authorization')">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button type="primary" @click="save">{{ $t('Base.save') }}</el-button>
        </el-col>
      </el-row>
      <section class="block-clear-cache">
        <div class="part-header">{{ titleCase($t('Auth.clearCache')) }}</div>
        <p class="block-desc">{{ $t('Auth.clearCacheDesc') }}</p>
        <el-button type="danger" plain @click="clearCache">{{ $t('Auth.clearCache') }}</el-button>
      </section>
    </el-card>
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
import BooleanSelect from '@/components/BooleanSelect.vue'

const { t } = useI18n()
const router = useRouter()

const record = ref({
  cache: {},
})

const loadData = async () => {
  const res = await listAuthzSetting()
  if (res) {
    const {
      cache: { ttl },
    } = res
    res.cache.ttl = ttl.replace(/[^0-9]/gi, '')
    res.cache.unit = ttl.replace(/[^a-z]+/gi, '')
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
.block-clear-cache {
  margin-top: 20px;
}
.block-desc {
  margin-top: 8px;
  color: var(--el-text-color-secondary);
}
</style>
