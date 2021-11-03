<template>
  <div class="application app-wrapper">
    <el-button type="primary" size="small" icon="el-icon-plus" @click="showDialog('create')">
      {{ $t('Base.create') }}
    </el-button>

    <el-table :data="tableData" class="data-list">
      <el-table-column prop="app_id" label="AppID" sortable>
        <template slot-scope="{ row }">
          <a @click.prevent="showDialog('view', row)">
            {{ row.app_id }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('General.appName')" sortable></el-table-column>
      <el-table-column
        prop="expired"
        :formatter="formatterExpired"
        :label="$t('General.expireAt')"
      ></el-table-column>
      <el-table-column prop="desc" :label="$t('General.remark')"></el-table-column>
      <el-table-column :label="$t('General.isEnabled')">
        <template slot-scope="{ row }">
          <el-switch v-model="row.status" @change="updateApplication(row)"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template slot-scope="{ row }">
          <el-button plain size="mini" @click="showDialog('edit', row)">
            {{ $t('Base.edit') }}
          </el-button>
          <el-button type="danger" size="mini" plain @click="deleteConfirm(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      width="600px"
      :title="accessType === 'edit' ? $t('General.editApp') : $t('General.createApp')"
      :visible.sync="dialogVisible"
      @close="clearInput"
    >
      <el-form
        ref="recordForm"
        size="small"
        :model="record"
        :rules="accessType === 'view' ? {} : rules"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="app_id" label="AppID">
              <el-input
                v-model="record.app_id"
                :readonly="accessType !== 'create'"
                :disabled="accessType === 'edit'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="accessType === 'view'" :span="12">
            <el-form-item prop="secret" :label="$t('General.secret')">
              <el-input
                v-model="record.secret"
                :disabled="accessType === 'edit'"
                :readonly="accessType !== 'create'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="name" :label="$t('General.appName')">
              <el-input
                v-model="record.name"
                :disabled="accessType === 'edit'"
                :readonly="accessType === 'view'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="status" :label="$t('General.isEnabled')">
              <emq-select
                v-model="record.status"
                :field="{ options: enableOption }"
                :disabled="accessType === 'view'"
              >
              </emq-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="expired" :label="$t('General.expireAt')">
              <el-date-picker
                v-model="record.expired"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :readonly="accessType === 'view'"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="desc" :label="$t('General.remark')">
              <el-input v-model="record.desc" :readonly="accessType === 'view'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div v-if="accessType !== 'view'" slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="dialogVisible = false">{{
          $t('Base.cancel')
        }}</el-button>
        <el-button type="primary" size="small" @click="save">{{ $t('Base.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

import { loadApp, createApp, showApp, updateApp, destroyAPP } from '@/api/function'

export default {
  name: 'Application',

  data() {
    return {
      dialogVisible: false,
      tableData: [],
      accessType: '',
      enableOption: [
        { label: this.$t('General.enabled'), value: true },
        { label: this.$t('General.disabled'), value: false },
      ],
      record: {
        status: true, // 是否启用
        desc: '',
      },
      rules: {
        name: [{ required: true, message: this.$t('General.pleaseEnterAppName') }],
        app_id: [{ required: true, message: this.$t('General.pleaseEnterTheAppId') }],
        status: [{ required: true, message: this.$t('General.pleaseChoose') }],
      },
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    formatterExpired({ expired }) {
      if (!expired || typeof expired !== 'number') {
        return this.$t('General.neverExpire')
      }
      return moment(expired * 1000).format('YYYY-MM-DD')
    },
    clearInput() {
      if (this.$refs.recordForm) {
        this.$refs.recordForm.resetFields()
      }
    },
    async loadData() {
      this.tableData = await loadApp()
    },
    // 请求一组数据
    async loadAppData(id) {
      const record = await showApp(id)
      if (record.expired && typeof record.expired === 'number') {
        record.expired = moment(record.expired * 1000).format('YYYY-MM-DD')
      }
      this.record = record
    },
    showDialog(type, item) {
      this.accessType = type
      if (type === 'edit') {
        const record = { ...item }
        if (record.expired && typeof record.expired === 'number') {
          record.expired = moment(record.expired * 1000).format('YYYY-MM-DD')
        } else {
          record.expired = undefined
        }
        this.record = record
      } else if (type === 'view') {
        this.loadAppData(item.app_id)
      } else {
        this.record = {
          app_id: Math.random().toString(16).slice(3),
          status: true,
          desc: '',
        }
      }
      this.dialogVisible = true
    },
    updateApplication(item) {
      updateApp(item.app_id, item).then(() => {
        this.$message.success(this.$t('Base.editSuccess'))
      })
    },
    save() {
      const vue = this
      this.$refs.recordForm.validate((valid) => {
        if (!valid) {
          return
        }
        const record = { ...this.record }
        if (record.expired && typeof record.expired === 'string') {
          try {
            record.expired = Math.floor(new Date(record.expired).getTime() / 1000)
          } catch (e) {
            record.expired = null
          }
        }
        if (vue.accessType === 'edit') {
          const { app_id } = vue.record
          updateApp(app_id, record).then(() => {
            vue.$message.success(this.$t('Base.editSuccess'))
            vue.dialogVisible = false
            vue.accessType = ''
            vue.loadData()
          })
        } else {
          createApp(record).then(() => {
            vue.$message.success(this.$t('General.successfulAppCreation'))
            vue.dialogVisible = false
            vue.accessType = ''
            vue.loadData()
          })
        }
      })
    },
    deleteConfirm(item) {
      const vue = this
      this.$msgbox
        .confirm(this.$t('General.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          destroyAPP(item.app_id).then(() => {
            vue.$message.success(this.$t('Base.deleteSuccess'))
            vue.loadData()
          })
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.el-date-editor {
  width: 100%;
}
</style>
