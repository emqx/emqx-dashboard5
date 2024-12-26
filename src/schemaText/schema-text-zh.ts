export default {
  /* MQTT START */
  exclusive_subscription: {
    label: '允许排它订阅',
  },
  max_topic_alias: {
    label: '最大主题别名数',
  },
  use_username_as_clientid: {
    desc: '是否使用用户名作为客户端 ID。 作用时间晚于 <code>对端证书作为用户名</code> 和 <code>对端证书作为客户端 ID</code>。',
    label: '使用用户名作为客户端 ID',
  },
  idle_timeout: {
    desc: '设置连接被断开或进入休眠状态前的等待时间，空闲超时后\n\n- 如暂未收到客户端的 CONNECT 报文，连接将断开；\n- 如已收到客户端的 CONNECT 报文，连接将进入休眠模式以节省系统资源。\n\n注意：请合理设置该参数值，如等待时间设置过长，可能造成系统资源的浪费。',
    label: '空闲超时',
  },
  strict_mode: {
    desc: '是否以严格模式解析 MQTT 消息。严格模式下，如客户端 ID、主题名称等中包含无效 utf8 字符串，连接将被断开。',
    label: '严格模式',
  },
  shared_subscription: {
    label: '允许共享订阅',
  },
  server_keepalive: {
    label: '服务端 Keep Alive',
  },
  wildcard_subscription: {
    label: '允许通配符订阅',
  },
  max_clientid_len: {
    label: '最大客户端 ID 长度',
  },
  response_information: {
    desc: 'UTF-8 字符串，用于指定返回给客户端的响应主题，如 `reqrsp/`，此时请求和应答客户端都需要使用 `reqrsp/` 前缀的主题来完成通讯。如希望禁用此功能，请在下方的文字框中输入`""`；仅适用于 MQTT 5.0 客户端。',
    label: '响应信息',
  },
  shared_subscription_initial_sticky_pick: {
    label: '共享订阅初始 Sticky 选择策略',
    desc: '当`共享订阅策略`设置为 `sticky` 时，用于初始订阅者选择的策略：<br/> - `random`：随机选择订阅者；<br/> - `local`：随机选择当前节点上的订阅者，如果当前节点上没有订阅者，则在集群内随机选择；<br/> - `hash_clientid`：通过对发布者的客户端ID进行哈希来选择订阅者；<br/> - `hash_topic`：通过对发布主题进行哈希来选择订阅者。',
  },
  peer_cert_as_username: {
    desc: '使用对端证书中的 CN、DN 字段或整个证书内容来作为用户名；仅适用于 TLS 连接。\n目前支持：\n- <code>cn</code>: 取证书的 CN 字段\n- <code>dn</code>: 取证书的 DN 字段\n- <code>crt</code>: 取 <code>DER</code> 或 <code>PEM</code> 的证书内容\n- <code>pem</code>: 将 <code>DER</code> 证书转换为 <code>PEM</code> 格式作为用户名\n- <code>md5</code>: 取 <code>DER</code> 或 <code>PEM</code> 证书内容的 MD5 值',
    label: '使用对端证书作为用户名',
  },
  client_attrs_init: {
    label: '客户端属性',
    desc: "指定如何初始化客户端属性。<br />每个客户端属性可以初始化为 `client_attrs.{'{'}NAME{'}'}`，<br />其中 `{'{'}NAME{'}'}` 是配置字段 `set_as_attr` 中指定的属性名称。<br /><br />初始化的客户端属性将存储在带有指定名称的 `client_attrs` 属性中，<br />并可用作渲染挂载点、身份验证和授权请求的模板变量。<br /><br />例如，当 `set_as_attr = tns` 时，使用 `${'{'}client_attrs.tns{'}'}` 渲染 HTTP POST 正文，<br />或渲染监听器配置 `moutpoint = ${'{'}client_attrs.tns{'}'}/` 用于主题命名空间。",
  },
  client_attrs_init_set_as_attr: {
    label: '属性',
  },
  client_attrs_init_expression: {
    label: '属性表达式',
    desc: "使用行表达式计算一组预定义的字符串函数（类似于规则引擎 SQL 语句）。<br />表达式可以是带有嵌套调用参数的函数调用，或直接引用变量。<br />目前不提供用户自定义变量绑定（如 `var a=1`）或用户自定义函数。<br />例如，要提取以点分隔的客户端 ID 前缀：`nth(1, tokens(clientid, '.'))`。<br /><br />预绑定的变量有：<br />- `clientid`：MQTT 客户端 ID。<br />- `username`：MQTT 客户端的用户名。<br />- `user_property.{'{'}NAME{'}'}`：CONNECT 数据包中的用户属性。<br />对于 TLS 客户端，直接连接或通过支持代理协议（v2）的负载均衡器连接，<br />可以使用一些额外的变量：<br />- `cn`：客户端 TLS 证书的通用名称。<br />- `dn`：客户端 TLS 证书的可分辨名称（主题）。<br />- `peersni`：客户端发送的 TLS 服务器名称指示。<br /><br />您可以在 EMQX 文档中阅读更多关于 variform 表达式的信息。",
  },
  clientid_override: {
    label: '客户端 ID 重写表达式',
    desc: "使用行表达式计算一组预定义的字符串函数（类似于规则引擎 SQL 语句）。<br />表达式可以是带有嵌套调用参数的函数调用，或直接引用变量。<br />目前不提供用户自定义变量绑定（如 `var a=1`）或用户自定义函数。<br />例如，要提取以点分隔的客户端 ID 前缀：`nth(1, tokens(username, '.'))`。<br /><br />预绑定的变量有：<br />- `clientid`：原始 MQTT 客户端 ID。<br />- `username`：MQTT 客户端的用户名。<br />- `client_attrs.{'{'}NAME{'}'}`：通过每个配置的 `client_attrs_init` 初始化的客户端属性。<br />对于 TLS 客户端，直接连接或通过支持代理协议（v2）的负载均衡器连接，<br />可以使用一些额外的变量：<br />- `cn`：客户端 TLS 证书的通用名称。<br />- `dn`：客户端 TLS 证书的可分辨名称（主题）。<br />- `peersni`：客户端发送的 TLS 服务器名称指示。<br /><br />您可以在 EMQX 文档中阅读更多关于 variform 表达式的信息。",
  },
  retain_available: {
    desc: '是否启用对 MQTT 保留消息的支持。禁用此选项时，客户端将无法发布保留消息。',
    label: '启用保留消息',
  },
  message_expiry_interval: {
    desc: 'MQTT 消息的过期时间间隔。对于 MQTT 5.0 版本的客户端，此设置仅在消息未指定 Message-Expiry-Interval 属性时才会生效。对于 MQTT 3.1 和 3.1.1 版本，此设置始终适用。值得注意的是，将此值设定为大于会话过期间隔是无效的，因为一旦会话过期，所有相关消息都将被清除。',
    label: '消息过期间隔',
  },
  ignore_loop_deliver: {
    desc: '设置由 MQTT v3.1.1/v3.1.0 客户端发布的消息是否将转发给其本身；类似 MQTT 5.0 协议中的 `No Local` 选项。',
    label: '忽略循环投递',
  },
  max_qos_allowed: {
    label: '最大 QoS',
  },
  max_topic_levels: {
    label: '最大主题层级',
  },
  peer_cert_as_clientid: {
    desc: '使用对端证书中的 CN、DN 字段或整个证书内容来作为客户端 ID。仅适用于 TLS 连接；\n目前支持：\n- <code>cn</code>: 取证书的 CN 字段\n- <code>dn</code>: 取证书的 DN 字段\n- <code>crt</code>: 取 <code>DER</code> 或 <code>PEM</code> 证书的内容\n- <code>pem</code>: 将 <code>DER</code> 证书内容转换为 <code>PEM</code> 格式作为客户端 ID\n- <code>md5</code>: 取 <code>DER</code> 或 <code>PEM</code> 证书内容的 MD5 值',
    label: '使用对端证书作为客户端 ID',
  },
  keepalive_multiplier: {
    desc: '`Keep-Alive Timeout = Keep-Alive Interval × Keep-Alive Multiplier`，根据 MQTT 5.0，默认值为1.5。\n\n例如，如果 Keep-Alive interval 为 10 秒，那么乘以 1.5 的倍数，将产生 15 秒的超时。将倍数值增加到 2，超时将延长到 20 秒。',
    label: 'Keep Alive 倍数',
  },
  shared_subscription_strategy: {
    label: '共享订阅策略',
    desc: '共享订阅的调度策略。<br/>- `random`：将消息分配给随机选择的订阅者。<br/>- `round_robin`：以循环方式选择订阅者。<br/>- `round_robin_per_group`：在每个共享订阅组内以循环方式选择订阅者。<br/>- `sticky`：始终使用最后选择的订阅者进行调度，直到订阅者断开连接。<br/>- `local`：如果本地订阅者不存在，则选择随机本地订阅者，否则选择随机集群广域订阅者。<br/>- `hash_topic`：通过主题源的哈希值选择订阅者。<br/>- `hash_clientid`：通过对发送者的客户端 ID 进行 Hash 处理来选择订阅者。',
  },
  keepalive_check_interval: {
    label: '保活检查间隔',
    desc: '检查传入 MQTT 数据包的频率决定了服务器检查新 MQTT 数据包的频率。<br />如果客户端在一定时间内没有发送任何数据包，这段时间将会累积。<br />一旦累积时间超过 `keepalive-interval * keepalive-multiplier`，连接将会被终止。<br />默认值设置为 30 秒，最小值为 1 秒，最大值为 `keepalive-interval / 2`。',
  },
  max_packet_size: {
    desc: '允许的最大 MQTT 报文大小，超出此大小后将断开当前客户端连接。',
    label: '最大报文大小',
  },
  /* MQTT END */
  /* SESSION START */
  max_subscriptions: {
    desc: '允许每个客户端建立的最大订阅数量。',
    label: '最大订阅数量',
  },
  upgrade_qos: {
    desc: '投递消息时，是否根据订阅主题时的 QoS 等级来强制提升派发消息的 QoS 等级。',
    label: '升级 QoS',
  },
  max_inflight: {
    desc: '完成应答前，最多允许同时投递的 QoS 1 和 QoS 2 消息数量。',
    label: '最大飞行窗口',
  },
  retry_interval: {
    desc: 'QoS 1/2 消息的重新投递间隔。',
    label: '消息重试间隔',
  },
  max_awaiting_rel: {
    desc: '为每个会话指定未收到 PUBREL 且未超时的最大 QoS 2 消息数量。超过限制后，新的 QoS 2 消息发布会被拒绝，并返回 147(0x93) 错误。',
    label: '最大待发 PUBREL 数量',
  },
  await_rel_timeout: {
    desc: '对于未收到 PUBREL 的 QoS 2 消息，将按照指定时间等待重传；超时后 EMQX 将释放  packet ID  并产生一条告警日志。\n注意：EMQX 对消息的转发操作不依赖于 PUBREL收到与否。',
    label: '最大 PUBREL 等待时长',
  },
  session_expiry_interval: {
    desc: '指定会话将在连接断开后多久过期，仅适用于非 MQTT 5.0 的连接。',
    label: '会话过期间隔',
  },
  max_mqueue_len: {
    desc: '最大消息队列长度。持久客户端断开连接或飞行窗口已满时，允许排队的的最大消息数量。',
    label: '最大消息队列长度',
  },
  mqueue_priorities: {
    desc: "主题优先级。优先级数字[1-255]。默认情况下没有优先级表，因此所有消息都被平等对待。<br/>注意：优先级主题名称中不允许使用逗号和等号。<br/>注意：不在优先级表中的主题的消息将根据 mqtt.mqueue_default_priority 的配置值被视为最高优先级或最低优先级。<br/>示例：<br/>要配置 'topic/1' > 'topic/2'：<br/>mqueue_priorities: {'{'}\"topic/1\": 10, \"topic/2\": 8{'}'}",
    label: '主题优先级',
  },
  mqueue_default_priority: {
    desc: '默认的主题优先级，不在 <code>主题优先级</code>（<code>mqueue_priorities</code>） 中的主题将会使用该优先级。',
    label: '默认主题优先级',
  },
  mqueue_store_qos0: {
    desc: '在连接断开但会话保持期间，是否需要在消息队列中存储 QoS 0 消息。',
    label: '存储 QoS 0 消息',
  },
  /* SESSION END */
  /* LOG START */
  enable: {
    desc: '启用此日志处理进程。',
    label: '启用日志处理进程',
  },
  level: {
    desc: '当前日志处理进程的日志级别。\n默认为 warning 级别。',
    label: '日志级别',
  },
  log_file_default_path: {
    desc: '日志文件路径及名字。',
    label: '日志文件名字',
  },
  payload_encode: {
    desc: '日志中 Payload 的编码方式。',
    label: 'Payload 编码',
  },
  rotation_count: {
    desc: '轮换的最大日志文件数。',
    label: '最大日志文件数',
  },
  rotation_size: {
    desc: '此参数控制日志文件轮换。 `infinity` 意味着日志文件将无限增长，否则日志文件将在达到 `max_size`（以字节为单位）时进行轮换。\n与 rotation count配合使用。如果 counter 为 10，则是10个文件轮换。',
    label: '日志文件轮换大小',
  },
  time_offset: {
    desc: '日志中的时间戳使用的时间偏移量。\n可选值为：\n  - <code>system</code>: 本地系统使用的时区偏移量\n  - <code>utc</code>: 0 时区的偏移量\n  - <code>+-[hh]:[mm]</code>: 自定义偏移量，比如 "-02:00" 或者 "+00:00"\n默认值为本地系统的时区偏移量：<code>system</code>。',
    label: '时间偏移量',
  },
  timestamp_format: {
    desc: '选择时间戳格式：<br/>- <code>auto</code>：根据日志的格式自动选择最合适的时间戳格式。对于 JSON 使用 <code>epoch</code>，对于文本则使用 <code>rfc3339</code>。<br/>- <code>epoch</code>：表示为自 Unix 纪元起的微秒数。<br/>- <code>rfc3339</code>：遵循 RFC3339 标准的时间格式。',
    label: '时间戳格式',
  },
  formatter: {
    desc: '选择日志格式类型。 <code>text</code> 用于纯文本，<code>json</code> 用于结构化日志记录。',
    label: '日志格式类型',
  },
  time_window: {
    desc: '日志节流的时间窗口，在设定的时间窗口内同一事件类型的日志只被记录一次以防止日志泛滥。时间窗口结束时将生成反映该时间段内的日志活动的详细日志。该窗口的最小可设置值为1秒。<br/>支持的事件如下：<br/>- authorization_permission_denied<br/>- cannot_publish_to_topic_due_to_not_authorized<br/>- cannot_publish_to_topic_due_to_quota_exceeded<br/>- connection_rejected_due_to_license_limit_reached<br/>- dropped_msg_due_to_mqueue_is_full',
    label: '时间窗口',
  },
  /* LOG END */
  /* ALARM START */
  cpu_check_interval: {
    desc: '定期 CPU 检查的时间间隔。',
    label: '定期 CPU 检查的时间间隔',
  },
  cpu_high_watermark: {
    desc: '在发出相应警报之前可以使用多少系统 CPU 的阈值，以系统CPU负载的百分比表示。',
    label: 'CPU 高水位线',
  },
  cpu_low_watermark: {
    desc: '在解除相应警报之前可以使用多少系统 CPU 的阈值，以系统CPU负载的百分比表示。',
    label: 'CPU 低水位线',
  },
  mem_check_interval: {
    desc: '定期内存检查的时间间隔。',
    label: '内存检查间隔',
  },
  procmem_high_watermark: {
    desc: '在发出相应警报之前，一个Erlang进程可以分配多少系统内存的阈值，以系统内存的百分比表示。',
    label: '进程内存高水位线',
  },
  sysmem_high_watermark: {
    desc: '在发出相应报警之前可以分配多少系统内存的阈值，以系统内存的百分比表示。',
    label: '系统内存高水位线',
  },
  busy_dist_port: {
    desc: '启用后，当用于集群接点之间 RPC 的连接过忙时，会触发一条带有 <code>busy_dist_port</code> 关键字的 warning 级别日志。\n同时还会发布一条主题为 <code>$SYS/sysmon/busy_dist_port</code> 的 MQTT 系统消息。',
    label: '启用分布式端口过忙监控',
  },
  busy_port: {
    desc: '当一个系统接口（例如 TCP socket）过忙，会触发一条带有 <code>busy_port</code> 关键字的 warning 级别的日志。\n同时还会发布一条主题为 <code>$SYS/sysmon/busy_port</code> 的 MQTT 系统消息。',
    label: '启用端口过忙监控',
  },
  large_heap: {
    desc: '当进程占用的堆内存超过 large_heap 指定的大小时，系统会触发一条带有 <code>large_heap</code> 关键字的 warning 级别日志。同时还会发布一条主题为 <code>$SYS/sysmon/large_heap</code> 的 MQTT 系统消息。',
    label: '启用大 heap 监控',
  },
  long_gc: {
    desc: '当系统检测到某个 Erlang 进程垃圾回收占用过长时间，会触发一条带有 <code>long_gc</code> 关键字的日志。\n同时还会发布一条主题为 <code>$SYS/sysmon/long_gc</code> 的 MQTT 系统消息。',
    label: '启用长垃圾回收监控',
  },
  long_schedule: {
    desc: "启用后，如果 Erlang VM 调度器出现某个任务占用时间过长时，会触发一条带有 'long_schedule' 关键字的日志。\n同时还会发布一条主题为 <code>$SYS/sysmon/long_schedule</code> 的 MQTT 系统消息。",
    label: '启用长调度监控',
  },
  process_check_interval: {
    desc: '定期进程限制检查的时间间隔。',
    label: '进程限制检查时间',
  },
  process_high_watermark: {
    desc: '在发出相应警报之前，本地节点上可以同时存在多少进程的阈值（以进程百分比表示）。',
    label: '进程数高水位线',
  },
  process_low_watermark: {
    desc: '在清除相应警报之前，本地节点上可以同时存在多少进程的阈值（以进程百分比表示）。',
    label: '进程数低水位线',
  },
}
