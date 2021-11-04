<template>
  <div class="log-trace">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          {{ $t('LogTrace.logTraceDescription') }}
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <el-card shadow="never" class="emq-list-card">
        <div class="emq-table-header">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="handleDialogOpen('create')"
          >
            {{ $t('LogTrace.createTrace') }}
          </el-button>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="name" :label="$t('LogTrace.filter')"></el-table-column>
          <el-table-column prop="type" :label="$t('LogTrace.type')"></el-table-column>
          <el-table-column prop="level" :label="$t('LogTrace.level')"></el-table-column>
          <el-table-column width="250px">
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="handleDialogOpen('view', row)"
                >{{ $t('Overview.view') }}
              </el-button>
              <el-button type="dashed" size="mini" @click="handleDownload(row)">
                {{ $t('Backup.download') }}
              </el-button>
              <el-button
                type="dashed danger"
                :loading="btnLoading === 'deleteBtn'"
                size="mini"
                @click="deleteConfirm(row)"
              >
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-dialog
      width="520px"
      :title="accessType === 'view' ? $t('LogTrace.viewTrace') : $t('LogTrace.createTrace')"
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
          <el-col :span="24">
            <el-form-item prop="type" :label="$t('LogTrace.type')">
              <emq-select
                v-model="record.type"
                :field="{ options: typeOptions }"
                :disabled="accessType !== 'create'"
                >>
              </emq-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="level" :label="$t('LogTrace.level')">
              <emq-select
                v-model="record.level"
                :field="{ list: levelOptions }"
                :disabled="accessType !== 'create'"
              >
              </emq-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="name" :label="$t('LogTrace.filter')">
              <el-input v-model="record.name" :readonly="accessType !== 'create'"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="file" :label="$t('LogTrace.logPath')">
              <el-input v-model="record.file" :readonly="accessType !== 'create'"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div v-if="accessType === 'create'" slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="dialogVisible = false">{{
          $t('Base.cancel')
        }}</el-button>
        <el-button
          :loading="btnLoading === 'createBtn'"
          type="primary"
          size="small"
          @click="handleCreateTrace"
        >
          {{ $t('Base.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTraceList, addTrace, deleteTrace } from '@/api/logTrace'

export default {
  name: 'LogTrace',

  data() {
    return {
      tableData: [],
      dialogVisible: false,
      accessType: '',
      record: {},
      rules: {
        type: [{ required: true, message: this.$t('General.pleaseChoose') }],
        name: [{ required: true, message: this.$t('General.pleaseEnter') }],
        level: [{ required: true, message: this.$t('General.pleaseChoose') }],
      },
      typeOptions: [
        { label: this.$t('Clients.clientId'), value: 'clientid' },
        { label: this.$t('Subs.topic'), value: 'topic' },
      ],
      levelOptions: [
        'debug',
        'info',
        'notice',
        'warning',
        'error',
        'critical',
        'alert',
        'emergency',
      ],
      btnLoading: undefined,
    }
  },

  methods: {
    async loadList() {
      this.tableData = await getTraceList()
    },

    handleDialogOpen(oper, row) {
      this.accessType = oper
      this.dialogVisible = true

      if (oper === 'view') {
        this.record = { ...row }
      }
    },

    clearInput() {
      if (this.$refs.recordForm) {
        this.$refs.recordForm.resetFields()
      }
    },

    handleSuccess() {
      this.btnLoading = undefined
      this.loadList()
    },

    handleCreateTrace() {
      this.$refs.recordForm.validate((valid) => {
        if (!valid) {
          return
        }
        this.btnLoading = 'createBtn'
        const { ...data } = this.record
        addTrace(data)
          .then(() => {
            this.$message.success(this.$t('Base.createSuccess'))
            this.dialogVisible = false
            this.handleSuccess()
          })
          .catch(() => {
            this.btnLoading = undefined
          })
      })
    },

    deleteConfirm(row) {
      this.$confirm(this.$t('Modules.confirmDelete'), this.$t('Base.warning'), {
        type: 'warning',
        cancelButtonText: this.$t('Base.cancel'),
        confirmButtonText: this.$t('Base.confirm'),
      })
        .then(() => {
          this.btnLoading = 'deleteBtn'
          const { type, name } = row
          deleteTrace(type, name).then(() => {
            this.$message.success(this.$t('Base.deleteSuccess'))
            this.handleSuccess()
          })
        })
        .catch(() => {
          this.btnLoading = undefined
        })
    },

    handleDownload(row) {
      const { type, name } = row
      const aTag = document.createElement('a')
      aTag.download = `${type}/${name}`
      aTag.href = `/api/v4/log/trace/download/${type}/${name}`
      aTag.setAttribute('type', 'hidden')
      document.body.appendChild(aTag)
      aTag.click()
      aTag.remove()
    },
  },

  created() {
    this.loadList()
  },
}
</script>
