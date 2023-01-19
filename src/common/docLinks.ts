type DocKey =
  | 'cloud'
  | 'sqlGrammar'
  | 'documentation'
  | 'forum'
  | 'gitHub'
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
const QUERY_FOR_GO_ENTERPRISE = createQueryStr({
  utm_campaign: 'dashboard-header-upgrade-to-enterprise',
})

export default (lang: string): DocMap => {
  const accountsLink = lang === 'zh' ? 'accounts-zh.emqx.com' : 'accounts.emqx.com'
  return {
    sqlGrammar: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/rule-sql-syntax.html`,
    cloud: `https://${accountsLink}/signup?${QUERY_FOR_GO_CLOUD}`,
    // TODO: version
    documentation: `https://www.emqx.io/docs/${lang}/v5.0/?${QUERY_FOR_HELP}`,
    forum: lang === 'en' ? `https://www.emqx.io/forum/` : `https://askemq.com/`,
    gitHub: `https://github.com/emqx/emqx`,
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
