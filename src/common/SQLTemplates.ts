export default [
  {
    title: {
      zh: '选择指定主题的消息',
      en: 'Select messages from a topic.',
    },
    scene: {
      zh: '使用 SQL 选择特定主题，将命中主题的消息载荷筛选出来，可以使用通配符。',
      en: 'Use SQL to select a topic, filter out the message payloads that match the topic, and support topic wildcards.',
    },
    sql: `SELECT
  payload as p
FROM
  "t/#"`,
    input: {
      msg: 'hello',
    },
    outputs: {
      p: '{"msg": "hello"}',
    },
  },
  {
    title: {
      zh: '同时处理客户端连接、断开连接事件',
      en: 'Handle client connected and disconnect events in one SQL',
    },
    scene: {
      zh: '在一个 SQL 中处理多个主题/事件，避免重复创建规则。',
      en: 'Simultaneous selection of multiple topics/events in one SQL, no need to repeatedly create rules.',
    },
    sql: `SELECT
  *
FROM
  "$events/client_connected",
  "$events/client_disconnected"`,
    input: {},
    outputs: {
      username: 'u_emqx',
      timestamp: 1648870886819,
      sockname: '0.0.0.0:1883',
      reason: 'normal',
      proto_ver: 5,
      proto_name: 'MQTT',
      '...': '',
    },
  },

  {
    title: {
      zh: 'FOREACH 处理 JSON 数组并逐个输出',
      en: 'FOREACH - Process JSON arrays and output one by one',
    },
    scene: {
      zh: '数据类型为数组时，处理数组中的元素并逐个输出。',
      en: 'When the data type is an array, process the data in the array and output one by one.',
    },
    sql: `FOREACH
  payload.sensors
FROM 
  "t/#"`,
    input: {
      date: '2020-04-24',
      sensors: [
        { name: 'a', idx: 0 },
        { name: 'b', idx: 1 },
        { name: 'c', idx: 2 },
      ],
    },
    outputs: [
      {
        item: {
          name: 'a',
          idx: 0,
        },
        '...': '',
      },
      {
        item: {
          name: 'b',
          idx: 1,
        },
        '...': '',
      },
      {
        item: {
          name: 'c',
          idx: 2,
        },
        '...': '',
      },
    ],
  },
  {
    title: {
      zh: 'FOREACH 处理 JSON 数组选择指定字段并添加过滤条件',
      en: 'FOREACH - Process JSON arrays select specified fields and add filter conditions',
    },
    scene: {
      zh: '数据类型为数组时，遍历数组中的数据，选择需要的字段并添加过滤条件逐个输出。',
      en: 'When the data type is an array, traverse the array to select the required fields and add filter conditions to output one by one.',
    },
    sql: `FOREACH
  payload.sensors
DO
  clientid,
  item.name as name,
  item.idx as idx
INCASE
  item.idx >= 1
FROM "t/#"`,
    input: {
      date: '2020-04-24',
      sensors: [
        { name: 'a', idx: 0 },
        { name: 'b', idx: 1 },
        { name: 'c', idx: 2 },
      ],
    },
    outputs: [
      {
        name: 'b',
        idx: 1,
        clientid: 'c_emqx',
      },
      {
        name: 'c',
        idx: 2,
        clientid: 'c_emqx',
      },
    ],
  },

  {
    title: {
      zh: 'CASE-WHEN 从多个条件列表返回可能结果',
      en: 'CASE-WHEN - Return possible results from multiple lists of conditions',
    },
    scene: {
      zh: '设定多个计算条件，输出不同结果。',
      en: 'Set multiple calculation conditions and output different results.',
    },
    sql: `SELECT
  CASE WHEN payload.x < 0 THEN 0
       WHEN payload.x > 7 THEN 7
  ELSE payload.x
  END as x
FROM
  "t/#"`,
    input: { x: 8 },
    outputs: { x: 7 },
  },

  {
    title: {
      zh: '数组处理 - 从 JSON 格式的 payload 中获取嵌套的值',
      en: 'Array - Get nested values from JSON-formatted payload',
    },
    scene: {
      zh: '',
      en: 'en',
    },
    sql: `SELECT
  payload.data[1].id as id
FROM
  "t/#"`,
    input: {
      data: [
        { id: 1, name: 'steve' },
        { id: 2, name: 'bill' },
      ],
    },
    outputs: { id: 1 },
  },
]
