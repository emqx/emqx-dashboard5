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
  /* ALARM END */
  log_audit_path: {
    desc: '审计日志文件名称',
    label: '审计日志文件',
  },
  max_filter_size: {
    desc: '在数据库中存储最新的 N 条日志条目，以允许 `/audit` HTTP API 进行日志数据的过滤和检索。',
    label: '最大 Dashboard 记录数',
  },
  ignore_high_frequency_request: {
    desc: '忽略高频请求以避免淹没审计日志，例如被忽略的发布/订阅踢出 http api 请求。',
    label: '忽略高频请求',
  },
  ssl_opts_user_lookup_fun: {
    desc: '用于查找预共享密钥（PSK）标识的 EMQX 内部回调。',
    label: 'SSL PSK 用户回调',
  },
  ssl_opts_cacertfile: {
    label: 'CA Cert',
  },
  ssl_opts_verify: {
    label: '验证服务器证书',
  },
  ssl_opts_keyfile: {
    desc: 'PEM 格式的私钥文件。',
    label: 'Keyfile',
  },
  ssl_opts_certfile: {
    desc: 'PEM格式证书链文件<br/>\n此文件中的证书应与证书颁发链的顺序相反。也就是说，主机的证书应该放在文件的开头，\n然后是直接颁发者 CA 证书，依此类推，一直到根 CA 证书。\n根 CA 证书是可选的，如果想要添加，应加到文件到最末端。',
    label: 'Certfile',
  },
  ssl_opts_cacerts: {
    label: 'CA Cert',
  },
  ssl_opts_password: {
    desc: '包含用户密码的字符串。仅在私钥文件受密码保护时使用。',
    label: '密钥文件密码',
  },
  ssl_opts_hibernate_after: {
    desc: '在空闲一定时间后休眠 SSL 进程，减少其内存占用。',
    label: '空闲多久后休眠',
  },
  ssl_opts_versions: {
    desc: '支持所有TLS/DTLS版本<br/>\n注：PSK 的 Ciphers 无法在 <code>tlsv1.3</code> 中使用，如果打算使用 PSK 密码套件，请确保这里配置为 <code>["tlsv1.2","tlsv1.1"]</code>。',
    label: 'SSL 版本',
  },
  ssl_opts_secure_renegotiate: {
    desc: 'SSL 参数重新协商是一种允许客户端和服务器动态重新协商 SSL 连接参数的功能。\nRFC 5746 定义了一种更安全的方法。通过启用安全的重新协商，您就失去了对不安全的重新协商的支持，从而容易受到 MitM 攻击。',
    label: 'SSL 重新协商',
  },
  ssl_opts_reuse_sessions: {
    desc: '启用 TLS 会话重用。',
    label: 'TLS 会话重用',
  },
  ssl_opts_depth: {
    desc: '在有效的证书路径中，可以跟随对等证书的非自颁发中间证书的最大数量。\n因此，如果深度为0，则对等方必须由受信任的根 CA 直接签名；<br/>\n如果是1，路径可以是 PEER、中间 CA、ROOT-CA；<br/>\n如果是2，则路径可以是PEER、中间 CA1、中间 CA2、ROOT-CA。',
    label: 'CA 证书深度',
  },
  ssl_opts_server_name_indication: {
    desc: '指定要在 TLS 服务器名称指示扩展中使用的主机名。<br/>\n例如，当连接到 "server.example.net" 时，接受连接并执行 TLS 握手的真正服务器可能与 TLS 客户端最初连接到的主机不同，\n例如，当连接到 IP 地址时，或者当主机具有多个可解析的 DNS 记录时<br/>\n如果未指定，它将默认为使用的主机名字符串\n建立连接，除非使用 IP 地址<br/>\n然后，主机名也用于对等机的主机名验证证书<br/>\n特殊值 <code>disable</code> 阻止发送服务器名称指示扩展，并禁用主机名验证检查。',
    label: 'SNI',
  },
  ssl_opts_enable: {
    desc: '启用 TLS。',
    label: '启用 TLS',
  },
  ssl_opts_ciphers: {
    desc: "此配置保存由逗号分隔的 TLS 密码套件名称。例如\n<code>TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256</code>。\n<br/>\n密码（及其顺序）定义了客户端和服务器通过网络连接加密信息的方式。\n选择一个好的密码套件对于应用程序的数据安全性、机密性和性能至关重要。\n\n名称应为 OpenSSL 字符串格式（而不是 RFC 格式）。\nEMQX 配置文档提供的所有默认值和示例都是 OpenSSL 格式<br/>\n注意：某些密码套件仅与特定的 TLS <code>版本</code>兼容（'tlsv1.1'、'tlsv1.2'或'tlsv1.3'）。\n不兼容的密码套件将被自动删除。\n\n例如，如果只有 <code>versions</code> 仅配置为 <code>tlsv1.3</code>。为其他版本配置密码套件将无效。\n\n<br/>\n注：PSK 的 Ciphers 不支持 tlsv1.3<br/>\n如果打算使用PSK密码套件 <code>tlsv1.3</code>。应在<code>ssl.versions</code>中禁用。\n\n<br/>\nPSK 密码套件：\n<code>RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,\nRSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,\nRSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,\nRSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA</code>",
    label: '加密套件',
  },
  ssl_opts_log_level: {
    desc: "SSL 通信的日志级别。默认为 '通知'。设置为 'debug' 可检查 TLS 握手信息",
    label: 'SSL 日志级别',
  },
  ssl_opts_partial_chain: {
    desc: '启用或禁用使用 partial_chain 进行对等验证。当本地在 x509 路径验证过程中验证对等证书时，它会构建一个从对等证书开始，以信任锚结束的证书链。默认情况下，如果设置为 `false`，信任锚是根 CA，证书链必须完整。然而，如果设置为 `true` 或 `cacert_from_cacertfile`，则 `cacertfile` 中的最后一个证书将被用作信任锚证书（中间 CA）。这在路径验证中创建了一个部分链。或者，如果配置为 `two_cacerts_from_cacertfile`，`cacertfile` 中的最后两个证书之一将被用作信任锚证书，形成部分链。此选项对于中间 CA 证书轮换特别有用。然而，请注意，它会带来一些额外的开销，因此应仅用于证书轮换目的。',
    label: '启用部分链验证',
  },
  ssl_opts_verify_peer_ext_key_usage: {
    desc: '验证对等证书中的扩展密钥用法<br/>为了进行额外的对等证书验证，这里定义的值必须使用 [rfc5280](https://www.rfc-editor.org/rfc/rfc5280#section-4.2.1.12) 中定义的对等证书的“扩展密钥用法”。<br/>允许的值有<br/>- `clientAuth`<br/>- `serverAuth`<br/>- `codeSigning`<br/>- `emailProtection`<br/>- `timeStamping`<br/>- `ocspSigning`<br/>- 原始 OID，例如："OID:1.3.6.1.5.5.7.3.2" 意味着 `id-pk 2`，相当于 `clientAuth`<br/>也支持逗号分隔的字符串来验证多个密钥用法。<br/>例如，`"serverAuth,OID:1.3.6.1.5.5.7.3.2"`',
    label: '验证扩展密钥用法',
  },
  file_trans_enable: {
    label: '是否启用文件传输',
  },
  init_timeout: {
    desc: '当 `init` 指令超时时（例如由于系统过载），消息 PUBACK 将包含错误代码（0x80）。',
    label: '初始化超时时间',
  },
  store_segment_timeout: {
    desc: '当 `segment` 指令超时时（例如由于系统过载），消息 PUBACK 将包含错误代码（0x80）。',
    label: '分片存储超时时间',
  },
  assemble_timeout: {
    desc: '当 `fin` 指令超时时（例如由于系统过载），消息 PUBACK 将包含错误代码（0x80）。',
    label: '文件拼接超时时间',
  },
  file_trans_storage_local_segments_root: {
    desc: '已上传的分片临时存储路径，绝对路径，建议优先设置到高 I/O 性能的磁盘上。',
    label: '分片存储目录',
  },
  minimum_segments_ttl: {
    desc: '分片存储最小有效期，达到有效期之前，分片将不会被清理，即使某些文件指定的 TTL 小于此值，或分片已经被合并。',
    label: '分片存储最小有效期',
  },
  maximum_segments_ttl: {
    desc: '分片存储最大有效期，达到有效期之后，分片将被清理，即使某些文件指定的 TTL 大于此值，或分片未被合并。',
    label: '分片存储最大有效期',
  },
  storage_local_exporter_local_enable: {
    desc: '在文件上传完成后拼接分片并存储到本地指定目录。',
    label: '是否启用本地存储',
  },
  file_trans_storage_local_exporter_local_root: {
    desc: '已上传完成，拼接成功的文件存储路径，绝对路径。',
    label: '文件存储目录',
  },
  storage_local_exporter_s_3_enable: {
    desc: '在文件上传完成后拼接分片并存储到 S3 指定 Bucket。',
    label: '是否启用 S3 存储',
  },
  access_key_id: {
    label: '访问密钥 ID',
  },
  secret_access_key: {
    label: '访问密钥',
  },
  interval: {
    desc: '定期垃圾回收的间隔时间。',
    label: '存储垃圾回收间隔',
  },
  host: {
    label: '地址',
  },
  port: {
    label: '端口',
  },
  bucket: {
    label: '存储桶',
  },
  url_expire_time: {
    desc: '生成的 URL 的过期时间。',
    label: 'URL 过期时间',
  },
  min_part_size: {
    label: '最小分片大小',
  },
  max_part_size: {
    label: '最大分片大小',
  },
  acl: {
    desc: '上传对象使用的 ACL。',
    label: 'ACL',
  },
  ipv6_probe: {
    desc: '是否探测 IPv6 支持。',
    label: 'IPv6 探针',
  },
  headers: {
    label: '请求头',
  },
  max_retries: {
    desc: '请求出错时的最大重试次数。',
    label: '最大重试次数',
  },
  request_timeout: {
    label: 'HTTP 请求超时',
  },
  connect_timeout: {
    label: '连接超时',
  },
  pool_type: {
    desc: '连接池的类型。可以是`random`、`hash`之一。',
    label: '连接池类型',
  },
  pool_size: {
    label: '连接池大小',
  },
  enable_pipelining: {
    label: 'HTTP 管道',
  },
  access_method: {
    label: '访问模式',
  },
}
