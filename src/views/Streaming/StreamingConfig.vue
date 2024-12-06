<template>
  <div class="app-wrapper">
    <DetailHeader
      :item="{ name: tl('streamingConfigurations'), routeName: 'streaming-overview' }"
    />
    <el-card class="app-card streaming-config" v-loading="isLoading">
      <div class="config-block">
        <h6 class="config-block-title">{{ tl('endpoints') }}</h6>
        <el-form
          ref="FormCom"
          :model="configForm"
          :rules="rules"
          label-position="top"
          require-asterisk-position="right"
        >
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item prop="hornbill_endpoints">
                <template #label>
                  <FormItemLabel
                    :label="tl('hornbillEndpoints')"
                    :desc="tl('hornbillEndpointsDesc')"
                    desc-marked
                  />
                </template>
                <el-input v-model="configForm.hornbill_endpoints" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="streaming_endpoints">
                <template #label>
                  <FormItemLabel
                    :label="tl('streamingEndpoints')"
                    :desc="tl('streamingEndpointsDesc')"
                    desc-marked
                  />
                </template>
                <el-input v-model="configForm.streaming_endpoints" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-button
          class="btn-update"
          :disabled="!$hasPermission('put')"
          type="primary"
          @click="update"
        >
          {{ t('Base.update') }}
        </el-button>
      </div>
      <div class="config-block">
        <h6 class="config-block-title">{{ t('Base.enable') }}</h6>
        <el-form>
          <el-form-item :label="tl('enableStreaming')">
            <el-switch
              v-model="configForm.enable"
              :disabled="!$hasPermission('put')"
              @change="toggleStatus"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getStreamingConfig, updateStreamingConfig } from '@/api/streaming'
import DetailHeader from '@/components/DetailHeader.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import useStreamingStatus from '@/hooks/useStreamingStatus'
import { StreamingConfig } from '@/types/typeAlias'
import { ElMessage } from 'element-plus'
import { ref, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { t, tl } = useI18nTl('Streaming')

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const configForm: Ref<StreamingConfig> = ref({} as StreamingConfig)
const FormCom = ref()

const { createRequiredRule } = useFormRules()
const rules = {
  hornbill_endpoints: [createRequiredRule(tl('hornbillEndpoints'))],
  streaming_endpoints: [createRequiredRule(tl('streamingEndpoints'))],
}

const enableAutomatically = async () => {
  if (!configForm.value.enable && route.query.enable) {
    configForm.value.enable = !!route.query.enable
    update(false)
  }
}

const getConfig = async () => {
  try {
    isLoading.value = true
    configForm.value = await getStreamingConfig()
    enableAutomatically()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const toggleStatus = async () => {
  try {
    await FormCom.value.validate()
    await update(false)
  } catch (error) {
    configForm.value.enable = !configForm.value.enable
  }
}

const { getStreamingIsEnabled } = useStreamingStatus()
const update = async (goBack = true) => {
  try {
    await FormCom.value.validate()
    await updateStreamingConfig(configForm.value)
    getStreamingIsEnabled()
    ElMessage.success(t('Base.updateSuccess'))
    if (goBack) {
      router.push({ name: 'streaming-overview' })
    }
  } catch (error) {
    console.error(error)
  }
}

getConfig()
</script>

<style lang="scss">
.streaming-config {
  .config-block {
    margin-bottom: 36px;
  }
  .config-block-title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    color: var(--color-title-primary);
    line-height: 25px;
  }
  .btn-update {
    padding-left: 30px;
    padding-right: 30px;
  }
  .el-icon {
    vertical-align: top;
  }
}
</style>
