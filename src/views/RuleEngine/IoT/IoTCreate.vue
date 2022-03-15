<template>
  <div class="app-wrapper">
    <router-link class="back-button" :to="{ name: 'iot' }">
      {{ $t('RuleEngine.backToIoTList') }}
    </router-link>
    <div class="iot-create">
      <div class="page-header-title">{{ tl('createIoTRule') }}</div>
      <iotform v-model="ruleValue" />
      <el-row class="config-btn">
        <el-button size="small" type="primary" :loading="submitLoading" @click="submitCreateIoT">
          {{ $t('Base.create') }}
        </el-button>

        <el-button size="small" @click="$router.push({ name: 'iot' })">
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createRandomString } from '@/common/tools'
import { DEFAULT_SELECT, DEFAULT_FROM } from '@/common/constants'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'

const { t } = useI18n()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)
const { transSQLFormDataToSQL } = useRuleUtils()

const router = useRouter()
const submitLoading = ref(false)

const ruleValue: Ref<RuleItem> = ref({
  name: `rule:${createRandomString(4)}`,
  sql: transSQLFormDataToSQL(DEFAULT_SELECT, [DEFAULT_FROM]),
  outputs: [],
  description: '',
})

const submitCreateIoT = async () => {
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
