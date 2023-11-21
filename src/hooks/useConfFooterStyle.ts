const FOOTER_SELECTOR = '.btn-col'
export default (): {
  addObserverToFooter: (selector?: string) => void
} => {
  const observer = new IntersectionObserver(
    ([e]) => {
      e.target.classList.toggle('is-pinned', e.intersectionRatio < 1)
    },
    { threshold: [1] },
  )

  let nowEl: undefined | Element = undefined
  const addObserverToFooter = (selector = FOOTER_SELECTOR) => {
    try {
      const el = document.querySelector(selector)
      if (nowEl && nowEl !== el) {
        observer.unobserve(nowEl)
      }
      if (el && IntersectionObserver) {
        nowEl = el
        observer.observe(el)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    addObserverToFooter,
  }
}
