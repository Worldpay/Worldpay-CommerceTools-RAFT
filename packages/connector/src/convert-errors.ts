import { AxiosHeaders } from 'axios'

export function axiosError(response: any) {
  if (response === undefined) {
    return undefined
  }
  let url = response.config?.url ?? ''
  if (response.config?.baseURL) {
    url = `${response.config.baseURL}${url}`
  }
  return {
    code: response.code,
    name: response.name,
    message: response.message,
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    statusMessage: response.statusMessage,
    headers: extractAxiosHeaders(response.config?.headers) as any,
    ...(url &&
      response.config?.headers && {
        config: {
          url,
          headers: response.config?.headers,
        },
      }),
  }
}

function extractAxiosHeaders(headers: unknown): Record<string, string> | undefined {
  let extractedHeaders: Record<string, string> = {}
  if (headers instanceof AxiosHeaders) {
    const jsonHeaders = headers.toJSON() as Record<string, any>
    extractedHeaders = {}
    for (const [name, value] of Object.entries(jsonHeaders)) {
      const lcName = name.toLowerCase()
      if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
        extractedHeaders[lcName] = value.toString()
      } else if (Array.isArray(value)) {
        extractedHeaders[lcName] = value.join(', ')
      }
    }
  }
  return Object.keys(extractedHeaders).length > 0 ? extractedHeaders : undefined
}
