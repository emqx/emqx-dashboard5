type DocKey = 'cloud' | 'applyLicense' | 'home'

export type DocMap = Record<DocKey, string>

export default (lang: string): DocMap => {
  return {
    home: lang === 'en' ? 'https://www.emqx.io/' : `https://www.emqx.io/${lang}`,
    cloud: `https://www.emqx.com/${lang}/cloud`,
    applyLicense: `https://www.emqx.com/${lang}/apply-licenses/emqx`,
  }
}
