/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')

const useLessKey = {}

const scanFile = (filePath) => {
  console.log(`Checking ${filePath}`)
  const { default: json_data } = require('esm')(module)(`../${filePath}`)

  Object.keys(json_data).forEach((key) => {
    try {
      execSync(`grep -r --exclude-dir=i18n -E '${key}[^\\w]' ./src`, {
        encoding: 'utf-8',
      })
    } catch (error) {
      if (!useLessKey[filePath]) {
        useLessKey[filePath] = []
      }
      useLessKey[filePath].push(key)
    }
  })
}

function traverseDir(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(`Failed to read directory ${dirPath}: ${err}`)
      return
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file)
      scanFile(filePath)
    })
    console.log(useLessKey)
  })
}

traverseDir('./src/i18n')
