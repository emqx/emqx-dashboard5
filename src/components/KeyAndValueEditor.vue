<template>
  <!-- eslint-disable -->
  <el-table class="key-and-value-editor" :data="tableData" size="mini">
    <el-table-column prop="key" :label="keyValueLabel.key" min-width="80px">
      <template slot-scope="{ row }">
        <el-input
          v-model="row.key"
          style="width: 120px !important"
          class="key-input"
          :placeholder="$t('components.objectKey')"
          @input="atInputChange"
        ></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="value" :label="keyValueLabel.value" min-width="150px">
      <template slot-scope="{ row }">
        <el-input v-model="row.value" @input="atInputChange"></el-input>
      </template>
    </el-table-column>
    <el-table-column width="60px">
      <a href="javascript:;" slot="header" class="btn" @click="addColumn">
        {{ $t('Base.add') }}
      </a>
      <template slot-scope="{ row }">
        <a href="javascript:;" class="btn" @click="deleteItem(row)">
          {{ $t('Base.delete') }}
        </a>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'KeyAndValueEditor',

  components: {},

  model: {
    prop: 'value',
    event: 'update',
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
    notNull: {
      type: Boolean,
      default: false,
    },
    customLabel: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      row: {
        key: '',
        value: '',
        state: 0, // 0 ok 1 error
      },
      tableData: [],
    }
  },

  computed: {
    keyValueLabel() {
      if (this.customLabel === null) {
        return {
          key: this.$t('components.key'),
          value: this.$t('components.value'),
        }
      }
      return this.customLabel
    },
  },

  created() {
    const list = []
    const d = this.value
    Object.entries(d).forEach(([key, value]) => {
      list.push({ key, value, state: 0 })
    })
    this.tableData = list
  },

  methods: {
    atInputChange() {
      const data = {}
      this.tableData.forEach((item) => {
        const { key, value } = item
        data[key] = value
      })
      this.$emit('update', data)
    },
    deleteItem(row) {
      this.tableData = this.tableData.filter(($) => $.key !== row.key)
      this.atInputChange()
    },
    addColumn() {
      this.tableData.push({
        key: '',
        value: '',
        state: 0,
      })
    },
  },
}
</script>

<style lang="scss">
.key-and-value-editor {
  font-size: 12px !important;

  .el-input {
    width: 100% !important;

    &.key-input {
      width: 120px !important;
    }
  }

  .el-table__empty-block {
    min-height: 40px;
  }
}
</style>
