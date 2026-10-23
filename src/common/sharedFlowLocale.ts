import type { SharedLocaleMessages } from '@emqx/shared-ui-utils'
import { zhTWRuleFunction } from '@emqx/shared-ui-i18n/zh-TW/ruleFunction'
import { zhTWRuleSQL } from '@emqx/shared-ui-i18n/zh-TW/ruleSQL'
import { zhTWFlow } from '@emqx/shared-ui-i18n/zh-TW/flow'
import zhTW from '@/i18n/zh-TW.json'

// Shared components use their own i18n instance. Select the optional Traditional
// Chinese dictionaries and reuse the app's common texts.
export const zhTWFlowMessages: SharedLocaleMessages = {
  ruleFunction: zhTWRuleFunction,
  ruleSQL: zhTWRuleSQL,
  flow: zhTWFlow,
  common: {
    access: '是否允許',
    topic: zhTW.Base.topic,
    username: zhTW.Base.username,
    password: zhTW.Base.password,
    cancel: zhTW.Base.cancel,
    back: '返回',
    generate: zhTW.Base.generate,
    field: zhTW.components.field,
    pleaseChoose: zhTW.Rule.selectRequired,
    pleaseEnter: zhTW.Rule.inputRequired,
    add: zhTW.Base.add,
    actions: zhTW.Base.operation,
    transform: zhTW.Flow.transform,
    alias: zhTW.Flow.alias,
    name: zhTW.Base.name,
    colon: zhTW.Base.colon,
  },
}
