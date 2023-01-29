import { AUTO_RESTART_INTERVAL_DEFAULT } from '@/common/constants'
import { ResourceOpt } from '@/types/rule'

export default (): {
  createDefaultResourceOptsForm: (config?: { inflight?: boolean; batch?: boolean }) => ResourceOpt
} => {
  const createCommonForm = (): ResourceOpt => ({
    worker_pool_size: 4,
    health_check_interval: '15s',
    auto_restart_interval: AUTO_RESTART_INTERVAL_DEFAULT,
    query_mode: 'sync',
    max_queue_bytes: '1GB',
    request_timeout: '15s',
  })

  const createDefaultResourceOptsForm = (
    config: { inflight?: boolean; batch?: boolean } = {},
  ): ResourceOpt => {
    let formData: ResourceOpt = createCommonForm()
    if (config.inflight) {
      formData = {
        ...formData,
        async_inflight_window: 100,
      }
    }
    if (config.batch) {
      formData = {
        ...formData,
        batch_size: 100,
        batch_time: '10ms',
      }
    }
    return formData
  }
  return {
    createDefaultResourceOptsForm,
  }
}
