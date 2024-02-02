import {
  enActionsLabel,
  enConnectorsLabel,
  zhActionsLabel,
  zhConnectorsLabel,
} from '@emqx/shared-ui-i18n'
import { merge } from 'lodash'
import customActionDescEn from './action-desc-en.json'
import customActionDescZh from './action-desc-zh.json'
import customActionLabelEn from './action-label-en.json'
import customActionLabelZh from './action-label-zh.json'

interface TextConf {
  [type: string]: { [key: string]: string }
}

interface TextItem {
  label: string
  desc?: string
}
interface TextResult {
  zh: Record<string, { [key: string]: TextItem }>
  en: Record<string, { [key: string]: TextItem }>
}

const result: TextResult = {
  zh: {},
  en: {},
}

const handleOneLang = (
  defaultLabelConf: TextConf,
  customLabelConf: TextConf,
  descConf: TextConf,
  lang: 'zh' | 'en',
) => {
  const allTypes = [...new Set([...Object.keys(defaultLabelConf), ...Object.keys(customLabelConf)])]
  allTypes.forEach((type) => {
    const defaultTypeLabelMap = defaultLabelConf[type] || {}
    const customTypeLabelMap = customLabelConf[type] || {}

    result[lang][type] = Object.entries(merge(defaultTypeLabelMap, customTypeLabelMap)).reduce(
      (obj: { [key: string]: TextItem }, [key, label]) => {
        const desc = descConf[type]?.[key]
        obj[key] = { label, desc }
        return obj
      },
      {},
    )
  })
}

const generateResult = () => {
  handleOneLang(
    merge(zhConnectorsLabel, zhActionsLabel),
    customActionLabelZh,
    customActionDescZh,
    'zh',
  )
  handleOneLang(
    merge(enConnectorsLabel, enActionsLabel),
    customActionLabelEn,
    customActionDescEn,
    'en',
  )
}

generateResult()
export default result
