export default {
  selectDesc: {
    zh: '对数据进行变换，并选择出感兴趣的字段',
    en: 'Select fields in the output',
  },
  fromDesc: {
    zh: '将规则挂载到某个主题上',
    en: 'Mounts rules to a topic',
  },
  whereDesc: {
    zh: '对 SELECT 选择出来的某个字段施加条件过滤',
    en: 'Filter messages based on conditions',
  },
  foreachDesc: {
    zh: '选择需要做 FOREACH 操作的字段，注意选择出的字段必须为数组类型',
    en: 'Select the field that needs to perform FOREACH operation. Note that the selected field must be an array type',
  },
  doDesc: {
    zh: '对 FOREACH 选择出来的数组中的每个元素进行变换，并选择出感兴趣的字段',
    en: 'Transform each element in the array selected by FOREACH and select the field of interest',
  },
  incaseDesc: {
    zh: '对 DO 选择出来的某个字段施加条件过滤',
    en: 'Apply conditional filtering to a field selected by DO',
  },
  caseDesc: {
    zh: '在查询结果中根据特定条件返回不同的值',
    en: 'Return different values based on specific conditions in the query results',
  },
  whenDesc: {
    zh: '用于控制条件语句的执行流程，一般接一个条件表达式，用来判断对应的 CASE 语句中的某个分支是否需要执行',
    en: 'Used to control the execution flow of conditional statements, usually followed by a condition expression to determine whether a certain branch in the corresponding CASE statement needs to be executed.',
  },
  elseDesc: {
    zh: '通常与 CASE 表达式一起使用，指定当所有条件都不满足时应返回的默认值',
    en: 'Usually used with CASE expression, specifying the default value to be returned when none of the conditions are met',
  },
  thenDesc: {
    zh: '通常与 CASE 表达式一起使用，指定了当条件满足时要返回的值',
    en: 'Usually used with CASE expression, specifies the value to be returned when the condition is met.',
  },
  endDesc: {
    zh: '指示某个块的结束',
    en: 'Indicates the end of a block',
  },
  asDesc: {
    zh: '为选择结果指定别名',
    en: 'Specify an alias for the selects result',
  },
  parameter: {
    zh: '参数',
    en: 'Parameter',
  },
  returned: {
    zh: '返回值',
    en: 'Returned value',
  },
  /* FUNC */
  // TODO: Optimize the display of parameters.
  absDesc: {
    zh: '绝对值',
    en: 'Absolute value',
  },
  absParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  absReturns: {
    zh: '绝对值',
    en: 'absolute value',
  },
  cosDesc: {
    zh: '余弦',
    en: 'Cosine',
  },
  cosParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  cosReturns: {
    zh: '余弦值',
    en: 'Cosine value',
  },
  coshDesc: {
    zh: '双曲余弦',
    en: 'Hyperbolic cosine',
  },
  coshParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  coshReturns: {
    zh: '双曲余弦值',
    en: 'Hyperbolic cosine value',
  },
  acosDesc: {
    zh: '反余弦',
    en: 'Inverse cosine',
  },
  acosParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  acosReturns: {
    zh: '反余弦值',
    en: 'Inverse cosine value',
  },
  acoshDesc: {
    zh: '反双曲余弦',
    en: 'Inverse hyperbolic cosine',
  },
  acoshParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  acoshReturns: {
    zh: '反双曲余弦值',
    en: 'Inverse hyperbolic cosine value',
  },
  sinDesc: {
    zh: '正弦',
    en: 'Sine',
  },
  sinParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  sinReturns: {
    zh: '正弦值',
    en: 'Sine value',
  },
  sinhDesc: {
    zh: '双曲正弦',
    en: 'Hyperbolic sine',
  },
  sinhParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  sinhReturns: {
    zh: '双曲正弦值',
    en: 'Hyperbolic sine value',
  },
  asinDesc: {
    zh: '反正弦',
    en: 'Arcsine',
  },
  asinParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  asinReturns: {
    zh: '反正弦值',
    en: 'Arcsine value',
  },
  asinhDesc: {
    zh: '反双曲正弦',
    en: 'inverse hyperbolic sine',
  },
  asinhParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  asinhReturns: {
    zh: '反双曲正弦值',
    en: 'inverse hyperbolic sine value',
  },
  tanDesc: {
    zh: '正切',
    en: 'tangent',
  },
  tanParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  tanReturns: {
    zh: '正切值',
    en: 'tangent value',
  },
  tanhDesc: {
    zh: '双曲正切',
    en: 'Hyperbolic tangent',
  },
  tanhParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  tanhReturns: {
    zh: '双曲正切值',
    en: 'Hyperbolic tangent value',
  },
  atanDesc: {
    zh: '反正切',
    en: 'Arc tangent',
  },
  atanParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  atanReturns: {
    zh: '反正切值',
    en: 'Arc tangent value',
  },
  atanhDesc: {
    zh: '反双曲正切',
    en: 'Inverse hyperbolic tangent',
  },
  atanhParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  atanhReturns: {
    zh: '反双曲正切值',
    en: 'Inverse hyperbolic tangent value',
  },
  ceilDesc: {
    zh: '上取整',
    en: 'Round up',
  },
  ceilParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  ceilReturns: {
    zh: '整数值',
    en: 'Integer value',
  },
  floorDesc: {
    zh: '下取整',
    en: 'Round down',
  },
  floorParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  floorReturns: {
    zh: '整数值',
    en: 'Integer value',
  },
  roundDesc: {
    zh: '四舍五入',
    en: 'rounding',
  },
  roundParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  roundReturns: {
    zh: '整数值',
    en: 'Integer value',
  },
  expDesc: {
    zh: '幂运算',
    en: 'Exponentiation',
  },
  expParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  expReturns: {
    zh: 'e 的 x 次幂',
    en: 'X power of e',
  },
  powerDesc: {
    zh: '指数运算',
    en: 'Exponential operation',
  },
  powerParams: {
    zh: '1. 左操作数 x <br />2. 右操作数 y',
    en: '1. Left operand x <br />2. Right operand y',
  },
  powerReturns: {
    zh: 'x 的 y 次方',
    en: 'Y power of X',
  },
  sqrtDesc: {
    zh: '平方根运算',
    en: 'Square root operation',
  },
  sqrtParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  sqrtReturns: {
    zh: '平方根',
    en: 'Square root',
  },
  fmodDesc: {
    zh: '浮点数取模函数',
    en: 'Floating point modulus function',
  },
  fmodParams: {
    zh: '1. 左操作数 <br />2. 右操作数',
    en: '1. left Operand <br />2.right Operand',
  },
  fmodReturns: {
    zh: '模',
    en: 'module',
  },
  logDesc: {
    zh: '以 e 为底对数',
    en: 'Logarithm to e',
  },
  logParams: {
    zh: '被操作数',
    en: 'Operand',
  },
  logReturns: {
    zh: '值',
    en: 'value',
  },
  log10Desc: {
    zh: '以 10 为底对数',
    en: 'Logarithm to 10',
  },
  log10Params: {
    zh: '被操作数',
    en: 'Operand',
  },
  log10Returns: {
    zh: '值',
    en: 'value',
  },
  log2Desc: {
    zh: '以 2 为底对数',
    en: 'Logarithm to 2',
  },
  log2Params: {
    zh: '被操作数',
    en: 'Operand',
  },
  log2Returns: {
    zh: '值',
    en: 'value',
  },
  isNullDesc: {
    zh: '判断变量是否为空值',
    en: 'Judge if the variable is null',
  },
  isNullParams: {
    zh: '数据',
    en: 'Data',
  },
  isNullReturns: {
    zh: 'Boolean 类型的数据。如果为空值(undefined) 则返回 true，否则返回 false',
    en: 'Boolean data.if it is empty (undefined), return true, otherwise return false',
  },
  isNotNullDesc: {
    zh: '判断变量是否为非空值',
    en: 'Judge if the variable is not null',
  },
  isNotNullParams: {
    zh: '数据',
    en: 'Data',
  },
  isNotNullReturns: {
    zh: 'Boolean 类型的数据。如果为空值(undefined) 则返回 false，否则返回 true',
    en: 'Boolean data.if it is empty (undefined), return false, otherwise return true',
  },
  isStrDesc: {
    zh: '判断变量是否为 String 类型',
    en: 'Judge whether the variable is String type',
  },
  isStrParams: {
    zh: '数据',
    en: 'Data',
  },
  isStrReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
  },
  isBoolDesc: {
    zh: '判断变量是否为 Boolean 类型',
    en: 'Judge if the variable is Boolean type',
  },
  isBoolParams: {
    zh: '数据',
    en: 'Data',
  },
  isBoolReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
  },
  isIntDesc: {
    zh: '判断变量是否为 Integer 类型',
    en: 'Judge whether the variable is Integer type',
  },
  isIntParams: {
    zh: '数据',
    en: 'Data',
  },
  isIntReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
  },
  isFloatDesc: {
    zh: '判断变量是否为 Float 类型',
    en: 'Judge whether the variable is Float type',
  },
  isFloatParams: {
    zh: '数据',
    en: 'Data',
  },
  isFloatReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
  },
  isNumDesc: {
    zh: '判断变量是否为数字类型，包括 Integer 和 Float 类型',
    en: 'Judge whether the variable is a numeric type, including Integer and Float types',
  },
  isNumParams: {
    zh: '数据',
    en: 'Data',
  },
  isNumReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
  },
  isMapDesc: {
    zh: '判断变量是否为 Map 类型',
    en: 'Judge whether the variable is Map type',
  },
  isMapParams: {
    zh: '数据',
    en: 'Data',
  },
  isMapReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
  },
  isArrayDesc: {
    zh: '判断变量是否为 Array 类型',
    en: 'Judge whether the variable is Array type',
  },
  isArrayParams: {
    zh: '数据',
    en: 'Data',
  },
  isArrayReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
  },
  strDesc: {
    zh: '将数据转换为 String 类型',
    en: 'Convert data to String type',
  },
  strParams: {
    zh: '数据',
    en: 'Data',
  },
  strReturns: {
    zh: 'String 类型的数据。无法转换将会导致 SQL 匹配失败',
    en: 'Data of type String. Failure to convert will cause SQL matching to fail',
  },
  strUtf8Desc: {
    zh: '将数据转换为 UTF-8 String 类型',
    en: 'Convert data to UTF-8 String type',
  },
  strUtf8Params: {
    zh: '数据',
    en: 'Data',
  },
  strUtf8Returns: {
    zh: 'UTF-8 String 类型的数据。无法转换将会导致 SQL 匹配失败',
    en: 'UTF-8 String type data. Failure to convert will cause SQL matching to fail',
  },
  boolDesc: {
    zh: '将数据转换为 Boolean 类型',
    en: 'Convert data to Boolean type',
  },
  boolParams: {
    zh: '数据',
    en: 'Data',
  },
  boolReturns: {
    zh: 'Boolean 类型的数据。无法转换将会导致 SQL 匹配失败',
    en: 'Boolean data. Failure to convert will cause SQL matching to fail',
  },
  intDesc: {
    zh: '将数据转换为整数类型',
    en: 'Convert data to integer type',
  },
  intParams: {
    zh: '数据',
    en: 'Data',
  },
  intReturns: {
    zh: '整数类型的数据。无法转换将会导致 SQL 匹配失败',
    en: 'Integer type data. Failure to convert will cause SQL matching to fail',
  },
  floatDesc: {
    zh: '将数据转换为浮点型类型',
    en: 'Convert data to floating type',
  },
  floatParams: {
    zh: '数据',
    en: 'Data',
  },
  floatReturns: {
    zh: '浮点型类型的数据。无法转换将会导致 SQL 匹配失败',
    en: 'Floating type data. Failure to convert will cause SQL matching to fail',
  },
  float2StrDesc: {
    zh: '将浮点型数字以指定精度转换为字符串',
    en: 'Convert a float to string using the given precision',
  },
  float2StrParams: {
    zh: '1. 浮点型数字 2. 精度',
    en: '1. Float Number 2. Precision',
  },
  float2StrReturns: {
    zh: '字符串',
    en: 'String',
  },
  mapDesc: {
    zh: '将数据转换为 Map 类型',
    en: 'Convert data to Map type',
  },
  mapParams: {
    zh: '数据',
    en: 'Data',
  },
  mapReturns: {
    zh: 'Map 类型的数据。无法转换将会导致 SQL 匹配失败',
    en: 'Map type data. Failure to convert will cause SQL matching to fail',
  },
  lowerDesc: {
    zh: '转为小写',
    en: 'convert to lowercase',
  },
  lowerParams: {
    zh: '原字符串',
    en: 'Input string',
  },
  lowerReturns: {
    zh: '小写字符串',
    en: 'Lowercase string',
  },
  upperDesc: {
    zh: '转为大写',
    en: 'convert to uppercase',
  },
  upperParams: {
    zh: '原字符串',
    en: 'Input string',
  },
  upperReturns: {
    zh: '大写字符串',
    en: 'uppercase string',
  },
  trimDesc: {
    zh: '去掉左右空格',
    en: 'Remove left and right space',
  },
  trimParams: {
    zh: '原字符串',
    en: 'Input string',
  },
  trimReturns: {
    zh: '去掉空格后的字符串',
    en: 'output string',
  },
  ltrimDesc: {
    zh: '去掉左空格',
    en: 'Remove the left space',
  },
  ltrimParams: {
    zh: '原字符串',
    en: 'Input string',
  },
  ltrimReturns: {
    zh: '去掉空格后的字符串',
    en: 'output string',
  },
  rtrimDesc: {
    zh: '去掉右空格',
    en: 'Remove the right space',
  },
  rtrimParams: {
    zh: '原字符串',
    en: 'Input string',
  },
  rtrimReturns: {
    zh: '去掉空格后的字符串',
    en: 'output string',
  },
  reverseDesc: {
    zh: '字符串反转',
    en: 'String inversion',
  },
  reverseParams: {
    zh: '原字符串',
    en: 'Input string',
  },
  reverseReturns: {
    zh: '翻转后的字符串',
    en: 'Output string',
  },
  strlenDesc: {
    zh: '取字符串长度',
    en: 'String length',
  },
  strlenParams: {
    zh: '原字符串',
    en: 'Input string',
  },
  strlenReturns: {
    zh: '整数值，字符长度',
    en: 'Integer value',
  },
  substrDesc: {
    zh: '取字符的子串',
    en: 'Take a substring of characters',
  },
  substrParams: {
    zh: `1. 原字符串：需要提取子串的原始字符串<br />2. 起始位置：子串的起始位置，注意下标从 0 开始计数。<br />
3. <i>可选</i>要取出的子串长度`,
    en: `1. Original string: the original string from which to extract a substring<br />2. Starting position: the starting position of the substring, note that indexing starts at 0<br />
3. <i>Optional</i>Length of the substring to be extracted`,
  },
  substrReturns: {
    zh: '子串',
    en: 'substring',
  },
  splitDesc: {
    zh: '将一个字符串分割成一个字符串数组',
    en: 'Split a string into an array of strings',
  },
  splitParams: {
    zh: `1. 原字符串 <br />2. 分割符子串 <br />
3. <i>可选</i>分割的规则，默认匹配字符串中所有分隔符
<ul>
  <li><code>leading</code>：只查找左边第一个分隔符</li>
  <li><code>trailing</code>：只查找右边第一个分隔符</li>
</ul>`,
    en: `1. Original string <br />2. Separator substring <br />
3. <i>Optional</i> Rule for splitting, default to matching all separators in the string
<ul>
<li><code>leading</code>: Only search for the first separator on the left side</li>
<li><code>trailing</code>: Only search for the first separator on the right side</li>
</ul>`,
  },
  splitReturns: {
    zh: '分割后的字符串数组',
    en: 'Split string array',
  },
  concatDesc: {
    zh: '字符串拼接',
    en: 'String concatenation',
  },
  concatParams: {
    zh: '1. 左字符串 <br />2. 右符子串',
    en: '1. Left string <br />2. Right substring',
  },
  concatReturns: {
    zh: '拼接后的字符串',
    en: 'Concatenated string',
  },
  tokensDesc: {
    zh: '字符串分解(按照指定字符串和换行符分解)',
    en: 'String decomposition (decomposed according to specified strings and line breaks)',
  },
  tokensParams: {
    zh: `1. 原字符串</br>2. 分隔符</br>
3. <i>可选</i>是否根据换行符进行分解`,
    en: `1. Original string</br>2. Separator</br>
3. <i>Optional</i>Whether to decompose according to the line break`,
  },
  tokensReturns: {
    zh: '分解后的字符串数组',
    en: 'Decomposed string array',
  },
  sprintfDesc: {
    zh: '字符串格式化，格式字符串的用法详见 <a href="https://erlang.org/doc/man/io.html#fwrite-1" target="_blank">https://erlang.org/doc/man/io.html#fwrite-1</a> 里的 Format 部分',
    en: 'String formatting, see the Format section in <a href="https://erlang.org/doc/man/io.html#fwrite-1" target="_blank">https://erlang.org/doc/man/io.html#fwrite-1</a> for usage',
  },
  sprintfParams: {
    zh: '1. 格式字符串 <br />2,3,4... 参数列表。参数个数不定',
    en: '1. Format string <br />2,3,4... Parameter list. The number of parameters may vary',
  },
  sprintfReturns: {
    zh: '格式化后的字符串',
    en: 'Formatted string',
  },
  padDesc: {
    zh: '将指定字符串填充到指定长度',
    en: 'Fill the specified string to the specified length.',
  },
  padParams: {
    zh: `1. 原字符串 <br />2. 字符总长度 <br />
3. <i>可选</i>填充的位置，<code>trailing</code>，<code>both</code> 或 <code>leading</code>，默认为 <code>trailing</code><br />
4. <i>可选</i>指定用于补足的字符，默认为空格`,
    en: `1. Original string <br />2. Total length of characters <br />
3. <i>Optional</i>Filling position, <code>trailing</code>, <code>both</code> or <code>leading</code>, default is <code>trailing</code><br />
4. <i>Optional</i>Specify the character for filling, default to space`,
  },
  padReturns: {
    zh: '补足后的字符串',
    en: 'Padded string',
  },
  replaceDesc: {
    zh: '在字符串中搜索并替换指定的文本',
    en: 'Search and replace specified text in a string',
  },
  replaceParams: {
    zh: `1. 原字符串 <br />2. 要被替换的字符串 <br />3. 指定用于替换的字符串 <br />
2. <i>可选</i>替换的规则，默认为 <code>all</code>
<ul>
  <li><code>all</code>：查找所有匹配子串替换</li>
  <li><code>trailing</code>：从尾部查找第一个匹配子串替换</li>
  <li><code>leading</code>：从头部查找第一个匹配子串替换</li>
</ul>`,
    en: `1. Original string <br />2. String to be replaced <br />3. Specified string for replacement <br />
2. <i>Optional</i>Replacement rule, default is <code>all</code>
<ul>
  <li><code>all</code>: Replace all matching substrings found.</li>
  <li><code>trailing</code>: Replace the last matching substring found from the end of the original string.</li>
  <li><code>leading</code>: Replace the first matching substring found from the beginning of the original string.</li>
</ul>`,
  },
  replaceReturns: {
    zh: '替换后的字符串',
    en: 'Replaced string',
  },
  regexMatchDesc: {
    zh: '判断字符串是否与某正则表达式匹配',
    en: 'Check if a string matches a regular expression',
  },
  regexMatchParams: {
    zh: '1. 原字符串 <br />2. 正则表达式',
    en: '1. Original string <br />2. Regular expression',
  },
  regexMatchReturns: {
    zh: 'true 或 false',
    en: 'true or false',
  },
  regexReplaceDesc: {
    zh: '替换字符串中匹配到某正则表达式的子串',
    en: 'Replace substrings in a string that match a regular expression',
  },
  regexReplaceParams: {
    zh: '1. 原字符串 <br />2. 正则表达式 <br />3. 指定用于替换的字符串',
    en: '1. Original string <br />2. Regular expression <br />3. String used for replacement',
  },
  regexReplaceReturns: {
    zh: '替换后的字符串',
    en: 'Replaced string',
  },
  asciiDesc: {
    zh: '返回字符对应的 ASCII 码',
    en: 'Returns the ASCII code corresponding to the character',
  },
  asciiParams: {
    zh: '字符',
    en: 'Character',
  },
  asciiReturns: {
    zh: '整数值，字符对应的 ASCII 码',
    en: 'Integer value, ASCII code corresponding to the character',
  },
  findDesc: {
    zh: '查找并返回字符串中的某个子串',
    en: 'Find and return a substring in a string.',
  },
  findParams: {
    zh: `1. 原字符串<br />2. 要查找的子串<br />
3. <i>可选</i>指定查找方向，默认为 <code>leading</code>
<ul>
  <li><code>leading</code>从字符串的头部开始查找</li>
  <li><code>trailing</code>从字符串的尾部开始查找</li>
</ul>`,
    en: ` 1. Original string<br />2. Substring to be searched for<br />
3. <i>Optional</i>Specify search direction, default is <code>leading</code>
<ul>
<li><code>leading</code>: start searching from the beginning of the string</li>
<li><code>trailing</code>: start searching from the end of the string</li>
</ul>`,
  },
  findReturns: {
    zh: '查找到的子串，如找不到则返回空字符串',
    en: 'The substring found, if not found, returns an empty string.',
  },
  mapGetDesc: {
    zh: '取 Map 中某个 Key 的值',
    en: 'Take the value of a Key in the Map',
  },
  mapGetParams: {
    zh: `1. Key：需要获取的 Key，支持嵌套的 Key，比如 <code>a.b.c</code><br /> 2. Map：从中获取 Key 的值的 Map<br />
3. <i>可选</i>Default Value：当 Map 中不存在指定的 Key 时，返回的默认值`,
    en: `1. Key: The key that needs to be obtained, supports nested keys, such as <code>a.b.c</code><br /> 2. Map: The map from which the value of the key is obtained<br />
3. <i>Optional</i>Default Value: The default value returned when the specified key does not exist in the map.`,
  },
  mapGetReturns: {
    zh: 'Map 中某个 Key 的值',
    en: 'The value of a Key in the Map',
  },
  mapPutDesc: {
    zh: '向 Map 中插入值',
    en: 'Insert value into Map',
  },
  mapPutParams: {
    zh: '1. Key <br />2. Value <br />3. Map',
    en: '1. Key <br />2. Value <br />3. Map',
  },
  mapPutReturns: {
    zh: '插入后的 Map。支持嵌套的 Key，比如 "a.b.c"',
    en: 'The inserted Map. Support nested keys, such as "a.b.c"',
  },
  nthDesc: {
    zh: '取第 n 个元素，下标从 1 开始',
    en: 'Take the nth element, and subscripts start at 1',
  },
  nthParams: {
    zh: '1. 起始位置 <br /> 2. 原数组',
    en: '1. n (integer) <br />2. Array',
  },
  nthReturns: {
    zh: '第 n 个元素',
    en: 'Nth element',
  },
  lengthDesc: {
    zh: '获取数组的长度',
    en: 'Get the length of an array',
  },
  lengthParams: {
    zh: '1. 原数组',
    en: 'Original array',
  },
  lengthReturns: {
    zh: '数组长度',
    en: 'the length of an array',
  },
  sublistDesc: {
    zh: '截取子数组',
    en: 'Extract subarray',
  },
  sublistParams: {
    zh: `1. <i>可选</i>指定截取的开始位置，下标从 1 开始，默认为 1</br>
2. 截取的数组的长度</br>3. 原数组`,
    en: `1. <i>Optional</i>Specify the starting position of the interception, with an index starting from 1, default to 1</br>
2. The length of the intercepted array.</br>3. The original array.`,
  },
  sublistReturns: {
    zh: '子数组',
    en: 'sub-array',
  },
  firstDesc: {
    zh: '取第 1 个元素。下标从 1 开始',
    en: 'Take the first element. Subscripts start at 1',
  },
  firstParams: {
    zh: '1. 原数组',
    en: 'Original array',
  },
  firstReturns: {
    zh: '第 1 个元素',
    en: '1st element',
  },
  lastDesc: {
    zh: '取最后一个元素。',
    en: 'take the last element',
  },
  lastParams: {
    zh: '1. 原数组',
    en: 'Original array',
  },
  lastReturns: {
    zh: '最后一个元素',
    en: 'the last element',
  },
  containsDesc: {
    zh: '判断数据是否在数组里面',
    en: 'Determine whether the data is in the array',
  },
  containsParams: {
    zh: '1. 数据 <br />2. 原数组',
    en: '1. data <br />2. Original array',
  },
  containsReturns: {
    zh: 'Boolean 值',
    en: 'Boolean value',
  },
  md5Desc: {
    zh: '求 MD5 值',
    en: 'evaluate MD5',
  },
  md5Params: {
    zh: '数据',
    en: 'data',
  },
  md5Returns: {
    zh: 'MD5 值',
    en: 'MD5 value',
  },
  shaDesc: {
    zh: '求 SHA 值',
    en: 'evaluate SHA',
  },
  shaParams: {
    zh: '数据',
    en: 'data',
  },
  shaReturns: {
    zh: 'SHA 值',
    en: 'SHA value',
  },
  sha256Desc: {
    zh: '求 SHA256 值',
    en: 'evaluate SHA256',
  },
  sha256Params: {
    zh: '数据',
    en: 'data',
  },
  sha256Returns: {
    zh: 'SHA256 值',
    en: 'SHA256 value',
  },
  gzipDesc: {
    zh: '压缩数据，结果包含 gz 数据头和校验和',
    en: 'Compresses data with gz headers and checksum.',
  },
  gzipParams: {
    zh: '原始的二进制数据',
    en: 'Raw binary data',
  },
  gzipReturns: {
    zh: '压缩后的二进制数据',
    en: 'Compressed binary data',
  },
  gunzipDesc: {
    zh: '解压缩数据，原始数据中包含 gz 数据头和校验和',
    en: 'Uncompresses data with gz headers and checksum.',
  },
  gunzipParams: {
    zh: '压缩后的二进制数据',
    en: 'Compressed binary data',
  },
  gunzipReturns: {
    zh: '原始的二进制数据',
    en: 'Raw binary data',
  },
  zipDesc: {
    zh: '压缩数据，结果不包含 zlib 数据头和校验和',
    en: 'Compresses data without zlib headers and checksum.',
  },
  zipParams: {
    zh: '原始的二进制数据',
    en: 'Raw binary data',
  },
  zipReturns: {
    zh: '压缩后的二进制数据',
    en: 'Compressed binary data',
  },
  unzipDesc: {
    zh: '解压缩数据，原始数据中不包含 zlib 数据头和校验和',
    en: 'Uncompresses data without zlib headers and checksum.',
  },
  unzipParams: {
    zh: '压缩后的二进制数据',
    en: 'Compressed binary data',
  },
  unzipReturns: {
    zh: '原始的二进制数据',
    en: 'Raw binary data',
  },
  zipCompressDesc: {
    zh: '压缩数据，结果包含 zlib 数据头和校验和',
    en: 'Compresses data with zlib headers and checksum.',
  },
  zipCompressParams: {
    zh: '原始的二进制数据',
    en: 'Raw binary data',
  },
  zipCompressReturns: {
    zh: '压缩后的二进制数据',
    en: 'Compressed binary data',
  },
  zipUncompressDesc: {
    zh: '解压缩数据，原始数据中包含 zlib 数据头和校验和',
    en: 'Uncompresses data with zlib headers and checksum.',
  },
  zipUncompressParams: {
    zh: '压缩后的二进制数据',
    en: 'Compressed binary data',
  },
  zipUncompressReturns: {
    zh: '原始的二进制数据',
    en: 'Raw binary data',
  },
  // TODO: desc
  subbitsDesc: {
    zh: '从二进制数据的指定下标位置获取指定长度的比特位，然后按照给定的参数转换为想要的数据类型',
    en: 'Get a given length of bits start from the specified offset of a binary, and then convert it to a data type according to the arguments provided',
  },
  subbitsParams: {
    zh: '请查看官网文档',
    en: 'Please refer to the official website documentation.',
  },
  subbitsReturns: {
    zh: '获取到的数据',
    en: 'The data got from the binary',
  },
  base64EncodeDesc: {
    zh: 'BASE64 编码',
    en: 'BASE64 encode',
  },
  base64EncodeParams: {
    zh: '要编码的二进制数据',
    en: 'The binary to be encoded',
  },
  base64EncodeReturns: {
    zh: 'Base64 编码的字符串',
    en: 'The encoded base64-formatted string',
  },
  base64DecodeDesc: {
    zh: 'BASE64 解码',
    en: 'BASE64 decode',
  },
  base64DecodeParams: {
    zh: 'Base64 编码的字符串',
    en: 'The base64-formatted string to be decoded',
  },
  base64DecodeReturns: {
    zh: '解码后的二进制数据',
    en: 'The decoded binary',
  },
  jsonEncodeDesc: {
    zh: 'JSON 编码',
    en: 'JSON encode',
  },
  jsonEncodeParams: {
    zh: '要转成 JSON 的数据结构',
    en: 'The data to be encoded',
  },
  jsonEncodeReturns: {
    zh: 'JSON 字符串',
    en: 'The JSON string',
  },
  jsonDecodeDesc: {
    zh: 'JSON 解码',
    en: 'JSON decode',
  },
  jsonDecodeParams: {
    zh: '要解码的 JSON 字符串',
    en: 'The JSON string to be decoded',
  },
  jsonDecodeReturns: {
    zh: '解码后的数据结构',
    en: 'The decoded data',
  },
  bin2HexstrDesc: {
    zh: '二进制数据转为 Hex 字符串',
    en: 'Binary to Hex String',
  },
  bin2HexstrParams: {
    zh: '二进制数据',
    en: 'The binary',
  },
  bin2HexstrReturns: {
    zh: 'Hex 字符串',
    en: 'The hex string',
  },
  hexstr2BinDesc: {
    zh: 'Hex 字符串转为二进制数据',
    en: 'Binary to Hex String',
  },
  hexstr2BinParams: {
    zh: 'Hex 字符串',
    en: 'The hex string',
  },
  hexstr2BinReturns: {
    zh: '二进制数据',
    en: 'The binary',
  },
  nowTimestampDesc: {
    zh: '返回当前时间的 Unix 时间戳',
    en: 'Return the unix epoch of now',
  },
  nowTimestampParams: {
    zh: `1. <i>可选</i>时间单位，可设置为 <code>second</code>，<code>millisecond</code>，<code>microsecond</code> 或 <code>nanosecond</code>，默认为 <code>second</code>`,
    en: `1. <i>Optional</i>Time unit, can be set to <code>second</code>, <code>millisecond</code>, <code>microsecond</code>, or <code>nanosecond</code>, default is <code>second</code>`,
  },
  nowTimestampReturns: {
    zh: 'Unix 时间戳',
    en: 'The unix epoch',
  },
  nowRfc3339Desc: {
    zh: '指定时间单位，生成当前时间的 RFC3339 字符串',
    en: 'Create a RFC3339 time string of now, in given time unit',
  },
  nowRfc3339Params: {
    zh: `1. <i>可选</i>时间单位，可设置为 <code>second</code>，<code>millisecond</code>，<code>microsecond</code> 或 <code>nanosecond</code>，默认为 <code>second</code>`,
    en: `1. <i>Optional</i>Time unit, can be set to <code>second</code>, <code>millisecond</code>, <code>microsecond</code>, or <code>nanosecond</code>, default is <code>second</code>`,
  },
  nowRfc3339Returns: {
    zh: 'RFC3339 时间字符串',
    en: 'The time string of format RFC3339',
  },
  unixTsToRfc3339Desc: {
    zh: '将输入的时间戳转换为 RFC3339 时间字符串',
    en: 'Convert an unix epoch to RFC3339 time string',
  },
  unixTsToRfc3339Params: {
    zh: `1. Unix 时间戳<br />
2. <i>可选</i>Unix 时间戳的时间单位，可为 <code>second</code>，<code>millisecond</code>，<code>microsecond</code> 或 <code>nanosecond</code>，默认为 <code>second</code>`,
    en: `1. Unix timestamp <br />
2. <i>Optional</i>Time unit for Unix timestamp, can be <code>second</code>, <code>millisecond</code>, <code>microsecond</code>, or <code>nanosecond</code>. Default is <code>second</code>`,
  },
  unixTsToRfc3339Returns: {
    zh: 'RFC3339 时间字符串',
    en: 'The time string of format RFC3339',
  },
  rfc3339ToUnixTsDesc: {
    zh: '将 RFC3339 时间字符串转换为 Unix 时间戳',
    en: 'Convert a RFC3339 time string to unix epoch',
  },
  rfc3339ToUnixTsParams: {
    zh: `1. RFC3339 时间字符串 </br>
2. <i>可选</i>RFC3339 时间字符串的时间单位，可为 <code>second</code>，<code>millisecond</code>，<code>microsecond</code> 或 <code>nanosecond</code>，默认为 <code>second</code>`,
    en: `1. RFC3339 time string </br>
2. <i>Optional</i>Unit of RFC3339 time string, can be <code>second</code>, <code>millisecond</code>, <code>microsecond</code>, or <code>nanosecond</code>, default is <code>second</code>`,
  },
  rfc3339ToUnixTsReturns: {
    zh: 'Unix 时间戳',
    en: 'The unix epoch',
  },
  formatDateDesc: {
    zh: '时间戳转格式化时间',
    en: 'Timestamp to formatted time',
  },
  formatDateParams: {
    zh: '1. 时间戳精度（参考时间戳精度定义）</br>2. 时间偏移量（参考时间偏移量定义）</br>3. 日期格式（参考时间字符串编解码格式）</br>4. 时间戳（可选参数，默认为当前时间）',
    en: '1. The time unit (refer to The time unit)</br>2. The time offset (refer to time offset definition)</br>3. The date format (refer to time string codec format)</br>4. The timestamp (optional parameter, default is current time)',
  },
  formatDateReturns: {
    zh: '格式化时间字符串',
    en: 'Formatted time',
  },
  dateToUnixTsDesc: {
    zh: '格式化时间转时间戳',
    en: 'Formatted time to timestamp',
  },
  dateToUnixTsParams: {
    zh: '1. 时间戳精度（参考时间戳精度定义）</br>2. 时间偏移量（可选，未填写时，使用格式化时间字符串中的时间偏移量，参考时间偏移量定义）</br> 3. 日期格式（参考时间字符串编解码格式）</br>4. 格式化时间字符串',
    en: '1. The time unit (refer to the following table for definition) </br>2. The time offset (optional, when not filled, use the time offset in the formatted time string, refer to the time offset definition) </br>3. The date format (refer to time string codec format) </br>4. The formatted time string',
  },
  dateToUnixTsReturns: {
    zh: 'Unix 时间戳',
    en: 'The unix epoch',
  },
  jqDesc: {
    zh: `JQ 是一款功能强大的命令行工具和编程语言，主要用于转换和查询 JSON 编码的消息。<br />
对于规则 SQL 及其内置函数很难或无法实现的 JSON 消息处理，使用 JQ 函数可以很方便地实现。`,
    en: `JQ is a powerful command line tool and programming language designed primarily for transforming and querying data encoded as JSON . <br />
Typical JQ programs describe simple transformations or filters for JSON data, but one can also use JQ to perform complex computations when needed.`,
  },
  jqParams: {
    zh: `1. 有效的 jq 程序字符串<br />2. JSON 编码的字符串或对象<br />3.执行超时（可选，单位为毫秒，默认为 10 秒）`,
    en: `1. string containing valid jq program<br />2. JSON encoded string or object<br />3. Optional, integer timeout value (milliseconds, default is 10 seconds)`,
  },
  jqReturns: {
    zh: '返回值为执行生成生成的 JSON 对象列表。如果执行超时或者 JQ 程序抛出异常，该函数将抛出异常。',
    en: 'list of objects corresponding to the JSON objects generated by the given JQ program (parameter 1) when given the input provided by parameter 2. The function throws an exception if the execution did not finish before the timeout or if the jq program throws an exception.',
  },
  schemaDecodeDesc: {
    zh: `将数据解码为目标数据结构`,
    en: `Decode data to target data structure`,
  },
  schemaDecodeParams: {
    zh: `1. 目标 Schema<br />2. 需要解码的数据<br />3. Schema 类型为 Protobuf 时，定义的类型`,
    en: `1. Target Schema<br />2. Data to be decoded<br />3. When the schema type is Protobuf, the defined type`,
  },
  schemaDecodeReturns: {
    zh: '解码后的数据',
    en: 'The decoded data',
  },
  schemaEncodeDesc: {
    zh: `将数据编码为目标数据结构`,
    en: `Encode data to target data structure`,
  },
  schemaEncodeParams: {
    zh: `1. 目标 Schema<br />2. 需要编码的数据<br />3. Schema 类型为 Protobuf 时，定义的类型`,
    en: `1. Target Schema<br />2. Data to be encoded<br />3. When the schema type is Protobuf, the defined type`,
  },
  schemaEncodeReturns: {
    zh: '编码后的数据',
    en: 'The encoded data',
  },
  schemaCheckDesc: {
    zh: `检查数据是否符合目标 JSON Schema`,
    en: `Check if the data conforms to the target JSON Schema`,
  },
  schemaCheckParams: {
    zh: `1. 目标 Schema<br />2. JSON 数据`,
    en: `1. Target Schema<br />2. JSON data`,
  },
  schemaCheckReturns: {
    zh: '检查结果。',
    en: 'The result of the check.',
  },
}
