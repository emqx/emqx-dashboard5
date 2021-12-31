import http from '@/common/http'
import axios from "axios";
import { API_BASE_URL } from "@/common/constants";
import {
  requestInterceptorAddHeader,
  requestInterceptorHandleError,
  requestInterceptorHandleRequestQueue,
  responseInterceptorDefault,
  responseInterceptorHandleError,
  setProgressBarDone,
} from "@/common/http";

export function listClients(params = {}) {
  return http.get('/clients', { params })
}

export function searchClients(clientId) {
  return http.get(`/clients/${encodeURIComponent(clientId)}`)
}

// 搜索单个节点的连接
export function searchNodeClients(nodeName, clientId) {
  return http.get(`/nodes/${nodeName}/clients/${encodeURIComponent(clientId)}`)
}

export function disconnectClient(clientId) {
  return http.delete(`/clients/${encodeURIComponent(clientId)}`)
}

export async function loadClientDetail(clientId) {
  const selfHttp = axios.create({
    baseURL: API_BASE_URL,
  });
  selfHttp.interceptors.request.use(requestInterceptorAddHeader, requestInterceptorHandleError);
  selfHttp.interceptors.request.use(requestInterceptorHandleRequestQueue);
  selfHttp.interceptors.response.use(responseInterceptorDefault, (error) => {
    setProgressBarDone();
    if (error.response.status === 404) {
      return Promise.reject(error);
    }
    return responseInterceptorHandleError(error);
  });
  return selfHttp.get(`/clients/${encodeURIComponent(clientId)}`);
}

export function loadSubscriptions(clientId) {
  return http.get(`/clients/${encodeURIComponent(clientId)}/subscriptions`)
}

export function unsubscribe(clientId, topic) {
  if (null == topic) return
  return http.post(`/clients/${encodeURIComponent(clientId)}/unsubscribe`, { topic })
}

export function subscribe(clientId, { qos, topic }) {
  return http.post(`/clients/${encodeURIComponent(clientId)}/subscribe`, { qos, topic })
}
