<template>
  <div class="app-wrapper">
    <detail-header :item="{ name: $t('RuleEngine.createIoTRule'), path: '/iot' }" />
    <div class="iot-create">
      <iotform ref="formCom" v-model="ruleValue" />
      <el-row class="config-btn">
        <el-button @click="$router.push({ name: 'iot' })">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitCreateIoT">
          {{ $t('Base.create') }}
        </el-button>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IoTCreate',
})
</script>

<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import iotform from '../components/IoTForm.vue'
import DetailHeader from '@/components/DetailHeader.vue'
import { RuleItem } from '@/types/ruleengine'
import { createRules } from '@/api/ruleengine'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createRandomString, parseJSONSafely } from '@/common/tools'
import { DEFAULT_SELECT, DEFAULT_FROM } from '@/common/constants'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { LOCAL_STORAGE_KEY_MAP } from '@/common/constants'

const { t } = useI18n()
const { transSQLFormDataToSQL } = useRuleUtils()

const route = useRoute()
const router = useRouter()
const submitLoading = ref(false)

const createRuleName = () => `rule:${createRandomString(4)}`

const ruleValue: Ref<RuleItem> = ref({
  name: createRuleName(),
  sql: transSQLFormDataToSQL(DEFAULT_SELECT, [DEFAULT_FROM]),
  outputs: [],
  description: '',
})

const formCom = ref()

const checkRuleClipStatus = () => {
  if (route.query.action === 'copy') {
    const ruleStr = localStorage.getItem(LOCAL_STORAGE_KEY_MAP.RULE_FOR_COPY)
    const rule = ruleStr ? parseJSONSafely(ruleStr) : void 0
    if (rule) {
      ruleValue.value = {
        ...(rule as RuleItem),
        name: createRuleName(),
      }
    }
  }
}

const submitCreateIoT = async () => {
  await formCom.value.validate()

  submitLoading.value = true

  try {
    await createRules({ ...ruleValue.value })
    ElMessage.success(t('Base.createSuccess'))
    router.push({ name: 'iot' })
  } catch (error) {
    //
  } finally {
    submitLoading.value = false
  }
}

checkRuleClipStatus()
</script>

<style lang="scss" scoped>
.config-btn {
  margin-top: 50px;
}
</style>
