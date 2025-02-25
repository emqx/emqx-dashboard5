<template>
  <div class="app-wrapper rewrite">
    <div class="section-header">
      <div></div>
      <CreateButton @click="openOpDialog()">
        {{ $t('Base.add') }}
      </CreateButton>
    </div>
    <el-table :data="rewriteTbData" v-loading="tbDataLoading">
      <el-table-column :label="tl('action')" prop="action" :min-width="108">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.action, actionOpts) }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('sTopic')" prop="source_topic" :min-width="146" />
      <el-table-column :label="tl('re')" prop="re" :min-width="120" />
      <el-table-column :label="tl('dTopic')" prop="dest_topic" :min-width="128" />
      <el-table-column :label="$t('Base.operation')" :min-width="146">
        <template #default="{ $index }">
          <TableButton :disabled="!$hasPermission('put')" @click="openOpDialog($index)">
            {{ $t('Base.edit') }}
          </TableButton>
          <TableButton :disabled="!$hasPermission('delete')" @click="deleteRewrite($index)">
            {{ $t('Base.delete') }}
          </TableButton>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog
    v-model="opRewrite"
    :title="(isEdit ? $t('Base.edit') : $t('Base.add')) + ' ' + tl('rewrite')"
    @close="initForm"
  >
    <TipContainer :content="tl('rewriteTip')" />
    <el-form
      ref="rewriteForm"
      :model="rewriteInput"
      :rules="rewriteRules"
      label-position="top"
      require-asterisk-position="right"
      @keyup.enter="submitRewrite(isEdit)"
    >
      <el-form-item :label="tl('action')" prop="action">
        <el-select v-model="rewriteInput.action">
          <el-option
            v-for="{ value, label } in actionOpts"
            :key="value"
            :value="value"
            :label="label"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="tl('sTopic')" prop="source_topic">
        <el-input v-model="rewriteInput.source_topic" />
      </el-form-item>
      <el-form-item :label="tl('re')" prop="re">
        <el-input v-model="rewriteInput.re" />
      </el-form-item>
      <el-form-item :label="tl('dTopic')" prop="dest_topic">
        <el-input v-model="rewriteInput.dest_topic" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="opRewrite = false">{{ $t('Base.cancel') }}</el-button>
      <el-button
        type="primary"
        :disabled="!$hasPermission('post')"
        @click="submitRewrite(isEdit)"
        :loading="submitLoading"
      >
        {{ isEdit ? $t('Base.update') : $t('Base.add') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { editTopicRewrite, getTopicRewrite } from '@/api/extension'

import TipContainer from '@/components/TipContainer.vue'

import { Rewrite } from '@/types/extension'
import { ElMessage, ElMessageBox as MB } from 'element-plus'

import { useI18n } from 'vue-i18n'
import { usePerms } from '@/plugins/permissionsPlugin'

const { hasPermission } = usePerms()

const { t } = useI18n()
const { tl } = useI18nTl('Extension')

const createRawRewriteForm = () => ({
  action: '',
  source_topic: '',
  re: '',
  dest_topic: '',
})

const opRewrite = ref(false)
const rewriteTbData: Ref<Array<Rewrite>> = ref([])
const isEdit = ref(false)
const actionOpts = [
  { value: 'publish', label: 'Publish' },
  { value: 'subscribe', label: 'Subscribe' },
  { value: 'all', label: 'Publish & Subscribe' },
]
const rewriteInput: Ref<Rewrite> = ref(createRawRewriteForm())
const editPos: Ref<undefined | number> = ref(undefined)
const submitLoading = ref(false)
const tbDataLoading = ref(true)
const rewriteForm = ref()

const validatorRules = [
  {
    required: true,
    message: tl('required'),
    trigger: ['blur', 'change'],
  },
]
const rewriteRules = {
  action: validatorRules,
  source_topic: validatorRules,
  dest_topic: validatorRules,
}

const openOpDialog = async (editIndex?: number) => {
  opRewrite.value = true
  isEdit.value = editIndex !== undefined
  const target = isEdit.value ? rewriteTbData.value[editIndex as number] : undefined
  rewriteInput.value = isEdit.value && target ? { ...target } : createRawRewriteForm()
  editPos.value = editIndex
  await nextTick(rewriteForm.value?.clearValidate)
}

const initForm = () => (rewriteInput.value = createRawRewriteForm())

const submitRewrite = async function (edit = false) {
  if (edit && !hasPermission('put')) {
    return
  }
  if (!edit && !hasPermission('post')) {
    return
  }
  await rewriteForm.value?.validate()
  try {
    const pendingTbData = [...rewriteTbData.value]
    if (!edit) {
      pendingTbData.push({ ...rewriteInput.value })
    } else {
      if (editPos.value === undefined) {
        return
      }
      pendingTbData.splice(editPos.value, 1, { ...rewriteInput.value })
    }
    submitLoading.value = true
    await editTopicRewrite(pendingTbData)
    ElMessage.success(edit ? t('Base.updateSuccess') : t('Base.createSuccess'))
    loadData()
  } catch (error) {
    ElMessage.error(t('Base.opErr'))
  } finally {
    submitLoading.value = false
    opRewrite.value = false
    editPos.value = undefined
  }
}

const deleteRewrite = async function (index: number) {
  await MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    confirmButtonClass: 'confirm-danger',
    type: 'warning',
  })
  try {
    const pendingTbData = [...rewriteTbData.value]
    pendingTbData.splice(index, 1)
    ElMessage.success(t('Base.deleteSuccess'))
    await editTopicRewrite(pendingTbData)
    rewriteTbData.value = pendingTbData
  } catch (error) {
    ElMessage.error(t('Base.opErr'))
  }
}

const loadData = async () => {
  tbDataLoading.value = true
  try {
    rewriteTbData.value = await getTopicRewrite()
  } catch (error) {
    rewriteTbData.value = []
  } finally {
    tbDataLoading.value = false
  }
}
onMounted(loadData)
</script>
