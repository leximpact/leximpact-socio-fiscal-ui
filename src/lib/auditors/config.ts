import {
  Audit,
  auditBoolean,
  auditRequire,
  auditSetNullish,
  auditStringToBoolean,
  auditSwitch,
  auditTrimString,
  cleanAudit,
} from "@auditors/core"

export function auditConfig(audit: Audit, data: any): [any, any] {
  if (data == null) {
    return [data, null]
  }
  if (typeof data !== "object") {
    return audit.unexpectedType(data, "object")
  }

  data = { ...data }
  const errors: { [key: string]: any } = {}
  const remainingKeys = new Set(Object.keys(data))

  audit.attribute(
    data,
    "proxy",
    true,
    errors,
    remainingKeys,
    auditSwitch([auditTrimString, auditStringToBoolean], auditBoolean),
    auditSetNullish(false),
  )
  audit.attribute(
    data,
    "title",
    true,
    errors,
    remainingKeys,
    auditTrimString,
    auditRequire,
  )

  return audit.reduceRemaining(data, errors, remainingKeys)
}

export function validateConfig(data: any): [any, any] {
  return auditConfig(cleanAudit, data)
}
