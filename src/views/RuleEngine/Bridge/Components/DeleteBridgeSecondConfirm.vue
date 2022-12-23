<template>
  <el-dialog
    v-model="showDialog"
    :width="400"
    class="common-dialog delete-bridge-second-confirm"
    :title="t('Base.confirmDelete')"
    :z-index="2000"
  >
    <div>
      <div class="el-message-box__container">
        <i class="el-icon el-message-box__status el-message-box-icon--warning">
          <WarningFilled />
        </i>
        <div class="el-message-box__message">
          {{ tl('deleteBridgeSecondConfirm') }}
        </div>
      </div>
      <ul class="rule-list">
        <li v-for="item in ruleList" :key="item" class="rule-item">
          <el-tag size="large">
            <router-link
              :to="{ name: 'iot-detail', params: { id: item }, query: { tab: 'settings' } }"
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
        <el-button type="danger" plain @click="submit" :loading="isSubmitting">
          {{ $t('Base.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { deleteBridge } from '@/api/ruleengine'
import useI18nTl from '@/hooks/useI18nTl'
import { ElDialog } from 'element-plus'
import { computed, defineEmits, defineProps, PropType, ref } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
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

const isSubmitting = ref(false)
const submit = async () => {
  if (!props.id) {
    return
  }
  await deleteBridge(props.id, true)
  emit('submitted')
  showDialog.value = false
}
</script>

<style lang="scss">
.delete-bridge-second-confirm {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 0px;
  }
  .el-dialog__footer {
    padding-bottom: 12px;
  }
  ul {
    list-style: none;
    padding-left: 36px;
    margin-bottom: 0;
  }
  .rule-item {
    display: inline-block;
    padding: 4px 0;
  }
}
</style>
