import { ECharts } from 'echarts'
import { nextTick, onUnmounted } from 'vue'

export default (): {
  addListener: (chart: ECharts) => void
  removeListener: () => void
} => {
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

  onUnmounted(() => {
    removeListener()
  })

  return {
    addListener,
    removeListener,
  }
}
