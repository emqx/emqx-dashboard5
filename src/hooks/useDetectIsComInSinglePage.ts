export default (): {
  detectIsComInSinglePage: () => boolean
} => {
  const detectIsComInSinglePage = () => {
    const parent = getCurrentInstance()?.parent
    return !parent || /RouterView/i.test(parent.type.name || '')
  }

  return {
    detectIsComInSinglePage,
  }
}
