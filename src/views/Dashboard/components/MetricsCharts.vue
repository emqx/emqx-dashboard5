<template>
  <div>
    <div v-for="t in typeData" :key="t" :ref="t"></div>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, onMounted, onUnmounted } from '@vue/composition-api'
import Moment from 'moment'
import { loadMetricsLog } from '@/api/common'

export default defineComponent({
  name: 'MetricsCharts',
  setup() {
    let typeList = ['dropped', 'connection', 'route', 'subscriptions', 'sent', 'received']
    let typeData = reactive({})
    let typeTitle = reactive({})
    const REFRESHTIME = 60 * 1000
    const DATALEN = 60
    let intervalID = 0

    let getTypeData = async (t) => {
      const ret = await loadMetricsLog(t).catch((e) => {})
      if (ret) {
        typeTitle[t] = Object.keys(ret)
        typeData[t] = typeTitle[t].map((n) => {
          let a = ret[n],
            b
          return a.length > DATALEN ? ((b = a.reverse()), (b.length = DATALEN), b.reverse()) : a
        })
      }
    }

    let getAllTypeData = () => {
      typeList.forEach((v) => {
        getTypeData(v)
      })

      console.log(typeData)
    }

    onMounted(() => {
      getAllTypeData()
      intervalID = window.setInterval(getAllTypeData, REFRESHTIME)
    })
    onUnmounted(() => {
      clearInterval(intervalID)
    })

    return {
      typeData,
      typeList,
      typeTitle,
      getTypeData,
    }
  },
})
</script>
<style lang="scss" scoped></style>
