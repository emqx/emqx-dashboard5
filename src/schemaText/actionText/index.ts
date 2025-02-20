import {
  enActionsLabel,
  enConnectorsLabel,
  zhActionsLabel,
  zhConnectorsLabel,
  zhIntegrationDesc,
  enIntegrationDesc,
} from '@emqx/shared-ui-i18n'
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

const transformConf = (conf: TextConf, propName: 'label' | 'desc') =>
  Object.entries(conf).reduce(
    (obj: Record<string, Record<string, Record<'label' | 'desc', string>>>, [type, map]) => {
      obj[type] = Object.entries(map).reduce(
        (ret: Record<string, Record<'label' | 'desc', string>>, [key, value]) => {
          ret[key] = { [propName]: value } as Record<'label' | 'desc', string>
          return ret
        },
        {},
      )
      return obj
    },
    {},
  )

const handleOneLang = (
  defaultLabelConf: TextConf,
  customLabelConf: TextConf,
  defaultDescConf: TextConf,
  customDescConf: TextConf,
  lang: 'zh' | 'en',
) => {
  const labelConf = merge(defaultLabelConf, customLabelConf)
  const labelRet = transformConf(labelConf, 'label')
  const descConf = merge(defaultDescConf, customDescConf)
  const descRet = transformConf(descConf, 'desc')

  result[lang] = merge(labelRet, descRet)
}

const generateResult = () => {
  handleOneLang(
    merge(zhConnectorsLabel, zhActionsLabel),
    customActionLabelZh,
    zhIntegrationDesc,
    customActionDescZh,
    'zh',
  )
  handleOneLang(
    merge(enConnectorsLabel, enActionsLabel),
    customActionLabelEn,
    enIntegrationDesc,
    customActionDescEn,
    'en',
  )
}

generateResult()
export default result
