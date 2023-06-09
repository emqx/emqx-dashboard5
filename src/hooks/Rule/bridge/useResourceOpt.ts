import { ResourceOpt } from '@/types/rule'
import { omit } from 'lodash'

export default (): {
  createDefaultResourceOptsForm: (config?: {
    inflight?: boolean
    batch?: boolean
    withoutRequestTimeout?: boolean
  }) => ResourceOpt
} => {
  const createCommonForm = (): ResourceOpt => ({
    worker_pool_size: 4,
    health_check_interval: '15s',
    query_mode: 'async',
    max_buffer_bytes: '1GB',
    request_ttl: '45s',
  })

  const createDefaultResourceOptsForm = (
    config: { inflight?: boolean; batch?: boolean; withoutRequestTimeout?: boolean } = {},
  ): ResourceOpt => {
    let formData: ResourceOpt = createCommonForm()
    if (config.inflight) {
      formData = {
        ...formData,
        inflight_window: 100,
      }
    }
    if (config.batch) {
      formData = {
        ...formData,
        batch_size: 100,
      }
    }
    if (config.withoutRequestTimeout) {
      formData = omit(formData, 'request_ttl')
    }
    return formData
  }
  return {
    createDefaultResourceOptsForm,
  }
}
