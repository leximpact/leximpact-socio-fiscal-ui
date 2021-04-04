import {
  Audit,
  auditBoolean,
  auditHttpUrl,
  auditRequire,
  auditSetNullish,
  auditStringToBoolean,
  auditSwitch,
  auditTrimString,
  cleanAudit,
} from "@auditors/core"

export function auditConfig(
  audit: Audit,
  dataUnknown: unknown,
): [unknown, unknown] {
  if (dataUnknown == null) {
    return [dataUnknown, null]
  }
  if (typeof dataUnknown !== "object") {
    return audit.unexpectedType(dataUnknown, "object")
  }

  const data = { ...dataUnknown }
  const errors: { [key: string]: unknown } = {}
  const remainingKeys = new Set(Object.keys(data))

  audit.attribute(
    data,
    "apiBaseUrl",
    true,
    errors,
    remainingKeys,
    auditHttpUrl,
    auditRequire,
  )
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

export function validateConfig(data: unknown): [unknown, unknown] {
  return auditConfig(cleanAudit, data)
}
