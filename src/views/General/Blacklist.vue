<template>
  <div class="blacklist app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" :icon="Plus" @click="showDialog">
        {{ $t('Base.create') }}
      </el-button>
    </div>
    <el-table :data="tableData" v-loading="tbLoading">
      <el-table-column prop="who" :label="$t('General.who')"> </el-table-column>
      <el-table-column prop="as" :label="$t('General.as')"> </el-table-column>
      <el-table-column prop="reason" min-width="120px" :label="$t('General.reason')">
      </el-table-column>
      <el-table-column prop="until" :formatter="formatterUntil" :label="$t('General.until')">
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button plain size="small" @click="deleteConfirm(row)"
            >{{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="emq-table-footer">
      <common-pagination @loadPage="listBlackList" v-model:metaData="pageMeta"></common-pagination>
    </div>

    <el-dialog :title="$t('General.createBlacklist')" v-model="dialogVisible">
      <el-form
        ref="recordForm"
        :model="record"
        :rules="rules"
        label-position="top"
        @keyup.enter="save()"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('General.banObject')" prop="who">
              <el-input v-model="record.who">
                <template #prepend>
                  <el-select v-model="record.as">
                    <el-option
                      v-for="item in asOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('General.until')" prop="until">
              <el-date-picker
                v-model="record.until"
                type="datetime"
                format="YYYY-MM-DD HH:mm:ss"
                popper-class="datepicker-until"
                :disabledDate="isItEarlierThanToday"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="reason" :label="$t('General.reason')">
              <el-input
                v-model="record.reason"
                type="textarea"
                :rows="3"
                :placeholder="$t('General.reason')"
                resize="none"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button @click="closeDialog">{{ $t('Base.cancel') }}</el-button>
          <el-button type="primary" @click="save" :loading="submitLoading">{{
            $t('Base.create')
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormat } from '@/common/utils'
import { loadBlacklist, createBlacklist, deleteBlacklist } from '@/api/function'
import CommonPagination from '../../components/commonPagination.vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'Blacklist',
  components: { CommonPagination },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      params: {},
      submitLoading: false,
      asOptions: [
        { label: this.$t('Clients.clientId'), value: 'clientid' },
        { label: this.$t('Clients.username'), value: 'username' },
        { label: this.$t('Clients.ipAddress'), value: 'peerhost' },
      ],
      record: {
        who: '',
      },
      rules: {
        // as: [{ required: true, message: this.$t("General.enterAs") }],
        who: [{ required: true, message: this.$t('General.enterWho') }],
        until: [
          {
            validator: (rule, value) => {
              if (!value) {
                return []
              }
              if (new Date(value).getTime() < Date.now()) {
                return [new Error(this.$t('General.timeEarlierError'))]
              }
              return []
            },
            trigger: 'blur',
          },
        ],
      },
      tbLoading: false,
      pageMeta: {},
    }
  },
  setup() {
    return {
      Plus,
    }
  },
  mounted() {
    // this.$refs.p.$emit("loadPage");
    this.listBlackList()
  },
  methods: {
    async listBlackList(params = {}) {
      this.tbLoading = true
      const sendParams = { ...this.params, ...this.pageMeta, ...params }
      Reflect.deleteProperty(sendParams, 'count')
      try {
        const { data = [], meta = {} } = await loadBlacklist(this.pageMeta)
        this.tableData = data
        this.pageMeta = meta
      } catch (error) {
        this.tableData = []
        this.pageMeta = {}
      } finally {
        this.tbLoading = false
      }
    },

    clearInput() {
      this.$refs?.recordForm?.resetFields()
    },
    showDialog() {
      this.record = {
        reason: '',
        who: '',
        as: 'clientid',
      }
      this.dialogVisible = true
      this.$nextTick(this.clearInput)
    },
    isItEarlierThanToday(date) {
      const todayStartTime = new Date().setHours(0, 0, 0, 0)
      return date.getTime() < todayStartTime
    },
    closeDialog() {
      this.dialogVisible = false
    },
    async save() {
      this.$refs.recordForm.validate(async (valid) => {
        if (!valid) {
          return
        }
        const record = {
          ...this.record,
          until: (this.record.until && new Date(this.record.until).toISOString()) || null,
        }
        // if (typeof record.until === 'number') {
        //   record.until = Math.floor(record.until / 1000)
        // }

        this.submitLoading = true
        try {
          await createBlacklist(record)
          ElMessage.success(this.$t('General.createBlacklistSuccess'))
          this.closeDialog()
          this.listBlackList({ page: 1 })
          // this.$refs.p.$emit("loadPage");
        } catch (error) {
          //
        } finally {
          this.submitLoading = false
        }
      })
    },
    async deleteConfirm(item) {
      try {
        await this.$msgbox.confirm(this.$t('Base.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          confirmButtonClass: 'confirm-danger',
          type: 'warning',
        })
        const { who, as } = item
        await deleteBlacklist({ who, as })
        ElMessage.success(this.$t('Base.deleteSuccess'))
        this.listBlackList({ page: 1 })
        // this.$refs.p.$emit("loadPage");
      } catch (error) {
        //
      }
    },
    formatterUntil({ until }) {
      if (!until) {
        return this.$t('General.neverExpire')
      }
      return dateFormat(until)
    },
  },
}
</script>

<style lang="scss" scoped>
.el-input-group--append :deep(.el-input-group__append) {
  width: 110px;
}
</style>

<style lang="scss">
.datepicker-until {
  // hide [now] button
  .el-picker-panel__footer .el-button--text {
    display: none;
  }
}
</style>
