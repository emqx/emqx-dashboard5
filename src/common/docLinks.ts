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
  | 'datadogIntegration'
  | 'applyLicense'
  | 'influxDbBatchSettings'
  | 'iotDbBatchSettings'
  | 'tdengineBatchSettings'

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

const createBatchSettingHash = (lang: string) => (lang === 'zh' ? '批量设置' : 'batch-setting')

const QUERY_FOR_HELP = createQueryStr({
  utm_campaign: 'emqx-enterprise-dashboard-header-to-contact',
  utm_source: 'emqx-enterprise-dashboard',
  utm_medium: 'referral',
})
const QUERY_FOR_GO_CLOUD = createQueryStr({
  utm_campaign: 'dashboard-to-cloud',
  // TODO: confirm this link
  continue: 'https%3A%2F%2Fcloud-intl.emqx.com%2Fconsole%2F',
})
const QUERY_FOR_GO_UPGRADE = createQueryStr({
  utm_campaign: 'dashboard-header-to-upgrade',
})
const QUERY_FOR_LICENSE = createQueryStr({ version: 5, utm_campaign: 'dashboard-to-license' })

const createDocLinks = (lang: string): DocMap => {
  const accountsLink = lang === 'zh' ? 'accounts-zh.emqx.com' : 'accounts.emqx.com'
  return {
    sqlGrammar: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/data-integration/rule-sql-syntax.html`,
    cloud: `https://${accountsLink}/signup?${QUERY_FOR_GO_CLOUD}`,
    // TODO: version
    documentation: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/?${QUERY_FOR_HELP}`,
    forum: lang === 'en' ? `https://www.emqx.io/forum/` : `https://askemq.com/`,
    gitHub: `https://github.com/emqx/emqx`,
    upgrade: `https://www.emqx.com/${lang}/lp/upgrade-emqx/enterprise?${QUERY_FOR_GO_UPGRADE}`,
    blog: `https://www.emqx.com/${lang}/blog/category/emqx?${QUERY_FOR_HELP}`,
    dashboard: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/dashboard/introduction.html?${QUERY_FOR_HELP}`,
    emqxGettingStarted: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/getting-started/getting-started.html?${QUERY_FOR_HELP}`,
    accessControl: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/dashboard/acloverview.html?${QUERY_FOR_HELP}`,
    dataBridge: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/data-integration/data-bridges.html?${QUERY_FOR_HELP}`,
    ruleEngine: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/data-integration/rules.html?${QUERY_FOR_HELP}`,
    mqttStudy: `https://www.emqx.com/${lang}/mqtt?${QUERY_FOR_HELP}`,
    mqttV5: `https://www.emqx.com/${lang}/blog/introduction-to-mqtt-5?${QUERY_FOR_HELP}`,
    mqttClient: `https://www.emqx.com/${lang}/mqtt-client-sdk?${QUERY_FOR_HELP}`,
    githubHome: 'https://github.com/emqx',
    xHome: 'https://x.com/EMQTech',
    youtubeHome: 'https://www.youtube.com/channel/UC5FjR77ErAxvZENEWzQaO5Q',
    linkedInHome: 'https://www.linkedin.com/company/emqtech',
    emqxEnterprise: `https://www.emqx.com/${lang}/products/emqx?${QUERY_FOR_HELP}`,
    cloudHome: `https://www.emqx.com/${lang}/cloud?${QUERY_FOR_HELP}`,
    resetPassword: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/admin/cli.html#admins`,
    applyLicense: `https://www.emqx.com/${lang}/apply-licenses/emqx?${QUERY_FOR_LICENSE}`,
    moreAboutMqtt: `https://www.emqx.com/${lang}/blog/category/mqtt?${QUERY_FOR_HELP}`,
    contactUs: `https://www.emqx.com/${lang}/contact?${QUERY_FOR_HELP}`,
    datadogIntegration: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/observability/datadog.html`,
    feedback: lang === 'zh' ? 'https://askemq.com/c/emqx/5' : 'https://www.emqx.io/forum/c/emqx/5',
    learnConfig: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/configuration/configuration.html?${QUERY_FOR_HELP}`,
    restAPI: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/admin/api.html?${QUERY_FOR_HELP}`,
    faq: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/faq/faq.html?${QUERY_FOR_HELP}`,
    influxDbBatchSettings: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/data-integration/data-bridge-influxdb.html#${createBatchSettingHash(
      lang,
    )}`,
    iotDbBatchSettings: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/data-integration/data-bridge-iotdb.html#${createBatchSettingHash(
      lang,
    )}`,
    tdengineBatchSettings: `https://docs.emqx.com/${lang}/enterprise/${EMQX_VERSION}/data-integration/data-bridge-tdengine.html#${createBatchSettingHash(
      lang,
    )}`,
  }
}

export default createDocLinks
