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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
    en: 'Operand',
  },
  asinReturns: {
    zh: '值',
    en: 'Arcsine value',
  },
  asinhDesc: {
    zh: '反双曲正弦',
    en: 'inverse hyperbolic sine',
  },
  asinhParams: {
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
    en: 'Operand',
  },
  sqrtReturns: {
    zh: '平方根',
    en: 'Square root',
  },
  fmodDesc: {
    zh: '负点数取模函数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: '1. 被操作数',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: 'Data',
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
    zh: '1. 原字符串',
    en: 'input string',
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
    zh: '1. 原字符串',
    en: 'input string',
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
    zh: '1. 原字符串',
    en: 'input string',
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
    zh: '1. 原字符串',
    en: 'input string',
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
    zh: '1. 原字符串',
    en: 'input string',
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
    zh: '1. 原字符串',
    en: 'input string',
  },
  reverseReturns: {
    zh: '翻转后的字符串',
    en: 'output string',
  },
  strlenDesc: {
    zh: '取字符串长度',
    en: 'string length',
  },
  strlenParams: {
    zh: '1. 原字符串',
    en: 'input string',
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
    zh: '1. 原字符串 <br />2. 起始位置 <br />3. 要取出的子串长度. 注意: 下标从 0 开始',
    en: '1. input string <br />2. Start position. Note: Subscripts start at 1',
  },
  substrReturns: {
    zh: '子串',
    en: 'substring',
  },
  splitDesc: {
    zh: '字符串分割，只查找右边第一个分隔符',
    en: 'split string',
  },
  splitParams: {
    zh: "1. 原字符串 <br />2. 分割符子串 <br />3. 'trailing'",
    en: "1. input string <br />2. split string <br />3. Find the first separator on the left or right, optional value is 'leading' or 'trailing'",
  },
  splitReturns: {
    zh: '分割后的字符串数组',
    en: 'Split string array',
  },
  concatDesc: {
    zh: '字符串拼接',
    en: '',
  },
  concatParams: {
    zh: '1. 左字符串 <br />2. 右符子串',
    en: '',
  },
  concatReturns: {
    zh: '拼接后的字符串',
    en: '',
  },
  tokensDesc: {
    zh: '字符串分解(按照指定字符串和换行符分解)',
    en: '',
  },
  tokensParams: {
    zh: "1. 输入字符串 <br />2. 分割符或字符串 <br />3. 'nocrlf'",
    en: '',
  },
  tokensReturns: {
    zh: '分解后的字符串数组',
    en: '',
  },
  sprintfDesc: {
    zh: '字符串格式化，格式字符串的用法详见 <a href="https://erlang.org/doc/man/io.html#fwrite-1">https://erlang.org/doc/man/io.html#fwrite-1</a> 里的 Format 部分',
    en: '',
  },
  sprintfParams: {
    zh: '1. 格式字符串 <br />2,3,4... 参数列表。参数个数不定',
    en: '',
  },
  sprintfReturns: {
    zh: '分解后的字符串数组',
    en: '',
  },
  padDesc: {
    zh: '字符串补足长度，补指定字符，从头部补足',
    en: '',
  },
  padParams: {
    zh: "1. 原字符串 <br />2. 字符总长度 <br />3. 'leading' <br />4. 指定用于补足的字符",
    en: '',
  },
  padReturns: {
    zh: '补足后的字符串',
    en: '',
  },
  replaceDesc: {
    zh: '替换字符串中的某子串，从头部查找第一个匹配子串替换',
    en: '',
  },
  replaceParams: {
    zh: "1. 原字符串 <br />2. 要被替换的子串 <br />3. 指定用于替换的字符串 <br />4. 'leading'",
    en: '',
  },
  replaceReturns: {
    zh: '替换后的字符串',
    en: '',
  },
  regexMatchDesc: {
    zh: '判断字符串是否与某正则表达式匹配',
    en: '',
  },
  regexMatchParams: {
    zh: '1. 原字符串 <br />2. 正则表达式',
    en: '',
  },
  regexMatchReturns: {
    zh: 'true 或 false',
    en: '',
  },
  regexReplaceDesc: {
    zh: '替换字符串中匹配到某正则表达式的子串',
    en: '',
  },
  regexReplaceParams: {
    zh: '1. 原字符串 <br />2. 正则表达式 <br />3. 指定用于替换的字符串',
    en: '',
  },
  regexReplaceReturns: {
    zh: '替换后的字符串',
    en: '',
  },
  asciiDesc: {
    zh: '返回字符对应的 ASCII 码',
    en: '',
  },
  asciiParams: {
    zh: '1. 字符',
    en: '',
  },
  asciiReturns: {
    zh: '整数值，字符对应的 ASCII 码',
    en: '',
  },
  findDesc: {
    zh: '查找并返回字符串中的某个子串，从尾部查找',
    en: '',
  },
  findParams: {
    zh: "1. 原字符串 <br />2. 要查找的子串 <br />3. 'trailing'",
    en: '',
  },
  findReturns: {
    zh: '查抄到的子串，如找不到则返回空字符串',
    en: '',
  },
  mapGetDesc: {
    zh: '取 Map 中某个 Key 的值，如果没有则返回指定默认值',
    en: 'Take the value of a Key in the Map, if failed, return the specified default value',
  },
  mapGetParams: {
    zh: '1. Key <br />2. Map <br />3. Default Value',
    en: '1. Key <br />2. Map <br />3. Default Value',
  },
  mapGetReturns: {
    zh: 'Map 中某个 Key 的值。支持嵌套的 Key，比如 "a.b.c"',
    en: 'The value of a Key in the Map. Support nested keys, such as "a.b.c"',
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
    en: 'Original array',
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
    zh: '取从第 n 个元素开始、长度为 len 的子数组。下标从 1 开始',
    en: 'Take a sub-array of length len starting from the nth element. Subscripts start at 1',
  },
  sublistParams: {
    zh: '1. 起始位置 n <br />2. 长度 len <br />3. 原数组',
    en: '1. start position n <br />2. length len <br />3. Original array',
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
  subbitsDesc: {
    zh: '从二进制数据的指定下标位置获取指定长度的比特位，然后按照给定的参数转换为想要的数据类型. 下标是从 1 开始的.',
    en: 'Get a given length of bits start from the specified offset of a binary, and then convert it to a data type according to the arguments provided. Offsets are start from 1.',
  },
  subbitsParams: {
    zh: "1. 二进制数据 <br />2. 起始位置的下标 <br />3. 要获取的长度(bits) <br />4. 数据类型，可选值：'integer'、'float'、'bits' <br />5. 符号类型，只对整型数据有效，可选值：'unsigned'、'signed'，<br />6. 大端还是小端，只对整型数据有效，可选值：'big'、'little'",
    en: "1. The binary <br />2. The offset <br />3. The length of bits to get <br />4. Data Type, can be one of 'integer', 'float', 'bits' <br />5. Signedness, only works for integers, can be one of 'unsigned', 'signed', <br />6. Endianness, only works for integers, can be one of 'big', 'little'",
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
    zh: '指定时间单位，返回当前时间的 Unix 时间戳',
    en: 'Return the unix epoch of now, in given time unit',
  },
  nowTimestampParams: {
    zh: '1. 时间单位',
    en: '1. The time unit',
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
    zh: '1. 时间单位',
    en: '1. The time unit',
  },
  nowRfc3339Returns: {
    zh: 'RFC3339 时间字符串',
    en: 'The time string of format RFC3339',
  },
  unixTsToRfc3339Desc: {
    zh: '指定时间单位，将 Unix 时间戳转换为 RFC3339 时间字符串',
    en: 'Convert an unix epoch to RFC3339 time string, using the given time unit',
  },
  unixTsToRfc3339Params: {
    zh: '1. Unix 时间戳 </br>2. 时间单位',
    en: '1. The unix epoch </br>2. The time unit',
  },
  unixTsToRfc3339Returns: {
    zh: 'RFC3339 时间字符串',
    en: 'The time string of format RFC3339',
  },
  rfc3339ToUnixTsDesc: {
    zh: '指定时间单位，将 RFC3339 时间字符串转换为 Unix 时间戳',
    en: 'Convert a RFC3339 time string to unix epoch, using the given time unit',
  },
  rfc3339ToUnixTsParams: {
    zh: '1. RFC3339 时间字符串 </br>2. 时间单位',
    en: '1. The time string of format RFC3339 </br>2. The time unit',
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
}
