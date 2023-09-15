import http from '@/common/http'

export const querySAMLConfig = (): Promise<unknown> => {
  // TODO:SSO
  return http.get('/sso')
}

export const verifyTokenFromSAML = (token: string): Promise<unknown> => {
  
}
