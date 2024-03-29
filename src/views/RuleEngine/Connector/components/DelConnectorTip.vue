<template>
  <el-dialog
    v-model="showDialog"
    :width="400"
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
          {{ deleteTip }}
        </div>
      </div>
      <ul class="data-list">
        <li v-for="item in actionList" :key="item" class="data-item">
          <el-tag size="large">
            <router-link
              :to="{
                name: 'action-detail',
                params: { id: getBridgeKey({ name: item, type: connectorType }) },
                query: { tab: 'settings' },
              }"
              target="_blank"
            >
              {{ item }}
            </router-link>
          </el-tag>
        </li>
      </ul>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">
          {{ $t('Base.cancel') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getBridgeKey } from '@/common/tools'
import { useConnectorDirection } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElDialog } from 'element-plus'
import { lowerCase } from 'lodash'
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps<{
  modelValue: boolean
  connectorType: string
  actionList: Array<string>
}>()
const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('RuleEngine')

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { judgeConnectorTypeDirection } = useConnectorDirection()

const deleteTip = computed(() => {
  const direction = judgeConnectorTypeDirection(props.connectorType as BridgeType)
  switch (direction) {
    case BridgeDirection.Ingress:
      return tl('deleteSourceConnectorTip')
    case BridgeDirection.Both:
      return tl('deleteActionConnectorTip', {
        ext: lowerCase(`${tl('or')} ${t('components.source')}`),
      })
    default:
      return tl('deleteActionConnectorTip')
  }
})
</script>

<style lang="scss">
@import '~@/style/rule.scss';
</style>
