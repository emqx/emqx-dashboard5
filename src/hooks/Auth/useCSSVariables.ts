export default (): {
  getCSSVariables: (keys: Array<string>) => Record<string, string>
} => {
  const getCSSVariables = (keys: Array<string>): Record<string, string> => {
    let ret = {}
    const rootEle = document.querySelector(':root')
    if (rootEle) {
      const rootStyle = getComputedStyle(rootEle)
      ret = keys.reduce((obj, key) => {
        return {
          ...obj,
          [key]: rootStyle.getPropertyValue(key),
        }
      }, {})
    }
    return ret
  }

  return {
    getCSSVariables,
  }
}
