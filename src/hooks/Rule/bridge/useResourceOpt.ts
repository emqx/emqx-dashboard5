import { ResourceOpt } from '@/types/rule'

export default (): {
  createDefaultResourceOptsForm: (config?: { inflight?: boolean; batch?: boolean }) => ResourceOpt
} => {
  const createCommonForm = (): ResourceOpt => ({
    worker_pool_size: 16,
    health_check_interval: '15s',
    auto_restart_interval: '60s',
    query_mode: 'sync',
    enable_queue: false,
    max_queue_bytes: '1GB',
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
        enable_batch: false,
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
