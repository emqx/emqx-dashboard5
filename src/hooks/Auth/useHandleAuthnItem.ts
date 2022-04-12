import { moveAuthn } from '@/api/auth'
import { AuthnItem } from '@/types/auth'
import { TargetPosition } from '@/types/enum'

export default (): {
  moveAuthnBeforeAnotherAuthn: (authn: AuthnItem, anotherAuthn: AuthnItem) => any
  moveAuthnAfterAnotherAuthn: (authn: AuthnItem, anotherAuthn: AuthnItem) => any
  moveAuthnToTop: (authn: AuthnItem) => any
  moveAuthnToBottom: (authn: AuthnItem) => any
} => {
  const moveAuthnBeforeAnotherAuthn = (authn: AuthnItem, anotherAuthn: AuthnItem) => {
    return moveAuthn(authn.id, `${TargetPosition.Before}${anotherAuthn.id}`)
  }
  const moveAuthnAfterAnotherAuthn = (authn: AuthnItem, anotherAuthn: AuthnItem) => {
    return moveAuthn(authn.id, `${TargetPosition.After}${anotherAuthn.id}`)
  }
  const moveAuthnToTop = (authn: AuthnItem) => {
    return moveAuthn(authn.id, TargetPosition.Top)
  }
  const moveAuthnToBottom = (authn: AuthnItem) => {
    return moveAuthn(authn.id, TargetPosition.Bottom)
  }
  return {
    moveAuthnBeforeAnotherAuthn,
    moveAuthnAfterAnotherAuthn,
    moveAuthnToTop,
    moveAuthnToBottom,
  }
}
