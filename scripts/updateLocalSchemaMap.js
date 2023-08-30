const fs = require('fs')
const axios = require('axios')
const generateSchemaFlatMap = require('./generateSchemaFlatMap')

const [host = 'localhost', port = '18083'] = process.argv.slice(2)
const serverPath = `http://${host}:${port}/`

const bridgeFilePath = './scripts/bridgeSchemaFlatMap.json'
const hotFilePath = './scripts/hotConfSchemaFlatMap.json'

const updateLocalSchema = async (type) => {
  try {
    const { data } = await axios.get(`api/v5/schemas/${type}`, {
      baseURL: serverPath,
    })
    const result = generateSchemaFlatMap(data)
    const resultPath = type === 'bridges' ? bridgeFilePath : hotFilePath
    fs.writeFile(resultPath, JSON.stringify(result, null, 2), (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('success')
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const main = () => {
  updateLocalSchema('bridges')
  updateLocalSchema('hotconf')
}

main()
