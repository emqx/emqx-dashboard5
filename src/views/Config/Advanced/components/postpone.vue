<template>
  <div>
    <el-tabs>
      <el-tab-pane :label="tl('setting')" v-loading="configPending">
        <el-form
          ref="delayedForm"
          :rules="delayedRules"
          :model="delayedConfig"
          :disabled="!configEnable"
          label-position="top"
          @keyup.enter="updateDelayedConfig()"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item :label="tl('maxDelayedMsg')" prop="max_delayed_messages">
                <el-input
                  v-model.number="delayedConfig.max_delayed_messages"
                  :readonly="delayedOption == 'unlimited'"
                  maxlength="6"
                >
                  <template #append>
                    <el-select v-model="delayedOption">
                      <el-option value="unlimited" :label="tl('unlimited')"></el-option>
                      <el-option value="custom" :label="tl('custom')"></el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-button size="small" type="primary" @click="updateDelayedConfig()">{{
            $t('Base.update')
          }}</el-button>
        </el-row>
        <div class="part-header">{{ tl('enable') }}</div>

        <el-row>
          <el-col :span="13">{{ tl('enableDescDelay') }}</el-col>
          <el-col :span="6">
            <el-switch v-model="delayedConfig.enable" @change="toggleStatus()"></el-switch>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :label="tl('dataManage')" v-loading="tbLoading">
        <el-table :data="delayedTbData">
          <el-table-column :label="'Topic'" prop="topic" sortable></el-table-column>
          <el-table-column :label="'QoS'" prop="qos" sortable></el-table-column>
          <el-table-column :label="'Payload'">
            <template #default="{ row }">
              <el-button size="mini" @click="checkPayload(row)">{{ tl('openPayload') }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="From Client ID" prop="from_clientid" sortable></el-table-column>
          <el-table-column
            :label="tl('delayedTime')"
            prop="delayed_interval"
            sortable
          ></el-table-column>
          <el-table-column
            :label="tl('remainTime')"
            prop="delayed_remaining"
            sortable
          ></el-table-column>
          <el-table-column :label="tl('publishTime')" sortable>
            <template #default="{ row }">
              {{ row.publish_at && dateFormat(row.publish_at) }}
            </template>
          </el-table-column>

          <el-table-column :label="$t('Base.operation')">
            <template #default="{ row }">
              <el-button size="mini" type="danger" @click="deleteDelayedInfo(row)">{{
                $t('Base.delete')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="emq-table-footer">
          <common-pagination
            @loadPage="loadDelayedList"
            v-model:metaData="pageMeta"
          ></common-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog custom-class="payload-dialog" v-model="payloadDialog" :title="'Payload'">
      <el-row v-loading="payloadLoading">
        <el-input
          type="textarea"
          :rows="10"
          resize="none"
          placeholder="Payload"
          v-model="payloadForShow"
          readonly
        ></el-input>
      </el-row>
      <template #footer>
        <div class="payload-dialog-ft" v-if="!(payloadDetail === null)">
          <el-select v-model="payloadShowBy" size="small" @change="initCopyBtn">
            <el-option
              v-for="item in payloadShowByOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <div>
            <span v-if="isCopyShow" class="payload-copied">{{ $t('Base.copied') }}</span>

            <el-button size="small" ref="copyBtnCom">{{ $t('Base.copy') }}</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
  getDelayedConfig,
  editDelayedConfig,
  getDelayedList,
  getDelayedInfo,
  delDelayedInfo,
} from '@/api/advanced'
import CommonPagination from '@/components/commonPagination.vue'
import useShowTextByDifferent from '@/hooks/Auth/useShowTextByDifferent'
import { dateFormat } from '@/common/utils'
import { ElMessageBox as MB, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { createClipboardEleWithTargetText } from '@/common/tools'

export default defineComponent({
  name: 'Postpone',
  components: {
    CommonPagination,
  },
  setup() {
    const { t } = useI18n()
    const tl = function (key, collection = 'Advanced') {
      return t(collection + '.' + key)
    }

    let delayedConfig = reactive({
      enable: false,
      max_delayed_messages: 0,
    })
    let delayedTbData = ref([])
    let configPending = ref(true)
    let tbLoading = ref(false)
    let configEnable = ref(false)
    let delayedOption = ref('custom')
    let delayedForm = ref(null)
    let delayedRules = {
      max_delayed_messages: [
        {
          required: true,
          message: tl('required'),
          trigger: 'blur',
        },
        {
          type: 'number',
          message: tl('needNumber'),
          trigger: 'blur',
        },
      ],
    }
    let payloadDialog = ref(false)
    let payloadLoading = ref(false)
    let payloadDetail = ref('')
    const copyBtnCom = ref()
    let clipboardInstance = undefined
    let isCopyShow = ref(false)
    let pageMeta = ref({})
    const { payloadForShow, payloadShowBy, payloadShowByOptions, setRawText } =
      useShowTextByDifferent()

    watch(delayedOption, (newOption) => {
      if (newOption == 'unlimited') {
        delayedConfig.max_delayed_messages = 0
      }
    })

    const getDelayedOption = () => {
      if (delayedConfig?.max_delayed_messages == 0) {
        return 'unlimited'
      } else {
        return 'custom'
      }
    }
    const getConfigFormEnable = () => {
      if (delayedConfig?.enable === true) {
        configEnable.value = true
      } else {
        configEnable.value = false
      }
    }

    const loadDelayedConfig = async () => {
      configPending.value = true
      delayedForm.value?.resetFields()

      let res = await getDelayedConfig().catch(() => {})
      if (res) {
        Object.assign(delayedConfig, res)
        getConfigFormEnable()
        delayedOption.value = getDelayedOption()
      }
      configPending.value = false
    }

    const loadDelayedList = async (params = {}) => {
      tbLoading.value = true
      let sendParams = {
        ...pageMeta,
        ...params,
      }
      Reflect.deleteProperty(sendParams, 'count')
      let res = await getDelayedList(sendParams).catch(() => {})
      if (res) {
        delayedTbData.value = res.data
        tbLoading.value = false
        pageMeta.value = res.meta
      } else {
        tbLoading.value = false
        delayedTbData.value = []
        pageMeta.value = {}
      }
    }

    const deleteDelayedInfo = async function (row) {
      MB.confirm(t('Base.confirmDelete'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          const { msgid } = row
          if (!msgid) return
          let res = await delDelayedInfo(msgid).catch(() => {})
          if (res) {
            // p.value.$emit("loadPage");
            loadDelayedList()
          } else {
            //todo
          }
        })
        .catch(() => {})
    }

    const checkPayload = async function (row) {
      payloadDialog.value = true
      payloadLoading.value = true
      payloadDetail.value = ''
      const { msgid } = row
      let res = await getDelayedInfo(msgid).catch(() => {})
      if (res) {
        payloadDetail.value = res?.payload
        setRawText(payloadDetail.value)
      } else {
        //todo
      }
      payloadLoading.value = false
      await nextTick()
      initCopyBtn()
    }

    const toggleStatus = async () => {
      let valid = await delayedForm.value?.validate().catch(() => {})
      if (!valid) {
        delayedConfig.enable = !delayedConfig.enable
        return
      }
      updateDelayedConfig()
    }

    const updateDelayedConfig = async function () {
      let valid = await delayedForm.value?.validate().catch(() => {})
      if (!valid) return
      configPending.value = true
      let res = await editDelayedConfig(delayedConfig).catch(() => {})
      if (res) {
        getConfigFormEnable()
        ElMessage({
          type: 'success',
          message: t('Base.updateSuccess'),
        })
      } else {
        loadDelayedConfig()
      }
      configPending.value = false
    }

    const reloading = function () {
      loadDelayedConfig()
      loadDelayedList()
      // p.value.$emit("loadPage");
    }

    onMounted(reloading)

    let copyShowTimeout = ref(null)
    const initCopyBtn = () => {
      clipboardInstance && clipboardInstance?.destroy()
      const btnEle = copyBtnCom.value?.$el
      if (btnEle) {
        clipboardInstance = createClipboardEleWithTargetText(
          btnEle,
          payloadForShow.value,
          copySuccess,
        )
      }
    }
    const copySuccess = () => {
      isCopyShow.value = true
      clearTimeout(copyShowTimeout.value)
      copyShowTimeout.value = setTimeout(() => {
        isCopyShow.value = false
      }, 2000)
    }

    onUnmounted(() => {
      copyShowTimeout.value && clearTimeout(copyShowTimeout.value)
    })

    return {
      tl,
      delayedTbData,
      delayedConfig,
      toggleStatus,
      updateDelayedConfig,
      configPending,
      deleteDelayedInfo,
      delayedOption,
      reloading,
      tbLoading,
      delayedForm,
      delayedRules,
      configEnable,
      loadDelayedList,
      checkPayload,
      payloadDialog,
      payloadLoading,
      payloadDetail,
      payloadForShow,
      payloadShowBy,
      payloadShowByOptions,
      dateFormat,
      copyBtnCom,
      isCopyShow,
      initCopyBtn,
      copySuccess,
      pageMeta,
    }
  },
})
</script>
<style lang="scss" scoped>
.payload-copied {
  padding-right: 10px;
}
.payload-dialog {
  .payload-dialog-ft {
    display: flex;
    justify-content: space-between;
    .el-select {
      width: 200px;
    }
  }
}
</style>
