import fs from 'fs'
import path from 'path'

const dirPath = 'src/schemaText'

const regex = /(?<!{')([@{}])(?!'})/g
const escapedRegex = /{'([@{}])'}/

function processString(input) {
  return input.replace(regex, (match, p1, offset) => {
    let subStr = ''
    if (match === '{') {
      subStr = input.slice(offset, offset + 5)
    } else if (match === '}') {
      subStr = input.slice(offset - 4, offset + 1)
    }
    if (subStr.match(escapedRegex)) {
      return match
    }
    return `{'${match}'}`
  })
}

function processJsonStrings(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = processString(obj[key])
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      processJsonStrings(obj[key])
    }
  }
}

function processJsonFile(file) {
  try {
    const content = fs.readFileSync(file, 'utf-8')
    const obj = JSON.parse(content)
    processJsonStrings(obj)
    fs.writeFileSync(file, JSON.stringify(obj, null, 2))
    console.log(`JSON file ${file} has been processed.`)
  } catch (error) {
    console.error(`Error processing JSON file ${file}`, error)
  }
}

function traverseJsonFiles(dir) {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      traverseJsonFiles(filePath)
    } else if (path.extname(filePath) === '.json') {
      processJsonFile(filePath)
    }
  })
}

traverseJsonFiles(dirPath)
