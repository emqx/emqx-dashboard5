// eslint-disable-next-line @typescript-eslint/no-var-requires
const execa = require('execa')

const devBranch = process.argv[2]

async function executeShell() {
  try {
    await execa('./script/sync-code.sh', [devBranch])
  } catch (error) {
    console.error(error)
  }
}

executeShell()
