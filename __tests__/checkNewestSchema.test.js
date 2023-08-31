const fs = require('fs')
const axios = require('axios')
const generateSchemaFlatMap = require('../scripts/generateSchemaFlatMap')
const bridgeSchema = require('../scripts/bridgeSchemaFlatMap.json')
const hotConfSchema = require('../scripts/hotConfSchemaFlatMap.json')

const baseURL = process.env.HOST_URL || 'http://localhost:18083'

console.log("🍅🍅🍅🍅🍅🍅🍅 ~ baseURL:", baseURL)

const updateLocalSchema = async (type) => {
  try {
    const { data } = await axios.get(`/api/v5/schemas/${type}`, {
      baseURL: baseURL,
    })
    const result = generateSchemaFlatMap(data)
    console.log(result)
    const target = type === 'bridges' ? bridgeSchema : hotConfSchema
    expect(result).toEqual(target)
    
  } catch (error) {
    console.error(error)
  }
}

const main = () => {
  updateLocalSchema('bridges')
  updateLocalSchema('hotconf')
}

main()
