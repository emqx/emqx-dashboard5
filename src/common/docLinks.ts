type DocKey =
  | 'cloud'
  | 'home'
  | 'sqlGrammar'
  | 'sqlActionRepub'
  | 'sqlTest'
  | 'bridgePayload'
  | 'documentation'
  | 'forum'
  | 'discord'
  | 'gitHub'
  | 'contact'
  | 'ruleEvent'
  | 'bridgeAsFrom'
  | 'ruleEventMsgPub'
  | 'enterprise'
  | 'dashboard'
  | 'mqttStudy'
  | 'mqttV5'
  | 'mqttClient'
  | 'githubHome'
  | 'twitterHome'
  | 'youtubeHome'
  | 'linkedInHome'
  | 'emqxEnterprise'
  | 'cloudHome'
  | 'blog'
  | 'emqxGettingStarted'
  | 'accessControl'
  | 'dataIntegration'
  | 'resetPassword'

export type DocMap = Record<DocKey, string>

const defaultQueryObj = {
  utm_source: 'emqx-dashboard',
  utm_medium: 'referral',
}
const createQueryStr = (queryObj: Record<string, string | number>) => {
  const obj = { ...defaultQueryObj, ...queryObj }
  return Object.entries(obj).reduce(
    (str, [key, value]) => (str ? `${str}&${key}=${value}` : `${key}=${value}`),
    '',
  )
}

const QUERY_FOR_HELP = createQueryStr({ utm_campaign: 'emqx-dashboard-help' })
const QUERY_FOR_GO_CLOUD = createQueryStr({
  utm_campaign: 'dashboard-to-cloud',
  // TODO: confirm this link
  continue: 'https%3A%2F%2Fcloud-intl.emqx.com%2Fconsole%2F',
})
const QUERY_FOR_CONTACT = createQueryStr({
  product: 'emqx',
  utm_campaign: 'dashboard-to-contact-us',
})
const QUERY_FOR_GO_ENTERPRISE = createQueryStr({
  utm_campaign: 'dashboard-header-upgrade-to-enterprise',
})

export default (lang: string): DocMap => {
  const accountsLink = lang === 'zh' ? 'accounts-zh.emqx.com' : 'accounts.emqx.com'
  return {
    sqlGrammar: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/rule-sql-grammar-and-examples.html`,
    sqlActionRepub: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/rule-actions.html#%E6%B6%88%E6%81%AF%E9%87%8D%E5%8F%91%E5%B8%83-%E5%8A%A8%E4%BD%9C`,
    sqlTest: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/rule-get-started.html#%E6%B5%8B%E8%AF%95-sql-%E8%AF%AD%E5%8F%A5`,
    bridgePayload: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/data-bridge-webhook.html#%E7%A4%BA%E4%BE%8B-%E4%BD%BF%E7%94%A8%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E5%88%9B%E5%BB%BA-webhook`,
    home: lang === 'en' ? 'https://www.emqx.io/' : `https://www.emqx.io/${lang}`,
    cloud: `https://${accountsLink}/signup?${QUERY_FOR_GO_CLOUD}`,
    // TODO: version
    documentation: `https://www.emqx.io/docs/${lang}/v5.0/?${QUERY_FOR_HELP}`,
    forum: lang === 'en' ? `https://www.emqx.io/forum/` : `https://askemq.com/`,
    discord: `https://discord.gg/xYGf3fQnES`,
    gitHub: `https://github.com/emqx/emqx`,
    contact: `https://www.emqx.com/${lang}/contact?${QUERY_FOR_CONTACT}`,
    ruleEvent: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/rule-sql-events-and-fields.html`,
    bridgeAsFrom: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/rule-sql-events-and-fields.html#${
      lang === 'zh' ? '数据桥接' : 'data-bridges'
    }`,
    ruleEventMsgPub: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/rule-sql-events-and-fields.html#${
      lang === 'zh' ? 'mqtt-消息' : 'mqtt-message'
    }`,
    enterprise: `https://www.emqx.com/${lang}/products/emqx?${QUERY_FOR_GO_ENTERPRISE}`,
    blog: `https://www.emqx.com/${lang}/blog/category/emqx?${QUERY_FOR_HELP}`,
    dashboard: `https://www.emqx.io/docs/${lang}/v5.0/dashboard/introduction.html?${QUERY_FOR_HELP}`,
    emqxGettingStarted: `https://www.emqx.io/docs/${lang}/v5.0/getting-started.html?${QUERY_FOR_HELP}`,
    accessControl: `https://www.emqx.io/docs/${lang}/v5.0/dashboard/authn.html?${QUERY_FOR_HELP}`,
    dataIntegration: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/introduction.html?${QUERY_FOR_HELP}`,
    mqttStudy: `https://www.emqx.com/${lang}/mqtt?${QUERY_FOR_HELP}`,
    mqttV5: `https://www.emqx.com/${lang}/mqtt/mqtt5?${QUERY_FOR_HELP}`,
    mqttClient:
      lang === 'en'
        ? `https://www.emqx.io/mqtt-client?${QUERY_FOR_HELP}`
        : `https://www.emqx.io/zh/mqtt-client?${QUERY_FOR_HELP}`,
    githubHome: 'https://github.com/emqx',
    twitterHome: 'https://twitter.com/EMQTech',
    youtubeHome: 'https://www.youtube.com/channel/UC5FjR77ErAxvZENEWzQaO5Q',
    linkedInHome: 'https://www.linkedin.com/company/emqtech',
    emqxEnterprise: `https://www.emqx.com/${lang}/products/emqx?${QUERY_FOR_HELP}`,
    cloudHome: `https://www.emqx.com/${lang}/cloud?${QUERY_FOR_HELP}`,
    resetPassword: `https://www.emqx.io/docs/${lang}/v5.0/admin/cli.html#admins`,
  }
}
