import { ComponentPublicInstance } from 'vue'

export interface SubTabComponent extends ComponentPublicInstance {
  index: number
  reloading: () => void
}

export interface Cluster {
  name: string
  discovery_strategy: string
  autoclean: string
  autoheal: boolean
  static: Static
  mcast: Mcast
  proto_dist: string
  dns: Dns
  etcd: Etcd
  k8s: K8s
}

export interface Static {
  seeds: string
}

export interface Mcast {
  addr: string
  ports: number[]
  iface: string
  ttl: number
  loop: boolean
  sndbuf: string
  recbuf: string
  buffer: string
}

export interface Dns {
  name: string
  app: string
}

export interface Etcd {
  server: string
  prefix: string
  node_ttl: string
  ssl: SSL
}

export interface SSL {
  enable: boolean
  cacertfile: string
  certfile: string
  keyfile: string
  verify: string
  reuse_sessions: boolean
  depth: number
  password: string
  versions: string[]
  ciphers: string[]
  user_lookup_fun: string
  secure_renegotiate: boolean
  server_name_indication: string
}

export interface K8s {
  apiserver: string
  service_name: string
  address_type: string
  app_name: string
  namespace: string
  suffix: string
}
