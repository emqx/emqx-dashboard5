import { ECharts } from 'echarts'

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
