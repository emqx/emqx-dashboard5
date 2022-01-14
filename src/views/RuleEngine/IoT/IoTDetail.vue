<template>
  <div class="iot-detail app-wrapper">
    <router-link class="back-button" :to="{ name: 'iot' }">{{ tl('backToIoTList') }}</router-link>
    <div class="detail-main" v-loading="infoLoading">
      <div class="section-header">
        <div>
          <span class="title-n-status">
            <span class="section-title">{{ id }}</span>
            <el-tag type="info" class="section-status">
              <span
                ><i :class="['status', !rInfo.enable && 'stopped']"></i
                ><span>{{ rInfo.enable ? $t('Base.enable') : $t('Base.disable') }}</span></span
              >
            </el-tag>
          </span>
        </div>
        <div>
          <el-button type="danger" size="small">{{ $t('Base.delete') }}</el-button>
          <el-button size="small" @click="enableOrDisableRule()">
            {{ rInfo.enable ? $t('Base.disable') : $t('Base.enable') }}</el-button
          >
        </div>
      </div>

      <iotform v-model="rInfo" :key="iKey"></iotform>
    </div>

    <el-row class="config-btn">
      <el-button size="small" type="primary" :loading="infoLoading" @click="submitUpdateRules()">{{
        $t('Base.update')
      }}</el-button>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from 'vue'
import iotform from '../components/IoTForm.vue'
import { getRuleInfo, updateRules } from '@/api/ruleengine'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage as M } from 'element-plus'
import { RuleItem } from '@/types/ruleengine'

export default defineComponent({
  components: { iotform },
  setup() {
    const rInfo: Ref<RuleItem> = ref({})
    const route = useRoute()
    const { t } = useI18n()
    const id = route.params.id as string
    const iKey = ref(0)
    const infoLoading = ref(false)

    // watch(
    //   () => rInfo.value,
    //   (val) => {
    //     console.log(val);
    //   }
    // );

    const loadRuleDetail = async () => {
      infoLoading.value = true
      const res = await getRuleInfo(id).catch(() => {})
      if (res) {
        rInfo.value = res
        ++iKey.value
      }
      infoLoading.value = false
    }

    const enableOrDisableRule = async () => {
      infoLoading.value = true

      const res = await updateRules(id, { enable: !rInfo.value.enable }).catch(() => {})
      if (res) {
        M({
          type: 'success',
          message: rInfo.value.enable ? t('Base.disabledSuccess') : t('Base.enableSuccess'),
        })
        rInfo.value.enable = !rInfo.value.enable
      }
      infoLoading.value = false
    }

    const submitUpdateRules = async () => {
      infoLoading.value = true
      const updateData: RuleItem = {
        name: rInfo.value.name,
        sql: rInfo.value.sql,
        enable: rInfo.value.enable,
        description: rInfo.value.description,
        outputs: rInfo.value.outputs,
      }
      const res = await updateRules(id, updateData).catch(() => {})
      if (res) {
        M({
          type: 'success',
          message: t('Base.updateSuccess'),
        })
        loadRuleDetail()
      }
      infoLoading.value = false
    }

    onMounted(() => {
      loadRuleDetail()
    })
    return {
      tl: (key: string) => t('RuleEngine.' + key),
      id,
      rInfo,
      iKey,
      infoLoading,
      submitUpdateRules,
      enableOrDisableRule,
    }
  },
})
</script>

<style lang="scss" scoped>
.config-btn {
  margin-top: 50px;
}
</style>
