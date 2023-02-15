<template>
  <div class="common-pagination">
    <el-pagination
      v-if="meta.count > 0"
      background
      layout="total, sizes, prev, pager, next"
      :page-sizes="[20, 50, 100, 500]"
      v-model:page-size="meta.limit"
      v-model:current-page="meta.page"
      :total="meta.count"
      @size-change="handleSizeChanged"
      @current-change="handleCurrentChanged"
    />
    <MiniPagination
      v-else-if="meta.count === -1"
      :current-page="meta.page"
      :hasnext="meta.hasnext"
      @current-change="handleCurrentChanged"
    />
  </div>
</template>
<script>
import { computed, defineComponent, watch } from 'vue'
import MiniPagination from './MiniPagination'

export default defineComponent({
  components: {
    MiniPagination,
  },
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
      // TODO: maybe we can count page
      meta.value.page = 1
      context.emit('loadPage', {
        page: meta.value.page,
        limit: size,
      })
    }

    const handleCurrentChanged = (current) => {
      if (meta.value.page !== current) {
        meta.value.page = current
      }
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
