export default {
  /* MQTT START */
  exclusive_subscription: {
    label: 'Allowed Exclusive Subscription',
  },
  max_topic_alias: {
    label: 'Max Topic Alias',
  },
  use_username_as_clientid: {
    desc: 'Whether to use Username as Client ID.\nThis setting takes effect later than <code>Use Peer Certificate as Username</code> and <code>Use Peer Certificate as Client ID</code>.',
    label: 'Use Username as Client ID',
  },
  idle_timeout: {
    desc: 'Configure the duration of time that a connection can remain idle (i.e., without any data transfer) before being: \n\n- Automatically disconnected if no CONNECT package is received from the client yet. \n- Put into hibernation mode to save resources if some CONNECT packages are already received.\n\nNote: Please set the parameter with caution as long idle time will lead to resource waste.',
    label: 'Idle Timeout',
  },
  strict_mode: {
    desc: 'Whether to parse MQTT messages in strict mode.\nIn strict mode, invalid utf8 strings in for example client ID, topic name, etc. will cause the client to be disconnected.',
    label: 'Strict Mode',
  },
  shared_subscription: {
    label: 'Allowed Shared Subscription',
  },
  server_keepalive: {
    label: 'Server Keep Alive',
  },
  wildcard_subscription: {
    label: 'Allowed Wildcard Subscription',
  },
  max_clientid_len: {
    label: 'Max Client ID Length',
  },
  response_information: {
    desc: 'Response Information <br/>UTF-8 string, for creating the response topic, for example, if set to `reqrsp/`, the publisher/subscriber will communite under the topic `reqrsp/`.To disable this feature, input `""` in the text box below.',
    label: 'Response Information',
  },
  shared_subscription_initial_sticky_pick: {
    label: 'Shared Subscription Initial Sticky Pick',
    desc: "The strategy to use for the initial subscriber pick when `Shared Subscription Strategy` is `sticky`.<br/> - `random`: Randomly select the subscriber;<br/> - `local`: Randomly select a subscriber on the current node, if there are no subscribers on the current node, then randomly select within the cluster;<br/> - `hash_clientid`: Hash the publisher's client ID to select a subscriber;<br/> - `hash_topic`: Hash the publishing topic to select a subscriber.",
  },
  peer_cert_as_username: {
    desc: 'Use the CN, DN field in the peer certificate or the entire certificate content as Username. Only works for the TLS connection.\nSupported configurations are the following:\n- <code>cn</code>: CN field of the certificate\n- <code>dn</code>: DN field of the certificate\n- <code>crt</code>: Content of the <code>DER</code> or <code>PEM</code> certificate\n- <code>pem</code>: Convert <code>DER</code> certificate content to <code>PEM</code> format and use as Username\n- <code>md5</code>: MD5 value of the <code>DER</code> or <code>PEM</code> certificate',
    label: 'Use Peer Certificate as Username',
  },
  client_attrs_init: {
    label: 'Client Attributes',
    desc: "Specify how to initialize client attributes.<br />Each client attribute can be initialized as `client_attrs.{'{'}NAME{'}'}`,<br />where `{'{'}NAME{'}'}` is the name of the attribute specified in the config field `set_as_attr`.<br /><br />The initialized client attribute will be stored in the `client_attrs` property with the specified name,<br />and can be used as a variable to render a template for mountpoint, authentication and authorization requests.<br /><br />For example, use `${'{'}client_attrs.tns{'}'}` to render an HTTP POST body when `set_as_attr = tns`,<br />or render listener config `moutpoint = ${'{'}client_attrs.tns{'}'}/` for topic namespacing.",
  },
  client_attrs_init_set_as_attr: {
    label: 'Attribute',
  },
  client_attrs_init_expression: {
    label: 'Attribute Expression',
    desc: "A one line expression to evaluate a set of predefined string functions (like in the rule engine SQL statements).<br />The expression can be a function call with nested calls as its arguments, or direct variable reference.<br />So far, it does not provide user-defined variable binding (like `var a=1`) or user-defined functions.<br />As an example, to extract the prefix of client ID delimited by a dot: `nth(1, tokens(clientid, '.'))`.<br /><br />The variables pre-bound variables are:<br />- `clientid`: MQTT Client ID.<br />- `username`: MQTT Client's username.<br />- `user_property.{'{'}NAME{'}'}`: User properties in the CONNECT packet.<br />For TLS clients, connected directly or via proxy-protocol (v2) enabled load balancer,<br />some extra variables can be used:<br />- `cn`: Client's TLS certificate common name.<br />- `dn`: Client's TLS certificate distinguished name (the subject).<br />- `peersni`: TLS server name indication sent by the client.<br /><br />You can read more about variform expressions in EMQX docs.",
  },
  clientid_override: {
    label: 'Client ID Override Expression',
    desc: "A one line expression to evaluate a set of predefined string functions (like in the rule engine SQL statements).<br />The expression can be a function call with nested calls as its arguments, or direct variable reference.<br />So far, it does not provide user-defined variable binding (like `var a=1`) or user-defined functions.<br />As an example, to extract the prefix of client ID delimited by a dot: `nth(1, tokens(username, '.'))`.<br /><br />The variables pre-bound variables are:<br />- `clientid`: The original MQTT Client ID.<br />- `username`: MQTT Client's username.<br />- `client_attrs.{'{'}NAME{'}'}`: Client attributes initialized by per config `client_attrs_init`.<br />For TLS clients, connected directly or via proxy-protocol (v2) enabled load balancer,<br />some extra variables can be used:<br />- `cn`: Client's TLS certificate common name.<br />- `dn`: Client's TLS certificate distinguished name (the subject).<br />- `peersni`: TLS server name indication sent by the client.<br /><br />You can read more about variform expressions in EMQX docs.",
  },
  retain_available: {
    desc: 'Whether to enable support for MQTT retained message. When this option is disabled, clients will not be able to publish retained messages.',
    label: 'Allowed Retain',
  },
  message_expiry_interval: {
    desc: 'The MQTT message expiry interval. For MQTT v5.0 clients, it is only effective if the Message-Expiry-Interval property is not specified for the message; for MQTT v3.1 and v3.1.1, it always applies. Note that it is not helpful to set this value to a greater value than the MQTT Session Expiry Interval, because once the session expires, all related messages are purged.',
    label: 'Message Expiry Interval',
  },
  ignore_loop_deliver: {
    desc: 'Whether the messages sent by the MQTT v3.1.1/v3.1.0 client will be forwarded to the client itself, similar to `No Local` in MQTT 5.0.',
    label: 'Ignore Loop Deliver',
  },
  max_qos_allowed: {
    label: 'Max QoS Allowed',
  },
  max_topic_levels: {
    label: 'Max Topic Levels',
  },
  peer_cert_as_clientid: {
    desc: 'Use the CN, DN field in the peer certificate or the entire certificate content as Client ID. Only works for the TLS connection.\nSupported configurations are the following:\n- <code>cn</code>: CN field of the certificate\n- <code>dn</code>: DN field of the certificate\n- <code>crt</code>: <code>DER</code> or <code>PEM</code> certificate\n- <code>pem</code>: Convert <code>DER</code> certificate content to <code>PEM</code> format and use as Client ID\n- <code>md5</code>: MD5 value of the <code>DER</code> or <code>PEM</code> certificate',
    label: 'Use Peer Certificate as Client ID',
  },
  keepalive_multiplier: {
    desc: '`Keep-Alive Timeout = Keep-Alive Interval × Keep-Alive Multiplier`. Default value is 1.5 as per MQTT 5.0.\n\nFor example, a Keep-Alive interval of 10 seconds yields a timeout of 15 seconds with a multiplier of 1.5. Increasing the multiplier value to 2 extends the timeout to 20 seconds.',
    label: 'Keep Alive Multiplier',
  },
  shared_subscription_strategy: {
    label: 'Shared Subscription Strategy',
    desc: 'Dispatch strategy for shared subscription.<br/>- `random`: dispatch the message to a random selected subscriber<br/>- `round_robin`: select the subscribers in a round-robin manner<br/>- `round_robin_per_group`: select the subscribers in round-robin fashion within each shared subscriber group<br/>- `sticky`: always use the last selected subscriber to dispatch, until the subscriber disconnects.<br/>- `local`: select random local subscriber otherwise select random cluster-wide<br/>- `hash_topic`: select the subscribers by hashing the source topic<br/>- `hash_clientid`: select the subscribers by hashing the `clientIds` of senders',
  },
  keepalive_check_interval: {
    label: 'Keep Alive Check Interval',
    desc: 'The frequency of checking for incoming MQTT packets determines how often the server will check for new MQTT packets.<br />If a certain amount of time passes without any packets being sent from the client, this time will be added up.<br />Once the accumulated time exceeds `keepalive-interval * keepalive-multiplier`, the connection will be terminated.<br />The default is set to 30 seconds, with a minimum value of 1 second and a maximum value of `keepalive-interval / 2`.<br />',
  },
  max_packet_size: {
    desc: 'If the size is out of the preset value, EMQX will disconnect the current connection',
    label: 'Max Packet Size',
  },
  /* MQTT END */
  /* SESSION START */
  max_subscriptions: {
    desc: 'Maximum number of subscriptions allowed per client.',
    label: 'Max Subscriptions',
  },
  upgrade_qos: {
    desc: 'Force upgrade of QoS level according to subscription.',
    label: 'Upgrade QoS',
  },
  max_inflight: {
    desc: 'Maximum number of QoS 1 and QoS 2 messages that are allowed to be delivered simultaneously before completing the acknowledgment.',
    label: 'Max Inflight',
  },
  retry_interval: {
    desc: 'Retry interval for QoS 1/2 message delivering.',
    label: 'Message Retry Interval',
  },
  max_awaiting_rel: {
    desc: 'Specifies the maximum number of pending QoS 2 messages in each session until either PUBREL is received or timed out. When this limit is reached, new QoS 2 PUBLISH requests will be rejected with error code 147(0x93).',
    label: 'Max Awaiting PUBREL',
  },
  await_rel_timeout: {
    desc: 'Specifies the amount of time to wait for a publish of a QoS 2 message with no PUBREL received.   When this limit is reached, EMQX will release the packet ID and also output a warning level log. \nNote: EMQX’s forwarding of the received QoS 2 message is independent from the receiving of PUBREL',
    label: 'Max Awaiting PUBREL Timeout',
  },
  session_expiry_interval: {
    desc: 'Specifies how long the session will expire after the connection is disconnected, only for non-MQTT 5.0 connections.',
    label: 'Session Expiry Interval',
  },
  max_mqueue_len: {
    desc: 'Maximum allowed queue length when persistent client are disconnected or inflight window is full.',
    label: 'Max Message Queue Length',
  },
  mqueue_priorities: {
    desc: 'Topic priorities. Priority number [1-255]. There\'s no priority table by default, hence all messages are treated equal.<br/>NOTE: Comma and equal signs are not allowed for priority topic names.<br/>NOTE: Messages for topics not in the priority table are treated as either highest or lowest priority depending on the configured value for mqtt.mqueue_default_priority.<br/>Examples:<br/>To configure "topic/1" > "topic/2":<br/>mqueue_priorities: {\'{\'}"topic/1": 10, "topic/2": 8{\'}\'}',
    label: 'Topic Priorities',
  },
  mqueue_default_priority: {
    desc: 'Default topic priority, which will be used by topics not in <code>Topic Priorities</code> (<code>mqueue_priorities</code>).',
    label: 'Default Topic Priorities',
  },
  mqueue_store_qos0: {
    desc: 'Specifies whether to store QoS 0 messages in the message queue while the connection is down but the session remains.',
    label: 'Store QoS 0 Message',
  },
  /* SESSION END */
  /* LOG START */
  enable: {
    desc: 'Enable this log handler.',
    label: 'Enable Log Handler',
  },
  level: {
    desc: 'The log level for the current log handler.\nDefaults to warning.',
    label: 'Log Level',
  },
  log_file_default_path: {
    desc: 'The path and name of the log file.',
    label: 'Log File Name',
  },
  payload_encode: {
    desc: 'The encoding method of payload in logs',
    label: 'Payload Encode',
  },
  rotation_count: {
    desc: 'Maximum number of log files.',
    label: 'Max Log Files Number',
  },
  rotation_size: {
    desc: 'This parameter controls log file rotation. The value `infinity` means the log file will grow indefinitely, otherwise the log file will be rotated once it reaches `max_size` in bytes.',
    label: 'Rotation Size',
  },
  time_offset: {
    desc: 'The time offset to be used when formatting the timestamp.\nCan be one of:\n  - <code>system</code>: the time offset used by the local system\n  - <code>utc</code>: the UTC time offset\n  - <code>+-[hh]:[mm]</code>: user specified time offset, such as "-02:00" or "+00:00"\nDefaults to: <code>system</code>.',
    label: 'Time Offset',
  },
  timestamp_format: {
    desc: 'Pick a timestamp format:<br/>- <code>auto</code>: automatically choose the best format based on log formatter. <code>epoch</code> for JSON and <code>rfc3339</code> for text.<br/>- <code>epoch</code>: Unix epoch time in microseconds.<br/>- <code>rfc3339</code>: RFC3339 format.',
    label: 'Timestamp Format',
  },
  formatter: {
    desc: 'Choose log formatter. <code>text</code> for free text, and <code>json</code> for structured logging.',
    label: 'Log Formatter',
  },
  time_window: {
    desc: 'The time window for log throttling ensures that the same type of event is only logged once within the designated time frame to prevent log overflow. A detailed log encapsulating the activities within that period is generated at the end of the time window. The minimum configurable value for this window is one second.<br/>The following events are throttled:<br/>- authorization_permission_denied<br/>- cannot_publish_to_topic_due_to_not_authorized<br/>- cannot_publish_to_topic_due_to_quota_exceeded<br/>- connection_rejected_due_to_license_limit_reached<br/>- dropped_msg_due_to_mqueue_is_full',
    label: 'Time Window',
  },
  /* LOG END */
  /* ALARM START */
  cpu_check_interval: {
    desc: 'The time interval for the periodic CPU check.',
    label: 'The time interval for the periodic CPU check',
  },
  cpu_high_watermark: {
    desc: 'The threshold, as percentage of system CPU load,\n for how much system cpu can be used before the corresponding alarm is raised.',
    label: 'CPU high watermark',
  },
  cpu_low_watermark: {
    desc: 'The threshold, as percentage of system CPU load,\n for how much system cpu can be used before the corresponding alarm is cleared.',
    label: 'CPU low watermark',
  },
  mem_check_interval: {
    desc: 'The time interval for the periodic memory check.',
    label: 'Mem check interval',
  },
  procmem_high_watermark: {
    desc: 'The threshold, as percentage of system memory,\n for how much system memory can be allocated by one Erlang process before\n the corresponding alarm is raised.',
    label: 'ProcMem high wartermark',
  },
  sysmem_high_watermark: {
    desc: 'The threshold, as percentage of system memory,\n for how much system memory can be allocated before the corresponding alarm is raised.',
    label: 'SysMem high wartermark',
  },
  busy_dist_port: {
    desc: 'When the RPC connection used to communicate with other nodes in the cluster is overloaded,\nthere will be a <code>busy_dist_port</code> warning log,\nand an MQTT message is published to system topic <code>$SYS/sysmon/busy_dist_port</code>.',
    label: 'Enable Busy Distribution Port monitoring',
  },
  busy_port: {
    desc: 'When a port (e.g. TCP socket) is overloaded, there will be a <code>busy_port</code> warning log,\nand an MQTT message is published to the system topic <code>$SYS/sysmon/busy_port</code>.',
    label: 'Enable Busy Port monitoring',
  },
  large_heap: {
    desc: 'When the heap memory occupied by a process exceeds the size specified by <code>large_heap</code>, the system will write a warning level <code>large_heap</code> log, and an MQTT message is published to\nthe system topic <code>$SYS/sysmon/large_heap</code>.',
    label: 'Enable Large Heap monitoring',
  },
  long_gc: {
    desc: 'When an Erlang process spends long time to perform garbage collection, a warning level <code>long_gc</code> log is emitted,\nand an MQTT message is published to the system topic <code>$SYS/sysmon/long_gc</code>.',
    label: 'Enable Long GC monitoring',
  },
  long_schedule: {
    desc: "When the Erlang VM detect a task scheduled for too long, a warning level 'long_schedule' log is emitted,\nand an MQTT message is published to the system topic <code>$SYS/sysmon/long_schedule</code>.",
    label: 'Enable Long Schedule monitoring',
  },
  process_check_interval: {
    desc: 'The time interval for the periodic process limit check.',
    label: 'Process limit check interval',
  },
  process_high_watermark: {
    desc: 'The threshold, as percentage of processes, for how many\n processes can simultaneously exist at the local node before the corresponding\n alarm is raised.',
    label: 'Process high watermark',
  },
  process_low_watermark: {
    desc: 'The threshold, as percentage of processes, for how many\n processes can simultaneously exist at the local node before the corresponding\n alarm is cleared.',
    label: 'Process low watermark',
  },
  /* ALARM END */
}
