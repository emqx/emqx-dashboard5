<template>
  <el-dialog
    :title="tl('upgradePackageUpload')"
    v-model="showDialog"
    class="package-dialog"
    destroy-on-close
  >
    <GuideBar />
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="showDialog = false">{{ t('Base.cancel') }}</el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          @click="submit"
          :loading="isSubmitting"
        >
          {{ tl('upload') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import GuideBar from '@/components/GuideBar.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { ElDialog } from 'element-plus'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const isSubmitting = ref(false)

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('General')

const stepList = []

watch(showDialog, (val) => {
  if (val) {
    //  TODO:
  }
})

const submit = async () => {
  try {
    isSubmitting.value = true
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>
