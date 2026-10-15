import { trimAndRemoveReturnFromValues } from '@/common/tools'
import type { AxiosRequestConfig } from 'axios'

export const prepareAuthnRequest = (
  body: Record<string, any>,
): Pick<AxiosRequestConfig, 'data' | 'keepSpaces'> => {
  if (body.backend !== 'ldap' || body.mechanism !== 'password_based') {
    return { data: body }
  }

  // Clean ordinary fields locally, then skip the interceptor's second trimming pass.
  const data = trimAndRemoveReturnFromValues(body, ['client_attrs']) as Record<string, any>
  if (Array.isArray(data.client_attrs)) {
    data.client_attrs = data.client_attrs.map((mapping) =>
      trimAndRemoveReturnFromValues(mapping, ['select', 'literal']),
    )
  }
  return { data, keepSpaces: true }
}
