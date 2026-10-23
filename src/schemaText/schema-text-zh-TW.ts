export default {
  exclusive_subscription: {
    label: '允許排它訂閱',
  },
  max_topic_alias: {
    label: '最大主題別名數',
  },
  use_username_as_clientid: {
    label: '使用使用者名稱作為用戶端 ID',
    desc: '是否使用使用者名稱作為用戶端 ID。 作用時間晚於 <code>對端憑證作為使用者名稱</code> 和 <code>對端憑證作為用戶端 ID</code>。',
  },
  idle_timeout: {
    label: '空閒逾時',
    desc: '新連線等待用戶端 CONNECT 封包的最長時間，預設 15 秒。超過此時間仍未收到 CONNECT 封包，連線將斷開。已建立連線的休眠時間由 `hibernate_after` 控制。',
  },
  hibernate_after: {
    label: '連線休眠等待時間',
    desc: '已建立的 TCP、TLS、WS 和 WSS 連線在無活動後進入休眠的等待時間，預設 5 秒。休眠會觸發垃圾回收並縮小行程堆，以節省記憶體；收到封包、訊息或定時器事件時，連線會喚醒。\n\n設為 `infinity` 可停用休眠。如果用戶端傳送資料的間隔接近此值，建議增大該值，以避免頻繁休眠帶來的垃圾回收開銷。此設定不影響等待 CONNECT 封包的逾時時間。QUIC 監聽器自身的 `hibernate_after` 設定優先。',
  },
  minor_gc_after: {
    label: '新生代垃圾回收等待時間',
    desc: "使用 `socket` 後端的 TCP 連線在行程郵箱無活動後，執行一次新生代垃圾回收（Minor GC）的等待時間。預設為 `infinity`，表示停用此垃圾回收。設為有限時長時，連線在垃圾回收後開始等待“@:{'ConfigSchema.hibernate_after.label'}”指定的時長。\n\n較短的等待時間可能減少記憶體使用，但會增加 CPU 開銷。此設定不影響使用 `gen_tcp` 後端的連線。",
  },
  strict_mode: {
    label: '嚴格模式',
    desc: '是否以嚴格模式解析 MQTT 訊息。嚴格模式下，如用戶端 ID、主題名稱等中包含無效 utf8 字串，連線將被斷開。',
  },
  shared_subscription: {
    label: '允許共享訂閱',
  },
  server_keepalive: {
    label: '服務端 Keep Alive',
  },
  wildcard_subscription: {
    label: '允許萬用字元訂閱',
  },
  max_clientid_len: {
    label: '最大用戶端 ID 長度',
  },
  response_information: {
    label: '回應資訊',
    desc: 'UTF-8 字串，用於指定回傳給用戶端的回應主題，如 `reqrsp/`，此時請求和應答用戶端都需要使用 `reqrsp/` 字首的主題來完成通訊。如希望停用此功能，請在下方的文字框中輸入`""`；僅適用於 MQTT 5.0 用戶端。',
  },
  shared_subscription_initial_sticky_pick: {
    label: '共享訂閱初始 Sticky 選擇策略',
    desc: '當`共享訂閱策略`設定為 `sticky` 時，用於初始訂閱者選擇的策略：<br/> - `random`：隨機選擇訂閱者；<br/> - `local`：隨機選擇目前節點上的訂閱者，如果目前節點上沒有訂閱者，則在叢集內隨機選擇；<br/> - `hash_clientid`：透過對發布者的用戶端ID進行雜湊來選擇訂閱者；<br/> - `hash_topic`：透過對發布主題進行雜湊來選擇訂閱者。',
  },
  peer_cert_as_username: {
    label: '使用對端憑證作為使用者名稱',
    desc: '使用對端憑證中的 CN、DN 欄位或整個憑證內容來作為使用者名稱；僅適用於 TLS 連線。\n目前支援：\n- <code>cn</code>: 取憑證的 CN 欄位\n- <code>dn</code>: 取憑證的 DN 欄位\n- <code>crt</code>: 取 <code>DER</code> 或 <code>PEM</code> 的憑證內容\n- <code>pem</code>: 將 <code>DER</code> 憑證轉換為 <code>PEM</code> 格式作為使用者名稱\n- <code>md5</code>: 取 <code>DER</code> 或 <code>PEM</code> 憑證內容的 MD5 值',
  },
  client_attrs_init: {
    label: '用戶端屬性',
    desc: "指定如何初始化用戶端屬性。<br />每個用戶端屬性可以初始化為 `client_attrs.{'{'}NAME{'}'}`，<br />其中 `{'{'}NAME{'}'}` 是設定欄位 `set_as_attr` 中指定的屬性名稱。<br /><br />初始化的用戶端屬性將儲存在帶有指定名稱的 `client_attrs` 屬性中，<br />並可用作渲染掛載點、身分驗證和授權請求的模板變數。<br /><br />例如，當 `set_as_attr = tns` 時，使用 `${'{'}client_attrs.tns{'}'}` 渲染 HTTP POST 正文，<br />或渲染監聽器設定 `moutpoint = ${'{'}client_attrs.tns{'}'}/` 用於主題命名空間。",
  },
  client_attrs_init_set_as_attr: {
    label: '屬性',
  },
  client_attrs_init_expression: {
    label: '屬性表示式',
    desc: "使用行表示式計算一組預定義的字串函式（類似於規則引擎 SQL 語句）。<br />表示式可以是帶有巢狀呼叫參數的函式呼叫，或直接引用變數。<br />目前不提供使用者自訂變數繫結（如 `var a=1`）或使用者自訂函式。<br />例如，要提取以點分隔的用戶端 ID 字首：`nth(1, tokens(clientid, '.'))`。<br /><br />預繫結的變數有：<br />- `clientid`：MQTT 用戶端 ID。<br />- `username`：MQTT 用戶端的使用者名稱。<br />- `user_property.{'{'}NAME{'}'}`：CONNECT 資料包中的使用者屬性。<br />對於 TLS 用戶端，直接連線或透過支援 Proxy 協定（v2）的負載均衡器連線，<br />可以使用一些額外的變數：<br />- `cn`：用戶端 TLS 憑證的通用名稱。<br />- `cert_common_name`：`cn` 的別名。<br />- `dn`：用戶端 TLS 憑證的可分辨名稱（主題）。<br />- `cert_subject`：`dn` 的別名。<br />- `peersni`：用戶端傳送的 TLS 伺服器名稱指示。<br /><br />您可以在 EMQX 文件中閱讀更多關於 variform 表示式的資訊。",
  },
  clientid_override: {
    label: '用戶端 ID 重寫表示式',
    desc: "使用行表示式計算一組預定義的字串函式（類似於規則引擎 SQL 語句）。<br />表示式可以是帶有巢狀呼叫參數的函式呼叫，或直接引用變數。<br />目前不提供使用者自訂變數繫結（如 `var a=1`）或使用者自訂函式。<br />例如，要提取以點分隔的用戶端 ID 字首：`nth(1, tokens(username, '.'))`。<br /><br />預繫結的變數有：<br />- `clientid`：原始 MQTT 用戶端 ID。<br />- `username`：MQTT 用戶端的使用者名稱。<br />- `client_attrs.{'{'}NAME{'}'}`：透過每個設定的 `client_attrs_init` 初始化的用戶端屬性。<br />對於 TLS 用戶端，直接連線或透過支援 Proxy 協定（v2）的負載均衡器連線，<br />可以使用一些額外的變數：<br />- `cn`：用戶端 TLS 憑證的通用名稱。<br />- `dn`：用戶端 TLS 憑證的可分辨名稱（主題）。<br />- `peersni`：用戶端傳送的 TLS 伺服器名稱指示。<br /><br />您可以在 EMQX 文件中閱讀更多關於 variform 表示式的資訊。",
  },
  namespace_as_mountpoint: {
    label: '將命名空間作為掛載點',
    desc: '將用戶端的命名空間用作主題掛載點。如果監聽器已設定 `mountpoint`，則忽略此設定。<br />\n  啟用後，EMQX 透過以下方式隔離主題：\n - 在 PUBLISH、SUBSCRIBE、UNSUBSCRIBE 和遺囑訊息的主題前新增命名空間字首。\n - 在向用戶端投遞訊息時移除此字首。\n\n  例如（命名空間 `n1`）：\n - 用戶端訂閱 `sensors/#` -> broker 註冊 `n1/sensors/#`。\n - broker 路由 `n1/sensors/data` -> 用戶端收到 `sensors/data`。',
  },
  retain_available: {
    label: '啟用保留訊息',
    desc: '是否啟用對 MQTT 保留訊息的支援。停用此選項時，用戶端將無法發布保留訊息。',
  },
  message_expiry_interval: {
    label: '訊息過期間隔',
    desc: 'MQTT 訊息的過期時間間隔。對於 MQTT 5.0 版本的用戶端，此設定僅在訊息未指定 Message-Expiry-Interval 屬性時才會生效。對於 MQTT 3.1 和 3.1.1 版本，此設定始終適用。值得注意的是，將此值設定為大於會話過期間隔是無效的，因為一旦會話過期，所有相關訊息都將被清除。',
  },
  ignore_loop_deliver: {
    label: '忽略迴圈投遞',
    desc: '設定由 MQTT v3.1.1/v3.1.0 用戶端發布的訊息是否將轉發給其本身；類似 MQTT 5.0 協定中的 `No Local` 選項。',
  },
  subscription_message_filter: {
    label: '訂閱訊息過濾',
    desc: '是否啟用訂閱訊息過濾功能。啟用後，用戶端可在訂閱主題後追加過濾條件（如 `sensor/+/temperature?location=roomA&value>25`），EMQX 將在投遞時檢查訊息的 User-Property，不滿足條件的訊息會被丟棄。',
  },
  max_qos_allowed: {
    label: '最大 QoS',
  },
  max_topic_levels: {
    label: '最大主題層級',
  },
  peer_cert_as_clientid: {
    label: '使用對端憑證作為用戶端 ID',
    desc: '使用對端憑證中的 CN、DN 欄位或整個憑證內容來作為用戶端 ID。僅適用於 TLS 連線；\n目前支援：\n- <code>cn</code>: 取憑證的 CN 欄位\n- <code>dn</code>: 取憑證的 DN 欄位\n- <code>crt</code>: 取 <code>DER</code> 或 <code>PEM</code> 憑證的內容\n- <code>pem</code>: 將 <code>DER</code> 憑證內容轉換為 <code>PEM</code> 格式作為用戶端 ID\n- <code>md5</code>: 取 <code>DER</code> 或 <code>PEM</code> 憑證內容的 MD5 值',
  },
  keepalive_multiplier: {
    label: 'Keep Alive 倍數',
    desc: '`Keep-Alive Timeout = Keep-Alive Interval × Keep-Alive Multiplier`，根據 MQTT 5.0，預設值為1.5。\n\n例如，如果 Keep-Alive interval 為 10 秒，那麼乘以 1.5 的倍數，將產生 15 秒的逾時。將倍數值增加到 2，逾時將延長到 20 秒。',
  },
  shared_subscription_strategy: {
    label: '共享訂閱策略',
    desc: '共享訂閱的排程策略。<br/>- `random`：將訊息分配給隨機選擇的訂閱者。<br/>- `round_robin`：以迴圈方式選擇訂閱者。<br/>- `round_robin_per_group`：在每個共享訂閱組內以迴圈方式選擇訂閱者。<br/>- `sticky`：始終使用最後選擇的訂閱者進行排程，直到訂閱者斷開連線。<br/>- `local`：如果本地訂閱者不存在，則選擇隨機本地訂閱者，否則選擇隨機叢集廣域訂閱者。<br/>- `hash_topic`：透過主題源的雜湊值選擇訂閱者。<br/>- `hash_clientid`：透過對傳送者的用戶端 ID 進行 Hash 處理來選擇訂閱者。',
  },
  keepalive_check_interval: {
    label: '保活檢查間隔',
    desc: '檢查傳入 MQTT 資料包的頻率決定了伺服器檢查新 MQTT 資料包的頻率。<br />如果用戶端在一定時間內沒有傳送任何資料包，這段時間將會累積。<br />一旦累積時間超過 `keepalive-interval * keepalive-multiplier`，連線將會被終止。<br />預設值設定為 30 秒，最小值為 1 秒，最大值為 `keepalive-interval / 2`。',
  },
  max_packet_size: {
    label: '最大封包大小',
    desc: '允許的最大 MQTT 封包大小，超出此大小後將斷開目前用戶端連線。',
  },
  max_connect_packet_size: {
    label: '最大 CONNECT 封包大小',
    desc: '允許的最大 CONNECT 封包大小，超出此大小後 EMQX 將關閉連線。此限制與最大封包大小同時生效，CONNECT 封包以兩者中較小的值為限。預設值為 1 MB。',
  },
  max_connect_user_properties: {
    label: 'CONNECT 使用者屬性數量上限',
    desc: 'CONNECT 封包中允許攜帶的使用者屬性鍵值對數量上限。CONNECT 屬性和遺囑屬性分別計數，任一超限時 EMQX 將關閉連線。預設值為 100。設為 0 表示不允許攜帶使用者屬性；關閉限制（infinity）表示不限制數量。',
  },
  max_conn_rate: {
    label: '最大連線速率',
    desc: '限制每個節點上接受新連線的速率。\n\n一旦達到限制，EMQX 將自動關閉任何新連線，這些連線在被接受後會立即被關閉，從而有效地清空等待被接受的連線佇列。\n\n例如：\n\n- `1000/s`: 每秒最多接受 1000 個連線。\n- `1000/10s`: 每 10 秒最多接受 1000 個連線。',
  },
  max_conn_burst: {
    label: '最大連線突發速率',
    desc: '每個節點在常規速率基礎上可突發接受的連線數。\n\n例如：`10000/60m`: 每 60 分鐘允許在短時間內突發接受最多 10000 個連線。',
  },
  messages_rate: {
    label: '訊息發布速率',
    desc: '限制單個用戶端向 EMQX 傳送訊息的速率（每個節點）。\n\n當達到限制時，EMQX 將丟棄 QoS 0 訊息，並以 "配額超限" 錯誤碼 (0x97) 拒絕 QoS 1 和 QoS 2 訊息。\n\n例如：\n\n- `500/s`: 每秒最多接收 500 條訊息，超出部分將被丟棄/拒絕。\n- `500/10s`: 每 10 秒最多接收 500 條訊息，超出部分將被丟棄/拒絕。',
  },
  messages_burst: {
    label: '訊息發布突發速率',
    desc: '在常規 `訊息發布速率` 基礎上，每個節點允許突發傳送的訊息數量。\n\n例如：`10000/60m`: 每 60 分鐘允許在短時間內突發傳送最多 10000 條訊息。',
  },
  subscribes_rate: {
    label: '訂閱速率',
    desc: '限制單個用戶端向 broker 傳送訂閱封包的速率（每個節點）。\n\n達到限制後，EMQX 將不會處理該封包，並回復帶有 "配額超限" 錯誤碼 (0x97) 的 `SUBACK`。',
  },
  subscribes_burst: {
    label: '訂閱突發速率',
    desc: '限制單個用戶端可向 broker 突發傳送的訂閱封包數量（每個節點）。',
  },
  bytes_rate: {
    label: '封包發布速率',
    desc: '限制單個用戶端向 broker 傳送的資料量（每個節點）。\n\n當達到限制時，EMQX 將丟棄 QoS 0 訊息，並以 "配額超限" 錯誤碼 (0x97) 拒絕 QoS 1 和 QoS 2 訊息。\n\n位元組單位支援：B、KB、MB、GB。\n\n例如：\n\n- `500KB/s`: 每秒最多接收 500 千位元組，超出部分將被丟棄/拒絕。\n- `500MB/10s`: 每 10 秒最多接收 500 兆位元組，超出部分將被丟棄/拒絕。',
  },
  bytes_burst: {
    label: '封包發布突發速率',
    desc: '在常規 `封包發布速率` 基礎上允許突發傳送的資料量。\n\n例如：`100MB/60m`: 每 60 分鐘允許在短時間內突發傳送最多 100 兆位元組。',
  },
  delivery_messages_rate: {
    label: '訊息投遞速率',
    desc: '限制 EMQX 向單個用戶端投遞訊息的速率（每個節點）。注意此設定方向與 `訊息發布速率` 相反。\n\n僅在使用記憶體會話時生效（即 `durable_sessions.enable = false`，會話持久化功能關閉）。\n\n達到限制後，EMQX 將丟棄 QoS 0 訊息，QoS 1 和 QoS 2 訊息將被加入用戶端內部佇列並在稍後重試。\n\n例如：\n\n- `500/s`: 每秒最多投遞 500 條訊息，超出部分將被丟棄/排隊。\n- `500/10s`: 每 10 秒最多投遞 500 條訊息，超出部分將被丟棄/排隊。',
  },
  delivery_messages_burst: {
    label: '訊息投遞突發速率',
    desc: '在常規 `訊息投遞速率` 基礎上，每個節點允許突發投遞的訊息數量。\n\n僅在使用記憶體會話時生效（即 `durable_sessions.enable = false`，會話持久化功能關閉）。\n\n例如：`10000/60m`: 每 60 分鐘允許在短時間內突發投遞最多 10000 條訊息。',
  },
  delivery_bytes_rate: {
    label: '資料投遞速率',
    desc: '限制 EMQX 向單個用戶端投遞資料的速率（每個節點）。注意此設定方向與 `封包發布速率` 相反。\n\n僅在使用記憶體會話時生效（即 `durable_sessions.enable = false`，會話持久化功能關閉）。\n\n達到限制後，EMQX 將丟棄 QoS 0 訊息，QoS 1 和 QoS 2 訊息將被加入用戶端內部佇列並在稍後重試。\n\n位元組單位支援：B、KB、MB、GB。\n\n例如：\n\n- `500KB/s`: 每秒最多投遞 500 千位元組，超出部分將被丟棄/排隊。\n- `500MB/10s`: 每 10 秒最多投遞 500 兆位元組，超出部分將被丟棄/排隊。',
  },
  delivery_bytes_burst: {
    label: '資料投遞突發速率',
    desc: '在常規 `資料投遞速率` 基礎上允許突發投遞的資料量。\n\n僅在使用記憶體會話時生效（即 `durable_sessions.enable = false`，會話持久化功能關閉）。\n\n例如：`100MB/60m`: 每 60 分鐘允許在短時間內突發投遞最多 100 兆位元組。',
  },
  max_subscriptions: {
    label: '最大訂閱數量',
    desc: '允許每個用戶端建立的最大訂閱數量。',
  },
  upgrade_qos: {
    label: '升級 QoS',
    desc: '投遞訊息時，是否根據訂閱主題時的 QoS 等級來強制提升派發訊息的 QoS 等級。',
  },
  max_inflight: {
    label: '最大飛行視窗',
    desc: '完成應答前，最多允許同時投遞的 QoS 1 和 QoS 2 訊息數量。',
  },
  retry_interval: {
    label: '訊息重試間隔',
    desc: 'QoS 1/2 訊息的重新投遞間隔。',
  },
  max_awaiting_rel: {
    label: '最大待發 PUBREL 數量',
    desc: '為每個會話指定未收到 PUBREL 且未逾時的最大 QoS 2 訊息數量。超過限制後，新的 QoS 2 訊息發布會被拒絕，並回傳 147(0x93) 錯誤。',
  },
  await_rel_timeout: {
    label: '最大 PUBREL 等待時長',
    desc: '對於未收到 PUBREL 的 QoS 2 訊息，將按照指定時間等待重傳；逾時後 EMQX 將釋放  packet ID  併產生一條警報日誌。\n注意：EMQX 對訊息的轉發操作不依賴於 PUBREL收到與否。',
  },
  session_expiry_interval: {
    label: '會話過期間隔',
    desc: '指定會話將在連線斷開後多久過期，僅適用於非 MQTT 5.0 的連線。',
  },
  max_session_expiry_interval: {
    label: '最長會話過期間隔',
    desc: '限制 MQTT 5.0 用戶端可請求的最長會話過期間隔。設定為 infinity 表示不限制。',
  },
  max_mqueue_len: {
    label: '最大訊息佇列長度',
    desc: '最大訊息佇列長度。持久用戶端斷開連線或飛行視窗已滿時，允許排隊的的最大訊息數量。',
  },
  mqueue_priorities: {
    label: '主題優先順序',
    desc: "主題優先順序。優先順序數字[1-255]。預設情況下沒有優先順序表，因此所有訊息都被平等對待。<br/>注意：優先順序主題名稱中不允許使用逗號和等號。<br/>注意：不在優先順序表中的主題的訊息將根據 mqtt.mqueue_default_priority 的設定值被視為最高優先順序或最低優先順序。<br/>範例：<br/>要設定 'topic/1' > 'topic/2'：<br/>mqueue_priorities: {'{'}\"topic/1\": 10, \"topic/2\": 8{'}'}",
  },
  mqueue_default_priority: {
    label: '預設主題優先順序',
    desc: '預設的主題優先順序，不在 <code>主題優先順序</code>（<code>mqueue_priorities</code>） 中的主題將會使用該優先順序。',
  },
  mqueue_store_qos0: {
    label: '儲存 QoS 0 訊息',
    desc: '在連線斷開但會話保持期間，是否需要在訊息佇列中儲存 QoS 0 訊息。',
  },
  durable_sessions_enable: {
    label: '啟用會話持久化',
    desc: '暫不支援透過熱設定修改，請在設定檔中設定 `durable_sessions.enable = true｜false` 以啟用或停用。啟用後，用戶端的會話資料將會被持久儲存，即使伺服器重啟也能夠進行恢復。',
  },
  batch_size: {
    label: '訊息查詢批大小',
    desc: '持久會話以批次方式查詢已儲存的訊息，這個值指定了批處理的大小。注意：較大的批次通常會提高系統的吞吐量和整體效能，但會增加每個用戶端的記憶體使用量。',
  },
  checkpoint_interval: {
    label: '檢查間隔',
    desc: '持久會話定期將狀態備份到磁碟的時間間隔。系統會按照此間隔定期執行檢查操作。',
  },
  message_retention_period: {
    label: '訊息保留時長',
    desc: '持久會話中訊息保留時長，超期的訊息不會發送到訂閱者。',
  },
  durable_sessions_shared_subs_checkpoint_interval: {
    label: '檢查間隔',
    desc: '共享訂閱領導者定期將主題重放進度提交到資料庫。此參數指定此類提交之間的最小時間間隔。',
  },
  realloc_interval: {
    label: '重新分配間隔',
    desc: '共享訂閱領導者在此時間段內累積對組的更改（例如訂閱者加入或離開組），然後在訂閱者之間重新分配工作。\n\n這樣做是為了避免在短時間內多個訂閱者加入或離開組時產生不必要的工作。',
  },
  revocation_timeout: {
    label: '撤銷逾時',
    desc: '給共享訂閱者完成最後一批訊息處理的最長時間。\n\n共享訂閱組的重新平衡可能涉及將工作從一個訂閱者轉移到另一個訂閱者。\n第一個訂閱者可以在此間隔內完成被撤銷任務的剩餘工作。\n\n如果訂閱者未能及時回覆，它將被踢出組，其所有工作將被重新分配。',
  },
  enable: {
    label: '啟用日誌輸出',
    desc: '啟用此日誌輸出。',
  },
  level: {
    label: '日誌級別',
    desc: '目前日誌輸出的日誌級別。\n預設為 warning 級別。',
  },
  log_file_default_path: {
    label: '日誌檔名字',
    desc: '日誌檔案路徑及名字。',
  },
  payload_encode: {
    label: 'Payload 編碼',
    desc: '日誌中 Payload 的編碼方式。',
  },
  rotation_count: {
    label: '最大日誌檔案數',
    desc: '輪換的最大日誌檔案數。',
  },
  rotation_size: {
    label: '日誌檔案輪換大小',
    desc: '此參數控制日誌檔案輪換。 `infinity` 意味著日誌檔案將無限增長，否則日誌檔案將在達到 `max_size`（以位元組為單位）時進行輪換。\n與 rotation count配合使用。如果 counter 為 10，則是10個檔案輪換。',
  },
  time_offset: {
    label: '時間偏移量',
    desc: '日誌中的時間戳使用的時間偏移量。\n可選值為：\n  - <code>system</code>: 本地系統使用的時區偏移量\n  - <code>utc</code>: 0 時區的偏移量\n  - <code>+-[hh]:[mm]</code>: 自訂偏移量，例如 "-02:00" 或者 "+00:00"\n預設值為本地系統的時區偏移量：<code>system</code>。',
  },
  timestamp_format: {
    label: '時間戳格式',
    desc: '選擇時間戳格式：<br/>- <code>auto</code>：根據日誌的格式自動選擇最合適的時間戳格式。對於 JSON 使用 <code>epoch</code>，對於文本則使用 <code>rfc3339</code>。<br/>- <code>epoch</code>：表示為自 Unix 紀元起的微秒數。<br/>- <code>rfc3339</code>：遵循 RFC3339 標準的時間格式。',
  },
  formatter: {
    label: '日誌格式類型',
    desc: '選擇日誌格式類型。 <code>text</code> 用於純文本，<code>json</code> 用於結構化日誌記錄。',
  },
  time_window: {
    label: '時間視窗',
    desc: '日誌節流的時間視窗，在設定的時間視窗內同一事件類型的日誌只被記錄一次以防止日誌氾濫。時間視窗結束時將生成反映該時間段內的日誌活動的詳細日誌。該視窗的最小可設定值為1秒。<br/>支援的事件如下：<br/>- authorization_permission_denied<br/>- cannot_publish_to_topic_due_to_not_authorized<br/>- cannot_publish_to_topic_due_to_quota_exceeded<br/>- connection_rejected_due_to_license_limit_reached<br/>- dropped_msg_due_to_mqueue_is_full',
  },
  cpu_check_interval: {
    label: '定期 CPU 檢查的時間間隔',
    desc: '定期 CPU 檢查的時間間隔。',
  },
  cpu_high_watermark: {
    label: 'CPU 高水位線',
    desc: '在發出相應警報之前可以使用多少系統 CPU 的閾值，以系統CPU負載的百分比表示。',
  },
  cpu_low_watermark: {
    label: 'CPU 低水位線',
    desc: '在解除相應警報之前可以使用多少系統 CPU 的閾值，以系統CPU負載的百分比表示。',
  },
  mem_check_interval: {
    label: '記憶體檢查間隔',
    desc: '定期記憶體檢查的時間間隔。',
  },
  procmem_high_watermark: {
    label: '行程記憶體高水位線',
    desc: '在發出相應警報之前，一個Erlang行程可以分配多少系統記憶體的閾值，以系統記憶體的百分比表示。',
  },
  sysmem_high_watermark: {
    label: '系統記憶體高水位線',
    desc: '在發出相應報警之前可以分配多少系統記憶體的閾值，以系統記憶體的百分比表示。',
  },
  total_payload_bytes_high_watermark: {
    label: '會話訊息負載高水位線',
    desc: '當記憶體會話的訊息佇列和飛行視窗中保留的 MQTT 訊息負載總大小超過此閾值時，將產生一條限流的 warning 級別日誌。設定為 <code>0</code> 可關閉該警告。此設定不會限制會話緩衝區大小。',
  },
  busy_dist_port: {
    label: '啟用分散式連接埠過忙監控',
    desc: '啟用後，當用於叢集接點之間 RPC 的連線過忙時，會觸發一條帶有 <code>busy_dist_port</code> 關鍵字的 warning 級別日誌。\n同時還會發布一條主題為 <code>$SYS/sysmon/busy_dist_port</code> 的 MQTT 系統訊息。',
  },
  busy_port: {
    label: '啟用連接埠過忙監控',
    desc: '當一個系統介面（例如 TCP socket）過忙，會觸發一條帶有 <code>busy_port</code> 關鍵字的 warning 級別的日誌。\n同時還會發布一條主題為 <code>$SYS/sysmon/busy_port</code> 的 MQTT 系統訊息。',
  },
  large_heap: {
    label: '啟用大 heap 監控',
    desc: '當行程佔用的堆記憶體超過 large_heap 指定的大小時，系統會觸發一條帶有 <code>large_heap</code> 關鍵字的 warning 級別日誌。同時還會發布一條主題為 <code>$SYS/sysmon/large_heap</code> 的 MQTT 系統訊息。',
  },
  long_gc: {
    label: '啟用長垃圾回收監控',
    desc: '當系統檢測到某個 Erlang 行程垃圾回收佔用過長時間，會觸發一條帶有 <code>long_gc</code> 關鍵字的日誌。\n同時還會發布一條主題為 <code>$SYS/sysmon/long_gc</code> 的 MQTT 系統訊息。',
  },
  long_schedule: {
    label: '啟用長排程監控',
    desc: "啟用後，如果 Erlang VM 排程器出現某個任務佔用時間過長時，會觸發一條帶有 'long_schedule' 關鍵字的日誌。\n同時還會發布一條主題為 <code>$SYS/sysmon/long_schedule</code> 的 MQTT 系統訊息。",
  },
  process_check_interval: {
    label: '行程限制檢查時間',
    desc: '定期行程限制檢查的時間間隔。',
  },
  process_high_watermark: {
    label: '行程數高水位線',
    desc: '在發出相應警報之前，本地節點上可以同時存在多少行程的閾值（以行程百分比表示）。',
  },
  process_low_watermark: {
    label: '行程數低水位線',
    desc: '在清除相應警報之前，本地節點上可以同時存在多少行程的閾值（以行程百分比表示）。',
  },
  log_audit_path: {
    label: '稽核紀錄檔案',
    desc: '稽核紀錄檔名稱',
  },
  cache_size: {
    label: '快取大小',
    desc: '在資料庫中儲存最新的 N 條日誌條目，以允許 `/audit` HTTP API 進行日誌資料的過濾和檢索。清理冗餘日誌記錄的間隔維持在 10~20 秒範圍內。',
  },
  ignore_high_frequency_request: {
    label: '忽略高頻請求',
    desc: '忽略高頻請求以避免淹沒稽核紀錄，例如被忽略的發布/訂閱踢出 http api 請求。',
  },
  ssl: {
    label: 'TLS 設定',
  },
  ssl_opts_user_lookup_fun: {
    label: 'SSL PSK 使用者回呼',
    desc: '用於查詢預共享金鑰（PSK）識別的 EMQX 內部回呼。',
  },
  ssl_opts_cacertfile: {
    label: 'CA Cert',
  },
  ssl_opts_verify: {
    label: '驗證伺服器憑證',
  },
  ssl_opts_hostname_check: {
    label: "@:{'Base.hostnameCheck'}",
    desc: "@:{'Base.hostnameCheckDesc'}",
  },
  ssl_opts_middlebox_comp_mode: {
    label: '中介軟體相容模式',
    desc: '是否開啟 TLS-1.3 連線的中介軟體相容模式。<br /> 許多中介軟體在 TLS-1.3 連線協商時行為異常，啟用後可以透過適應 TLS-1.3 握手，使其更類似於 TLS-1.2 握手，從而增加透過這些中介軟體建立連線的機會。',
  },
  ssl_opts_keyfile: {
    label: 'Keyfile',
    desc: 'PEM 格式的私鑰檔案。',
  },
  ssl_opts_certfile: {
    label: 'Certfile',
    desc: 'PEM格式憑證鏈檔案<br/>\n此檔案中的憑證應與憑證頒發鏈的順序相反。也就是說，主機的憑證應該放在檔案的開頭，\n然後是直接頒發者 CA 憑證，依此類推，一直到根 CA 憑證。\n根 CA 憑證是可選的，如果想要新增，應加到檔案到最末端。',
  },
  ssl_opts_cacerts: {
    label: 'CA Cert',
  },
  ssl_opts_password: {
    label: '金鑰檔案密碼',
    desc: '包含使用者密碼的字串。僅在私鑰檔案受密碼保護時使用。',
  },
  ssl_opts_hibernate_after: {
    label: '空閒多久後休眠',
    desc: '在空閒一定時間後休眠 SSL 行程，減少其記憶體佔用。',
  },
  ssl_opts_versions: {
    label: 'SSL 版本',
    desc: '支援所有TLS/DTLS版本<br/>\n注：PSK 的 Ciphers 無法在 <code>tlsv1.3</code> 中使用，如果打算使用 PSK 密碼套件，請確保這裡設定為 <code>["tlsv1.2","tlsv1.1"]</code>。',
  },
  ssl_opts_secure_renegotiate: {
    label: 'SSL 重新協商',
    desc: 'SSL 參數重新協商是一種允許用戶端和伺服器動態重新協商 SSL 連線參數的功能。\nRFC 5746 定義了一種更安全的方法。透過啟用安全的重新協商，您就失去了對不安全的重新協商的支援，從而容易受到 MitM 攻擊。',
  },
  ssl_opts_reuse_sessions: {
    label: 'TLS 會話重用',
    desc: '啟用 TLS 會話重用。',
  },
  ssl_opts_depth: {
    label: 'CA 憑證深度',
    desc: '在有效的憑證路徑中，可以跟隨對等憑證的非自頒發中間憑證的最大數量。\n因此，如果深度為0，則對等方必須由受信任的根 CA 直接簽名；<br/>\n如果是1，路徑可以是 PEER、中間 CA、ROOT-CA；<br/>\n如果是2，則路徑可以是PEER、中間 CA1、中間 CA2、ROOT-CA。',
  },
  ssl_opts_server_name_indication: {
    label: 'SNI',
    desc: '指定要在 TLS 伺服器名稱指示擴充套件中使用的主機名。<br/>\n例如，當連線到 "server.example.net" 時，接受連線並執行 TLS 握手的真正伺服器可能與 TLS 用戶端最初連線到的主機不同，\n例如，當連線到 IP 地址時，或者當主機具有多個可解析的 DNS 記錄時<br/>\n如果未指定，它將預設為使用的主機名字串\n建立連線，除非使用 IP 地址<br/>\n然後，主機名也用於對等機的主機名驗證憑證<br/>\n特殊值 <code>disable</code> 阻止傳送伺服器名稱指示擴充套件，並停用主機名驗證檢查。',
  },
  ssl_opts_enable: {
    label: '啟用 TLS',
    desc: '啟用 TLS。',
  },
  ssl_opts_ciphers: {
    label: '加密套件',
    desc: "此設定儲存由逗號分隔的 TLS 密碼套件名稱。例如\n<code>TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256</code>。\n<br/>\n密碼（及其順序）定義了用戶端和伺服器透過網路連線加密資訊的方式。\n選擇一個好的密碼套件對於應用程式的資料安全性、機密性和效能至關重要。\n\n名稱應為 OpenSSL 字串格式（而不是 RFC 格式）。\nEMQX 設定文件提供的所有預設值和範例都是 OpenSSL 格式<br/>\n注意：某些密碼套件僅與特定的 TLS <code>版本</code>相容（'tlsv1.1'、'tlsv1.2'或'tlsv1.3'）。\n不相容的密碼套件將被自動刪除。\n\n例如，如果只有 <code>versions</code> 僅設定為 <code>tlsv1.3</code>。為其他版本設定密碼套件將無效。\n\n<br/>\n注：PSK 的 Ciphers 不支援 tlsv1.3<br/>\n如果打算使用PSK密碼套件 <code>tlsv1.3</code>。應在<code>ssl.versions</code>中停用。\n\n<br/>\nPSK 密碼套件：\n<code>RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,\nRSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,\nRSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,\nRSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA</code>",
  },
  ssl_opts_log_level: {
    label: 'SSL 日誌級別',
    desc: "SSL 通訊的日誌級別。預設為 '通知'。設定為 'debug' 可檢查 TLS 握手資訊",
  },
  ssl_opts_partial_chain: {
    label: '啟用部分鏈驗證',
    desc: '啟用或停用使用 partial_chain 進行對等驗證。當本地在 x509 路徑驗證過程中驗證對等憑證時，它會構建一個從對等憑證開始，以信任錨結束的憑證鏈。預設情況下，如果設定為 `false`，信任錨是根 CA，憑證鏈必須完整。然而，如果設定為 `true` 或 `cacert_from_cacertfile`，則 `cacertfile` 中的最後一個憑證將被用作信任錨憑證（中間 CA）。這在路徑驗證中建立了一個部分鏈。或者，如果設定為 `two_cacerts_from_cacertfile`，`cacertfile` 中的最後兩個憑證之一將被用作信任錨憑證，形成部分鏈。此選項對於中間 CA 憑證輪換特別有用。然而，請注意，它會帶來一些額外的開銷，因此應僅用於憑證輪換目的。',
  },
  ssl_opts_verify_peer_ext_key_usage: {
    label: '驗證擴充套件金鑰用法',
    desc: '驗證對等憑證中的擴充套件金鑰用法<br/>為了進行額外的對等憑證驗證，這裡定義的值必須使用 [rfc5280](https://www.rfc-editor.org/rfc/rfc5280#section-4.2.1.12) 中定義的對等憑證的"擴充套件金鑰用法"。<br/>允許的值有<br/>- `clientAuth`<br/>- `serverAuth`<br/>- `codeSigning`<br/>- `emailProtection`<br/>- `timeStamping`<br/>- `ocspSigning`<br/>- 原始 OID，例如："OID:1.3.6.1.5.5.7.3.2" 意味著 `id-pk 2`，相當於 `clientAuth`<br/>也支援逗號分隔的字串來驗證多個金鑰用法。<br/>例如，`"serverAuth,OID:1.3.6.1.5.5.7.3.2"`',
  },
  ssl_opts_namespace: {
    label: '命名空間',
  },
  ssl_opts_bundle_name: {
    label: '託管憑證包名稱',
  },
  file_trans_enable: {
    label: '是否啟用檔案傳輸',
  },
  init_timeout: {
    label: '初始化逾時時間',
    desc: '當 `init` 指令逾時時（例如由於系統過載），訊息 PUBACK 將包含錯誤程式碼（0x80）。',
  },
  store_segment_timeout: {
    label: '分片儲存逾時時間',
    desc: '當 `segment` 指令逾時時（例如由於系統過載），訊息 PUBACK 將包含錯誤程式碼（0x80）。',
  },
  assemble_timeout: {
    label: '檔案拼接逾時時間',
    desc: '當 `fin` 指令逾時時（例如由於系統過載），訊息 PUBACK 將包含錯誤程式碼（0x80）。',
  },
  file_trans_storage_local_segments_root: {
    label: '分片儲存目錄',
    desc: '已上傳的分片臨時儲存路徑，絕對路徑，建議優先設定到高 I/O 效能的磁碟上。',
  },
  minimum_segments_ttl: {
    label: '分片儲存最小有效期',
    desc: '分片儲存最小有效期，達到有效期之前，分片將不會被清理，即使某些檔案指定的 TTL 小於此值，或分片已經被合併。',
  },
  maximum_segments_ttl: {
    label: '分片儲存最大有效期',
    desc: '分片儲存最大有效期，達到有效期之後，分片將被清理，即使某些檔案指定的 TTL 大於此值，或分片未被合併。',
  },
  storage_local_exporter_local_enable: {
    label: '是否啟用本地儲存',
    desc: '在檔案上傳完成後拼接分片並存儲到本地指定目錄。',
  },
  file_trans_storage_local_exporter_local_root: {
    label: '檔案儲存目錄',
    desc: '已上傳完成，拼接成功的檔案儲存路徑，絕對路徑。',
  },
  storage_local_exporter_s_3_enable: {
    label: '是否啟用 S3 儲存',
    desc: '在檔案上傳完成後拼接分片並存儲到 S3 指定 Bucket。',
  },
  access_key_id: {
    label: '存取金鑰 ID',
  },
  secret_access_key: {
    label: '存取金鑰',
  },
  interval: {
    label: '儲存垃圾回收間隔',
    desc: '定期垃圾回收的間隔時間。',
  },
  host: {
    label: '地址',
  },
  port: {
    label: '連接埠',
  },
  bucket: {
    label: '儲存桶',
  },
  url_expire_time: {
    label: 'URL 過期時間',
    desc: '生成的 URL 的過期時間。',
  },
  min_part_size: {
    label: '最小分片大小',
  },
  max_part_size: {
    label: '最大分片大小',
  },
  acl: {
    label: 'ACL',
    desc: '上傳物件使用的 ACL。',
  },
  ipv6_probe: {
    label: 'IPv6 探針',
    desc: '是否探測 IPv6 支援。',
  },
  headers: {
    label: '請求標頭',
  },
  max_retries: {
    label: '最大重試次數',
    desc: '請求出錯時的最大重試次數。',
  },
  request_timeout: {
    label: 'HTTP 請求逾時',
  },
  connect_timeout: {
    label: '連線逾時',
  },
  pool_type: {
    label: '連線池類型',
    desc: '連線池的類型。可以是`random`、`hash`之一。',
  },
  pool_size: {
    label: '連線池大小',
  },
  enable_pipelining: {
    label: 'HTTP 管道',
  },
  access_method: {
    label: '存取模式',
  },
  flapping_detect_window_time: {
    label: '檢測時間視窗',
    desc: '用於檢測連線抖動的時間視窗。預設值：`1m`。',
  },
  flapping_detect_max_count: {
    label: '最大連線次數',
    desc: '在檢測時間視窗內允許的最大連線次數，超過後將封鎖對應的用戶端 ID、使用者名稱或源 IP 地址。預設值：`15`。',
  },
  flapping_detect_ban_time: {
    label: '封鎖時長',
    desc: '對應用戶端 ID、使用者名稱或源 IP 地址的封鎖時長。預設值：`5m`。',
  },
  a2a_registry_enable: {
    label: '啟用 A2A Registry',
  },
  a2a_registry_validate_schema: {
    label: '驗證 Schema',
    desc: '寫入時是否驗證 Agent 卡片的 Schema。',
  },
}
