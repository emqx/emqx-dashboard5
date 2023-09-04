const fs = require('fs')
const axios = require('axios/dist/node/axios.cjs')
const {
  SchemaType,
  fileNameMap,
  requestPath,
  generateSchemaFlatMap,
} = require('../scripts/generateSchemaFlatMap')

const bridgeSchema = require(`../scripts/schema/${fileNameMap[SchemaType.Bridge]}.json`)
const hotConfSchema = require(`../scripts/schema/${fileNameMap[SchemaType.HotConf]}.json`)

const baseURL = process.env.HOST_URL || 'http://localhost:18083'

const checkLocalSchema = async (type) => {
  let result
  try {
    const { data } = await axios.get(`${requestPath}${type}`, {
      baseURL: baseURL,
    })
    result = generateSchemaFlatMap(data)
    const target = type === 'bridges' ? bridgeSchema : hotConfSchema
    return expect(result).toEqual(target)
  } catch (error) {
    if (error.matcherResult && !error.matcherResult.pass) {
      console.error('Mismatch found for', type)
      // Save result to a file
      const filename = `./scripts/schema/${fileNameMap[type]}.json`
      fs.writeFileSync(filename, JSON.stringify(result, null, 2))
    }
    throw error
  }
}

test('check newest bridge schema', async () => {
  await checkLocalSchema(SchemaType.Bridge)
})
test('check newest hot conf schema', async () => {
  await checkLocalSchema(SchemaType.HotConf)
})
