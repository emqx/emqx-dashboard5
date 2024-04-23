import { groupBy } from 'lodash'

export default () => {
  const convertLogStrToLogArr = (logStr: string) =>
    logStr
      .split('\n')
      .filter(Boolean)
      .map((item) => JSON.parse(item))

  const formatLog = (logStr: string) => {
    const logArr = convertLogStrToLogArr(logStr)
    const groupedMap = groupBy(logArr, 'meta.rule_trigger_time')
    debugger
  }

  const logData = [
    // one submit
    {
      time: 'XXXX',
      infoArr: [
        // rule exec
        {},
        // action1
        {},
        // action
      ],
    },
  ]

  return {
    formatLog,
  }
}
