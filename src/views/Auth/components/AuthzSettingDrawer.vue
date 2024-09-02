<template>
  <el-drawer v-model="showDrawer" :title="t('Auth.authzSetting')" size="800px">
    <el-row :gutter="26" v-loading="isLoading">
      <el-col :span="12">
        <el-card class="app-card with-border" shadow="never">
          <el-form :model="record" label-position="top">
            <section>
              <el-form-item :label="$t('Auth.enableCache')">
                <el-switch v-model="record.cache.enable" />
              </el-form-item>
              <template v-if="record.cache?.enable">
                <el-form-item :label="$t('Auth.maxSize')">
                  <CustomInputNumber v-model.number="record.cache.max_size" placeholder="32" />
                </el-form-item>
                <el-form-item :label="$t('Auth.ttl')">
                  <InputWithUnit
                    v-model="record.cache.ttl"
                    :units="timeUnits"
                    number-placeholder="1"
                  />
                </el-form-item>
                <el-form-item>
                  <template #label>
                    <FormItemLabel
                      :label="$t('Auth.excludedTopics')"
                      :desc="$t('Auth.excludedTopicsDesc')"
                    />
                  </template>
                  <ArrayEditor v-model="record.cache.excludes" />
                </el-form-item>
              </template>
            </section>
            <section>
              <el-form-item :label="$t('Auth.noMatch')">
                <el-select v-model="record.no_match">
                  <el-option value="allow" />
                  <el-option value="deny" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('Auth.denyAction')">
                <el-select v-model="record.deny_action">
                  <el-option value="ignore" />
                  <el-option value="disconnect" />
                </el-select>
              </el-form-item>
            </section>
          </el-form>
          <el-button @click="showDrawer = false">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button type="primary" :disabled="!$hasPermission('post')" @click="save">
            {{ $t('Base.save') }}
          </el-button>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="app-card with-border" shadow="never">
          <el-row>
            <el-col :span="24">
              <div class="part-header">{{ titleCase($t('Auth.clearCache')) }}</div>
              <p class="block-desc">{{ $t('Auth.clearCacheDesc') }}</p>
              <el-button
                type="primary"
                :disabled="!$hasPermission('delete')"
                plain
                @click="clearCache"
              >
                {{ $t('Auth.clearCache') }}
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script setup lang="ts">
import { listAuthzSetting, clearCache as requestClearCache, updateAuthzSetting } from '@/api/auth'
import { titleCase } from '@/common/tools'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import { AuthzSetting } from '@/types/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Ref, WritableComputedRef } from 'vue'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormItemLabel from '@/components/FormItemLabel.vue'
import ArrayEditor from '@/components/ArrayEditor.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue'])

const showDrawer: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

watch(showDrawer, (val) => {
  if (val) {
    loadData()
  }
})

const { t } = useI18n()

const isLoading = ref(false)
const record: Ref<AuthzSetting> = ref({
  cache: {},
} as AuthzSetting)

const timeUnits = [
  { value: 's', label: t('Base.second') },
  { value: 'm', label: t('Base.minute') },
  { value: 'h', label: t('Base.hour') },
]

const loadData = async () => {
  try {
    isLoading.value = true
    const res: AuthzSetting = await listAuthzSetting()
    if (res.cache === undefined) {
      res.cache = { enable: false, excludes: [] }
    }
    record.value = res
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const save = async function () {
  try {
    await updateAuthzSetting(record.value)
    ElMessage.success(t('Base.updateSuccess'))
    showDrawer.value = false
  } catch (error) {
    //
  }
}

const clearCache = async () => {
  try {
    await ElMessageBox.confirm(t('Auth.clearCacheConfirm'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    await requestClearCache()
    ElMessage.success(t('Auth.clearedSuccessfully'))
  } catch (error) {
    //
  }
}
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
