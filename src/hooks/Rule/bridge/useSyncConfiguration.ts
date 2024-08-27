import { OtherBridge } from '@/types/rule'
import type { ComputedRef, WritableComputedRef } from 'vue'
import { computed } from 'vue'
import { isString, omit } from 'lodash'

/**
 * some utils about sync, batch and msg queue configuration
 */

type ClassMap = Record<string, string | undefined>

interface FuncReturn {
  syncEtcFieldsClassMap: ComputedRef<ClassMap>
  handleSyncEtcFormData: (formData: OtherBridge) => OtherBridge
}

export default (record: WritableComputedRef<OtherBridge>): FuncReturn => {
  const isAsync = (formData: OtherBridge) =>
    isString(formData.resource_opts?.query_mode) &&
    formData.resource_opts.query_mode.indexOf('async') > -1

  const syncFieldsClassMap = computed(() => {
    // if can no config inflight window size, the request mode field do not need a row
    if (isAsync(record.value)) {
      return {}
    }
    return {
      'resource_opts.inflight_window': 'col-hidden',
    }
  })

  const syncEtcFieldsClassMap = computed(() => {
    return syncFieldsClassMap.value
  })

  const handleSyncEtcFormData = (formData: OtherBridge) => {
    let ret = formData
    if (!isAsync(formData)) {
      ret = omit(ret, 'resource_opts.inflight_window')
    }
    return ret
  }

  return {
    syncEtcFieldsClassMap,
    handleSyncEtcFormData,
  }
}
