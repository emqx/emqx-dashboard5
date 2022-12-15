/**
 * fill new record by old record, old component and new component
 */
import { Properties } from '@/types/bridgeSchema'
import { cloneDeep, get, omit, set } from 'lodash'

interface Val {
  components: Properties
  record: Record<string, any>
}

export default (): {
  fillNewRecord: (newVal: Val, oldVa: Val) => Record<string, any>
} => {
  const countPathPrefix = (pathArr: Array<string>) =>
    pathArr.reduce(
      (prefix: string, pathItem) => `${prefix}${prefix.length ? '.' : ''}${pathItem}.properties`,
      '',
    )

  const fillNewRecord = (
    { components: newCom, record: newRecord }: Val,
    { components: oldCom, record: oldRecord }: Val,
  ) => {
    const ret = cloneDeep(oldRecord)
    const fieldPathsNeedDelete: Array<string> = []
    const fieldPathsNeedAdd: Array<string> = []

    const walkALevel = (props: any, currentPath: Array<string> = [], walkType: 'new' | 'old') => {
      const keys = Object.keys(props)
      const findTarget = walkType === 'new' ? oldCom : newCom
      keys.forEach((keyItem) => {
        if (props[keyItem].properties) {
          // TODO: find a better way to handle SSL
          if (keyItem === 'ssl') {
            return
          }
          const path = [...currentPath, keyItem]
          walkALevel(props[keyItem].properties, path, walkType)
        } else {
          const pathPrefix = countPathPrefix(currentPath)
          const componentItemPath = `${pathPrefix}${pathPrefix.length ? '.' : ''}${keyItem}`

          if (get(findTarget, componentItemPath) === undefined) {
            const fieldPath =
              currentPath.length > 0 ? `${currentPath.join('.')}.${keyItem}` : keyItem
            if (walkType === 'new') {
              fieldPathsNeedAdd.push(fieldPath)
            } else {
              fieldPathsNeedDelete.push(fieldPath)
            }
          }
        }
      })
    }

    walkALevel(newCom, [], 'new')
    walkALevel(oldCom, [], 'old')

    // delete
    omit(ret, fieldPathsNeedDelete)
    // add
    fieldPathsNeedAdd.forEach((path) => {
      set(ret, path, get(newRecord, path))
    })

    return ret
  }

  return {
    fillNewRecord,
  }
}
