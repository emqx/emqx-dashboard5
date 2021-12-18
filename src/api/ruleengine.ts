import http from "@/common/http";

export function getBridgeList(): Promise<any> {
  return http.get("/bridges");
}

export function createBridge(body: Record<string, unknown>): Promise<any> {
  return http.post("/bridges", body);
}

export function updateBridge(
  id: string,
  body: Record<string, unknown>
): Promise<any> {
  if (!id) return Promise.reject();
  return http.put("/bridges/" + encodeURIComponent(id), body);
}

export function startStopBridge(
  id: string,
  op: "start" | "stop"
): Promise<any> {
  if (!id) return Promise.reject();
  return http.post(`/bridges/${encodeURIComponent(id)}/operation/${op}`);
}

export function getBridgeInfo(id: string): Promise<any> {
  if (!id) return Promise.reject();
  return http.get("/bridges/" + encodeURIComponent(id));
}

export function getConnectorList(): Promise<any> {
  return http.get("/connectors");
}

export function createConnector(body: Record<string, unknown>): Promise<any> {
  return http.post("/connectors", body);
}

export function updateConnector(
  id: string,
  body: Record<string, unknown>
): Promise<any> {
  if (!id) return Promise.reject();
  return http.put("/connectors/" + encodeURIComponent(id), body);
}

export function deleteConnector(id: string) {
  if (!id) return;
  return http.delete("/connectors/" + encodeURIComponent(id));
}

export function getRules() {
  return http.get("/rules");
}
