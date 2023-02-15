import useI18nTl from './useI18nTl'

export default (): {
  datePickerShortcuts: {
    text: string
    value: () => Date
  }[]
} => {
  const { tl } = useI18nTl('Base')

  const datePickerShortcuts = [
    {
      text: tl('sevenDaysLater'),
      value: () => new Date(Date.now() + 3600 * 1000 * 24 * 7),
    },
    {
      text: tl('thirtyDaysLater'),
      value: () => new Date(Date.now() + 3600 * 1000 * 24 * 30),
    },
    {
      text: tl('aYearLater'),
      value: () => {
        const date = new Date()
        const dateNum = date.getMonth() === 1 && date.getDate() === 29 ? 28 : date.getDate()
        date.setDate(dateNum)
        date.setFullYear(date.getFullYear() + 1)
        return date
      },
    },
  ]

  return {
    datePickerShortcuts,
  }
}
