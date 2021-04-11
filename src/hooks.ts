import config from "$lib/config"
import type { Session } from "$lib/session"

export function getSession(): Session {
  return {
    apiBaseUrl: config.apiBaseUrl,
    apiWebSocketBaseUrl: config.apiWebSocketBaseUrl,
    title: config.title,
  }
}
