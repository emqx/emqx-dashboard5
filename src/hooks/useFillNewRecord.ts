/**
 * fill new record by old record, old component and new component
 */
import { Properties } from '@/types/schemaForm'

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
    let ret = cloneDeep(oldRecord)
    const fieldPathsNeedDelete: Array<string> = []
    const fieldPathsNeedAdd: Array<string> = []

    const walkALevel = (props: any, currentPath: Array<string> = [], walkType: 'new' | 'old') => {
      const keys = Object.keys(props)
      const findTarget = walkType === 'new' ? oldCom : newCom

      keys.forEach((keyItem) => {
        const pathPrefix = countPathPrefix(currentPath)
        const componentItemPath = `${pathPrefix}${pathPrefix.length ? '.' : ''}${keyItem}`
        const fieldPath = currentPath.length > 0 ? `${currentPath.join('.')}.${keyItem}` : keyItem

        if (props[keyItem].properties) {
          // TODO: find a better way to handle SSL
          if (keyItem === 'ssl') {
            return
          }
          const path = [...currentPath, keyItem]
          if (walkType === 'old' && get(findTarget, componentItemPath) === undefined) {
            fieldPathsNeedDelete.push(fieldPath)
          } else {
            walkALevel(props[keyItem].properties, path, walkType)
          }
        } else {
          if (get(findTarget, componentItemPath) === undefined) {
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
    ret = omit(ret, fieldPathsNeedDelete)
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
