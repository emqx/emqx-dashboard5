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
              :to="{ name: 'rule-detail', params: { id: item }, query: { tab: 'settings' } }"
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
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import useHandleSourceItem from '@/hooks/Rule/action/useHandleSourceItem'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection } from '@/types/enum'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElDialog } from 'element-plus'
import { computed, defineEmits, defineProps, PropType, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  direction: {
    type: Number,
    default: BridgeDirection.Egress,
  },
  id: {
    type: String,
  },
  ruleList: {
    type: Array as PropType<Array<string>>,
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

const isSubmitting = ref(false)
const submit = async () => {
  if (!props.id) {
    return
  }
  props.direction === BridgeDirection.Ingress
    ? await deleteSource(props.id, true)
    : await deleteAction(props.id, true)

  emit('submitted')
  showDialog.value = false
}
</script>

<style lang="scss">
@import '@/style/rule.scss';
</style>
