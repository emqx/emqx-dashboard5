<template>
  <div class="iot-create app-wrapper">
    <detail-header :item="{ name: $t('RuleEngine.createRule'), path: '/rules' }" />
    <el-card class="iot-form-card">
      <iotform
        ref="formCom"
        v-model="ruleValue"
        :submit-loading="submitLoading"
        @save="submitCreateIoT"
      />
    </el-card>
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

// const mode = 'sql'

const createRuleID = () => `rule_${createRandomString(4)}`

const ruleValue: Ref<RuleItem> = ref({
  id: createRuleID(),
  sql: transSQLFormDataToSQL(DEFAULT_SELECT, [DEFAULT_FROM]),
  actions: [],
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
        id: createRuleID(),
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

<style lang="scss">
.iot-create {
  .iot-form-card {
    > .el-card__body {
      padding: 0px;
    }
  }
}
</style>
