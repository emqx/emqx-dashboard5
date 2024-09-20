/* eslint-disable @typescript-eslint/no-var-requires */
import { execSync } from 'child_process'

const permissionReg = /hasPermission/
const btnReg = '<el-button([^>]|\n)*>'
const doNotCheckKeyword = [
  'backStep',
  'handleBack',
  'goPreStep',
  'cancel',
  'next',
  'search',
  'refresh',
  'Detail',
  'Setting',
  'ArrowUp',
  'dropdown-btn',
  'doc',
  'copyText',
  'btn-copy',
  '= false',
  'checkPayload(row)',
  '<!--',
  'setDefaultContent',
  'help-btn',
  'closeDialog',
  'loadMetricsFromTopic',
  'routeToContactUs',
  ' disabled',
  'Advanced',
  'checkPayload',
  'toggleEditedWay',
]
const doNotCheckReg = new RegExp(doNotCheckKeyword.map((item) => item).join('|'), 'i')
const fileExclude = [
  'WebSocketItem.vue',
  'WebSocket.vue',
  'FromSelectList.vue',
  'HelpDrawer.vue',
  'Cluster.vue',
  'InviteNode.vue',
  'Login.vue',
  'FlowList.vue',
  'ObjectArrayEditor.vue',
  'KeyAndValueEditor.vue',
]
const excludeConf = fileExclude.map((item) => `--exclude=${item}`).join(' ')
const check = () => {
  const ret = execSync(`pcre2grep ${excludeConf} -r -M '${btnReg}' ./src`, {
    encoding: 'utf-8',
  })
  const retArr = ret
    .split(`./src`)
    .filter((item) => item && !permissionReg.test(item) && !doNotCheckReg.test(item))
    .map((item) => `./src${item}`)
  console.log(retArr)
}

check()
