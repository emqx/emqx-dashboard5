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
  log_audit_path: {
    desc: 'Name the audit log file.',
    label: 'Audit Log File Name',
  },
  max_filter_size: {
    desc: 'Store the latest N log entries in a database for allow `/audit` HTTP API to filter and retrieval of log data.',
    label: 'Max Dashboard Record Size',
  },
  ignore_high_frequency_request: {
    desc: 'Ignore high frequency requests to avoid flooding the audit log, such as publish/subscribe kick out http api requests are ignored.',
    label: 'Ignore High Frequency Request',
  },
  ssl_opts_user_lookup_fun: {
    desc: 'EMQX-internal callback that is used to lookup pre-shared key (PSK) identity.',
    label: 'SSL PSK user lookup fun',
  },
  ssl_opts_cacertfile: {
    desc: "Trusted PEM format CA certificates bundle file.<br/>\nThe certificates in this file are used to verify the TLS peer's certificates.\nAppend new certificates to the file if new CAs are to be trusted.\nThere is no need to restart EMQX to have the updated file loaded, because\nthe system regularly checks if file has been updated (and reload).<br/>\nNOTE: invalidating (deleting) a certificate from the file will not affect\nalready established connections.",
    label: 'CACertfile',
  },
  ssl_opts_verify: {
    label: 'TLS Verify',
  },
  ssl_opts_keyfile: {
    desc: 'PEM format private key file.',
    label: 'Keyfile',
  },
  ssl_opts_certfile: {
    desc: "PEM format certificates chain file.<br/>\nThe certificates in this file should be in reversed order of the certificate\nissue chain. That is, the host's certificate should be placed in the beginning\nof the file, followed by the immediate issuer certificate and so on.\nAlthough the root CA certificate is optional, it should be placed at the end of\nthe file if it is to be added.",
    label: 'Certfile',
  },
  ssl_opts_cacerts: {
    label: 'CA Cert',
  },
  ssl_opts_password: {
    desc: "String containing the user's password. Only used if the private key file is password-protected.",
    label: 'Keyfile passphrase',
  },
  ssl_opts_hibernate_after: {
    desc: 'Hibernate the SSL process after idling for amount of time reducing its memory footprint.',
    label: 'hibernate after',
  },
  ssl_opts_versions: {
    desc: "All TLS/DTLS versions to be supported.<br/>\nNOTE: PSK ciphers are suppressed by 'tlsv1.3' version config.<br/>\nIn case PSK cipher suites are intended, make sure to configure\n<code>['tlsv1.2', 'tlsv1.1']</code> here.",
    label: 'SSL versions',
  },
  ssl_opts_secure_renegotiate: {
    desc: 'SSL parameter renegotiation is a feature that allows a client and a server\nto renegotiate the parameters of the SSL connection on the fly.\nRFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,\nyou drop support for the insecure renegotiation, prone to MitM attacks.',
    label: 'SSL renegotiate',
  },
  ssl_opts_reuse_sessions: {
    desc: 'Enable TLS session reuse.',
    label: 'TLS session reuse',
  },
  ssl_opts_depth: {
    desc: 'Maximum number of non-self-issued intermediate certificates that can follow the peer certificate in a valid certification path.\nSo, if depth is 0 the PEER must be signed by the trusted ROOT-CA directly;<br/>\nif 1 the path can be PEER, Intermediate-CA, ROOT-CA;<br/>\nif 2 the path can be PEER, Intermediate-CA1, Intermediate-CA2, ROOT-CA.',
    label: 'CACert Depth',
  },
  ssl_opts_server_name_indication: {
    desc: 'Specify the host name to be used in TLS Server Name Indication extension.<br/>\nFor instance, when connecting to "server.example.net", the genuine server\nwhich accepts the connection and performs TLS handshake may differ from the\nhost the TLS client initially connects to, e.g. when connecting to an IP address\nor when the host has multiple resolvable DNS records <br/>\nIf not specified, it will default to the host name string which is used\nto establish the connection, unless it is IP addressed used.<br/>\nThe host name is then also used in the host name verification of the peer\ncertificate.<br/> The special value \'disable\' prevents the Server Name\nIndication extension from being sent and disables the hostname\nverification check.',
    label: 'SNI',
  },
  ssl_opts_enable: {
    desc: 'Enable TLS.',
    label: 'Enable TLS',
  },
  ssl_opts_log_level: {
    desc: "Log level for SSL communication. Default is 'notice'. Set to 'debug' to inspect TLS handshake messages.",
    label: 'SSL log level',
  },
  ssl_opts_ciphers: {
    desc: "This config holds TLS cipher suite names separated by comma. e.g.\n<code>TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256</code>.\n<br/>\nCiphers (and their ordering) define the way in which the\nclient and server encrypts information over the network connection.\nSelecting a good cipher suite is critical for the\napplication's data security, confidentiality and performance.\n\nThe names should be in OpenSSL string format (not RFC format).\nAll default values and examples provided by EMQX config\ndocumentation are all in OpenSSL format.<br/>\n\nNOTE: Certain cipher suites are only compatible with\nspecific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')\nincompatible cipher suites will be silently dropped.\nFor instance, if only 'tlsv1.3' is given in the <code>versions</code>,\nconfiguring cipher suites for other versions will have no effect.\n<br/>\n\nNOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br/>\nIf PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br/>\nPSK cipher suites: <code>RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,\nRSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,\nRSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,\nRSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA</code>",
    label: 'Cipher Suites',
  },
  ssl_opts_partial_chain: {
    desc: 'Enable or disable peer verification with partial_chain.When local verifies a peer certificate during the x509 path validation process, it constructs a certificate chain that starts with the peer certificate and ends with a trust anchor.By default, if it is set to `false`, the trust anchor is the Root CA, and the certificate chain must be complete.However, if the setting is set to `true` or `cacert_from_cacertfile`, the last certificate in `cacertfile` will be used as the trust anchor certificate (intermediate CA). This creates a partial chain in the path validation.Alternatively, if it is configured with `two_cacerts_from_cacertfile`, one of the last two certificates in `cacertfile` will be used as the trust anchor certificate, forming a partial chain. This option is particularly useful for intermediate CA certificate rotation.However, please note that it incurs some additional overhead, so it should only be used for certificate rotation purposes.',
    label: 'Enable Partial Chain Verification',
  },
  ssl_opts_verify_peer_ext_key_usage: {
    desc: 'Verify extended key usage in peer\'s certificate<br/>For additional peer certificate validation, the value defined here must present in the \'Extended Key Usage\' of peer certificate defined in [rfc5280](https://www.rfc-editor.org/rfc/rfc5280#section-4.2.1.12).<br/>Allowed values are<br/>- `clientAuth`<br/>- `serverAuth`<br/>- `codeSigning`<br/>- `emailProtection`<br/>- `timeStamping`<br/>- `ocspSigning`<br/>- raw OID, for example: "OID:1.3.6.1.5.5.7.3.2" means `id-pk 2` which is equivalent to `clientAuth`<br/>Comma-separated string is also supported for validating more than one key usages.<br/>For example, `"serverAuth,OID:1.3.6.1.5.5.7.3.2"`',
    label: 'Verify Extended Key Usage',
  },
  file_trans_enable: {
    label: 'Enable',
  },
  init_timeout: {
    desc: 'When the `init` command times out (for example, due to system overload), the PUBACK message will contain an error code (0x80)',
    label: 'Init Timeout',
  },
  store_segment_timeout: {
    desc: 'When the `segment` command times out (for example, due to system overload), the PUBACK message will contain an error code (0x80).',
    label: 'Store Segment Timeout',
  },
  assemble_timeout: {
    desc: 'When the `fin` command times out (for example, due to system overload), the PUBACK message will contain an error code (0x80).',
    label: 'Assemble Timeout',
  },
  file_trans_storage_local_segments_root: {
    desc: 'Uploaded segment temporary storage path. Absolute path. It is recommended to set it to a disk with high I/O performance.',
    label: 'Segments Root Directory',
  },
  interval: {
    desc: 'Interval of periodic garbage collection.',
    label: 'Storage GC Interval',
  },
  minimum_segments_ttl: {
    desc: 'Minimum Segments TTL. Segments will not be cleaned up before the TTL expires. Even if the TTL specified by some file transfer is less than this value, or the segments have been merged.',
    label: 'Minimum Segments TTL',
  },
  maximum_segments_ttl: {
    desc: 'Maximum Segments TTL. Segments will be cleaned up after the TTL expires. Even if the TTL specified by some file transfer is greater than this value, or the segments have not been merged.',
    label: 'Maximum Segments TTL',
  },
  storage_local_exporter_local_enable: {
    desc: 'Assemble segments and store them in the specified local directory after the file is uploaded.',
    label: 'Enable Local Storage',
  },
  storage_local_exporter_s_3_enable: {
    desc: 'Assemble segments and store them in the specified S3 bucket after the file is uploaded.',
    label: 'Enable S3 Storage',
  },
  file_trans_storage_local_exporter_local_root: {
    desc: 'Uploaded and assembled files. Absolute path.',
    label: 'Files Root Directory',
  },
  host: {
    label: 'Host',
  },
  port: {
    label: 'Port',
  },
  access_key_id: {
    label: 'Access Key ID',
  },
  secret_access_key: {
    label: 'Secret Access Key',
  },
  bucket: {
    label: 'Bucket',
  },
  url_expire_time: {
    desc: 'Expiration time of the generated URL.',
    label: 'URL Expire Time',
  },
  min_part_size: {
    label: 'Minimum Part Size',
  },
  max_part_size: {
    label: 'Maximum Part Size',
  },
  acl: {
    desc: 'The ACL to use for the uploaded objects.',
    label: 'ACL',
  },
  ipv6_probe: {
    desc: 'Whether to probe for IPv6 support.',
    label: 'IPv6 Probe',
  },
  headers: {
    label: 'HTTP Headers',
  },
  max_retries: {
    desc: 'Max retry times if error on sending request.',
    label: 'Max Retries',
  },
  request_timeout: {
    label: 'Request Timeout',
  },
  connect_timeout: {
    label: 'Connect Timeout',
  },
  pool_type: {
    desc: 'The type of the pool. Can be one of `random`, `hash`.',
    label: 'Pool Type',
  },
  pool_size: {
    label: 'Pool Size',
  },
  enable_pipelining: {
    label: 'HTTP Pipelining',
  },
  access_method: {
    label: 'Access Method',
  },
}
