# EMQX 5.0.0-rc.1-55d74acd Configuration
EMQX configuration file is in [HOCON](https://github.com/emqx/hocon) format.
HOCON, or Human-Optimized Config Object Notation is a format for human-readable data,
and a superset of JSON.

## Layered

EMQX configuration consists of 3 layers.
From bottom up:

1. Immutable base: `emqx.conf` + `EMQX_` prefixed environment variables.<br>
   Changes in this layer require a full node restart to take effect.
1. Cluster overrides: `$EMQX_NODE__DATA_DIR/configs/cluster-override.conf`
1. Local node overrides: `$EMQX_NODE__DATA_DIR/configs/local-override.conf`

When environment variable `$EMQX_NODE__DATA_DIR` is not set, config `node.data_dir`
is used.

The `*-override.conf` files are overwritten at runtime when changes
are made from dashboard UI, management HTTP API, or CLI.

**NOTE** Config values from `*-override.conf` are **not** mapped to boot configs for
the config fields attributed with `mapping: path.to.boot.config.key`

For detailed override rules, see [Config Overlay Rules](#config-overlay-rules).

## Syntax

In config file the values can be notated as JSON like objects, such as
```
node {
    name = "emqx@127.0.0.1"
    cookie = "mysecret"
}
```

Another equivalent representation is flat, such as

```
node.name = "127.0.0.1"
node.cookie = "mysecret"
```

This flat format is almost backward compatible with EMQX's config file format
in 4.x series (the so called 'cuttlefish' format).

It is 'almost' compatible because the often HOCON requires strings to be quoted,
while cuttlefish treats all characters to the right of the `=` mark as the value.

e.g. cuttlefish: `node.name = emqx@127.0.0.1`, HOCON: `node.name = "emqx@127.0.0.1"`.

Strings without special characters in them can be unquoted in HOCON too,
e.g. `foo`, `foo_bar` and `foo_bar_1`.

For more HOCON syntax, please refer to the [specification](https://github.com/lightbend/config/blob/main/HOCON.md)

## Schema

To make the HOCON objects type-safe, EMQX introduced a schema for it.
The schema defines data types, and data fields' names and metadata for config value validation
and more. In fact, this config document itself is generated from schema metadata.

### Complex Data Types

There are 4 complex data types in EMQX's HOCON config:

1. Struct: Named using an unquoted string, followed by a predefined list of fields,
   fields can not start with a number, and are only allowed to use
   lowercase letters and underscores as word separator.
1. Map: Map is like Struct, however the fields are not predefined.
   1-based index number can also be used as map keys for an alternative
   representation of an Array.
1. Union: `MemberType1 | MemberType2 | ...`
1. Array: `[ElementType]`

### Primitive Data Types

Complex types define data 'boxes' which may contain other complex data
or primitive values.
There are quite some different primitive types, to name a few:

* `atom()`
* `boolean()`
* `string()`
* `integer()`
* `float()`
* `number()`
* `binary()` # another format of string()
* `emqx_schema:duration()` # time duration, another format of integer()
* ...

The primitive types are mostly self-describing, some are built-in, such
as `atom()`, some are defined in EMQX modules, such as `emqx_schema:duration()`.

### Config Paths

If we consider the whole EMQX config as a tree,
to reference a primitive value, we can use a dot-separated names form string for
the path from the tree-root (always a Struct) down to the primitive values at tree-leaves.

Each segment of the dotted string is a Struct filed name or Map key.
For Array elements, 1-based index is used.

below are some examples

```
node.name = "emqx.127.0.0.1"
zone.zone1.max_packet_size = "10M"
authentication.1.enable = true
```

### Environment variables

Environment variables can be used to define or override config values.

Due to the fact that dots (`.`) are not allowed in environment variables, dots are
replaced with double-underscores (`__`).

And the `EMQX_` prefix is used as the namespace.

For example `node.name` can be represented as `EMQX_NODE__NAME`

Environment variable values are parsed as HOCON values, this allows users
to even set complex values from environment variables.

For example, this environment variable sets an array value.

```
export EMQX_LISTENERS__SSL__L1__AUTHENTICATION__SSL__CIPHERS="[\"TLS_AES_256_GCM_SHA384\"]"
```

Unknown environment variables are logged as a `warning` level log, for example:

```
[warning] unknown_env_vars: ["EMQX_AUTHENTICATION__ENABLED"]
```

because the field name is `enable`, not `enabled`.

<strong>NOTE:</strong> Unknown root keys are however silently discarded.

### Config Overlay Rules

HOCON objects are overlaid, in general:

- Within one file, objects defined 'later' recursively override objects defined 'earlier'
- When layered, 'later' (higher layer) objects override objects defined 'earlier' (lower layer)

Below are more detailed rules.

#### Struct Fields

Later config values overwrites earlier values.
For example, in below config, the last line `debug` overwrites `error` for
console log handler's `level` config, but leaving `enable` unchanged.
```
log {
    console_handler{
        enable=true,
        level=error
    }
}

## ... more configs ...

log.console_handler.level=debug
```

#### Map Values

Maps are like structs, only the files are user-defined rather than
the config schema. For instance, `zone1` in the example below.

```
zone {
    zone1 {
        mqtt.max_packet_size = 1M
    }
}

## The maximum packet size can be defined as above,
## then overridden as below

zone.zone1.mqtt.max_packet_size = 10M
```

#### Array Elements

Arrays in EMQX config have two different representations

* list, such as: `[1, 2, 3]`
* indexed-map, such as: `{"1"=1, "2"=2, "3"=3}`

Dot-separated paths with number in it are parsed to indexed-maps
e.g. `authentication.1={...}` is parsed as `authentication={"1": {...}}`

Indexed-map arrays can be used to override list arrays:

```
authentication=[{enable=true, backend="built_in_database", mechanism="password_based"}]
# we can disable this authentication provider with:
authentication.1.enable=false
```
However, list arrays do not get recursively merged into indexed-map arrays.
e.g.

```
authentication=[{enable=true, backend="built_in_database", mechanism="password_based"}]
## below value will replace the whole array, but not to override just one field.
authentication=[{enable=true}]
```

## Root Config Keys




**Fields**

- listeners: <code>[listeners](#listeners)</code>



- zones: <code>{$name -> [zone](#zone)}</code>

  A zone is a set of configs grouped by the zone <code>name</code>.<br>
  For flexible configuration mapping, the <code>name</code>
  can be set to a listener's <code>zone</code> config.<br>
  NOTE: A built-in zone named <code>default</code> is auto created
  and can not be deleted.

- mqtt: <code>[mqtt](#mqtt)</code>



- authentication: <code>[[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)]</code>

  Default authentication configs for all MQTT listeners.
  <br>
  For per-listener overrides see <code>authentication</code>
  in listener configs
  <br>
  <br>
  EMQX can be configured with:
  <br>
  <ul>
  <li><code>[]</code>: The default value, it allows *ALL* logins</li>
  <li>one: For example <code>{enable:true,backend:"built_in_database",mechanism="password_based"}
  </code></li>
  <li>chain: An array of structs.</li>
  </ul>
  <br>
  When a chain is configured, the login credentials are checked against the backends
  per the configured order, until an 'allow' or 'deny' decision can be made.
  <br>
  If there is no decision after a full chain exhaustion, the login is rejected.

  Authentication can be one single authenticator instance or a chain of authenticators as an array.
  When authenticating a login (username, client ID, etc.) the authenticators are checked in the configured order.<br>


- authorization: <code>[authorization](#authorization)</code>


  Authorization a.k.a. ACL.<br>
  In EMQX, MQTT client access control is extremely flexible.<br>
  An out-of-the-box set of authorization data sources are supported.
  For example,<br>
  'file' source is to support concise and yet generic ACL rules in a file;<br>
  'built_in_database' source can be used to store per-client customizable rule sets,
  natively in the EMQX node;<br>
  'http' source to make EMQX call an external HTTP API to make the decision;<br>
  'PostgreSQL' etc. to look up clients or rules from external databases;<br>


- node: <code>[node](#node)</code>



- cluster: <code>[cluster](#cluster)</code>



- log: <code>[log](#log)</code>



- rpc: <code>[rpc](#rpc)</code>



- db: <code>[db](#db)</code>



- broker: <code>[broker](#broker)</code>



- sys_topics: <code>[sys_topics](#sys_topics)</code>



- rate_limit: <code>[rate_limit](#rate_limit)</code>



- force_shutdown: <code>[force_shutdown](#force_shutdown)</code>



- overload_protection: <code>[overload_protection](#overload_protection)</code>



- force_gc: <code>[force_gc](#force_gc)</code>



- conn_congestion: <code>[conn_congestion](#conn_congestion)</code>



- stats: <code>[stats](#stats)</code>



- sysmon: <code>[sysmon](#sysmon)</code>



- alarm: <code>[alarm](#alarm)</code>



- flapping_detect: <code>[flapping_detect](#flapping_detect)</code>



- persistent_session_store: <code>[persistent_session_store](#persistent_session_store)</code>



- trace: <code>[trace](#trace)</code>



- bridges: <code>[bridge:bridges](#bridge-bridges)</code>



- retainer: <code>[retainer](#retainer)</code>



- statsd: <code>[statsd](#statsd)</code>



- auto_subscribe: <code>[auto_subscribe](#auto_subscribe)</code>



- delayed: <code>[modules:delayed](#modules-delayed)</code>



- telemetry: <code>[modules:telemetry](#modules-telemetry)</code>



- rewrite: <code>[[modules:rewrite](#modules-rewrite)]</code>

  List of topic rewrite rules.

- topic_metrics: <code>[[modules:topic_metrics](#modules-topic_metrics)]</code>

  List of topics whose metrics are reported.

- plugins: <code>[plugin:plugins](#plugin-plugins)</code>



- dashboard: <code>[dashboard](#dashboard)</code>



- gateway: <code>[gateway](#gateway)</code>



- prometheus: <code>[prometheus](#prometheus)</code>



- rule_engine: <code>[rule_engine](#rule_engine)</code>



- exhook: <code>[exhook](#exhook)</code>



- psk_authentication: <code>[psk_authentication](#psk_authentication)</code>



- limiter: <code>[limiter](#limiter)</code>



- connectors: <code>[connectors](#connectors)</code>



- slow_subs: <code>[slow_subs](#slow_subs)</code>




## authz:file
Authorization using a static file.


**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>



**Fields**

- type: <code>file</code>

  Backend type.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable this backend.

- path: <code>string()</code>


  Path to the file which contains the ACL rules.<br>
  If the file provisioned before starting EMQX node,
  it can be placed anywhere as long as EMQX has read access to it.

  In case the rule-set is created from EMQX dashboard or management API,
  the file will be placed in `authz` subdirectory inside EMQX's `data_dir`,
  and the new rules will override all rules from the old config file.



## authz:http_get
Authorization using an external HTTP server (via GET requests).


**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>



**Fields**

- method: <code>get</code>
  * default: 
  `get`

  HTTP method.

- headers: <code>[{binary(), binary()}]</code>
  * default: 

  ```
  {
    accept = "application/json"
    "cache-control" = "no-cache"
    connection = "keep-alive"
    "keep-alive" = "timeout=30, max=1000"
  }
  ```

  List of HTTP headers.

- url: <code>binary()</code>

  URL of the auth server.

- request_timeout: <code>string()</code>
  * default: 
  `"30s"`

  Request timeout.

- body: <code>map()</code>

  HTTP request body.

- connect_timeout: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"15s"`

  The timeout when connecting to the HTTP server.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable the backend.

- enable_pipelining: <code>boolean()</code>
  * default: 
  `true`

  Enable the HTTP pipeline.

- max_retries: <code>non_neg_integer()</code>
  * default: 
  `5`

  Max retry times if error on sending request.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  The pool size.

- request: <code>[connector-http:request](#connector-http-request)</code>


  If the request is provided, the caller can send HTTP requests via
  <code>emqx_resource:query(ResourceId, {send_message, BridgeId, Message})</code>


- retry_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"1s"`

  Interval between retries.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.

- type: <code>http</code>

  Database backend.


## authz:http_post
Authorization using an external HTTP server (via POST requests).


**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>



**Fields**

- method: <code>post</code>
  * default: 
  `post`

  HTTP method.

- headers: <code>[{binary(), binary()}]</code>
  * default: 

  ```
  {
    accept = "application/json"
    "cache-control" = "no-cache"
    connection = "keep-alive"
    "content-type" = "application/json"
    "keep-alive" = "timeout=30, max=1000"
  }
  ```

  List of HTTP headers.

- url: <code>binary()</code>

  URL of the auth server.

- request_timeout: <code>string()</code>
  * default: 
  `"30s"`

  Request timeout.

- body: <code>map()</code>

  HTTP request body.

- connect_timeout: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"15s"`

  The timeout when connecting to the HTTP server.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable the backend.

- enable_pipelining: <code>boolean()</code>
  * default: 
  `true`

  Enable the HTTP pipeline.

- max_retries: <code>non_neg_integer()</code>
  * default: 
  `5`

  Max retry times if error on sending request.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  The pool size.

- request: <code>[connector-http:request](#connector-http-request)</code>


  If the request is provided, the caller can send HTTP requests via
  <code>emqx_resource:query(ResourceId, {send_message, BridgeId, Message})</code>


- retry_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"1s"`

  Interval between retries.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.

- type: <code>http</code>

  Database backend.


## authz:mnesia
Authorization using a built-in database (mnesia).


**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>



**Fields**

- type: <code>built_in_database</code>

  Backend type.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable this backend.


## authz:mongo_rs
Authorization using a MongoDB replica set.


**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>



**Fields**

- collection: <code>atom()</code>

  `MongoDB` collection containing the authorization data.

- selector: <code>map()</code>

  MQL query used to select the authorization record.

- type: <code>mongodb</code>

  Database backend.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable the backend.

- mongo_type: <code>rs</code>
  * default: 
  `rs`

  Replica set.

- servers: <code>[term()]</code>

  A Node list for Cluster to connect to. The nodes should be separated with commas, such as: `Node[,Node].<br/>`
  For each Node should be: 
  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The MongoDB default port 27017 is used if `[:Port]` is not specified.

- w_mode: <code>unsafe | safe</code>
  * default: 
  `unsafe`

  Write mode.

- r_mode: <code>master | slave_ok</code>
  * default: 
  `master`

  Read mode.

- replica_set_name: <code>binary()</code>

  Name of the replica set.

- srv_record: <code>boolean()</code>
  * default: 
  `false`

  Use DNS SRV record.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- username: <code>binary()</code>

  EMQX's username in the external database.

- password: <code>binary()</code>

  EMQX's password in the external database.

- auth_source: <code>binary()</code>

  Database name associated with the user's credentials.

- database: <code>binary()</code>

  Database name.

- topology: <code>[topology](#topology)</code>



- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authz:mongo_sharded
Authorization using a sharded MongoDB cluster.


**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>



**Fields**

- collection: <code>atom()</code>

  `MongoDB` collection containing the authorization data.

- selector: <code>map()</code>

  MQL query used to select the authorization record.

- type: <code>mongodb</code>

  Database backend.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable the backend.

- mongo_type: <code>sharded</code>
  * default: 
  `sharded`

  Sharded cluster.

- servers: <code>[term()]</code>

  A Node list for Cluster to connect to. The nodes should be separated with commas, such as: `Node[,Node].<br/>`
  For each Node should be: 
  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The MongoDB default port 27017 is used if `[:Port]` is not specified.

- w_mode: <code>unsafe | safe</code>
  * default: 
  `unsafe`

  Write mode.

- srv_record: <code>boolean()</code>
  * default: 
  `false`

  Use DNS SRV record.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- username: <code>binary()</code>

  EMQX's username in the external database.

- password: <code>binary()</code>

  EMQX's password in the external database.

- auth_source: <code>binary()</code>

  Database name associated with the user's credentials.

- database: <code>binary()</code>

  Database name.

- topology: <code>[topology](#topology)</code>



- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authz:mongo_single
Authorization using a single MongoDB instance.


**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>



**Fields**

- collection: <code>atom()</code>

  `MongoDB` collection containing the authorization data.

- selector: <code>map()</code>

  MQL query used to select the authorization record.

- type: <code>mongodb</code>

  Database backend.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable the backend.

- mongo_type: <code>single</code>
  * default: 
  `single`

  Standalone instance.

- server: <code>emqx_schema:ip_port()</code>


  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The MongoDB default port 27017 is used if `[:Port]` is not specified.

- w_mode: <code>unsafe | safe</code>
  * default: 
  `unsafe`

  Write mode.

- srv_record: <code>boolean()</code>
  * default: 
  `false`

  Use DNS SRV record.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- username: <code>binary()</code>

  EMQX's username in the external database.

- password: <code>binary()</code>

  EMQX's password in the external database.

- auth_source: <code>binary()</code>

  Database name associated with the user's credentials.

- database: <code>binary()</code>

  Database name.

- topology: <code>[topology](#topology)</code>



- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authz:mysql
Authorization using a MySQL database.


**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>



**Fields**

- type: <code>mysql</code>

  Database backend.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable the backend.

- server: <code>emqx_schema:ip_port()</code>


  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The MySQL default port 3306 is used if `[:Port]` is not specified.

- database: <code>binary()</code>

  Database name.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- username: <code>binary()</code>

  EMQX's username in the external database.

- password: <code>binary()</code>

  EMQX's password in the external database.

- auto_reconnect: <code>boolean()</code>
  * default: 
  `true`

  Enable automatic reconnect to the database.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.

- query: <code>binary()</code>

  Database query used to retrieve authorization data.


## authz:postgresql
Authorization using a PostgreSQL database.


**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>



**Fields**

- query: <code>binary()</code>

  Database query used to retrieve authorization data.

- type: <code>postgresql</code>

  Backend type.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable this backend.

- named_queries: <code>map()</code>

  Key-value list of prepared SQL statements.

- server: <code>emqx_schema:ip_port()</code>


  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The PostgreSQL default port 5432 is used if `[:Port]` is not specified.

- database: <code>binary()</code>

  Database name.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- username: <code>binary()</code>

  EMQX's username in the external database.

- password: <code>binary()</code>

  EMQX's password in the external database.

- auto_reconnect: <code>boolean()</code>
  * default: 
  `true`

  Enable automatic reconnect to the database.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authz:redis_cluster
Authorization using a Redis cluster.


**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>



**Fields**

- type: <code>redis</code>

  Database backend.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable the backend.

- servers: <code>[term()]</code>

  A Node list for Cluster to connect to. The nodes should be separated with commas, such as: `Node[,Node].<br/>`
  For each Node should be: 
  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The Redis default port 6379 is used if `[:Port]` is not specified.

- redis_type: <code>cluster</code>
  * default: 
  `cluster`

  Redis type.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- password: <code>binary()</code>

  EMQX's password in the external database.

- database: <code>integer()</code>
  * default: 
  `0`

  Redis database ID.

- auto_reconnect: <code>boolean()</code>
  * default: 
  `true`

  Enable automatic reconnect to the database.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.

- cmd: <code>binary()</code>

  Database query used to retrieve authorization data.


## authz:redis_sentinel
Authorization using a Redis Sentinel.


**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>



**Fields**

- type: <code>redis</code>

  Database backend.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable the backend.

- servers: <code>[term()]</code>

  A Node list for Cluster to connect to. The nodes should be separated with commas, such as: `Node[,Node].<br/>`
  For each Node should be: 
  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The Redis default port 6379 is used if `[:Port]` is not specified.

- redis_type: <code>sentinel</code>
  * default: 
  `sentinel`

  Redis type.

- sentinel: <code>string()</code>

  The cluster name in Redis sentinel mode.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- password: <code>binary()</code>

  EMQX's password in the external database.

- database: <code>integer()</code>
  * default: 
  `0`

  Redis database ID.

- auto_reconnect: <code>boolean()</code>
  * default: 
  `true`

  Enable automatic reconnect to the database.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.

- cmd: <code>binary()</code>

  Database query used to retrieve authorization data.


## authz:redis_single
Authorization using a single Redis instance.


**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>



**Fields**

- type: <code>redis</code>

  Database backend.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable the backend.

- server: <code>emqx_schema:ip_port()</code>


  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The Redis default port 6379 is used if `[:Port]` is not specified.

- redis_type: <code>single</code>
  * default: 
  `single`

  Redis type.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- password: <code>binary()</code>

  EMQX's password in the external database.

- database: <code>integer()</code>
  * default: 
  `0`

  Redis database ID.

- auto_reconnect: <code>boolean()</code>
  * default: 
  `true`

  Enable automatic reconnect to the database.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.

- cmd: <code>binary()</code>

  Database query used to retrieve authorization data.


## exhook
External hook (exhook) configuration.


**Config paths**

 - <code>exhook</code>


**Env overrides**

 - <code>EMQX_EXHOOK</code>



**Fields**

- servers: <code>[[exhook:server](#exhook-server)]</code>
  * default: 
  `[]`

  List of exhook servers.


## exhook:server
gRPC server configuration.


**Config paths**

 - <code>exhook.servers.$INDEX</code>


**Env overrides**

 - <code>EMQX_EXHOOK__SERVERS__$INDEX</code>



**Fields**

- name: <code>binary()</code>

  Name of the exhook server.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable the exhook server.

- url: <code>binary()</code>

  URL of the gRPC server.

- request_timeout: <code>emqx_exhook_schema:duration()</code>
  * default: 
  `"5s"`

  The timeout to request gRPC server.

- failed_action: <code>deny | ignore</code>
  * default: 
  `deny`

  The value that is returned when the request to the gRPC server fails for any reason.

- ssl: <code>[exhook:ssl_conf](#exhook-ssl_conf)</code>



- auto_reconnect: <code>false | emqx_exhook_schema:duration()</code>
  * default: 
  `"60s"`

  Whether to automatically reconnect (initialize) the gRPC server.<br/>When gRPC is not available, exhook tries to request the gRPC service at that interval and reinitialize the list of mounted hooks.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  The process pool size for gRPC client.


## exhook:ssl_conf
SSL client configuration.


**Config paths**

 - <code>exhook.servers.$INDEX.ssl</code>


**Env overrides**

 - <code>EMQX_EXHOOK__SERVERS__$INDEX__SSL</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable TLS.

- cacertfile: <code>string()</code>

  Trusted PEM format CA certificates bundle file.<br>
  The certificates in this file are used to verify the TLS peer's certificates.
  Append new certificates to the file if new CAs are to be trusted.
  There is no need to restart EMQX to have the updated file loaded, because
  the system regularly checks if file has been updated (and reload).<br>
  NOTE: invalidating (deleting) a certificate from the file will not affect
  already established connections.


- certfile: <code>string()</code>

  PEM format certificates chain file.<br>
  The certificates in this file should be in reversed order of the certificate
  issue chain. That is, the host's certificate should be placed in the beginning
  of the file, followed by the immediate issuer certificate and so on.
  Although the root CA certificate is optional, it should be placed at the end of
  the file if it is to be added.

- keyfile: <code>string()</code>

  PEM format private key file.

- verify: <code>verify_peer | verify_none</code>
  * default: 
  `verify_none`

  Enable or disable peer verification.

- reuse_sessions: <code>boolean()</code>
  * default: 
  `true`

  Enable TLS session reuse.

- depth: <code>integer()</code>
  * default: 
  `10`

  Maximum number of non-self-issued intermediate certificates that can follow the peer certificate in a valid certification path. So, if depth is 0 the PEER must be signed by the trusted ROOT-CA directly; if 1 the path can be PEER, CA, ROOT-CA; if 2 the path can be PEER, CA, CA, ROOT-CA, and so on. The default value is 10.

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  key file is password-protected.

- versions: <code>[atom()]</code>
  * default: 
  `[tlsv1.3, tlsv1.2, tlsv1.1, tlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.

- ciphers: <code>[string()]</code>
  * default: 
  `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256", "TLS_AES_128_CCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

  This config holds TLS cipher suite names separated by comma,
  or as an array of strings. e.g.
  <code>"TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256"</code> or
  <code>["TLS_AES_256_GCM_SHA384","TLS_AES_128_GCM_SHA256"]</code>.
  <br>
  Ciphers (and their ordering) define the way in which the
  client and server encrypts information over the network connection.
  Selecting a good cipher suite is critical for the
  application's data security, confidentiality and performance.

  The names should be in OpenSSL string format (not RFC format).
  All default values and examples provided by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- secure_renegotiate: <code>boolean()</code>
  * default: 
  `true`

  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.

- server_name_indication: <code>disable | string()</code>

  Specify the host name to be used in TLS Server Name Indication extension.<br>
  For instance, when connecting to "server.example.net", the genuine server
  which accepts the connection and performs TLS handshake may differ from the
  host the TLS client initially connects to, e.g. when connecting to an IP address
  or when the host has multiple resolvable DNS records <br>
  If not specified, it will default to the host name string which is used
  to establish the connection, unless it is IP addressed used.<br>
  The host name is then also used in the host name verification of the peer
  certificate.<br> The special value 'disable' prevents the Server Name
  Indication extension from being sent and disables the hostname
  verification check.


## gateway:clientinfo_override
ClientInfo override.


**Config paths**

 - <code>gateway.coap.clientinfo_override</code>
 - <code>gateway.exproto.clientinfo_override</code>
 - <code>gateway.lwm2m.clientinfo_override</code>
 - <code>gateway.mqttsn.clientinfo_override</code>
 - <code>gateway.stomp.clientinfo_override</code>


**Env overrides**

 - <code>EMQX_GATEWAY__COAP__CLIENTINFO_OVERRIDE</code>
 - <code>EMQX_GATEWAY__EXPROTO__CLIENTINFO_OVERRIDE</code>
 - <code>EMQX_GATEWAY__LWM2M__CLIENTINFO_OVERRIDE</code>
 - <code>EMQX_GATEWAY__MQTTSN__CLIENTINFO_OVERRIDE</code>
 - <code>EMQX_GATEWAY__STOMP__CLIENTINFO_OVERRIDE</code>



**Fields**

- username: <code>binary()</code>

  Template for overriding username.

- password: <code>binary()</code>

  Template for overriding password.

- clientid: <code>binary()</code>

  Template for overriding clientid.


## gateway:coap
The CoAP protocol gateway provides EMQX with the access capability of the CoAP protocol.
It allows publishing, subscribing, and receiving messages to EMQX in accordance
with a certain defined CoAP message format.


**Config paths**

 - <code>gateway.coap</code>


**Env overrides**

 - <code>EMQX_GATEWAY__COAP</code>



**Fields**

- heartbeat: <code>emqx_gateway_schema:duration()</code>
  * default: 
  `"30s"`

  The gateway server required minimum heartbeat interval.<br>
  When connection mode is enabled, this parameter is used to set the minimum
  heartbeat interval for the connection to be alive.

- connection_required: <code>boolean()</code>
  * default: 
  `false`

  Enable or disable connection mode.<br>
  Connection mode is a feature of non-standard protocols. When connection mode
  is enabled, it is necessary to maintain the creation, authentication and alive
  of connection resources

- notify_type: <code>non | con | qos</code>
  * default: 
  `qos`

  The Notification Message will be delivered to the CoAP client if a new message
  received on an observed topic.
  The type of delivered coap message can be set to:<br>
  1. non: Non-confirmable;<br>
  2. con: Confirmable;<br>
  3. qos: Mapping from QoS type of received message, QoS0 -> non, QoS1,2 -> con

- subscribe_qos: <code>qos0 | qos1 | qos2 | coap</code>
  * default: 
  `coap`

  The Default QoS Level indicator for subscribe request.<br>
  This option specifies the QoS level for the CoAP Client when establishing a
  subscription membership, if the subscribe request is not carried `qos` option.
  The indicator can be set to:
    - qos0, qos1, qos2: Fixed default QoS level
    - coap: Dynamic QoS level by the message type of subscribe request
      * qos0: If the subscribe request is non-confirmable
      * qos1: If the subscribe request is confirmable

- publish_qos: <code>qos0 | qos1 | qos2 | coap</code>
  * default: 
  `coap`

  The Default QoS Level indicator for publish request.<br>
  This option specifies the QoS level for the CoAP Client when publishing a
  message to EMQX PUB/SUB system, if the publish request is not carried `qos`
  option. The indicator can be set to:
    - qos0, qos1, qos2: Fixed default QoS level
    - coap: Dynamic QoS level by the message type of publish request
      * qos0: If the publish request is non-confirmable
      * qos1: If the publish request is confirmable

- listeners: <code>[gateway:udp_listeners](#gateway-udp_listeners)</code>

  Listeners (UDP) for CoAP service

- enable: <code>boolean()</code>
  * default: 
  `true`

  Whether to enable this gateway

- enable_stats: <code>boolean()</code>
  * default: 
  `true`

  Whether to enable client process statistic

- idle_timeout: <code>emqx_gateway_schema:duration()</code>
  * default: 
  `"30s"`

  The idle time of the client connection process.<br>
  It has two purposes:
  1. A newly created client process that does not receive any client requests
     after that time will be closed directly.
  2. A running client process that does not receive any client requests after
     this time will go into hibernation to save resources.

- mountpoint: <code>binary()</code>
  * default: 
  `""`



- clientinfo_override: <code>[gateway:clientinfo_override](#gateway-clientinfo_override)</code>



- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs


## gateway:dtls_listener
Settings for the DTLS listener.


**Config paths**

 - <code>gateway.coap.listeners.dtls.$name</code>
 - <code>gateway.exproto.listeners.dtls.$name</code>
 - <code>gateway.lwm2m.listeners.dtls.$name</code>
 - <code>gateway.mqttsn.listeners.dtls.$name</code>


**Env overrides**

 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME</code>



**Fields**

- acceptors: <code>integer()</code>
  * default: 
  `16`

  Size of the acceptor pool.

- udp: <code>[gateway:udp_opts](#gateway-udp_opts)</code>



- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable the listener.

- bind: <code>emqx_gateway_schema:ip_port() | integer()</code>

  The IP address and port that the listener will bind.

- max_connections: <code>integer()</code>
  * default: 
  `1024`

  Maximum number of concurrent connections.

- max_conn_rate: <code>integer()</code>
  * default: 
  `1000`

  Maximum connections per second.

- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs

- mountpoint: <code>binary()</code>

  When publishing or subscribing, prefix all topics with a mountpoint string.
   The prefixed string will be removed from the topic name when the message
   is delivered to the subscriber. The mountpoint is a way that users can use
   to implement isolation of message routing between different listeners.
   For example if a client A subscribes to `t` with `listeners.tcp.<name>.mountpoint`
   set to `some_tenant`, then the client actually subscribes to the topic
   `some_tenant/t`. Similarly, if another client B (connected to the same listener
   as the client A) sends a message to topic `t`, the message is routed
   to all the clients subscribed `some_tenant/t`, so client A will receive the
   message, with topic name `t`.<br/>
   Set to `""` to disable the feature.<br/>

   Variables in mountpoint string:
   - <code>${clientid}</code>: clientid
   - <code>${username}</code>: username

- access_rules: <code>[string()]</code>
  * default: 
  `[]`

  The access control rules for this listener.<br/>See: https://github.com/emqtt/esockd#allowdeny

- dtls: <code>[gateway:dtls_opts](#gateway-dtls_opts)</code>

  DTLS listener options


## gateway:dtls_opts
Settings for the DTLS protocol.


**Config paths**

 - <code>gateway.coap.listeners.dtls.$name.dtls</code>
 - <code>gateway.exproto.listeners.dtls.$name.dtls</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.dtls</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.dtls</code>


**Env overrides**

 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__DTLS</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__DTLS</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__DTLS</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__DTLS</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable TLS.

- cacertfile: <code>string()</code>

  Trusted PEM format CA certificates bundle file.<br>
  The certificates in this file are used to verify the TLS peer's certificates.
  Append new certificates to the file if new CAs are to be trusted.
  There is no need to restart EMQX to have the updated file loaded, because
  the system regularly checks if file has been updated (and reload).<br>
  NOTE: invalidating (deleting) a certificate from the file will not affect
  already established connections.


- certfile: <code>string()</code>

  PEM format certificates chain file.<br>
  The certificates in this file should be in reversed order of the certificate
  issue chain. That is, the host's certificate should be placed in the beginning
  of the file, followed by the immediate issuer certificate and so on.
  Although the root CA certificate is optional, it should be placed at the end of
  the file if it is to be added.

- keyfile: <code>string()</code>

  PEM format private key file.

- verify: <code>verify_peer | verify_none</code>
  * default: 
  `verify_none`

  Enable or disable peer verification.

- reuse_sessions: <code>boolean()</code>
  * default: 
  `true`

  Enable TLS session reuse.

- depth: <code>integer()</code>
  * default: 
  `10`

  Maximum number of non-self-issued intermediate certificates that can follow the peer certificate in a valid certification path. So, if depth is 0 the PEER must be signed by the trusted ROOT-CA directly; if 1 the path can be PEER, CA, ROOT-CA; if 2 the path can be PEER, CA, CA, ROOT-CA, and so on. The default value is 10.

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  key file is password-protected.

- versions: <code>[atom()]</code>
  * default: 
  `[dtlsv1.2, dtlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.

- ciphers: <code>[string()]</code>
  * default: 
  `["ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

  This config holds TLS cipher suite names separated by comma,
  or as an array of strings. e.g.
  <code>"TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256"</code> or
  <code>["TLS_AES_256_GCM_SHA384","TLS_AES_128_GCM_SHA256"]</code>.
  <br>
  Ciphers (and their ordering) define the way in which the
  client and server encrypts information over the network connection.
  Selecting a good cipher suite is critical for the
  application's data security, confidentiality and performance.

  The names should be in OpenSSL string format (not RFC format).
  All default values and examples provided by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>
  * default: 
  `"emqx_tls_psk:lookup"`

  EMQX-internal callback that is used to lookup pre-shared key (PSK) identity.

- secure_renegotiate: <code>boolean()</code>
  * default: 
  `true`

  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.

- dhfile: <code>string()</code>

  Path to a file containing PEM-encoded Diffie-Hellman parameters
  to be used by the server if a cipher suite using Diffie-Hellman
  key exchange is negotiated. If not specified, default parameters
  are used.<br>
  NOTE: The <code>dhfile</code> option is not supported by TLS 1.3.

- fail_if_no_peer_cert: <code>boolean()</code>
  * default: 
  `false`

  Used together with {verify, verify_peer} by an TLS/DTLS server.
  If set to true, the server fails if the client does not have a
  certificate to send, that is, sends an empty certificate.
  If set to false, it fails only if the client sends an invalid
  certificate (an empty certificate is considered valid).

- honor_cipher_order: <code>boolean()</code>
  * default: 
  `true`

  An important security setting, it forces the cipher to be set based
   on the server-specified order instead of the client-specified order,
   hence enforcing the (usually more properly configured) security
   ordering of the server administrator.

- client_renegotiation: <code>boolean()</code>
  * default: 
  `true`

  In protocols that support client-initiated renegotiation,
  the cost of resources of such an operation is higher for the server than the client.
  This can act as a vector for denial of service attacks.
  The SSL application already takes measures to counter-act such attempts,
  but client-initiated renegotiation can be strictly disabled by setting this option to false.
  The default value is true. Note that disabling renegotiation can result in
  long-lived connections becoming unusable due to limits on
  the number of messages the underlying cipher suite can encipher.


## gateway:exproto
Settings for EMQX extension protocol (exproto).


**Config paths**

 - <code>gateway.exproto</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO</code>



**Fields**

- server: <code>[gateway:exproto_grpc_server](#gateway-exproto_grpc_server)</code>

  Configurations for starting the <code>ConnectionAdapter</code> service

- handler: <code>[gateway:exproto_grpc_handler](#gateway-exproto_grpc_handler)</code>

  Configurations for request to <code>ConnectionHandler</code> service

- listeners: <code>[gateway:udp_tcp_listeners](#gateway-udp_tcp_listeners)</code>



- enable: <code>boolean()</code>
  * default: 
  `true`

  Whether to enable this gateway

- enable_stats: <code>boolean()</code>
  * default: 
  `true`

  Whether to enable client process statistic

- idle_timeout: <code>emqx_gateway_schema:duration()</code>
  * default: 
  `"30s"`

  The idle time of the client connection process.<br>
  It has two purposes:
  1. A newly created client process that does not receive any client requests
     after that time will be closed directly.
  2. A running client process that does not receive any client requests after
     this time will go into hibernation to save resources.

- mountpoint: <code>binary()</code>
  * default: 
  `""`



- clientinfo_override: <code>[gateway:clientinfo_override](#gateway-clientinfo_override)</code>



- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs


## gateway:exproto_grpc_handler
Settings for the exproto gRPC connection handler.


**Config paths**

 - <code>gateway.exproto.handler</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__HANDLER</code>



**Fields**

- address: <code>binary()</code>

  gRPC server address.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  SSL configuration for the gRPC client.


## gateway:exproto_grpc_server
Settings for the exproto gRPC server.


**Config paths**

 - <code>gateway.exproto.server</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__SERVER</code>



**Fields**

- bind: <code>emqx_gateway_schema:ip_port() | integer()</code>

  Listening address and port for the gRPC server.

- ssl: <code>[gateway:ssl_server_opts](#gateway-ssl_server_opts)</code>

  SSL configuration for the gRPC server.


## gateway
EMQX Gateway configuration root.


**Config paths**

 - <code>gateway</code>


**Env overrides**

 - <code>EMQX_GATEWAY</code>



**Fields**

- stomp: <code>[gateway:stomp](#gateway-stomp)</code>

  The Stomp Gateway configuration.<br>
  This gateway supports v1.2/1.1/1.0

- mqttsn: <code>[gateway:mqttsn](#gateway-mqttsn)</code>

  The MQTT-SN Gateway configuration.<br>
  This gateway only supports the v1.2 protocol

- coap: <code>[gateway:coap](#gateway-coap)</code>

  The CoAP Gateway configuration.<br>
  This gateway is implemented based on RFC-7252 and
  https://core-wg.github.io/coap-pubsub/draft-ietf-core-pubsub.html

- lwm2m: <code>[gateway:lwm2m](#gateway-lwm2m)</code>

  The LwM2M Gateway configuration.<br>
  This gateway only supports the v1.0.1 protocol

- exproto: <code>[gateway:exproto](#gateway-exproto)</code>

  The Extension Protocol configuration


## gateway:lwm2m
The LwM2M protocol gateway.


**Config paths**

 - <code>gateway.lwm2m</code>


**Env overrides**

 - <code>EMQX_GATEWAY__LWM2M</code>



**Fields**

- xml_dir: <code>binary()</code>
  * default: 
  `"etc/lwm2m_xml"`

  The Directory for LwM2M Resource definition

- lifetime_min: <code>emqx_gateway_schema:duration()</code>
  * default: 
  `"15s"`

  Minimum value of lifetime allowed to be set by the LwM2M client

- lifetime_max: <code>emqx_gateway_schema:duration()</code>
  * default: 
  `"86400s"`

  Maximum value of lifetime allowed to be set by the LwM2M client

- qmode_time_window: <code>emqx_gateway_schema:duration_s()</code>
  * default: 
  `"22s"`

  The value of the time window during which the network link is considered
  valid by the LwM2M Gateway in QMode mode.<br>
  For example, after receiving an update message from a client, any messages
  within this time window are sent directly to the LwM2M client, and all messages
  beyond this time window are temporarily stored in memory.

- auto_observe: <code>boolean()</code>
  * default: 
  `false`

  Automatically observe the object list of REGISTER packet

- update_msg_publish_condition: <code>always | contains_object_list</code>
  * default: 
  `"contains_object_list"`

  Policy for publishing UPDATE event message.<br>
   - always: send update events as long as the UPDATE request is received.
   - contains_object_list: send update events only if the UPDATE request carries any Object List.

- translators: <code>[gateway:lwm2m_translators](#gateway-lwm2m_translators)</code>

  Topic configuration for LwM2M's gateway publishing and subscription

- listeners: <code>[gateway:udp_listeners](#gateway-udp_listeners)</code>



- enable: <code>boolean()</code>
  * default: 
  `true`

  Whether to enable this gateway

- enable_stats: <code>boolean()</code>
  * default: 
  `true`

  Whether to enable client process statistic

- idle_timeout: <code>emqx_gateway_schema:duration()</code>
  * default: 
  `"30s"`

  The idle time of the client connection process.<br>
  It has two purposes:
  1. A newly created client process that does not receive any client requests
     after that time will be closed directly.
  2. A running client process that does not receive any client requests after
     this time will go into hibernation to save resources.

- mountpoint: <code>binary()</code>
  * default: 
  `""`



- clientinfo_override: <code>[gateway:clientinfo_override](#gateway-clientinfo_override)</code>



- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs


## gateway:lwm2m_translators
MQTT topics that correspond to LwM2M events.


**Config paths**

 - <code>gateway.lwm2m.translators</code>


**Env overrides**

 - <code>EMQX_GATEWAY__LWM2M__TRANSLATORS</code>



**Fields**

- command: <code>[gateway:translator](#gateway-translator)</code>

  The topic for receiving downstream commands.<br>
  For each new LwM2M client that succeeds in going online, the gateway creates
  a subscription relationship to receive downstream commands and send it to
  the LwM2M client

- response: <code>[gateway:translator](#gateway-translator)</code>

  The topic for gateway to publish the acknowledge events from LwM2M client

- notify: <code>[gateway:translator](#gateway-translator)</code>

  The topic for gateway to publish the notify events from LwM2M client.<br>
   After succeed observe a resource of LwM2M client, Gateway will send the
   notify events via this topic, if the client reports any resource changes

- register: <code>[gateway:translator](#gateway-translator)</code>

  The topic for gateway to publish the register events from LwM2M client.<br>

- update: <code>[gateway:translator](#gateway-translator)</code>

  The topic for gateway to publish the update events from LwM2M client.<br>


## gateway:mqttsn
The MQTT-SN (MQTT for Sensor Networks) protocol gateway.


**Config paths**

 - <code>gateway.mqttsn</code>


**Env overrides**

 - <code>EMQX_GATEWAY__MQTTSN</code>



**Fields**

- gateway_id: <code>integer()</code>
  * default: 
  `1`

  MQTT-SN Gateway ID.<br>
  When the <code>broadcast</code> option is enabled,
  the gateway will broadcast ADVERTISE message with this value

- broadcast: <code>boolean()</code>
  * default: 
  `false`

  Whether to periodically broadcast ADVERTISE messages

- enable_qos3: <code>boolean()</code>
  * default: 
  `true`

  Allows connectionless clients to publish messages with a Qos of -1.<br>
  This feature is defined for very simple client implementations
  which do not support any other features except this one.<br>
  There is no connection setup nor tear down, no registration nor subscription.<br>
  The client just sends its 'PUBLISH' messages to a GW

- subs_resume: <code>boolean()</code>
  * default: 
  `false`

  Whether to initiate all subscribed topic name registration messages to the
  client after the Session has been taken over by a new channel.

- predefined: <code>[[gateway:mqttsn_predefined](#gateway-mqttsn_predefined)]</code>
  * default: 
  `[]`

  The pre-defined topic IDs and topic names.<br>
  A 'pre-defined' topic ID is a topic ID whose mapping to a topic name
  is known in advance by both the client's application and the gateway

- listeners: <code>[gateway:udp_listeners](#gateway-udp_listeners)</code>



- enable: <code>boolean()</code>
  * default: 
  `true`

  Whether to enable this gateway

- enable_stats: <code>boolean()</code>
  * default: 
  `true`

  Whether to enable client process statistic

- idle_timeout: <code>emqx_gateway_schema:duration()</code>
  * default: 
  `"30s"`

  The idle time of the client connection process.<br>
  It has two purposes:
  1. A newly created client process that does not receive any client requests
     after that time will be closed directly.
  2. A running client process that does not receive any client requests after
     this time will go into hibernation to save resources.

- mountpoint: <code>binary()</code>
  * default: 
  `""`



- clientinfo_override: <code>[gateway:clientinfo_override](#gateway-clientinfo_override)</code>



- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs


## gateway:mqttsn_predefined
The pre-defined topic name corresponding to the pre-defined topic
ID of N.

Note: the pre-defined topic ID of 0 is reserved.


**Config paths**

 - <code>gateway.mqttsn.predefined.$INDEX</code>


**Env overrides**

 - <code>EMQX_GATEWAY__MQTTSN__PREDEFINED__$INDEX</code>



**Fields**

- id: <code>integer()</code>

  Topic ID.<br>Range: 1-65535

- topic: <code>binary()</code>

  Topic Name


## gateway:ssl_listener
Settings for the SSL listener.


**Config paths**

 - <code>gateway.exproto.listeners.ssl.$name</code>
 - <code>gateway.stomp.listeners.ssl.$name</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME</code>



**Fields**

- acceptors: <code>integer()</code>
  * default: 
  `16`

  Size of the acceptor pool.

- tcp: <code>[tcp_opts](#tcp_opts)</code>



- proxy_protocol: <code>boolean()</code>
  * default: 
  `false`

  Enable the Proxy Protocol V1/2 if the EMQX cluster is deployed behind HAProxy or Nginx.<br/>See: https://www.haproxy.com/blog/haproxy/proxy-protocol/

- proxy_protocol_timeout: <code>emqx_gateway_schema:duration()</code>
  * default: 
  `"15s"`

  Timeout for proxy protocol.<br/>EMQX will close the TCP connection if proxy protocol packet is not received within the timeout.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable the listener.

- bind: <code>emqx_gateway_schema:ip_port() | integer()</code>

  The IP address and port that the listener will bind.

- max_connections: <code>integer()</code>
  * default: 
  `1024`

  Maximum number of concurrent connections.

- max_conn_rate: <code>integer()</code>
  * default: 
  `1000`

  Maximum connections per second.

- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs

- mountpoint: <code>binary()</code>

  When publishing or subscribing, prefix all topics with a mountpoint string.
   The prefixed string will be removed from the topic name when the message
   is delivered to the subscriber. The mountpoint is a way that users can use
   to implement isolation of message routing between different listeners.
   For example if a client A subscribes to `t` with `listeners.tcp.<name>.mountpoint`
   set to `some_tenant`, then the client actually subscribes to the topic
   `some_tenant/t`. Similarly, if another client B (connected to the same listener
   as the client A) sends a message to topic `t`, the message is routed
   to all the clients subscribed `some_tenant/t`, so client A will receive the
   message, with topic name `t`.<br/>
   Set to `""` to disable the feature.<br/>

   Variables in mountpoint string:
   - <code>${clientid}</code>: clientid
   - <code>${username}</code>: username

- access_rules: <code>[string()]</code>
  * default: 
  `[]`

  The access control rules for this listener.<br/>See: https://github.com/emqtt/esockd#allowdeny

- ssl: <code>[listener_ssl_opts](#listener_ssl_opts)</code>

  SSL listener options


## gateway:ssl_server_opts
SSL configuration for the server.


**Config paths**

 - <code>gateway.exproto.server.ssl</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__SERVER__SSL</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable TLS.

- cacertfile: <code>string()</code>

  Trusted PEM format CA certificates bundle file.<br>
  The certificates in this file are used to verify the TLS peer's certificates.
  Append new certificates to the file if new CAs are to be trusted.
  There is no need to restart EMQX to have the updated file loaded, because
  the system regularly checks if file has been updated (and reload).<br>
  NOTE: invalidating (deleting) a certificate from the file will not affect
  already established connections.


- certfile: <code>string()</code>

  PEM format certificates chain file.<br>
  The certificates in this file should be in reversed order of the certificate
  issue chain. That is, the host's certificate should be placed in the beginning
  of the file, followed by the immediate issuer certificate and so on.
  Although the root CA certificate is optional, it should be placed at the end of
  the file if it is to be added.

- keyfile: <code>string()</code>

  PEM format private key file.

- verify: <code>verify_peer | verify_none</code>
  * default: 
  `verify_none`

  Enable or disable peer verification.

- reuse_sessions: <code>boolean()</code>
  * default: 
  `true`

  Enable TLS session reuse.

- depth: <code>integer()</code>
  * default: 
  `10`

  Maximum number of non-self-issued intermediate certificates that can follow the peer certificate in a valid certification path. So, if depth is 0 the PEER must be signed by the trusted ROOT-CA directly; if 1 the path can be PEER, CA, ROOT-CA; if 2 the path can be PEER, CA, CA, ROOT-CA, and so on. The default value is 10.

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  key file is password-protected.

- versions: <code>[atom()]</code>
  * default: 
  `[tlsv1.3, tlsv1.2, tlsv1.1, tlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.

- ciphers: <code>[string()]</code>
  * default: 
  `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256", "TLS_AES_128_CCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

  This config holds TLS cipher suite names separated by comma,
  or as an array of strings. e.g.
  <code>"TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256"</code> or
  <code>["TLS_AES_256_GCM_SHA384","TLS_AES_128_GCM_SHA256"]</code>.
  <br>
  Ciphers (and their ordering) define the way in which the
  client and server encrypts information over the network connection.
  Selecting a good cipher suite is critical for the
  application's data security, confidentiality and performance.

  The names should be in OpenSSL string format (not RFC format).
  All default values and examples provided by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>
  * default: 
  `"emqx_tls_psk:lookup"`

  EMQX-internal callback that is used to lookup pre-shared key (PSK) identity.

- secure_renegotiate: <code>boolean()</code>
  * default: 
  `true`

  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.

- dhfile: <code>string()</code>

  Path to a file containing PEM-encoded Diffie-Hellman parameters
  to be used by the server if a cipher suite using Diffie-Hellman
  key exchange is negotiated. If not specified, default parameters
  are used.<br>
  NOTE: The <code>dhfile</code> option is not supported by TLS 1.3.

- fail_if_no_peer_cert: <code>boolean()</code>
  * default: 
  `false`

  Used together with {verify, verify_peer} by an TLS/DTLS server.
  If set to true, the server fails if the client does not have a
  certificate to send, that is, sends an empty certificate.
  If set to false, it fails only if the client sends an invalid
  certificate (an empty certificate is considered valid).

- honor_cipher_order: <code>boolean()</code>
  * default: 
  `true`

  An important security setting, it forces the cipher to be set based
   on the server-specified order instead of the client-specified order,
   hence enforcing the (usually more properly configured) security
   ordering of the server administrator.

- client_renegotiation: <code>boolean()</code>
  * default: 
  `true`

  In protocols that support client-initiated renegotiation,
  the cost of resources of such an operation is higher for the server than the client.
  This can act as a vector for denial of service attacks.
  The SSL application already takes measures to counter-act such attempts,
  but client-initiated renegotiation can be strictly disabled by setting this option to false.
  The default value is true. Note that disabling renegotiation can result in
  long-lived connections becoming unusable due to limits on
  the number of messages the underlying cipher suite can encipher.

- handshake_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"15s"`

  Maximum time duration allowed for the handshake to complete


## gateway:stomp
The STOMP protocol gateway provides EMQX with the ability to access STOMP
(Simple (or Streaming) Text Orientated Messaging Protocol) protocol.


**Config paths**

 - <code>gateway.stomp</code>


**Env overrides**

 - <code>EMQX_GATEWAY__STOMP</code>



**Fields**

- frame: <code>[gateway:stomp_frame](#gateway-stomp_frame)</code>



- listeners: <code>[gateway:tcp_listeners](#gateway-tcp_listeners)</code>



- enable: <code>boolean()</code>
  * default: 
  `true`

  Whether to enable this gateway

- enable_stats: <code>boolean()</code>
  * default: 
  `true`

  Whether to enable client process statistic

- idle_timeout: <code>emqx_gateway_schema:duration()</code>
  * default: 
  `"30s"`

  The idle time of the client connection process.<br>
  It has two purposes:
  1. A newly created client process that does not receive any client requests
     after that time will be closed directly.
  2. A running client process that does not receive any client requests after
     this time will go into hibernation to save resources.

- mountpoint: <code>binary()</code>
  * default: 
  `""`



- clientinfo_override: <code>[gateway:clientinfo_override](#gateway-clientinfo_override)</code>



- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs


## gateway:stomp_frame
Size limits for the STOMP frames.


**Config paths**

 - <code>gateway.stomp.frame</code>


**Env overrides**

 - <code>EMQX_GATEWAY__STOMP__FRAME</code>



**Fields**

- max_headers: <code>non_neg_integer()</code>
  * default: 
  `10`

  The maximum number of Header

- max_headers_length: <code>non_neg_integer()</code>
  * default: 
  `1024`

  The maximum string length of the Header Value

- max_body_length: <code>integer()</code>
  * default: 
  `65536`

  Maximum number of bytes of Body allowed per Stomp packet


## gateway:tcp_listener
Settings for the TCP listener.


**Config paths**

 - <code>gateway.exproto.listeners.tcp.$name</code>
 - <code>gateway.stomp.listeners.tcp.$name</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME</code>



**Fields**

- acceptors: <code>integer()</code>
  * default: 
  `16`

  Size of the acceptor pool.

- tcp: <code>[tcp_opts](#tcp_opts)</code>



- proxy_protocol: <code>boolean()</code>
  * default: 
  `false`

  Enable the Proxy Protocol V1/2 if the EMQX cluster is deployed behind HAProxy or Nginx.<br/>See: https://www.haproxy.com/blog/haproxy/proxy-protocol/

- proxy_protocol_timeout: <code>emqx_gateway_schema:duration()</code>
  * default: 
  `"15s"`

  Timeout for proxy protocol.<br/>EMQX will close the TCP connection if proxy protocol packet is not received within the timeout.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable the listener.

- bind: <code>emqx_gateway_schema:ip_port() | integer()</code>

  The IP address and port that the listener will bind.

- max_connections: <code>integer()</code>
  * default: 
  `1024`

  Maximum number of concurrent connections.

- max_conn_rate: <code>integer()</code>
  * default: 
  `1000`

  Maximum connections per second.

- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs

- mountpoint: <code>binary()</code>

  When publishing or subscribing, prefix all topics with a mountpoint string.
   The prefixed string will be removed from the topic name when the message
   is delivered to the subscriber. The mountpoint is a way that users can use
   to implement isolation of message routing between different listeners.
   For example if a client A subscribes to `t` with `listeners.tcp.<name>.mountpoint`
   set to `some_tenant`, then the client actually subscribes to the topic
   `some_tenant/t`. Similarly, if another client B (connected to the same listener
   as the client A) sends a message to topic `t`, the message is routed
   to all the clients subscribed `some_tenant/t`, so client A will receive the
   message, with topic name `t`.<br/>
   Set to `""` to disable the feature.<br/>

   Variables in mountpoint string:
   - <code>${clientid}</code>: clientid
   - <code>${username}</code>: username

- access_rules: <code>[string()]</code>
  * default: 
  `[]`

  The access control rules for this listener.<br/>See: https://github.com/emqtt/esockd#allowdeny


## gateway:tcp_listeners
Settings for the TCP listeners.


**Config paths**

 - <code>gateway.stomp.listeners</code>


**Env overrides**

 - <code>EMQX_GATEWAY__STOMP__LISTENERS</code>



**Fields**

- tcp: <code>{$name -> [gateway:tcp_listener](#gateway-tcp_listener)}</code>

  TCP configuration.

- ssl: <code>{$name -> [gateway:ssl_listener](#gateway-ssl_listener)}</code>

  SSL configuration.


## gateway:translator
MQTT topic that corresponds to a particular type of event.


**Config paths**

 - <code>gateway.lwm2m.translators.command</code>
 - <code>gateway.lwm2m.translators.notify</code>
 - <code>gateway.lwm2m.translators.register</code>
 - <code>gateway.lwm2m.translators.response</code>
 - <code>gateway.lwm2m.translators.update</code>


**Env overrides**

 - <code>EMQX_GATEWAY__LWM2M__TRANSLATORS__COMMAND</code>
 - <code>EMQX_GATEWAY__LWM2M__TRANSLATORS__NOTIFY</code>
 - <code>EMQX_GATEWAY__LWM2M__TRANSLATORS__REGISTER</code>
 - <code>EMQX_GATEWAY__LWM2M__TRANSLATORS__RESPONSE</code>
 - <code>EMQX_GATEWAY__LWM2M__TRANSLATORS__UPDATE</code>



**Fields**

- topic: <code>binary()</code>

  Which topic the device's upstream message is published to.

- qos: <code>qos()</code>
  * default: 
  `0`

  QoS of the published messages.


## gateway:udp_listener
Settings for the UDP listener.


**Config paths**

 - <code>gateway.coap.listeners.udp.$name</code>
 - <code>gateway.exproto.listeners.udp.$name</code>
 - <code>gateway.lwm2m.listeners.udp.$name</code>
 - <code>gateway.mqttsn.listeners.udp.$name</code>


**Env overrides**

 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME</code>



**Fields**

- udp: <code>[gateway:udp_opts](#gateway-udp_opts)</code>



- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable the listener.

- bind: <code>emqx_gateway_schema:ip_port() | integer()</code>

  The IP address and port that the listener will bind.

- max_connections: <code>integer()</code>
  * default: 
  `1024`

  Maximum number of concurrent connections.

- max_conn_rate: <code>integer()</code>
  * default: 
  `1000`

  Maximum connections per second.

- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs

- mountpoint: <code>binary()</code>

  When publishing or subscribing, prefix all topics with a mountpoint string.
   The prefixed string will be removed from the topic name when the message
   is delivered to the subscriber. The mountpoint is a way that users can use
   to implement isolation of message routing between different listeners.
   For example if a client A subscribes to `t` with `listeners.tcp.<name>.mountpoint`
   set to `some_tenant`, then the client actually subscribes to the topic
   `some_tenant/t`. Similarly, if another client B (connected to the same listener
   as the client A) sends a message to topic `t`, the message is routed
   to all the clients subscribed `some_tenant/t`, so client A will receive the
   message, with topic name `t`.<br/>
   Set to `""` to disable the feature.<br/>

   Variables in mountpoint string:
   - <code>${clientid}</code>: clientid
   - <code>${username}</code>: username

- access_rules: <code>[string()]</code>
  * default: 
  `[]`

  The access control rules for this listener.<br/>See: https://github.com/emqtt/esockd#allowdeny


## gateway:udp_listeners
Settings for the UDP listeners.


**Config paths**

 - <code>gateway.coap.listeners</code>
 - <code>gateway.lwm2m.listeners</code>
 - <code>gateway.mqttsn.listeners</code>


**Env overrides**

 - <code>EMQX_GATEWAY__COAP__LISTENERS</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS</code>



**Fields**

- udp: <code>{$name -> [gateway:udp_listener](#gateway-udp_listener)}</code>

  UDP configuration.

- dtls: <code>{$name -> [gateway:dtls_listener](#gateway-dtls_listener)}</code>

  DTLS configuration.


## gateway:udp_opts
Settings for the UDP sockets.


**Config paths**

 - <code>gateway.coap.listeners.dtls.$name.udp</code>
 - <code>gateway.coap.listeners.udp.$name.udp</code>
 - <code>gateway.exproto.listeners.dtls.$name.udp</code>
 - <code>gateway.exproto.listeners.udp.$name.udp</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.udp</code>
 - <code>gateway.lwm2m.listeners.udp.$name.udp</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.udp</code>
 - <code>gateway.mqttsn.listeners.udp.$name.udp</code>


**Env overrides**

 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__UDP</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__UDP</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__UDP</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__UDP</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__UDP</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__UDP</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__UDP</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__UDP</code>



**Fields**

- active_n: <code>integer()</code>
  * default: 
  `100`

  Specify the {active, N} option for the socket.<br/>See: https://erlang.org/doc/man/inet.html#setopts-2

- recbuf: <code>emqx_gateway_schema:bytesize()</code>

  Size of the kernel-space receive buffer for the socket.

- sndbuf: <code>emqx_gateway_schema:bytesize()</code>

  Size of the kernel-space send buffer for the socket.

- buffer: <code>emqx_gateway_schema:bytesize()</code>

  Size of the user-space buffer for the socket.

- reuseaddr: <code>boolean()</code>
  * default: 
  `true`

  Allow local reuse of port numbers.


## gateway:udp_tcp_listeners
Settings for the listeners.


**Config paths**

 - <code>gateway.exproto.listeners</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS</code>



**Fields**

- udp: <code>{$name -> [gateway:udp_listener](#gateway-udp_listener)}</code>

  UDP configuration.

- dtls: <code>{$name -> [gateway:dtls_listener](#gateway-dtls_listener)}</code>

  DTLS configuration.

- tcp: <code>{$name -> [gateway:tcp_listener](#gateway-tcp_listener)}</code>

  TCP configuration.

- ssl: <code>{$name -> [gateway:ssl_listener](#gateway-ssl_listener)}</code>

  SSL configuration.


## limiter:bucket_opts
Settings for the bucket.


**Config paths**

 - <code>limiter.batch.bucket.$bucket name</code>
 - <code>limiter.bytes_in.bucket.$bucket name</code>
 - <code>limiter.connection.bucket.$bucket name</code>
 - <code>limiter.message_in.bucket.$bucket name</code>
 - <code>limiter.message_routing.bucket.$bucket name</code>


**Env overrides**

 - <code>EMQX_LIMITER__BATCH__BUCKET__$BUCKET NAME</code>
 - <code>EMQX_LIMITER__BYTES_IN__BUCKET__$BUCKET NAME</code>
 - <code>EMQX_LIMITER__CONNECTION__BUCKET__$BUCKET NAME</code>
 - <code>EMQX_LIMITER__MESSAGE_IN__BUCKET__$BUCKET NAME</code>
 - <code>EMQX_LIMITER__MESSAGE_ROUTING__BUCKET__$BUCKET NAME</code>



**Fields**

- rate: <code>emqx_limiter_schema:rate()</code>

  Rate for this bucket.

- capacity: <code>emqx_limiter_schema:capacity()</code>

  The maximum number of tokens for this bucket.

- initial: <code>emqx_limiter_schema:initial()</code>
  * default: 
  `"0"`

  The initial number of tokens for this bucket.

- per_client: <code>[limiter:client_bucket](#limiter-client_bucket)</code>
  * default: 
  `{}`

  The rate limit for each user of the bucket, this field is not required


## limiter:client_bucket
Settings for the client bucket.


**Config paths**

 - <code>limiter.batch.bucket.$bucket name.per_client</code>
 - <code>limiter.bytes_in.bucket.$bucket name.per_client</code>
 - <code>limiter.connection.bucket.$bucket name.per_client</code>
 - <code>limiter.message_in.bucket.$bucket name.per_client</code>
 - <code>limiter.message_routing.bucket.$bucket name.per_client</code>


**Env overrides**

 - <code>EMQX_LIMITER__BATCH__BUCKET__$BUCKET NAME__PER_CLIENT</code>
 - <code>EMQX_LIMITER__BYTES_IN__BUCKET__$BUCKET NAME__PER_CLIENT</code>
 - <code>EMQX_LIMITER__CONNECTION__BUCKET__$BUCKET NAME__PER_CLIENT</code>
 - <code>EMQX_LIMITER__MESSAGE_IN__BUCKET__$BUCKET NAME__PER_CLIENT</code>
 - <code>EMQX_LIMITER__MESSAGE_ROUTING__BUCKET__$BUCKET NAME__PER_CLIENT</code>



**Fields**

- rate: <code>emqx_limiter_schema:rate()</code>
  * default: 
  `"infinity"`

  Rate for this bucket.

- initial: <code>emqx_limiter_schema:initial()</code>
  * default: 
  `"0"`

  The initial number of tokens for this bucket.

- low_water_mark: <code>emqx_limiter_schema:initial()</code>
  * default: 
  `"0"`

  If the remaining tokens are lower than this value,
  the check/consume will succeed, but it will be forced to wait for a short period of time.

- capacity: <code>emqx_limiter_schema:capacity()</code>
  * default: 
  `"infinity"`

  The capacity of the token bucket.

- divisible: <code>boolean()</code>
  * default: 
  `false`

  Is it possible to split the number of requested tokens?

- max_retry_time: <code>emqx_schema:duration()</code>
  * default: 
  `"10s"`

  The maximum retry time when acquire failed.

- failure_strategy: <code>emqx_limiter_schema:failure_strategy()</code>
  * default: 
  `force`

  The strategy when all the retries failed.


## limiter
Settings for the rate limiter.


**Config paths**

 - <code>limiter</code>


**Env overrides**

 - <code>EMQX_LIMITER</code>



**Fields**

- bytes_in: <code>[limiter:limiter_opts](#limiter-limiter_opts)</code>



- message_in: <code>[limiter:limiter_opts](#limiter-limiter_opts)</code>



- connection: <code>[limiter:limiter_opts](#limiter-limiter_opts)</code>



- message_routing: <code>[limiter:limiter_opts](#limiter-limiter_opts)</code>



- batch: <code>[limiter:limiter_opts](#limiter-limiter_opts)</code>




## limiter:limiter_opts
Settings for the limiter.


**Config paths**

 - <code>limiter.batch</code>
 - <code>limiter.bytes_in</code>
 - <code>limiter.connection</code>
 - <code>limiter.message_in</code>
 - <code>limiter.message_routing</code>


**Env overrides**

 - <code>EMQX_LIMITER__BATCH</code>
 - <code>EMQX_LIMITER__BYTES_IN</code>
 - <code>EMQX_LIMITER__CONNECTION</code>
 - <code>EMQX_LIMITER__MESSAGE_IN</code>
 - <code>EMQX_LIMITER__MESSAGE_ROUTING</code>



**Fields**

- rate: <code>emqx_limiter_schema:rate()</code>
  * default: 
  `"infinity"`

  The rate

- burst: <code>emqx_limiter_schema:burst_rate()</code>
  * default: 
  `"0/0s"`

  The burst, This value is based on rate.<br/>
   This value + rate = the maximum limit that can be achieved when limiter burst.

- bucket: <code>{$bucket name -> [limiter:bucket_opts](#limiter-bucket_opts)}</code>

  Buckets config


## modules:delayed
Settings for the delayed module.


**Config paths**

 - <code>delayed</code>


**Env overrides**

 - <code>EMQX_DELAYED</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable `delayed` module.

- max_delayed_messages: <code>integer()</code>

  Maximum number of delayed messages (0 is no limit).


## modules:rewrite
EMQX 的主题重写功能支持根据用户配置的规则在客户端订阅主题、发布消息、取消订阅的时候将 A 主题重写为 B 主题。
重写规则分为 Pub 规则和 Sub 规则，Pub 规则匹配 PUSHLISH 报文携带的主题，Sub 规则匹配 SUBSCRIBE、UNSUBSCRIBE 报文携带的主题。
每条重写规则都由主题过滤器、正则表达式、目标表达式三部分组成。
在主题重写功能开启的前提下，EMQX 在收到诸如 PUBLISH 报文等带有主题的 MQTT 报文时，将使用报文中的主题去依次匹配配置文件中规则的主题过滤器部分，一旦成功匹配，则使用正则表达式提取主题中的信息，然后替换至目标表达式以构成新的主题。
目标表达式中可以使用 $N 这种格式的变量匹配正则表达中提取出来的元素，$N 的值为正则表达式中提取出来的第 N 个元素，比如 $1 即为正则表达式提取的第一个元素。
需要注意的是，EMQX 使用倒序读取配置文件中的重写规则，当一条主题可以同时匹配多条主题重写规则的主题过滤器时，EMQX 仅会使用它匹配到的第一条规则进行重写，如果该条规则中的正则表达式与 MQTT 报文主题不匹配，则重写失败，不会再尝试使用其他的规则进行重写。
因此用户在使用时需要谨慎的设计 MQTT 报文主题以及主题重写规则。


**Config paths**

 - <code>rewrite.$INDEX</code>


**Env overrides**

 - <code>EMQX_REWRITE__$INDEX</code>



**Fields**

- action: <code>subscribe | publish | all</code>

  subscribe：订阅时重写主题；
  publish：发布时重写主题；
  all：全部重写主题

- source_topic: <code>binary()</code>

  源主题，客户端业务指定的主题

- dest_topic: <code>binary()</code>

  目标主题。

- re: <code>binary()</code>

  正则表达式


## modules:telemetry
Settings for the telemetry module.


**Config paths**

 - <code>telemetry</code>


**Env overrides**

 - <code>EMQX_TELEMETRY</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable telemetry.


## modules:topic_metrics



**Config paths**

 - <code>topic_metrics.$INDEX</code>


**Env overrides**

 - <code>EMQX_TOPIC_METRICS__$INDEX</code>



**Fields**

- topic: <code>binary()</code>

  Collect metrics for the topic.


## rule_engine:builtin_output_console
Configuration for a built-in output.


**Config paths**

 - <code>rule_engine.rules.$id.outputs.$INDEX</code>


**Env overrides**

 - <code>EMQX_RULE_ENGINE__RULES__$ID__OUTPUTS__$INDEX</code>



**Fields**

- function: <code>console</code>

  Print the outputs to the console


## rule_engine:builtin_output_republish
Configuration for a built-in output.


**Config paths**

 - <code>rule_engine.rules.$id.outputs.$INDEX</code>


**Env overrides**

 - <code>EMQX_RULE_ENGINE__RULES__$ID__OUTPUTS__$INDEX</code>



**Fields**

- function: <code>republish</code>

  Republish the message as a new MQTT message

- args: <code>[rule_engine:republish_args](#rule_engine-republish_args)</code>
  * default: 
  `{}`




## rule_engine:republish_args
The arguments of the built-in 'republish' output.<br>One can use variables in the args.<br>
The variables are selected by the rule. For example, if the rule SQL is defined as following:
<code>
    SELECT clientid, qos, payload FROM "t/1"
</code>
Then there are 3 variables available: <code>clientid</code>, <code>qos</code> and
<code>payload</code>. And if we've set the args to:
<code>
    {
        topic = "t/${clientid}"
        qos = "${qos}"
        payload = "msg: ${payload}"
    }
</code>
When the rule is triggered by an MQTT message with payload = `hello`, qos = 1,
clientid = `Steve`, the rule will republish a new MQTT message to topic `t/Steve`,
payload = `msg: hello`, and `qos = 1`.


**Config paths**

 - <code>rule_engine.rules.$id.outputs.$INDEX.args</code>


**Env overrides**

 - <code>EMQX_RULE_ENGINE__RULES__$ID__OUTPUTS__$INDEX__ARGS</code>



**Fields**

- topic: <code>binary()</code>


  The target topic of message to be re-published.<br>
  Template with variables is allowed, see description of the 'republish_args'.


- qos: <code>qos() | binary()</code>
  * default: 
  `"${qos}"`


  The qos of the message to be re-published.
  Template with variables is allowed, see description of the 'republish_args'.<br>
  Defaults to ${qos}. If variable ${qos} is not found from the selected result of the rule,
  0 is used.


- retain: <code>binary() | boolean()</code>
  * default: 
  `"${retain}"`


  The 'retain' flag of the message to be re-published.
  Template with variables is allowed, see description of the 'republish_args'.<br>
  Defaults to ${retain}. If variable ${retain} is not found from the selected result
  of the rule, false is used.


- payload: <code>binary()</code>
  * default: 
  `"${payload}"`


  The payload of the message to be re-published.
  Template with variables is allowed, see description of the 'republish_args'.<br>.
  Defaults to ${payload}. If variable ${payload} is not found from the selected result
  of the rule, then the string "undefined" is used.



## rule_engine
Configuration for the EMQX Rule Engine.


**Config paths**

 - <code>rule_engine</code>


**Env overrides**

 - <code>EMQX_RULE_ENGINE</code>



**Fields**

- ignore_sys_message: <code>boolean()</code>
  * default: 
  `true`

  When set to 'true' (default), rule-engine will ignore messages published to $SYS topics.

- rules: <code>{$id -> [rule_engine:rules](#rule_engine-rules)}</code>
  * default: 
  `{}`

  The rules


## rule_engine:rules
Configuration for a rule.


**Config paths**

 - <code>rule_engine.rules.$id</code>


**Env overrides**

 - <code>EMQX_RULE_ENGINE__RULES__$ID</code>



**Fields**

- name: <code>binary()</code>
  * default: 
  `[]`

  The name of the rule

- sql: <code>binary()</code>


  SQL query to transform the messages.<br>
  Example: <code>SELECT * FROM "test/topic" WHERE payload.x = 1</code><br>


- outputs: <code>[binary() | [rule_engine:builtin_output_republish](#rule_engine-builtin_output_republish) | [rule_engine:builtin_output_console](#rule_engine-builtin_output_console) | [rule_engine:user_provided_function](#rule_engine-user_provided_function)]</code>
  * default: 
  `[]`


  A list of outputs of the rule.<br>
  An output can be a string that refers to the channel ID of an EMQX bridge, or an object
  that refers to a function.<br>
  There a some built-in functions like "republish" and "console", and we also support user
  provided functions in the format: "{module}:{function}".<br>
  The outputs in the list are executed sequentially.
  This means that if one of the output is executing slowly, all the following outputs will not
  be executed until it returns.<br>
  If one of the output crashed, all other outputs come after it will still be executed, in the
  original order.<br>
  If there's any error when running an output, there will be an error message, and the 'failure'
  counter of the function output or the bridge channel will increase.


- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable the rule

- description: <code>binary()</code>
  * default: 
  `""`

  The description of the rule


## rule_engine:user_provided_function
Configuration for a built-in output.


**Config paths**

 - <code>rule_engine.rules.$id.outputs.$INDEX</code>


**Env overrides**

 - <code>EMQX_RULE_ENGINE__RULES__$ID__OUTPUTS__$INDEX</code>



**Fields**

- function: <code>binary()</code>


  The user provided function. Should be in the format: '{module}:{function}'.<br>
  Where {module} is the Erlang callback module and {function} is the Erlang function.
  <br>
  To write your own function, checkout the function <code>console</code> and
  <code>republish</code> in the source file:
  <code>apps/emqx_rule_engine/src/emqx_rule_outputs.erl</code> as an example.


- args: <code>map()</code>
  * default: 
  `{}`


  The args will be passed as the 3rd argument to module:function/3,
  checkout the function <code>console</code> and <code>republish</code> in the source file:
  <code>apps/emqx_rule_engine/src/emqx_rule_outputs.erl</code> as an example.



## cluster_dns
Service discovery via DNS SRV records.


**Config paths**

 - <code>cluster.dns</code>


**Env overrides**

 - <code>EMQX_CLUSTER__DNS</code>



**Fields**

- name: <code>string()</code>
  * default: 
  `"localhost"`

  The domain name of the EMQX cluster.

- app: <code>string()</code>
  * default: 
  `"emqx"`

  The symbolic name of the EMQX service.


## cluster_etcd
Service discovery using 'etcd' service.


**Config paths**

 - <code>cluster.etcd</code>


**Env overrides**

 - <code>EMQX_CLUSTER__ETCD</code>



**Fields**

- server: <code>emqx_schema:comma_separated_list()</code>

  List of endpoint URLs of the etcd cluster

- prefix: <code>string()</code>
  * default: 
  `"emqxcl"`

  Key prefix used for EMQX service discovery.

- node_ttl: <code>emqx_schema:duration()</code>
  * default: 
  `"1m"`

  Expiration time of the etcd key associated with the node.
  It is refreshed automatically, as long as the node is alive.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Options for the TLS connection to the etcd cluster.


## cluster_k8s
Service discovery via Kubernetes API server.


**Config paths**

 - <code>cluster.k8s</code>


**Env overrides**

 - <code>EMQX_CLUSTER__K8S</code>



**Fields**

- apiserver: <code>string()</code>

  Kubernetes API endpoint URL.

- service_name: <code>string()</code>
  * default: 
  `"emqx"`

  EMQX broker service name.

- address_type: <code>ip | dns | hostname</code>

  Address type used for connecting to the discovered nodes.

- app_name: <code>string()</code>
  * default: 
  `"emqx"`

  This parameter should be set to the part of the <code>node.name</code>
  before the '@'.<br/>
  For example, if the <code>node.name</code> is <code>emqx@127.0.0.1</code>, then this parameter
  should be set to <code>emqx</code>.

- namespace: <code>string()</code>
  * default: 
  `"default"`

  Kubernetes namespace.

- suffix: <code>string()</code>
  * default: 
  `"pod.local"`

  Node name suffix.<br/>
  Note: this parameter is only relevant when <code>address_type</code> is <code>dns</code>
  or <code>hostname</code>.


## cluster_mcast
Service discovery via UDP multicast.


**Config paths**

 - <code>cluster.mcast</code>


**Env overrides**

 - <code>EMQX_CLUSTER__MCAST</code>



**Fields**

- addr: <code>string()</code>
  * default: 
  `"239.192.0.1"`

  Multicast IPv4 address.

- ports: <code>[integer()]</code>
  * default: 
  `[4369,4370]`

  List of UDP ports used for service discovery.<br/>
  Note: probe messages are broadcast to all the specified ports.

- iface: <code>string()</code>
  * default: 
  `"0.0.0.0"`

  Local IP address the node discovery service needs to bind to.

- ttl: <code>0..255</code>
  * default: 
  `255`

  Time-to-live (TTL) for the outgoing UDP datagrams.

- loop: <code>boolean()</code>
  * default: 
  `true`

  If <code>true</code>, loop UDP datagrams back to the local socket.

- sndbuf: <code>emqx_schema:bytesize()</code>
  * default: 
  `"16KB"`

  Size of the kernel-level buffer for outgoing datagrams.

- recbuf: <code>emqx_schema:bytesize()</code>
  * default: 
  `"16KB"`

  Size of the kernel-level buffer for incoming datagrams.

- buffer: <code>emqx_schema:bytesize()</code>
  * default: 
  `"32KB"`

  Size of the user-level buffer.


## cluster_static
Service discovery via static nodes. The new node joins the cluster by connecting to one of the bootstrap nodes.


**Config paths**

 - <code>cluster.static</code>


**Env overrides**

 - <code>EMQX_CLUSTER__STATIC</code>



**Fields**

- seeds: <code>[atom()]</code>
  * default: 
  `[]`

  List EMQX node names in the static cluster. See <code>node.name</code>.


## ssl_client_opts
Socket options for SSL clients.


**Config paths**

 - <code>authentication.$INDEX.ssl</code>
 - <code>authorization.sources.$INDEX.ssl</code>
 - <code>bridges.http.$name.ssl</code>
 - <code>cluster.etcd.ssl</code>
 - <code>connectors.mqtt.$name.ssl</code>
 - <code>gateway.coap.authentication.ssl</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication.ssl</code>
 - <code>gateway.coap.listeners.udp.$name.authentication.ssl</code>
 - <code>gateway.exproto.authentication.ssl</code>
 - <code>gateway.exproto.handler.ssl</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication.ssl</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication.ssl</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication.ssl</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication.ssl</code>
 - <code>gateway.lwm2m.authentication.ssl</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication.ssl</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication.ssl</code>
 - <code>gateway.mqttsn.authentication.ssl</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication.ssl</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication.ssl</code>
 - <code>gateway.stomp.authentication.ssl</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication.ssl</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication.ssl</code>
 - <code>listeners.ssl.$name.authentication.$INDEX.ssl</code>
 - <code>listeners.tcp.$name.authentication.$INDEX.ssl</code>
 - <code>listeners.ws.$name.authentication.$INDEX.ssl</code>
 - <code>listeners.wss.$name.authentication.$INDEX.ssl</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX__SSL</code>
 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX__SSL</code>
 - <code>EMQX_BRIDGES__HTTP__$NAME__SSL</code>
 - <code>EMQX_CLUSTER__ETCD__SSL</code>
 - <code>EMQX_CONNECTORS__MQTT__$NAME__SSL</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__HANDLER__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX__SSL</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX__SSL</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX__SSL</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX__SSL</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable TLS.

- cacertfile: <code>string()</code>

  Trusted PEM format CA certificates bundle file.<br>
  The certificates in this file are used to verify the TLS peer's certificates.
  Append new certificates to the file if new CAs are to be trusted.
  There is no need to restart EMQX to have the updated file loaded, because
  the system regularly checks if file has been updated (and reload).<br>
  NOTE: invalidating (deleting) a certificate from the file will not affect
  already established connections.


- certfile: <code>string()</code>

  PEM format certificates chain file.<br>
  The certificates in this file should be in reversed order of the certificate
  issue chain. That is, the host's certificate should be placed in the beginning
  of the file, followed by the immediate issuer certificate and so on.
  Although the root CA certificate is optional, it should be placed at the end of
  the file if it is to be added.

- keyfile: <code>string()</code>

  PEM format private key file.

- verify: <code>verify_peer | verify_none</code>
  * default: 
  `verify_none`

  Enable or disable peer verification.

- reuse_sessions: <code>boolean()</code>
  * default: 
  `true`

  Enable TLS session reuse.

- depth: <code>integer()</code>
  * default: 
  `10`

  Maximum number of non-self-issued intermediate certificates that can follow the peer certificate in a valid certification path. So, if depth is 0 the PEER must be signed by the trusted ROOT-CA directly; if 1 the path can be PEER, CA, ROOT-CA; if 2 the path can be PEER, CA, CA, ROOT-CA, and so on. The default value is 10.

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  key file is password-protected.

- versions: <code>[atom()]</code>
  * default: 
  `[tlsv1.3, tlsv1.2, tlsv1.1, tlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.

- ciphers: <code>[string()]</code>
  * default: 
  `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256", "TLS_AES_128_CCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

  This config holds TLS cipher suite names separated by comma,
  or as an array of strings. e.g.
  <code>"TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256"</code> or
  <code>["TLS_AES_256_GCM_SHA384","TLS_AES_128_GCM_SHA256"]</code>.
  <br>
  Ciphers (and their ordering) define the way in which the
  client and server encrypts information over the network connection.
  Selecting a good cipher suite is critical for the
  application's data security, confidentiality and performance.

  The names should be in OpenSSL string format (not RFC format).
  All default values and examples provided by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>
  * default: 
  `"emqx_tls_psk:lookup"`

  EMQX-internal callback that is used to lookup pre-shared key (PSK) identity.

- secure_renegotiate: <code>boolean()</code>
  * default: 
  `true`

  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.

- server_name_indication: <code>disable | string()</code>

  Specify the host name to be used in TLS Server Name Indication extension.<br>
  For instance, when connecting to "server.example.net", the genuine server
  which accepts the connection and performs TLS handshake may differ from the
  host the TLS client initially connects to, e.g. when connecting to an IP address
  or when the host has multiple resolvable DNS records <br>
  If not specified, it will default to the host name string which is used
  to establish the connection, unless it is IP addressed used.<br>
  The host name is then also used in the host name verification of the peer
  certificate.<br> The special value 'disable' prevents the Server Name
  Indication extension from being sent and disables the hostname
  verification check.


## topology
Topology of MongoDB.


**Config paths**

 - <code>authentication.$INDEX.topology</code>
 - <code>authorization.sources.$INDEX.topology</code>
 - <code>gateway.coap.authentication.topology</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication.topology</code>
 - <code>gateway.coap.listeners.udp.$name.authentication.topology</code>
 - <code>gateway.exproto.authentication.topology</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication.topology</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication.topology</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication.topology</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication.topology</code>
 - <code>gateway.lwm2m.authentication.topology</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication.topology</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication.topology</code>
 - <code>gateway.mqttsn.authentication.topology</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication.topology</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication.topology</code>
 - <code>gateway.stomp.authentication.topology</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication.topology</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication.topology</code>
 - <code>listeners.ssl.$name.authentication.$INDEX.topology</code>
 - <code>listeners.tcp.$name.authentication.$INDEX.topology</code>
 - <code>listeners.ws.$name.authentication.$INDEX.topology</code>
 - <code>listeners.wss.$name.authentication.$INDEX.topology</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX__TOPOLOGY</code>
 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION__TOPOLOGY</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX__TOPOLOGY</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX__TOPOLOGY</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX__TOPOLOGY</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX__TOPOLOGY</code>



**Fields**

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- max_overflow: <code>non_neg_integer()</code>
  * default: 
  `0`

  Max Overflow.

- overflow_ttl: <code>emqx_schema:duration_ms()</code>

  Time interval, such as timeout or TTL.

- overflow_check_period: <code>emqx_schema:duration_ms()</code>

  Time interval, such as timeout or TTL.

- local_threshold_ms: <code>emqx_schema:duration_ms()</code>

  Time interval, such as timeout or TTL.

- connect_timeout_ms: <code>emqx_schema:duration_ms()</code>

  Time interval, such as timeout or TTL.

- socket_timeout_ms: <code>emqx_schema:duration_ms()</code>

  Time interval, such as timeout or TTL.

- server_selection_timeout_ms: <code>emqx_schema:duration_ms()</code>

  Time interval, such as timeout or TTL.

- wait_queue_timeout_ms: <code>emqx_schema:duration_ms()</code>

  Time interval, such as timeout or TTL.

- heartbeat_frequency_ms: <code>emqx_schema:duration_ms()</code>

  Time interval, such as timeout or TTL.

- min_heartbeat_frequency_ms: <code>emqx_schema:duration_ms()</code>

  Time interval, such as timeout or TTL.


## alarm
Settings for the alarms.


**Config paths**

 - <code>alarm</code>


**Env overrides**

 - <code>EMQX_ALARM</code>



**Fields**

- actions: <code>[atom()]</code>
  * default: 
  `[log, publish]`

  The actions triggered when the alarm is activated.<br/>
  Currently, the following actions are supported: <code>log</code> and <code>publish</code>.
  <code>log</code> is to write the alarm to log (console or file).
  <code>publish</code> is to publish the alarm as an MQTT message to the system topics:
  <code>$SYS/brokers/emqx@xx.xx.xx.x/alarms/activate</code> and
  <code>$SYS/brokers/emqx@xx.xx.xx.x/alarms/deactivate</code>

- size_limit: <code>1..3000</code>
  * default: 
  `1000`

  The maximum total number of deactivated alarms to keep as history.<br>
  When this limit is exceeded, the oldest deactivated alarms are deleted to cap the total number.


- validity_period: <code>emqx_schema:duration()</code>
  * default: 
  `"24h"`

  Retention time of deactivated alarms. Alarms are not deleted immediately
  when deactivated, but after the retention time.



## authorization
Settings that control client authorization.


**Config paths**

 - <code>authorization</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION</code>



**Fields**

- no_match: <code>allow | deny</code>
  * default: 
  `allow`

  Default access control action if the user or client matches no ACL rules,
  or if no such user or client is found by the configurable authorization
  sources such as built_in_database, an HTTP API, or a query against PostgreSQL.
  Find more details in 'authorization.sources' config.

- deny_action: <code>ignore | disconnect</code>
  * default: 
  `ignore`

  The action when the authorization check rejects an operation.

- cache: <code>[cache](#cache)</code>



- sources: <code>[[authz:file](#authz-file) | [authz:http_get](#authz-http_get) | [authz:http_post](#authz-http_post) | [authz:mnesia](#authz-mnesia) | [authz:mongo_single](#authz-mongo_single) | [authz:mongo_rs](#authz-mongo_rs) | [authz:mongo_sharded](#authz-mongo_sharded) | [authz:mysql](#authz-mysql) | [authz:postgresql](#authz-postgresql) | [authz:redis_single](#authz-redis_single) | [authz:redis_sentinel](#authz-redis_sentinel) | [authz:redis_cluster](#authz-redis_cluster)]</code>
  * default: 
  `[]`


  Authorization data sources.<br>
  An array of authorization (ACL) data providers.
  It is designed as an array, not a hash-map, so the sources can be
  ordered to form a chain of access controls.<br>

  When authorizing a 'publish' or 'subscribe' action, the configured
  sources are checked in order. When checking an ACL source,
  in case the client (identified by username or client ID) is not found,
  it moves on to the next source. And it stops immediately
  once an 'allow' or 'deny' decision is returned.<br>

  If the client is not found in any of the sources,
  the default action configured in 'authorization.no_match' is applied.<br>

  NOTE:
  The source elements are identified by their 'type'.
  It is NOT allowed to configure two or more sources of the same type.



## broker
Message broker options.


**Config paths**

 - <code>broker</code>


**Env overrides**

 - <code>EMQX_BROKER</code>



**Fields**

- enable_session_registry: <code>boolean()</code>
  * default: 
  `true`

  Enable session registry

- session_locking_strategy: <code>local | leader | quorum | all</code>
  * default: 
  `quorum`

  Session locking strategy in a cluster.<br/>
   - `local`: only lock the session on the current node
   - `one`: select only one remote node to lock the session
   - `quorum`: select some nodes to lock the session
   - `all`: lock the session on all the nodes in the cluster

- shared_subscription_strategy: <code>random | round_robin | sticky | hash_topic | hash_clientid</code>
  * default: 
  `round_robin`

  Dispatch strategy for shared subscription.<br/>
   - `random`: dispatch the message to a random selected subscriber
   - `round_robin`: select the subscribers in a round-robin manner
   - `sticky`: always use the last selected subscriber to dispatch,
     until the subscriber disconnects.
   - `hash`: select the subscribers by the hash of `clientIds`

- shared_dispatch_ack_enabled: <code>boolean()</code>
  * default: 
  `false`

  Enable/disable shared dispatch acknowledgement for QoS1 and QoS2 messages.<br/>
   This should allow messages to be dispatched to a different subscriber in
   the group in case the picked (based on `shared_subscription_strategy`) subscriber
   is offline.

- route_batch_clean: <code>boolean()</code>
  * default: 
  `true`

  Enable batch clean for deleted routes.

- perf: <code>[broker_perf](#broker_perf)</code>




## broker_perf
Broker performance tuning parameters.


**Config paths**

 - <code>broker.perf</code>


**Env overrides**

 - <code>EMQX_BROKER__PERF</code>



**Fields**

- route_lock_type: <code>key | tab | global</code>
  * default: 
  `key`

  Performance tuning for subscribing/unsubscribing a wildcard topic.<br/>
  Change this parameter only when there are many wildcard topics.<br/>
  NOTE: when changing from/to `global` lock, it requires all
  nodes in the cluster to be stopped before the change.

   - `key`: mnesia transactional updates with per-key locks. Recommended for a single-node setup.
   - `tab`: mnesia transactional updates with table lock. Recommended for a cluster setup.
   - `global`: updates are protected with a global lock. Recommended for large clusters.

- trie_compaction: <code>boolean()</code>
  * default: 
  `true`

  Enable trie path compaction.<br/>
  Enabling it significantly improves wildcard topic subscribe
  rate, if wildcard topics have unique prefixes like:
  'sensor/{{id}}/+/', where ID is unique per subscriber.<br/>
  Topic match performance (when publishing) may degrade if messages
  are mostly published to topics with large number of levels.<br/>
  NOTE: This is a cluster-wide configuration.
  It requires all nodes to be stopped before changing it.


## cache
Settings for the authorization cache.


**Config paths**

 - <code>authorization.cache</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__CACHE</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable the authorization cache.

- max_size: <code>1..1048576</code>
  * default: 
  `32`

  Maximum number of cached items.

- ttl: <code>emqx_schema:duration()</code>
  * default: 
  `"1m"`

  Time to live for the cached data.


## cluster
EMQX nodes can form a cluster to scale up the total capacity.<br>Here holds the configs to instruct how individual nodes can discover each other.


**Config paths**

 - <code>cluster</code>


**Env overrides**

 - <code>EMQX_CLUSTER</code>



**Fields**

- name: <code>atom()</code>
  * default: 
  `emqxcl`
  * mapping: 
  `ekka.cluster_name`

  Human-friendly name of the EMQX cluster.

- discovery_strategy: <code>manual | static | mcast | dns | etcd | k8s</code>
  * default: 
  `manual`

  Service discovery method for the cluster nodes.

- autoclean: <code>emqx_schema:duration()</code>
  * default: 
  `"5m"`
  * mapping: 
  `ekka.cluster_autoclean`

  Remove disconnected nodes from the cluster after this interval.

- autoheal: <code>boolean()</code>
  * default: 
  `true`
  * mapping: 
  `ekka.cluster_autoheal`

  If <code>true</code>, the node will try to heal network partitions
   automatically.

- proto_dist: <code>inet_tcp | inet6_tcp | inet_tls</code>
  * default: 
  `inet_tcp`
  * mapping: 
  `ekka.proto_dist`

  The Erlang distribution protocol for the cluster.

- static: <code>[cluster_static](#cluster_static)</code>



- mcast: <code>[cluster_mcast](#cluster_mcast)</code>



- dns: <code>[cluster_dns](#cluster_dns)</code>



- etcd: <code>[cluster_etcd](#cluster_etcd)</code>



- k8s: <code>[cluster_k8s](#cluster_k8s)</code>




## cluster_call
Options for the 'cluster call' feature that allows to execute a callback on all nodes in the cluster.


**Config paths**

 - <code>node.cluster_call</code>


**Env overrides**

 - <code>EMQX_NODE__CLUSTER_CALL</code>



**Fields**

- retry_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"1s"`

  Time interval to retry after a failed call.

- max_history: <code>1..500</code>
  * default: 
  `100`

  Retain the maximum number of completed transactions (for queries).

- cleanup_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"5m"`

  Time interval to clear completed but stale transactions.
  Ensure that the number of completed transactions is less than the <code>max_history</code>.


## conn_congestion
Settings for `conn_congestion` alarm.

Sometimes the MQTT connection (usually an MQTT subscriber) may
get "congested", because there are too many packets to be sent.
The socket tries to buffer the packets until the buffer is
full. If more packets arrive after that, the packets will be
"pending" in the queue and we consider the connection
congested.

Note: `sndbuf` can be set to larger value if the
alarm is triggered too often.
The name of the alarm is of format `conn_congestion/<ClientID>/<Username>`,
where the `<ClientID>` is the client ID of the congested MQTT connection,
and `<Username>` is the username or `unknown_user`.


**Config paths**

 - <code>conn_congestion</code>


**Env overrides**

 - <code>EMQX_CONN_CONGESTION</code>



**Fields**

- enable_alarm: <code>boolean()</code>
  * default: 
  `false`

  Enable or disable connection congestion alarm.

- min_alarm_sustain_duration: <code>emqx_schema:duration()</code>
  * default: 
  `"1m"`

  Minimal time before clearing the alarm.

  The alarm is cleared only when there's no pending data in
  the queue, and at least `min_alarm_sustain_duration`
  milliseconds passed since the last time we considered the connection "congested".

  This is to avoid clearing and raising the alarm again too often.


## connector
Generic configuration for the connector.


**Config paths**

 - <code>connectors.mqtt.$name</code>


**Env overrides**

 - <code>EMQX_CONNECTORS__MQTT__$NAME</code>



**Fields**

- mode: <code>cluster_shareload</code>
  * default: 
  `cluster_shareload`


  The mode of the MQTT Bridge. Can be one of 'cluster_singleton' or 'cluster_shareload'<br/>

  - cluster_singleton: create a unique MQTT connection within the emqx cluster.<br/>
  In 'cluster_singleton' node, all messages toward the remote broker go through the same
  MQTT connection.<br/>
  - cluster_shareload: create an MQTT connection on each node in the emqx cluster.<br/>
  In 'cluster_shareload' mode, the incoming load from the remote broker is shared by
  using shared subscription.<br/>
  Note that the 'clientid' is suffixed by the node name, this is to avoid
  clientid conflicts between different nodes. And we can only use shared subscription
  topic filters for 'remote_topic' of ingress connections.


- server: <code>emqx_schema:ip_port()</code>
  * default: 
  `"127.0.0.1:1883"`

  The host and port of the remote MQTT broker

- reconnect_interval: <code>string()</code>
  * default: 
  `"15s"`

  Reconnect interval. Delay for the MQTT bridge to retry establishing the connection in case of transportation failure. Time interval is a string that contains a number followed by time unit:<br/>
  - `ms` for milliseconds,
  - `s` for seconds,
  - `m` for minutes,
  - `h` for hours;
  <br/>or combination of whereof: `1h5m0s`

- proto_ver: <code>v3 | v4 | v5</code>
  * default: 
  `v4`

  The MQTT protocol version

- username: <code>binary()</code>
  * default: 
  `"emqx"`

  The username of the MQTT protocol

- password: <code>binary()</code>
  * default: 
  `"emqx"`

  The password of the MQTT protocol

- clean_start: <code>boolean()</code>
  * default: 
  `true`

  The clean-start or the clean-session of the MQTT protocol

- keepalive: <code>string()</code>
  * default: 
  `"300s"`

  MQTT Keepalive. Time interval is a string that contains a number followed by time unit:<br/>
  - `ms` for milliseconds,
  - `s` for seconds,
  - `m` for minutes,
  - `h` for hours;
  <br/>or combination of whereof: `1h5m0s`

- retry_interval: <code>string()</code>
  * default: 
  `"15s"`

  Message retry interval. Delay for the MQTT bridge to retry sending the QoS1/QoS2 messages in case of ACK not received. Time interval is a string that contains a number followed by time unit:<br/>
  - `ms` for milliseconds,
  - `s` for seconds,
  - `m` for minutes,
  - `h` for hours;
  <br/>or combination of whereof: `1h5m0s`

- max_inflight: <code>non_neg_integer()</code>
  * default: 
  `32`

  Max inflight (sent, but un-acked) messages of the MQTT protocol

- replayq: <code>[replayq](#replayq)</code>



- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## connectors
Configuration for EMQX connectors.<br/>A connector maintains the data related to the external resources,
such as MySQL database.


**Config paths**

 - <code>connectors</code>


**Env overrides**

 - <code>EMQX_CONNECTORS</code>



**Fields**

- mqtt: <code>{$name -> [connector](#connector)}</code>

  MQTT bridges


## console_handler
Log handler that prints log events to the EMQX console.


**Config paths**

 - <code>log.console_handler</code>


**Env overrides**

 - <code>EMQX_LOG__CONSOLE_HANDLER</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable this log handler.

- level: <code>emqx_conf_schema:log_level()</code>
  * default: 
  `warning`

  Global log level. This includes the primary log level and all log handlers.

- time_offset: <code>string()</code>
  * default: 
  `"system"`

  The time offset to be used when formatting the timestamp.

- chars_limit: <code>unlimited | 1..inf</code>
  * default: 
  `unlimited`

  Set the maximum length of a single log message. If this length is exceeded, the log message will be truncated.

- formatter: <code>text | json</code>
  * default: 
  `text`

  Choose log format. <code>text</code> for free text, and <code>json</code> for structured logging.

- single_line: <code>boolean()</code>
  * default: 
  `true`

  Print logs in a single line if set to true. Otherwise, log messages may span multiple lines.

- sync_mode_qlen: <code>integer()</code>
  * default: 
  `100`

  As long as the number of buffered log events is lower than this value, all log events are handled asynchronously.

- drop_mode_qlen: <code>integer()</code>
  * default: 
  `3000`

  When the number of buffered log events is larger than this value, the new log events are dropped.<br/>When drop mode is activated or deactivated, a message is printed in the logs.

- flush_qlen: <code>integer()</code>
  * default: 
  `8000`

  If the number of buffered log events grows larger than this threshold, a flush (delete) operation takes place. To flush events, the handler discards the buffered log messages without logging.

- overload_kill: <code>[log_overload_kill](#log_overload_kill)</code>



- burst_limit: <code>[log_burst_limit](#log_burst_limit)</code>



- supervisor_reports: <code>error | progress</code>
  * default: 
  `error`

  Type of supervisor reports that are logged.
   - `error`: only log errors in the Erlang processes.
   - `progress`: log process startup.

- max_depth: <code>unlimited | non_neg_integer()</code>
  * default: 
  `100`

  Maximum depth for Erlang term log formatting and Erlang process message queue inspection.


## db
Settings for the embedded database.


**Config paths**

 - <code>db</code>


**Env overrides**

 - <code>EMQX_DB</code>



**Fields**

- backend: <code>mnesia | rlog</code>
  * default: 
  `rlog`
  * mapping: 
  `mria.db_backend`


  Select the backend for the embedded database.<br/>
  <code>rlog</code> is the default backend,
  that is suitable for very large clusters.<br/>
  <code>mnesia</code> is a backend that offers decent performance in small clusters.


- role: <code>core | replicant</code>
  * default: 
  `core`
  * mapping: 
  `mria.node_role`


  Select a node role.<br/>
  <code>core</code> nodes provide durability of the data, and take care of writes.
  It is recommended to place core nodes in different racks or different availability zones.<br/>
  <code>replicant</code> nodes are ephemeral worker nodes. Removing them from the cluster
  doesn't affect database redundancy<br/>
  It is recommended to have more replicant nodes than core nodes.<br/>
  Note: this parameter only takes effect when the <code>backend</code> is set
  to <code>rlog</code>.


- core_nodes: <code>emqx_schema:comma_separated_atoms()</code>
  * default: 
  `[]`
  * mapping: 
  `mria.core_nodes`


  List of core nodes that the replicant will connect to.<br/>
  Note: this parameter only takes effect when the <code>backend</code> is set
  to <code>rlog</code> and the <code>role</code> is set to <code>replicant</code>.<br/>
  This value needs to be defined for manual or static cluster discovery mechanisms.<br/>
  If an automatic cluster discovery mechanism is being used (such as <code>etcd</code>),
  there is no need to set this value.


- rpc_module: <code>gen_rpc | rpc</code>
  * default: 
  `gen_rpc`
  * mapping: 
  `mria.rlog_rpc_module`


  Protocol used for pushing transaction logs to the replicant nodes.


- tlog_push_mode: <code>sync | async</code>
  * default: 
  `async`
  * mapping: 
  `mria.tlog_push_mode`


  In sync mode the core node waits for an ack from the replicant nodes before sending the next
  transaction log entry.


- default_shard_transport: <code>gen_rpc | distr</code>
  * default: 
  `gen_rpc`
  * mapping: 
  `mria.shard_transport`

  Defines the default transport for pushing transaction logs.<br/>This may be overridden on a per-shard basis in <code>db.shard_transports</code>.<code>gen_rpc</code> uses the <code>gen_rpc</code> library, <code>distr</code> uses the Erlang distribution.<br/>

- shard_transports: <code>{$shard -> gen_rpc | distr}</code>
  * default: 
  `{}`
  * mapping: 
  `emqx_machine.custom_shard_transports`

  Allows to tune the transport method used for transaction log replication, on a per-shard basis.<br/><code>gen_rpc</code> uses the <code>gen_rpc</code> library, <code>distr</code> uses the Erlang distribution.<br/>If not specified, the default is to use the value set in <code>db.default_shard_transport</code>.


## deflate_opts
Compression options.


**Config paths**

 - <code>listeners.ws.$name.websocket.deflate_opts</code>
 - <code>listeners.wss.$name.websocket.deflate_opts</code>


**Env overrides**

 - <code>EMQX_LISTENERS__WS__$NAME__WEBSOCKET__DEFLATE_OPTS</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__WEBSOCKET__DEFLATE_OPTS</code>



**Fields**

- level: <code>none | default | best_compression | best_speed</code>

  Compression level.

- mem_level: <code>1..9</code>
  * default: 
  `8`

  Specifies the size of the compression state.<br/>
   Lower values decrease memory usage per connection.

- strategy: <code>default | filtered | huffman_only | rle</code>

  Specifies the compression strategy.

- server_context_takeover: <code>takeover | no_takeover</code>

  Takeover means the compression state is retained
   between server messages.

- client_context_takeover: <code>takeover | no_takeover</code>

  Takeover means the compression state is retained
   between client messages.

- server_max_window_bits: <code>8..15</code>
  * default: 
  `15`

  Specifies the size of the compression context for the server.

- client_max_window_bits: <code>8..15</code>
  * default: 
  `15`

  Specifies the size of the compression context for the client.


## egress
Configuration for MQTT bridge.


**Config paths**

 - <code>bridges.mqtt.$name</code>


**Env overrides**

 - <code>EMQX_BRIDGES__MQTT__$NAME</code>



**Fields**

- direction: <code>egress</code>
  * default: 
  `egress`

  The direction of the bridge. Can be one of 'ingress' or 'egress'.<br>
  The egress config defines how this bridge forwards messages from the local broker to the remote
  broker.<br/>
  Template with variables is allowed in 'remote_topic', 'qos', 'retain', 'payload'.<br/>
  NOTE: if this bridge is used as the output of a rule (emqx rule engine), and also local_topic
  is configured, then both the data got from the rule and the MQTT messages that matches
  local_topic will be forwarded.


- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable this bridge

- connector: <code>binary()</code>


  The connector ID to be used for this bridge. Connector IDs must be of format:
  <code>{type}:{name}</code>.<br>
  In config files, you can find the corresponding config entry for a connector by such path:
  'connectors.{type}.{name}'.<br>


- local_topic: <code>binary()</code>

  The local topic to be forwarded to the remote broker

- remote_topic: <code>binary()</code>
  * default: 
  `"${topic}"`


  Forward to which topic of the remote broker.<br/>
  Template with variables is allowed.


- remote_qos: <code>qos() | binary()</code>
  * default: 
  `"${qos}"`


  The QoS of the MQTT message to be sent.<br/>
  Template with variables is allowed.

- retain: <code>boolean() | binary()</code>
  * default: 
  `"${retain}"`


  The 'retain' flag of the MQTT message to be sent.<br/>
  Template with variables is allowed.

- payload: <code>binary()</code>
  * default: 
  `"${payload}"`


  The payload of the MQTT message to be sent.<br/>
  Template with variables is allowed.


## event_names
Enable or disable client lifecycle event publishing.

The following options affect MQTT clients as well as
gateway clients. The types of the clients
are distinguished by the topic prefix:

- For the MQTT clients, the format is:
`$SYS/broker/<node>/clients/<clientid>/<event>`
- For the Gateway clients, it is
`$SYS/broker/<node>/gateway/<gateway-name>/clients/<clientid>/<event>`



**Config paths**

 - <code>sys_topics.sys_event_messages</code>


**Env overrides**

 - <code>EMQX_SYS_TOPICS__SYS_EVENT_MESSAGES</code>



**Fields**

- client_connected: <code>boolean()</code>
  * default: 
  `true`

  Connection complete

- client_disconnected: <code>boolean()</code>
  * default: 
  `true`

  Disconnect

- client_subscribed: <code>boolean()</code>
  * default: 
  `false`

  Subscribe

- client_unsubscribed: <code>boolean()</code>
  * default: 
  `false`

  Unsubscribe


## flapping_detect
This config controls the allowed maximum number of `CONNECT` packets received
from the same clientid in a time frame defined by `window_time`.
After the limit is reached, successive `CONNECT` requests are forbidden
(banned) until the end of the time period defined by `ban_time`.


**Config paths**

 - <code>flapping_detect</code>


**Env overrides**

 - <code>EMQX_FLAPPING_DETECT</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable flapping connection detection feature.

- max_count: <code>integer()</code>
  * default: 
  `15`

  The maximum number of disconnects allowed for a MQTT Client in `window_time`

- window_time: <code>emqx_schema:duration()</code>
  * default: 
  `"1m"`

  The time window for flapping detection.

- ban_time: <code>emqx_schema:duration()</code>
  * default: 
  `"5m"`

  How long the flapping clientid will be banned.


## force_gc
Force garbage collection in MQTT connection process after
 they process certain number of messages or bytes of data.


**Config paths**

 - <code>force_gc</code>


**Env overrides**

 - <code>EMQX_FORCE_GC</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable forced garbage collection.

- count: <code>0..inf</code>
  * default: 
  `16000`

  GC the process after this many received messages.

- bytes: <code>emqx_schema:bytesize()</code>
  * default: 
  `"16MB"`

  GC the process after specified number of bytes have passed through.


## force_shutdown
When the process message queue length, or the memory bytes
reaches a certain value, the process is forced to close.

Note: "message queue" here refers to the "message mailbox"
of the Erlang process, not the `mqueue` of QoS 1 and QoS 2.


**Config paths**

 - <code>force_shutdown</code>


**Env overrides**

 - <code>EMQX_FORCE_SHUTDOWN</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable `force_shutdown` feature.

- max_message_queue_len: <code>0..inf</code>
  * default: 
  `1000`

  Maximum message queue length.

- max_heap_size: <code>emqx_schema:wordsize()</code>
  * default: 
  `"32MB"`

  Total heap size


## ingress
Configuration for MQTT bridge.


**Config paths**

 - <code>bridges.mqtt.$name</code>


**Env overrides**

 - <code>EMQX_BRIDGES__MQTT__$NAME</code>



**Fields**

- direction: <code>ingress</code>
  * default: 
  `egress`

  The direction of the bridge. Can be one of 'ingress' or 'egress'.<br>
  The ingress config defines how this bridge receive messages from the remote MQTT broker, and then
  send them to the local broker.<br/>
  Template with variables is allowed in 'local_topic', 'remote_qos', 'qos', 'retain',
  'payload'.<br/>
  NOTE: if this bridge is used as the input of a rule (emqx rule engine), and also local_topic is
  configured, then messages got from the remote broker will be sent to both the 'local_topic' and
  the rule.


- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable this bridge

- connector: <code>binary()</code>


  The connector ID to be used for this bridge. Connector IDs must be of format:
  <code>{type}:{name}</code>.<br>
  In config files, you can find the corresponding config entry for a connector by such path:
  'connectors.{type}.{name}'.<br>


- remote_topic: <code>binary()</code>

  Receive messages from which topic of the remote broker

- remote_qos: <code>qos() | binary()</code>
  * default: 
  `1`

  The QoS level to be used when subscribing to the remote broker

- local_topic: <code>binary()</code>


  Send messages to which topic of the local broker.<br/>
  Template with variables is allowed.


- local_qos: <code>qos() | binary()</code>
  * default: 
  `"${qos}"`


  The QoS of the MQTT message to be sent.<br/>
  Template with variables is allowed.

- retain: <code>boolean() | binary()</code>
  * default: 
  `"${retain}"`


  The 'retain' flag of the MQTT message to be sent.<br/>
  Template with variables is allowed.

- payload: <code>binary()</code>
  * default: 
  `"${payload}"`


  The payload of the MQTT message to be sent.<br/>
  Template with variables is allowed.


## listener_ssl_opts
Socket options for SSL connections.


**Config paths**

 - <code>gateway.exproto.listeners.ssl.$name.ssl</code>
 - <code>gateway.stomp.listeners.ssl.$name.ssl</code>
 - <code>listeners.ssl.$name.ssl</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__SSL</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__SSL</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__SSL</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable TLS.

- cacertfile: <code>string()</code>

  Trusted PEM format CA certificates bundle file.<br>
  The certificates in this file are used to verify the TLS peer's certificates.
  Append new certificates to the file if new CAs are to be trusted.
  There is no need to restart EMQX to have the updated file loaded, because
  the system regularly checks if file has been updated (and reload).<br>
  NOTE: invalidating (deleting) a certificate from the file will not affect
  already established connections.


- certfile: <code>string()</code>

  PEM format certificates chain file.<br>
  The certificates in this file should be in reversed order of the certificate
  issue chain. That is, the host's certificate should be placed in the beginning
  of the file, followed by the immediate issuer certificate and so on.
  Although the root CA certificate is optional, it should be placed at the end of
  the file if it is to be added.

- keyfile: <code>string()</code>

  PEM format private key file.

- verify: <code>verify_peer | verify_none</code>
  * default: 
  `verify_none`

  Enable or disable peer verification.

- reuse_sessions: <code>boolean()</code>
  * default: 
  `true`

  Enable TLS session reuse.

- depth: <code>integer()</code>
  * default: 
  `10`

  Maximum number of non-self-issued intermediate certificates that can follow the peer certificate in a valid certification path. So, if depth is 0 the PEER must be signed by the trusted ROOT-CA directly; if 1 the path can be PEER, CA, ROOT-CA; if 2 the path can be PEER, CA, CA, ROOT-CA, and so on. The default value is 10.

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  key file is password-protected.

- versions: <code>[atom()]</code>
  * default: 
  `[tlsv1.3, tlsv1.2, tlsv1.1, tlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.

- ciphers: <code>[string()]</code>
  * default: 
  `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256", "TLS_AES_128_CCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

  This config holds TLS cipher suite names separated by comma,
  or as an array of strings. e.g.
  <code>"TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256"</code> or
  <code>["TLS_AES_256_GCM_SHA384","TLS_AES_128_GCM_SHA256"]</code>.
  <br>
  Ciphers (and their ordering) define the way in which the
  client and server encrypts information over the network connection.
  Selecting a good cipher suite is critical for the
  application's data security, confidentiality and performance.

  The names should be in OpenSSL string format (not RFC format).
  All default values and examples provided by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>
  * default: 
  `"emqx_tls_psk:lookup"`

  EMQX-internal callback that is used to lookup pre-shared key (PSK) identity.

- secure_renegotiate: <code>boolean()</code>
  * default: 
  `true`

  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.

- dhfile: <code>string()</code>

  Path to a file containing PEM-encoded Diffie-Hellman parameters
  to be used by the server if a cipher suite using Diffie-Hellman
  key exchange is negotiated. If not specified, default parameters
  are used.<br>
  NOTE: The <code>dhfile</code> option is not supported by TLS 1.3.

- fail_if_no_peer_cert: <code>boolean()</code>
  * default: 
  `false`

  Used together with {verify, verify_peer} by an TLS/DTLS server.
  If set to true, the server fails if the client does not have a
  certificate to send, that is, sends an empty certificate.
  If set to false, it fails only if the client sends an invalid
  certificate (an empty certificate is considered valid).

- honor_cipher_order: <code>boolean()</code>
  * default: 
  `true`

  An important security setting, it forces the cipher to be set based
   on the server-specified order instead of the client-specified order,
   hence enforcing the (usually more properly configured) security
   ordering of the server administrator.

- client_renegotiation: <code>boolean()</code>
  * default: 
  `true`

  In protocols that support client-initiated renegotiation,
  the cost of resources of such an operation is higher for the server than the client.
  This can act as a vector for denial of service attacks.
  The SSL application already takes measures to counter-act such attempts,
  but client-initiated renegotiation can be strictly disabled by setting this option to false.
  The default value is true. Note that disabling renegotiation can result in
  long-lived connections becoming unusable due to limits on
  the number of messages the underlying cipher suite can encipher.


## listener_wss_opts
Socket options for WebSocket/SSL connections.


**Config paths**

 - <code>listeners.wss.$name.ssl</code>


**Env overrides**

 - <code>EMQX_LISTENERS__WSS__$NAME__SSL</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable TLS.

- cacertfile: <code>string()</code>

  Trusted PEM format CA certificates bundle file.<br>
  The certificates in this file are used to verify the TLS peer's certificates.
  Append new certificates to the file if new CAs are to be trusted.
  There is no need to restart EMQX to have the updated file loaded, because
  the system regularly checks if file has been updated (and reload).<br>
  NOTE: invalidating (deleting) a certificate from the file will not affect
  already established connections.


- certfile: <code>string()</code>

  PEM format certificates chain file.<br>
  The certificates in this file should be in reversed order of the certificate
  issue chain. That is, the host's certificate should be placed in the beginning
  of the file, followed by the immediate issuer certificate and so on.
  Although the root CA certificate is optional, it should be placed at the end of
  the file if it is to be added.

- keyfile: <code>string()</code>

  PEM format private key file.

- verify: <code>verify_peer | verify_none</code>
  * default: 
  `verify_none`

  Enable or disable peer verification.

- reuse_sessions: <code>boolean()</code>
  * default: 
  `true`

  Enable TLS session reuse.

- depth: <code>integer()</code>
  * default: 
  `10`

  Maximum number of non-self-issued intermediate certificates that can follow the peer certificate in a valid certification path. So, if depth is 0 the PEER must be signed by the trusted ROOT-CA directly; if 1 the path can be PEER, CA, ROOT-CA; if 2 the path can be PEER, CA, CA, ROOT-CA, and so on. The default value is 10.

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  key file is password-protected.

- versions: <code>[atom()]</code>
  * default: 
  `[tlsv1.3, tlsv1.2, tlsv1.1, tlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.

- ciphers: <code>[string()]</code>
  * default: 
  `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256", "TLS_AES_128_CCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

  This config holds TLS cipher suite names separated by comma,
  or as an array of strings. e.g.
  <code>"TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256"</code> or
  <code>["TLS_AES_256_GCM_SHA384","TLS_AES_128_GCM_SHA256"]</code>.
  <br>
  Ciphers (and their ordering) define the way in which the
  client and server encrypts information over the network connection.
  Selecting a good cipher suite is critical for the
  application's data security, confidentiality and performance.

  The names should be in OpenSSL string format (not RFC format).
  All default values and examples provided by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>
  * default: 
  `"emqx_tls_psk:lookup"`

  EMQX-internal callback that is used to lookup pre-shared key (PSK) identity.

- secure_renegotiate: <code>boolean()</code>
  * default: 
  `true`

  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.

- dhfile: <code>string()</code>

  Path to a file containing PEM-encoded Diffie-Hellman parameters
  to be used by the server if a cipher suite using Diffie-Hellman
  key exchange is negotiated. If not specified, default parameters
  are used.<br>
  NOTE: The <code>dhfile</code> option is not supported by TLS 1.3.

- fail_if_no_peer_cert: <code>boolean()</code>
  * default: 
  `false`

  Used together with {verify, verify_peer} by an TLS/DTLS server.
  If set to true, the server fails if the client does not have a
  certificate to send, that is, sends an empty certificate.
  If set to false, it fails only if the client sends an invalid
  certificate (an empty certificate is considered valid).

- honor_cipher_order: <code>boolean()</code>
  * default: 
  `true`

  An important security setting, it forces the cipher to be set based
   on the server-specified order instead of the client-specified order,
   hence enforcing the (usually more properly configured) security
   ordering of the server administrator.

- client_renegotiation: <code>boolean()</code>
  * default: 
  `true`

  In protocols that support client-initiated renegotiation,
  the cost of resources of such an operation is higher for the server than the client.
  This can act as a vector for denial of service attacks.
  The SSL application already takes measures to counter-act such attempts,
  but client-initiated renegotiation can be strictly disabled by setting this option to false.
  The default value is true. Note that disabling renegotiation can result in
  long-lived connections becoming unusable due to limits on
  the number of messages the underlying cipher suite can encipher.

- handshake_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"15s"`

  Maximum time duration allowed for the handshake to complete


## listeners
MQTT listeners identified by their protocol type and assigned names


**Config paths**

 - <code>listeners</code>


**Env overrides**

 - <code>EMQX_LISTENERS</code>



**Fields**

- tcp: <code>{$name -> [mqtt_tcp_listener](#mqtt_tcp_listener)}</code>

  TCP listeners

- ssl: <code>{$name -> [mqtt_ssl_listener](#mqtt_ssl_listener)}</code>

  SSL listeners

- ws: <code>{$name -> [mqtt_ws_listener](#mqtt_ws_listener)}</code>

  HTTP websocket listeners

- wss: <code>{$name -> [mqtt_wss_listener](#mqtt_wss_listener)}</code>

  HTTPS websocket listeners

- quic: <code>{$name -> [mqtt_quic_listener](#mqtt_quic_listener)}</code>

  QUIC listeners


## log
EMQX logging supports multiple sinks for the log events. Each sink is represented by a _log handler_, which can be configured independently.


**Config paths**

 - <code>log</code>


**Env overrides**

 - <code>EMQX_LOG</code>



**Fields**

- console_handler: <code>[console_handler](#console_handler)</code>



- file_handlers: <code>{$name -> [log_file_handler](#log_file_handler)}</code>

  Key-value list of file-based log handlers.

- error_logger: <code>atom()</code>
  * default: 
  `silent`
  * mapping: 
  `kernel.error_logger`

  Deprecated.


## log_burst_limit
Large bursts of log events produced in a short time can potentially cause problems, such as:
 - Log files grow very large
 - Log files are rotated too quickly, and useful information gets overwritten
 - Overall performance impact on the system

Log burst limit feature can temporarily disable logging to avoid these issues.


**Config paths**

 - <code>log.console_handler.burst_limit</code>
 - <code>log.file_handlers.$name.burst_limit</code>


**Env overrides**

 - <code>EMQX_LOG__CONSOLE_HANDLER__BURST_LIMIT</code>
 - <code>EMQX_LOG__FILE_HANDLERS__$NAME__BURST_LIMIT</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable log burst control feature.

- max_count: <code>integer()</code>
  * default: 
  `10000`

  Maximum number of log events to handle within a `window_time` interval. After the limit is reached, successive events are dropped until the end of the `window_time`.

- window_time: <code>emqx_schema:duration()</code>
  * default: 
  `"1s"`

  See `max_count`.


## log_file_handler
Log handler that prints log events to files.


**Config paths**

 - <code>log.file_handlers.$name</code>


**Env overrides**

 - <code>EMQX_LOG__FILE_HANDLERS__$NAME</code>



**Fields**

- file: <code>emqx_conf_schema:file()</code>

  Name the log file.

- rotation: <code>[log_rotation](#log_rotation)</code>



- max_size: <code>infinity | emqx_schema:bytesize()</code>
  * default: 
  `"10MB"`

  This parameter controls log file rotation. The value `infinity` means the log file will grow indefinitely, otherwise the log file will be rotated once it reaches `max_size` in bytes.

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable this log handler.

- level: <code>emqx_conf_schema:log_level()</code>
  * default: 
  `warning`

  Global log level. This includes the primary log level and all log handlers.

- time_offset: <code>string()</code>
  * default: 
  `"system"`

  The time offset to be used when formatting the timestamp.

- chars_limit: <code>unlimited | 1..inf</code>
  * default: 
  `unlimited`

  Set the maximum length of a single log message. If this length is exceeded, the log message will be truncated.

- formatter: <code>text | json</code>
  * default: 
  `text`

  Choose log format. <code>text</code> for free text, and <code>json</code> for structured logging.

- single_line: <code>boolean()</code>
  * default: 
  `true`

  Print logs in a single line if set to true. Otherwise, log messages may span multiple lines.

- sync_mode_qlen: <code>integer()</code>
  * default: 
  `100`

  As long as the number of buffered log events is lower than this value, all log events are handled asynchronously.

- drop_mode_qlen: <code>integer()</code>
  * default: 
  `3000`

  When the number of buffered log events is larger than this value, the new log events are dropped.<br/>When drop mode is activated or deactivated, a message is printed in the logs.

- flush_qlen: <code>integer()</code>
  * default: 
  `8000`

  If the number of buffered log events grows larger than this threshold, a flush (delete) operation takes place. To flush events, the handler discards the buffered log messages without logging.

- overload_kill: <code>[log_overload_kill](#log_overload_kill)</code>



- burst_limit: <code>[log_burst_limit](#log_burst_limit)</code>



- supervisor_reports: <code>error | progress</code>
  * default: 
  `error`

  Type of supervisor reports that are logged.
   - `error`: only log errors in the Erlang processes.
   - `progress`: log process startup.

- max_depth: <code>unlimited | non_neg_integer()</code>
  * default: 
  `100`

  Maximum depth for Erlang term log formatting and Erlang process message queue inspection.


## log_overload_kill
Log overload kill features an overload protection that activates when the log handlers use too much memory or have too many buffered log messages.<br/>When the overload is detected, the log handler is terminated and restarted after a cooldown period.


**Config paths**

 - <code>log.console_handler.overload_kill</code>
 - <code>log.file_handlers.$name.overload_kill</code>


**Env overrides**

 - <code>EMQX_LOG__CONSOLE_HANDLER__OVERLOAD_KILL</code>
 - <code>EMQX_LOG__FILE_HANDLERS__$NAME__OVERLOAD_KILL</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable log handler overload kill feature.

- mem_size: <code>emqx_schema:bytesize()</code>
  * default: 
  `"30MB"`

  Maximum memory size that the handler process is allowed to use.

- qlen: <code>integer()</code>
  * default: 
  `20000`

  Maximum allowed queue length.

- restart_after: <code>emqx_schema:duration() | infinity</code>
  * default: 
  `"5s"`

  If the handler is terminated, it restarts automatically after a delay specified in milliseconds. The value `infinity` prevents restarts.


## log_rotation
By default, the logs are stored in `./log` directory (for installation from zip file) or in `/var/log/emqx` (for binary installation).<br/>This section of the configuration controls the number of files kept for each log handler.


**Config paths**

 - <code>log.file_handlers.$name.rotation</code>


**Env overrides**

 - <code>EMQX_LOG__FILE_HANDLERS__$NAME__ROTATION</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable log rotation feature.

- count: <code>1..2048</code>
  * default: 
  `10`

  Maximum number of log files.


## mqtt
Global MQTT configuration.<br>
The configs here work as default values which can be overridden
in <code>zone</code> configs


**Config paths**

 - <code>mqtt</code>


**Env overrides**

 - <code>EMQX_MQTT</code>



**Fields**

- idle_timeout: <code>infinity | emqx_schema:duration()</code>
  * default: 
  `"15s"`

  Close TCP connections from the clients that have not sent MQTT CONNECT
  message within this interval.

- max_packet_size: <code>emqx_schema:bytesize()</code>
  * default: 
  `"1MB"`

  Maximum MQTT packet size allowed.

- max_clientid_len: <code>23..65535</code>
  * default: 
  `65535`

  Maximum allowed length of MQTT clientId.

- max_topic_levels: <code>1..65535</code>
  * default: 
  `65535`

  Maximum topic levels allowed.

- max_qos_allowed: <code>qos()</code>
  * default: 
  `2`

  Maximum QoS allowed.

- max_topic_alias: <code>0..65535</code>
  * default: 
  `65535`

  Maximum Topic Alias, 0 means no topic alias supported.

- retain_available: <code>boolean()</code>
  * default: 
  `true`

  Support MQTT retained messages.

- wildcard_subscription: <code>boolean()</code>
  * default: 
  `true`

  Support MQTT Wildcard Subscriptions.

- shared_subscription: <code>boolean()</code>
  * default: 
  `true`

  Support MQTT Shared Subscriptions.

- ignore_loop_deliver: <code>boolean()</code>
  * default: 
  `false`

  Ignore loop delivery of messages for MQTT v3.1.1.

- strict_mode: <code>boolean()</code>
  * default: 
  `false`

  Parse MQTT messages in strict mode. When set to true, invalid utf8 strings in for example client ID, topic name, etc. will cause the client to be disconnected

- response_information: <code>string()</code>
  * default: 
  `[]`

  Specify the response information returned to the client
  This feature is disabled if is set to "".

- server_keepalive: <code>integer() | disabled</code>
  * default: 
  `disabled`

  'Server Keep Alive' of MQTT 5.0.
  If the server returns a 'Server Keep Alive' in the CONNACK packet,
  the client MUST use that value instead of the value it sent as the 'Keep Alive'.

- keepalive_backoff: <code>float()</code>
  * default: 
  `0.75`

  The backoff for MQTT keepalive timeout. The broker will close the connection
  after idling for 'Keepalive * backoff * 2'.

- max_subscriptions: <code>1..inf | infinity</code>
  * default: 
  `infinity`

  Maximum number of subscriptions allowed.

- upgrade_qos: <code>boolean()</code>
  * default: 
  `false`

  Force upgrade of QoS level according to subscription.

- max_inflight: <code>1..65535</code>
  * default: 
  `32`

  Maximum size of the Inflight Window storing QoS1/2 messages delivered but un-acked.

- retry_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"30s"`

  Retry interval for QoS1/2 message delivering.

- max_awaiting_rel: <code>integer() | infinity</code>
  * default: 
  `100`

  Maximum QoS2 packets (Client -> Broker) awaiting PUBREL.

- await_rel_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"300s"`

  The QoS2 messages (Client -> Broker) will be dropped if awaiting PUBREL timeout.

- session_expiry_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"2h"`

  Default session expiry interval for MQTT V3.1.1 connections.

- max_mqueue_len: <code>non_neg_integer() | infinity</code>
  * default: 
  `1000`

  Maximum queue length. Enqueued messages when persistent client disconnected,
  or inflight window is full.

- mqueue_priorities: <code>map() | disabled</code>
  * default: 
  `disabled`

  Topic priorities.<br>
  There's no priority table by default, hence all messages are treated equal.<br>
  Priority number [1-255]<br>

  **NOTE**: Comma and equal signs are not allowed for priority topic names.<br>
  **NOTE**: Messages for topics not in the priority table are treated as
  either highest or lowest priority depending on the configured value for
  <code>mqtt.mqueue_default_priority</code>.
  <br><br>
  **Examples**:
  To configure <code>"topic/1" > "topic/2"</code>:<br/>
  <code>mqueue_priorities: {"topic/1": 10, "topic/2": 8}</code>

- mqueue_default_priority: <code>highest | lowest</code>
  * default: 
  `lowest`

  Default to the highest priority for topics not matching priority table.

- mqueue_store_qos0: <code>boolean()</code>
  * default: 
  `true`

  Support enqueue QoS0 messages.

- use_username_as_clientid: <code>boolean()</code>
  * default: 
  `false`

  Replace client ID with the username.

- peer_cert_as_username: <code>disabled | cn | dn | crt | pem | md5</code>
  * default: 
  `disabled`

  Use the CN, DN or CRT field from the client certificate as a username.
  Only works for the TLS connection.

- peer_cert_as_clientid: <code>disabled | cn | dn | crt | pem | md5</code>
  * default: 
  `disabled`

  Use the CN, DN or CRT field from the client certificate as a clientid.
  Only works for the TLS connection.


## mqtt_quic_listener
Settings for the MQTT over QUIC listener.


**Config paths**

 - <code>listeners.quic.$name</code>


**Env overrides**

 - <code>EMQX_LISTENERS__QUIC__$NAME</code>



**Fields**

- enabled: <code>boolean()</code>
  * default: 
  `true`

  Enable QUIC listener.

- certfile: <code>string()</code>

  Path to the certificate file.

- keyfile: <code>string()</code>

  Path to the secret key file.

- ciphers: <code>[string()]</code>
  * default: 
  `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256"]`

  This config holds TLS cipher suite names separated by comma,
  or as an array of strings. e.g.
  <code>"TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256"</code> or
  <code>["TLS_AES_256_GCM_SHA384","TLS_AES_128_GCM_SHA256"]</code>.
  <br>
  Ciphers (and their ordering) define the way in which the
  client and server encrypts information over the network connection.
  Selecting a good cipher suite is critical for the
  application's data security, confidentiality and performance.

  The names should be in OpenSSL string format (not RFC format).
  All default values and examples provided by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>
  NOTE: QUIC listener supports only 'tlsv1.3' ciphers<br>

- idle_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"15s"`

  Close transport-layer connections from the clients that have not sent MQTT CONNECT
  message within this interval.

- bind: <code>emqx_schema:ip_port() | integer()</code>

  IP address and port for the listening socket.

- acceptors: <code>integer()</code>
  * default: 
  `16`

  The size of the listener's receiving pool.

- max_connections: <code>infinity | integer()</code>
  * default: 
  `infinity`

  The maximum number of concurrent connections allowed by the listener.

- mountpoint: <code>binary()</code>
  * default: 
  `""`

  When publishing or subscribing, prefix all topics with a mountpoint string.
   The prefixed string will be removed from the topic name when the message
   is delivered to the subscriber. The mountpoint is a way that users can use
   to implement isolation of message routing between different listeners.
   For example if a client A subscribes to `t` with `listeners.tcp.<name>.mountpoint`
   set to `some_tenant`, then the client actually subscribes to the topic
   `some_tenant/t`. Similarly, if another client B (connected to the same listener
   as the client A) sends a message to topic `t`, the message is routed
   to all the clients subscribed `some_tenant/t`, so client A will receive the
   message, with topic name `t`.<br/>
   Set to `""` to disable the feature.<br/>

   Variables in mountpoint string:
   - <code>${clientid}</code>: clientid
   - <code>${username}</code>: username

- zone: <code>atom()</code>
  * default: 
  `default`

  The configuration zone to which the listener belongs.

- limiter: <code>{$ratelimit's type -> emqx_limiter_schema:bucket_name()}</code>
  * default: 
  `{}`

  Type of the rate limit.


## mqtt_ssl_listener
Settings for the MQTT over SSL listener.


**Config paths**

 - <code>listeners.ssl.$name</code>


**Env overrides**

 - <code>EMQX_LISTENERS__SSL__$NAME</code>



**Fields**

- tcp: <code>[tcp_opts](#tcp_opts)</code>



- ssl: <code>[listener_ssl_opts](#listener_ssl_opts)</code>



- bind: <code>emqx_schema:ip_port() | integer()</code>

  IP address and port for the listening socket.

- acceptors: <code>integer()</code>
  * default: 
  `16`

  The size of the listener's receiving pool.

- max_connections: <code>infinity | integer()</code>
  * default: 
  `infinity`

  The maximum number of concurrent connections allowed by the listener.

- mountpoint: <code>binary()</code>
  * default: 
  `""`

  When publishing or subscribing, prefix all topics with a mountpoint string.
   The prefixed string will be removed from the topic name when the message
   is delivered to the subscriber. The mountpoint is a way that users can use
   to implement isolation of message routing between different listeners.
   For example if a client A subscribes to `t` with `listeners.tcp.<name>.mountpoint`
   set to `some_tenant`, then the client actually subscribes to the topic
   `some_tenant/t`. Similarly, if another client B (connected to the same listener
   as the client A) sends a message to topic `t`, the message is routed
   to all the clients subscribed `some_tenant/t`, so client A will receive the
   message, with topic name `t`.<br/>
   Set to `""` to disable the feature.<br/>

   Variables in mountpoint string:
   - <code>${clientid}</code>: clientid
   - <code>${username}</code>: username

- zone: <code>atom()</code>
  * default: 
  `default`

  The configuration zone to which the listener belongs.

- limiter: <code>{$ratelimit's type -> emqx_limiter_schema:bucket_name()}</code>
  * default: 
  `{}`

  Type of the rate limit.

- access_rules: <code>[string()]</code>

  The access control rules for this listener.<br/>See: https://github.com/emqtt/esockd#allowdeny

- proxy_protocol: <code>boolean()</code>
  * default: 
  `false`

  Enable the Proxy Protocol V1/2 if the EMQX cluster is deployed
   behind HAProxy or Nginx.<br/>See: https://www.haproxy.com/blog/haproxy/proxy-protocol/

- proxy_protocol_timeout: <code>emqx_schema:duration()</code>

  Timeout for proxy protocol. EMQX will close the TCP connection if proxy protocol packet is not received within the timeout.

- authentication: <code>[[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)]</code>

  Per-listener authentication override
  Authentication can be one single authenticator instance or a chain of authenticators as an array.
  When authenticating a login (username, client ID, etc.) the authenticators are checked in the configured order.<br>



## mqtt_tcp_listener
Settings for the MQTT over TCP listener.


**Config paths**

 - <code>listeners.tcp.$name</code>


**Env overrides**

 - <code>EMQX_LISTENERS__TCP__$NAME</code>



**Fields**

- tcp: <code>[tcp_opts](#tcp_opts)</code>



- bind: <code>emqx_schema:ip_port() | integer()</code>

  IP address and port for the listening socket.

- acceptors: <code>integer()</code>
  * default: 
  `16`

  The size of the listener's receiving pool.

- max_connections: <code>infinity | integer()</code>
  * default: 
  `infinity`

  The maximum number of concurrent connections allowed by the listener.

- mountpoint: <code>binary()</code>
  * default: 
  `""`

  When publishing or subscribing, prefix all topics with a mountpoint string.
   The prefixed string will be removed from the topic name when the message
   is delivered to the subscriber. The mountpoint is a way that users can use
   to implement isolation of message routing between different listeners.
   For example if a client A subscribes to `t` with `listeners.tcp.<name>.mountpoint`
   set to `some_tenant`, then the client actually subscribes to the topic
   `some_tenant/t`. Similarly, if another client B (connected to the same listener
   as the client A) sends a message to topic `t`, the message is routed
   to all the clients subscribed `some_tenant/t`, so client A will receive the
   message, with topic name `t`.<br/>
   Set to `""` to disable the feature.<br/>

   Variables in mountpoint string:
   - <code>${clientid}</code>: clientid
   - <code>${username}</code>: username

- zone: <code>atom()</code>
  * default: 
  `default`

  The configuration zone to which the listener belongs.

- limiter: <code>{$ratelimit's type -> emqx_limiter_schema:bucket_name()}</code>
  * default: 
  `{}`

  Type of the rate limit.

- access_rules: <code>[string()]</code>

  The access control rules for this listener.<br/>See: https://github.com/emqtt/esockd#allowdeny

- proxy_protocol: <code>boolean()</code>
  * default: 
  `false`

  Enable the Proxy Protocol V1/2 if the EMQX cluster is deployed
   behind HAProxy or Nginx.<br/>See: https://www.haproxy.com/blog/haproxy/proxy-protocol/

- proxy_protocol_timeout: <code>emqx_schema:duration()</code>

  Timeout for proxy protocol. EMQX will close the TCP connection if proxy protocol packet is not received within the timeout.

- authentication: <code>[[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)]</code>

  Per-listener authentication override
  Authentication can be one single authenticator instance or a chain of authenticators as an array.
  When authenticating a login (username, client ID, etc.) the authenticators are checked in the configured order.<br>



## mqtt_ws_listener
Settings for the MQTT over WebSocket listener.


**Config paths**

 - <code>listeners.ws.$name</code>


**Env overrides**

 - <code>EMQX_LISTENERS__WS__$NAME</code>



**Fields**

- tcp: <code>[tcp_opts](#tcp_opts)</code>



- websocket: <code>[ws_opts](#ws_opts)</code>



- bind: <code>emqx_schema:ip_port() | integer()</code>

  IP address and port for the listening socket.

- acceptors: <code>integer()</code>
  * default: 
  `16`

  The size of the listener's receiving pool.

- max_connections: <code>infinity | integer()</code>
  * default: 
  `infinity`

  The maximum number of concurrent connections allowed by the listener.

- mountpoint: <code>binary()</code>
  * default: 
  `""`

  When publishing or subscribing, prefix all topics with a mountpoint string.
   The prefixed string will be removed from the topic name when the message
   is delivered to the subscriber. The mountpoint is a way that users can use
   to implement isolation of message routing between different listeners.
   For example if a client A subscribes to `t` with `listeners.tcp.<name>.mountpoint`
   set to `some_tenant`, then the client actually subscribes to the topic
   `some_tenant/t`. Similarly, if another client B (connected to the same listener
   as the client A) sends a message to topic `t`, the message is routed
   to all the clients subscribed `some_tenant/t`, so client A will receive the
   message, with topic name `t`.<br/>
   Set to `""` to disable the feature.<br/>

   Variables in mountpoint string:
   - <code>${clientid}</code>: clientid
   - <code>${username}</code>: username

- zone: <code>atom()</code>
  * default: 
  `default`

  The configuration zone to which the listener belongs.

- limiter: <code>{$ratelimit's type -> emqx_limiter_schema:bucket_name()}</code>
  * default: 
  `{}`

  Type of the rate limit.

- access_rules: <code>[string()]</code>

  The access control rules for this listener.<br/>See: https://github.com/emqtt/esockd#allowdeny

- proxy_protocol: <code>boolean()</code>
  * default: 
  `false`

  Enable the Proxy Protocol V1/2 if the EMQX cluster is deployed
   behind HAProxy or Nginx.<br/>See: https://www.haproxy.com/blog/haproxy/proxy-protocol/

- proxy_protocol_timeout: <code>emqx_schema:duration()</code>

  Timeout for proxy protocol. EMQX will close the TCP connection if proxy protocol packet is not received within the timeout.

- authentication: <code>[[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)]</code>

  Per-listener authentication override
  Authentication can be one single authenticator instance or a chain of authenticators as an array.
  When authenticating a login (username, client ID, etc.) the authenticators are checked in the configured order.<br>



## mqtt_wss_listener
Settings for the MQTT over WebSocket/SSL listener.


**Config paths**

 - <code>listeners.wss.$name</code>


**Env overrides**

 - <code>EMQX_LISTENERS__WSS__$NAME</code>



**Fields**

- tcp: <code>[tcp_opts](#tcp_opts)</code>



- ssl: <code>[listener_wss_opts](#listener_wss_opts)</code>



- websocket: <code>[ws_opts](#ws_opts)</code>



- bind: <code>emqx_schema:ip_port() | integer()</code>

  IP address and port for the listening socket.

- acceptors: <code>integer()</code>
  * default: 
  `16`

  The size of the listener's receiving pool.

- max_connections: <code>infinity | integer()</code>
  * default: 
  `infinity`

  The maximum number of concurrent connections allowed by the listener.

- mountpoint: <code>binary()</code>
  * default: 
  `""`

  When publishing or subscribing, prefix all topics with a mountpoint string.
   The prefixed string will be removed from the topic name when the message
   is delivered to the subscriber. The mountpoint is a way that users can use
   to implement isolation of message routing between different listeners.
   For example if a client A subscribes to `t` with `listeners.tcp.<name>.mountpoint`
   set to `some_tenant`, then the client actually subscribes to the topic
   `some_tenant/t`. Similarly, if another client B (connected to the same listener
   as the client A) sends a message to topic `t`, the message is routed
   to all the clients subscribed `some_tenant/t`, so client A will receive the
   message, with topic name `t`.<br/>
   Set to `""` to disable the feature.<br/>

   Variables in mountpoint string:
   - <code>${clientid}</code>: clientid
   - <code>${username}</code>: username

- zone: <code>atom()</code>
  * default: 
  `default`

  The configuration zone to which the listener belongs.

- limiter: <code>{$ratelimit's type -> emqx_limiter_schema:bucket_name()}</code>
  * default: 
  `{}`

  Type of the rate limit.

- access_rules: <code>[string()]</code>

  The access control rules for this listener.<br/>See: https://github.com/emqtt/esockd#allowdeny

- proxy_protocol: <code>boolean()</code>
  * default: 
  `false`

  Enable the Proxy Protocol V1/2 if the EMQX cluster is deployed
   behind HAProxy or Nginx.<br/>See: https://www.haproxy.com/blog/haproxy/proxy-protocol/

- proxy_protocol_timeout: <code>emqx_schema:duration()</code>

  Timeout for proxy protocol. EMQX will close the TCP connection if proxy protocol packet is not received within the timeout.

- authentication: <code>[[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)]</code>

  Per-listener authentication override
  Authentication can be one single authenticator instance or a chain of authenticators as an array.
  When authenticating a login (username, client ID, etc.) the authenticators are checked in the configured order.<br>



## node
Node name, cookie, config & data directories and the Erlang virtual machine (BEAM) boot parameters.


**Config paths**

 - <code>node</code>


**Env overrides**

 - <code>EMQX_NODE</code>



**Fields**

- name: <code>string()</code>
  * default: 
  `"emqx@127.0.0.1"`

  Unique name of the EMQX node. It must follow <code>%name%@FQDN</code> or
   <code>%name%@IPv4</code> format.

- cookie: <code>string()</code>
  * default: 
  `"emqxsecretcookie"`
  * mapping: 
  `vm_args.-setcookie`

  Secret cookie is a random string that should be the same on all nodes in
   the given EMQX cluster, but unique per EMQX cluster. It is used to prevent EMQX nodes that
   belong to different clusters from accidentally connecting to each other.

- data_dir: <code>string()</code>
  * mapping: 
  `emqx.data_dir`


  Path to the persistent data directory.
  Possible auto-created subdirectories are:
    - `mnesia/<node_name>`: EMQX's built-in database directory.
      For example, `mnesia/emqx@127.0.0.1`.
      There should be only one such subdirectory.
      Meaning, in case the node is to be renamed (to e.g. `emqx@10.0.1.1`),
      the old dir should be deleted first.
    - `configs`: Generated configs at boot time, and cluster/local override configs.
    - `patches`: Hot-patch beam files are to be placed here.
    - `trace`: Trace log files.

  **NOTE**: One data dir cannot be shared by two or more EMQX nodes.


- config_files: <code>[string()]</code>
  * mapping: 
  `emqx.config_files`

  List of configuration files that are read during startup. The order is
   significant: later configuration files override the previous ones.

- global_gc_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"15m"`
  * mapping: 
  `emqx_machine.global_gc_interval`

  Periodic garbage collection interval.

- crash_dump_file: <code>emqx_conf_schema:file()</code>
  * mapping: 
  `vm_args.-env ERL_CRASH_DUMP`

  Location of the crash dump file

- crash_dump_seconds: <code>emqx_schema:duration_s()</code>
  * default: 
  `"30s"`
  * mapping: 
  `vm_args.-env ERL_CRASH_DUMP_SECONDS`

  The number of seconds that the broker is allowed to spend writing
  a crash dump

- crash_dump_bytes: <code>emqx_schema:bytesize()</code>
  * default: 
  `"100MB"`
  * mapping: 
  `vm_args.-env ERL_CRASH_DUMP_BYTES`

  The maximum size of a crash dump file in bytes.

- dist_net_ticktime: <code>emqx_schema:duration()</code>
  * default: 
  `"2m"`
  * mapping: 
  `vm_args.-kernel net_ticktime`

  This is the approximate time an EMQX node may be unresponsive until it is considered down and thereby disconnected.

- backtrace_depth: <code>integer()</code>
  * default: 
  `23`
  * mapping: 
  `emqx_machine.backtrace_depth`

  Maximum depth of the call stack printed in error messages and
   <code>process_info</code>.

- applications: <code>emqx_schema:comma_separated_atoms()</code>
  * default: 
  `[]`
  * mapping: 
  `emqx_machine.applications`

  List of Erlang applications that shall be rebooted when the EMQX broker joins
   the cluster.

- etc_dir: <code>string()</code>

  <code>etc</code> dir for the node

- cluster_call: <code>[cluster_call](#cluster_call)</code>




## overload_protection
Overload protection mechanism monitors the load of the system and temporarily
disables some features (such as accepting new connections) when the load is high.


**Config paths**

 - <code>overload_protection</code>


**Env overrides**

 - <code>EMQX_OVERLOAD_PROTECTION</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  React on system overload or not

- backoff_delay: <code>0..inf</code>
  * default: 
  `1`

  Some unimportant tasks could be delayed for execution, here set the delays in ms

- backoff_gc: <code>boolean()</code>
  * default: 
  `false`

  Skip forceful GC if necessary

- backoff_hibernation: <code>boolean()</code>
  * default: 
  `true`

  Skip process hibernation if necessary

- backoff_new_conn: <code>boolean()</code>
  * default: 
  `true`

  Close new incoming connections if necessary


## persistent_session_store
Settings for message persistence.


**Config paths**

 - <code>persistent_session_store</code>


**Env overrides**

 - <code>EMQX_PERSISTENT_SESSION_STORE</code>



**Fields**

- enabled: <code>boolean()</code>
  * default: 
  `false`

  Use the database to store information about persistent sessions.
  This makes it possible to migrate a client connection to another
  cluster node if a node is stopped.


- storage_type: <code>ram | disc</code>
  * default: 
  `disc`

  Store information about persistent sessions on disc or in ram.
  If ram is chosen, all information about persistent sessions remains
  as long as at least one node in a cluster is alive to keep the information.
  If disc is chosen, the information is persisted on disc and will survive
  cluster restart, at the price of more disc usage and less throughput.


- max_retain_undelivered: <code>emqx_schema:duration()</code>
  * default: 
  `"1h"`

  The time messages that was not delivered to a persistent session
  is stored before being garbage collected if the node the previous
  session was handled on restarts of is stopped.


- message_gc_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"1h"`

  The starting interval for garbage collection of undelivered messages to
  a persistent session. This affects how often the "max_retain_undelivered"
  is checked for removal.


- session_message_gc_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"1m"`

  The starting interval for garbage collection of transient data for
  persistent session messages. This does not affect the lifetime length
  of persistent session messages.



## psk_authentication
PSK stands for 'Pre-Shared Keys'.
This config to enable TLS-PSK authentication.

<strong>Important!</strong> Make sure the SSL listener with
only <code>tlsv1.2</code> enabled, and also PSK cipher suites
configured, such as <code>RSA-PSK-AES256-GCM-SHA384</code>.
See listener SSL options config for more details.

The IDs and secrets can be provided from a file the path
to which is configurable by the <code>init_file</code> field.



**Config paths**

 - <code>psk_authentication</code>


**Env overrides**

 - <code>EMQX_PSK_AUTHENTICATION</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Whether to enable TLS PSK support

- init_file: <code>binary()</code>

  If init_file is specified, emqx will import PSKs from the file into the built-in database at startup for use by the runtime. The file has to be structured line-by-line, each line must be in the format of <code>PSKIdentity:SharedSecret</code>. For example: <code>mydevice1:c2VjcmV0</code>

- separator: <code>binary()</code>
  * default: 
  `":"`

  The separator between <code>PSKIdentity</code> and <code>SharedSecret</code> in the psk file

- chunk_size: <code>integer()</code>
  * default: 
  `50`

  The size of each chunk used to import to the built-in database from psk file


## rate_limit
Rate limit settings.


**Config paths**

 - <code>rate_limit</code>


**Env overrides**

 - <code>EMQX_RATE_LIMIT</code>



**Fields**

- max_conn_rate: <code>infinity | integer()</code>
  * default: 
  `1000`

  Maximum connections per second.

- conn_messages_in: <code>infinity | emqx_schema:comma_separated_list()</code>
  * default: 
  `infinity`

  Message limit for the external MQTT connections.

- conn_bytes_in: <code>infinity | emqx_schema:comma_separated_list()</code>
  * default: 
  `infinity`

  Limit the rate of receiving packets for a MQTT connection.
  The rate is counted by bytes of packets per second.


## replayq
Queue messages in disk files.


**Config paths**

 - <code>connectors.mqtt.$name.replayq</code>


**Env overrides**

 - <code>EMQX_CONNECTORS__MQTT__$NAME__REPLAYQ</code>



**Fields**

- dir: <code>boolean() | string()</code>


  The dir where the replayq file saved.<br/>
  Set to 'false' disables the replayq feature.


- seg_bytes: <code>emqx_schema:bytesize()</code>
  * default: 
  `"100MB"`


  The size in bytes of a single segment.<br/>
  A segment is mapping to a file in the replayq dir. If the current segment is full, a new segment
  (file) will be opened to write.


- offload: <code>boolean()</code>
  * default: 
  `false`


  In offload mode, the disk queue is only used to offload queue tail segments.<br/>
  The messages are cached in the memory first, then it writes to the replayq files after the size of
  the memory cache reaches 'seg_bytes'.



## rpc
EMQX uses a library called <code>gen_rpc</code> for inter-broker communication.<br/>Most of the time the default config should work, but in case you need to do performance fine-tuning or experiment a bit, this is where to look.


**Config paths**

 - <code>rpc</code>


**Env overrides**

 - <code>EMQX_RPC</code>



**Fields**

- mode: <code>sync | async</code>
  * default: 
  `async`

  In <code>sync</code> mode the sending side waits for the ack from the receiving side.

- driver: <code>tcp | ssl</code>
  * default: 
  `tcp`
  * mapping: 
  `gen_rpc.driver`

  Transport protocol used for inter-broker communication

- async_batch_size: <code>integer()</code>
  * default: 
  `256`
  * mapping: 
  `gen_rpc.max_batch_size`

  The maximum number of batch messages sent in asynchronous mode. Note that this configuration does not work in synchronous mode.

- port_discovery: <code>manual | stateless</code>
  * default: 
  `stateless`
  * mapping: 
  `gen_rpc.port_discovery`

  <code>manual</code>: discover ports by <code>tcp_server_port</code>.<br/><code>stateless</code>: discover ports in a stateless manner, using the following algorithm. If node name is <code>emqxN@127.0.0.1</code>, where the N is an integer, then the listening port will be 5370 + N.

- tcp_server_port: <code>integer()</code>
  * default: 
  `5369`
  * mapping: 
  `gen_rpc.tcp_server_port`

  Listening port used by RPC local service.<br/> Note that this config only takes effect when rpc.port_discovery is set to manual.

- ssl_server_port: <code>integer()</code>
  * default: 
  `5369`
  * mapping: 
  `gen_rpc.ssl_server_port`

  Listening port used by RPC local service.<br/> Note that this config only takes effect when rpc.port_discovery is set to manual and <code>driver</code> is set to <code>ssl</code>.

- tcp_client_num: <code>1..256</code>
  * default: 
  `1`

  Set the maximum number of RPC communication channels initiated by this node to each remote node.

- connect_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"5s"`
  * mapping: 
  `gen_rpc.connect_timeout`

  Timeout for establishing an RPC connection.

- certfile: <code>emqx_conf_schema:file()</code>
  * mapping: 
  `gen_rpc.certfile`

  Path to TLS certificate file used to validate identity of the cluster nodes. Note that this config only takes effect when <code>rpc.driver</code> is set to <code>ssl</code>.

- keyfile: <code>emqx_conf_schema:file()</code>
  * mapping: 
  `gen_rpc.keyfile`

  Path to the private key file for the <code>rpc.certfile</code>.<br/>Note: contents of this file are secret, so it's necessary to set permissions to 600.

- cacertfile: <code>emqx_conf_schema:file()</code>
  * mapping: 
  `gen_rpc.cacertfile`

  Path to certification authority TLS certificate file used to validate <code>rpc.certfile</code>.<br/>Note: certificates of all nodes in the cluster must be signed by the same CA.

- send_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"5s"`
  * mapping: 
  `gen_rpc.send_timeout`

  Timeout for sending the RPC request.

- authentication_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"5s"`
  * mapping: 
  `gen_rpc.authentication_timeout`

  Timeout for the remote node authentication.

- call_receive_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"15s"`
  * mapping: 
  `gen_rpc.call_receive_timeout`

  Timeout for the reply to a synchronous RPC.

- socket_keepalive_idle: <code>emqx_schema:duration_s()</code>
  * default: 
  `"7200s"`
  * mapping: 
  `gen_rpc.socket_keepalive_idle`

  How long the connections between the brokers should remain open after the last message is sent.

- socket_keepalive_interval: <code>emqx_schema:duration_s()</code>
  * default: 
  `"75s"`
  * mapping: 
  `gen_rpc.socket_keepalive_interval`

  The interval between keepalive messages.

- socket_keepalive_count: <code>integer()</code>
  * default: 
  `9`
  * mapping: 
  `gen_rpc.socket_keepalive_count`

  How many times the keepalive probe message can fail to receive a reply until the RPC connection is considered lost.

- socket_sndbuf: <code>emqx_schema:bytesize()</code>
  * default: 
  `"1MB"`
  * mapping: 
  `gen_rpc.socket_sndbuf`

  TCP tuning parameters. TCP sending buffer size.

- socket_recbuf: <code>emqx_schema:bytesize()</code>
  * default: 
  `"1MB"`
  * mapping: 
  `gen_rpc.socket_recbuf`

  TCP tuning parameters. TCP receiving buffer size.

- socket_buffer: <code>emqx_schema:bytesize()</code>
  * default: 
  `"1MB"`
  * mapping: 
  `gen_rpc.socket_buffer`

  TCP tuning parameters. Socket buffer size in user mode.


## stats
Enable/disable statistic data collection.
Statistic data such as message receive/send count/rate etc. It provides insights of system performance and helps to diagnose issues. You can find statistic data from the dashboard, or from the '/stats' API.


**Config paths**

 - <code>stats</code>


**Env overrides**

 - <code>EMQX_STATS</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable/disable statistic data collection.


## sys_topics
The EMQX Broker periodically publishes its own status, message statistics,
client online and offline events to the system topic starting with `$SYS/`.

The following options control the behavior of `$SYS` topics.


**Config paths**

 - <code>sys_topics</code>


**Env overrides**

 - <code>EMQX_SYS_TOPICS</code>



**Fields**

- sys_msg_interval: <code>disabled | emqx_schema:duration()</code>
  * default: 
  `"1m"`

  Time interval of publishing `$SYS` messages.

- sys_heartbeat_interval: <code>disabled | emqx_schema:duration()</code>
  * default: 
  `"30s"`

  Time interval for publishing following heartbeat messages:<br/> - `$SYS/brokers/<node>/uptime`
   - `$SYS/brokers/<node>/datetime`

- sys_event_messages: <code>[event_names](#event_names)</code>




## sysmon
Features related to system monitoring and introspection.


**Config paths**

 - <code>sysmon</code>


**Env overrides**

 - <code>EMQX_SYSMON</code>



**Fields**

- vm: <code>[sysmon_vm](#sysmon_vm)</code>



- os: <code>[sysmon_os](#sysmon_os)</code>



- top: <code>[sysmon_top](#sysmon_top)</code>




## sysmon_os
This part of the configuration is responsible for monitoring
 the host OS health, such as free memory, disk space, CPU load, etc.


**Config paths**

 - <code>sysmon.os</code>


**Env overrides**

 - <code>EMQX_SYSMON__OS</code>



**Fields**

- cpu_check_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"60s"`

  The time interval for the periodic CPU check.

- cpu_high_watermark: <code>emqx_schema:percent()</code>
  * default: 
  `"80%"`

  The threshold, as percentage of system CPU load,
   for how much system cpu can be used before the corresponding alarm is raised.

- cpu_low_watermark: <code>emqx_schema:percent()</code>
  * default: 
  `"60%"`

  The threshold, as percentage of system CPU load,
   for how much system cpu can be used before the corresponding alarm is cleared.

- mem_check_interval: <code>disabled | emqx_schema:duration()</code>
  * default: 
  `"60s"`

  The time interval for the periodic memory check.

- sysmem_high_watermark: <code>emqx_schema:percent()</code>
  * default: 
  `"70%"`

  The threshold, as percentage of system memory,
   for how much system memory can be allocated before the corresponding alarm is raised.

- procmem_high_watermark: <code>emqx_schema:percent()</code>
  * default: 
  `"5%"`

  The threshold, as percentage of system memory,
   for how much system memory can be allocated by one Erlang process before
   the corresponding alarm is raised.


## sysmon_top
This part of the configuration is responsible for monitoring
 the Erlang processes in the VM. This information can be sent to an external
 PostgreSQL database. This feature is inactive unless the PostgreSQL sink is configured.


**Config paths**

 - <code>sysmon.top</code>


**Env overrides**

 - <code>EMQX_SYSMON__TOP</code>



**Fields**

- num_items: <code>non_neg_integer()</code>
  * default: 
  `10`
  * mapping: 
  `system_monitor.top_num_items`

  The number of top processes per monitoring group

- sample_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"2s"`
  * mapping: 
  `system_monitor.top_sample_interval`

  Specifies how often process top should be collected

- max_procs: <code>non_neg_integer()</code>
  * default: 
  `1000000`
  * mapping: 
  `system_monitor.top_max_procs`

  Stop collecting data when the number of processes
  in the VM exceeds this value

- db_hostname: <code>string()</code>
  * default: 
  `[]`
  * mapping: 
  `system_monitor.db_hostname`

  Hostname of the PostgreSQL database that collects the data points

- db_port: <code>integer()</code>
  * default: 
  `5432`
  * mapping: 
  `system_monitor.db_port`

  Port of the PostgreSQL database that collects the data points

- db_username: <code>string()</code>
  * default: 
  `"system_monitor"`
  * mapping: 
  `system_monitor.db_username`

  EMQX username in the PostgreSQL database

- db_password: <code>binary()</code>
  * default: 
  `"system_monitor_password"`
  * mapping: 
  `system_monitor.db_password`

  EMQX user password in the PostgreSQL database

- db_name: <code>string()</code>
  * default: 
  `"postgres"`
  * mapping: 
  `system_monitor.db_name`

  PostgreSQL database name


## sysmon_vm
This part of the configuration is responsible for collecting
 BEAM VM events, such as long garbage collection, traffic congestion in the inter-broker
 communication, etc.


**Config paths**

 - <code>sysmon.vm</code>


**Env overrides**

 - <code>EMQX_SYSMON__VM</code>



**Fields**

- process_check_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"30s"`

  The time interval for the periodic process limit check.

- process_high_watermark: <code>emqx_schema:percent()</code>
  * default: 
  `"80%"`

  The threshold, as percentage of processes, for how many
   processes can simultaneously exist at the local node before the corresponding
   alarm is raised.

- process_low_watermark: <code>emqx_schema:percent()</code>
  * default: 
  `"60%"`

  The threshold, as percentage of processes, for how many
   processes can simultaneously exist at the local node before the corresponding
   alarm is cleared.

- long_gc: <code>disabled | emqx_schema:duration()</code>

  Enable Long GC monitoring.<br/>
  Notice: don't enable the monitor in production, because it adds overhead to
   garbage collection.

- long_schedule: <code>disabled | emqx_schema:duration()</code>
  * default: 
  `"240ms"`

  Enable Long Schedule monitoring.

- large_heap: <code>disabled | emqx_schema:bytesize()</code>
  * default: 
  `"32MB"`

  Enable Large Heap monitoring.

- busy_dist_port: <code>boolean()</code>
  * default: 
  `true`

  Enable Busy Distribution Port monitoring.

- busy_port: <code>boolean()</code>
  * default: 
  `true`

  Enable Busy Port monitoring.


## tcp_opts
TCP listener options.


**Config paths**

 - <code>gateway.exproto.listeners.ssl.$name.tcp</code>
 - <code>gateway.exproto.listeners.tcp.$name.tcp</code>
 - <code>gateway.stomp.listeners.ssl.$name.tcp</code>
 - <code>gateway.stomp.listeners.tcp.$name.tcp</code>
 - <code>listeners.ssl.$name.tcp</code>
 - <code>listeners.tcp.$name.tcp</code>
 - <code>listeners.ws.$name.tcp</code>
 - <code>listeners.wss.$name.tcp</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__TCP</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__TCP</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__TCP</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__TCP</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__TCP</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__TCP</code>
 - <code>EMQX_LISTENERS__WS__$NAME__TCP</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__TCP</code>



**Fields**

- active_n: <code>integer()</code>
  * default: 
  `100`

  Specify the {active, N} option for this Socket.<br/>
   See: https://erlang.org/doc/man/inet.html#setopts-2

- backlog: <code>integer()</code>
  * default: 
  `1024`

  TCP backlog defines the maximum length that the queue of
   pending connections can grow to.

- send_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"15s"`

  The TCP send timeout for the connections.

- send_timeout_close: <code>boolean()</code>
  * default: 
  `true`

  Close the connection if send timeout.

- recbuf: <code>emqx_schema:bytesize()</code>

  The TCP receive buffer (OS kernel) for the connections.

- sndbuf: <code>emqx_schema:bytesize()</code>

  The TCP send buffer (OS kernel) for the connections.

- buffer: <code>emqx_schema:bytesize()</code>

  The size of the user-space buffer used by the driver.

- high_watermark: <code>emqx_schema:bytesize()</code>
  * default: 
  `"1MB"`

  The socket is set to a busy state when the amount of data queued internally
    by the VM socket implementation reaches this limit.

- nodelay: <code>boolean()</code>
  * default: 
  `false`

  The TCP_NODELAY flag for the connections.

- reuseaddr: <code>boolean()</code>
  * default: 
  `true`

  The SO_REUSEADDR flag for the connections.


## trace
Real-time filtering logs for the ClientID or Topic or IP for debugging.


**Config paths**

 - <code>trace</code>


**Env overrides**

 - <code>EMQX_TRACE</code>



**Fields**

- payload_encode: <code>hex | text | hidden</code>
  * default: 
  `text`

  Determine the format of the payload format in the trace file.<br>
  `text`: Text-based protocol or plain text protocol.
   It is recommended when payload is JSON encoded.<br>
  `hex`: Binary hexadecimal encode. It is recommended when payload is a custom binary protocol.<br>
  `hidden`: payload is obfuscated as `******`



## ws_opts
WebSocket listener options.


**Config paths**

 - <code>listeners.ws.$name.websocket</code>
 - <code>listeners.wss.$name.websocket</code>


**Env overrides**

 - <code>EMQX_LISTENERS__WS__$NAME__WEBSOCKET</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__WEBSOCKET</code>



**Fields**

- mqtt_path: <code>string()</code>
  * default: 
  `"/mqtt"`

  WebSocket's MQTT protocol path. So the address of
   EMQX Broker's WebSocket is: <code>ws://{ip}:{port}/mqtt</code>

- mqtt_piggyback: <code>single | multiple</code>
  * default: 
  `multiple`

  Whether a WebSocket message is allowed to contain multiple MQTT packets.

- compress: <code>boolean()</code>
  * default: 
  `false`

  If <code>true</code>, compress WebSocket messages using <code>zlib</code>.<br/>
  The configuration items under <code>deflate_opts</code> belong to the compression-related parameter configuration.

- idle_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"15s"`

  Close transport-layer connections from the clients that have not sent MQTT CONNECT
  message within this interval.

- max_frame_size: <code>infinity | integer()</code>
  * default: 
  `infinity`

  The maximum length of a single MQTT packet.

- fail_if_no_subprotocol: <code>boolean()</code>
  * default: 
  `true`

  If <code>true</code>, the server will return an error when
   the client does not carry the <code>Sec-WebSocket-Protocol</code> field.
   <br/>Note: WeChat applet needs to disable this verification.

- supported_subprotocols: <code>emqx_schema:comma_separated_list()</code>
  * default: 
  `"mqtt, mqtt-v3, mqtt-v3.1.1, mqtt-v5"`

  Comma-separated list of supported subprotocols.

- check_origin_enable: <code>boolean()</code>
  * default: 
  `false`

  If <code>true</code>, <code>origin</code> HTTP header will be
   validated against the list of allowed origins configured in <code>check_origins</code>
   parameter.

- allow_origin_absence: <code>boolean()</code>
  * default: 
  `true`

  If <code>false</code> and <code>check_origin_enable</code> is
   <code>true</code>, the server will reject requests that don't have <code>origin</code>
   HTTP header.

- check_origins: <code>[binary()]</code>
  * default: 
  `[]`

  List of allowed origins.<br/>See <code>check_origin_enable</code>.

- proxy_address_header: <code>string()</code>
  * default: 
  `"x-forwarded-for"`

  HTTP header used to pass information about the client IP address.
   Relevant when the EMQX cluster is deployed behind a load-balancer.

- proxy_port_header: <code>string()</code>
  * default: 
  `"x-forwarded-port"`

  HTTP header used to pass information about the client port.
   Relevant when the EMQX cluster is deployed behind a load-balancer.

- deflate_opts: <code>[deflate_opts](#deflate_opts)</code>




## zone
A `Zone` defines a set of configuration items (such as the maximum number of connections) that can be shared between multiple listeners.

`Listener` can refer to a `Zone` through the configuration item <code>listener.<Protocol>.<Listener Name>.zone</code>.

The configs defined in the zones will override the global configs with the same key.

For example, given the following config:
```
a {
    b: 1, c: 1
}
zone.my_zone {
  a {
    b:2
  }
}
```

The global config `a` is overridden by the configs `a` inside the zone `my_zone`.

If there is a listener using the zone `my_zone`, the value of config `a` will be: `{b:2, c: 1}`.
Note that although the default value of `a.c` is `0`, the global value is used, i.e. configs in the zone have no default values. To override `a.c` one must configure it explicitly in the zone.

All the global configs that can be overridden in zones are:
 - `stats.*`
 - `mqtt.*`
 - `authorization.*`
 - `flapping_detect.*`
 - `force_shutdown.*`
 - `conn_congestion.*`
 - `force_gc.*`




**Config paths**

 - <code>zones.$name</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME</code>



**Fields**

- mqtt: <code>[zone:mqtt](#zone-mqtt)</code>



- stats: <code>[zone:stats](#zone-stats)</code>



- flapping_detect: <code>[zone:flapping_detect](#zone-flapping_detect)</code>



- force_shutdown: <code>[zone:force_shutdown](#zone-force_shutdown)</code>



- conn_congestion: <code>[zone:conn_congestion](#zone-conn_congestion)</code>



- force_gc: <code>[zone:force_gc](#zone-force_gc)</code>



- overload_protection: <code>[zone:overload_protection](#zone-overload_protection)</code>




## zone:conn_congestion
Settings for `conn_congestion` alarm.

Sometimes the MQTT connection (usually an MQTT subscriber) may
get "congested", because there are too many packets to be sent.
The socket tries to buffer the packets until the buffer is
full. If more packets arrive after that, the packets will be
"pending" in the queue and we consider the connection
congested.

Note: `sndbuf` can be set to larger value if the
alarm is triggered too often.
The name of the alarm is of format `conn_congestion/<ClientID>/<Username>`,
where the `<ClientID>` is the client ID of the congested MQTT connection,
and `<Username>` is the username or `unknown_user`.


**Config paths**

 - <code>zones.$name.conn_congestion</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__CONN_CONGESTION</code>



**Fields**

- enable_alarm: <code>boolean()</code>

  Enable or disable connection congestion alarm.

- min_alarm_sustain_duration: <code>emqx_schema:duration()</code>

  Minimal time before clearing the alarm.

  The alarm is cleared only when there's no pending data in
  the queue, and at least `min_alarm_sustain_duration`
  milliseconds passed since the last time we considered the connection "congested".

  This is to avoid clearing and raising the alarm again too often.


## zone:flapping_detect
This config controls the allowed maximum number of `CONNECT` packets received
from the same clientid in a time frame defined by `window_time`.
After the limit is reached, successive `CONNECT` requests are forbidden
(banned) until the end of the time period defined by `ban_time`.


**Config paths**

 - <code>zones.$name.flapping_detect</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__FLAPPING_DETECT</code>



**Fields**

- enable: <code>boolean()</code>

  Enable flapping connection detection feature.

- max_count: <code>integer()</code>

  The maximum number of disconnects allowed for a MQTT Client in `window_time`

- window_time: <code>emqx_schema:duration()</code>

  The time window for flapping detection.

- ban_time: <code>emqx_schema:duration()</code>

  How long the flapping clientid will be banned.


## zone:force_gc
Force garbage collection in MQTT connection process after
 they process certain number of messages or bytes of data.


**Config paths**

 - <code>zones.$name.force_gc</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__FORCE_GC</code>



**Fields**

- enable: <code>boolean()</code>

  Enable forced garbage collection.

- count: <code>0..inf</code>

  GC the process after this many received messages.

- bytes: <code>emqx_schema:bytesize()</code>

  GC the process after specified number of bytes have passed through.


## zone:force_shutdown
When the process message queue length, or the memory bytes
reaches a certain value, the process is forced to close.

Note: "message queue" here refers to the "message mailbox"
of the Erlang process, not the `mqueue` of QoS 1 and QoS 2.


**Config paths**

 - <code>zones.$name.force_shutdown</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__FORCE_SHUTDOWN</code>



**Fields**

- enable: <code>boolean()</code>

  Enable `force_shutdown` feature.

- max_message_queue_len: <code>0..inf</code>

  Maximum message queue length.

- max_heap_size: <code>emqx_schema:wordsize()</code>

  Total heap size


## zone:mqtt
Global MQTT configuration.<br>
The configs here work as default values which can be overridden
in <code>zone</code> configs


**Config paths**

 - <code>zones.$name.mqtt</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__MQTT</code>



**Fields**

- idle_timeout: <code>infinity | emqx_schema:duration()</code>

  Close TCP connections from the clients that have not sent MQTT CONNECT
  message within this interval.

- max_packet_size: <code>emqx_schema:bytesize()</code>

  Maximum MQTT packet size allowed.

- max_clientid_len: <code>23..65535</code>

  Maximum allowed length of MQTT clientId.

- max_topic_levels: <code>1..65535</code>

  Maximum topic levels allowed.

- max_qos_allowed: <code>qos()</code>

  Maximum QoS allowed.

- max_topic_alias: <code>0..65535</code>

  Maximum Topic Alias, 0 means no topic alias supported.

- retain_available: <code>boolean()</code>

  Support MQTT retained messages.

- wildcard_subscription: <code>boolean()</code>

  Support MQTT Wildcard Subscriptions.

- shared_subscription: <code>boolean()</code>

  Support MQTT Shared Subscriptions.

- ignore_loop_deliver: <code>boolean()</code>

  Ignore loop delivery of messages for MQTT v3.1.1.

- strict_mode: <code>boolean()</code>

  Parse MQTT messages in strict mode. When set to true, invalid utf8 strings in for example client ID, topic name, etc. will cause the client to be disconnected

- response_information: <code>string()</code>

  Specify the response information returned to the client
  This feature is disabled if is set to "".

- server_keepalive: <code>integer() | disabled</code>

  'Server Keep Alive' of MQTT 5.0.
  If the server returns a 'Server Keep Alive' in the CONNACK packet,
  the client MUST use that value instead of the value it sent as the 'Keep Alive'.

- keepalive_backoff: <code>float()</code>

  The backoff for MQTT keepalive timeout. The broker will close the connection
  after idling for 'Keepalive * backoff * 2'.

- max_subscriptions: <code>1..inf | infinity</code>

  Maximum number of subscriptions allowed.

- upgrade_qos: <code>boolean()</code>

  Force upgrade of QoS level according to subscription.

- max_inflight: <code>1..65535</code>

  Maximum size of the Inflight Window storing QoS1/2 messages delivered but un-acked.

- retry_interval: <code>emqx_schema:duration()</code>

  Retry interval for QoS1/2 message delivering.

- max_awaiting_rel: <code>integer() | infinity</code>

  Maximum QoS2 packets (Client -> Broker) awaiting PUBREL.

- await_rel_timeout: <code>emqx_schema:duration()</code>

  The QoS2 messages (Client -> Broker) will be dropped if awaiting PUBREL timeout.

- session_expiry_interval: <code>emqx_schema:duration()</code>

  Default session expiry interval for MQTT V3.1.1 connections.

- max_mqueue_len: <code>non_neg_integer() | infinity</code>

  Maximum queue length. Enqueued messages when persistent client disconnected,
  or inflight window is full.

- mqueue_priorities: <code>map() | disabled</code>

  Topic priorities.<br>
  There's no priority table by default, hence all messages are treated equal.<br>
  Priority number [1-255]<br>

  **NOTE**: Comma and equal signs are not allowed for priority topic names.<br>
  **NOTE**: Messages for topics not in the priority table are treated as
  either highest or lowest priority depending on the configured value for
  <code>mqtt.mqueue_default_priority</code>.
  <br><br>
  **Examples**:
  To configure <code>"topic/1" > "topic/2"</code>:<br/>
  <code>mqueue_priorities: {"topic/1": 10, "topic/2": 8}</code>

- mqueue_default_priority: <code>highest | lowest</code>

  Default to the highest priority for topics not matching priority table.

- mqueue_store_qos0: <code>boolean()</code>

  Support enqueue QoS0 messages.

- use_username_as_clientid: <code>boolean()</code>

  Replace client ID with the username.

- peer_cert_as_username: <code>disabled | cn | dn | crt | pem | md5</code>

  Use the CN, DN or CRT field from the client certificate as a username.
  Only works for the TLS connection.

- peer_cert_as_clientid: <code>disabled | cn | dn | crt | pem | md5</code>

  Use the CN, DN or CRT field from the client certificate as a clientid.
  Only works for the TLS connection.


## zone:overload_protection
Overload protection mechanism monitors the load of the system and temporarily
disables some features (such as accepting new connections) when the load is high.


**Config paths**

 - <code>zones.$name.overload_protection</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__OVERLOAD_PROTECTION</code>



**Fields**

- enable: <code>boolean()</code>

  React on system overload or not

- backoff_delay: <code>0..inf</code>

  Some unimportant tasks could be delayed for execution, here set the delays in ms

- backoff_gc: <code>boolean()</code>

  Skip forceful GC if necessary

- backoff_hibernation: <code>boolean()</code>

  Skip process hibernation if necessary

- backoff_new_conn: <code>boolean()</code>

  Close new incoming connections if necessary


## zone:stats
Enable/disable statistic data collection.
Statistic data such as message receive/send count/rate etc. It provides insights of system performance and helps to diagnose issues. You can find statistic data from the dashboard, or from the '/stats' API.


**Config paths**

 - <code>zones.$name.stats</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__STATS</code>



**Fields**

- enable: <code>boolean()</code>

  Enable/disable statistic data collection.


## authn-builtin_db:authentication
Configuration for authentication using the built-in database.


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- mechanism: <code>password_based</code>

  Authentication mechanism.

- backend: <code>built_in_database</code>

  Backend type.

- user_id_type: <code>emqx_authn_mnesia:user_id_type()</code>
  * default: 
  `"username"`

  Authenticate by client ID or username.

- password_hash_algorithm: <code>[authn-hash:bcrypt_rw](#authn-hash-bcrypt_rw) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>
  * default: 
  `{name = sha256, salt_position = prefix}`

  Options for password hash creation and verification.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider


## authn-hash:bcrypt
Settings for bcrypt password hashing algorithm.


**Config paths**

 - <code>authentication.$INDEX.password_hash_algorithm</code>
 - <code>gateway.coap.authentication.password_hash_algorithm</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.coap.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.lwm2m.authentication.password_hash_algorithm</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.mqttsn.authentication.password_hash_algorithm</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.stomp.authentication.password_hash_algorithm</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication.password_hash_algorithm</code>
 - <code>listeners.ssl.$name.authentication.$INDEX.password_hash_algorithm</code>
 - <code>listeners.tcp.$name.authentication.$INDEX.password_hash_algorithm</code>
 - <code>listeners.ws.$name.authentication.$INDEX.password_hash_algorithm</code>
 - <code>listeners.wss.$name.authentication.$INDEX.password_hash_algorithm</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>



**Fields**

- name: <code>bcrypt</code>

  BCRYPT password hashing.


## authn-hash:bcrypt_rw
Settings for bcrypt password hashing algorithm (for DB backends with write capability).


**Config paths**

 - <code>authentication.$INDEX.password_hash_algorithm</code>
 - <code>gateway.coap.authentication.password_hash_algorithm</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.coap.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.lwm2m.authentication.password_hash_algorithm</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.mqttsn.authentication.password_hash_algorithm</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.stomp.authentication.password_hash_algorithm</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication.password_hash_algorithm</code>
 - <code>listeners.ssl.$name.authentication.$INDEX.password_hash_algorithm</code>
 - <code>listeners.tcp.$name.authentication.$INDEX.password_hash_algorithm</code>
 - <code>listeners.ws.$name.authentication.$INDEX.password_hash_algorithm</code>
 - <code>listeners.wss.$name.authentication.$INDEX.password_hash_algorithm</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>



**Fields**

- name: <code>bcrypt</code>

  BCRYPT password hashing.

- salt_rounds: <code>integer()</code>
  * default: 
  `10`

  Salt rounds for BCRYPT password generation.


## authn-hash:other_algorithms
Settings for other password hashing algorithms.


**Config paths**

 - <code>authentication.$INDEX.password_hash_algorithm</code>
 - <code>gateway.coap.authentication.password_hash_algorithm</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.coap.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.lwm2m.authentication.password_hash_algorithm</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.mqttsn.authentication.password_hash_algorithm</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.stomp.authentication.password_hash_algorithm</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication.password_hash_algorithm</code>
 - <code>listeners.ssl.$name.authentication.$INDEX.password_hash_algorithm</code>
 - <code>listeners.tcp.$name.authentication.$INDEX.password_hash_algorithm</code>
 - <code>listeners.ws.$name.authentication.$INDEX.password_hash_algorithm</code>
 - <code>listeners.wss.$name.authentication.$INDEX.password_hash_algorithm</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>



**Fields**

- name: <code>plain | md5 | sha | sha256 | sha512</code>

  Simple password hashing algorithm.

- salt_position: <code>prefix | suffix</code>
  * default: 
  `prefix`

  Salt position for PLAIN, MD5, SHA, SHA256 and SHA512 algorithms.


## authn-hash:pbkdf2
Settings for PBKDF2 password hashing algorithm.


**Config paths**

 - <code>authentication.$INDEX.password_hash_algorithm</code>
 - <code>gateway.coap.authentication.password_hash_algorithm</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.coap.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.lwm2m.authentication.password_hash_algorithm</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.mqttsn.authentication.password_hash_algorithm</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.stomp.authentication.password_hash_algorithm</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication.password_hash_algorithm</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication.password_hash_algorithm</code>
 - <code>listeners.ssl.$name.authentication.$INDEX.password_hash_algorithm</code>
 - <code>listeners.tcp.$name.authentication.$INDEX.password_hash_algorithm</code>
 - <code>listeners.ws.$name.authentication.$INDEX.password_hash_algorithm</code>
 - <code>listeners.wss.$name.authentication.$INDEX.password_hash_algorithm</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX__PASSWORD_HASH_ALGORITHM</code>



**Fields**

- name: <code>pbkdf2</code>

  PBKDF2 password hashing.

- mac_fun: <code>md4 | md5 | ripemd160 | sha | sha224 | sha256 | sha384 | sha512</code>

  Specifies mac_fun for PBKDF2 hashing algorithm.

- iterations: <code>integer()</code>

  Iteration count for PBKDF2 hashing algorithm.

- dk_length: <code>integer()</code>

  Derived length for PBKDF2 hashing algorithm. If not specified, calculated automatically based on `mac_fun`.


## authn-http:get
Settings for HTTP-based authentication (GET).


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- method: <code>get</code>
  * default: 
  `post`

  HTTP method.

- headers: <code>map()</code>
  * default: 

  ```
  {
    accept = "application/json"
    "cache-control" = "no-cache"
    connection = "keep-alive"
    "keep-alive" = "timeout=30, max=1000"
  }
  ```

  List of HTTP headers.

- mechanism: <code>password_based</code>

  Authentication mechanism.

- backend: <code>http</code>

  Backend type.

- url: <code>binary()</code>

  URL of the auth server.

- body: <code>#{term() => binary()}</code>

  Body of the HTTP request.

- request_timeout: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"5s"`

  HTTP request timeout

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider

- connect_timeout: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"15s"`

  The timeout when connecting to the HTTP server.

- enable_pipelining: <code>boolean()</code>
  * default: 
  `true`

  Enable the HTTP pipeline.

- max_retries: <code>non_neg_integer()</code>
  * default: 
  `5`

  Max retry times if error on sending request.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  The pool size.

- request: <code>[connector-http:request](#connector-http-request)</code>


  If the request is provided, the caller can send HTTP requests via
  <code>emqx_resource:query(ResourceId, {send_message, BridgeId, Message})</code>


- retry_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"1s"`

  Interval between retries.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authn-http:post
Settings for HTTP-based authentication (POST).


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- method: <code>post</code>
  * default: 
  `post`

  HTTP method.

- headers: <code>map()</code>
  * default: 

  ```
  {
    accept = "application/json"
    "cache-control" = "no-cache"
    connection = "keep-alive"
    "content-type" = "application/json"
    "keep-alive" = "timeout=30, max=1000"
  }
  ```

  List of HTTP headers.

- mechanism: <code>password_based</code>

  Authentication mechanism.

- backend: <code>http</code>

  Backend type.

- url: <code>binary()</code>

  URL of the auth server.

- body: <code>#{term() => binary()}</code>

  Body of the HTTP request.

- request_timeout: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"5s"`

  HTTP request timeout

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider

- connect_timeout: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"15s"`

  The timeout when connecting to the HTTP server.

- enable_pipelining: <code>boolean()</code>
  * default: 
  `true`

  Enable the HTTP pipeline.

- max_retries: <code>non_neg_integer()</code>
  * default: 
  `5`

  Max retry times if error on sending request.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  The pool size.

- request: <code>[connector-http:request](#connector-http-request)</code>


  If the request is provided, the caller can send HTTP requests via
  <code>emqx_resource:query(ResourceId, {send_message, BridgeId, Message})</code>


- retry_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"1s"`

  Interval between retries.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authn-jwt:hmac-based
Settings for HMAC-based token signing algorithm.


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- use_jwks: <code>false</code>



- algorithm: <code>hmac-based</code>

  Signing algorithm.

- secret: <code>binary()</code>

  The key to verify the JWT Token using HMAC algorithm.

- secret_base64_encoded: <code>boolean()</code>
  * default: 
  `false`

  Enable/disable base64 encoding of the secret.

- mechanism: <code>jwt</code>

  Authentication mechanism.

- verify_claims: <code>[term()]</code>
  * default: 
  `{}`

  The list of claims to verify.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider


## authn-jwt:jwks
Settings for a signing using JSON Web Key Set (JWKs).


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- use_jwks: <code>true</code>



- endpoint: <code>string()</code>

  JWKs endpoint.

- refresh_interval: <code>integer()</code>
  * default: 
  `300`

  JWKs refresh interval

- ssl: <code>[authn-jwt:ssl_enable](#authn-jwt-ssl_enable) | [authn-jwt:ssl_disable](#authn-jwt-ssl_disable)</code>
  * default: 
  `{enable = false}`

  Enable/disable SSL.

- mechanism: <code>jwt</code>

  Authentication mechanism.

- verify_claims: <code>[term()]</code>
  * default: 
  `{}`

  The list of claims to verify.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider


## authn-jwt:public-key
Settings for public key-based token signing algorithm.


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- use_jwks: <code>false</code>



- algorithm: <code>public-key</code>

  Signing algorithm.

- certificate: <code>string()</code>

  The certificate used for signing the token.

- mechanism: <code>jwt</code>

  Authentication mechanism.

- verify_claims: <code>[term()]</code>
  * default: 
  `{}`

  The list of claims to verify.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider


## authn-jwt:ssl_disable



**Config paths**

 - <code>authentication.$INDEX.ssl</code>
 - <code>gateway.coap.authentication.ssl</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication.ssl</code>
 - <code>gateway.coap.listeners.udp.$name.authentication.ssl</code>
 - <code>gateway.exproto.authentication.ssl</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication.ssl</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication.ssl</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication.ssl</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication.ssl</code>
 - <code>gateway.lwm2m.authentication.ssl</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication.ssl</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication.ssl</code>
 - <code>gateway.mqttsn.authentication.ssl</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication.ssl</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication.ssl</code>
 - <code>gateway.stomp.authentication.ssl</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication.ssl</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication.ssl</code>
 - <code>listeners.ssl.$name.authentication.$INDEX.ssl</code>
 - <code>listeners.tcp.$name.authentication.$INDEX.ssl</code>
 - <code>listeners.ws.$name.authentication.$INDEX.ssl</code>
 - <code>listeners.wss.$name.authentication.$INDEX.ssl</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX__SSL</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX__SSL</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX__SSL</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX__SSL</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX__SSL</code>



**Fields**

- enable: <code>false</code>




## authn-jwt:ssl_enable
SSL configuration.


**Config paths**

 - <code>authentication.$INDEX.ssl</code>
 - <code>gateway.coap.authentication.ssl</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication.ssl</code>
 - <code>gateway.coap.listeners.udp.$name.authentication.ssl</code>
 - <code>gateway.exproto.authentication.ssl</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication.ssl</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication.ssl</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication.ssl</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication.ssl</code>
 - <code>gateway.lwm2m.authentication.ssl</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication.ssl</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication.ssl</code>
 - <code>gateway.mqttsn.authentication.ssl</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication.ssl</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication.ssl</code>
 - <code>gateway.stomp.authentication.ssl</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication.ssl</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication.ssl</code>
 - <code>listeners.ssl.$name.authentication.$INDEX.ssl</code>
 - <code>listeners.tcp.$name.authentication.$INDEX.ssl</code>
 - <code>listeners.ws.$name.authentication.$INDEX.ssl</code>
 - <code>listeners.wss.$name.authentication.$INDEX.ssl</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX__SSL</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION__SSL</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX__SSL</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX__SSL</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX__SSL</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX__SSL</code>



**Fields**

- enable: <code>true</code>



- cacertfile: <code>string()</code>

  Path to the SSL CA certificate file.

- certfile: <code>string()</code>

  Path to the SSL certificate file.

- keyfile: <code>string()</code>

  Path to the SSL secret key file.

- verify: <code>verify_peer | verify_none</code>
  * default: 
  `verify_none`

  Enable or disable SSL peer verification.

- server_name_indication: <code>string()</code>

  SSL SNI (Server Name Indication)


## authn-mongodb:replica-set
Configuration for a replica set.


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- mechanism: <code>password_based</code>

  Authentication mechanism.

- backend: <code>mongodb</code>

  Backend type.

- collection: <code>binary()</code>

  Collection used to store authentication data.

- selector: <code>map()</code>

  Statement that is executed during the authentication process. Commands can support following wildcards:
   - `${username}`: substituted with client's username
   - `${clientid}`: substituted with the clientid

- password_hash_field: <code>binary()</code>

  Document field that contains password hash.

- salt_field: <code>binary()</code>

  Document field that contains the password salt.

- is_superuser_field: <code>binary()</code>

  Document field that defines if the user has superuser privileges.

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>
  * default: 
  `{name = sha256, salt_position = prefix}`

  Options for password hash verification.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider

- mongo_type: <code>rs</code>
  * default: 
  `rs`

  Replica set.

- servers: <code>[term()]</code>

  A Node list for Cluster to connect to. The nodes should be separated with commas, such as: `Node[,Node].<br/>`
  For each Node should be: 
  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The MongoDB default port 27017 is used if `[:Port]` is not specified.

- w_mode: <code>unsafe | safe</code>
  * default: 
  `unsafe`

  Write mode.

- r_mode: <code>master | slave_ok</code>
  * default: 
  `master`

  Read mode.

- replica_set_name: <code>binary()</code>

  Name of the replica set.

- srv_record: <code>boolean()</code>
  * default: 
  `false`

  Use DNS SRV record.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- username: <code>binary()</code>

  EMQX's username in the external database.

- password: <code>binary()</code>

  EMQX's password in the external database.

- auth_source: <code>binary()</code>

  Database name associated with the user's credentials.

- database: <code>binary()</code>

  Database name.

- topology: <code>[topology](#topology)</code>



- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authn-mongodb:sharded-cluster
Configuration for a sharded cluster.


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- mechanism: <code>password_based</code>

  Authentication mechanism.

- backend: <code>mongodb</code>

  Backend type.

- collection: <code>binary()</code>

  Collection used to store authentication data.

- selector: <code>map()</code>

  Statement that is executed during the authentication process. Commands can support following wildcards:
   - `${username}`: substituted with client's username
   - `${clientid}`: substituted with the clientid

- password_hash_field: <code>binary()</code>

  Document field that contains password hash.

- salt_field: <code>binary()</code>

  Document field that contains the password salt.

- is_superuser_field: <code>binary()</code>

  Document field that defines if the user has superuser privileges.

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>
  * default: 
  `{name = sha256, salt_position = prefix}`

  Options for password hash verification.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider

- mongo_type: <code>sharded</code>
  * default: 
  `sharded`

  Sharded cluster.

- servers: <code>[term()]</code>

  A Node list for Cluster to connect to. The nodes should be separated with commas, such as: `Node[,Node].<br/>`
  For each Node should be: 
  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The MongoDB default port 27017 is used if `[:Port]` is not specified.

- w_mode: <code>unsafe | safe</code>
  * default: 
  `unsafe`

  Write mode.

- srv_record: <code>boolean()</code>
  * default: 
  `false`

  Use DNS SRV record.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- username: <code>binary()</code>

  EMQX's username in the external database.

- password: <code>binary()</code>

  EMQX's password in the external database.

- auth_source: <code>binary()</code>

  Database name associated with the user's credentials.

- database: <code>binary()</code>

  Database name.

- topology: <code>[topology](#topology)</code>



- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authn-mongodb:standalone
Configuration for a standalone MongoDB instance.


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- mechanism: <code>password_based</code>

  Authentication mechanism.

- backend: <code>mongodb</code>

  Backend type.

- collection: <code>binary()</code>

  Collection used to store authentication data.

- selector: <code>map()</code>

  Statement that is executed during the authentication process. Commands can support following wildcards:
   - `${username}`: substituted with client's username
   - `${clientid}`: substituted with the clientid

- password_hash_field: <code>binary()</code>

  Document field that contains password hash.

- salt_field: <code>binary()</code>

  Document field that contains the password salt.

- is_superuser_field: <code>binary()</code>

  Document field that defines if the user has superuser privileges.

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>
  * default: 
  `{name = sha256, salt_position = prefix}`

  Options for password hash verification.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider

- mongo_type: <code>single</code>
  * default: 
  `single`

  Standalone instance.

- server: <code>emqx_schema:ip_port()</code>


  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The MongoDB default port 27017 is used if `[:Port]` is not specified.

- w_mode: <code>unsafe | safe</code>
  * default: 
  `unsafe`

  Write mode.

- srv_record: <code>boolean()</code>
  * default: 
  `false`

  Use DNS SRV record.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- username: <code>binary()</code>

  EMQX's username in the external database.

- password: <code>binary()</code>

  EMQX's password in the external database.

- auth_source: <code>binary()</code>

  Database name associated with the user's credentials.

- database: <code>binary()</code>

  Database name.

- topology: <code>[topology](#topology)</code>



- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authn-mysql:authentication
Configuration for authentication using MySQL database.


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- mechanism: <code>password_based</code>

  Authentication mechanism.

- backend: <code>mysql</code>

  Backend type.

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>
  * default: 
  `{name = sha256, salt_position = prefix}`

  Options for password hash verification.

- query: <code>string()</code>

  SQL query used to lookup client data.

- query_timeout: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"5s"`

  Timeout for the SQL query.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider

- server: <code>emqx_schema:ip_port()</code>


  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The MySQL default port 3306 is used if `[:Port]` is not specified.

- database: <code>binary()</code>

  Database name.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- username: <code>binary()</code>

  EMQX's username in the external database.

- password: <code>binary()</code>

  EMQX's password in the external database.

- auto_reconnect: <code>boolean()</code>
  * default: 
  `true`

  Enable automatic reconnect to the database.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authn-postgresql:authentication
Configuration for PostgreSQL authentication backend.


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- mechanism: <code>password_based</code>

  Authentication mechanism.

- backend: <code>postgresql</code>

  Backend type.

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>
  * default: 
  `{name = sha256, salt_position = prefix}`

  Options for password hash verification.

- query: <code>string()</code>

  `SQL` query for looking up authentication data.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider

- server: <code>emqx_schema:ip_port()</code>


  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The PostgreSQL default port 5432 is used if `[:Port]` is not specified.

- database: <code>binary()</code>

  Database name.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- username: <code>binary()</code>

  EMQX's username in the external database.

- password: <code>binary()</code>

  EMQX's password in the external database.

- auto_reconnect: <code>boolean()</code>
  * default: 
  `true`

  Enable automatic reconnect to the database.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authn-redis:cluster
Configuration for a Redis cluster.


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- mechanism: <code>password_based</code>

  Authentication mechanism.

- backend: <code>redis</code>

  Backend type.

- cmd: <code>string()</code>

  Redis query.

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>
  * default: 
  `{name = sha256, salt_position = prefix}`

  Options for password hash verification.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider

- servers: <code>[term()]</code>

  A Node list for Cluster to connect to. The nodes should be separated with commas, such as: `Node[,Node].<br/>`
  For each Node should be: 
  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The Redis default port 6379 is used if `[:Port]` is not specified.

- redis_type: <code>cluster</code>
  * default: 
  `cluster`

  Redis type.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- password: <code>binary()</code>

  EMQX's password in the external database.

- database: <code>integer()</code>
  * default: 
  `0`

  Redis database ID.

- auto_reconnect: <code>boolean()</code>
  * default: 
  `true`

  Enable automatic reconnect to the database.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authn-redis:sentinel
Configuration for a Redis Sentinel.


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- mechanism: <code>password_based</code>

  Authentication mechanism.

- backend: <code>redis</code>

  Backend type.

- cmd: <code>string()</code>

  Redis query.

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>
  * default: 
  `{name = sha256, salt_position = prefix}`

  Options for password hash verification.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider

- servers: <code>[term()]</code>

  A Node list for Cluster to connect to. The nodes should be separated with commas, such as: `Node[,Node].<br/>`
  For each Node should be: 
  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The Redis default port 6379 is used if `[:Port]` is not specified.

- redis_type: <code>sentinel</code>
  * default: 
  `sentinel`

  Redis type.

- sentinel: <code>string()</code>

  The cluster name in Redis sentinel mode.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- password: <code>binary()</code>

  EMQX's password in the external database.

- database: <code>integer()</code>
  * default: 
  `0`

  Redis database ID.

- auto_reconnect: <code>boolean()</code>
  * default: 
  `true`

  Enable automatic reconnect to the database.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authn-redis:standalone
Configuration for a standalone Redis instance.


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- mechanism: <code>password_based</code>

  Authentication mechanism.

- backend: <code>redis</code>

  Backend type.

- cmd: <code>string()</code>

  Redis query.

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>
  * default: 
  `{name = sha256, salt_position = prefix}`

  Options for password hash verification.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider

- server: <code>emqx_schema:ip_port()</code>


  The IPv4 or IPv6 address or the hostname to connect to.<br/>
  A host entry has the following form: `Host[:Port]`.<br/>
  The Redis default port 6379 is used if `[:Port]` is not specified.

- redis_type: <code>single</code>
  * default: 
  `single`

  Redis type.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  Size of the connection pool.

- password: <code>binary()</code>

  EMQX's password in the external database.

- database: <code>integer()</code>
  * default: 
  `0`

  Redis database ID.

- auto_reconnect: <code>boolean()</code>
  * default: 
  `true`

  Enable automatic reconnect to the database.

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.


## authn-scram-builtin_db:authentication
Settings for Salted Challenge Response Authentication Mechanism
(SCRAM) authentication.


**Config paths**

 - <code>authentication.$INDEX</code>
 - <code>gateway.coap.authentication</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication</code>
 - <code>gateway.coap.listeners.udp.$name.authentication</code>
 - <code>gateway.exproto.authentication</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication</code>
 - <code>gateway.lwm2m.authentication</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication</code>
 - <code>gateway.mqttsn.authentication</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication</code>
 - <code>gateway.stomp.authentication</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication</code>
 - <code>listeners.ssl.$name.authentication.$INDEX</code>
 - <code>listeners.tcp.$name.authentication.$INDEX</code>
 - <code>listeners.ws.$name.authentication.$INDEX</code>
 - <code>listeners.wss.$name.authentication.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX</code>



**Fields**

- mechanism: <code>scram</code>

  Authentication mechanism.

- backend: <code>built_in_database</code>

  Backend type.

- algorithm: <code>sha256 | sha512</code>
  * default: 
  `sha256`

  Hashing algorithm.

- iteration_count: <code>non_neg_integer()</code>
  * default: 
  `4096`

  Iteration count.

- enable: <code>boolean()</code>
  * default: 
  `true`

  Set to <code>false</code> to disable this auth provider


## auto_subscribe
设备登陆成功之后，通过预设的订阅表示符，为设备自动完成订阅。支持使用占位符。


**Config paths**

 - <code>auto_subscribe</code>


**Env overrides**

 - <code>EMQX_AUTO_SUBSCRIBE</code>



**Fields**

- topics: <code>[[auto_subscribe:topic](#auto_subscribe-topic)]</code>

  设备登陆成功之后，通过预设的订阅表示符，为设备自动完成订阅。支持使用占位符。


## auto_subscribe:topic
订阅标识符，支持使用占位符，例如 client/${clientid}/username/${username}/host/${host}/port/${port}
必填，且不可为空字符串


**Config paths**

 - <code>auto_subscribe.topics.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTO_SUBSCRIBE__TOPICS__$INDEX</code>



**Fields**

- topic: <code>binary()</code>

  订阅标识符，支持使用占位符，例如 client/${clientid}/username/${username}/host/${host}/port/${port}
  必填，且不可为空字符串

- qos: <code>qos()</code>
  * default: 
  `0`

  缺省值为 0，服务质量，
  QoS 0：消息最多传递一次，如果当时客户端不可用，则会丢失该消息。
  QoS 1：消息传递至少 1 次。
  QoS 2：消息仅传送一次。

- rh: <code>0..2</code>
  * default: 
  `0`

  指定订阅建立时服务端是否向客户端发送保留消息，
  可选值 0：只要客户端订阅成功，服务端就发送保留消息。
  可选值 1：客户端订阅成功且该订阅此前不存在，服务端才发送保留消息。毕竟有些时候客户端重新发起订阅可能只是为了改变一下 QoS，并不意味着它想再次接收保留消息。
  可选值 2：即便客户订阅成功，服务端也不会发送保留消息。

- rap: <code>0..1</code>
  * default: 
  `0`

  缺省值为 0，这一选项用来指定服务端向客户端转发消息时是否要保留其中的 RETAIN 标识，注意这一选项不会影响保留消息中的 RETAIN 标识。因此当 Retain As Publish 选项被设置为 0 时，客户端直接依靠消息中的 RETAIN 标识来区分这是一个正常的转发消息还是一个保留消息，而不是去判断消息是否是自己订阅后收到的第一个消息（转发消息甚至可能会先于保留消息被发送，视不同 Broker 的具体实现而定）。

- nl: <code>0..1</code>
  * default: 
  `0`

  缺省值为0，
  MQTT v3.1.1：如果设备订阅了自己发布消息的主题，那么将收到自己发布的所有消息。
  MQTT v5：如果设备在订阅时将此选项设置为 1，那么服务端将不会向设备转发自己发布的消息


## bridge:bridges
Configuration for MQTT bridges.


**Config paths**

 - <code>bridges</code>


**Env overrides**

 - <code>EMQX_BRIDGES</code>



**Fields**

- http: <code>{$name -> [bridge:config](#bridge-config)}</code>

  HTTP bridges to an HTTP server.

- mqtt: <code>{$name -> [ingress](#ingress) | [egress](#egress)}</code>

  MQTT bridges to/from another MQTT broker


## bridge:config
Configuration for an HTTP bridge.


**Config paths**

 - <code>bridges.http.$name</code>


**Env overrides**

 - <code>EMQX_BRIDGES__HTTP__$NAME</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `true`

  Enable or disable this bridge

- direction: <code>egress</code>
  * default: 
  `egress`

  The direction of this bridge, MUST be 'egress'

- connect_timeout: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"15s"`

  The timeout when connecting to the HTTP server.

- max_retries: <code>non_neg_integer()</code>
  * default: 
  `5`

  Max retry times if error on sending request.

- retry_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"1s"`

  Interval between retries.

- pool_type: <code>emqx_connector_http:pool_type()</code>
  * default: 
  `random`

  The type of the pool. Can be one of `random`, `hash`.

- pool_size: <code>pos_integer()</code>
  * default: 
  `8`

  The pool size.

- enable_pipelining: <code>boolean()</code>
  * default: 
  `true`

  Enable the HTTP pipeline.

- request: <code>[connector-http:request](#connector-http-request)</code>


  If the request is provided, the caller can send HTTP requests via
  <code>emqx_resource:query(ResourceId, {send_message, BridgeId, Message})</code>


- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>
  * default: 
  `{enable = false}`

  SSL connection settings.

- url: <code>binary()</code>


  The URL of the HTTP Bridge.<br>
  Template with variables is allowed in the path, but variables cannot be used in the scheme, host,
  or port part.<br>
  For example, <code> http://localhost:9901/${topic} </code> is allowed, but
  <code> http://${host}:9901/message </code> or <code> http://localhost:${port}/message </code>
  is not allowed.


- local_topic: <code>binary()</code>


  The MQTT topic filter to be forwarded to the HTTP server. All MQTT 'PUBLISH' messages with the topic
  matching the local_topic will be forwarded.<br/>
  NOTE: if this bridge is used as the output of a rule (EMQX rule engine), and also local_topic is
  configured, then both the data got from the rule and the MQTT messages that match local_topic
  will be forwarded.


- method: <code>post | put | get | delete</code>
  * default: 
  `post`


  The method of the HTTP request. All the available methods are: post, put, get, delete.<br>
  Template with variables is allowed.<br>


- headers: <code>map()</code>
  * default: 

  ```
  {
    accept = "application/json"
    "cache-control" = "no-cache"
    connection = "keep-alive"
    "content-type" = "application/json"
    "keep-alive" = "timeout=5"
  }
  ```


  The headers of the HTTP request.<br>
  Template with variables is allowed.


- body: <code>binary()</code>
  * default: 
  `"${payload}"`


  The body of the HTTP request.<br>
  Template with variables is allowed.


- request_timeout: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"15s"`

  HTTP request timeout.


## connector-http:request



**Config paths**

 - <code>authentication.$INDEX.request</code>
 - <code>authorization.sources.$INDEX.request</code>
 - <code>bridges.http.$name.request</code>
 - <code>gateway.coap.authentication.request</code>
 - <code>gateway.coap.listeners.dtls.$name.authentication.request</code>
 - <code>gateway.coap.listeners.udp.$name.authentication.request</code>
 - <code>gateway.exproto.authentication.request</code>
 - <code>gateway.exproto.listeners.dtls.$name.authentication.request</code>
 - <code>gateway.exproto.listeners.ssl.$name.authentication.request</code>
 - <code>gateway.exproto.listeners.tcp.$name.authentication.request</code>
 - <code>gateway.exproto.listeners.udp.$name.authentication.request</code>
 - <code>gateway.lwm2m.authentication.request</code>
 - <code>gateway.lwm2m.listeners.dtls.$name.authentication.request</code>
 - <code>gateway.lwm2m.listeners.udp.$name.authentication.request</code>
 - <code>gateway.mqttsn.authentication.request</code>
 - <code>gateway.mqttsn.listeners.dtls.$name.authentication.request</code>
 - <code>gateway.mqttsn.listeners.udp.$name.authentication.request</code>
 - <code>gateway.stomp.authentication.request</code>
 - <code>gateway.stomp.listeners.ssl.$name.authentication.request</code>
 - <code>gateway.stomp.listeners.tcp.$name.authentication.request</code>
 - <code>listeners.ssl.$name.authentication.$INDEX.request</code>
 - <code>listeners.tcp.$name.authentication.$INDEX.request</code>
 - <code>listeners.ws.$name.authentication.$INDEX.request</code>
 - <code>listeners.wss.$name.authentication.$INDEX.request</code>


**Env overrides**

 - <code>EMQX_AUTHENTICATION__$INDEX__REQUEST</code>
 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX__REQUEST</code>
 - <code>EMQX_BRIDGES__HTTP__$NAME__REQUEST</code>
 - <code>EMQX_GATEWAY__COAP__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__DTLS__$NAME__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__COAP__LISTENERS__UDP__$NAME__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__EXPROTO__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__DTLS__$NAME__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__UDP__$NAME__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__LWM2M__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__DTLS__$NAME__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__LWM2M__LISTENERS__UDP__$NAME__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__MQTTSN__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__DTLS__$NAME__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__MQTTSN__LISTENERS__UDP__$NAME__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__STOMP__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME__AUTHENTICATION__REQUEST</code>
 - <code>EMQX_LISTENERS__SSL__$NAME__AUTHENTICATION__$INDEX__REQUEST</code>
 - <code>EMQX_LISTENERS__TCP__$NAME__AUTHENTICATION__$INDEX__REQUEST</code>
 - <code>EMQX_LISTENERS__WS__$NAME__AUTHENTICATION__$INDEX__REQUEST</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__AUTHENTICATION__$INDEX__REQUEST</code>



**Fields**

- method: <code>post | put | get | delete</code>

  HTTP method.

- path: <code>binary()</code>

  URL path.

- body: <code>binary()</code>

  HTTP request body.

- headers: <code>map()</code>

  List of HTTP headers.

- request_timeout: <code>emqx_schema:duration_ms()</code>

  HTTP request timeout.


## plugin:plugins

Manage EMQX plugins.
<br>
Plugins can be pre-built as a part of EMQX package,
or installed as a standalone package in a location specified by
<code>install_dir</code> config key
<br>
The standalone-installed plugins are referred to as 'external' plugins.



**Config paths**

 - <code>plugins</code>


**Env overrides**

 - <code>EMQX_PLUGINS</code>



**Fields**

- states: <code>[[plugin:state](#plugin-state)]</code>
  * default: 
  `[]`

  An array of plugins in the desired states.<br>The plugins are started in the defined order

- install_dir: <code>string()</code>
  * default: 
  `"plugins"`


  The installation directory for the external plugins.
  The plugin beam files and configuration files should reside in
  the subdirectory named as <code>emqx_foo_bar-0.1.0</code>.
  <br>
  NOTE: For security reasons, this directory should **NOT** be writable
  by anyone except <code>emqx</code> (or any user which runs EMQX).


- check_interval: <code>emqx_schema:duration()</code>
  * default: 
  `"5s"`


  Check interval: check if the status of the plugins in the cluster is consistent, <br>
  if the results of 3 consecutive checks are not consistent, then alarm.



## plugin:state
A per-plugin config to describe the desired state of the plugin.


**Config paths**

 - <code>plugins.states.$INDEX</code>


**Env overrides**

 - <code>EMQX_PLUGINS__STATES__$INDEX</code>



**Fields**

- name_vsn: <code>string()</code>

  The {name}-{version} of the plugin.<br>It should match the plugin application name-version as the for the plugin release package name<br>For example: my_plugin-0.1.0.

- enable: <code>boolean()</code>

  Set to 'true' to enable this plugin


## prometheus
Prometheus 监控数据推送


**Config paths**

 - <code>prometheus</code>


**Env overrides**

 - <code>EMQX_PROMETHEUS</code>



**Fields**

- push_gateway_server: <code>string()</code>
  * default: 
  `"http://127.0.0.1:9091"`

  Prometheus 服务器地址

- interval: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"15s"`

  数据推送间隔，单位 毫秒

- enable: <code>boolean()</code>
  * default: 
  `false`

  开启或关闭 Prometheus 数据推送


## retainer:flow_control
Retainer batching and rate limiting.


**Config paths**

 - <code>retainer.flow_control</code>


**Env overrides**

 - <code>EMQX_RETAINER__FLOW_CONTROL</code>



**Fields**

- batch_read_number: <code>integer()</code>
  * default: 
  `0`

  Size of the batch when reading messages from storage. 0 means no limit.

- batch_deliver_number: <code>0..1000</code>
  * default: 
  `0`

  The number of retained messages can be delivered per batch.

- batch_deliver_limiter: <code>emqx_limiter_schema:bucket_name()</code>

  The rate limiter name for retained messages' delivery.<br/>Limiter helps to avoid delivering too many messages to the client at once, which may cause the client to block or crash, or drop messages due to exceeding the size of the message queue.<br/>The names of the available rate limiters are taken from the existing rate limiters under `limiter.batch`.<br/>If this field is empty, limiter is not used.


## retainer:mnesia_config
Configuration of the internal database storing retained messages.


**Config paths**

 - <code>retainer.backend</code>


**Env overrides**

 - <code>EMQX_RETAINER__BACKEND</code>



**Fields**

- type: <code>built_in_database</code>

  Backend type.

- storage_type: <code>ram | disc</code>
  * default: 
  `ram`

  Specifies whether the messages are stored in RAM or persisted on disc.

- max_retained_messages: <code>integer()</code>
  * default: 
  `0`

  Maximum number of retained messages. 0 means no limit.


## retainer
Configuration related to handling `PUBLISH` packets with a `retain` flag set to 1.


**Config paths**

 - <code>retainer</code>


**Env overrides**

 - <code>EMQX_RETAINER</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable retainer feature.

- msg_expiry_interval: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"0s"`

  Message retention time. 0 means message will never be expired.

- msg_clear_interval: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"0s"`

  Periodic interval for cleaning up expired messages. Never clear if the value is 0.

- flow_control: <code>[retainer:flow_control](#retainer-flow_control)</code>



- max_payload_size: <code>emqx_schema:bytesize()</code>
  * default: 
  `"1MB"`

  Maximum retained message size.

- stop_publish_clear_msg: <code>boolean()</code>
  * default: 
  `false`

  When the retained flag of the `PUBLISH` message is set and Payload is empty, whether to continue to publish the message.<br/>See: http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718038

- backend: <code>[retainer:mnesia_config](#retainer-mnesia_config)</code>

  Settings for the database storing the retained messages.


## slow_subs
Configuration for `slow_subs` feature.


**Config paths**

 - <code>slow_subs</code>


**Env overrides**

 - <code>EMQX_SLOW_SUBS</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable this feature.

- threshold: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"500ms"`

  The latency threshold for statistics, the minimum value is 100ms.

- expire_interval: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"300s"`

  The eviction time of the record, which in the statistics record table.

- top_k_num: <code>pos_integer()</code>
  * default: 
  `10`

  The maximum number of records in the slow subscription statistics record table.

- stats_type: <code>whole | internal | response</code>
  * default: 
  `whole`

  The method to calculate the latency.


## statsd
Statsd 监控数据推送


**Config paths**

 - <code>statsd</code>


**Env overrides**

 - <code>EMQX_STATSD</code>



**Fields**

- enable: <code>boolean()</code>
  * default: 
  `false`

  开启或关闭 Statsd 数据推送

- server: <code>emqx_schema:ip_port()</code>
  * default: 
  `"127.0.0.1:8125"`

  Statsd 服务器地址

- sample_time_interval: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"10s"`

  数据收集间隔，单位 毫秒

- flush_time_interval: <code>emqx_schema:duration_ms()</code>
  * default: 
  `"10s"`

  数据推送间隔，单位 毫秒


## dashboard
Configuration for EMQX dashboard.


**Config paths**

 - <code>dashboard</code>


**Env overrides**

 - <code>EMQX_DASHBOARD</code>



**Fields**

- listeners: <code>[[dashboard:http](#dashboard-http) | [dashboard:https](#dashboard-https)]</code>

  HTTP(s) listeners are identified by their protocol type and are
  used to serve dashboard UI and restful HTTP API.<br>
  Listeners must have a unique combination of port number and IP address.<br>
  For example, an HTTP listener can listen on all configured IP addresses
  on a given port for a machine by specifying the IP address 0.0.0.0.<br>
  Alternatively, the HTTP listener can specify a unique IP address for each listener,
  but use the same port.

- default_username: <code>string()</code>
  * default: 
  `"admin"`

  The default username of the automatically created dashboard user.

- default_password: <code>string()</code>
  * default: 
  `"public"`


  The initial default password for dashboard 'admin' user.
  For safety, it should be changed as soon as possible.

- sample_interval: <code>emqx_schema:duration_s()</code>
  * default: 
  `"10s"`

  How often to update metrics displayed in the dashboard.<br/>Note: `sample_interval` should be a divisor of 60.

- token_expired_time: <code>emqx_schema:duration()</code>
  * default: 
  `"30m"`

  JWT token expiration time.

- cors: <code>boolean()</code>
  * default: 
  `false`

  Support Cross-Origin Resource Sharing (CORS).
  Allows a server to indicate any origins (domain, scheme, or port) other than
  its own from which a browser should permit loading resources.

- i18n_lang: <code>en | zh</code>
  * default: 
  `en`

  Internationalization language support.


## dashboard:http
Configuration for the dashboard listener (plaintext).


**Config paths**

 - <code>dashboard.listeners.$INDEX</code>


**Env overrides**

 - <code>EMQX_DASHBOARD__LISTENERS__$INDEX</code>



**Fields**

- protocol: <code>http | https</code>
  * default: 
  `http`

  协议名

- bind: <code>non_neg_integer() | emqx_schema:ip_port()</code>
  * default: 
  `18083`

  Port without IP(18083) or port with specified IP(127.0.0.1:18083).

- num_acceptors: <code>integer()</code>
  * default: 
  `4`

  Socket acceptor pool size for TCP protocols.

- max_connections: <code>integer()</code>
  * default: 
  `512`

  Maximum number of simultaneous connections.

- backlog: <code>integer()</code>
  * default: 
  `1024`

  Defines the maximum length that the queue of pending connections can grow to.

- send_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"5s"`

  Send timeout for the socket.

- inet6: <code>boolean()</code>
  * default: 
  `false`

  Sets up the listener for IPv6.

- ipv6_v6only: <code>boolean()</code>
  * default: 
  `false`

  Disable IPv4-to-IPv6 mapping for the listener.


## dashboard:https
Configuration for the dashboard listener (TLS).


**Config paths**

 - <code>dashboard.listeners.$INDEX</code>


**Env overrides**

 - <code>EMQX_DASHBOARD__LISTENERS__$INDEX</code>



**Fields**

- protocol: <code>http | https</code>
  * default: 
  `http`

  协议名

- bind: <code>non_neg_integer() | emqx_schema:ip_port()</code>
  * default: 
  `18083`

  Port without IP(18083) or port with specified IP(127.0.0.1:18083).

- num_acceptors: <code>integer()</code>
  * default: 
  `4`

  Socket acceptor pool size for TCP protocols.

- max_connections: <code>integer()</code>
  * default: 
  `512`

  Maximum number of simultaneous connections.

- backlog: <code>integer()</code>
  * default: 
  `1024`

  Defines the maximum length that the queue of pending connections can grow to.

- send_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"5s"`

  Send timeout for the socket.

- inet6: <code>boolean()</code>
  * default: 
  `false`

  Sets up the listener for IPv6.

- ipv6_v6only: <code>boolean()</code>
  * default: 
  `false`

  Disable IPv4-to-IPv6 mapping for the listener.

- enable: <code>boolean()</code>
  * default: 
  `false`

  Enable TLS.

- cacertfile: <code>string()</code>

  Trusted PEM format CA certificates bundle file.<br>
  The certificates in this file are used to verify the TLS peer's certificates.
  Append new certificates to the file if new CAs are to be trusted.
  There is no need to restart EMQX to have the updated file loaded, because
  the system regularly checks if file has been updated (and reload).<br>
  NOTE: invalidating (deleting) a certificate from the file will not affect
  already established connections.


- certfile: <code>string()</code>

  PEM format certificates chain file.<br>
  The certificates in this file should be in reversed order of the certificate
  issue chain. That is, the host's certificate should be placed in the beginning
  of the file, followed by the immediate issuer certificate and so on.
  Although the root CA certificate is optional, it should be placed at the end of
  the file if it is to be added.

- keyfile: <code>string()</code>

  PEM format private key file.

- verify: <code>verify_peer | verify_none</code>
  * default: 
  `verify_none`

  Enable or disable peer verification.

- reuse_sessions: <code>boolean()</code>
  * default: 
  `true`

  Enable TLS session reuse.

- depth: <code>integer()</code>
  * default: 
  `10`

  Maximum number of non-self-issued intermediate certificates that can follow the peer certificate in a valid certification path. So, if depth is 0 the PEER must be signed by the trusted ROOT-CA directly; if 1 the path can be PEER, CA, ROOT-CA; if 2 the path can be PEER, CA, CA, ROOT-CA, and so on. The default value is 10.

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  key file is password-protected.

- versions: <code>[atom()]</code>
  * default: 
  `[tlsv1.3, tlsv1.2, tlsv1.1, tlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.

- ciphers: <code>[string()]</code>
  * default: 
  `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256", "TLS_AES_128_CCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

  This config holds TLS cipher suite names separated by comma,
  or as an array of strings. e.g.
  <code>"TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256"</code> or
  <code>["TLS_AES_256_GCM_SHA384","TLS_AES_128_GCM_SHA256"]</code>.
  <br>
  Ciphers (and their ordering) define the way in which the
  client and server encrypts information over the network connection.
  Selecting a good cipher suite is critical for the
  application's data security, confidentiality and performance.

  The names should be in OpenSSL string format (not RFC format).
  All default values and examples provided by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppressed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>
  * default: 
  `"emqx_tls_psk:lookup"`

  EMQX-internal callback that is used to lookup pre-shared key (PSK) identity.

- secure_renegotiate: <code>boolean()</code>
  * default: 
  `true`

  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.

- dhfile: <code>string()</code>

  Path to a file containing PEM-encoded Diffie-Hellman parameters
  to be used by the server if a cipher suite using Diffie-Hellman
  key exchange is negotiated. If not specified, default parameters
  are used.<br>
  NOTE: The <code>dhfile</code> option is not supported by TLS 1.3.

- honor_cipher_order: <code>boolean()</code>
  * default: 
  `true`

  An important security setting, it forces the cipher to be set based
   on the server-specified order instead of the client-specified order,
   hence enforcing the (usually more properly configured) security
   ordering of the server administrator.

- client_renegotiation: <code>boolean()</code>
  * default: 
  `true`

  In protocols that support client-initiated renegotiation,
  the cost of resources of such an operation is higher for the server than the client.
  This can act as a vector for denial of service attacks.
  The SSL application already takes measures to counter-act such attempts,
  but client-initiated renegotiation can be strictly disabled by setting this option to false.
  The default value is true. Note that disabling renegotiation can result in
  long-lived connections becoming unusable due to limits on
  the number of messages the underlying cipher suite can encipher.

- handshake_timeout: <code>emqx_schema:duration()</code>
  * default: 
  `"15s"`

  Maximum time duration allowed for the handshake to complete


