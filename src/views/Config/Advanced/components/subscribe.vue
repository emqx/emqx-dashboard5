<template>
  <div class="no-tab-wrapper subscribe">
    <div class="section-header">
      <div>{{ tl('internalPatterns') }}</div>
      <el-button type="primary" @click="openOpDialog()">{{ $t('Base.add') }}</el-button>
    </div>

    <el-table :data="subTbData" class="shadow-none" v-loading="tbLoading">
      <el-table-column :label="'Topic'" prop="topic" sortable></el-table-column>
      <el-table-column :label="'QoS'" prop="qos" sortable></el-table-column>
      <el-table-column :label="'nl/rap/rh'" sortable>
        <template #default="{ row }">
          {{ `${row.nl}/${row.rap}/${row.rh}` }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="small" @click="openOpDialog(true, row)">{{ $t('Base.edit') }}</el-button>
          <el-button size="small" type="danger" plain @click="deleteSubs(row)">{{
            $t('Base.delete')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="opSubs"
      :title="(isEdit ? $t('Base.edit') : $t('Base.add')) + ' ' + tl('subscribe')"
      @close="closeDialog"
    >
      <el-form
        :rules="subsRules"
        :model="subsInput"
        ref="subsForm"
        label-position="top"
        @keyup.enter="submitSubs(isEdit)"
      >
        <el-form-item :label="'Topic'" prop="topic">
          <el-input v-model="subsInput.topic"></el-input>
        </el-form-item>
        <el-form-item :label="'QoS'" prop="qos">
          <el-select v-model="subsInput.qos">
            <el-option v-for="item in subsOptions.qos" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="nl" prop="nl">
              <el-select v-model="subsInput.nl">
                <el-option v-for="item in subsOptions.nl" :key="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="rap" prop="rap">
              <el-select v-model="subsInput.rap">
                <el-option v-for="item in subsOptions.rap" :key="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="rh" prop="rh">
              <el-select v-model="subsInput.rh">
                <el-option v-for="item in subsOptions.rh" :key="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog()">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" @click="submitSubs(isEdit)" :loading="submitLoading">
          {{ isEdit ? $t('Base.update') : $t('Base.add') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { getSubscribe, editSubscribe } from '@/api/advanced'
import { ElMessageBox as MB, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'
import { QoSLevel } from '@/types/enum.ts'
import { QoSOptions } from '@/common/constants'
import useI18nTl from '@/hooks/useI18nTl'

export default defineComponent({
  name: 'Subscribe',

  setup() {
    const { t } = useI18n()
    const { tl } = useI18nTl('Advanced')
    let isEdit = ref(false)
    let opSubs = ref(false)
    let subTbData = ref([])
    let subsOptions = reactive({
      qos: QoSOptions,
      nl: [0, 1],
      rap: [0, 1],
      rh: [0, 1, 2],
    })
    let subsInput = reactive({
      topic: '',
      qos: QoSLevel.QoS0,
      nl: 0,
      rap: 0,
      rh: 0,
    })
    let editPos = ref(undefined)
    let submitLoading = ref(false)
    let tbLoading = ref(false)
    let subsForm = ref(null)
    let subsRules = {
      topic: [
        {
          required: true,
          message: tl('required'),
          trigger: ['blur'],
        },
      ],
    }

    let openOpDialog = (edit = false, origin) => {
      opSubs.value = true
      isEdit.value = !!edit

      subsInput = (edit && _.merge(subsInput, origin)) || subsInput

      edit && (editPos.value = subTbData.value.findIndex((e) => e === origin))
    }

    const submitSubs = async function (edit = false) {
      let valid = await subsForm.value?.validate().catch(() => {})
      if (!valid) return
      submitLoading.value = true
      let pendingTbData = Object.assign([], subTbData.value)

      if (!edit) {
        pendingTbData.push(subsInput)
      } else {
        editPos.value !== undefined && pendingTbData.splice(editPos.value, 1, { ...subsInput })
      }

      let res = await editSubscribe(pendingTbData).catch(() => {})
      if (res) {
        ElMessage({
          type: 'success',
          message: edit ? t('Base.editSuccess') : t('Base.createSuccess'),
        })
        loadData()
        opSubs.value = false
        editPos.value = undefined
      }
      submitLoading.value = false
    }

    const deleteSubs = async function (origin) {
      MB.confirm(t('Base.confirmDelete'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          let pendingTbData = Object.assign([], subTbData.value)
          const position = pendingTbData.findIndex((e) => e === origin)
          pendingTbData.splice(position, 1)
          let res = await editSubscribe(pendingTbData).catch(() => {})
          if (res) {
            ElMessage({
              type: 'success',
              message: t('Base.deleteSuccess'),
            })
            loadData()
          }
        })
        .catch(() => {})
    }

    const closeDialog = () => {
      opSubs.value = false
      subsForm.value?.resetFields()
    }

    let loadData = async () => {
      tbLoading.value = true
      let res = await getSubscribe().catch(() => {})
      if (res) {
        subTbData.value = res
      }
      tbLoading.value = false
    }

    onMounted(loadData)

    const reloading = () => {
      loadData()
    }

    return {
      tl,
      isEdit,
      opSubs,
      openOpDialog,
      subsOptions,
      subTbData,
      subsInput,
      submitSubs,
      deleteSubs,
      submitLoading,
      reloading,
      tbLoading,
      subsForm,
      subsRules,
      closeDialog,
    }
  },
})
</script>
<style lang="scss" scoped>
.el-form:not(:first-child) {
  margin-top: 50px;
}
</style>
