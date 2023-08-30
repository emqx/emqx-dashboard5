const fs = require('fs')
const axios = require('axios')
const generateSchemaFlatMap = require('../generateSchemaFlatMap')
const bridgeSchema = require('../bridgeSchemaFlatMap.json')
const hotConfSchema = require('../hotConfSchemaFlatMap.json')
const { describe, expect, test } = require('jest')

const [host = 'localhost', port = '18083'] = process.argv.slice(2)
const serverPath = `http://${host}:${port}/`

const updateLocalSchema = async (type) => {
  try {
    const { data } = await axios.get(`api/v5/schemas/${type}`, {
      baseURL: serverPath,
    })
    const result = generateSchemaFlatMap(data)
    const target = type === 'bridges' ? bridgeSchema : hotConfSchema
    const ret = expect(result).toEqual(target)
    console.log(ret)
  } catch (error) {
    console.error(error)
  }
}

const main = () => {
  updateLocalSchema('bridges')
  updateLocalSchema('hotconf')
}

main()
