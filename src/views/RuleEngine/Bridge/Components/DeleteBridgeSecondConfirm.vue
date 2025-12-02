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
          {{
            isEgress
              ? tl('deleteEgressActionSecondConfirm')
              : tl('deleteIngressActionSecondConfirm')
          }}
        </div>
      </div>
      <ul class="data-list">
        <li v-for="item in ruleList" :key="item" class="data-item">
          <el-tag size="large">
            <router-link
              :to="{
                name: 'rule-detail',
                params: { id: item },
                query: { tab: 'settings', ...getNsParams(data?.namespace) },
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
        <CancelButton @click="showDialog = false" />
        <el-button
          type="danger"
          :disabled="!$hasPermission('delete')"
          plain
          @click="submit"
          :loading="isSubmitting"
          v-if="isEgress"
        >
          {{ $t('Base.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { BridgeDirection } from '@/types/enum'
import { Action, BridgeItem, Source } from '@/types/rule'
import { WarningFilled } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  direction: {
    type: Number,
    default: BridgeDirection.Egress,
  },
  data: {
    type: Object as PropType<BridgeItem | Action | Source>,
  },
  ruleList: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue', 'submitted'])

const { t, tl } = useI18nTl('RuleEngine')

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const isEgress = computed(() => props.direction === BridgeDirection.Egress)

const { deleteAction } = useHandleActionItem()
const { deleteSource } = useHandleSourceItem()
const { getNsParams } = useNsParams()

const isSubmitting = ref(false)
const submit = async () => {
  if (!props.data) {
    return
  }
  props.direction === BridgeDirection.Ingress
    ? await deleteSource(props.data, true)
    : await deleteAction(props.data, true)

  emit('submitted')
  showDialog.value = false
}
</script>

<style lang="scss">
@use '@/style/rule.scss';
</style>
