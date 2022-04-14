<template>
  <el-pagination
    v-if="meta.count > 0"
    background
    layout="total, sizes, prev, pager, next"
    :page-sizes="[20, 50, 100, 500]"
    v-model:page-size="meta.limit"
    v-model:current-page="meta.page"
    :total="meta.count"
    @size-change="reloadPage"
    @current-change="reloadPage"
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

    const reloadPage = () => {
      context.emit('loadPage', {
        page: meta.value.page,
        limit: meta.value.limit,
      })
    }

    // onMounted(reloadPage);

    return {
      meta,
      reloadPage,
    }
  },
})
</script>
