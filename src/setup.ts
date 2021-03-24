import config from "$lib/config"

export function getSession({ context }) {
  return {
    title: config.title,
  }
}
