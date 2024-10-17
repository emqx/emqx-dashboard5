import bash from 'highlight.js/lib/languages/bash'
import { isString } from 'lodash'

export default (hljs: any) => {
  const ret = bash?.(hljs)
  if (ret?.keywords?.built_in && isString(ret.keywords.built_in)) {
    ret.keywords.built_in = ret.keywords.built_in.replace(
      'read readarray source type typeset ulimit unalias ',
      ($0: string) => `${$0}docker tar wget `,
    )
  }

  return ret
}
