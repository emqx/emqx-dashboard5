import { waitAMoment } from '@/common/tools'
import { ECharts } from 'echarts'
import { useStore } from 'vuex'

export default (): {
  addListener: (chart: ECharts) => void
  removeListener: () => void
} => {
  const { state } = useStore()

  let chartInstance: null | ECharts = null

  const handleWindowResize = async () => {
    await nextTick()
    chartInstance?.resize()
  }

  const addListener = (chart: ECharts) => {
    chartInstance = chart
    window.addEventListener('resize', handleWindowResize)
  }

  const removeListener = () => {
    window.removeEventListener('resize', handleWindowResize)
  }

  watch(
    () => state.leftBarCollapse,
    async () => {
      await waitAMoment(300)
      handleWindowResize()
    },
  )

  onUnmounted(() => {
    removeListener()
  })

  return {
    addListener,
    removeListener,
  }
}
