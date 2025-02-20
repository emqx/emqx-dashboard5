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
        <li v-for="item in actions" :key="item" class="data-item">
          <el-tag size="large">
            <router-link :to="getRoute(item, 'action')" target="_blank">
              {{ item }}
            </router-link>
          </el-tag>
        </li>
        <li v-for="item in sources" :key="item" class="data-item">
          <el-tag size="large">
            <router-link :to="getRoute(item, 'source')" target="_blank">
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
import useI18nTl from '@/hooks/useI18nTl'
import { Connector } from '@/types/rule'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElDialog } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  connector?: Connector
}>()
const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('RuleEngine')

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const actions = computed(() => props.connector?.actions || [])
const sources = computed(() => props.connector?.sources || [])

const deleteTip = computed(() => {
  let target: undefined | string = undefined
  if (actions.value.length && sources.value.length) {
    target = tl('actionsAndSources')
  } else if (actions.value.length) {
    target = tl('actions')
  } else if (sources.value.length) {
    target = 'Sources'
  }
  return t('RuleEngine.deleteConnectorTip', { target })
})

const getRoute = (name: string, target: 'action' | 'source') => {
  return {
    name: `${target}-detail`,
    params: { id: `${props.connector?.type}:${name}` },
    query: { tab: 'settings' },
  }
}
</script>

<style lang="scss">
@use '@/style/rule.scss';
</style>
