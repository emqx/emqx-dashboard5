import axios from 'axios'

export default (): {
  printVersion: () => Promise<void>
} => {
  const versionReg = /refs\/tags\/(.+)/
  const printVersion = async () => {
    try {
      const { data: versionContent } = await axios({
        method: 'get',
        url: 'version',
        baseURL: '',
      })
      debugger
      const version = versionContent.match(versionReg)?.[1]
      if (version) {
        console.log('🔎 Dashboard Version:', version)
      }
    } catch (error) {
      //
    }
  }
  return {
    printVersion,
  }
}
