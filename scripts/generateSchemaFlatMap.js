const regArr = [/\.get/, /\.put/, /bridge\.node_status/, /bridge\.metrics/, /bridge\.node_metrics/]
const removeUselessData = (obj) => {
  const target = obj.components.schemas
  for (let key in target) {
    if (regArr.some((reg) => reg.test(key))) {
      delete target[key]
    }
  }
  return target
}

const generatePropsArr = (obj) => {
  const ret = {}
  const keys = Object.keys(obj).sort()
  keys.forEach((key) => {
    const singleLevelSchema = obj[key]
    const { properties } = singleLevelSchema
    ret[key] = Object.keys(properties).sort()
  })
  return ret
}

const generateSchemaFlatMap = (data) => {
  return generatePropsArr(removeUselessData(data))
}

module.exports = generateSchemaFlatMap
