const fs = require('fs')
const axios = require('axios')
const {
  SchemaType,
  fileNameMap,
  requestPath,
  generateSchemaFlatMap,
} = require('./generateSchemaFlatMap')

const [host = 'localhost', port = '18083'] = process.argv.slice(2)
const serverPath = `http://${host}:${port}/`

const getFilePath = (type) => `./scripts/schema/${fileNameMap[type]}.json`

const updateLocalSchema = async (type) => {
  try {
    const { data } = await axios.get(`${requestPath}${type}`, {
      baseURL: serverPath,
    })
    const result = generateSchemaFlatMap(data)
    const resultPath = getFilePath(type)
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
  updateLocalSchema(SchemaType.Bridge)
  updateLocalSchema(SchemaType.HotConf)
}

main()
