import { AxiosInstance, AxiosResponse } from 'axios'
import https from 'node:https'
import axios from 'axios'
import { RequestHeader } from '@reflet/http'
import { getConfig } from './config'

let axiosClient: AxiosInstance = undefined

export function initializeConnector() {
  /**
   * The config options passed in to the {@see HttpsAgent.Agent} used
   * with the axios instance that we create.
   */
  const DEFAULT_HTTPS_AGENT_CONFIG = {
    keepAlive: true,
    maxSockets: 10,
    maxFreeSockets: 5,
    timeout: getConfig().worldpayRaft.timeoutMs,
  }

  const agent = new https.Agent(DEFAULT_HTTPS_AGENT_CONFIG)
  const DEFAULT_RAFT_URL = `${getConfig().worldpayRaft.URL}${getConfig().worldpayRaft.path}`
  axiosClient = axios.create({
    httpsAgent: agent,
    baseURL: getConfig().worldpayRaft.URL ?? DEFAULT_RAFT_URL,
  })
}

export async function sendRaftMessage(endpoint: string, message: object): Promise<AxiosResponse> {
  if (!axiosClient) {
    initializeConnector()
  }
  const headers = {
    [RequestHeader.Authorization]: `VANTIV license="${getConfig().worldpayRaft.license}"`,
    [RequestHeader.ContentType]: 'application/json',
  }

  try {
    return await axiosClient.post(`${getConfig().worldpayRaft.path}${endpoint}`, message, {
      headers: headers,
      timeout: getConfig().worldpayRaft.timeoutMs,
    })
  } catch (err) {
    // We had a case where the response from a previous request was returned to a request when a
    // timeout ocurred, possibly caused by cached traffic or bug on the raft side. Reconnect to RAFT
    // in case of an error to guarantee that will never be the case again.
    initializeConnector()
    throw err
  }
}
