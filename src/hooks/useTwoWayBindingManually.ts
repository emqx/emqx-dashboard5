import { get, set } from 'lodash'

type Get = typeof get
type Set = typeof set

export default (): {
  getModelValue: Get
  setModelValue: Set
} => {
  const getModelValue = get

  const setModelValue = set

  return {
    getModelValue,
    setModelValue,
  }
}
