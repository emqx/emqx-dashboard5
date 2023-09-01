const axios = require('axios/dist/node/axios.cjs')
const generateSchemaFlatMap = require('../scripts/generateSchemaFlatMap')
const bridgeSchema = require('../scripts/bridgeSchemaFlatMap.json')
const hotConfSchema = require('../scripts/hotConfSchemaFlatMap.json')

const baseURL = process.env.HOST_URL || 'http://localhost:18083'

const checkLocalSchema = async (type) => {
  const { data } = await axios.get(`/api/v5/schemas/${type}`, {
    baseURL: baseURL,
  })
  const result = generateSchemaFlatMap(data)
  const target = type === 'bridges' ? bridgeSchema : hotConfSchema
  return expect(result).toEqual(target)
}

test('check newest bridge schema', async () => {
  await checkLocalSchema('bridges')
})
test('check newest hot conf schema', async () => {
  await checkLocalSchema('hotconf')
})
