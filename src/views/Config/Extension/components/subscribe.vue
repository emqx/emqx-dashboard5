<!-- Proxy Subscription -->
<template>
  <div class="no-tab-wrapper subscribe">
    <div class="section-header">
      <div></div>
      <el-button type="primary" @click="openOpDialog()" :icon="Plus">
        {{ $t('Base.add') }}
      </el-button>
    </div>

    <el-table :data="subTbData" class="shadow-none" v-loading="tbLoading">
      <el-table-column :label="$t('Base.topic')" prop="topic" />
      <el-table-column :label="'QoS'" prop="qos" />
      <el-table-column :label="$t('Clients.noLocal')" prop="nl">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.nl, noLocalOpts) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Clients.retainAsPublished')" prop="rap">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.rap, retainAsPublishedOpts) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Clients.retainHandling')" prop="rh" />
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="small" @click="openOpDialog(true, row)">{{ $t('Base.edit') }}</el-button>
          <el-button size="small" plain @click="deleteSubs(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="opSubs"
      :title="isEdit ? $t('Base.edit') : $t('Base.add')"
      @close="closeDialog"
    >
      <el-form
        :rules="subsRules"
        :model="subsInput"
        ref="subsForm"
        label-position="top"
        @keyup.enter="submitSubs(isEdit)"
      >
        <el-form-item :label="$t('Base.topic')" prop="topic">
          <el-input v-model="subsInput.topic" />
        </el-form-item>
        <el-form-item :label="'QoS'" prop="qos">
          <el-select v-model="subsInput.qos">
            <el-option v-for="item in QoSOptions" :key="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('Clients.noLocal')" prop="nl">
              <el-select v-model="subsInput.nl">
                <el-option
                  v-for="{ value, label } in noLocalOpts"
                  :label="label"
                  :value="value"
                  :key="value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Clients.retainAsPublished')" prop="rap">
              <el-select v-model="subsInput.rap">
                <el-option
                  v-for="{ value, label } in retainAsPublishedOpts"
                  :label="label"
                  :value="value"
                  :key="value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Clients.retainHandling')" prop="rh">
              <el-select v-model="subsInput.rh">
                <el-option
                  v-for="item in retainHandlingOpts"
                  :label="item"
                  :value="item"
                  :key="item"
                />
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
import { defineComponent, onMounted, ref, nextTick } from 'vue'
import { getSubscribe, editSubscribe } from '@/api/extension'
import { ElMessageBox as MB, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'
import { QoSLevel } from '@/types/enum.ts'
import { QoSOptions } from '@/common/constants'
import useI18nTl from '@/hooks/useI18nTl'
import { Plus } from '@element-plus/icons-vue'
import useMQTTVersion5NewConfig from '@/hooks/useMQTTVersion5NewConfig.ts'
import { getLabelFromValueInOptionList } from '@/common/tools.ts'

const createRawSubForm = () => ({
  topic: '',
  qos: QoSLevel.QoS0,
  nl: 0,
  rap: 0,
  rh: 0,
})

export default defineComponent({
  name: 'Subscribe',

  setup() {
    const { t } = useI18n()
    const { tl } = useI18nTl('Extension')
    let isEdit = ref(false)
    let opSubs = ref(false)
    let subTbData = ref([])
    const { noLocalOpts, retainAsPublishedOpts, retainHandlingOpts } = useMQTTVersion5NewConfig()
    let subsInput = ref(createRawSubForm())
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

    let openOpDialog = async (edit = false, origin) => {
      opSubs.value = true
      isEdit.value = !!edit
      if (edit) {
        subsInput.value = _.merge(subsInput.value, origin)
      }

      edit && (editPos.value = subTbData.value.findIndex((e) => e === origin))
      await nextTick()
      subsForm.value?.clearValidate()
    }

    const submitSubs = async function (edit = false) {
      let valid = await subsForm.value?.validate().catch(() => {})
      if (!valid) return
      submitLoading.value = true
      let pendingTbData = Object.assign([], subTbData.value)

      if (!edit) {
        pendingTbData.push(subsInput.value)
      } else {
        editPos.value !== undefined &&
          pendingTbData.splice(editPos.value, 1, { ...subsInput.value })
      }

      let res = await editSubscribe(pendingTbData).catch(() => {})
      if (res) {
        ElMessage({
          type: 'success',
          message: edit ? t('Base.updateSuccess') : t('Base.createSuccess'),
        })
        loadData()
        opSubs.value = false
        editPos.value = undefined
      }
      submitLoading.value = false
    }

    const deleteSubs = async function (origin) {
      try {
        await MB.confirm(t('Base.confirmDelete'), {
          confirmButtonText: t('Base.confirm'),
          cancelButtonText: t('Base.cancel'),
          confirmButtonClass: 'confirm-danger',
          type: 'warning',
        })
        let pendingTbData = Object.assign([], subTbData.value)
        const position = pendingTbData.findIndex((e) => e === origin)
        pendingTbData.splice(position, 1)
        await editSubscribe(pendingTbData)
        ElMessage.success(t('Base.deleteSuccess'))
        loadData()
      } catch (error) {
        //
      }
    }

    const closeDialog = () => {
      opSubs.value = false
      subsInput.value = createRawSubForm()
    }

    let loadData = async () => {
      try {
        tbLoading.value = true
        subTbData.value = await getSubscribe()
      } catch (error) {
        //
      } finally {
        tbLoading.value = false
      }
    }

    onMounted(loadData)

    const reloading = () => {
      loadData()
    }

    return {
      tl,
      isEdit,
      Plus,
      opSubs,
      openOpDialog,
      QoSOptions,
      noLocalOpts,
      retainAsPublishedOpts,
      retainHandlingOpts,
      getLabelFromValueInOptionList,
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
