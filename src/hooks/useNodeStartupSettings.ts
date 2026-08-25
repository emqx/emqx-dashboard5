import type { FeaturePreset, SecurityProfile } from '@/types/dashboard'

type NodeStartupSetting = SecurityProfile | FeaturePreset

export default function useNodeStartupSettings(): {
  getNodeStartupSettingLabel: (value?: NodeStartupSetting) => string
  formatNodeStartupSetting: (value?: NodeStartupSetting) => string
} {
  const { tl } = useI18nTl('Dashboard')

  const settingLabelKeyMap: Record<NodeStartupSetting, string> = {
    legacy: 'legacySecurityProfile',
    hardened: 'hardenedSecurityProfile',
    full: 'fullFeaturePreset',
    essential: 'essentialFeaturePreset',
    custom: 'customFeaturePreset',
  }

  const getNodeStartupSettingLabel = (value?: NodeStartupSetting) => {
    if (!value) {
      return '--'
    }
    const labelKey = settingLabelKeyMap[value]
    return labelKey ? tl(labelKey) : value
  }

  const formatNodeStartupSetting = (value?: NodeStartupSetting) => {
    const label = getNodeStartupSettingLabel(value)
    return value ? tl('nodeStartupSettingValue', { label, value }) : label
  }

  return { getNodeStartupSettingLabel, formatNodeStartupSetting }
}
