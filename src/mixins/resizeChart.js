// 自动根据窗口大小的改变，进行 resize
export default {
  mounted() {
    setTimeout(() => {
      window.addEventListener('resize', this.chart.resize)
    }, 300)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.chart.resize)
  },
  watch: {
    '$store.state.leftBarCollapse'() {
      setTimeout(this.chart.resize, 300) //leftBarCollapse's animation is 300ms normally
    },
  },
}
