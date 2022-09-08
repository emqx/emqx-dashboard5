import { OtherBridge } from '@/types/rule'
import { computed, Ref, ComputedRef } from 'vue'
import { isString, isBoolean, omit } from 'lodash'

/**
 * some utils about sync, batch and msg queue configuration
 */

type ClassMap = Record<string, string | undefined>

interface FuncReturn {
  syncEtcFieldsClassMap: ComputedRef<ClassMap>
  handleSyncEtcFormData: (formData: OtherBridge) => OtherBridge
}

export default (record: Ref<OtherBridge>): FuncReturn => {
  const isAsync = (formData: OtherBridge) =>
    isString(formData.resource_opts?.query_mode) &&
    formData.resource_opts.query_mode.indexOf('async') > -1
  const canConfigInflightWindow = (formData: OtherBridge) =>
    !(formData.resource_opts?.async_inflight_window === undefined)

  const isEnableBatch = (formData: OtherBridge) =>
    isBoolean(formData.resource_opts?.enable_batch) && formData.resource_opts.enable_batch

  const isEnableQueue = (formData: OtherBridge) =>
    isBoolean(formData.resource_opts?.enable_queue) && formData.resource_opts.enable_queue

  const syncFieldsClassMap = computed(() => {
    // if can no config inflight window size, the request mode field do not need a row
    if (isAsync(record.value) || !canConfigInflightWindow(record.value)) {
      return {}
    }
    return {
      'resource_opts.query_mode': 'col-need-row',
      'resource_opts.async_inflight_window': 'col-hidden',
    }
  })

  const batchFieldsClassMap = computed(() => {
    if (!isEnableBatch(record.value)) {
      return {
        'resource_opts.enable_batch': 'col-need-row',
        'resource_opts.batch_size': 'col-hidden',
        'resource_opts.batch_time': 'col-hidden',
      }
    }
    return { 'resource_opts.enable_batch': 'col-need-row' }
  })

  const msgQueueFieldsClassMap = computed(() => {
    if (!isEnableQueue(record.value)) {
      return {
        'resource_opts.enable_queue': 'col-need-row',
        'resource_opts.max_queue_bytes': 'col-hidden',
      }
    }
    return { 'resource_opts.enable_queue': 'col-need-row' }
  })

  const syncEtcFieldsClassMap = computed(() => {
    return {
      ...syncFieldsClassMap.value,
      ...batchFieldsClassMap.value,
      ...msgQueueFieldsClassMap.value,
    }
  })

  const handleSyncEtcFormData = (formData: OtherBridge) => {
    let ret = formData
    if (!isAsync(formData)) {
      ret = omit(ret, 'resource_opts.async_inflight_window')
    }
    if (!isEnableBatch(formData)) {
      ret = omit(ret, ['resource_opts.batch_size', 'resource_opts.batch_time'])
    }
    if (!isEnableQueue(formData)) {
      ret = omit(ret, 'resource_opts.max_queue_bytes')
    }
    return ret
  }

  return {
    syncEtcFieldsClassMap,
    handleSyncEtcFormData,
  }
}
