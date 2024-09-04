/* eslint-disable @typescript-eslint/no-var-requires */
const packageJSON = require('../package.json')
const axios = require('axios')
const baseURL = import.meta.env?.HOST_URL || 'http://localhost:18083'
const rawPackageVersion = packageJSON.version

const packageVersionRegex = /^(\d+\.\d+)/
const matchPackageVersion = (packageVersion) => {
  const matchRet = packageVersion.match(packageVersionRegex)
  return matchRet ? matchRet[1] : ''
}

const emqxVersionRegex = /^[ev](\d+\.\d+)/
const matchEmqxVersion = (emqxVersion) => {
  const matchRet = emqxVersion.match(emqxVersionRegex)
  return matchRet ? matchRet[1] : ''
}

const check = async () => {
  const { data } = await axios.get(`${baseURL}/api/v5/status`, { params: { format: 'json' } })
  const { rel_vsn } = data
  const packageVersion = matchPackageVersion(rawPackageVersion)
  const emqxVersion = matchEmqxVersion(rel_vsn)
  if (emqxVersion !== packageVersion) {
    console.log('EMQX Version:', emqxVersion)
    console.log('Package Version:', packageVersion)
    console.warn('EMQX version and package version are not the same!')
  }
}

check()
