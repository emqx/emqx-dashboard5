<template>
  <el-select
    :value="rawValue"
    v-bind="$attrs"
    class="emq-select"
    v-on="$listeners"
    @change="selectChange"
  >
    <slot>
      <el-option
        v-for="(item, i) in options"
        :key="i"
        :value="item[fieldName.value]"
        :label="item[fieldName.label]"
        :disabled="isDisabled(item)"
      >
        <slot name="option" :item="item"></slot>
      </el-option>
    </slot>
  </el-select>
</template>

<script>
import http from '@/common/http'

export default {
  name: 'EmqSelect',

  components: {},

  props: {
    // eslint-disable-next-line
    value: {
      required: true,
    },
    field: {
      type: Object,
      required: true,
    },
    fieldName: {
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value',
      }),
    },
    disabledItem: {
      type: Array,
      default: () => [],
    },
    refresh: {
      type: Boolean,
    },
  },

  data() {
    return {
      options: [],
      parserField: {},
    }
  },

  computed: {
    rawValue: {
      get() {
        return typeof this.value === 'boolean' ? this.value.toString() : this.value
      },
      set(val) {
        let value = null
        const valueKey = this.fieldName.value
        const item = this.options.find(($) => $[valueKey] === val)
        if (item && this.parserField[valueKey]) {
          value = val === 'true'
        }
        this.$emit('update:value', value)
      },
    },
  },

  watch: {
    refresh(val) {
      if (val) {
        this.loadData()
      }
    },
    field: {
      handler() {
        this.loadData()
      },
      deep: true,
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    selectChange(val) {
      this.$emit('selectChange', val)
    },
    async loadData() {
      const options = await this.getOptions()
      this.parserField = {}

      const valueKey = this.fieldName.value
      const labelKey = this.fieldName.label

      this.options = options.map((option) => {
        const value = option[valueKey]
        const label = option[labelKey]
        if (typeof value === 'boolean') {
          this.parserField[valueKey] = 'boolean'
          option[valueKey] = value.toString()

          if (typeof label === 'boolean') {
            option[labelKey] = label.toString()
          }
        }
        return option
      })
      this.$emit('update:refresh', false)
    },
    isDisabled(item) {
      return this.disabledItem.includes(item[this.fieldName.value])
    },
    async getOptions() {
      const { api, url, options, list } = this.field
      let value = []
      if (options) {
        value = options
      } else if (list) {
        value = list.map(($) => ({ label: $, value: $ }))
      } else if (api) {
        value = await api()
      } else if (url) {
        value = await http.get(url)
      }
      return value
    },
  },
}
</script>

<style lang="scss">
.el-select-dropdown {
  /* 自定义的选项菜单样式 */
  .custom-option {
    .value {
      float: right;
      font-size: 12px;
      color: #888;
      margin-left: 30px;
    }
  }
}
</style>
