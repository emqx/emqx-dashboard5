import { moveAuthz } from '@/api/auth'
import { AuthzSourceItem } from '@/types/auth'
import { TargetPosition } from '@/types/enum'

export default (): {
  moveAuthzBeforeAnotherAuthz: (
    authz: AuthzSourceItem,
    anotherAuthz: AuthzSourceItem,
  ) => Promise<void>
  moveAuthzAfterAnotherAuthz: (
    authz: AuthzSourceItem,
    anotherAuthz: AuthzSourceItem,
  ) => Promise<void>
  moveAuthzToTop: (authz: AuthzSourceItem) => Promise<void>
  moveAuthzToBottom: (authz: AuthzSourceItem) => Promise<void>
} => {
  const moveAuthzBeforeAnotherAuthz = (authz: AuthzSourceItem, anotherAuthz: AuthzSourceItem) => {
    return moveAuthz(authz.type, `${TargetPosition.Before}${anotherAuthz.type}`)
  }
  const moveAuthzAfterAnotherAuthz = (authz: AuthzSourceItem, anotherAuthz: AuthzSourceItem) => {
    return moveAuthz(authz.type, `${TargetPosition.After}${anotherAuthz.type}`)
  }
  const moveAuthzToTop = (authz: AuthzSourceItem) => {
    return moveAuthz(authz.type, TargetPosition.Top)
  }
  const moveAuthzToBottom = (authz: AuthzSourceItem) => {
    return moveAuthz(authz.type, TargetPosition.Bottom)
  }
  return {
    moveAuthzBeforeAnotherAuthz,
    moveAuthzAfterAnotherAuthz,
    moveAuthzToTop,
    moveAuthzToBottom,
  }
}
