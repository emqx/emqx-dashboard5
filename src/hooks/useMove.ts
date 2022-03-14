type EventMap = {
  moveToBottom: (target: any) => Promise<any>
  moveToTop: (target: any) => Promise<any>
  moveBeforeAnotherTarget: (target: any, anotherTarget: any) => Promise<any>
  moveAfterAnotherTarget: (target: any, anotherTarget: any) => Promise<any>
}

export default (eventMap: EventMap, errorHandlerFunc?: () => void, finallyAction?: () => void) => {
  const handleDragEvent = async (
    newIndex: number,
    oldIndex: number,
    list: Array<any>,
    isFiltered = false,
  ) => {
    if (newIndex === undefined || oldIndex === undefined) {
      return Promise.reject()
    }

    const target = list[oldIndex]
    const isTheLast = newIndex === list.length - 1
    const isDown = newIndex - oldIndex > 0
    const anotherTarget = list[isDown ? newIndex + 1 : newIndex]
    try {
      if (isTheLast) {
        if (isFiltered) {
          await eventMap.moveAfterAnotherTarget(target, list[newIndex])
        } else {
          await eventMap.moveToBottom(target)
        }
      } else {
        await eventMap.moveBeforeAnotherTarget(target, anotherTarget)
      }
    } catch (error) {
      console.error(error)
      // empty the array first when an error occurs, otherwise the view will not be updated
      errorHandlerFunc ? errorHandlerFunc() : void 0
    } finally {
      finallyAction ? finallyAction() : void 0
    }
  }
  return {
    handleDragEvent,
  }
}
