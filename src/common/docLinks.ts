type DocKey = 'cloud' | 'applyLicense' | 'home'

export type DocMap = Record<DocKey, string>

export default (lang: string): DocMap => {
  return {
    home: lang === 'en' ? 'https://www.emqx.io/' : `https://www.emqx.io/${lang}`,
    cloud: `https://www.emqx.com/${lang}/cloud?utm_source=emqx-dashboard&utm_medium=referral&utm_campaign=dashboard-to-cloud`,
    applyLicense: `https://www.emqx.com/${lang}/apply-licenses/emqx`,
  }
}
