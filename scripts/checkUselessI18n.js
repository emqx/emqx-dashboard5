import fs from 'fs/promises'
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const useLessKey = {}

const scanFile = async (filePath) => {
  console.log(`Checking ${filePath}`)
  const fullPath = path.resolve(__dirname, '..', filePath)

  // Dynamically import the module
  const module = await import(fullPath)
  const json_data = module.default || module

  for (const key of Object.keys(json_data)) {
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
  }
}

async function traverseDir(dirPath) {
  try {
    const files = await fs.readdir(dirPath)
    for (const file of files) {
      const filePath = path.join(dirPath, file)
      await scanFile(filePath)
    }
    console.log(useLessKey)
  } catch (err) {
    console.error(`Failed to read directory ${dirPath}: ${err}`)
  }
}

traverseDir('./src/i18n').catch(console.error)
