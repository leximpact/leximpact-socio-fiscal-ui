import dotenv from "dotenv"
dotenv.config()

import { validateConfig } from "./auditors/config"

export interface Config {
  apiBaseUrl: string
  apiWebSocketBaseUrl: string
  proxy: boolean
  title: string
}

const [validConfig, error] = validateConfig({
  apiBaseUrl: process.env["API_BASE_URL"],
  proxy: process.env["PROXY"],
  title: process.env["TITLE"],
})
if (error !== null) {
  console.error(
    `Error in configuration:\n${JSON.stringify(
      validConfig,
      null,
      2,
    )}\nError:\n${JSON.stringify(error, null, 2)}`,
  )
  process.exit(-1)
}
const config = validConfig as Config
config.apiWebSocketBaseUrl = config.apiBaseUrl.replace(/^http/, "ws")

export default config
