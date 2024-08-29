import { EMQX_VERSION } from './constants'

type DocKey =
  | 'cloud'
  | 'sqlGrammar'
  | 'documentation'
  | 'forum'
  | 'gitHub'
  | 'upgrade'
  | 'dashboard'
  | 'mqttStudy'
  | 'mqttV5'
  | 'mqttClient'
  | 'githubHome'
  | 'xHome'
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
  continue: 'https%3A%2F%2Fcloud-intl.emqx.com%2Fconsole%2F',
})
const QUERY_FOR_GO_UPGRADE = createQueryStr({
  utm_campaign: 'dashboard-header-to-upgrade',
})

const createDocLinks = (lang: string): DocMap => {
  const accountsLink = lang === 'zh' ? 'accounts-zh.emqx.com' : 'accounts.emqx.com'
  return {
    sqlGrammar: `https://docs.emqx.com/${lang}/emqx/${EMQX_VERSION}/data-integration/rule-sql-syntax.html`,
    cloud: `https://${accountsLink}/signup?${QUERY_FOR_GO_CLOUD}`,
    documentation: `https://docs.emqx.com/${lang}/emqx/${EMQX_VERSION}/?${QUERY_FOR_HELP}`,
    forum: lang === 'en' ? `https://forum.emqx.io/` : `https://askemq.com/`,
    gitHub: `https://github.com/emqx/emqx`,
    upgrade: `https://www.emqx.com/${lang}/lp/upgrade-emqx/enterprise?${QUERY_FOR_GO_UPGRADE}`,
    blog: `https://www.emqx.com/${lang}/blog/category/emqx?${QUERY_FOR_HELP}`,
    dashboard: `https://docs.emqx.com/${lang}/emqx/${EMQX_VERSION}/dashboard/introduction.html?${QUERY_FOR_HELP}`,
    emqxGettingStarted: `https://docs.emqx.com/${lang}/emqx/${EMQX_VERSION}/getting-started/getting-started.html?${QUERY_FOR_HELP}`,
    accessControl: `https://docs.emqx.com/${lang}/emqx/${EMQX_VERSION}/dashboard/acloverview.html?${QUERY_FOR_HELP}`,
    dataBridge: `https://docs.emqx.com/${lang}/emqx/${EMQX_VERSION}/data-integration/data-bridges.html?${QUERY_FOR_HELP}`,
    ruleEngine: `https://docs.emqx.com/${lang}/emqx/${EMQX_VERSION}/data-integration/rules.html?${QUERY_FOR_HELP}`,
    mqttStudy: `https://www.emqx.com/${lang}/mqtt?${QUERY_FOR_HELP}`,
    mqttV5: `https://www.emqx.com/${lang}/blog/introduction-to-mqtt-5?${QUERY_FOR_HELP}`,
    mqttClient: `https://www.emqx.com/${lang}/mqtt-client-sdk?${QUERY_FOR_HELP}`,
    githubHome: 'https://github.com/emqx',
    xHome: 'https://x.com/EMQTech',
    youtubeHome: 'https://www.youtube.com/channel/UC5FjR77ErAxvZENEWzQaO5Q',
    linkedInHome: 'https://www.linkedin.com/company/emqtech',
    emqxEnterprise: `https://www.emqx.com/${lang}/products/emqx?${QUERY_FOR_HELP}`,
    cloudHome: `https://www.emqx.com/${lang}/cloud?${QUERY_FOR_HELP}`,
    resetPassword: `https://docs.emqx.com/${lang}/emqx/${EMQX_VERSION}/admin/cli.html#admins`,
    moreAboutMqtt: `https://www.emqx.com/${lang}/blog/category/mqtt?${QUERY_FOR_HELP}`,
    contactUs: `https://www.emqx.com/${lang}/contact?${QUERY_FOR_HELP}`,
    feedback: lang === 'zh' ? 'https://askemq.com/c/emqx/5' : 'https://forum.emqx.io/c/emqx/5',
    learnConfig: `https://docs.emqx.com/${lang}/emqx/${EMQX_VERSION}/configuration/configuration.html?${QUERY_FOR_HELP}`,
    restAPI: `https://docs.emqx.com/${lang}/emqx/${EMQX_VERSION}/admin/api.html?${QUERY_FOR_HELP}`,
    faq: `https://docs.emqx.com/${lang}/emqx/${EMQX_VERSION}/faq/faq.html?${QUERY_FOR_HELP}`,
  }
}

export default createDocLinks
