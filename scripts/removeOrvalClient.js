import fs from 'fs'

const args = process.argv.slice(2)
const filePath = args[0]

if (!filePath) {
  console.error('please enter the file path to be deleted')
  process.exit(1)
}

try {
  fs.unlinkSync(filePath)
} catch (err) {
  console.error(`error：${err.message}`)
  process.exit(1)
}
