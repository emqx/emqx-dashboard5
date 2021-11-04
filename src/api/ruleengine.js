import http from '@/common/http'

export function getBridgeList() {
  return http.get('/bridge')
}
