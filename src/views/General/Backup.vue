<template>
  <div class="backup app-wrapper">
    <el-button type="primary" size="small" icon="el-icon-plus" @click="handleExport">
      {{ $t('Backup.createBackup') }}
    </el-button>
    <el-upload
      ref="upload"
      class="upload"
      action="/api/v4/data/file"
      accept=".json"
      :limit="1"
      :file-list="fileList"
      :auto-upload="false"
      :on-change="handleChange"
      :on-error="handleError"
    >
      <el-button slot="trigger" size="small" icon="el-icon-upload2">
        {{ $t('Backup.uploadServer') }}
      </el-button>
    </el-upload>

    <el-table :data="tableData">
      <el-table-column prop="node" :label="$t('RuleEngine.node')" sortable></el-table-column>
      <el-table-column prop="filename" :label="$t('Backup.filename')" sortable></el-table-column>
      <el-table-column prop="size" :label="$t('Backup.size')" sortable>
        <template slot-scope="{ row }">
          {{ row.size | renderSize }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" :label="$t('Backup.createAt')" sortable></el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleDownload(row)"
            >{{ $t('Backup.download') }}
          </el-button>
          <el-button plain size="mini" @click="handleRestore(row)"
            >{{ $t('Backup.restore') }}
          </el-button>
          <el-button type="danger" plain size="mini" @click="deleteConfirm(row)"
            >{{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  loadBackup,
  exportBackup,
  deleteBackup,
  downloadFile,
  importBackup,
  uploadBackupFile,
} from '@/api/backup'

export default {
  name: 'Backup',
  filters: {
    renderSize(val) {
      if (val === null || val === '') {
        return '0 Bytes'
      }
      const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let index = 0
      const srcsize = parseFloat(val)
      index = Math.floor(Math.log(srcsize) / Math.log(1024))
      let size = srcsize / 1024 ** index
      size = size.toFixed(1)
      return `${size} ${unitArr[index]}`
    },
  },
  data() {
    return {
      fileList: [],
      tableData: [],
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.tableData = await loadBackup()
    },
    async handleExport() {
      let res
      try {
        res = await exportBackup()
      } catch (e) {
        return
      }
      if (res) {
        this.$message.success(this.$t('Base.createSuccess'))
        this.loadData()
      }
    },
    async handleDownload(row) {
      const res = await downloadFile(row.filename)
      if (res) {
        const aTag = document.createElement('a')
        const blob = new Blob([res.file])
        aTag.download = row.filename
        aTag.href = URL.createObjectURL(blob)
        aTag.setAttribute('type', 'hidden')
        document.body.appendChild(aTag)
        aTag.click()
        aTag.remove()
        URL.revokeObjectURL(blob)
      }
    },
    async handleRestore(row) {
      const { filename, node } = row
      const res = await importBackup({ filename, node })
      if (res) {
        this.$message.success(this.$t('Backup.restoreSuccess'))
      }
    },
    deleteConfirm(row) {
      const vue = this
      this.$msgbox
        .confirm(this.$t('Backup.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          deleteBackup(row.filename).then(() => {
            vue.$message.success(this.$t('Base.deleteSuccess'))
            vue.loadData()
          })
        })
        .catch(() => {})
    },
    handleChange(file) {
      if (file.size >= 5242880) {
        this.$message.warning(this.$t('Backup.fileTooBig'))
        this.$refs.upload.clearFiles()
        return
      }
      const reader = new FileReader()
      reader.readAsText(file.raw)
      reader.onload = async (event) => {
        const content = event.currentTarget.result
        const uploadData = {
          file: content,
          filename: file.name,
        }
        const res = await uploadBackupFile(uploadData)
        const { node } = res.data
        if (res) {
          this.handleRestore({ filename: file.name, node })
          this.loadData()
          this.$refs.upload.clearFiles()
        }
      }
      reader.onerror = () => {
        this.$message.error(this.$t('Backup.uploadFailed'))
      }
    },
    handleError(error) {
      this.$message.error(error.toString())
    },
  },
}
</script>

<style lang="scss" scoped>
.upload {
  display: inline-block;
}
</style>
