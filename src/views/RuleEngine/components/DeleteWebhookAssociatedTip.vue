<template>
  <el-dialog class="del-webhook-dialog" v-model="showDialog" :width="400">
    <i18n-t keypath="RuleEngine.deleteWebhookAssociatedTip" tag="p">
      <template #target>
        <span>{{ targetLabel }}</span>
      </template>
      <template #operation>
        <span>{{ lowerCase(tl('delete')) }}</span>
      </template>
      <template #page>
        <router-link :to="pageRoute">Webhook {{ t('RuleEngine.page') }}</router-link>
      </template>
    </i18n-t>
    <template #footer>
      <el-button @click="showDialog = false">
        {{ tl('cancel') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import useI18nTl from '@/hooks/useI18nTl'
import { DetailTab } from '@/types/enum'
import { ElDialog } from 'element-plus'
import { lowerCase } from 'lodash'
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps<{
  modelValue: boolean
  name: string
  type: 'connector' | 'action' | 'rule'
}>()
const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('Base')

const targetLabelMap = {
  connector: t('components.connector'),
  action: t('RuleEngine.action'),
  rule: t('RuleEngine.rule'),
}
const targetLabel = computed(() => (!props.type ? '' : lowerCase(targetLabelMap[props.type])))

const pageRoute = computed(() => ({
  name: 'webhook-detail',
  params: { name: props.name },
  query: { tab: DetailTab.Setting },
}))

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})
</script>

<style lang="scss">
.del-webhook-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding-top: 16px;
    padding-bottom: 4px;
    line-height: 1.5;
  }
  .el-dialog__footer {
    padding-bottom: 16px;
  }
}
</style>
