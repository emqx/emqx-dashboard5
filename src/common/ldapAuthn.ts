import { LDAPClientAttrExtract } from '@/types/enum'
import type { AuthnClientAttr } from '@/types/schemas/authentication.schemas'

export const serializeLDAPClientAttrs = (entries: AuthnClientAttr[]): AuthnClientAttr[] =>
  entries.map((entry) => {
    const { literal, ...mapping } = entry
    return entry.extract === LDAPClientAttrExtract.Literal ? { ...mapping, literal } : mapping
  })

export const isLDAPAttributeName = (value: string): boolean =>
  /^(?:[a-zA-Z][a-zA-Z0-9-]*|\d+(?:\.\d+)*)(?:;[a-zA-Z0-9-]+)*$/.exec(value)?.[0] === value

export const isLDAPClientAttributeName = (value: string): boolean =>
  /^[A-Za-z0-9][A-Za-z0-9_-]*$/.exec(value)?.[0] === value
