<template>
  <el-pagination
    v-if="meta.count > 0"
    hide-on-single-page
    background
    layout="total, sizes, prev, pager, next"
    :page-sizes="[20, 50, 100, 500]"
    v-model:page-size="meta.limit"
    v-model:current-page="meta.page"
    :total="meta.count"
    @size-change="handleSizeChanged"
    @current-change="handleCurrentChanged"
  >
  </el-pagination>
</template>
<script>
import { computed, defineComponent, watch } from 'vue'

export default defineComponent({
  props: {
    // reloadFunc: Function,
    metaData: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  emits: ['loadPage', 'update:metaData'],

  setup(prop, context) {
    let meta = computed(() => prop.metaData)
    meta.value.limit ||= 20
    meta.value.page ||= 1

    watch(meta, (v) => {
      context.emit('update:metaData', v)
    })

    const handleSizeChanged = (size) => {
      context.emit('loadPage', {
        page: meta.value.page,
        limit: size,
      })
    }

    const handleCurrentChanged = (current) => {
      context.emit('loadPage', {
        page: current,
        limit: meta.value.limit,
      })
    }

    return {
      meta,
      handleSizeChanged,
      handleCurrentChanged,
    }
  },
})
</script>
