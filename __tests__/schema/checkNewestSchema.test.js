const fs = require('fs')
const axios = require('axios')
const { SchemaType, fileNameMap, requestPath, flatSchema } = require('../../scripts/flatSchema')

const getLocalSchemaFilePath = (type) => `../../scripts/schema/${fileNameMap[type]}.json`

let bridgeSchema
const hotConfSchema = require(getLocalSchemaFilePath(SchemaType.HotConf))

const baseURL = process.env.HOST_URL || 'http://localhost:18083'
const isCI = process.env.IS_CI === 'true'
const isEE = process.env.IS_EE === 'true'

const checkLocalSchema = async (type) => {
  let result = {}
  let rawSchema = {}
  try {
    const { data } = await axios.get(`${requestPath}${type}`, {
      baseURL: baseURL,
    })
    rawSchema = data
    result = flatSchema(data)
    const target = type === 'bridges' ? bridgeSchema : hotConfSchema
    return expect(result).toEqual(target)
  } catch (error) {
    if (error.matcherResult && !error.matcherResult.pass) {
      console.error('Mismatch found for', type)
      if (isCI) {
        // for artifact
        // Save result to a file
        const filename = `./__tests__/${fileNameMap[type]}.json`
        fs.writeFileSync(filename, JSON.stringify(result, null, 2))
        // Save raw schema to a file
        const rawSchemaFilename = `./public/schema-${type}.json`
        fs.writeFileSync(rawSchemaFilename, JSON.stringify(rawSchema, null, 2))
      } else {
        const filePath = `./scripts/schema/${fileNameMap[type]}.json`
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2))
      }
    }
    throw error
  }
}

if (isEE) {
  bridgeSchema = require(getLocalSchemaFilePath(SchemaType.Bridge))
  test('check newest bridge schema', async () => {
    await checkLocalSchema(SchemaType.Bridge)
  })
}
test('check newest hot conf schema', async () => {
  await checkLocalSchema(SchemaType.HotConf)
})
