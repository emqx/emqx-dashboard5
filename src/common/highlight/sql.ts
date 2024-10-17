import sql from 'highlight.js/lib/languages/sql'

export default (hljs: any) => {
  const ret = sql(hljs)
  if (ret?.keywords?.keyword && Array.isArray(ret.keywords.keyword)) {
    ret.keywords.keyword.push('do|0', 'foreach', 'incase')
  }
  if (ret?.contains?.[0]?.keywords?.keyword && Array.isArray(ret.contains[0].keywords.keyword)) {
    ret.contains[0].keywords.keyword.push('do', 'foreach', 'incase')
  }
  return ret
}
