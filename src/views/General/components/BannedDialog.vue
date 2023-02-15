<template>
  <el-dialog
    :title="tl('createBlacklist')"
    v-model="showDialog"
    class="banned-dialog"
    destroy-on-close
  >
    <el-form
      ref="FormCom"
      :model="record"
      :rules="rules"
      label-position="top"
      @keyup.enter="save()"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="tl('banObject')" prop="who">
            <el-input v-model="record.who">
              <template #prepend>
                <el-select v-model="record.as">
                  <el-option
                    v-for="item in asOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('until')" prop="until">
            <el-date-picker
              v-model="record.until"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              popper-class="datepicker-until"
              :shortcuts="datePickerShortcuts"
              :disabledDate="isItEarlierThanToday"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="reason" :label="tl('reason')">
            <el-input
              v-model="record.reason"
              type="textarea"
              :rows="3"
              :placeholder="tl('reason')"
              resize="none"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="showDialog = false">{{ t('Base.cancel') }}</el-button>
        <el-button type="primary" @click="save" :loading="submitLoading">
          {{ t('Base.create') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { createBlacklist } from '@/api/function'
import useBannedType from '@/hooks/Auth/useBannedType'
import useDatePickerShortcuts from '@/hooks/useDatePickerShortcuts'
import useI18nTl from '@/hooks/useI18nTl'
import { BannedType } from '@/types/enum'
import { ElMessage } from 'element-plus'
import { Banned } from 'src/types/auth'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue', 'submitted'])

const { t, tl } = useI18nTl('General')

const generateRawRecord = (): Banned => ({
  as: BannedType.Client,
  who: '',
  reason: '',
  until: '',
})

const submitLoading = ref(false)
const { typeList: asOptions } = useBannedType()
const record = ref(generateRawRecord())
const rules = {
  who: [{ required: true, message: tl('enterWho'), trigger: 'change' }],
  until: [
    {
      validator: (rule: any, value: string) => {
        if (!value) {
          return []
        }
        if (new Date(value).getTime() < Date.now()) {
          return [new Error(tl('timeEarlierError'))]
        }
        return []
      },
      trigger: 'blur',
    },
  ],
}
const FormCom = ref()

const { datePickerShortcuts } = useDatePickerShortcuts()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, async (value: boolean) => {
  if (!value) {
    record.value = generateRawRecord()
  }
})

const isItEarlierThanToday = (date: Date) => {
  const todayStartTime = new Date().setHours(0, 0, 0, 0)
  return date.getTime() < todayStartTime
}

const save = async () => {
  try {
    await FormCom.value.validate()
    const data = {
      ...record.value,
      until: (record.value.until && new Date(record.value.until).toISOString()) || null,
    }
    submitLoading.value = true
    try {
      await createBlacklist(data)
      ElMessage.success(tl('createBlacklistSuccess'))
      showDialog.value = false
      emit('submitted')
    } catch (error) {
      //
    } finally {
      submitLoading.value = false
    }
  } catch (error) {
    //
  }
}
</script>

<style lang="scss">
.banned-dialog {
  .el-input-group--append :deep(.el-input-group__append) {
    width: 110px;
  }
}
.datepicker-until {
  // hide [now] button
  .el-picker-panel__footer button.el-button.is-text {
    display: none;
  }
}
</style>
