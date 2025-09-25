<template>
  <el-dialog
    v-model="showDialog"
    :width="520"
    class="common-dialog delete-second-confirm"
    :title="t('Base.confirmDelete')"
    :z-index="2000"
  >
    <div>
      <div class="el-message-box__container">
        <i class="el-icon el-message-box__status el-message-box-icon--warning">
          <WarningFilled />
        </i>
        <div class="el-message-box__message">
          <i18n-t keypath="RuleEngine.deleteFallbackActionConfirm" tag="span">
            <template #fallback>
              <b>{{ toLower(tl('fallbackActions')) }}</b>
            </template>
          </i18n-t>
        </div>
      </div>
      <ul class="data-list">
        <li v-for="item in actionList" :key="getBridgeKey(item)" class="data-item">
          <el-tag size="large">
            <router-link :to="getRoute(item)" target="_blank">
              <span>{{ item.name }}</span>
              <span class="action-type">({{ getGeneralTypeLabel(item.type) }})</span>
            </router-link>
          </el-tag>
        </li>
      </ul>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <CancelButton @click="showDialog = false" />
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { WarningFilled } from '@element-plus/icons-vue'
import { toLower } from 'lodash'

const props = defineProps<{
  modelValue: boolean
  actionList: Array<{ type: string; name: string }>
}>()
const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('RuleEngine')

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { getGeneralTypeLabel } = useBridgeTypeValue()

const getRoute = (item: { type: string; name: string }) => {
  return {
    name: `action-detail`,
    params: { id: getBridgeKey(item) },
    query: { tab: 'settings' },
  }
}
</script>

<style lang="scss">
@use '@/style/rule.scss';
.delete-second-confirm {
  .action-type {
    margin-left: 2px;
    color: var(--color-text-secondary);
  }
}
</style>
