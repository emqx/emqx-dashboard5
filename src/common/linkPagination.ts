export type LinkPaginationCursorName = 'last_ns' | 'first_ns' | 'last_clientid' | 'first_clientid'

export type LinkPaginationCursor = {
  name: LinkPaginationCursorName
  value: string
}

const CURSOR_NAMES: Array<LinkPaginationCursorName> = [
  'last_ns',
  'first_ns',
  'last_clientid',
  'first_clientid',
]

const getHeaderValue = (linkHeader?: unknown): string | undefined => {
  if (typeof linkHeader === 'string') {
    return linkHeader
  }
  if (Array.isArray(linkHeader)) {
    return linkHeader.filter((item): item is string => typeof item === 'string').join(', ')
  }
  return undefined
}

const getQueryString = (uriReference: string): string => {
  const trimmed = uriReference.trim()
  const queryIndex = trimmed.indexOf('?')
  const queryWithMaybeFragment = queryIndex >= 0 ? trimmed.slice(queryIndex + 1) : trimmed
  return queryWithMaybeFragment.split('#')[0]
}

export const parseLinkPaginationCursor = (
  linkHeader?: unknown,
): LinkPaginationCursor | undefined => {
  const header = getHeaderValue(linkHeader)
  if (!header) {
    return undefined
  }

  const nextLink = header
    .split(/,\s*(?=<)/)
    .find((link) => /(?:^|;)\s*rel="?next"?\s*(?:;|$)/i.test(link))
  const uriReference = nextLink?.match(/<([^>]*)>/)?.[1]
  if (!uriReference) {
    return undefined
  }

  const searchParams = new URLSearchParams(getQueryString(uriReference))
  const cursorName = CURSOR_NAMES.find((name) => searchParams.has(name))
  const cursorValue = cursorName ? searchParams.get(cursorName) : undefined
  if (!cursorName || cursorValue === undefined || cursorValue === null) {
    return undefined
  }

  return {
    name: cursorName,
    value: cursorValue,
  }
}
