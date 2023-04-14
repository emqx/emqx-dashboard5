type DocKey =
  | 'cloud'
  | 'sqlGrammar'
  | 'documentation'
  | 'forum'
  | 'gitHub'
  | 'ruleEvent'
  | 'bridgeAsFrom'
  | 'ruleEventMsgPub'
  | 'upgrade'
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
  | 'dataBridge'
  | 'ruleEngine'
  | 'resetPassword'
  | 'applyLicense'
  | 'moreAboutMqtt'
  | 'contactUs'
  | 'feedback'
  | 'learnConfig'
  | 'restAPI'
  | 'faq'

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
const QUERY_FOR_GO_UPGRADE = createQueryStr({
  utm_campaign: 'dashboard-header-to-upgrade',
})
const QUERY_FOR_LICENSE = createQueryStr({ version: 5, utm_campaign: 'dashboard-to-license' })

export default (lang: string): DocMap => {
  const accountsLink = lang === 'zh' ? 'accounts-zh.emqx.com' : 'accounts.emqx.com'
  return {
    sqlGrammar: `https://docs.emqx.com/${lang}/enterprise/v5.0/data-integration/rule-sql-syntax.html`,
    cloud: `https://${accountsLink}/signup?${QUERY_FOR_GO_CLOUD}`,
    // TODO: version
    documentation: `https://docs.emqx.com/${lang}/enterprise/v5.0/?${QUERY_FOR_HELP}`,
    forum: lang === 'en' ? `https://www.emqx.io/forum/` : `https://askemq.com/`,
    gitHub: `https://github.com/emqx/emqx`,
    ruleEvent: `https://docs.emqx.com/${lang}/enterprise/v5.0/data-integration/rule-sql-events-and-fields.html`,
    bridgeAsFrom: `https://docs.emqx.com/${lang}/enterprise/v5.0/data-integration/rule-sql-events-and-fields.html#${
      lang === 'zh' ? '数据桥接' : 'data-bridges'
    }`,
    ruleEventMsgPub: `https://docs.emqx.com/${lang}/enterprise/v5.0/data-integration/rule-sql-events-and-fields.html#${
      lang === 'zh' ? 'mqtt-消息' : 'mqtt-message'
    }`,
    upgrade: `https://www.emqx.com/${lang}/lp/upgrade-emqx/enterprise?${QUERY_FOR_GO_UPGRADE}`,
    blog: `https://www.emqx.com/${lang}/blog/category/emqx?${QUERY_FOR_HELP}`,
    dashboard: `https://docs.emqx.com/${lang}/enterprise/v5.0/dashboard/introduction.html?${QUERY_FOR_HELP}`,
    emqxGettingStarted: `https://docs.emqx.com/${lang}/enterprise/v5.0/getting-started/getting-started.html?${QUERY_FOR_HELP}`,
    accessControl: `https://docs.emqx.com/${lang}/enterprise/v5.0/dashboard/acloverview.html?${QUERY_FOR_HELP}`,
    dataBridge: `https://docs.emqx.com/${lang}/enterprise/v5.0/data-integration/data-bridges.html?${QUERY_FOR_HELP}`,
    ruleEngine: `https://docs.emqx.com/${lang}/enterprise/v5.0/data-integration/rules.html?${QUERY_FOR_HELP}`,
    mqttStudy: `https://www.emqx.com/${lang}/mqtt?${QUERY_FOR_HELP}`,
    mqttV5: `https://www.emqx.com/${lang}/mqtt/mqtt5?${QUERY_FOR_HELP}`,
    mqttClient:
      lang === 'zh'
        ? `https://www.emqx.io/zh/mqtt-client?${QUERY_FOR_HELP}`
        : `https://www.emqx.io/mqtt-client?${QUERY_FOR_HELP}`,
    githubHome: 'https://github.com/emqx',
    twitterHome: 'https://twitter.com/EMQTech',
    youtubeHome: 'https://www.youtube.com/channel/UC5FjR77ErAxvZENEWzQaO5Q',
    linkedInHome: 'https://www.linkedin.com/company/emqtech',
    emqxEnterprise: `https://www.emqx.com/${lang}/products/emqx?${QUERY_FOR_HELP}`,
    cloudHome: `https://www.emqx.com/${lang}/cloud?${QUERY_FOR_HELP}`,
    resetPassword: `https://docs.emqx.com/${lang}/enterprise/v5.0/admin/cli.html#admins`,
    applyLicense: `https://www.emqx.com/${lang}/apply-licenses/emqx?${QUERY_FOR_LICENSE}`,
    moreAboutMqtt: `https://www.emqx.com/${lang}/blog/category/mqtt?${QUERY_FOR_HELP}`,
    contactUs: `https://www.emqx.com/${lang}/contact?${QUERY_FOR_HELP}`,
    feedback: lang === 'zh' ? 'https://askemq.com/c/emqx/5' : 'https://www.emqx.io/forum/c/emqx/5',
    learnConfig: `https://docs.emqx.com/${lang}/enterprise/v5.0/configuration/configuration.html?${QUERY_FOR_HELP}`,
    restAPI: `https://docs.emqx.com/${lang}/enterprise/v5.0/admin/api.html?${QUERY_FOR_HELP}`,
    faq: `https://docs.emqx.com/${lang}/enterprise/v5.0/faq/faq.html?${QUERY_FOR_HELP}`,
  }
}
