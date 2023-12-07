/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process')

const permissionReg = /hasPermission/
const btnReg = '<el-button([^>]|\n)*>'
const doNotCheck = [
  /backStep/i,
  /cancel/i,
  /nextStep/i,
  /search/i,
  /refresh/i,
  /Detail/i,
  /Setting/i,
]
const fileExclude = ['WebSocketItem.vue', 'WebSocket.vue']
const excludeConf = fileExclude.map((item) => `--exclude=${item}`).join(' ')
const check = () => {
  const ret = execSync(`pcre2grep ${excludeConf} -r -M '${btnReg}' ./src`, {
    encoding: 'utf-8',
  })
  const retArr = ret
    .split(`./src`)
    .filter(
      (item) =>
        item && !permissionReg.test(item) && !doNotCheck.some((regItem) => regItem.test(item)),
    )
    .map((item) => `./src${item}`)
  console.log(retArr)
}

check()
