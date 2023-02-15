import useI18nTl from './useI18nTl'

export default (): {
  datePickerShortcuts: {
    text: string
    value: () => Date
  }[]
} => {
  const { t } = useI18nTl('Base')

  const getLabel = (num: number, unitKey: string) => {
    return `${num} ${t(unitKey, num)}`
  }

  const datePickerShortcuts = [
    {
      text: getLabel(7, 'Base.day'),
      value: () => new Date(Date.now() + 3600 * 1000 * 24 * 7),
    },
    {
      text: getLabel(30, 'Base.day'),
      value: () => new Date(Date.now() + 3600 * 1000 * 24 * 30),
    },
    {
      text: getLabel(1, 'Base.year'),
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
