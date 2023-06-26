import { HTTPBridge } from '@/types/rule'
import useResourceOpt from '@/hooks/Rule/bridge/useResourceOpt'
import useSSL from '@/hooks/useSSL'

export default (): {
  createRawHTTPForm: () => HTTPBridge
} => {
  const { createDefaultResourceOptsForm } = useResourceOpt()
  const { createSSLForm } = useSSL()

  const createRawHTTPForm = (): HTTPBridge =>
    ({
      name: '',
      method: 'post',
      url: 'http://',
      headers: { 'content-type': 'application/json' },
      body: '',
      pool_type: 'random',
      pool_size: 8,
      enable_pipelining: 100,
      connect_timeout: '15s',
      resource_opts: createDefaultResourceOptsForm({
        inflight: true,
        withoutRequestTimeout: false,
      }),
      ssl: createSSLForm(),
    } as HTTPBridge)

  return {
    createRawHTTPForm,
  }
}
