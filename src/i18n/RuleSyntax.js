export default {
  selectDesc: {
    zh: '对数据进行变换，并选择出感兴趣的字段',
    en: 'Select fields in the output',
    ja: '出力からフィールドを選択する',
  },
  fromDesc: {
    zh: '将规则挂载到某个主题上',
    en: 'Mounts rules to a topic',
    ja: 'トピックにルールをマウントする',
  },
  whereDesc: {
    zh: '对 SELECT 选择出来的某个字段施加条件过滤',
    en: 'Filter messages based on conditions',
    ja: '条件に基づいてメッセージをフィルタリングする',
  },
  foreachDesc: {
    zh: '选择需要做 FOREACH 操作的字段，注意选择出的字段必须为数组类型',
    en: 'Select the field that needs to perform FOREACH operation. Note that the selected field must be an array type',
    ja: 'FOREACH操作を行う必要があるフィールドを選択します。選択されたフィールドは配列タイプでなければならないことに注意してください',
  },
  doDesc: {
    zh: '对 FOREACH 选择出来的数组中的每个元素进行变换，并选择出感兴趣的字段',
    en: 'Transform each element in the array selected by FOREACH and select the field of interest',
    ja: 'FOREACHで選択された配列の各要素を変換し、関心のあるフィールドを選択します',
  },
  incaseDesc: {
    zh: '对 DO 选择出来的某个字段施加条件过滤',
    en: 'Apply conditional filtering to a field selected by DO',
    ja: 'DOで選択されたフィールドに条件フィルタリングを適用する',
  },
  caseDesc: {
    zh: '在查询结果中根据特定条件返回不同的值',
    en: 'Return different values based on specific conditions in the query results',
    ja: 'クエリ結果の特定の条件に基づいて異なる値を返す',
  },
  whenDesc: {
    zh: '用于控制条件语句的执行流程，一般接一个条件表达式，用来判断对应的 CASE 语句中的某个分支是否需要执行',
    en: 'Used to control the execution flow of conditional statements, usually followed by a condition expression to determine whether a certain branch in the corresponding CASE statement needs to be executed.',
    ja: '条件文の実行フローを制御するために使用され、通常は条件式に続き、対応するCASE文の特定の分岐が実行する必要があるかどうかを判断するために使用されます。',
  },
  elseDesc: {
    zh: '通常与 CASE 表达式一起使用，指定当所有条件都不满足时应返回的默认值',
    en: 'Usually used with CASE expression, specifying the default value to be returned when none of the conditions are met',
    ja: '通常、CASE式と一緒に使用され、条件が一つも満たされない場合に返すデフォルト値を指定します。',
  },
  thenDesc: {
    zh: '通常与 CASE 表达式一起使用，指定了当条件满足时要返回的值',
    en: 'Usually used with CASE expression, specifies the value to be returned when the condition is met.',
    ja: '通常、CASE式とともに使用され、条件が満たされた場合に返す値を指定します。',
  },
  endDesc: {
    zh: '指示某个块的结束',
    en: 'Indicates the end of a block',
    ja: 'ブロックの終了を示します',
  },
  asDesc: {
    zh: '为选择结果指定别名',
    en: 'Specify an alias for the selects result',
    ja: '選択結果のエイリアスを指定します',
  },
  parameter: {
    zh: '参数',
    en: 'Parameter',
    ja: 'パラメータ',
  },
  returned: {
    zh: '返回值',
    en: 'Returned value',
    ja: '返り値',
  },
  /* FUNC */
  // TODO: Optimize the display of parameters.
  absDesc: {
    zh: '绝对值',
    en: 'Absolute value',
    ja: '絶対値',
  },
  absParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  absReturns: {
    zh: '绝对值',
    en: 'absolute value',
    ja: '絶対値',
  },
  cosDesc: {
    zh: '余弦',
    en: 'Cosine',
    ja: 'コサイン',
  },
  cosParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  cosReturns: {
    zh: '余弦值',
    en: 'Cosine value',
    ja: 'コサイン値',
  },
  coshDesc: {
    zh: '双曲余弦',
    en: 'Hyperbolic cosine',
    ja: '双曲線コサイン',
  },
  coshParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  coshReturns: {
    zh: '双曲余弦值',
    en: 'Hyperbolic cosine value',
    ja: '双曲線コサイン値',
  },
  acosDesc: {
    zh: '反余弦',
    en: 'Inverse cosine',
    ja: '逆コサイン',
  },
  acosParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  acosReturns: {
    zh: '反余弦值',
    en: 'Inverse cosine value',
    ja: '逆コサイン値',
  },
  acoshDesc: {
    zh: '反双曲余弦',
    en: 'Inverse hyperbolic cosine',
    ja: '逆双曲線コサイン',
  },
  acoshParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  acoshReturns: {
    zh: '反双曲余弦值',
    en: 'Inverse hyperbolic cosine value',
    ja: '逆双曲線コサイン値',
  },
  sinDesc: {
    zh: '正弦',
    en: 'Sine',
    ja: 'サイン',
  },
  sinParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  sinReturns: {
    zh: '正弦值',
    en: 'Sine value',
    ja: 'サイン値',
  },
  sinhDesc: {
    zh: '双曲正弦',
    en: 'Hyperbolic sine',
    ja: '双曲線サイン',
  },
  sinhParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  sinhReturns: {
    zh: '双曲正弦值',
    en: 'Hyperbolic sine value',
    ja: '双曲線サイン値',
  },
  asinDesc: {
    zh: '反正弦',
    en: 'Arcsine',
    ja: '逆サイン',
  },
  asinParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  asinReturns: {
    zh: '值',
    en: 'Arcsine value',
    ja: '逆サイン値',
  },
  asinhDesc: {
    zh: '反双曲正弦',
    en: 'inverse hyperbolic sine',
    ja: '逆双曲線サイン',
  },
  asinhParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  asinhReturns: {
    zh: '反双曲正弦值',
    en: 'inverse hyperbolic sine value',
    ja: '逆双曲線サイン値',
  },
  tanDesc: {
    zh: '正切',
    en: 'tangent',
    ja: 'タンジェント',
  },
  tanParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  tanReturns: {
    zh: '正切值',
    en: 'tangent value',
    ja: 'タンジェント値',
  },
  tanhDesc: {
    zh: '双曲正切',
    en: 'Hyperbolic tangent',
    ja: '双曲線タンジェント',
  },
  tanhParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  tanhReturns: {
    zh: '双曲正切值',
    en: 'Hyperbolic tangent value',
    ja: '双曲線タンジェント値',
  },
  atanDesc: {
    zh: '反正切',
    en: 'Arc tangent',
    ja: 'アークタンジェント',
  },
  atanParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  atanReturns: {
    zh: '反正切值',
    en: 'Arc tangent value',
    ja: 'アークタンジェント値',
  },
  atanhDesc: {
    zh: '反双曲正切',
    en: 'Inverse hyperbolic tangent',
    ja: '逆双曲線タンジェント',
  },
  atanhParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  atanhReturns: {
    zh: '反双曲正切值',
    en: 'Inverse hyperbolic tangent value',
    ja: '逆双曲線タンジェント値',
  },
  ceilDesc: {
    zh: '上取整',
    en: 'Round up',
    ja: '切り上げ',
  },
  ceilParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  ceilReturns: {
    zh: '整数值',
    en: 'Integer value',
    ja: '整数値',
  },
  floorDesc: {
    zh: '下取整',
    en: 'Round down',
    ja: '切り捨て',
  },
  floorParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  floorReturns: {
    zh: '整数值',
    en: 'Integer value',
    ja: '整数値',
  },
  roundDesc: {
    zh: '四舍五入',
    en: 'rounding',
    ja: '四捨五入',
  },
  roundParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  roundReturns: {
    zh: '整数值',
    en: 'Integer value',
    ja: '整数値',
  },
  expDesc: {
    zh: '幂运算',
    en: 'Exponentiation',
    ja: 'べき乗',
  },
  expParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  expReturns: {
    zh: 'e 的 x 次幂',
    en: 'X power of e',
    ja: 'eのx乗',
  },
  powerDesc: {
    zh: '指数运算',
    en: 'Exponential operation',
    ja: '指数計算',
  },
  powerParams: {
    zh: '1. 左操作数 x <br />2. 右操作数 y',
    en: '1. Left operand x <br />2. Right operand y',
    ja: '1. 左オペランド x <br />2. 右オペランド y',
  },
  powerReturns: {
    zh: 'x 的 y 次方',
    en: 'Y power of X',
    ja: 'xのy乗',
  },
  sqrtDesc: {
    zh: '平方根运算',
    en: 'Square root operation',
    ja: '平方根',
  },
  sqrtParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  sqrtReturns: {
    zh: '平方根',
    en: 'Square root',
    ja: '平方根',
  },
  fmodDesc: {
    zh: '负点数取模函数',
    en: 'Floating point modulus function',
    ja: '浮動小数点モジュラス関数',
  },
  fmodParams: {
    zh: '1. 左操作数 <br />2. 右操作数',
    en: '1. left Operand <br />2.right Operand',
    ja: '1. 左オペランド <br />2. 右オペランド',
  },
  fmodReturns: {
    zh: '模',
    en: 'module',
    ja: '剰余',
  },
  logDesc: {
    zh: '以 e 为底对数',
    en: 'Logarithm to e',
    ja: '自然対数',
  },
  logParams: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  logReturns: {
    zh: '值',
    en: 'value',
    ja: '値',
  },
  log10Desc: {
    zh: '以 10 为底对数',
    en: 'Logarithm to 10',
    ja: '常用対数',
  },
  log10Params: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  log10Returns: {
    zh: '值',
    en: 'value',
    ja: '値',
  },
  log2Desc: {
    zh: '以 2 为底对数',
    en: 'Logarithm to 2',
    ja: '2を底とする対数',
  },
  log2Params: {
    zh: '1. 被操作数',
    en: 'Operand',
    ja: 'オペランド',
  },
  log2Returns: {
    zh: '值',
    en: 'value',
    ja: '値',
  },
  isNullDesc: {
    zh: '判断变量是否为空值',
    en: 'Judge if the variable is null',
    ja: '変数がNULLか判断',
  },
  isNullParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  isNullReturns: {
    zh: 'Boolean 类型的数据。如果为空值(undefined) 则返回 true，否则返回 false',
    en: 'Boolean data.if it is empty (undefined), return true, otherwise return false',
    ja: '真偽値データ。空の場合(未定義)はtrue、それ以外はfalse。',
  },
  isNotNullDesc: {
    zh: '判断变量是否为非空值',
    en: 'Judge if the variable is not null',
    ja: '変数が非NULLか判断',
  },
  isNotNullParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  isNotNullReturns: {
    zh: 'Boolean 类型的数据。如果为空值(undefined) 则返回 false，否则返回 true',
    en: 'Boolean data.if it is empty (undefined), return false, otherwise return true',
    ja: '真偽値データ。空の場合(未定義)はfalse、それ以外はtrue。',
  },
  isStrDesc: {
    zh: '判断变量是否为 String 类型',
    en: 'Judge whether the variable is String type',
    ja: '変数が文字列型か判断',
  },
  isStrParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  isStrReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
    ja: '真偽値データ',
  },
  isBoolDesc: {
    zh: '判断变量是否为 Boolean 类型',
    en: 'Judge if the variable is Boolean type',
    ja: '変数が論理型か判断',
  },
  isBoolParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  isBoolReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
    ja: '真偽値データ',
  },
  isIntDesc: {
    zh: '判断变量是否为 Integer 类型',
    en: 'Judge whether the variable is Integer type',
    ja: '変数が整数型か判断',
  },
  isIntParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  isIntReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
    ja: '真偽値データ',
  },
  isFloatDesc: {
    zh: '判断变量是否为 Float 类型',
    en: 'Judge whether the variable is Float type',
    ja: '変数が浮動小数点数型か判断',
  },
  isFloatParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  isFloatReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
    ja: '真偽値データ。',
  },
  isNumDesc: {
    zh: '判断变量是否为数字类型，包括 Integer 和 Float 类型',
    en: 'Judge whether the variable is a numeric type, including Integer and Float types',
    ja: '変数が数値型(整数型または浮動小数点数型)か判断します。',
  },
  isNumParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  isNumReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
    ja: '真偽値データ',
  },
  isMapDesc: {
    zh: '判断变量是否为 Map 类型',
    en: 'Judge whether the variable is Map type',
    ja: '変数がマップ型か判断',
  },
  isMapParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  isMapReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
    ja: '真偽値データ',
  },
  isArrayDesc: {
    zh: '判断变量是否为 Array 类型',
    en: 'Judge whether the variable is Array type',
    ja: '変数が配列型か判断',
  },
  isArrayParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  isArrayReturns: {
    zh: 'Boolean 类型的数据。',
    en: 'Boolean data.',
    ja: '真偽値データ',
  },
  strDesc: {
    zh: '将数据转换为 String 类型',
    en: 'Convert data to String type',
    ja: 'データを文字列型に変換',
  },
  strParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  strReturns: {
    zh: 'String 类型的数据。无法转换将会导致 SQL 匹配失败',
    en: 'Data of type String. Failure to convert will cause SQL matching to fail',
    ja: '文字列型データ。変換できない場合はSQLマッチングが失敗する',
  },
  strUtf8Desc: {
    zh: '将数据转换为 UTF-8 String 类型',
    en: 'Convert data to UTF-8 String type',
    ja: 'データをUTF-8文字列型に変換',
  },
  strUtf8Params: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  strUtf8Returns: {
    zh: 'UTF-8 String 类型的数据。无法转换将会导致 SQL 匹配失败',
    en: 'UTF-8 String type data. Failure to convert will cause SQL matching to fail',
    ja: 'UTF-8文字列型データ。変換できない場合はSQLマッチングが失敗する',
  },
  boolDesc: {
    zh: '将数据转换为 Boolean 类型',
    en: 'Convert data to Boolean type',
    ja: 'データをブーリアン型に変換',
  },
  boolParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  boolReturns: {
    zh: 'Boolean 类型的数据。无法转换将会导致 SQL 匹配失败',
    en: 'Boolean data. Failure to convert will cause SQL matching to fail',
    ja: 'ブーリアン型データ。変換できない場合はSQLマッチングが失敗する',
  },
  intDesc: {
    zh: '将数据转换为整数类型',
    en: 'Convert data to integer type',
    ja: 'データを整数型に変換',
  },
  intParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  intReturns: {
    zh: '整数类型的数据。无法转换将会导致 SQL 匹配失败',
    en: 'Integer type data. Failure to convert will cause SQL matching to fail',
    ja: '整数型データ。変換できない場合はSQLマッチングが失敗する',
  },
  floatDesc: {
    zh: '将数据转换为浮点型类型',
    en: 'Convert data to floating type',
    ja: 'データを浮動小数点数型に変換',
  },
  floatParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  floatReturns: {
    zh: '浮点型类型的数据。无法转换将会导致 SQL 匹配失败',
    en: 'Floating type data. Failure to convert will cause SQL matching to fail',
    ja: '浮動小数点数型データ。変換できない場合はSQLマッチングが失敗する',
  },
  float2StrDesc: {
    zh: '将浮点型数字以指定精度转换为字符串',
    en: 'Convert a float to string using the given precision',
    ja: '指定した精度で浮動小数点数を文字列に変換',
  },
  float2StrParams: {
    zh: '1. 浮点型数字 2. 精度',
    en: '1. Float Number 2. Precision',
    ja: '1. 浮動小数点数 2. 精度',
  },
  float2StrReturns: {
    zh: '字符串',
    en: 'String',
    ja: '文字列',
  },
  mapDesc: {
    zh: '将数据转换为 Map 类型',
    en: 'Convert data to Map type',
    ja: 'データをマップ型に変換',
  },
  mapParams: {
    zh: 'Data',
    en: 'Data',
    ja: 'データ',
  },
  mapReturns: {
    zh: 'Map 类型的数据。无法转换将会导致 SQL 匹配失败',
    en: 'Map type data. Failure to convert will cause SQL matching to fail',
    ja: 'マップ型データ。変換できない場合はSQLマッチングが失敗する',
  },
  lowerDesc: {
    zh: '转为小写',
    en: 'convert to lowercase',
    ja: '小文字に変換',
  },
  lowerParams: {
    zh: '1. 原字符串',
    en: 'input string',
    ja: '入力文字列',
  },
  lowerReturns: {
    zh: '小写字符串',
    en: 'Lowercase string',
    ja: '小文字文字列',
  },
  upperDesc: {
    zh: '转为大写',
    en: 'convert to uppercase',
    ja: '大文字に変換',
  },
  upperParams: {
    zh: '1. 原字符串',
    en: 'input string',
    ja: '入力文字列',
  },
  upperReturns: {
    zh: '大写字符串',
    en: 'uppercase string',
    ja: '大文字文字列',
  },
  trimDesc: {
    zh: '去掉左右空格',
    en: 'Remove left and right space',
    ja: '左右のスペースを削除',
  },
  trimParams: {
    zh: '1. 原字符串',
    en: 'input string',
    ja: '入力文字列',
  },
  trimReturns: {
    zh: '去掉空格后的字符串',
    en: 'output string',
    ja: 'スペースを削除した文字列',
  },
  ltrimDesc: {
    zh: '去掉左空格',
    en: 'Remove the left space',
    ja: '左のスペースを削除',
  },
  ltrimParams: {
    zh: '1. 原字符串',
    en: 'input string',
    ja: '入力文字列',
  },
  ltrimReturns: {
    zh: '去掉空格后的字符串',
    en: 'output string',
    ja: 'スペースを削除した文字列',
  },
  rtrimDesc: {
    zh: '去掉右空格',
    en: 'Remove the right space',
    ja: '右のスペースを削除',
  },
  rtrimParams: {
    zh: '1. 原字符串',
    en: 'input string',
    ja: '入力文字列',
  },
  rtrimReturns: {
    zh: '去掉空格后的字符串',
    en: 'output string',
    ja: 'スペースを削除した文字列',
  },
  reverseDesc: {
    zh: '字符串反转',
    en: 'String inversion',
    ja: '文字列の反転',
  },
  reverseParams: {
    zh: '1. 原字符串',
    en: 'input string',
    ja: '入力文字列',
  },
  reverseReturns: {
    zh: '翻转后的字符串',
    en: 'output string',
    ja: '反転後の文字列',
  },
  strlenDesc: {
    zh: '取字符串长度',
    en: 'string length',
    ja: '文字列の長さ',
  },
  strlenParams: {
    zh: '1. 原字符串',
    en: 'input string',
    ja: '入力文字列',
  },
  strlenReturns: {
    zh: '整数值，字符长度',
    en: 'Integer value',
    ja: '文字数を定義するための整数を入力',
  },
  substrDesc: {
    zh: '取字符的子串',
    en: 'Take a substring of characters',
    ja: '部分文字列を取得',
  },
  substrParams: {
    zh: `1. 原字符串：需要提取子串的原始字符串<br />2. 起始位置：子串的起始位置，注意下标从 0 开始计数。<br />
3. <i>可选</i>要取出的子串长度`,
    en: `1. Original string: the original string from which to extract a substring<br />2. Starting position: the starting position of the substring, note that indexing starts at 0<br />
3. <i>Optional</i>Length of the substring to be extracted`,
    ja: `1. 元の文字列：サブストリングを抽出する元の文字列<br />2. 開始位置：サブストリングの開始位置、インデックスは0から始まることに注意<br />3. <i>オプション</i>抽出するサブストリングの長さ`,
  },
  substrReturns: {
    zh: '子串',
    en: 'substring',
    ja: '部分文字列',
  },
  splitDesc: {
    zh: '将一个字符串分割成一个字符串数组',
    en: 'Split a string into an array of strings',
    ja: '文字列を文字列の配列に分割',
  },
  splitParams: {
    zh: `1. 原字符串 <br />2. 分割符子串 <br />
2. <i>可选</i>分割的规则，默认匹配字符串中所有分隔符
<ul>
  <li><code>leading</code>：只查找左边第一个分隔符</li>
  <li><code>trailing</code>：只查找右边第一个分隔符</li>
</ul>`,
    en: `1. Original string <br />2. Separator substring <br />
2. <i>Optional</i> Rule for splitting, default to matching all separators in the string
<ul>
<li><code>leading</code>: Only search for the first separator on the left side</li>
<li><code>trailing</code>: Only search for the first separator on the right side</li>
</ul>`,
    ja: `1. 元の文字列。<br />2. セパレータのサブストリング <br />
3. <i>オプション</i> 分割のルール、デフォルトは文字列内のすべてのセパレータに一致
<ul>
<li><code>leading</code>：左側の最初のセパレータのみを検索</li>
<li><code>trailing</code>：右側の最初のセパレータのみを検索</li>
</ul>`,
  },
  splitReturns: {
    zh: '分割后的字符串数组',
    en: 'Split string array',
    ja: '分割後の文字列配列',
  },
  concatDesc: {
    zh: '字符串拼接',
    en: '',
    ja: '文字列の連結',
  },
  concatParams: {
    zh: '1. 左字符串 <br />2. 右符子串',
    en: '',
    ja: '1. 左の文字列 <br />2. 右の文字列',
  },
  concatReturns: {
    zh: '拼接后的字符串',
    en: '',
    ja: '連結後の文字列',
  },
  tokensDesc: {
    zh: '字符串分解(按照指定字符串和换行符分解)',
    en: 'String decomposition (decomposed according to specified strings and line breaks)',
    ja: '文字列の分割(指定文字と改行コードで分割)',
  },
  tokensParams: {
    zh: `1. 原字符串</br>2. 分隔符</br>
3. <i>可选</i>是否根据换行符进行分解，为 <code>nocrlf</code> 时则是`,
    en: `1. Original string</br>2. Separator</br>
3. <i>Optional</i>Whether to decompose according to the line break, when it is <code>nocrlf</code>, it is`,
    ja: `1. 元の文字列</br>2. 区切り文字</br>
3. <i>オプション</i>改行に従って分解するかどうか。`,
  },
  tokensReturns: {
    zh: '分解后的字符串数组',
    en: '',
    ja: '分割後の文字列配列',
  },
  sprintfDesc: {
    zh: '字符串格式化，格式字符串的用法详见 <a href="https://erlang.org/doc/man/io.html#fwrite-1">https://erlang.org/doc/man/io.html#fwrite-1</a> 里的 Format 部分',
    en: '',
    ja: '文字列のフォーマット。フォーマット文字列の使い方は <a href="https://erlang.org/doc/man/io.html#fwrite-1">https://erlang.org/doc/man/io.html#fwrite-1</a>のFormatセクションを参照。',
  },
  sprintfParams: {
    zh: '1. 格式字符串 <br />2,3,4... 参数列表。参数个数不定',
    en: '',
    ja: '1. フォーマット文字列 <br />2,3,4... 引数リスト(可変長)',
  },
  sprintfReturns: {
    zh: '分解后的字符串数组',
    en: '',
    ja: '分解后的字符串数组',
  },
  padDesc: {
    zh: '将指定字符串填充到指定长度',
    en: 'Fill the specified string to the specified length.',
    ja: '指定した文字列を指定した長さにパディングする',
  },
  padParams: {
    zh: `1. 原字符串 <br />2. 字符总长度 <br />
3. <i>可选</i>填充的位置，<code>trailing</code>，<code>both</code> 或 <code>leading</code>，默认为 <code>trailing</code><br />
4. <i>可选</i>指定用于补足的字符，默认为空格`,
    en: `1. Original string <br />2. Total length of characters <br />
3. <i>Optional</i>Filling position, <code>trailing</code>, <code>both</code> or <code>leading</code>, default is <code>trailing</code><br />
4. <i>Optional</i>Specify the character for filling, default to space`,
    ja: `1.  元の文字列 <br />2. 全体の長さ <br />3. <i>オプション</i>パディング位置、<code>trailing</code>、<code>both</code>、 <code>leading</code>のいずれか。デフォルトは <code>trailing</code><br />
    4. <i>オプション</i>パディング文字。デフォルトはスペース`,
  },
  padReturns: {
    zh: '补足后的字符串',
    en: '',
    ja: 'パディング後の文字列',
  },
  replaceDesc: {
    zh: '在字符串中搜索并替换指定的文本',
    en: 'Search and replace specified text in a string',
    ja: '文字列内を検索して指定テキストを置換',
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
    ja: `1. 元の文字列 <br />2. 置換対象の文字列 <br />3. 置換文字列 <br />
2. <i>オプション</i>置換ルール。デフォルトは <code>all</code>。
<ul>
  <li><code>all</code>: 一致するすべての部分文字列を置換。</li>
  <li><code>trailing</code>: 後ろから最初に一致した部分文字列を置換。</li>
  <li><code>leading</code>: 前から最初に一致した部分文字列を置換。</li>
  },
  replaceReturns: {
    zh: '替换后的字符串',
    en: 'Replaced string',
    ja: '置換後の文字列',
  },
  regexMatchDesc: {
    zh: '判断字符串是否与某正则表达式匹配',
    en: '',
    ja: '文字列が指定した正規表現にマッチするか判定',
  },
  regexMatchParams: {
    zh: '1. 原字符串 <br />2. 正则表达式',
    en: '',
    ja: '1. 元の文字列 <br />2. 正規表現',
  },
  regexMatchReturns: {
    zh: 'true 或 false',
    en: '',
    ja: '真偽値',
  },
  regexReplaceDesc: {
    zh: '替换字符串中匹配到某正则表达式的子串',
    en: '',
    ja: '文字列内の指定した正規表現にマッチする部分文字列を置換',
  },
  regexReplaceParams: {
    zh: '1. 原字符串 <br />2. 正则表达式 <br />3. 指定用于替换的字符串',
    en: '',
    ja: '1. 元の文字列 <br />2. 正規表現 <br />3. 置換文字列',
  },
  regexReplaceReturns: {
    zh: '替换后的字符串',
    en: '',
    ja: '置換後の文字列',
  },
  asciiDesc: {
    zh: '返回字符对应的 ASCII 码',
    en: '',
    ja: '文字のASCIIコードを取得',
  },
  asciiParams: {
    zh: '1. 字符',
    en: '',
    ja: '文字',
  },
  asciiReturns: {
    zh: '整数值，字符对应的 ASCII 码',
    en: '',
    ja: '整数のASCIIコード',
  },
  findDesc: {
    zh: '查找并返回字符串中的某个子串',
    en: 'Find and return a substring in a string.',
    ja: '文字列内の部分文字列を検索して返す',
  },
  findParams: {
    zh: '1. 原字符串 <br />2. 要查找的子串<br /> 3. < i > 可选</i> 指定查找方向，默认为 <code> leading</code>
  <ul>
    <li><code>leading</code>从字符串的头部开始查找</li>
    <li><code>trailing</code>从字符串的尾部开始查找</li>
  </ul>',
    en: '1. Original string <br /> 2. Substring to be searched for<br />
3. < i > Optional</i > Specify search direction, default is <code> leading</code>
  <ul>
    <li><code>leading</code>: start searching from the beginning of the string</li>
    <li><code>trailing</code>: start searching from the end of the string</li>
  </ul>',
    ja: '1. 元の文字列 <br /> 2. 検索文字列<br />
3. < i > オプション</i > 検索方向。デフォルトは <code> leading</code>
  <ul>
    <li><code>leading</code>: 先頭から検索</li>
    <li><code>trailing</code>: 末尾から検索</li>
  </ul>',
  },
  findReturns: {
    zh: '查找到的子串，如找不到则返回空字符串',
    en: 'The substring found, if not found, returns an empty string.',
    ja: '見つかった部分文字列。見つからない場合は空文字列。',
  },
  mapGetDesc: {
    zh: '取 Map 中某个 Key 的值',
    en: 'Take the value of a Key in the Map',
    ja: 'マップから指定キーの値を取得',
  },
  mapGetParams: {
    zh: '1. Key：需要获取的 Key，支持嵌套的 Key，比如 <code> a.b.c</code> <br /> 2. Map：从中获取 Key 的值的 Map <br />3. < i > 可选</i > Default Value：当 Map 中不存在指定的 Key 时，返回的默认值',
    en: '1. Key: The key that needs to be obtained, supports nested keys, such as <code>a.b.c</code> <br /> 2. Map: The map from which the value of the key is obtained <br />3. < i > Optional</i > Default Value: The default value returned when the specified key does not exist in the map.',
    ja: '1. キー: 取得したいキーを指定。ネストキーに対応、例<code>a.b.c</code> <br /> 2. マップ: キーの値を取得するマップ <br />3. < i >オプション</i > デフォルト値: キーが存在しない場合のデフォルト値。',
  },
  mapGetReturns: {
    zh: 'Map 中某个 Key 的值',
    en: 'The value of a Key in the Map',
    ja: 'マップ内のキーの値',
  },
  mapPutDesc: {
    zh: '向 Map 中插入值',
    en: 'Insert value into Map',
    ja: 'マップに値を挿入する',
  },
  mapPutParams: {
    zh: '1. Key <br />2. Value <br />3. Map',
    en: '1. Key <br />2. Value <br />3. Map',
    ja: '1. キー <br />2. 値<br />3. マップ',
  },
  mapPutReturns: {
    zh: '插入后的 Map。支持嵌套的 Key，比如 "a.b.c"',
    en: 'The inserted Map. Support nested keys, such as "a.b.c"',
    ja: '挿入後のマップ。ネストキーに対応、例 "a.b.c"',
  },
  nthDesc: {
    zh: '取第 n 个元素，下标从 1 开始',
    en: 'Take the nth element, and subscripts start at 1',
    ja: '配列からn番目の要素を取得。インデックスは1起点',
  },
  nthParams: {
    zh: '1. 起始位置 <br /> 2. 原数组',
    en: 'Original array',
    ja: '1. 起点のインデックス <br />2. 元の配列',
  },
  nthReturns: {
    zh: '第 n 个元素',
    en: 'Nth element',
    ja: 'n番目の要素',
  },
  lengthDesc: {
    zh: '获取数组的长度',
    en: 'Get the length of an array',
    ja: '配列の長さを取得',
  },
  lengthParams: {
    zh: '1. 原数组',
    en: 'Original array',
    ja: '元の配列',
  },
  lengthReturns: {
    zh: '数组长度',
    en: 'the length of an array',
    ja: '配列の長さ',
  },
  sublistDesc: {
    zh: '截取子数组',
    en: 'Extract subarray',
    ja: '部分配列を取得',
  },
  sublistParams: {
    zh: '1. < i > 可选</i > 指定截取的开始位置，下标从 1 开始，默认为 1</br >
  2. 截取的数组的长度</br > 3. 原数组',
    en: '1. < i > Optional</i > Specify the starting position of the interception, with an index starting from 1, default to 1</br >
  2. The length of the intercepted array.</br > 3. The original array.'
    ja: '1. < i > オプション</i > 開始インデックス。1起点で、デフォルトは1</br >
  2. 部分配列の長さ。</br > 3. 元の配列。',
  },
  sublistReturns: {
    zh: '子数组',
    en: 'sub-array',
    ja: '部分配列',
  },
  firstDesc: {
    zh: '取第 1 个元素。下标从 1 开始',
    en: 'Take the first element. Subscripts start at 1',
    ja: '最初の要素を取得。1起点',
  },
  firstParams: {
    zh: '1. 原数组',
    en: 'Original array',
    ja: '元の配列',
  },
  firstReturns: {
    zh: '第 1 个元素',
    en: '1st element',
    ja: '最初の要素',
  },
  lastDesc: {
    zh: '取最后一个元素。',
    en: 'take the last element',
    ja: '最後の要素を取得',
  },
  lastParams: {
    zh: '1. 原数组',
    en: 'Original array',
    ja: '元の配列',
  },
  lastReturns: {
    zh: '最后一个元素',
    en: 'the last element',
    ja: '最後の要素',
  },
  containsDesc: {
    zh: '判断数据是否在数组里面',
    en: 'Determine whether the data is in the array',
    ja: '配列に値が含まれるか判定',
  },
  containsParams: {
    zh: '1. 数据 <br />2. 原数组',
    en: '1. data <br />2. Original array',
    ja: '1. 値 <br />2. 元の配列',
  },
  containsReturns: {
    zh: 'Boolean 值',
    en: 'Boolean value',
    ja: '真偽値',
  },
  md5Desc: {
    zh: '求 MD5 值',
    en: 'evaluate MD5',
    ja: 'MD5ハッシュを計算',
  },
  md5Params: {
    zh: '数据',
    en: 'data',
    ja: 'データ',
  },
  md5Returns: {
    zh: 'MD5 值',
    en: 'MD5 value',
    ja: 'MD5ハッシュ',
  },
  shaDesc: {
    zh: '求 SHA 值',
    en: 'evaluate SHA',
    ja: 'SHAハッシュを計算',
  },
  shaParams: {
    zh: '数据',
    en: 'data',
    ja: 'データ',
  },
  shaReturns: {
    zh: 'SHA 值',
    en: 'SHA value',
    ja: 'SHAハッシュ',
  },
  sha256Desc: {
    zh: '求 SHA256 值',
    en: 'evaluate SHA256',
    ja: 'SHA256ハッシュを計算',
  },
  sha256Params: {
    zh: '数据',
    en: 'data',
    ja: 'データ',
  },
  sha256Returns: {
    zh: 'SHA256 值',
    en: 'SHA256 value',
    ja: 'SHA256ハッシュ',
  },
  gzipDesc: {
    zh: '压缩数据，结果包含 gz 数据头和校验和',
    en: 'Compresses data with gz headers and checksum.',
    ja: 'gzipヘッダとチェックサムを含めてデータを圧縮',
  },
  gzipParams: {
    zh: '原始的二进制数据',
    en: 'Raw binary data',
    ja: '生のバイナリデータ',
  },
  gzipReturns: {
    zh: '压缩后的二进制数据',
    en: 'Compressed binary data',
    ja: '圧縮後のバイナリデータ',
  },
  gunzipDesc: {
    zh: '解压缩数据，原始数据中包含 gz 数据头和校验和',
    en: 'Uncompresses data with gz headers and checksum.',
    ja: 'ヘッダとチェックサムを含むgzip圧縮データを解凍',
  },
  gunzipParams: {
    zh: '压缩后的二进制数据',
    en: 'Compressed binary data',
    ja: '圧縮バイナリデータ',
  },
  gunzipReturns: {
    zh: '原始的二进制数据',
    en: 'Raw binary data',
    ja: '生のバイナリデータ',
  },
  zipDesc: {
    zh: '压缩数据，结果不包含 zlib 数据头和校验和',
    en: 'Compresses data without zlib headers and checksum.',
    ja: 'zlibヘッダとチェックサムなしでデータを圧縮',
  },
  zipParams: {
    zh: '原始的二进制数据',
    en: 'Raw binary data',
    ja: '生のバイナリデータ',
  },
  zipReturns: {
    zh: '压缩后的二进制数据',
    en: 'Compressed binary data',
    ja: '圧縮後のバイナリデータ',
  },
  unzipDesc: {
    zh: '解压缩数据，原始数据中不包含 zlib 数据头和校验和',
    en: 'Uncompresses data without zlib headers and checksum.',
    ja: 'zlibヘッダとチェックサムなしの圧縮データを解凍',
  },
  unzipParams: {
    zh: '压缩后的二进制数据',
    en: 'Compressed binary data',
    ja: '圧縮バイナリデータ',
  },
  unzipReturns: {
    zh: '原始的二进制数据',
    en: 'Raw binary data',
    ja: '生のバイナリデータ',
  },
  zipCompressDesc: {
    zh: '压缩数据，结果包含 zlib 数据头和校验和',
    en: 'Compresses data with zlib headers and checksum.',
    ja: 'zlibヘッダとチェックサムを含めてデータを圧縮',
  },
  zipCompressParams: {
    zh: '原始的二进制数据',
    en: 'Raw binary data',
    ja: '生のバイナリデータ',
  },
  zipCompressReturns: {
    zh: '压缩后的二进制数据',
    en: 'Compressed binary data',
    ja: '圧縮後のバイナリデータ',
  },
  zipUncompressDesc: {
    zh: '解压缩数据，原始数据中包含 zlib 数据头和校验和',
    en: 'Uncompresses data with zlib headers and checksum.',
    ja: 'ヘッダとチェックサムを含むzlib圧縮データを解凍',
  },
  zipUncompressParams: {
    zh: '压缩后的二进制数据',
    en: 'Compressed binary data',
    ja: '圧縮バイナリデータ',
  },
  zipUncompressReturns: {
    zh: '原始的二进制数据',
    en: 'Raw binary data',
    ja: '生のバイナリデータ',
  },
  // TODO: desc
  subbitsDesc: {
    zh: '从二进制数据的指定下标位置获取指定长度的比特位，然后按照给定的参数转换为想要的数据类型',
    en: 'Get a given length of bits start from the specified offset of a binary, and then convert it to a data type according to the arguments provided',
    ja: '指定位置から指定ビット長を取得して、指定したデータ型に変換する',
  },
  subbitsParams: {
    zh: '请查看官网文档',
    en: 'Please refer to the official website documentation.',
    ja: '公式ドキュメントを参照',
  },
  subbitsReturns: {
    zh: '获取到的数据',
    en: 'The data got from the binary',
    ja: '取得したデータ',
  },
  base64EncodeDesc: {
    zh: 'BASE64 编码',
    en: 'BASE64 encode',
    ja: 'Base64エンコード',
  },
  base64EncodeParams: {
    zh: '要编码的二进制数据',
    en: 'The binary to be encoded',
    ja: 'エンコード対象のバイナリデータ',
  },
  base64EncodeReturns: {
    zh: 'Base64 编码的字符串',
    en: 'The encoded base64-formatted string',
    ja: 'Base64エンコード文字列',
  },
  base64DecodeDesc: {
    zh: 'BASE64 解码',
    en: 'BASE64 decode',
    ja: 'Base64デコード',
  },
  base64DecodeParams: {
    zh: 'Base64 编码的字符串',
    en: 'The base64-formatted string to be decoded',
    ja: 'Base64エンコード文字列',
  },
  base64DecodeReturns: {
    zh: '解码后的二进制数据',
    en: 'The decoded binary',
    ja: 'デコード後のバイナリデータ',
  },
  jsonEncodeDesc: {
    zh: 'JSON 编码',
    en: 'JSON encode',
    ja: 'JSONエンコード',
  },
  jsonEncodeParams: {
    zh: '要转成 JSON 的数据结构',
    en: 'The data to be encoded',
    ja: 'JSONとしてエンコードするデータ',
  },
  jsonEncodeReturns: {
    zh: 'JSON 字符串',
    en: 'The JSON string',
    ja: 'JSON文字列',
  },
  jsonDecodeDesc: {
    zh: 'JSON 解码',
    en: 'JSON decode',
    ja: 'JSONデコード',
  },
  jsonDecodeParams: {
    zh: '要解码的 JSON 字符串',
    en: 'The JSON string to be decoded',
    ja: 'デコード対象のJSON文字列',
  },
  jsonDecodeReturns: {
    zh: '解码后的数据结构',
    en: 'The decoded data',
    ja: 'デコード後のデータ',
  },
  bin2HexstrDesc: {
    zh: '二进制数据转为 Hex 字符串',
    en: 'Binary to Hex String',
    ja: 'バイナリを16進文字列に変換',
  },
  bin2HexstrParams: {
    zh: '二进制数据',
    en: 'The binary',
    ja: 'バイナリデータ',
  },
  bin2HexstrReturns: {
    zh: 'Hex 字符串',
    en: 'The hex string',
    ja: '16進文字列',
  },
  hexstr2BinDesc: {
    zh: 'Hex 字符串转为二进制数据',
    en: 'Binary to Hex String',
    ja: '16進文字列をバイナリに変換',
  },
  hexstr2BinParams: {
    zh: 'Hex 字符串',
    en: 'The hex string',
    ja: '16進文字列',
  },
  hexstr2BinReturns: {
    zh: '二进制数据',
    en: 'The binary',
    ja: 'バイナリデータ',
  },
  nowTimestampDesc: {
    zh: '返回当前时间的 Unix 时间戳',
    en: 'Return the unix epoch of now',
    ja: '現在のUnixタイムスタンプを取得',
  },
  nowTimestampParams: {
    zh: '1. < i > 可选</i > 时间单位，可设置为 <code> second</code>，<code>millisecond</code>，<code>microsecond</code> 或 <code> nanosecond</code>，默认为 <code> second</code> ',
    en: '1. < i > Optional</i > Time unit, can be set to <code> second</code>, <code>millisecond</code>, <code>microsecond</code>, or <code> nanosecond</code>, default is <code> second</code> ',
    ja: '1. < i >オプション</i > 時間の単位。<code>秒</code>、<code>ミリ秒</code>、<code>マイクロ秒</code>、または<code>ナノ秒</code>が選べます。デフォルトは<code> 秒</code>です。',    
  },
  nowTimestampReturns: {
    zh: 'Unix 时间戳',
    en: 'The unix epoch',
    ja: 'Unixエポック',
  },
  nowRfc3339Desc: {
    zh: '指定时间单位，生成当前时间的 RFC3339 字符串',
    en: 'Create a RFC3339 time string of now, in given time unit',
    ja: '指定した時間単位で現在時刻のRFC3339文字列を取得',
  },
  nowRfc3339Params: {
    zh: '1. < i > 可选</i > 时间单位，可设置为 <code> second</code>，<code>millisecond</code>，<code>microsecond</code> 或 <code> nanosecond</code>，默认为 <code> second</code> `,
    en: `1. < i > Optional</i > Time unit, can be set to <code> second</code>, <code>millisecond</code>, <code>microsecond</code>, or <code> nanosecond</code>, default is <code> second</code> `,
    ja: `1. < i >オプション</i > 時間の単位。<code>秒</code>、<code>ミリ秒</code>、<code>マイクロ秒</code>、または<code>ナノ秒</code>が選べます。デフォルトは<code> 秒</code>です。`,
  },
  nowRfc3339Returns: {
    zh: 'RFC3339 时间字符串',
    en: 'The time string of format RFC3339',
    ja: 'RFC3339時刻文字列',
  },
  unixTsToRfc3339Desc: {
    zh: '将输入的时间戳转换为 RFC3339 时间字符串',
    en: 'Convert an unix epoch to RFC3339 time string',
    ja: 'UnixタイムスタンプをRFC3339時刻文字列に変換',
  },
  unixTsToRfc3339Params: {
    zh: `1. Unix 时间戳 <br />
  2. < i > 可选</i > Unix 时间戳的时间单位，可为 <code> second</code>，<code>millisecond</code>，<code>microsecond</code> 或 <code> nanosecond</code>，默认为 <code> second</code> `,
    en: `1. Unix timestamp <br />
  2. < i > Optional</i > Time unit for Unix timestamp, can be <code> second</code>, <code>millisecond</code>, <code>microsecond</code>, or <code> nanosecond</code>.Default is <code> second</code> `,
    ja: `1.  Unixタイムスタンプ<br />
  2. < i >オプション</i >タイムスタンプの単位。<code>秒</code>、<code>ミリ秒</code>、<code>マイクロ秒</code>、または<code>ナノ秒</code>が選べます。デフォルトは<code> 秒</code>です。`,
  },

  unixTsToRfc3339Returns: {
    zh: 'RFC3339 时间字符串',
    en: 'The time string of format RFC3339',
    ja: 'RFC3339時刻文字列',
  },
  rfc3339ToUnixTsDesc: {
    zh: '将 RFC3339 时间字符串转换为 Unix 时间戳',
    en: 'Convert a RFC3339 time string to unix epoch',
    ja: 'RFC3339の時刻文字列をUnixエポックに変換する',
  },
  rfc3339ToUnixTsParams: {
    zh: `1. RFC3339 时间字符串 </br >
  2. < i > 可选</i > RFC3339 时间字符串的时间单位，可为 <code> second</code>，<code>millisecond</code>，<code>microsecond</code> 或 <code> nanosecond</code>，默认为 <code> second</code> `,
    en: `1. RFC3339 time string </br >
  2. < i > Optional</i > Unit of RFC3339 time string, can be <code> second</code>, <code>millisecond</code>, <code>microsecond</code>, or <code> nanosecond</code>, default is <code> second</code> `,
    ja: `1. RFC3339の時刻文字列 </br >
  2. < i >オプショナル</i > RFC3339の時刻文字列の単位。<code>秒</code>、<code>ミリ秒</code>、<code>マイクロ秒</code>、または<code>ナノ秒</code>が選べます。デフォルトは<code> 秒</code>です。`,
  },
  
  rfc3339ToUnixTsReturns: {
    zh: 'Unix 时间戳',
    en: 'The unix epoch',
    ja: 'Unixエポック',
  },
  formatDateDesc: {
    zh: '时间戳转格式化时间',
    en: 'Timestamp to formatted time',
    ja: 'タイムスタンプからフォーマットされた時間へ',
  },
  formatDateParams: {
    zh: '1. 时间戳精度（参考时间戳精度定义）</br>2. 时间偏移量（参考时间偏移量定义）</br>3. 日期格式（参考时间字符串编解码格式）</br>4. 时间戳（可选参数，默认为当前时间）',
    en: '1. The time unit (refer to The time unit)</br>2. The time offset (refer to time offset definition)</br>3. The date format (refer to time string codec format)</br>4. The timestamp (optional parameter, default is current time)',
    ja: '1. 時間の単位（時間の単位の定義を参照）</br>2. 時間のオフセット（時間のオフセットの定義を参照）</br>3. 日付の形式（時間の文字列のコーデック形式を参照）</br>4. タイムスタンプ（オプション、デフォルトは現在の時間）',
  },
  formatDateReturns: {
    zh: '格式化时间字符串',
    en: 'Formatted time',
    ja: 'フォーマットされた時間',
  },
  dateToUnixTsDesc: {
    zh: '格式化时间转时间戳',
    en: 'Formatted time to timestamp',
    ja: 'フォーマットされた時間からタイムスタンプへ',
  },
  dateToUnixTsParams: {
    zh: '1. 时间戳精度（参考时间戳精度定义）</br>2. 时间偏移量（可选，未填写时，使用格式化时间字符串中的时间偏移量，参考时间偏移量定义）</br> 3. 日期格式（参考时间字符串编解码格式）</br>4. 格式化时间字符串',
    en: '1. The time unit (refer to the following table for definition) </br>2. The time offset (optional, when not filled, use the time offset in the formatted time string, refer to the time offset definition) </br>3. The date format (refer to time string codec format) </br>4. The formatted time string',
    ja: '1. 時間の単位（以下のテーブルの定義を参照）</br>2. 時間のオフセット（オプション、未記入の場合、フォーマットされた時間の文字列内のオフセットを使用する、時間のオフセットの定義を参照）</br>3. 日付の形式（時間の文字列のコーデック形式を参照）</br>4. フォーマットされた時間の文字列。',
  },
  dateToUnixTsReturns: {
    zh: 'Unix 时间戳',
    en: 'The unix epoch',
    ja: 'Unixエポック',
  },
  jqDesc: {
    zh: `JQ 是一款功能强大的命令行工具和编程语言，主要用于转换和查询 JSON 编码的消息。<br />
对于规则 SQL 及其内置函数很难或无法实现的 JSON 消息处理，使用 JQ 函数可以很方便地实现。`,
    en: `JQ is a powerful command line tool and programming language designed primarily for transforming and querying data encoded as JSON.<br />
  Typical JQ programs describe simple transformations or filters for JSON data, but one can also use JQ to perform complex computations when needed.`,
  ja: `JQは、主にJSONとしてエンコードされたデータの変換やクエリのために設計された強力なコマンドラインツールおよびプログラミング言語です。<br />
  典型的なJQのプログラムは、JSONデータの簡単な変換やフィルターを記述しますが、必要に応じてJQを使用して複雑な計算を実行することもできます。`,
  },  
  jqParams: {
    zh: `1. 有效的 jq 程序字符串 <br /> 2. JSON 编码的字符串或对象 <br /> 3.执行超时（可选，单位为毫秒，默认为 10 秒）`,
    en: `1. string containing valid jq program <br /> 2. JSON encoded string or object <br /> 3. Optional, integer timeout value(milliseconds, default is 10 seconds)`,
    ja: `1. 有効なjqプログラムを含む文字列 <br /> 2. JSONでエンコードされた文字列またはオブジェクト <br /> 3. オプション、整数のタイムアウト値（ミリ秒、デフォルトは10秒）`,
  },
  jqReturns: {
    zh: '返回值为执行生成生成的 JSON 对象列表。如果执行超时或者 JQ 程序抛出异常，该函数将抛出异常。',
    en: 'list of objects corresponding to the JSON objects generated by the given JQ program (parameter 1) when given the input provided by parameter 2. The function throws an exception if the execution did not finish before the timeout or if the jq program throws an exception.',
    ja: '指定されたJQプログラム（パラメータ1）によって生成されたJSONオブジェクトに対応するオブジェクトのリスト。実行がタイムアウト前に終了しなかった場合、またはjqプログラムが例外をスローした場合、関数は例外をスローします。',
  },
}
