export default (): {
  noLocalOpts: Array<{ value: number; label: string }>
  retainAsPublishedOpts: Array<{ value: number; label: string }>
  retainHandlingOpts: Array<number>
} => {
  const noLocalOpts = [
    { value: 0, label: 'False' },
    { value: 1, label: 'True' },
  ]
  const retainAsPublishedOpts = [
    { value: 0, label: 'False' },
    { value: 1, label: 'True' },
  ]
  const retainHandlingOpts = [0, 1, 2]
  return {
    noLocalOpts,
    retainAsPublishedOpts,
    retainHandlingOpts,
  }
}
