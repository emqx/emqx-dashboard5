/* eslint-disable @typescript-eslint/no-var-requires */
const packageJSON = require('../package.json')
const axios = require('axios')
const baseURL = process.env.HOST_URL || 'http://localhost:18083'
const packageVersion = packageJSON.version

const emqxVersionRegex = /^[ev](\d+\.\d+\.\d+)/
const matchEmqxVersion = (emqxVersion) => {
  const matchRet = emqxVersion.match(emqxVersionRegex)
  return matchRet ? matchRet[1] : ''
}

const check = async () => {
  const { data } = await axios.get(`${baseURL}/api/v5/status`, { params: { format: 'json' } })
  const { rel_vsn } = data
  const emqxVersion = matchEmqxVersion(rel_vsn)
  if (emqxVersion !== packageVersion) {
    console.log('EMQX Version:', emqxVersion)
    console.log('Package Version:', packageVersion)
    throw new Error('EMQX version and package version are not the same!')
  }
}

check()
