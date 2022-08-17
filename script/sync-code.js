// eslint-disable-next-line @typescript-eslint/no-var-requires
const execa = require('execa')

const devBranch = process.argv[2]

async function executeShell() {
  try {
    const { stdout } = await execa('./script/sync-code.sh', [devBranch])
    console.log(stdout)
  } catch (error) {
    console.error(error)
  }
}

executeShell()
