<template>
  <div class="app-wrapper">
    <router-link class="link-back" :to="{ name: 'slow-sub' }">
      &lt; {{ $t('SlowSub.backToStatisticsList') }}
    </router-link>
    <h5 class="slow-sub-config-title">
      {{ $t('SlowSub.slowSubscriptionSettings') }}
    </h5>
    <el-card shadow="never" class="app-card slow-sub-config" v-loading="isLoading">
      <div class="config-block">
        <h6 class="config-block-title">{{ $t('SlowSub.basicSettings') }}</h6>
        <el-form
          ref="formCom"
          :model="configForm"
          :rules="rulesOfConfigForm"
          label-position="top"
          size="small"
        >
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item required prop="threshold">
                <template #label>
                  {{ $t('SlowSub.statsThreshold') }}
                  <el-popover
                    placement="top-start"
                    :width="280"
                    trigger="hover"
                    :content="$t('SlowSub.statsThresholdDesc')"
                  >
                    <template #reference>
                      <el-icon><QuestionFilled /></el-icon>
                    </template>
                  </el-popover>
                </template>
                <el-input v-model="configForm.threshold" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item required prop="top_k_num">
                <template #label>
                  {{ $t('SlowSub.maximumNumberOfStatistics') }}
                  <el-popover
                    placement="top-start"
                    :width="280"
                    trigger="hover"
                    :content="$t('SlowSub.maximumNumberOfStatisticsDesc')"
                  >
                    <template #reference>
                      <el-icon><QuestionFilled /></el-icon>
                    </template>
                  </el-popover>
                </template>
                <el-input v-model.number="configForm.top_k_num" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item required prop="expire_interval">
                <template #label>
                  {{ $t('SlowSub.evictionTimeOfRecord') }}
                  <el-popover
                    placement="top-start"
                    :width="280"
                    trigger="hover"
                    :content="$t('SlowSub.evictionTimeOfRecordDesc')"
                  >
                    <template #reference>
                      <el-icon><QuestionFilled /></el-icon>
                    </template>
                  </el-popover>
                </template>
                <el-input v-model="configForm.expire_interval" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item required prop="notice_interval">
                <template #label>
                  {{ $t('SlowSub.noticeInterval') }}
                  <el-popover
                    placement="top-start"
                    :width="280"
                    trigger="hover"
                    :content="$t('SlowSub.noticeIntervalDesc')"
                  >
                    <template #reference>
                      <el-icon><QuestionFilled /></el-icon>
                    </template>
                  </el-popover>
                </template>
                <el-input v-model="configForm.notice_interval" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('SlowSub.noticeQoS')" required prop="notice_qos">
                <el-select v-model="configForm.notice_qos">
                  <el-option v-for="item in QoS_LIST" :key="item" :value="item" :label="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('SlowSub.noticeBatchSize')"
                required
                prop="notice_batch_size"
              >
                <template #label>
                  {{ $t('SlowSub.noticeBatchSize') }}
                  <el-popover
                    placement="top-start"
                    :width="280"
                    trigger="hover"
                    :content="$t('SlowSub.noticeBatchSizeDesc')"
                  >
                    <template #reference>
                      <el-icon><QuestionFilled /></el-icon>
                    </template>
                  </el-popover>
                </template>
                <el-input v-model.number="configForm.notice_batch_size" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-button class="btn-update" type="primary" size="small" @click="update">
          {{ $t('Base.update') }}
        </el-button>
      </div>
      <div class="config-block">
        <h6 class="config-block-title">{{ $t('Base.enable') }}</h6>
        <el-form>
          <el-form-item :label="$t('SlowSub.enableLabel')">
            <el-switch v-model="configForm.enable" @change="toggleStatus" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SlowSubConfig',
})
</script>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import { QoS_LIST } from '@/common/constants'
import { querySlowSubConfig, updateSlowSubConfig } from '@/api/diagnose'
import { SlowSubConfig } from '@/types/diagnose'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useFormRules from '@/hooks/useFormRules'
import { QuestionFilled } from '@element-plus/icons-vue'

const { t } = useI18n()
const router = useRouter()

const { createRequiredRule, createIntFieldRule, createStringWithUnitFieldRule } = useFormRules()

const isLoading = ref(false)
const configForm: Ref<SlowSubConfig> = ref({} as SlowSubConfig)
const formCom = ref()
const fieldNameMap = {
  threshold: 'statsThreshold',
  top_k_num: 'maximumNumberOfStatistics',
  expire_interval: 'evictionTimeOfRecord',
  notice_interval: 'noticeInterval',
  notice_batch_size: 'noticeBatchSize',
}
const rulesOfConfigForm = {
  threshold: [
    ...createRequiredRule(t(`SlowSub.${fieldNameMap.threshold}`)),
    ...createStringWithUnitFieldRule(['ms'], 100, 10000),
  ],
  top_k_num: [
    ...createRequiredRule(t(`SlowSub.${fieldNameMap.top_k_num}`)),
    ...createIntFieldRule(0, 1000),
  ],
  expire_interval: [
    ...createRequiredRule(t(`SlowSub.${fieldNameMap.expire_interval}`)),
    ...createStringWithUnitFieldRule(['ms', 's']),
  ],
  notice_interval: [
    ...createRequiredRule(t(`SlowSub.${fieldNameMap.notice_interval}`)),
    ...createStringWithUnitFieldRule(['ms', 's'], 0, 3600),
  ],
  notice_batch_size: [
    ...createRequiredRule(t(`SlowSub.${fieldNameMap.notice_batch_size}`)),
    ...createIntFieldRule(),
  ],
}

const getConfig = async () => {
  try {
    isLoading.value = true
    configForm.value = await querySlowSubConfig()
    isLoading.value = false
  } catch (error) {
    console.error(error)
  }
}

const toggleStatus = async () => {
  try {
    await formCom.value.validate()
    await update(false)
  } catch (error) {
    configForm.value.enable = !configForm.value.enable
  }
}

const update = async (goBack = true) => {
  try {
    await formCom.value.validate()
    await updateSlowSubConfig(configForm.value)
    ElMessage.success(t('Base.updateSuccess'))
    if (goBack) {
      router.push({ name: 'slow-sub' })
    }
  } catch (error) {
    console.error(error)
  }
}

getConfig()
</script>

<style lang="scss" scoped>
.link-back {
  display: inline-block;
  margin-bottom: 36px;
  color: #5b5b5b;
}
.slow-sub-config-title {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 22px;
  font-weight: bold;
  color: #000;
  line-height: 30px;
}
.config-block {
  margin-bottom: 36px;
}
.config-block-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #000;
  line-height: 25px;
}
.btn-update {
  padding-left: 30px;
  padding-right: 30px;
}
.el-icon {
  vertical-align: top;
}
</style>
