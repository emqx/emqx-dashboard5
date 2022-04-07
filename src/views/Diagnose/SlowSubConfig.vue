<template>
  <div class="app-wrapper">
    <router-link class="link-back" :to="{ name: 'slow-sub' }">
      &lt; {{ $t('SlowSub.backToStatisticsList') }}
    </router-link>
    <h5 class="slow-sub-config-title">
      {{ $t('SlowSub.slowSubscriptionSettings') }}
    </h5>
    <el-card class="app-card slow-sub-config" v-loading="isLoading">
      <div class="config-block">
        <h6 class="config-block-title">{{ $t('SlowSub.basicSettings') }}</h6>
        <el-form ref="formCom" :model="configForm" :rules="rulesOfConfigForm" label-position="top">
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item required prop="threshold">
                <template #label>
                  {{ $t('SlowSub.statsThreshold') }}
                  <InfoTooltip :content="$t('SlowSub.statsThresholdDesc')" />
                </template>
                <el-input v-model="configForm.threshold" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item required prop="top_k_num">
                <template #label>
                  {{ $t('SlowSub.maximumNumberOfStatistics') }}
                  <InfoTooltip :content="$t('SlowSub.maximumNumberOfStatisticsDesc')" />
                </template>
                <el-input v-model.number="configForm.top_k_num" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item required prop="expire_interval">
                <template #label>
                  {{ $t('SlowSub.evictionTimeOfRecord') }}
                  <InfoTooltip :content="$t('SlowSub.evictionTimeOfRecordDesc')" />
                </template>
                <el-input v-model="configForm.expire_interval" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item required prop="stats_type">
                <template #label>
                  {{ $t('SlowSub.statsType') }}
                  <InfoTooltip>
                    <template #content>
                      <div class="type-desc" v-for="{ value, desc } in slowTypeOpts" :key="value">
                        {{ value }} : {{ desc }}
                      </div>
                    </template>
                  </InfoTooltip>
                </template>
                <el-select v-model="configForm.stats_type">
                  <el-option
                    v-for="{ value } in slowTypeOpts"
                    :key="value"
                    :label="value"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-button class="btn-update" type="primary" @click="update">
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
import { querySlowSubConfig, updateSlowSubConfig } from '@/api/diagnose'
import { SlowSubConfig } from '@/types/diagnose'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useFormRules from '@/hooks/useFormRules'
import { SlowSubType } from '@/types/enum'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useI18nTl from '@/hooks/useI18nTl'

const { t } = useI18n()
const { tl } = useI18nTl('SlowSub')
const router = useRouter()

const { createRequiredRule, createIntFieldRule, createStringWithUnitFieldRule } = useFormRules()

const isLoading = ref(false)
const configForm: Ref<SlowSubConfig> = ref({} as SlowSubConfig)
const formCom = ref()
const fieldNameMap = {
  threshold: 'statsThreshold',
  top_k_num: 'maximumNumberOfStatistics',
  expire_interval: 'evictionTimeOfRecord',
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
}

const slowTypeOpts = [
  { value: SlowSubType.Whole, desc: tl('wholeTypeDesc') },
  { value: SlowSubType.Internal, desc: tl('typeInternalDesc') },
  { value: SlowSubType.Response, desc: tl('typeResponseDesc') },
]

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
.type-desc {
  line-height: 1.5;
}
.btn-update {
  padding-left: 30px;
  padding-right: 30px;
}
.el-icon {
  vertical-align: top;
}
</style>
