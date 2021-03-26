import { Audit, Auditor, laxAudit } from "@auditors/core"

export function auditJsonResponse(auditor?: Auditor | null) {
  return async function (
    audit: Audit,
    response: unknown,
  ): Promise<[unknown, unknown]> {
    if (response == null) {
      return [response, null]
    }
    if (typeof response !== "object") {
      return audit.unexpectedType(response, "object")
    }
    const validResponse = response as {
      ok: boolean
      json: () => Promise<{ error?: { details?: unknown } }>
      status: number
      statusText: string
      text: () => Promise<string>
    }
    if (
      !validResponse.ok &&
      (validResponse.status < 400 || validResponse.status >= 404)
    ) {
      return [
        { response: await validResponse.text() },
        `${validResponse.status} ${validResponse.statusText}`,
      ]
    }
    if (validResponse.status === 204) {
      console.assert(auditor == null)
      return [null, null]
    }
    const data = await validResponse.json()
    if (data == null) {
      return [data, null]
    }
    if (typeof data !== "object") {
      return audit.unexpectedType(data, "object")
    }
    const error = data.error
    if (error) {
      if (error.details) {
        return [data, error.details]
      }
      return [data, error]
    }
    if (auditor == null) {
      return [data, null]
    }
    return auditor(audit, data)
  }
}

export function validateJsonResponse(auditor?: Auditor | null) {
  return async function (response: unknown): Promise<[unknown, unknown]> {
    return auditJsonResponse(auditor)(laxAudit, response)
  }
}
