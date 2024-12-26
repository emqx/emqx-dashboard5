import RuleFunc from './RuleFunc.json'
import RuleField from './RuleField.json'

const funcList = RuleFunc.reduce((arr: Array<string>, { list }): Array<string> => {
  list?.forEach(({ name }: { name: string }) => arr.push(name))
  return arr
}, [])

export default {
  syntaxKeys: [
    'SELECT',
    'FROM',
    'WHERE',
    'FOREACH',
    'DO',
    'INCASE',
    'CASE',
    'WHEN',
    'ELSE',
    'THEN',
    'END',
    'as',
  ],
  /**
   * Only the fields that are not provided by columns in `/rule_events` are included here.
   */
  fieldsCanUse: RuleField,
  builtInSQLFuncs: funcList,
  jqFunc: ['jq'],
}
