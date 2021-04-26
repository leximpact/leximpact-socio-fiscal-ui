import {
  Audit,
  auditArray,
  auditSetNullish,
  auditString,
  cleanAudit,
} from "@auditors/core"

export function auditCalculationQuery(
  audit: Audit,
  query: URLSearchParams,
): [unknown, unknown] {
  if (query == null) {
    return [query, null]
  }
  if (!(query instanceof URLSearchParams)) {
    return audit.unexpectedType(query, "URLSearchParams")
  }

  const data: { [key: string]: unknown } = {}
  // @ts-expect-error: urlSearchParams.entries() exists both on browsers & Node.
  for (const [key, value] of query.entries()) {
    let values = data[key] as string[] | undefined
    if (values === undefined) {
      values = data[key] = []
    }
    values.push(value)
  }
  const errors: { [key: string]: unknown } = {}
  const remainingKeys = new Set(Object.keys(data))

  for (const key of ["pane1", "pane2", "pane3", "pane4"]) {
    audit.attribute(
      data,
      key,
      true,
      errors,
      remainingKeys,
      auditArray(auditString),
    )
  }

  return audit.reduceRemaining(data, errors, remainingKeys, auditSetNullish({}))
}

export function validateCalculationQuery(
  query: URLSearchParams,
): [unknown, unknown] {
  return auditCalculationQuery(cleanAudit, query)
}
