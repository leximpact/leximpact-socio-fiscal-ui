import dotenv from "dotenv"
dotenv.config()

import { validateConfig } from "./auditors/config"

export interface Config {
  proxy: boolean
  title: string
}

const config = {
  proxy: process.env.PROXY || false,
  title: process.env.TITLE || "Simulateur socio-fiscal",
}

const [validConfig, error] = validateConfig(config)
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

export default validConfig as Config
