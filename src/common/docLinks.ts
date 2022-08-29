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

export type DocMap = Record<DocKey, string>

export default (lang: string): DocMap => {
  return {
    sqlGrammar: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/rule-sql-grammar-and-examples.html`,
    sqlActionRepub: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/rule-actions.html#%E6%B6%88%E6%81%AF%E9%87%8D%E5%8F%91%E5%B8%83-%E5%8A%A8%E4%BD%9C`,
    sqlTest: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/rule-get-started.html#%E6%B5%8B%E8%AF%95-sql-%E8%AF%AD%E5%8F%A5`,
    bridgePayload: `https://www.emqx.io/docs/${lang}/v5.0/data-integration/data-bridge-webhook.html#%E7%A4%BA%E4%BE%8B-%E4%BD%BF%E7%94%A8%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E5%88%9B%E5%BB%BA-webhook`,
    home: lang === 'en' ? 'https://www.emqx.io/' : `https://www.emqx.io/${lang}`,
    cloud: `https://www.emqx.com/${lang}/signup?utm_source=emqx-dashboard&utm_medium=referral&utm_campaign=dashboard-to-cloud&continue=https%3A%2F%2Fcloud-intl.emqx.com%2Fconsole%2F`,
    // TODO: version
    documentation: `https://www.emqx.io/docs/${lang}/v5.0/`,
    forum: lang === 'en' ? `https://www.emqx.io/forum/` : `https://askemq.com/`,
    discord: `https://discord.gg/xYGf3fQnES`,
    gitHub: `https://github.com/emqx/emqx`,
    contact: `https://www.emqx.com/${lang}/contact?product=emqx&utm_source=emqx-dashboard&utm_medium=referral&utm_campaign=dashboard-to-contact-us`,
  }
}
