import config from "$lib/config"
import type { Session } from "$lib/session"

export function getSession(): Session {
  return {
    apiWebSocketBaseUrl: config.apiWebSocketBaseUrl,
    title: config.title,
  }
}
