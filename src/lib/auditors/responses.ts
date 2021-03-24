import { Audit, Auditor, laxAudit } from "@auditors/core"

export function auditJsonResponse(auditor?: Auditor | null) {
  return async function (audit: Audit, response: any): Promise<[any, any]> {
    if (response == null) {
      return [response, null]
    }
    if (typeof response !== "object") {
      return audit.unexpectedType(response, "object")
    }
    if (!response.ok && (response.status < 400 || response.status >= 404)) {
      return [
        { response: await response.text() },
        `${response.status} ${response.statusText}`,
      ]
    }
    if (response.status === 204) {
      console.assert(auditor == null)
      return [null, null]
    }
    const data = await response.json()
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
  return async function (response: any): Promise<[any, any]> {
    return auditJsonResponse(auditor)(laxAudit, response)
  }
}
