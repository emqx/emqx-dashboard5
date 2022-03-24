<template>
  <div class="app-wrapper">
    <router-link class="back-button" :to="{ name: 'iot' }">
      {{ $t('RuleEngine.backToIoTList') }}
    </router-link>
    <div class="iot-create">
      <div class="page-header-title">{{ tl('createIoTRule') }}</div>
      <iotform ref="formCom" v-model="ruleValue" />
      <el-row class="config-btn">
        <el-button type="primary" :loading="submitLoading" @click="submitCreateIoT">
          {{ $t('Base.create') }}
        </el-button>

        <el-button @click="$router.push({ name: 'iot' })">
          {{ $t('Base.cancel') }}
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
import { RuleItem } from '@/types/ruleengine'
import { createRules } from '@/api/ruleengine'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createRandomString, parseJSONSafely } from '@/common/tools'
import { DEFAULT_SELECT, DEFAULT_FROM } from '@/common/constants'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { LOCAL_STORAGE_KEY_MAP } from '@/common/constants'

const { t } = useI18n()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)
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
.outputs-item {
  height: 92px;
  border: var(--el-border-base);
  margin-top: 10px;
  display: flex;
  align-items: center;

  span:nth-child(2) {
    flex-grow: 1;

    div {
      line-height: 200%;
    }

    .output-desc {
      color: #5b5b5b;
    }
  }

  .output-op {
    padding: 0 10px;
    visibility: hidden;
  }

  &.add {
    justify-content: center;
    // align-items: center;
  }
  &:first-of-type {
    margin-top: 20px;
  }
  &:hover {
    border-color: var(--el-color-primary);
    cursor: pointer;
    span {
      color: var(--el-color-primary);
      visibility: visible;
    }
  }
}

.edit-output {
  color: var(--el-color-primary);
  line-height: 50px;
  cursor: pointer;
}
.config-btn {
  margin-top: 50px;
}

.embedded-config {
  border: var(--el-border-base);
  padding: 30px;
}
</style>
