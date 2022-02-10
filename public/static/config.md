# EMQX 5.0.0-beta.3-7556a682 Configuration
EMQX configuration file is in [HOCON](https://github.com/emqx/hocon) format.
HOCON, or Human-Optimized Config Object Notation is a format for human-readable data,
and a superset of JSON.

## Layered

EMQX configuration consists of 3 layers.
From bottom up:

1. Immutable base: `emqx.conf` + `EMQX_` prfixed environment variables.<br>
   Changes in this layer require a full node restart to take effect.
1. Cluster override: The path of which is configured by `cluster_override_conf_file`.<br>
   Overrides made from management APIs (or dashboard) for all nodes in the cluster.
1. Local override: The path of which is configured by `local_override_conf_file`.<br>
   Special overrides applied to local node.

For detailed override rules, see [Config overlay rules](#config-overlay-rules).

## Syntax

In config file the values can be notated as JSON like ojbects, such as
```
node {
    name = "emqx@127.0.0.1"
    cookie = "mysecret"
}
```

Another equivalent representation is flat, such as

```
node.name="127.0.0.1"
node.cookie="mysecret"
```

This flat format is almost backward compatible with EMQX's config file format
in 4.x series (the so called 'cuttlefish' format).

It is 'almost' compabile because the often HOCON requires strings to be quoted,
while cuttlefish treats all characters to the right of the `=` mark as the value.

e.g. cuttlefish: `node.name = emqx@127.0.0.1`, HOCON: `node.name = "emqx@127.0.0.1"`

Strings without special characters in them can be unquoted in HOCON too,
e.g. `foo`, `foo_bar`, `foo_bar_1`:

For more HOCON syntax, pelase refer to the [specification](https://github.com/lightbend/config/blob/main/HOCON.md)

## Schema

To make the HOCON objects type-safe, EMQX introduded a schema for it.
The schema defines data types, and data fields' names and metadata for config value validation
and more. In fact, this config document itself is generated from schema metadata.

### Complex Data Types

There are 4 complex data types in EMQX's HOCON config:

1. Struct: Named using an unquoted string, followed by a pre-defined list of fields,
   fields can not start with a number, and are only allowed to use
   lowercase letters and underscores as word separater.
1. Map: Map is like Struct, however the fields are not pre-defined.
   1-based index number can also be used as map keys for an alternative
   representation of an Array.
1. Union: `MemberType1 | MemberType2 | ...`
1. Array: `[ElementType]`

### Primitive Data Types

Complex types define data 'boxes' wich may contain other complex data
or primitive values.
There are quite some different primitive types, to name a fiew:

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
as `atom()`, some are defiend in EMQX modules, such as `emqx_schema:duration()`.

### Config Paths

If we consider the whole EMQX config as a tree,
to reference a primitive value, we can use a dot-separated names form string for
the path from the tree-root (always a Struct) down to the primitive values at tree-leaves.

Each segment of the dotted string is a Struct filed name or Map key.
For Array elements, 1-based index is used.

below are some examples

```
node.name="emqx.127.0.0.1"
zone.zone1.max_packet_size="10M"
authentication.1.enable=true
```

### Environment varialbes

Environment variables can be used to define or override config values.

Due to the fact that dots (`.`) are not allowed in environment variables, dots are
replaced with double-underscores (`__`).

And a the `EMQX_` prefix is used as the namespace.

For example `node.name` can be represented as `EMQX_NODE__NAME`

Environment varialbe values are parsed as hocon values, this allows users
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

### Config overlay rules

HOCON objects are overlayed, in general:

- Within one file, objects defined 'later' recursively override objects defined 'earlier'
- When layered, 'later' (hihger lalyer) objects override objects defined 'earlier' (lower layer)

Below are more detailed rules.

#### Struct Fileds

Later config values overwrites earlier values.
For example, in below config, the last line `debug` overwrites `errro` for
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
the config schema. For instance, `zone1` in the exampele below.

```
zone {
    zone1 {
        mqtt.max_packet_size = 1M
    }
}

## The maximum packet size can be defined as above,
## then overriden as below

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
authentication=[{enable=true, backend="built-in-database", mechanism="password-based"}]
# we can disable this authentication provider with:
authentication.1.enable=false
```
However, list arrays do not get recursively merged into indexed-map arrays.
e.g.

```
authentication=[{enable=true, backend="built-in-database", mechanism="password-based"}]
## below value will replace the whole array, but not to override just one field.
authentication=[{enable=true}]
```

## Root Config Keys

**Fields**

- listeners: <code>[listeners](#listeners)</code>

  MQTT listeners identified by their protocol type and assigned names

- zones: <code>{$name -> [zone](#zone)}</code>

  A zone is a set of configs grouped by the zone <code>name</code>.<br>
  For flexible configuration mapping, the <code>name</code>
  can be set to a listener's <code>zone</code> config.<br>
  NOTE: A builtin zone named <code>default</code> is auto created
  and can not be deleted.

- mqtt: <code>[mqtt](#mqtt)</code>

  Global MQTT configuration.<br>
  The configs here work as default values which can be overriden
  in <code>zone</code> configs

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
  <li>one: For example <code>{enable:true,backend:"built-in-database",mechanism="password-based"}
  </code></li>
  <li>chain: An array of structs.</li>
  </ul>
  <br>
  When a chain is configured, the login credentials are checked against the backends
  per the configured order, until an 'allow' or 'deny' decision can be made.
  <br>
  If there is no decision after a full chain exhaustion, the login is rejected.

  Authentication can be one single authenticator instance or a chain of authenticators as an array.
  When authenticating a login (username, client ID, etc.) the authenticators are checked
  in the configured order.<br>


- authorization: <code>[authorization](#authorization)</code>


  Authorization a.k.a ACL.<br>
  In EMQX, MQTT client access control is extremly flexible.<br>
  An out of the box set of authorization data sources are supported.
  For example,<br>
  'file' source is to support concise and yet generic ACL rules in a file;<br>
  'built-in-database' source can be used to store per-client customisable rule sets,
  natively in the EMQX node;<br>
  'http' source to make EMQX call an external HTTP API to make the decision;<br>
  'postgresql' etc. to look up clients or rules from external databases;<br>


- node: <code>[node](#node)</code>

  Node name, cookie, config & data directories and the Eralng virtual machine (beam) boot parameters.

- cluster: <code>[cluster](#cluster)</code>

  EMQX nodes can form a cluster to scale up the total capacity.<br>Here holds the configs to instruct how individual nodes can discover each other.

- log: <code>[log](#log)</code>

  Configure logging backends (to console or to file), and logging level for each logger backend.

- rpc: <code>[rpc](#rpc)</code>

  EMQX uses a library called <code>gen_rpc</code> for inter-broker RPCs.<br>Most of the time the default config should work, but in case you need to do performance fine-turning or experiment a bit, this is where to look.

- db: <code>[db](#db)</code>

  Settings of the embedded database.

- broker: <code>[broker](#broker)</code>

- rate_limit: <code>[rate_limit](#rate_limit)</code>

- force_shutdown: <code>[force_shutdown](#force_shutdown)</code>

- overload_protection: <code>[overload_protection](#overload_protection)</code>

- force_gc: <code>[force_gc](#force_gc)</code>

- conn_congestion: <code>[conn_congestion](#conn_congestion)</code>

- quota: <code>[quota](#quota)</code>

- stats: <code>[stats](#stats)</code>

- sysmon: <code>[sysmon](#sysmon)</code>

- alarm: <code>[alarm](#alarm)</code>

- flapping_detect: <code>[flapping_detect](#flapping_detect)</code>

- persistent_session_store: <code>[persistent_session_store](#persistent_session_store)</code>

- latency_stats: <code>[latency_stats](#latency_stats)</code>

- trace: <code>[trace](#trace)</code>


  Real-time filtering logs for the ClientID or Topic or IP for debugging.


- bridges: <code>[bridges](#bridges)</code>

- emqx_retainer: <code>[emqx_retainer](#emqx_retainer)</code>

- statsd: <code>[statsd](#statsd)</code>

- auto_subscribe: <code>[auto_subscribe](#auto_subscribe)</code>

- delayed: <code>[modules:delayed](#modules-delayed)</code>

- telemetry: <code>[modules:telemetry](#modules-telemetry)</code>

- event_message: <code>[modules:event_message](#modules-event_message)</code>

- rewrite: <code>[[modules:rewrite](#modules-rewrite)]</code>

- topic_metrics: <code>[[modules:topic_metrics](#modules-topic_metrics)]</code>

- plugins: <code>[plugin:plugins](#plugin-plugins)</code>

- emqx_dashboard: <code>[dashboard:emqx_dashboard](#dashboard-emqx_dashboard)</code>

- gateway: <code>[gateway](#gateway)</code>

- prometheus: <code>[prometheus](#prometheus)</code>

- rule_engine: <code>[rule_engine](#rule_engine)</code>

- emqx_exhook: <code>[emqx_exhook](#emqx_exhook)</code>

- psk_authentication: <code>[psk_authentication](#psk_authentication)</code>

- emqx_limiter: <code>[emqx_limiter](#emqx_limiter)</code>

- connectors: <code>[connectors](#connectors)</code>

- emqx_slow_subs: <code>[emqx_slow_subs](#emqx_slow_subs)</code>


## authz:file

**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>


**Fields**

- type: <code>file</code>

- enable: <code>boolean()</code>

  Default = `true`

- path: <code>string()</code>


  Path to the file which contains the ACL rules.<br>
  If the file provisioned before starting EMQX node, it can be placed anywhere
  as long as EMQX has read access to it.
  In case rule set is created from EMQX dashboard or management HTTP API,
  the file will be placed in `certs/authz` sub directory inside EMQX's `data_dir`,
  and the new rules will override all rules from the old config file.



## authz:http_get

**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>


**Fields**

- method: <code>get</code>

  Default = `post`

- headers: <code>[{binary(), binary()}]</code>

  Default = 
  ```
  {
    accept = "application/json"
    "cache-control" = "no-cache"
    connection = "keep-alive"
    "keep-alive" = "timeout=5"
  }
  ```

- type: <code>http</code>

- enable: <code>boolean()</code>

  Default = `true`

- url: <code>binary()</code>

- request_timeout: <code>string()</code>

  Default = `"30s"`

  request timeout Time span. A text string with number followed by time units:
                      `ms` for milli-seconds,
                      `s` for seconds,
                      `m` for minutes,
                      `h` for hours;
                      or combined representation like `1h5m0s`

- body: <code>map()</code>

- connect_timeout: <code>emqx_schema:duration_ms()</code>

  Default = `"15s"`

  The timeout when connecting to the HTTP server

- max_retries: <code>non_neg_integer()</code>

  Default = `5`

  Max retry times if error on sending request

- retry_interval: <code>emqx_schema:duration()</code>

  Default = `"1s"`

  Interval before next retry if error on sending request

- pool_type: <code>emqx_connector_http:pool_type()</code>

  Default = `random`

  The type of the pool. Canbe one of random, hash

- pool_size: <code>non_neg_integer()</code>

  Default = `8`

  The pool size

- enable_pipelining: <code>boolean()</code>

  Default = `true`

  Enable the HTTP pipeline

- request: <code>[connector-http:request](#connector-http-request)</code>


  If the request is provided, the caller can send HTTP requests via
  <code>emqx_resource:query(ResourceId, {send_message, BridgeId, Message})</code>


- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authz:http_post

**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>


**Fields**

- method: <code>post</code>

  Default = `post`

- headers: <code>[{binary(), binary()}]</code>

  Default = 
  ```
  {
    accept = "application/json"
    "cache-control" = "no-cache"
    connection = "keep-alive"
    "content-type" = "application/json"
    "keep-alive" = "timeout=5"
  }
  ```

- type: <code>http</code>

- enable: <code>boolean()</code>

  Default = `true`

- url: <code>binary()</code>

- request_timeout: <code>string()</code>

  Default = `"30s"`

  request timeout Time span. A text string with number followed by time units:
                      `ms` for milli-seconds,
                      `s` for seconds,
                      `m` for minutes,
                      `h` for hours;
                      or combined representation like `1h5m0s`

- body: <code>map()</code>

- connect_timeout: <code>emqx_schema:duration_ms()</code>

  Default = `"15s"`

  The timeout when connecting to the HTTP server

- max_retries: <code>non_neg_integer()</code>

  Default = `5`

  Max retry times if error on sending request

- retry_interval: <code>emqx_schema:duration()</code>

  Default = `"1s"`

  Interval before next retry if error on sending request

- pool_type: <code>emqx_connector_http:pool_type()</code>

  Default = `random`

  The type of the pool. Canbe one of random, hash

- pool_size: <code>non_neg_integer()</code>

  Default = `8`

  The pool size

- enable_pipelining: <code>boolean()</code>

  Default = `true`

  Enable the HTTP pipeline

- request: <code>[connector-http:request](#connector-http-request)</code>


  If the request is provided, the caller can send HTTP requests via
  <code>emqx_resource:query(ResourceId, {send_message, BridgeId, Message})</code>


- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authz:mnesia

**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>


**Fields**

- type: <code>built-in-database</code>

- enable: <code>boolean()</code>

  Default = `true`


## authz:mongo_rs

**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>


**Fields**

- collection: <code>atom()</code>

- selector: <code>map()</code>

- type: <code>mongodb</code>

- enable: <code>boolean()</code>

  Default = `true`

- mongo_type: <code>rs</code>

  Default = `rs`

- servers: <code>binary()</code>

- w_mode: <code>unsafe | safe</code>

  Default = `unsafe`

- r_mode: <code>master | slave_ok</code>

  Default = `master`

- replica_set_name: <code>binary()</code>

- srv_record: <code>boolean()</code>

  Default = `false`

- pool_size: <code>integer()</code>

  Default = `8`

- username: <code>binary()</code>

- password: <code>binary()</code>

- auth_source: <code>binary()</code>

- database: <code>binary()</code>

- topology: <code>[topology](#topology)</code>

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authz:mongo_sharded

**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>


**Fields**

- collection: <code>atom()</code>

- selector: <code>map()</code>

- type: <code>mongodb</code>

- enable: <code>boolean()</code>

  Default = `true`

- mongo_type: <code>sharded</code>

  Default = `sharded`

- servers: <code>binary()</code>

- w_mode: <code>unsafe | safe</code>

  Default = `unsafe`

- srv_record: <code>boolean()</code>

  Default = `false`

- pool_size: <code>integer()</code>

  Default = `8`

- username: <code>binary()</code>

- password: <code>binary()</code>

- auth_source: <code>binary()</code>

- database: <code>binary()</code>

- topology: <code>[topology](#topology)</code>

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authz:mongo_single

**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>


**Fields**

- collection: <code>atom()</code>

- selector: <code>map()</code>

- type: <code>mongodb</code>

- enable: <code>boolean()</code>

  Default = `true`

- mongo_type: <code>single</code>

  Default = `single`

- server: <code>binary()</code>

- w_mode: <code>unsafe | safe</code>

  Default = `unsafe`

- srv_record: <code>boolean()</code>

  Default = `false`

- pool_size: <code>integer()</code>

  Default = `8`

- username: <code>binary()</code>

- password: <code>binary()</code>

- auth_source: <code>binary()</code>

- database: <code>binary()</code>

- topology: <code>[topology](#topology)</code>

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authz:mysql

**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>


**Fields**

- type: <code>mysql</code>

- enable: <code>boolean()</code>

  Default = `true`

- server: <code>emqx_schema:ip_port()</code>

- database: <code>binary()</code>

- pool_size: <code>integer()</code>

  Default = `8`

- username: <code>binary()</code>

- password: <code>binary()</code>

- auto_reconnect: <code>boolean()</code>

  Default = `true`

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`

- query: <code>binary()</code>


## authz:postgresql

**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>


**Fields**

- query: <code>binary()</code>

- type: <code>postgresql</code>

- enable: <code>boolean()</code>

  Default = `true`

- server: <code>emqx_schema:ip_port()</code>

- database: <code>binary()</code>

- pool_size: <code>integer()</code>

  Default = `8`

- username: <code>binary()</code>

- password: <code>binary()</code>

- auto_reconnect: <code>boolean()</code>

  Default = `true`

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authz:redis_cluster

**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>


**Fields**

- type: <code>redis</code>

- enable: <code>boolean()</code>

  Default = `true`

- servers: <code>emqx_connector_redis:servers()</code>

- redis_type: <code>cluster</code>

  Default = `cluster`

- pool_size: <code>integer()</code>

  Default = `8`

- password: <code>binary()</code>

- database: <code>integer()</code>

  Default = `0`

- auto_reconnect: <code>boolean()</code>

  Default = `true`

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`

- cmd: <code>binary()</code>


## authz:redis_sentinel

**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>


**Fields**

- type: <code>redis</code>

- enable: <code>boolean()</code>

  Default = `true`

- servers: <code>emqx_connector_redis:servers()</code>

- redis_type: <code>sentinel</code>

  Default = `sentinel`

- sentinel: <code>string()</code>

- pool_size: <code>integer()</code>

  Default = `8`

- password: <code>binary()</code>

- database: <code>integer()</code>

  Default = `0`

- auto_reconnect: <code>boolean()</code>

  Default = `true`

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`

- cmd: <code>binary()</code>


## authz:redis_single

**Config paths**

 - <code>authorization.sources.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__SOURCES__$INDEX</code>


**Fields**

- type: <code>redis</code>

- enable: <code>boolean()</code>

  Default = `true`

- server: <code>emqx_connector_redis:server()</code>

- redis_type: <code>single</code>

  Default = `single`

- pool_size: <code>integer()</code>

  Default = `8`

- password: <code>binary()</code>

- database: <code>integer()</code>

  Default = `0`

- auto_reconnect: <code>boolean()</code>

  Default = `true`

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`

- cmd: <code>binary()</code>


## emqx_exhook

**Config paths**

 - <code>emqx_exhook</code>


**Env overrides**

 - <code>EMQX_EMQX_EXHOOK</code>


**Fields**

- servers: <code>[[emqx_exhook:server](#emqx_exhook-server)]</code>

  Default = `[]`


## emqx_exhook:server

**Config paths**

 - <code>emqx_exhook.servers.$INDEX</code>


**Env overrides**

 - <code>EMQX_EMQX_EXHOOK__SERVERS__$INDEX</code>


**Fields**

- name: <code>binary()</code>

- enable: <code>boolean()</code>

  Default = `true`

- url: <code>binary()</code>

- request_timeout: <code>emqx_exhook_schema:duration()</code>

  Default = `"5s"`

- failed_action: <code>deny | ignore</code>

  Default = `deny`

- ssl: <code>[emqx_exhook:ssl_conf](#emqx_exhook-ssl_conf)</code>

- auto_reconnect: <code>false | emqx_exhook_schema:duration()</code>

  Default = `"60s"`

- pool_size: <code>integer()</code>

  Default = `8`


## emqx_exhook:ssl_conf

**Config paths**

 - <code>emqx_exhook.servers.$INDEX.ssl</code>


**Env overrides**

 - <code>EMQX_EMQX_EXHOOK__SERVERS__$INDEX__SSL</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `true`

- cacertfile: <code>binary()</code>

- certfile: <code>binary()</code>

- keyfile: <code>binary()</code>


## gateway:clientinfo_override

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

- password: <code>binary()</code>

- clientid: <code>binary()</code>


## gateway:coap

**Config paths**

 - <code>gateway.coap</code>


**Env overrides**

 - <code>EMQX_GATEWAY__COAP</code>


**Fields**

- heartbeat: <code>emqx_gateway_schema:duration()</code>

  Default = `"30s"`

  The gateway server required minimum hearbeat interval.<br>
  When connection mode is enabled, this parameter is used to set the minimum
  heartbeat interval for the connection to be alive.

- connection_required: <code>boolean()</code>

  Default = `false`

  Enable or disable connection mode.<br>
  Connection mode is a feature of non-standard protocols. When connection mode
  is enabled, it is necessary to maintain the creation, authentication and alive
  of connection resources

- notify_type: <code>non | con | qos</code>

  Default = `qos`

  The Notification Message will be delivered to the CoAP client if a new message
  received on an observed topic.
  The type of delivered coap message can be set to:<br>
  1. non: Non-confirmable;<br>
  2. con: Confirmable;<br>
  3. qos: Mapping from QoS type of recevied message, QoS0 -> non, QoS1,2 -> con

- subscribe_qos: <code>qos0 | qos1 | qos2 | coap</code>

  Default = `coap`

  The Default QoS Level indicator for subscribe request.<br>
  This option specifies the QoS level for the CoAP Client when establishing a
  subscription membership, if the subscribe request is not carried `qos` option.
  The indicator can be set to:
    - qos0, qos1, qos2: Fixed default QoS level
    - coap: Dynamic QoS level by the message type of subscribe request
      * qos0: If the subscribe request is non-confirmable
      * qos1: If the subscribe request is confirmable

- publish_qos: <code>qos0 | qos1 | qos2 | coap</code>

  Default = `coap`

  The Default QoS Level indicator for publish request.<br>
  This option specifies the QoS level for the CoAP Client when publishing a
  message to EMQX PUB/SUB system, if the publish request is not carried `qos`
  option. The indicator can be set to:
    - qos0, qos1, qos2: Fixed default QoS level
    - coap: Dynamic QoS level by the message type of publish request
      * qos0: If the publish request is non-confirmable
      * qos1: If the publish request is confirmable

- listeners: <code>[gateway:udp_listeners](#gateway-udp_listeners)</code>

- enable: <code>boolean()</code>

  Default = `true`

  Whether to enable this gateway

- enable_stats: <code>boolean()</code>

  Default = `true`

  Whether to enable client process statistic

- idle_timeout: <code>emqx_gateway_schema:duration()</code>

  Default = `"30s"`

  The idle time of the client connection process.<br>
  it has two purposes:
  1. A newly created client process that does not receive any client requests
     after that time will be closed directly.
  2. A running client process that does not receive any client requests after
     this time will go into hibernation to save resources.

- mountpoint: <code>binary()</code>

  Default = `""`



- clientinfo_override: <code>[gateway:clientinfo_override](#gateway-clientinfo_override)</code>



- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all of the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs


## gateway:dtls_listener

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

  Default = `16`

- udp: <code>[gateway:udp_opts](#gateway-udp_opts)</code>

- enable: <code>boolean()</code>

  Default = `true`

- bind: <code>emqx_gateway_schema:ip_port() | integer()</code>

- max_connections: <code>integer()</code>

  Default = `1024`

- max_conn_rate: <code>integer()</code>

  Default = `1000`

- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all of the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs

- mountpoint: <code>binary()</code>

- access_rules: <code>[string()]</code>

  Default = `[]`

- dtls: <code>[gateway:dtls_opts](#gateway-dtls_opts)</code>

  DTLS listener options


## gateway:dtls_opts

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

  Default = `false`

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
  Although the root CA certificate is optional, it should placed at the end of
  the file if it is to be added.


- keyfile: <code>string()</code>

  PEM format private key file.<br>


- verify: <code>verify_peer | verify_none</code>

  Default = `verify_none`

- reuse_sessions: <code>boolean()</code>

  Default = `true`

- depth: <code>integer()</code>

  Default = `10`

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  keyfile is password-protected.

- versions: <code>[atom()]</code>

  Default = `[dtlsv1.2, dtlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.


- ciphers: <code>[string()]</code>

  Default = `["ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

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
  All default values and examples proveded by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>

  Default = `"emqx_tls_psk:lookup"`

- secure_renegotiate: <code>boolean()</code>

  Default = `true`


  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.


- dhfile: <code>string()</code>

  Path to a file containing PEM-encoded Diffie Hellman parameters
  to be used by the server if a cipher suite using Diffie Hellman
  key exchange is negotiated. If not specified, default parameters
  are used.<br>
  NOTE: The dhfile option is not supported by TLS 1.3.

- fail_if_no_peer_cert: <code>boolean()</code>

  Default = `false`


  Used together with {verify, verify_peer} by an TLS/DTLS server.
  If set to true, the server fails if the client does not have a
  certificate to send, that is, sends an empty certificate.
  If set to false, it fails only if the client sends an invalid
  certificate (an empty certificate is considered valid).


- honor_cipher_order: <code>boolean()</code>

  Default = `true`

- client_renegotiation: <code>boolean()</code>

  Default = `true`


  In protocols that support client-initiated renegotiation,
  the cost of resources of such an operation is higher for the server than the client.
  This can act as a vector for denial of service attacks.
  The SSL application already takes measures to counter-act such attempts,
  but client-initiated renegotiation can be strictly disabled by setting this option to false.
  The default value is true. Note that disabling renegotiation can result in
  long-lived connections becoming unusable due to limits on
  the number of messages the underlying cipher suite can encipher.



## gateway:exproto

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

  Default = `true`

  Whether to enable this gateway

- enable_stats: <code>boolean()</code>

  Default = `true`

  Whether to enable client process statistic

- idle_timeout: <code>emqx_gateway_schema:duration()</code>

  Default = `"30s"`

  The idle time of the client connection process.<br>
  it has two purposes:
  1. A newly created client process that does not receive any client requests
     after that time will be closed directly.
  2. A running client process that does not receive any client requests after
     this time will go into hibernation to save resources.

- mountpoint: <code>binary()</code>

  Default = `""`



- clientinfo_override: <code>[gateway:clientinfo_override](#gateway-clientinfo_override)</code>



- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all of the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs


## gateway:exproto_grpc_handler

**Config paths**

 - <code>gateway.exproto.handler</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__HANDLER</code>


**Fields**

- address: <code>binary()</code>

- ssl: <code>[gateway:ssl_client_opts](#gateway-ssl_client_opts)</code>


## gateway:exproto_grpc_server

**Config paths**

 - <code>gateway.exproto.server</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__SERVER</code>


**Fields**

- bind: <code>emqx_gateway_schema:ip_port() | integer()</code>

- ssl: <code>[gateway:ssl_server_opts](#gateway-ssl_server_opts)</code>


## gateway

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

**Config paths**

 - <code>gateway.lwm2m</code>


**Env overrides**

 - <code>EMQX_GATEWAY__LWM2M</code>


**Fields**

- xml_dir: <code>binary()</code>

  Default = `"etc/lwm2m_xml"`

  The Directory for LwM2M Resource defination

- lifetime_min: <code>emqx_gateway_schema:duration()</code>

  Default = `"15s"`

  Minimum value of lifetime allowed to be set by the LwM2M client

- lifetime_max: <code>emqx_gateway_schema:duration()</code>

  Default = `"86400s"`

  Maximum value of lifetime allowed to be set by the LwM2M client

- qmode_time_window: <code>emqx_gateway_schema:duration_s()</code>

  Default = `"22s"`

  The value of the time window during which the network link is considered
  valid by the LwM2M Gateway in QMode mode.<br>
  For example, after receiving an update message from a client, any messages
  within this time window are sent directly to the LwM2M client, and all messages
  beyond this time window are temporarily stored in memory.

- auto_observe: <code>boolean()</code>

  Default = `false`

  Automatically observe the object list of REGISTER packet

- update_msg_publish_condition: <code>always | contains_object_list</code>

  Default = `"contains_object_list"`

  Policy for publishing UPDATE event message to EMQX.<br>
    - always: send update events as long as the UPDATE request is received.
    - contains_object_list: send update events only if the UPDATE request carries any Object List.

- translators: <code>[gateway:lwm2m_translators](#gateway-lwm2m_translators)</code>

  Topic configuration for LwM2M's gateway publishing and subscription

- listeners: <code>[gateway:udp_listeners](#gateway-udp_listeners)</code>

- enable: <code>boolean()</code>

  Default = `true`

  Whether to enable this gateway

- enable_stats: <code>boolean()</code>

  Default = `true`

  Whether to enable client process statistic

- idle_timeout: <code>emqx_gateway_schema:duration()</code>

  Default = `"30s"`

  The idle time of the client connection process.<br>
  it has two purposes:
  1. A newly created client process that does not receive any client requests
     after that time will be closed directly.
  2. A running client process that does not receive any client requests after
     this time will go into hibernation to save resources.

- mountpoint: <code>binary()</code>

  Default = `""`



- clientinfo_override: <code>[gateway:clientinfo_override](#gateway-clientinfo_override)</code>



- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all of the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs


## gateway:lwm2m_translators

**Config paths**

 - <code>gateway.lwm2m.translators</code>


**Env overrides**

 - <code>EMQX_GATEWAY__LWM2M__TRANSLATORS</code>


**Fields**

- command: <code>[gateway:translator](#gateway-translator)</code>

  The topic for receiving downstream commands.<br>
  For each new LwM2M client that succeeds in going online, the gateway creates
  a the subscription relationship to receive downstream commands and send it to
  the LwM2M client

- response: <code>[gateway:translator](#gateway-translator)</code>

  The topic for gateway to publish the acknowledge events from LwM2M client

- notify: <code>[gateway:translator](#gateway-translator)</code>

  The topic for gateway to publish the notify events from LwM2M client.<br>
  After succeed observe a resource of LwM2M client, Gateway will send the
  notifyevents via this topic, if the client reports any resource changes

- register: <code>[gateway:translator](#gateway-translator)</code>

  The topic for gateway to publish the register events from LwM2M client.<br>

- update: <code>[gateway:translator](#gateway-translator)</code>

  The topic for gateway to publish the update events from LwM2M client.<br>


## gateway:mqttsn

**Config paths**

 - <code>gateway.mqttsn</code>


**Env overrides**

 - <code>EMQX_GATEWAY__MQTTSN</code>


**Fields**

- gateway_id: <code>integer()</code>

  Default = `1`

  MQTT-SN Gateway Id.<br>
  When the <code>broadcast</code> option is enabled,
  the gateway will broadcast ADVERTISE message with this value

- broadcast: <code>boolean()</code>

  Default = `false`

  Whether to periodically broadcast ADVERTISE messages

- enable_qos3: <code>boolean()</code>

  Default = `true`

  Allows connectionless clients to publish messages with a Qos of -1.<br>
  This feature is defined for very simple client implementations
  which do not support any other features except this one.<br>
  There is no connection setup nor tear down, no registration nor subscription.<br>
  The client just sends its PUBLISH messages to a GW

- predefined: <code>[[gateway:mqttsn_predefined](#gateway-mqttsn_predefined)]</code>

  Default = `[]`

  The Pre-defined topic ids and topic names.<br>
  A 'pre-defined' topic id is a topic id whose mapping to a topic name
  is known in advance by both the clients application and the gateway

- listeners: <code>[gateway:udp_listeners](#gateway-udp_listeners)</code>

- enable: <code>boolean()</code>

  Default = `true`

  Whether to enable this gateway

- enable_stats: <code>boolean()</code>

  Default = `true`

  Whether to enable client process statistic

- idle_timeout: <code>emqx_gateway_schema:duration()</code>

  Default = `"30s"`

  The idle time of the client connection process.<br>
  it has two purposes:
  1. A newly created client process that does not receive any client requests
     after that time will be closed directly.
  2. A running client process that does not receive any client requests after
     this time will go into hibernation to save resources.

- mountpoint: <code>binary()</code>

  Default = `""`



- clientinfo_override: <code>[gateway:clientinfo_override](#gateway-clientinfo_override)</code>



- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all of the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs


## gateway:mqttsn_predefined

**Config paths**

 - <code>gateway.mqttsn.predefined.$INDEX</code>


**Env overrides**

 - <code>EMQX_GATEWAY__MQTTSN__PREDEFINED__$INDEX</code>


**Fields**

- id: <code>integer()</code>

  Topic Id.<br>Range: 1-65535

- topic: <code>binary()</code>

  Topic Name


## gateway:ssl_client_opts

**Config paths**

 - <code>gateway.exproto.handler.ssl</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__HANDLER__SSL</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `false`

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
  Although the root CA certificate is optional, it should placed at the end of
  the file if it is to be added.


- keyfile: <code>string()</code>

  PEM format private key file.<br>


- verify: <code>verify_peer | verify_none</code>

  Default = `verify_none`

- reuse_sessions: <code>boolean()</code>

  Default = `true`

- depth: <code>integer()</code>

  Default = `10`

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  keyfile is password-protected.

- versions: <code>[atom()]</code>

  Default = `[tlsv1.3, tlsv1.2, tlsv1.1, tlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.


- ciphers: <code>[string()]</code>

  Default = `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256", "TLS_AES_128_CCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

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
  All default values and examples proveded by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>

  Default = `"emqx_tls_psk:lookup"`

- secure_renegotiate: <code>boolean()</code>

  Default = `true`


  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.


- server_name_indication: <code>disable | string()</code>

  Specify the host name to be used in TLS Server Name Indication extension.<br>
  For instance, when connecting to "server.example.net", the genuine server
  which accedpts the connection and performs TLS handshake may differ from the
  host the TLS client initially connects to, e.g. when connecting to an IP address
  or when the host has multiple resolvable DNS records <br>
  If not specified, it will default to the host name string which is used
  to establish the connection, unless it is IP addressed used.<br>
  The host name is then also used in the host name verification of the peer
  certificate.<br> The special value 'disable' prevents the Server Name
  Indication extension from being sent and disables the hostname
  verification check.


## gateway:ssl_listener

**Config paths**

 - <code>gateway.exproto.listeners.ssl.$name</code>
 - <code>gateway.stomp.listeners.ssl.$name</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__SSL__$NAME</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__SSL__$NAME</code>


**Fields**

- acceptors: <code>integer()</code>

  Default = `16`

- tcp: <code>[tcp_opts](#tcp_opts)</code>

- proxy_protocol: <code>boolean()</code>

  Default = `false`

- proxy_protocol_timeout: <code>emqx_gateway_schema:duration()</code>

  Default = `"15s"`

- enable: <code>boolean()</code>

  Default = `true`

- bind: <code>emqx_gateway_schema:ip_port() | integer()</code>

- max_connections: <code>integer()</code>

  Default = `1024`

- max_conn_rate: <code>integer()</code>

  Default = `1000`

- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all of the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs

- mountpoint: <code>binary()</code>

- access_rules: <code>[string()]</code>

  Default = `[]`

- ssl: <code>[listener_ssl_opts](#listener_ssl_opts)</code>

  SSL listener options


## gateway:ssl_server_opts

**Config paths**

 - <code>gateway.exproto.server.ssl</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__SERVER__SSL</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `false`

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
  Although the root CA certificate is optional, it should placed at the end of
  the file if it is to be added.


- keyfile: <code>string()</code>

  PEM format private key file.<br>


- verify: <code>verify_peer | verify_none</code>

  Default = `verify_none`

- reuse_sessions: <code>boolean()</code>

  Default = `true`

- depth: <code>integer()</code>

  Default = `10`

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  keyfile is password-protected.

- versions: <code>[atom()]</code>

  Default = `[tlsv1.3, tlsv1.2, tlsv1.1, tlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.


- ciphers: <code>[string()]</code>

  Default = `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256", "TLS_AES_128_CCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

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
  All default values and examples proveded by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>

  Default = `"emqx_tls_psk:lookup"`

- secure_renegotiate: <code>boolean()</code>

  Default = `true`


  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.


- dhfile: <code>string()</code>

  Path to a file containing PEM-encoded Diffie Hellman parameters
  to be used by the server if a cipher suite using Diffie Hellman
  key exchange is negotiated. If not specified, default parameters
  are used.<br>
  NOTE: The dhfile option is not supported by TLS 1.3.

- fail_if_no_peer_cert: <code>boolean()</code>

  Default = `false`


  Used together with {verify, verify_peer} by an TLS/DTLS server.
  If set to true, the server fails if the client does not have a
  certificate to send, that is, sends an empty certificate.
  If set to false, it fails only if the client sends an invalid
  certificate (an empty certificate is considered valid).


- honor_cipher_order: <code>boolean()</code>

  Default = `true`

- client_renegotiation: <code>boolean()</code>

  Default = `true`


  In protocols that support client-initiated renegotiation,
  the cost of resources of such an operation is higher for the server than the client.
  This can act as a vector for denial of service attacks.
  The SSL application already takes measures to counter-act such attempts,
  but client-initiated renegotiation can be strictly disabled by setting this option to false.
  The default value is true. Note that disabling renegotiation can result in
  long-lived connections becoming unusable due to limits on
  the number of messages the underlying cipher suite can encipher.


- handshake_timeout: <code>emqx_schema:duration()</code>

  Default = `"15s"`

  Maximum time duration allowed for the handshake to complete


## gateway:stomp

**Config paths**

 - <code>gateway.stomp</code>


**Env overrides**

 - <code>EMQX_GATEWAY__STOMP</code>


**Fields**

- frame: <code>[gateway:stomp_frame](#gateway-stomp_frame)</code>

- listeners: <code>[gateway:tcp_listeners](#gateway-tcp_listeners)</code>

- enable: <code>boolean()</code>

  Default = `true`

  Whether to enable this gateway

- enable_stats: <code>boolean()</code>

  Default = `true`

  Whether to enable client process statistic

- idle_timeout: <code>emqx_gateway_schema:duration()</code>

  Default = `"30s"`

  The idle time of the client connection process.<br>
  it has two purposes:
  1. A newly created client process that does not receive any client requests
     after that time will be closed directly.
  2. A running client process that does not receive any client requests after
     this time will go into hibernation to save resources.

- mountpoint: <code>binary()</code>

  Default = `""`



- clientinfo_override: <code>[gateway:clientinfo_override](#gateway-clientinfo_override)</code>



- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all of the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs


## gateway:stomp_frame

**Config paths**

 - <code>gateway.stomp.frame</code>


**Env overrides**

 - <code>EMQX_GATEWAY__STOMP__FRAME</code>


**Fields**

- max_headers: <code>integer()</code>

  Default = `10`

  The maximum number of Header

- max_headers_length: <code>integer()</code>

  Default = `1024`

  The maximum string length of the Header Value

- max_body_length: <code>integer()</code>

  Default = `65536`

  Maximum number of bytes of Body allowed per Stomp packet


## gateway:tcp_listener

**Config paths**

 - <code>gateway.exproto.listeners.tcp.$name</code>
 - <code>gateway.stomp.listeners.tcp.$name</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS__TCP__$NAME</code>
 - <code>EMQX_GATEWAY__STOMP__LISTENERS__TCP__$NAME</code>


**Fields**

- acceptors: <code>integer()</code>

  Default = `16`

- tcp: <code>[tcp_opts](#tcp_opts)</code>

- proxy_protocol: <code>boolean()</code>

  Default = `false`

- proxy_protocol_timeout: <code>emqx_gateway_schema:duration()</code>

  Default = `"15s"`

- enable: <code>boolean()</code>

  Default = `true`

- bind: <code>emqx_gateway_schema:ip_port() | integer()</code>

- max_connections: <code>integer()</code>

  Default = `1024`

- max_conn_rate: <code>integer()</code>

  Default = `1000`

- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all of the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs

- mountpoint: <code>binary()</code>

- access_rules: <code>[string()]</code>

  Default = `[]`


## gateway:tcp_listeners

**Config paths**

 - <code>gateway.stomp.listeners</code>


**Env overrides**

 - <code>EMQX_GATEWAY__STOMP__LISTENERS</code>


**Fields**

- tcp: <code>{$name -> [gateway:tcp_listener](#gateway-tcp_listener)}</code>

- ssl: <code>{$name -> [gateway:ssl_listener](#gateway-ssl_listener)}</code>


## gateway:translator

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

- qos: <code>0..2</code>

  Default = `0`


## gateway:udp_listener

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

  Default = `true`

- bind: <code>emqx_gateway_schema:ip_port() | integer()</code>

- max_connections: <code>integer()</code>

  Default = `1024`

- max_conn_rate: <code>integer()</code>

  Default = `1000`

- authentication: <code>[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)</code>

  Default authentication configs for all of the gateway listeners.<br>
  For per-listener overrides see <code>authentication</code>
  in listener configs

- mountpoint: <code>binary()</code>

- access_rules: <code>[string()]</code>

  Default = `[]`


## gateway:udp_listeners

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

- dtls: <code>{$name -> [gateway:dtls_listener](#gateway-dtls_listener)}</code>


## gateway:udp_opts

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

  Default = `100`

- recbuf: <code>emqx_gateway_schema:bytesize()</code>

- sndbuf: <code>emqx_gateway_schema:bytesize()</code>

- buffer: <code>emqx_gateway_schema:bytesize()</code>

- reuseaddr: <code>boolean()</code>

  Default = `true`


## gateway:udp_tcp_listeners

**Config paths**

 - <code>gateway.exproto.listeners</code>


**Env overrides**

 - <code>EMQX_GATEWAY__EXPROTO__LISTENERS</code>


**Fields**

- udp: <code>{$name -> [gateway:udp_listener](#gateway-udp_listener)}</code>

- dtls: <code>{$name -> [gateway:dtls_listener](#gateway-dtls_listener)}</code>

- tcp: <code>{$name -> [gateway:tcp_listener](#gateway-tcp_listener)}</code>

- ssl: <code>{$name -> [gateway:ssl_listener](#gateway-ssl_listener)}</code>


## modules:delayed

**Config paths**

 - <code>delayed</code>


**Env overrides**

 - <code>EMQX_DELAYED</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `false`

- max_delayed_messages: <code>integer()</code>


## modules:event_message

**Config paths**

 - <code>event_message</code>


**Env overrides**

 - <code>EMQX_EVENT_MESSAGE</code>


**Fields**

- $event/client_connected: <code>boolean()</code>

  Default = `false`

- $event/client_disconnected: <code>boolean()</code>

  Default = `false`

- $event/client_subscribed: <code>boolean()</code>

  Default = `false`

- $event/client_unsubscribed: <code>boolean()</code>

  Default = `false`

- $event/message_delivered: <code>boolean()</code>

  Default = `false`

- $event/message_acked: <code>boolean()</code>

  Default = `false`

- $event/message_dropped: <code>boolean()</code>

  Default = `false`


## modules:rewrite

**Config paths**

 - <code>rewrite.$INDEX</code>


**Env overrides**

 - <code>EMQX_REWRITE__$INDEX</code>


**Fields**

- action: <code>subscribe | publish | all</code>

  Action

- source_topic: <code>binary()</code>

  Origin Topic

- dest_topic: <code>binary()</code>

  Destination Topic

- re: <code>binary()</code>

  Regular expressions


## modules:telemetry

**Config paths**

 - <code>telemetry</code>


**Env overrides**

 - <code>EMQX_TELEMETRY</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `false`


## modules:topic_metrics

**Config paths**

 - <code>topic_metrics.$INDEX</code>


**Env overrides**

 - <code>EMQX_TOPIC_METRICS__$INDEX</code>


**Fields**

- topic: <code>binary()</code>


## rule_engine:builtin_output_console

**Config paths**

 - <code>rule_engine.rules.$id.outputs.$INDEX</code>


**Env overrides**

 - <code>EMQX_RULE_ENGINE__RULES__$ID__OUTPUTS__$INDEX</code>


**Fields**

- function: <code>console</code>

  Print the outputs to the console


## rule_engine:builtin_output_republish

**Config paths**

 - <code>rule_engine.rules.$id.outputs.$INDEX</code>


**Env overrides**

 - <code>EMQX_RULE_ENGINE__RULES__$ID__OUTPUTS__$INDEX</code>


**Fields**

- function: <code>republish</code>

  Republish the message as a new MQTT message

- args: <code>[rule_engine:republish_args](#rule_engine-republish_args)</code>

  Default = `{}`


  The arguments of the built-in 'republish' output.<br>
  We can use variables in the args.<br>

  The variables are selected by the rule. For exmaple, if the rule SQL is defined as following:
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
  When the rule is triggered by an MQTT message with payload = "hello", qos = 1,
  clientid = "steve", the rule will republish a new MQTT message to topic "t/steve",
  payload = "msg: hello", and qos = 1.



## rule_engine:republish_args

**Config paths**

 - <code>rule_engine.rules.$id.outputs.$INDEX.args</code>


**Env overrides**

 - <code>EMQX_RULE_ENGINE__RULES__$ID__OUTPUTS__$INDEX__ARGS</code>


**Fields**

- topic: <code>binary()</code>


  The target topic of message to be re-published.<br>
  Template with variables is allowed, see description of the 'republish_args'.


- qos: <code>0 | 1 | 2 | binary()</code>

  Default = `"${qos}"`


  The qos of the message to be re-published.
  Template with with variables is allowed, see description of the 'republish_args.<br>
  Defaults to ${qos}. If variable ${qos} is not found from the selected result of the rule,
  0 is used.


- retain: <code>binary() | boolean()</code>

  Default = `"${retain}"`


  The retain flag of the message to be re-published.
  Template with with variables is allowed, see description of the 'republish_args.<br>
  Defaults to ${retain}. If variable ${retain} is not found from the selected result
  of the rule, false is used.


- payload: <code>binary()</code>

  Default = `"${payload}"`


  The payload of the message to be re-published.
  Template with with variables is allowed, see description of the 'republish_args.<br>.
  Defaults to ${payload}. If variable ${payload} is not found from the selected result
  of the rule, then the string "undefined" is used.



## rule_engine

**Config paths**

 - <code>rule_engine</code>


**Env overrides**

 - <code>EMQX_RULE_ENGINE</code>


**Fields**

- ignore_sys_message: <code>boolean()</code>

  Default = `true`

  When set to 'true' (default), rule-engine will ignore messages published to $SYS topics.

- rules: <code>{$id -> [rule_engine:rules](#rule_engine-rules)}</code>

  Default = `{}`

  The rules


## rule_engine:rules

**Config paths**

 - <code>rule_engine.rules.$id</code>


**Env overrides**

 - <code>EMQX_RULE_ENGINE__RULES__$ID</code>


**Fields**

- name: <code>binary()</code>

  Default = `[]`

  The name of the rule

- sql: <code>binary()</code>


  SQL query to transform the messages.<br>
  Example: <code>SELECT * FROM "test/topic" WHERE payload.x = 1</code><br>


- outputs: <code>[binary() | [rule_engine:builtin_output_republish](#rule_engine-builtin_output_republish) | [rule_engine:builtin_output_console](#rule_engine-builtin_output_console) | [rule_engine:user_provided_function](#rule_engine-user_provided_function)]</code>

  Default = `[]`


  A list of outputs of the rule.<br>
  An output can be a string that refers to the channel Id of a emqx bridge, or a object
  that refers to a function.<br>
  There a some built-in functions like "republish" and "console", and we also support user
  provided functions in the format: "{module}:{function}".<br>
  The outputs in the list is executed one by one in order.
  This means that if one of the output is executing slowly, all of the outputs comes after it will not
  be executed until it returns.<br>
  If one of the output crashed, all other outputs come after it will still be executed, in the
  original order.<br>
  If there's any error when running an output, there will be an error message, and the 'failure'
  counter of the function output or the bridge channel will increase.


- enable: <code>boolean()</code>

  Default = `true`

  Enable or disable the rule

- description: <code>binary()</code>

  Default = `""`

  The description of the rule


## rule_engine:user_provided_function

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

  Default = `{}`


  The args will be passed as the 3rd argument to module:function/3,
  checkout the function <code>console</code> and <code>republish</code> in the source file:
  <code>apps/emqx_rule_engine/src/emqx_rule_outputs.erl</code> as an example.



## bridges

**Config paths**

 - <code>bridges</code>


**Env overrides**

 - <code>EMQX_BRIDGES</code>


**Fields**

- http: <code>{$name -> [bridge](#bridge)}</code>

- mqtt: <code>{$name -> [ingress](#ingress) | [egress](#egress)}</code>


## bucket

**Config paths**

 - <code>emqx_limiter.bytes_in.bucket.$bucket id</code>
 - <code>emqx_limiter.connection.bucket.$bucket id</code>
 - <code>emqx_limiter.message_in.bucket.$bucket id</code>
 - <code>emqx_limiter.message_routing.bucket.$bucket id</code>


**Env overrides**

 - <code>EMQX_EMQX_LIMITER__BYTES_IN__BUCKET__$BUCKET ID</code>
 - <code>EMQX_EMQX_LIMITER__CONNECTION__BUCKET__$BUCKET ID</code>
 - <code>EMQX_EMQX_LIMITER__MESSAGE_IN__BUCKET__$BUCKET ID</code>
 - <code>EMQX_EMQX_LIMITER__MESSAGE_ROUTING__BUCKET__$BUCKET ID</code>


**Fields**

- zone: <code>atom()</code>

  the zone which the bucket in

- aggregated: <code>[bucket_aggregated](#bucket_aggregated)</code>

- per_client: <code>[client_bucket](#client_bucket)</code>


## bucket_aggregated

**Config paths**

 - <code>emqx_limiter.bytes_in.bucket.$bucket id.aggregated</code>
 - <code>emqx_limiter.connection.bucket.$bucket id.aggregated</code>
 - <code>emqx_limiter.message_in.bucket.$bucket id.aggregated</code>
 - <code>emqx_limiter.message_routing.bucket.$bucket id.aggregated</code>


**Env overrides**

 - <code>EMQX_EMQX_LIMITER__BYTES_IN__BUCKET__$BUCKET ID__AGGREGATED</code>
 - <code>EMQX_EMQX_LIMITER__CONNECTION__BUCKET__$BUCKET ID__AGGREGATED</code>
 - <code>EMQX_EMQX_LIMITER__MESSAGE_IN__BUCKET__$BUCKET ID__AGGREGATED</code>
 - <code>EMQX_EMQX_LIMITER__MESSAGE_ROUTING__BUCKET__$BUCKET ID__AGGREGATED</code>


**Fields**

- rate: <code>emqx_limiter_schema:rate()</code>

- initial: <code>emqx_limiter_schema:initial()</code>

  Default = `"0"`

- capacity: <code>emqx_limiter_schema:capacity()</code>


## client_bucket

**Config paths**

 - <code>emqx_limiter.bytes_in.bucket.$bucket id.per_client</code>
 - <code>emqx_limiter.connection.bucket.$bucket id.per_client</code>
 - <code>emqx_limiter.message_in.bucket.$bucket id.per_client</code>
 - <code>emqx_limiter.message_routing.bucket.$bucket id.per_client</code>


**Env overrides**

 - <code>EMQX_EMQX_LIMITER__BYTES_IN__BUCKET__$BUCKET ID__PER_CLIENT</code>
 - <code>EMQX_EMQX_LIMITER__CONNECTION__BUCKET__$BUCKET ID__PER_CLIENT</code>
 - <code>EMQX_EMQX_LIMITER__MESSAGE_IN__BUCKET__$BUCKET ID__PER_CLIENT</code>
 - <code>EMQX_EMQX_LIMITER__MESSAGE_ROUTING__BUCKET__$BUCKET ID__PER_CLIENT</code>


**Fields**

- rate: <code>emqx_limiter_schema:rate()</code>

- initial: <code>emqx_limiter_schema:initial()</code>

  Default = `"0"`

- low_water_mark: <code>emqx_limiter_schema:initial()</code>

  Default = `"0"`

  if the remaining tokens are lower than this value,
  the check/consume will succeed, but it will be forced to hang for a short period of time

- capacity: <code>emqx_limiter_schema:capacity()</code>

  the capacity of the token bucket

- divisible: <code>boolean()</code>

  Default = `false`

  is it possible to split the number of tokens requested

- max_retry_time: <code>emqx_schema:duration()</code>

  Default = `"5s"`

  the maximum retry time when acquire failed

- failure_strategy: <code>emqx_limiter_schema:failure_strategy()</code>

  Default = `force`

  the strategy when all retry failed


## cluster_dns

**Config paths**

 - <code>cluster.dns</code>


**Env overrides**

 - <code>EMQX_CLUSTER__DNS</code>


**Fields**

- name: <code>string()</code>

  Default = `"localhost"`

- app: <code>string()</code>

  Default = `"emqx"`


## cluster_etcd

**Config paths**

 - <code>cluster.etcd</code>


**Env overrides**

 - <code>EMQX_CLUSTER__ETCD</code>


**Fields**

- server: <code>emqx_schema:comma_separated_list()</code>

- prefix: <code>string()</code>

  Default = `"emqxcl"`

- node_ttl: <code>emqx_schema:duration()</code>

  Default = `"1m"`

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>


## cluster_k8s

**Config paths**

 - <code>cluster.k8s</code>


**Env overrides**

 - <code>EMQX_CLUSTER__K8S</code>


**Fields**

- apiserver: <code>string()</code>

- service_name: <code>string()</code>

  Default = `"emqx"`

- address_type: <code>ip | dns | hostname</code>

- app_name: <code>string()</code>

  Default = `"emqx"`

- namespace: <code>string()</code>

  Default = `"default"`

- suffix: <code>string()</code>

  Default = `"pod.local"`


## cluster_mcast

**Config paths**

 - <code>cluster.mcast</code>


**Env overrides**

 - <code>EMQX_CLUSTER__MCAST</code>


**Fields**

- addr: <code>string()</code>

  Default = `"239.192.0.1"`

- ports: <code>[integer()]</code>

  Default = `[4369,4370]`

- iface: <code>string()</code>

  Default = `"0.0.0.0"`

- ttl: <code>0..255</code>

  Default = `255`

- loop: <code>boolean()</code>

  Default = `true`

- sndbuf: <code>emqx_schema:bytesize()</code>

  Default = `"16KB"`

- recbuf: <code>emqx_schema:bytesize()</code>

  Default = `"16KB"`

- buffer: <code>emqx_schema:bytesize()</code>

  Default = `"32KB"`


## cluster_static

**Config paths**

 - <code>cluster.static</code>


**Env overrides**

 - <code>EMQX_CLUSTER__STATIC</code>


**Fields**

- seeds: <code>[string()]</code>

  Default = `[]`


## emqx_limiter

**Config paths**

 - <code>emqx_limiter</code>


**Env overrides**

 - <code>EMQX_EMQX_LIMITER</code>


**Fields**

- bytes_in: <code>[limiter](#limiter)</code>

- message_in: <code>[limiter](#limiter)</code>

- connection: <code>[limiter](#limiter)</code>

- message_routing: <code>[limiter](#limiter)</code>


## flow_control

**Config paths**

 - <code>emqx_retainer.flow_control</code>


**Env overrides**

 - <code>EMQX_EMQX_RETAINER__FLOW_CONTROL</code>


**Fields**

- max_read_number: <code>integer()</code>

  Default = `0`

- msg_deliver_quota: <code>integer()</code>

  Default = `0`

- quota_release_interval: <code>emqx_schema:duration_ms()</code>

  Default = `"0ms"`


## limiter

**Config paths**

 - <code>emqx_limiter.bytes_in</code>
 - <code>emqx_limiter.connection</code>
 - <code>emqx_limiter.message_in</code>
 - <code>emqx_limiter.message_routing</code>


**Env overrides**

 - <code>EMQX_EMQX_LIMITER__BYTES_IN</code>
 - <code>EMQX_EMQX_LIMITER__CONNECTION</code>
 - <code>EMQX_EMQX_LIMITER__MESSAGE_IN</code>
 - <code>EMQX_EMQX_LIMITER__MESSAGE_ROUTING</code>


**Fields**

- global: <code>[rate_burst](#rate_burst)</code>

- zone: <code>{$zone name -> [rate_burst](#rate_burst)}</code>

- bucket: <code>{$bucket id -> [bucket](#bucket)}</code>

  token bucket


## mnesia_config

**Config paths**

 - <code>emqx_retainer.config</code>


**Env overrides**

 - <code>EMQX_EMQX_RETAINER__CONFIG</code>


**Fields**

- type: <code>built_in_database</code>

- storage_type: <code>ram | disc</code>

  Default = `ram`

- max_retained_messages: <code>integer()</code>

  Default = `0`


## rate_burst

**Config paths**

 - <code>emqx_limiter.bytes_in.global</code>
 - <code>emqx_limiter.bytes_in.zone.$zone name</code>
 - <code>emqx_limiter.connection.global</code>
 - <code>emqx_limiter.connection.zone.$zone name</code>
 - <code>emqx_limiter.message_in.global</code>
 - <code>emqx_limiter.message_in.zone.$zone name</code>
 - <code>emqx_limiter.message_routing.global</code>
 - <code>emqx_limiter.message_routing.zone.$zone name</code>


**Env overrides**

 - <code>EMQX_EMQX_LIMITER__BYTES_IN__GLOBAL</code>
 - <code>EMQX_EMQX_LIMITER__BYTES_IN__ZONE__$ZONE NAME</code>
 - <code>EMQX_EMQX_LIMITER__CONNECTION__GLOBAL</code>
 - <code>EMQX_EMQX_LIMITER__CONNECTION__ZONE__$ZONE NAME</code>
 - <code>EMQX_EMQX_LIMITER__MESSAGE_IN__GLOBAL</code>
 - <code>EMQX_EMQX_LIMITER__MESSAGE_IN__ZONE__$ZONE NAME</code>
 - <code>EMQX_EMQX_LIMITER__MESSAGE_ROUTING__GLOBAL</code>
 - <code>EMQX_EMQX_LIMITER__MESSAGE_ROUTING__ZONE__$ZONE NAME</code>


**Fields**

- rate: <code>emqx_limiter_schema:rate()</code>

- burst: <code>emqx_limiter_schema:burst_rate()</code>

  Default = `"0/0s"`


## ssl_client_opts

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

  Default = `false`

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
  Although the root CA certificate is optional, it should placed at the end of
  the file if it is to be added.


- keyfile: <code>string()</code>

  PEM format private key file.<br>


- verify: <code>verify_peer | verify_none</code>

  Default = `verify_none`

- reuse_sessions: <code>boolean()</code>

  Default = `true`

- depth: <code>integer()</code>

  Default = `10`

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  keyfile is password-protected.

- versions: <code>[atom()]</code>

  Default = `[tlsv1.3, tlsv1.2, tlsv1.1, tlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.


- ciphers: <code>[string()]</code>

  Default = `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256", "TLS_AES_128_CCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

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
  All default values and examples proveded by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>

  Default = `"emqx_tls_psk:lookup"`

- secure_renegotiate: <code>boolean()</code>

  Default = `true`


  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.


- server_name_indication: <code>disable | string()</code>

  Specify the host name to be used in TLS Server Name Indication extension.<br>
  For instance, when connecting to "server.example.net", the genuine server
  which accedpts the connection and performs TLS handshake may differ from the
  host the TLS client initially connects to, e.g. when connecting to an IP address
  or when the host has multiple resolvable DNS records <br>
  If not specified, it will default to the host name string which is used
  to establish the connection, unless it is IP addressed used.<br>
  The host name is then also used in the host name verification of the peer
  certificate.<br> The special value 'disable' prevents the Server Name
  Indication extension from being sent and disables the hostname
  verification check.


## topology

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

- pool_size: <code>integer()</code>

  Default = `8`

- max_overflow: <code>integer()</code>

  Default = `8`

- overflow_ttl: <code>emqx_schema:duration_ms()</code>

- overflow_check_period: <code>emqx_schema:duration_ms()</code>

- local_threshold_ms: <code>emqx_schema:duration_ms()</code>

- connect_timeout_ms: <code>emqx_schema:duration_ms()</code>

- socket_timeout_ms: <code>emqx_schema:duration_ms()</code>

- server_selection_timeout_ms: <code>emqx_schema:duration_ms()</code>

- wait_queue_timeout_ms: <code>emqx_schema:duration_ms()</code>

- heartbeat_frequency_ms: <code>emqx_schema:duration_ms()</code>

- min_heartbeat_frequency_ms: <code>emqx_schema:duration_ms()</code>


## alarm

**Config paths**

 - <code>alarm</code>


**Env overrides**

 - <code>EMQX_ALARM</code>


**Fields**

- actions: <code>[atom()]</code>

  Default = `[log, publish]`

  The actions triggered when the alarm is activated.<r>
  Currently supports two actions, 'log' and 'publish'.
  'log' is to write the alarm to log (console or file).
  'publish' is to publish the alarm as an MQTT message to the system topics:
  <code>$SYS/brokers/emqx@xx.xx.xx.x/alarms/activate</code> and
  <code>$SYS/brokers/emqx@xx.xx.xx.x/alarms/deactivate</code>

- size_limit: <code>1..3000</code>

  Default = `1000`

  The maximum total number of deactivated alarms to keep as history.<br>
  When this limit is exceeded, the oldest deactivated alarms are deleted to cap the total number.


- validity_period: <code>emqx_schema:duration()</code>

  Default = `"24h"`

  Retention time of deactivated alarms. Alarms are not deleted immediately
  when deactivated, but after the retention time.



## authorization

**Config paths**

 - <code>authorization</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION</code>


**Fields**

- no_match: <code>allow | deny</code>

  Default = `allow`


  Default access control action if the user or client matches no ACL rules,
  or if no such user or client is found by the configurable authorization
  sources such as built-in-database, an HTTP API, or a query against PostgreSQL.
  Find more details in 'authorization.sources' config.


- deny_action: <code>ignore | disconnect</code>

  Default = `ignore`

- cache: <code>[cache](#cache)</code>

- sources: <code>[[authz:file](#authz-file) | [authz:http_get](#authz-http_get) | [authz:http_post](#authz-http_post) | [authz:mnesia](#authz-mnesia) | [authz:mongo_single](#authz-mongo_single) | [authz:mongo_rs](#authz-mongo_rs) | [authz:mongo_sharded](#authz-mongo_sharded) | [authz:mysql](#authz-mysql) | [authz:postgresql](#authz-postgresql) | [authz:redis_single](#authz-redis_single) | [authz:redis_sentinel](#authz-redis_sentinel) | [authz:redis_cluster](#authz-redis_cluster)]</code>

  Default = `[]`


  Authorization data sources.<br>
  An array of authorization (ACL) data providers.
  It is designed as an array but not a hash-map so the sources can be
  ordered to form a chain of access controls.<br>


  When authorizing a publish or subscribe action, the configured
  sources are checked in order. When checking an ACL source,
  in case the client (identified by username or client ID) is not found,
  it moves on to the next source. And it stops immediatly
  once an 'allow' or 'deny' decision is returned.<br>

  If the client is not found in any of the sources,
  the default action configured in 'authorization.no_match' is applied.<br>

  NOTE:
  The source elements are identified by their 'type'.
  It is NOT allowed to configure two or more sources of the same type.



## bridge

**Config paths**

 - <code>bridges.http.$name</code>


**Env overrides**

 - <code>EMQX_BRIDGES__HTTP__$NAME</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `true`

  Enable or disable this bridge

- name: <code>binary()</code>

  Bridge name, used as a human-readable description of the bridge.

- direction: <code>egress</code>

  Default = `egress`

  The direction of this bridge, MUST be egress

- connect_timeout: <code>emqx_schema:duration_ms()</code>

  Default = `"15s"`

  The timeout when connecting to the HTTP server

- max_retries: <code>non_neg_integer()</code>

  Default = `5`

  Max retry times if error on sending request

- retry_interval: <code>emqx_schema:duration()</code>

  Default = `"1s"`

  Interval before next retry if error on sending request

- pool_type: <code>emqx_connector_http:pool_type()</code>

  Default = `random`

  The type of the pool. Canbe one of random, hash

- pool_size: <code>non_neg_integer()</code>

  Default = `8`

  The pool size

- enable_pipelining: <code>boolean()</code>

  Default = `true`

  Enable the HTTP pipeline

- request: <code>[connector-http:request](#connector-http-request)</code>


  If the request is provided, the caller can send HTTP requests via
  <code>emqx_resource:query(ResourceId, {send_message, BridgeId, Message})</code>


- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`

- url: <code>binary()</code>


  The URL of the HTTP Bridge.<br>
  Template with variables is allowed in the path, but variables cannot be used in the scheme, host,
  or port part.<br>
  For example, <code> http://localhost:9901/${topic} </code> is allowed, but
  <code> http://${host}:9901/message </code> or <code> http://localhost:${port}/message </code>
  is not allowed.


- local_topic: <code>binary()</code>


  The MQTT topic filter to be forwarded to the HTTP server. All MQTT PUBLISH messages which topic
  match the local_topic will be forwarded.<br>
  NOTE: if this bridge is used as the output of a rule (emqx rule engine), and also local_topic is configured, then both the data got from the rule and the MQTT messages that matches
  local_topic will be forwarded.


- method: <code>post | put | get | delete</code>

  Default = `post`


  The method of the HTTP request. All the available methods are: post, put, get, delete.<br>
  Template with variables is allowed.<br>


- headers: <code>map()</code>

  Default = 
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

  Default = `"${payload}"`


  The body of the HTTP request.<br>
  Template with variables is allowed.


- request_timeout: <code>emqx_schema:duration_ms()</code>

  Default = `"15s"`


  How long will the HTTP request timeout.



## broker

**Config paths**

 - <code>broker</code>


**Env overrides**

 - <code>EMQX_BROKER</code>


**Fields**

- sys_msg_interval: <code>disabled | emqx_schema:duration()</code>

  Default = `"1m"`

- sys_heartbeat_interval: <code>disabled | emqx_schema:duration()</code>

  Default = `"30s"`

- enable_session_registry: <code>boolean()</code>

  Default = `true`

- session_locking_strategy: <code>local | leader | quorum | all</code>

  Default = `quorum`

- shared_subscription_strategy: <code>random | round_robin | sticky | hash_topic | hash_clientid</code>

  Default = `round_robin`

- shared_dispatch_ack_enabled: <code>boolean()</code>

  Default = `false`

- route_batch_clean: <code>boolean()</code>

  Default = `true`

- perf: <code>[broker_perf](#broker_perf)</code>

  Broker performance tuning pamaters


## broker_perf

**Config paths**

 - <code>broker.perf</code>


**Env overrides**

 - <code>EMQX_BROKER__PERF</code>


**Fields**

- route_lock_type: <code>key | tab | global</code>

  Default = `key`

- trie_compaction: <code>boolean()</code>

  Default = `true`


## cache

**Config paths**

 - <code>authorization.cache</code>


**Env overrides**

 - <code>EMQX_AUTHORIZATION__CACHE</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `true`

- max_size: <code>1..1048576</code>

  Default = `32`

- ttl: <code>emqx_schema:duration()</code>

  Default = `"1m"`


## cluster

**Config paths**

 - <code>cluster</code>


**Env overrides**

 - <code>EMQX_CLUSTER</code>


**Fields**

- name: <code>atom()</code>

  Default = `emqxcl`

- discovery_strategy: <code>manual | static | mcast | dns | etcd | k8s</code>

  Default = `manual`

- autoclean: <code>emqx_schema:duration()</code>

  Default = `"5m"`

- autoheal: <code>boolean()</code>

  Default = `true`

- static: <code>[cluster_static](#cluster_static)</code>

- mcast: <code>[cluster_mcast](#cluster_mcast)</code>

- proto_dist: <code>inet_tcp | inet6_tcp | inet_tls</code>

  Default = `inet_tcp`

- dns: <code>[cluster_dns](#cluster_dns)</code>

- etcd: <code>[cluster_etcd](#cluster_etcd)</code>

- k8s: <code>[cluster_k8s](#cluster_k8s)</code>


## cluster_call

**Config paths**

 - <code>node.cluster_call</code>


**Env overrides**

 - <code>EMQX_NODE__CLUSTER_CALL</code>


**Fields**

- retry_interval: <code>emqx_schema:duration()</code>

  Default = `"1s"`

  Time interval to retry after a failed call.

- max_history: <code>1..500</code>

  Default = `100`

  Retain the maximum number of completed transactions (for queries).

- cleanup_interval: <code>emqx_schema:duration()</code>

  Default = `"5m"`

  Time interval to clear completed but stale transactions.
  Ensure that the number of completed transactions is less than the max_history.


## conn_congestion

**Config paths**

 - <code>conn_congestion</code>


**Env overrides**

 - <code>EMQX_CONN_CONGESTION</code>


**Fields**

- enable_alarm: <code>boolean()</code>

  Default = `false`

- min_alarm_sustain_duration: <code>emqx_schema:duration()</code>

  Default = `"1m"`


## connector

**Config paths**

 - <code>connectors.mqtt.$name</code>


**Env overrides**

 - <code>EMQX_CONNECTORS__MQTT__$NAME</code>


**Fields**

- mode: <code>cluster_shareload</code>

  Default = `cluster_shareload`


  The mode of the MQTT Bridge. Can be one of 'cluster_singleton' or 'cluster_shareload'<br>

  - cluster_singleton: create an unique MQTT connection within the emqx cluster.<br>
  In 'cluster_singleton' node, all messages toward the remote broker go through the same
  MQTT connection.<br>
  - cluster_shareload: create an MQTT connection on each node in the emqx cluster.<br>
  In 'cluster_shareload' mode, the incomming load from the remote broker is shared by
  using shared subscription.<br>
  Note that the 'clientid' is suffixed by the node name, this is to avoid
  clientid conflicts between different nodes. And we can only use shared subscription
  topic filters for 'remote_topic' of ingress connections.


- name: <code>binary()</code>

  Connector name, used as a human-readable description of the connector.

- server: <code>emqx_schema:ip_port()</code>

  Default = `"127.0.0.1:1883"`

  The host and port of the remote MQTT broker

- reconnect_interval: <code>string()</code>

  Default = `"15s"`

  reconnect interval Time span. A text string with number followed by time units:
                      `ms` for milli-seconds,
                      `s` for seconds,
                      `m` for minutes,
                      `h` for hours;
                      or combined representation like `1h5m0s`

- proto_ver: <code>v3 | v4 | v5</code>

  Default = `v4`

  The MQTT protocol version

- username: <code>binary()</code>

  Default = `"emqx"`

  The username of the MQTT protocol

- password: <code>binary()</code>

  Default = `"emqx"`

  The password of the MQTT protocol

- clean_start: <code>boolean()</code>

  Default = `true`

  The clean-start or the clean-session of the MQTT protocol

- keepalive: <code>string()</code>

  Default = `"300s"`

  keepalive Time span. A text string with number followed by time units:
                      `ms` for milli-seconds,
                      `s` for seconds,
                      `m` for minutes,
                      `h` for hours;
                      or combined representation like `1h5m0s`

- retry_interval: <code>string()</code>

  Default = `"15s"`

  retry interval Time span. A text string with number followed by time units:
                      `ms` for milli-seconds,
                      `s` for seconds,
                      `m` for minutes,
                      `h` for hours;
                      or combined representation like `1h5m0s`

- max_inflight: <code>integer()</code>

  Default = `32`

  Max inflight messages (sent but ACK has not received) of the MQTT protocol

- replayq: <code>[replayq](#replayq)</code>


  Queue messages in disk files.


- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## connectors

**Config paths**

 - <code>connectors</code>


**Env overrides**

 - <code>EMQX_CONNECTORS</code>


**Fields**

- mqtt: <code>{$name -> [connector](#connector)}</code>

  MQTT bridges


## console_handler

**Config paths**

 - <code>log.console_handler</code>


**Env overrides**

 - <code>EMQX_LOG__CONSOLE_HANDLER</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `false`

- level: <code>emqx_conf_schema:log_level()</code>

  Default = `warning`

- time_offset: <code>string()</code>

  Default = `"system"`

- chars_limit: <code>unlimited | 1..inf</code>

  Default = `unlimited`

- formatter: <code>text | json</code>

  Default = `text`

- single_line: <code>boolean()</code>

  Default = `true`

- sync_mode_qlen: <code>integer()</code>

  Default = `100`

- drop_mode_qlen: <code>integer()</code>

  Default = `3000`

- flush_qlen: <code>integer()</code>

  Default = `8000`

- overload_kill: <code>[log_overload_kill](#log_overload_kill)</code>

- burst_limit: <code>[log_burst_limit](#log_burst_limit)</code>

- supervisor_reports: <code>error | progress</code>

  Default = `error`

- max_depth: <code>unlimited | integer()</code>

  Default = `100`


## db

**Config paths**

 - <code>db</code>


**Env overrides**

 - <code>EMQX_DB</code>


**Fields**

- backend: <code>mnesia | rlog</code>

  Default = `mnesia`


  Select the backend for the embedded database.<br/>
  <strong>Important!</strong> This setting should be the same on all nodes in the cluster.<br/>
  <strong>Important!</strong> Changing this setting in the runtime is not allowed.<br/>
  <code>mnesia</code> is the default backend, that offers decent performance in small clusters.<br/>
  <code>rlog</code> is a new experimantal backend that is suitable for very large clusters.


- role: <code>core | replicant</code>

  Default = `core`


  Select a node role.<br/>
  <code>core</code> nodes provide durability of the data, and take care of writes.
  It is recommended to place core nodes in different racks or different availability zones.<br/>
  <code>replicant</code> nodes are ephemeral worker nodes. Removing them from the cluster
  doesn't affect database redundancy<br/>
  It is recommended to have more replicant nodes than core nodes.<br/>
  Note: this parameter only takes effect when the <code>backend</code> is set
  to <code>rlog</code>.


- core_nodes: <code>emqx_schema:comma_separated_atoms()</code>

  Default = `[]`


  List of core nodes that the replicant will connect to.<br/>
  Note: this parameter only takes effect when the <code>backend</code> is set
  to <code>rlog</code> and the <code>role</code> is set to <code>replicant</code>.


- rpc_module: <code>gen_rpc | rpc</code>

  Default = `gen_rpc`


  Protocol used for pushing transaction logs to the replicant nodes.


- tlog_push_mode: <code>sync | async</code>

  Default = `async`


  In sync mode the core node waits for an ack from the replicant nodes before sending the next
  transaction log entry.



## deflate_opts

**Config paths**

 - <code>listeners.ws.$name.websocket.deflate_opts</code>
 - <code>listeners.wss.$name.websocket.deflate_opts</code>


**Env overrides**

 - <code>EMQX_LISTENERS__WS__$NAME__WEBSOCKET__DEFLATE_OPTS</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__WEBSOCKET__DEFLATE_OPTS</code>


**Fields**

- level: <code>none | default | best_compression | best_speed</code>

- mem_level: <code>1..9</code>

  Default = `8`

- strategy: <code>default | filtered | huffman_only | rle</code>

- server_context_takeover: <code>takeover | no_takeover</code>

- client_context_takeover: <code>takeover | no_takeover</code>

- server_max_window_bits: <code>8..15</code>

  Default = `15`

- client_max_window_bits: <code>8..15</code>

  Default = `15`


## egress

**Config paths**

 - <code>bridges.mqtt.$name</code>


**Env overrides**

 - <code>EMQX_BRIDGES__MQTT__$NAME</code>


**Fields**

- direction: <code>egress</code>

  Default = `egress`

  The direction of the bridge. Can be one of 'ingress' or 'egress'.<br>
  The egress config defines how this bridge forwards messages from the local broker to the remote
  broker.<br>
  Template with variables is allowed in 'remote_topic', 'qos', 'retain', 'payload'.<br>
  NOTE: if this bridge is used as the output of a rule (emqx rule engine), and also local_topic
  is configured, then both the data got from the rule and the MQTT messages that matches
  local_topic will be forwarded.


- enable: <code>boolean()</code>

  Default = `true`

  Enable or disable this bridge

- name: <code>binary()</code>

  Bridge name, used as a human-readable description of the bridge.

- connector: <code>binary()</code>


  The connector Id to be used for this bridge. Connector Ids must be of format: '{type}:{name}'.<br>
  In config files, you can find the corresponding config entry for a connector by such path: 'connectors.{type}.{name}'.<br>


- local_topic: <code>binary()</code>

  The local topic to be forwarded to the remote broker

- remote_topic: <code>binary()</code>

  Default = `"${topic}"`


  Forward to which topic of the remote broker.<br>
  Template with variables is allowed.


- remote_qos: <code>0 | 1 | 2 | binary()</code>

  Default = `"${qos}"`


  The QoS of the MQTT message to be sent.<br>
  Template with variables is allowed.

- retain: <code>boolean() | binary()</code>

  Default = `"${retain}"`


  The retain flag of the MQTT message to be sent.<br>
  Template with variables is allowed.

- payload: <code>binary()</code>

  Default = `"${payload}"`


  The payload of the MQTT message to be sent.<br>
  Template with variables is allowed.


## emqx_retainer

**Config paths**

 - <code>emqx_retainer</code>


**Env overrides**

 - <code>EMQX_EMQX_RETAINER</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `false`

- msg_expiry_interval: <code>emqx_schema:duration_ms()</code>

  Default = `"0s"`

- msg_clear_interval: <code>emqx_schema:duration_ms()</code>

  Default = `"0s"`

- flow_control: <code>[flow_control](#flow_control)</code>

- max_payload_size: <code>emqx_schema:bytesize()</code>

  Default = `"1MB"`

- stop_publish_clear_msg: <code>boolean()</code>

  Default = `false`

- config: <code>[mnesia_config](#mnesia_config)</code>


## emqx_slow_subs

**Config paths**

 - <code>emqx_slow_subs</code>


**Env overrides**

 - <code>EMQX_EMQX_SLOW_SUBS</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `false`

  switch of this function

- threshold: <code>emqx_schema:duration_ms()</code>

  Default = `"500ms"`

  The latency threshold for statistics, the minimum value is 100ms

- expire_interval: <code>emqx_schema:duration_ms()</code>

  Default = `"300s"`

  The eviction time of the record, which in the statistics record table

- top_k_num: <code>integer()</code>

  Default = `10`

  The maximum number of records in the slow subscription statistics record table

- notice_interval: <code>emqx_schema:duration_ms()</code>

  Default = `"0s"`

  The interval for pushing statistics table records to the system topic. When set to 0, push is disabledpublish topk list to $SYS/brokers/${node}/slow_subs per notice_intervalpublish is disabled if set to 0s.

- notice_qos: <code>0..2</code>

  Default = `0`

  QoS of notification message in notice topic

- notice_batch_size: <code>integer()</code>

  Default = `100`

  Maximum information number in one notification


## flapping_detect

**Config paths**

 - <code>flapping_detect</code>


**Env overrides**

 - <code>EMQX_FLAPPING_DETECT</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `false`

- max_count: <code>integer()</code>

  Default = `15`

- window_time: <code>emqx_schema:duration()</code>

  Default = `"1m"`

- ban_time: <code>emqx_schema:duration()</code>

  Default = `"5m"`


## force_gc

**Config paths**

 - <code>force_gc</code>


**Env overrides**

 - <code>EMQX_FORCE_GC</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `true`

- count: <code>0..inf</code>

  Default = `16000`

- bytes: <code>emqx_schema:bytesize()</code>

  Default = `"16MB"`


## force_shutdown

**Config paths**

 - <code>force_shutdown</code>


**Env overrides**

 - <code>EMQX_FORCE_SHUTDOWN</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `true`

- max_message_queue_len: <code>0..inf</code>

  Default = `1000`

- max_heap_size: <code>emqx_schema:wordsize()</code>

  Default = `"32MB"`


## ingress

**Config paths**

 - <code>bridges.mqtt.$name</code>


**Env overrides**

 - <code>EMQX_BRIDGES__MQTT__$NAME</code>


**Fields**

- direction: <code>ingress</code>

  Default = `egress`

  The direction of the bridge. Can be one of 'ingress' or 'egress'.<br>
  The ingress config defines how this bridge receive messages from the remote MQTT broker, and then
  send them to the local broker.<br>
  Template with variables is allowed in 'local_topic', 'remote_qos', 'qos', 'retain',
  'payload'.<br>
  NOTE: if this bridge is used as the input of a rule (emqx rule engine), and also local_topic is
  configured, then messages got from the remote broker will be sent to both the 'local_topic' and
  the rule.


- enable: <code>boolean()</code>

  Default = `true`

  Enable or disable this bridge

- name: <code>binary()</code>

  Bridge name, used as a human-readable description of the bridge.

- connector: <code>binary()</code>


  The connector Id to be used for this bridge. Connector Ids must be of format: '{type}:{name}'.<br>
  In config files, you can find the corresponding config entry for a connector by such path: 'connectors.{type}.{name}'.<br>


- remote_topic: <code>binary()</code>

  Receive messages from which topic of the remote broker

- remote_qos: <code>0 | 1 | 2 | binary()</code>

  Default = `1`

  The QoS level to be used when subscribing to the remote broker

- local_topic: <code>binary()</code>


  Send messages to which topic of the local broker.<br>
  Template with variables is allowed.


- local_qos: <code>0 | 1 | 2 | binary()</code>

  Default = `"${qos}"`


  The QoS of the MQTT message to be sent.<br>
  Template with variables is allowed.

- retain: <code>boolean() | binary()</code>

  Default = `"${retain}"`


  The retain flag of the MQTT message to be sent.<br>
  Template with variables is allowed.

- payload: <code>binary()</code>

  Default = `"${payload}"`


  The payload of the MQTT message to be sent.<br>
  Template with variables is allowed.


## latency_stats

**Config paths**

 - <code>latency_stats</code>


**Env overrides**

 - <code>EMQX_LATENCY_STATS</code>


**Fields**

- samples: <code>integer()</code>

  Default = `10`

  the number of smaples for calculate the average latency of delivery


## listener_ssl_opts

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

  Default = `false`

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
  Although the root CA certificate is optional, it should placed at the end of
  the file if it is to be added.


- keyfile: <code>string()</code>

  PEM format private key file.<br>


- verify: <code>verify_peer | verify_none</code>

  Default = `verify_none`

- reuse_sessions: <code>boolean()</code>

  Default = `true`

- depth: <code>integer()</code>

  Default = `10`

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  keyfile is password-protected.

- versions: <code>[atom()]</code>

  Default = `[tlsv1.3, tlsv1.2, tlsv1.1, tlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.


- ciphers: <code>[string()]</code>

  Default = `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256", "TLS_AES_128_CCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

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
  All default values and examples proveded by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>

  Default = `"emqx_tls_psk:lookup"`

- secure_renegotiate: <code>boolean()</code>

  Default = `true`


  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.


- dhfile: <code>string()</code>

  Path to a file containing PEM-encoded Diffie Hellman parameters
  to be used by the server if a cipher suite using Diffie Hellman
  key exchange is negotiated. If not specified, default parameters
  are used.<br>
  NOTE: The dhfile option is not supported by TLS 1.3.

- fail_if_no_peer_cert: <code>boolean()</code>

  Default = `false`


  Used together with {verify, verify_peer} by an TLS/DTLS server.
  If set to true, the server fails if the client does not have a
  certificate to send, that is, sends an empty certificate.
  If set to false, it fails only if the client sends an invalid
  certificate (an empty certificate is considered valid).


- honor_cipher_order: <code>boolean()</code>

  Default = `true`

- client_renegotiation: <code>boolean()</code>

  Default = `true`


  In protocols that support client-initiated renegotiation,
  the cost of resources of such an operation is higher for the server than the client.
  This can act as a vector for denial of service attacks.
  The SSL application already takes measures to counter-act such attempts,
  but client-initiated renegotiation can be strictly disabled by setting this option to false.
  The default value is true. Note that disabling renegotiation can result in
  long-lived connections becoming unusable due to limits on
  the number of messages the underlying cipher suite can encipher.



## listener_wss_opts

**Config paths**

 - <code>listeners.wss.$name.ssl</code>


**Env overrides**

 - <code>EMQX_LISTENERS__WSS__$NAME__SSL</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `false`

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
  Although the root CA certificate is optional, it should placed at the end of
  the file if it is to be added.


- keyfile: <code>string()</code>

  PEM format private key file.<br>


- verify: <code>verify_peer | verify_none</code>

  Default = `verify_none`

- reuse_sessions: <code>boolean()</code>

  Default = `true`

- depth: <code>integer()</code>

  Default = `10`

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  keyfile is password-protected.

- versions: <code>[atom()]</code>

  Default = `[tlsv1.3, tlsv1.2, tlsv1.1, tlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.


- ciphers: <code>[string()]</code>

  Default = `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256", "TLS_AES_128_CCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

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
  All default values and examples proveded by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>

  Default = `"emqx_tls_psk:lookup"`

- secure_renegotiate: <code>boolean()</code>

  Default = `true`


  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.


- dhfile: <code>string()</code>

  Path to a file containing PEM-encoded Diffie Hellman parameters
  to be used by the server if a cipher suite using Diffie Hellman
  key exchange is negotiated. If not specified, default parameters
  are used.<br>
  NOTE: The dhfile option is not supported by TLS 1.3.

- fail_if_no_peer_cert: <code>boolean()</code>

  Default = `false`


  Used together with {verify, verify_peer} by an TLS/DTLS server.
  If set to true, the server fails if the client does not have a
  certificate to send, that is, sends an empty certificate.
  If set to false, it fails only if the client sends an invalid
  certificate (an empty certificate is considered valid).


- honor_cipher_order: <code>boolean()</code>

  Default = `true`

- client_renegotiation: <code>boolean()</code>

  Default = `true`


  In protocols that support client-initiated renegotiation,
  the cost of resources of such an operation is higher for the server than the client.
  This can act as a vector for denial of service attacks.
  The SSL application already takes measures to counter-act such attempts,
  but client-initiated renegotiation can be strictly disabled by setting this option to false.
  The default value is true. Note that disabling renegotiation can result in
  long-lived connections becoming unusable due to limits on
  the number of messages the underlying cipher suite can encipher.


- handshake_timeout: <code>emqx_schema:duration()</code>

  Default = `"15s"`

  Maximum time duration allowed for the handshake to complete


## listeners

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

**Config paths**

 - <code>log</code>


**Env overrides**

 - <code>EMQX_LOG</code>


**Fields**

- console_handler: <code>[console_handler](#console_handler)</code>

- file_handlers: <code>{$name -> [log_file_handler](#log_file_handler)}</code>

- error_logger: <code>atom()</code>

  Default = `silent`


## log_burst_limit

**Config paths**

 - <code>log.console_handler.burst_limit</code>
 - <code>log.file_handlers.$name.burst_limit</code>


**Env overrides**

 - <code>EMQX_LOG__CONSOLE_HANDLER__BURST_LIMIT</code>
 - <code>EMQX_LOG__FILE_HANDLERS__$NAME__BURST_LIMIT</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `true`

- max_count: <code>integer()</code>

  Default = `10000`

- window_time: <code>emqx_schema:duration()</code>

  Default = `"1s"`


## log_file_handler

**Config paths**

 - <code>log.file_handlers.$name</code>


**Env overrides**

 - <code>EMQX_LOG__FILE_HANDLERS__$NAME</code>


**Fields**

- file: <code>emqx_conf_schema:file()</code>

- rotation: <code>[log_rotation](#log_rotation)</code>

- max_size: <code>infinity | emqx_schema:bytesize()</code>

  Default = `"10MB"`

- level: <code>emqx_conf_schema:log_level()</code>

  Default = `warning`

- time_offset: <code>string()</code>

  Default = `"system"`

- chars_limit: <code>unlimited | 1..inf</code>

  Default = `unlimited`

- formatter: <code>text | json</code>

  Default = `text`

- single_line: <code>boolean()</code>

  Default = `true`

- sync_mode_qlen: <code>integer()</code>

  Default = `100`

- drop_mode_qlen: <code>integer()</code>

  Default = `3000`

- flush_qlen: <code>integer()</code>

  Default = `8000`

- overload_kill: <code>[log_overload_kill](#log_overload_kill)</code>

- burst_limit: <code>[log_burst_limit](#log_burst_limit)</code>

- supervisor_reports: <code>error | progress</code>

  Default = `error`

- max_depth: <code>unlimited | integer()</code>

  Default = `100`


## log_overload_kill

**Config paths**

 - <code>log.console_handler.overload_kill</code>
 - <code>log.file_handlers.$name.overload_kill</code>


**Env overrides**

 - <code>EMQX_LOG__CONSOLE_HANDLER__OVERLOAD_KILL</code>
 - <code>EMQX_LOG__FILE_HANDLERS__$NAME__OVERLOAD_KILL</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `true`

- mem_size: <code>emqx_schema:bytesize()</code>

  Default = `"30MB"`

- qlen: <code>integer()</code>

  Default = `20000`

- restart_after: <code>emqx_schema:duration() | infinity</code>

  Default = `"5s"`


## log_rotation

**Config paths**

 - <code>log.file_handlers.$name.rotation</code>


**Env overrides**

 - <code>EMQX_LOG__FILE_HANDLERS__$NAME__ROTATION</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `true`

- count: <code>1..2048</code>

  Default = `10`


## mqtt

**Config paths**

 - <code>mqtt</code>


**Env overrides**

 - <code>EMQX_MQTT</code>


**Fields**

- idle_timeout: <code>infinity | emqx_schema:duration()</code>

  Default = `"15s"`

- max_packet_size: <code>emqx_schema:bytesize()</code>

  Default = `"1MB"`

- max_clientid_len: <code>23..65535</code>

  Default = `65535`

- max_topic_levels: <code>1..65535</code>

  Default = `65535`

- max_qos_allowed: <code>0..2</code>

  Default = `2`

- max_topic_alias: <code>0..65535</code>

  Default = `65535`

- retain_available: <code>boolean()</code>

  Default = `true`

- wildcard_subscription: <code>boolean()</code>

  Default = `true`

- shared_subscription: <code>boolean()</code>

  Default = `true`

- ignore_loop_deliver: <code>boolean()</code>

  Default = `false`

- strict_mode: <code>boolean()</code>

  Default = `false`

- response_information: <code>string()</code>

  Default = `[]`

- server_keepalive: <code>integer() | disabled</code>

  Default = `disabled`

- keepalive_backoff: <code>float()</code>

  Default = `0.75`

- max_subscriptions: <code>1..inf | infinity</code>

  Default = `infinity`

- upgrade_qos: <code>boolean()</code>

  Default = `false`

- max_inflight: <code>1..65535</code>

  Default = `32`

- retry_interval: <code>emqx_schema:duration()</code>

  Default = `"30s"`

- max_awaiting_rel: <code>integer() | infinity</code>

  Default = `100`

- await_rel_timeout: <code>emqx_schema:duration()</code>

  Default = `"300s"`

- session_expiry_interval: <code>emqx_schema:duration()</code>

  Default = `"2h"`

- max_mqueue_len: <code>0..inf | infinity</code>

  Default = `1000`

- mqueue_priorities: <code>map() | disabled</code>

  Default = `disabled`

- mqueue_default_priority: <code>highest | lowest</code>

  Default = `lowest`

- mqueue_store_qos0: <code>boolean()</code>

  Default = `true`

- use_username_as_clientid: <code>boolean()</code>

  Default = `false`

- peer_cert_as_username: <code>disabled | cn | dn | crt | pem | md5</code>

  Default = `disabled`

- peer_cert_as_clientid: <code>disabled | cn | dn | crt | pem | md5</code>

  Default = `disabled`


## mqtt_quic_listener

**Config paths**

 - <code>listeners.quic.$name</code>


**Env overrides**

 - <code>EMQX_LISTENERS__QUIC__$NAME</code>


**Fields**

- enabled: <code>boolean()</code>

  Default = `true`

- certfile: <code>string()</code>

- keyfile: <code>string()</code>

- ciphers: <code>[string()]</code>

  Default = `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256"]`

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
  All default values and examples proveded by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>
  NOTE: QUIC listener supports only 'tlsv1.3' ciphers<br>

- idle_timeout: <code>emqx_schema:duration()</code>

  Default = `"15s"`

- bind: <code>emqx_schema:ip_port() | integer()</code>

- acceptors: <code>integer()</code>

  Default = `16`

- max_connections: <code>infinity | integer()</code>

  Default = `infinity`

- mountpoint: <code>binary()</code>

  Default = `""`

- zone: <code>atom()</code>

  Default = `default`

- limiter: <code>{$ratelimit bucket's name -> atom()}</code>

  Default = `{}`


## mqtt_ssl_listener

**Config paths**

 - <code>listeners.ssl.$name</code>


**Env overrides**

 - <code>EMQX_LISTENERS__SSL__$NAME</code>


**Fields**

- tcp: <code>[tcp_opts](#tcp_opts)</code>

- ssl: <code>[listener_ssl_opts](#listener_ssl_opts)</code>

- bind: <code>emqx_schema:ip_port() | integer()</code>

- acceptors: <code>integer()</code>

  Default = `16`

- max_connections: <code>infinity | integer()</code>

  Default = `infinity`

- mountpoint: <code>binary()</code>

  Default = `""`

- zone: <code>atom()</code>

  Default = `default`

- limiter: <code>{$ratelimit bucket's name -> atom()}</code>

  Default = `{}`

- access_rules: <code>[string()]</code>

- proxy_protocol: <code>boolean()</code>

  Default = `false`

- proxy_protocol_timeout: <code>emqx_schema:duration()</code>

- authentication: <code>[[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)]</code>

  Per-listener authentication override
  Authentication can be one single authenticator instance or a chain of authenticators as an array.
  When authenticating a login (username, client ID, etc.) the authenticators are checked
  in the configured order.<br>



## mqtt_tcp_listener

**Config paths**

 - <code>listeners.tcp.$name</code>


**Env overrides**

 - <code>EMQX_LISTENERS__TCP__$NAME</code>


**Fields**

- tcp: <code>[tcp_opts](#tcp_opts)</code>

  TCP listener options

- bind: <code>emqx_schema:ip_port() | integer()</code>

- acceptors: <code>integer()</code>

  Default = `16`

- max_connections: <code>infinity | integer()</code>

  Default = `infinity`

- mountpoint: <code>binary()</code>

  Default = `""`

- zone: <code>atom()</code>

  Default = `default`

- limiter: <code>{$ratelimit bucket's name -> atom()}</code>

  Default = `{}`

- access_rules: <code>[string()]</code>

- proxy_protocol: <code>boolean()</code>

  Default = `false`

- proxy_protocol_timeout: <code>emqx_schema:duration()</code>

- authentication: <code>[[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)]</code>

  Per-listener authentication override
  Authentication can be one single authenticator instance or a chain of authenticators as an array.
  When authenticating a login (username, client ID, etc.) the authenticators are checked
  in the configured order.<br>



## mqtt_ws_listener

**Config paths**

 - <code>listeners.ws.$name</code>


**Env overrides**

 - <code>EMQX_LISTENERS__WS__$NAME</code>


**Fields**

- tcp: <code>[tcp_opts](#tcp_opts)</code>

- websocket: <code>[ws_opts](#ws_opts)</code>

- bind: <code>emqx_schema:ip_port() | integer()</code>

- acceptors: <code>integer()</code>

  Default = `16`

- max_connections: <code>infinity | integer()</code>

  Default = `infinity`

- mountpoint: <code>binary()</code>

  Default = `""`

- zone: <code>atom()</code>

  Default = `default`

- limiter: <code>{$ratelimit bucket's name -> atom()}</code>

  Default = `{}`

- access_rules: <code>[string()]</code>

- proxy_protocol: <code>boolean()</code>

  Default = `false`

- proxy_protocol_timeout: <code>emqx_schema:duration()</code>

- authentication: <code>[[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)]</code>

  Per-listener authentication override
  Authentication can be one single authenticator instance or a chain of authenticators as an array.
  When authenticating a login (username, client ID, etc.) the authenticators are checked
  in the configured order.<br>



## mqtt_wss_listener

**Config paths**

 - <code>listeners.wss.$name</code>


**Env overrides**

 - <code>EMQX_LISTENERS__WSS__$NAME</code>


**Fields**

- tcp: <code>[tcp_opts](#tcp_opts)</code>

- ssl: <code>[listener_wss_opts](#listener_wss_opts)</code>

- websocket: <code>[ws_opts](#ws_opts)</code>

- bind: <code>emqx_schema:ip_port() | integer()</code>

- acceptors: <code>integer()</code>

  Default = `16`

- max_connections: <code>infinity | integer()</code>

  Default = `infinity`

- mountpoint: <code>binary()</code>

  Default = `""`

- zone: <code>atom()</code>

  Default = `default`

- limiter: <code>{$ratelimit bucket's name -> atom()}</code>

  Default = `{}`

- access_rules: <code>[string()]</code>

- proxy_protocol: <code>boolean()</code>

  Default = `false`

- proxy_protocol_timeout: <code>emqx_schema:duration()</code>

- authentication: <code>[[authn-builtin_db:authentication](#authn-builtin_db-authentication) | [authn-mysql:authentication](#authn-mysql-authentication) | [authn-postgresql:authentication](#authn-postgresql-authentication) | [authn-mongodb:standalone](#authn-mongodb-standalone) | [authn-mongodb:replica-set](#authn-mongodb-replica-set) | [authn-mongodb:sharded-cluster](#authn-mongodb-sharded-cluster) | [authn-redis:standalone](#authn-redis-standalone) | [authn-redis:cluster](#authn-redis-cluster) | [authn-redis:sentinel](#authn-redis-sentinel) | [authn-http:get](#authn-http-get) | [authn-http:post](#authn-http-post) | [authn-jwt:hmac-based](#authn-jwt-hmac-based) | [authn-jwt:public-key](#authn-jwt-public-key) | [authn-jwt:jwks](#authn-jwt-jwks) | [authn-scram-builtin_db:authentication](#authn-scram-builtin_db-authentication)]</code>

  Per-listener authentication override
  Authentication can be one single authenticator instance or a chain of authenticators as an array.
  When authenticating a login (username, client ID, etc.) the authenticators are checked
  in the configured order.<br>



## node

**Config paths**

 - <code>node</code>


**Env overrides**

 - <code>EMQX_NODE</code>


**Fields**

- name: <code>string()</code>

  Default = `"emqx@127.0.0.1"`

- cookie: <code>string()</code>

  Default = `"emqxsecretcookie"`

- data_dir: <code>string()</code>

- config_files: <code>[string()]</code>

- global_gc_interval: <code>emqx_schema:duration()</code>

  Default = `"15m"`

- crash_dump_file: <code>emqx_conf_schema:file()</code>

  Location of the crash dump file

- crash_dump_seconds: <code>emqx_schema:duration_s()</code>

  Default = `"30s"`


  The number of seconds that the broker is allowed to spend writing
  a crash dump


- crash_dump_bytes: <code>emqx_schema:bytesize()</code>

  Default = `"100MB"`

  The maximum size of a crash dump file in bytes.

- dist_net_ticktime: <code>emqx_schema:duration()</code>

  Default = `"2m"`

- dist_listen_min: <code>1024..65535</code>

  Default = `6369`

- dist_listen_max: <code>1024..65535</code>

  Default = `6369`

- backtrace_depth: <code>integer()</code>

  Default = `23`

- etc_dir: <code>string()</code>

  `etc` dir for the node

- cluster_call: <code>[cluster_call](#cluster_call)</code>


## overload_protection

**Config paths**

 - <code>overload_protection</code>


**Env overrides**

 - <code>EMQX_OVERLOAD_PROTECTION</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `false`

  React on system overload or not

- backoff_delay: <code>0..inf</code>

  Default = `1`

  Some unimporant tasks could be delayedfor execution, here set the delays in ms

- backoff_gc: <code>boolean()</code>

  Default = `false`

  Skip forceful GC if necessary

- backoff_hibernation: <code>boolean()</code>

  Default = `true`

  Skip process hibernation if necessary

- backoff_new_conn: <code>boolean()</code>

  Default = `true`

  Close new incoming connections if necessary


## persistent_session_store

**Config paths**

 - <code>persistent_session_store</code>


**Env overrides**

 - <code>EMQX_PERSISTENT_SESSION_STORE</code>


**Fields**

- enabled: <code>boolean()</code>

  Default = `false`

- storage_type: <code>ram | disc</code>

  Default = `disc`

- max_retain_undelivered: <code>emqx_schema:duration()</code>

  Default = `"1h"`

- message_gc_interval: <code>emqx_schema:duration()</code>

  Default = `"1h"`

- session_message_gc_interval: <code>emqx_schema:duration()</code>

  Default = `"1m"`


## psk_authentication

**Config paths**

 - <code>psk_authentication</code>


**Env overrides**

 - <code>EMQX_PSK_AUTHENTICATION</code>

PSK stands for 'Pre-Shared Keys'.
This config to enable TLS-PSK authentication.

<strong>Important!</strong> Make sure the SSL listener with
only <code>tlsv1.2</code> enabled, and also PSK cipher suites
configured, such as <code>RSA-PSK-AES256-GCM-SHA384</code>.
See listener SSL options config for more details.

The IDs and secrets can be provided from a file the path
to which is configurable by the <code>init_file</code> field.

**Fields**

- enable: <code>boolean()</code>

  Default = `false`

  Whether to enable tls psk support

- init_file: <code>binary()</code>

  If init_file is specified, emqx will import PSKs from the file into the built-in database at startup for use by the runtime. The file has to be structured line-by-line, each line must be in the format of 'PSKIdentity:SharedSecret' for example: mydevice1:c2VjcmV0

- separator: <code>binary()</code>

  Default = `":"`

  The separator between PSKIdentity and SharedSecret in the psk file

- chunk_size: <code>integer()</code>

  Default = `50`

  The size of each chunk used to import to the built-in database from psk file


## quota

**Config paths**

 - <code>quota</code>


**Env overrides**

 - <code>EMQX_QUOTA</code>


**Fields**

- conn_messages_routing: <code>infinity | emqx_schema:comma_separated_list()</code>

  Default = `infinity`

- overall_messages_routing: <code>infinity | emqx_schema:comma_separated_list()</code>

  Default = `infinity`


## rate_limit

**Config paths**

 - <code>rate_limit</code>


**Env overrides**

 - <code>EMQX_RATE_LIMIT</code>


**Fields**

- max_conn_rate: <code>infinity | integer()</code>

  Default = `1000`

- conn_messages_in: <code>infinity | emqx_schema:comma_separated_list()</code>

  Default = `infinity`

- conn_bytes_in: <code>infinity | emqx_schema:comma_separated_list()</code>

  Default = `infinity`


## replayq

**Config paths**

 - <code>connectors.mqtt.$name.replayq</code>


**Env overrides**

 - <code>EMQX_CONNECTORS__MQTT__$NAME__REPLAYQ</code>


**Fields**

- dir: <code>boolean() | string()</code>


  The dir where the replayq file saved.<br>
  Set to 'false' disables the replayq feature.


- seg_bytes: <code>emqx_schema:bytesize()</code>

  Default = `"100MB"`


  The size in bytes of a single segment.<br>
  A segment is mapping to a file in the replayq dir. If the current segment is full, a new segment
  (file) will be opened to write.


- offload: <code>boolean()</code>

  Default = `false`


  In offload mode, the disk queue is only used to offload queue tail segments.<br>
  The messages are cached in the memory first, then it write to the replayq files after the size of
  the memory cache reaches 'seg_bytes'.



## rpc

**Config paths**

 - <code>rpc</code>


**Env overrides**

 - <code>EMQX_RPC</code>


**Fields**

- mode: <code>sync | async</code>

  Default = `async`

- async_batch_size: <code>integer()</code>

  Default = `256`

- port_discovery: <code>manual | stateless</code>

  Default = `stateless`

- tcp_server_port: <code>integer()</code>

  Default = `5369`

- tcp_client_num: <code>1..256</code>

  Default = `1`

- connect_timeout: <code>emqx_schema:duration()</code>

  Default = `"5s"`

- send_timeout: <code>emqx_schema:duration()</code>

  Default = `"5s"`

- authentication_timeout: <code>emqx_schema:duration()</code>

  Default = `"5s"`

- call_receive_timeout: <code>emqx_schema:duration()</code>

  Default = `"15s"`

- socket_keepalive_idle: <code>emqx_schema:duration_s()</code>

  Default = `"7200s"`

- socket_keepalive_interval: <code>emqx_schema:duration_s()</code>

  Default = `"75s"`

- socket_keepalive_count: <code>integer()</code>

  Default = `9`

- socket_sndbuf: <code>emqx_schema:bytesize()</code>

  Default = `"1MB"`

- socket_recbuf: <code>emqx_schema:bytesize()</code>

  Default = `"1MB"`

- socket_buffer: <code>emqx_schema:bytesize()</code>

  Default = `"1MB"`


## stats

**Config paths**

 - <code>stats</code>


**Env overrides**

 - <code>EMQX_STATS</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `true`


## sysmon

**Config paths**

 - <code>sysmon</code>


**Env overrides**

 - <code>EMQX_SYSMON</code>


**Fields**

- vm: <code>[sysmon_vm](#sysmon_vm)</code>

- os: <code>[sysmon_os](#sysmon_os)</code>

- top: <code>[sysmon_top](#sysmon_top)</code>


## sysmon_os

**Config paths**

 - <code>sysmon.os</code>


**Env overrides**

 - <code>EMQX_SYSMON__OS</code>


**Fields**

- cpu_check_interval: <code>emqx_schema:duration()</code>

  Default = `"60s"`

- cpu_high_watermark: <code>emqx_schema:percent()</code>

  Default = `"80%"`

- cpu_low_watermark: <code>emqx_schema:percent()</code>

  Default = `"60%"`

- mem_check_interval: <code>disabled | emqx_schema:duration()</code>

  Default = `"60s"`

- sysmem_high_watermark: <code>emqx_schema:percent()</code>

  Default = `"70%"`

- procmem_high_watermark: <code>emqx_schema:percent()</code>

  Default = `"5%"`


## sysmon_top

**Config paths**

 - <code>sysmon.top</code>


**Env overrides**

 - <code>EMQX_SYSMON__TOP</code>


**Fields**

- num_items: <code>non_neg_integer()</code>

  Default = `10`

  The number of top processes per monitoring group

- sample_interval: <code>emqx_schema:duration()</code>

  Default = `"2s"`

  Specifies how often process top should be collected

- max_procs: <code>non_neg_integer()</code>

  Default = `3000000`

  Stop collecting data when the number of processes
  in the VM exceeds this value

- db_hostname: <code>string()</code>

  Hostname of the postgres database that collects the data points

- db_port: <code>integer()</code>

  Default = `5432`

  Port of the postgres database that collects the data points

- db_username: <code>string()</code>

  Default = `"system_monitor"`

  EMQX user name in the postgres database

- db_password: <code>binary()</code>

  Default = `"system_monitor_password"`

  EMQX user password in the postgres database

- db_name: <code>string()</code>

  Default = `"postgres"`

  Postgres database name


## sysmon_vm

**Config paths**

 - <code>sysmon.vm</code>


**Env overrides**

 - <code>EMQX_SYSMON__VM</code>


**Fields**

- process_check_interval: <code>emqx_schema:duration()</code>

  Default = `"30s"`

- process_high_watermark: <code>emqx_schema:percent()</code>

  Default = `"80%"`

- process_low_watermark: <code>emqx_schema:percent()</code>

  Default = `"60%"`

- long_gc: <code>disabled | emqx_schema:duration()</code>

- long_schedule: <code>disabled | emqx_schema:duration()</code>

  Default = `"240ms"`

- large_heap: <code>disabled | emqx_schema:bytesize()</code>

  Default = `"32MB"`

- busy_dist_port: <code>boolean()</code>

  Default = `true`

- busy_port: <code>boolean()</code>

  Default = `true`


## tcp_opts

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

  Default = `100`

- backlog: <code>integer()</code>

  Default = `1024`

- send_timeout: <code>emqx_schema:duration()</code>

  Default = `"15s"`

- send_timeout_close: <code>boolean()</code>

  Default = `true`

- recbuf: <code>emqx_schema:bytesize()</code>

- sndbuf: <code>emqx_schema:bytesize()</code>

- buffer: <code>emqx_schema:bytesize()</code>

- high_watermark: <code>emqx_schema:bytesize()</code>

  Default = `"1MB"`

- nodelay: <code>boolean()</code>

  Default = `false`

- reuseaddr: <code>boolean()</code>

  Default = `true`


## trace

**Config paths**

 - <code>trace</code>


**Env overrides**

 - <code>EMQX_TRACE</code>


**Fields**

- payload_encode: <code>hex | text | hidden</code>

  Default = `text`


  Determine the format of the payload format in the trace file.<br>
  `text`: Text-based protocol or plain text protocol. It is recommended when payload is json encode.<br>
  `hex`: Binary hexadecimal encode. It is recommended when payload is a custom binary protocol.<br>
  `hidden`: payload is obfuscated as `******`
          


## ws_opts

**Config paths**

 - <code>listeners.ws.$name.websocket</code>
 - <code>listeners.wss.$name.websocket</code>


**Env overrides**

 - <code>EMQX_LISTENERS__WS__$NAME__WEBSOCKET</code>
 - <code>EMQX_LISTENERS__WSS__$NAME__WEBSOCKET</code>


**Fields**

- mqtt_path: <code>string()</code>

  Default = `"/mqtt"`

- mqtt_piggyback: <code>single | multiple</code>

  Default = `multiple`

- compress: <code>boolean()</code>

  Default = `false`

- idle_timeout: <code>emqx_schema:duration()</code>

  Default = `"15s"`

- max_frame_size: <code>infinity | integer()</code>

  Default = `infinity`

- fail_if_no_subprotocol: <code>boolean()</code>

  Default = `true`

- supported_subprotocols: <code>emqx_schema:comma_separated_list()</code>

  Default = `"mqtt, mqtt-v3, mqtt-v3.1.1, mqtt-v5"`

- check_origin_enable: <code>boolean()</code>

  Default = `false`

- allow_origin_absence: <code>boolean()</code>

  Default = `true`

- check_origins: <code>[binary()]</code>

  Default = `[]`

- proxy_address_header: <code>string()</code>

  Default = `"x-forwarded-for"`

- proxy_port_header: <code>string()</code>

  Default = `"x-forwarded-port"`

- deflate_opts: <code>[deflate_opts](#deflate_opts)</code>


## zone

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

- rate_limit: <code>[zone:rate_limit](#zone-rate_limit)</code>

- quota: <code>[zone:quota](#zone-quota)</code>

- force_gc: <code>[zone:force_gc](#zone-force_gc)</code>

- overload_protection: <code>[zone:overload_protection](#zone-overload_protection)</code>

- latency_stats: <code>[zone:latency_stats](#zone-latency_stats)</code>


## zone:conn_congestion

**Config paths**

 - <code>zones.$name.conn_congestion</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__CONN_CONGESTION</code>


**Fields**

- enable_alarm: <code>boolean()</code>

- min_alarm_sustain_duration: <code>emqx_schema:duration()</code>


## zone:flapping_detect

**Config paths**

 - <code>zones.$name.flapping_detect</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__FLAPPING_DETECT</code>


**Fields**

- enable: <code>boolean()</code>

- max_count: <code>integer()</code>

- window_time: <code>emqx_schema:duration()</code>

- ban_time: <code>emqx_schema:duration()</code>


## zone:force_gc

**Config paths**

 - <code>zones.$name.force_gc</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__FORCE_GC</code>


**Fields**

- enable: <code>boolean()</code>

- count: <code>0..inf</code>

- bytes: <code>emqx_schema:bytesize()</code>


## zone:force_shutdown

**Config paths**

 - <code>zones.$name.force_shutdown</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__FORCE_SHUTDOWN</code>


**Fields**

- enable: <code>boolean()</code>

- max_message_queue_len: <code>0..inf</code>

- max_heap_size: <code>emqx_schema:wordsize()</code>


## zone:latency_stats

**Config paths**

 - <code>zones.$name.latency_stats</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__LATENCY_STATS</code>


**Fields**

- samples: <code>integer()</code>

  the number of smaples for calculate the average latency of delivery


## zone:mqtt

**Config paths**

 - <code>zones.$name.mqtt</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__MQTT</code>


**Fields**

- idle_timeout: <code>infinity | emqx_schema:duration()</code>

- max_packet_size: <code>emqx_schema:bytesize()</code>

- max_clientid_len: <code>23..65535</code>

- max_topic_levels: <code>1..65535</code>

- max_qos_allowed: <code>0..2</code>

- max_topic_alias: <code>0..65535</code>

- retain_available: <code>boolean()</code>

- wildcard_subscription: <code>boolean()</code>

- shared_subscription: <code>boolean()</code>

- ignore_loop_deliver: <code>boolean()</code>

- strict_mode: <code>boolean()</code>

- response_information: <code>string()</code>

- server_keepalive: <code>integer() | disabled</code>

- keepalive_backoff: <code>float()</code>

- max_subscriptions: <code>1..inf | infinity</code>

- upgrade_qos: <code>boolean()</code>

- max_inflight: <code>1..65535</code>

- retry_interval: <code>emqx_schema:duration()</code>

- max_awaiting_rel: <code>integer() | infinity</code>

- await_rel_timeout: <code>emqx_schema:duration()</code>

- session_expiry_interval: <code>emqx_schema:duration()</code>

- max_mqueue_len: <code>0..inf | infinity</code>

- mqueue_priorities: <code>map() | disabled</code>

- mqueue_default_priority: <code>highest | lowest</code>

- mqueue_store_qos0: <code>boolean()</code>

- use_username_as_clientid: <code>boolean()</code>

- peer_cert_as_username: <code>disabled | cn | dn | crt | pem | md5</code>

- peer_cert_as_clientid: <code>disabled | cn | dn | crt | pem | md5</code>


## zone:overload_protection

**Config paths**

 - <code>zones.$name.overload_protection</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__OVERLOAD_PROTECTION</code>


**Fields**

- enable: <code>boolean()</code>

  React on system overload or not

- backoff_delay: <code>0..inf</code>

  Some unimporant tasks could be delayedfor execution, here set the delays in ms

- backoff_gc: <code>boolean()</code>

  Skip forceful GC if necessary

- backoff_hibernation: <code>boolean()</code>

  Skip process hibernation if necessary

- backoff_new_conn: <code>boolean()</code>

  Close new incoming connections if necessary


## zone:quota

**Config paths**

 - <code>zones.$name.quota</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__QUOTA</code>


**Fields**

- conn_messages_routing: <code>infinity | emqx_schema:comma_separated_list()</code>

- overall_messages_routing: <code>infinity | emqx_schema:comma_separated_list()</code>


## zone:rate_limit

**Config paths**

 - <code>zones.$name.rate_limit</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__RATE_LIMIT</code>


**Fields**

- max_conn_rate: <code>infinity | integer()</code>

- conn_messages_in: <code>infinity | emqx_schema:comma_separated_list()</code>

- conn_bytes_in: <code>infinity | emqx_schema:comma_separated_list()</code>


## zone:stats

**Config paths**

 - <code>zones.$name.stats</code>


**Env overrides**

 - <code>EMQX_ZONES__$NAME__STATS</code>


**Fields**

- enable: <code>boolean()</code>


## authn-builtin_db:authentication

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

- mechanism: <code>password-based</code>

- backend: <code>built-in-database</code>

- user_id_type: <code>emqx_authn_mnesia:user_id_type()</code>

  Default = `"username"`

- password_hash_algorithm: <code>[authn-hash:bcrypt_rw](#authn-hash-bcrypt_rw) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>

  Default = `{name = sha256, salt_position = prefix}`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider


## authn-hash:bcrypt

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


## authn-hash:bcrypt_rw

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

- salt_rounds: <code>integer()</code>

  Default = `10`


## authn-hash:other_algorithms

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

- salt_position: <code>prefix | suffix</code>

  Default = `prefix`


## authn-hash:pbkdf2

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

- mac_fun: <code>md4 | md5 | ripemd160 | sha | sha224 | sha256 | sha384 | sha512</code>

- iterations: <code>integer()</code>

- dk_length: <code>integer()</code>


## authn-http:get

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

  Default = `post`

- headers: <code>map()</code>

  Default = 
  ```
  {
    accept = "application/json"
    "cache-control" = "no-cache"
    connection = "keep-alive"
    "keep-alive" = "timeout=5"
  }
  ```

- mechanism: <code>password-based</code>

- backend: <code>http</code>

- url: <code>binary()</code>

- body: <code>map()</code>

- request_timeout: <code>emqx_schema:duration_ms()</code>

  Default = `"5s"`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider

- connect_timeout: <code>emqx_schema:duration_ms()</code>

  Default = `"15s"`

  The timeout when connecting to the HTTP server

- enable_pipelining: <code>boolean()</code>

  Default = `true`

  Enable the HTTP pipeline

- max_retries: <code>non_neg_integer()</code>

  Default = `5`

  Max retry times if error on sending request

- pool_size: <code>non_neg_integer()</code>

  Default = `8`

  The pool size

- request: <code>[connector-http:request](#connector-http-request)</code>


  If the request is provided, the caller can send HTTP requests via
  <code>emqx_resource:query(ResourceId, {send_message, BridgeId, Message})</code>


- retry_interval: <code>emqx_schema:duration()</code>

  Default = `"1s"`

  Interval before next retry if error on sending request

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authn-http:post

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

  Default = `post`

- headers: <code>map()</code>

  Default = 
  ```
  {
    accept = "application/json"
    "cache-control" = "no-cache"
    connection = "keep-alive"
    "content-type" = "application/json"
    "keep-alive" = "timeout=5"
  }
  ```

- mechanism: <code>password-based</code>

- backend: <code>http</code>

- url: <code>binary()</code>

- body: <code>map()</code>

- request_timeout: <code>emqx_schema:duration_ms()</code>

  Default = `"5s"`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider

- connect_timeout: <code>emqx_schema:duration_ms()</code>

  Default = `"15s"`

  The timeout when connecting to the HTTP server

- enable_pipelining: <code>boolean()</code>

  Default = `true`

  Enable the HTTP pipeline

- max_retries: <code>non_neg_integer()</code>

  Default = `5`

  Max retry times if error on sending request

- pool_size: <code>non_neg_integer()</code>

  Default = `8`

  The pool size

- request: <code>[connector-http:request](#connector-http-request)</code>


  If the request is provided, the caller can send HTTP requests via
  <code>emqx_resource:query(ResourceId, {send_message, BridgeId, Message})</code>


- retry_interval: <code>emqx_schema:duration()</code>

  Default = `"1s"`

  Interval before next retry if error on sending request

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authn-jwt:hmac-based

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

- secret: <code>binary()</code>

- secret_base64_encoded: <code>boolean()</code>

  Default = `false`

- mechanism: <code>jwt</code>

- verify_claims: <code>[term()]</code>

  Default = `{}`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider


## authn-jwt:jwks

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

- refresh_interval: <code>integer()</code>

  Default = `300`

- ssl: <code>[authn-jwt:ssl_enable](#authn-jwt-ssl_enable) | [authn-jwt:ssl_disable](#authn-jwt-ssl_disable)</code>

  Default = `{enable = false}`

- mechanism: <code>jwt</code>

- verify_claims: <code>[term()]</code>

  Default = `{}`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider


## authn-jwt:public-key

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

- certificate: <code>string()</code>

- mechanism: <code>jwt</code>

- verify_claims: <code>[term()]</code>

  Default = `{}`

- enable: <code>boolean()</code>

  Default = `true`

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

- certfile: <code>string()</code>

- keyfile: <code>string()</code>

- verify: <code>verify_peer | verify_none</code>

  Default = `verify_none`

- server_name_indication: <code>string()</code>


## authn-mongodb:replica-set

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

- mechanism: <code>password-based</code>

- backend: <code>mongodb</code>

- collection: <code>binary()</code>

- selector: <code>map()</code>

- password_hash_field: <code>binary()</code>

- salt_field: <code>binary()</code>

- is_superuser_field: <code>binary()</code>

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>

  Default = `{name = sha256, salt_position = prefix}`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider

- mongo_type: <code>rs</code>

  Default = `rs`

- servers: <code>binary()</code>

- w_mode: <code>unsafe | safe</code>

  Default = `unsafe`

- r_mode: <code>master | slave_ok</code>

  Default = `master`

- replica_set_name: <code>binary()</code>

- srv_record: <code>boolean()</code>

  Default = `false`

- pool_size: <code>integer()</code>

  Default = `8`

- username: <code>binary()</code>

- password: <code>binary()</code>

- auth_source: <code>binary()</code>

- database: <code>binary()</code>

- topology: <code>[topology](#topology)</code>

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authn-mongodb:sharded-cluster

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

- mechanism: <code>password-based</code>

- backend: <code>mongodb</code>

- collection: <code>binary()</code>

- selector: <code>map()</code>

- password_hash_field: <code>binary()</code>

- salt_field: <code>binary()</code>

- is_superuser_field: <code>binary()</code>

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>

  Default = `{name = sha256, salt_position = prefix}`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider

- mongo_type: <code>sharded</code>

  Default = `sharded`

- servers: <code>binary()</code>

- w_mode: <code>unsafe | safe</code>

  Default = `unsafe`

- srv_record: <code>boolean()</code>

  Default = `false`

- pool_size: <code>integer()</code>

  Default = `8`

- username: <code>binary()</code>

- password: <code>binary()</code>

- auth_source: <code>binary()</code>

- database: <code>binary()</code>

- topology: <code>[topology](#topology)</code>

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authn-mongodb:standalone

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

- mechanism: <code>password-based</code>

- backend: <code>mongodb</code>

- collection: <code>binary()</code>

- selector: <code>map()</code>

- password_hash_field: <code>binary()</code>

- salt_field: <code>binary()</code>

- is_superuser_field: <code>binary()</code>

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>

  Default = `{name = sha256, salt_position = prefix}`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider

- mongo_type: <code>single</code>

  Default = `single`

- server: <code>binary()</code>

- w_mode: <code>unsafe | safe</code>

  Default = `unsafe`

- srv_record: <code>boolean()</code>

  Default = `false`

- pool_size: <code>integer()</code>

  Default = `8`

- username: <code>binary()</code>

- password: <code>binary()</code>

- auth_source: <code>binary()</code>

- database: <code>binary()</code>

- topology: <code>[topology](#topology)</code>

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authn-mysql:authentication

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

- mechanism: <code>password-based</code>

- backend: <code>mysql</code>

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>

  Default = `{name = sha256, salt_position = prefix}`

- query: <code>string()</code>

- query_timeout: <code>emqx_schema:duration_ms()</code>

  Default = `"5s"`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider

- server: <code>emqx_schema:ip_port()</code>

- database: <code>binary()</code>

- pool_size: <code>integer()</code>

  Default = `8`

- username: <code>binary()</code>

- password: <code>binary()</code>

- auto_reconnect: <code>boolean()</code>

  Default = `true`

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authn-postgresql:authentication

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

- mechanism: <code>password-based</code>

- backend: <code>postgresql</code>

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>

  Default = `{name = sha256, salt_position = prefix}`

- query: <code>string()</code>

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider

- server: <code>emqx_schema:ip_port()</code>

- database: <code>binary()</code>

- pool_size: <code>integer()</code>

  Default = `8`

- username: <code>binary()</code>

- password: <code>binary()</code>

- auto_reconnect: <code>boolean()</code>

  Default = `true`

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authn-redis:cluster

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

- mechanism: <code>password-based</code>

- backend: <code>redis</code>

- cmd: <code>string()</code>

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>

  Default = `{name = sha256, salt_position = prefix}`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider

- servers: <code>emqx_connector_redis:servers()</code>

- redis_type: <code>cluster</code>

  Default = `cluster`

- pool_size: <code>integer()</code>

  Default = `8`

- password: <code>binary()</code>

- database: <code>integer()</code>

  Default = `0`

- auto_reconnect: <code>boolean()</code>

  Default = `true`

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authn-redis:sentinel

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

- mechanism: <code>password-based</code>

- backend: <code>redis</code>

- cmd: <code>string()</code>

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>

  Default = `{name = sha256, salt_position = prefix}`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider

- servers: <code>emqx_connector_redis:servers()</code>

- redis_type: <code>sentinel</code>

  Default = `sentinel`

- sentinel: <code>string()</code>

- pool_size: <code>integer()</code>

  Default = `8`

- password: <code>binary()</code>

- database: <code>integer()</code>

  Default = `0`

- auto_reconnect: <code>boolean()</code>

  Default = `true`

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authn-redis:standalone

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

- mechanism: <code>password-based</code>

- backend: <code>redis</code>

- cmd: <code>string()</code>

- password_hash_algorithm: <code>[authn-hash:bcrypt](#authn-hash-bcrypt) | [authn-hash:pbkdf2](#authn-hash-pbkdf2) | [authn-hash:other_algorithms](#authn-hash-other_algorithms)</code>

  Default = `{name = sha256, salt_position = prefix}`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider

- server: <code>emqx_connector_redis:server()</code>

- redis_type: <code>single</code>

  Default = `single`

- pool_size: <code>integer()</code>

  Default = `8`

- password: <code>binary()</code>

- database: <code>integer()</code>

  Default = `0`

- auto_reconnect: <code>boolean()</code>

  Default = `true`

- ssl: <code>[ssl_client_opts](#ssl_client_opts)</code>

  Default = `{enable = false}`


## authn-scram-builtin_db:authentication

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

- backend: <code>built-in-database</code>

- algorithm: <code>sha256 | sha512</code>

  Default = `sha256`

- iteration_count: <code>non_neg_integer()</code>

  Default = `4096`

- enable: <code>boolean()</code>

  Default = `true`

  Set to <code>false</code> to disable this auth provider


## auto_subscribe

**Config paths**

 - <code>auto_subscribe</code>


**Env overrides**

 - <code>EMQX_AUTO_SUBSCRIBE</code>


**Fields**

- topics: <code>[[auto_subscribe:topic](#auto_subscribe-topic)]</code>


## auto_subscribe:topic

**Config paths**

 - <code>auto_subscribe.topics.$INDEX</code>


**Env overrides**

 - <code>EMQX_AUTO_SUBSCRIBE__TOPICS__$INDEX</code>


**Fields**

- topic: <code>binary()</code>

- qos: <code>0 | 1 | 2</code>

  Default = `0`

- rh: <code>0 | 1 | 2</code>

  Default = `0`

- rap: <code>0 | 1</code>

  Default = `0`

- nl: <code>0 | 1</code>

  Default = `0`


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

- path: <code>binary()</code>

- body: <code>binary()</code>

- headers: <code>map()</code>

- request_timeout: <code>emqx_schema:duration_ms()</code>

  The timeout when sending request to the HTTP server


## plugin:plugins

**Config paths**

 - <code>plugins</code>


**Env overrides**

 - <code>EMQX_PLUGINS</code>


Manage EMQX plugins.
<br>
Plugins can be pre-built as a part of EMQX package,
or installed as a standalone package in a location specified by
<code>install_dir</code> config key
<br>
The standalone-installed plugins are referred to as 'external' plugins.

**Fields**

- states: <code>[[plugin:state](#plugin-state)]</code>

  Default = `[]`

  An array of plugins in the desired states.<br>The plugins are started in the defined order

- install_dir: <code>string()</code>

  Default = `"plugins"`


  In which directory are the external plugins installed.
  The plugin beam files and configuration files should reside in
  the sub-directory named as <code>emqx_foo_bar-0.1.0</code>.
  <br>
  NOTE: For security reasons, this directory should **NOT** be writable
  by anyone expect for <code>emqx</code> (or any user which runs EMQX)



## plugin:state

**Config paths**

 - <code>plugins.states.$INDEX</code>


**Env overrides**

 - <code>EMQX_PLUGINS__STATES__$INDEX</code>

A per-plugin config to describe the desired state of the plugin.
**Fields**

- name_vsn: <code>string()</code>

  The {name}-{version} of the plugin.<br>It should match the plugin application name-vsn as the for the plugin release package name<br>For example: my_plugin-0.1.0.

- enable: <code>boolean()</code>

  Set to 'true' to enable this plugin


## prometheus

**Config paths**

 - <code>prometheus</code>


**Env overrides**

 - <code>EMQX_PROMETHEUS</code>


**Fields**

- push_gateway_server: <code>string()</code>

- interval: <code>emqx_schema:duration_ms()</code>

  Default = `"15s"`

- enable: <code>boolean()</code>

  Default = `false`


## statsd

**Config paths**

 - <code>statsd</code>


**Env overrides**

 - <code>EMQX_STATSD</code>


**Fields**

- enable: <code>boolean()</code>

  Default = `false`

- server: <code>emqx_schema:ip_port()</code>

  Default = `"127.0.0.1:8125"`

- sample_time_interval: <code>emqx_schema:duration_ms()</code>

  Default = `"10s"`

- flush_time_interval: <code>emqx_schema:duration_ms()</code>

  Default = `"10s"`


## dashboard:emqx_dashboard

**Config paths**

 - <code>emqx_dashboard</code>


**Env overrides**

 - <code>EMQX_EMQX_DASHBOARD</code>


**Fields**

- listeners: <code>[[dashboard:http](#dashboard-http) | [dashboard:https](#dashboard-https)]</code>

- default_username: <code>string()</code>

  Default = `"admin"`

- default_password: <code>string()</code>

  Default = `"public"`


  The initial default password for dashboard 'admin' user.
  For safty, it should be changed as soon as possible.

- sample_interval: <code>emqx_schema:duration_s()</code>

  Default = `"10s"`

- token_expired_time: <code>emqx_schema:duration()</code>

  Default = `"30m"`

- cors: <code>boolean()</code>

  Default = `false`


## dashboard:http

**Config paths**

 - <code>emqx_dashboard.listeners.$INDEX</code>


**Env overrides**

 - <code>EMQX_EMQX_DASHBOARD__LISTENERS__$INDEX</code>


**Fields**

- protocol: <code>http | https</code>

- port: <code>integer()</code>

  Default = `18083`

- num_acceptors: <code>integer()</code>

  Default = `4`

- max_connections: <code>integer()</code>

  Default = `512`

- backlog: <code>integer()</code>

  Default = `1024`

- send_timeout: <code>emqx_schema:duration()</code>

  Default = `"5s"`

- inet6: <code>boolean()</code>

  Default = `false`

- ipv6_v6only: <code>boolean()</code>

  Default = `false`


## dashboard:https

**Config paths**

 - <code>emqx_dashboard.listeners.$INDEX</code>


**Env overrides**

 - <code>EMQX_EMQX_DASHBOARD__LISTENERS__$INDEX</code>


**Fields**

- protocol: <code>http | https</code>

- port: <code>integer()</code>

  Default = `18083`

- num_acceptors: <code>integer()</code>

  Default = `4`

- max_connections: <code>integer()</code>

  Default = `512`

- backlog: <code>integer()</code>

  Default = `1024`

- send_timeout: <code>emqx_schema:duration()</code>

  Default = `"5s"`

- inet6: <code>boolean()</code>

  Default = `false`

- ipv6_v6only: <code>boolean()</code>

  Default = `false`

- enable: <code>boolean()</code>

  Default = `false`

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
  Although the root CA certificate is optional, it should placed at the end of
  the file if it is to be added.


- keyfile: <code>string()</code>

  PEM format private key file.<br>


- verify: <code>verify_peer | verify_none</code>

  Default = `verify_none`

- reuse_sessions: <code>boolean()</code>

  Default = `true`

- depth: <code>integer()</code>

  Default = `10`

- password: <code>string()</code>

  String containing the user's password. Only used if the private
  keyfile is password-protected.

- versions: <code>[atom()]</code>

  Default = `[tlsv1.3, tlsv1.2, tlsv1.1, tlsv1]`

  All TLS/DTLS versions to be supported.<br>
  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  In case PSK cipher suites are intended, make sure to configured
  <code>['tlsv1.2', 'tlsv1.1']</code> here.


- ciphers: <code>[string()]</code>

  Default = `["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256", "TLS_AES_128_CCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "ECDHE-ECDSA-AES256-GCM-SHA384", "ECDHE-RSA-AES256-GCM-SHA384", "ECDHE-ECDSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA384", "ECDH-ECDSA-AES256-GCM-SHA384", "ECDH-RSA-AES256-GCM-SHA384", "ECDH-ECDSA-AES256-SHA384", "ECDH-RSA-AES256-SHA384", "DHE-DSS-AES256-GCM-SHA384", "DHE-DSS-AES256-SHA256", "AES256-GCM-SHA384", "AES256-SHA256", "ECDHE-ECDSA-AES128-GCM-SHA256", "ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-ECDSA-AES128-SHA256", "ECDHE-RSA-AES128-SHA256", "ECDH-ECDSA-AES128-GCM-SHA256", "ECDH-RSA-AES128-GCM-SHA256", "ECDH-ECDSA-AES128-SHA256", "ECDH-RSA-AES128-SHA256", "DHE-DSS-AES128-GCM-SHA256", "DHE-DSS-AES128-SHA256", "AES128-GCM-SHA256", "AES128-SHA256", "ECDHE-ECDSA-AES256-SHA", "ECDHE-RSA-AES256-SHA", "DHE-DSS-AES256-SHA", "ECDH-ECDSA-AES256-SHA", "ECDH-RSA-AES256-SHA", "ECDHE-ECDSA-AES128-SHA", "ECDHE-RSA-AES128-SHA", "DHE-DSS-AES128-SHA", "ECDH-ECDSA-AES128-SHA", "ECDH-RSA-AES128-SHA", "RSA-PSK-AES256-GCM-SHA384", "RSA-PSK-AES256-CBC-SHA384", "RSA-PSK-AES128-GCM-SHA256", "RSA-PSK-AES128-CBC-SHA256", "RSA-PSK-AES256-CBC-SHA", "RSA-PSK-AES128-CBC-SHA"]`

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
  All default values and examples proveded by EMQX config
  documentation are all in OpenSSL format.<br>

  NOTE: Certain cipher suites are only compatible with
  specific TLS <code>versions</code> ('tlsv1.1', 'tlsv1.2' or 'tlsv1.3')
  incompatible cipher suites will be silently dropped.
  For instance, if only 'tlsv1.3' is given in the <code>versions</code>,
  configuring cipher suites for other versions will have no effect.
  <br>

  NOTE: PSK ciphers are suppresed by 'tlsv1.3' version config<br>
  If PSK cipher suites are intended, 'tlsv1.3' should be disabled from <code>versions</code>.<br>
  PSK cipher suites: <code>"RSA-PSK-AES256-GCM-SHA384,RSA-PSK-AES256-CBC-SHA384,
  RSA-PSK-AES128-GCM-SHA256,RSA-PSK-AES128-CBC-SHA256,
  RSA-PSK-AES256-CBC-SHA,RSA-PSK-AES128-CBC-SHA,
  RSA-PSK-DES-CBC3-SHA,RSA-PSK-RC4-SHA"</code><br>


- user_lookup_fun: <code>string()</code>

  Default = `"emqx_tls_psk:lookup"`

- secure_renegotiate: <code>boolean()</code>

  Default = `true`


  SSL parameter renegotiation is a feature that allows a client and a server
  to renegotiate the parameters of the SSL connection on the fly.
  RFC 5746 defines a more secure way of doing this. By enabling secure renegotiation,
  you drop support for the insecure renegotiation, prone to MitM attacks.


- dhfile: <code>string()</code>

  Path to a file containing PEM-encoded Diffie Hellman parameters
  to be used by the server if a cipher suite using Diffie Hellman
  key exchange is negotiated. If not specified, default parameters
  are used.<br>
  NOTE: The dhfile option is not supported by TLS 1.3.

- honor_cipher_order: <code>boolean()</code>

  Default = `true`

- client_renegotiation: <code>boolean()</code>

  Default = `true`


  In protocols that support client-initiated renegotiation,
  the cost of resources of such an operation is higher for the server than the client.
  This can act as a vector for denial of service attacks.
  The SSL application already takes measures to counter-act such attempts,
  but client-initiated renegotiation can be strictly disabled by setting this option to false.
  The default value is true. Note that disabling renegotiation can result in
  long-lived connections becoming unusable due to limits on
  the number of messages the underlying cipher suite can encipher.


- handshake_timeout: <code>emqx_schema:duration()</code>

  Default = `"15s"`

  Maximum time duration allowed for the handshake to complete


