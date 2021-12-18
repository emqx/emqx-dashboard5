export type tlsConfig = {
  enable: boolean;
  verify: string;
  certfile: string;
  keyfile: string;
  cacertfile: string;
};

export interface Connector {
  type: "mqtt";
  name: string;
}

export interface ConnectorItem {
  id: string;
  keepalive: number;
}

export type BridgeItem = {
  id: string;
  status: string;
};
