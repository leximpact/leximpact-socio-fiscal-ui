import { stringifyQuery } from "./urls"

export interface CalculationQuery {
  pane1?: string
  pane2?: string
  pane3?: string
  pane4?: string
}

export interface ValidCalculationQuery {
  pane1?: string
  pane2?: string
  pane3?: string
  pane4?: string
}

export function newCalculationUrl({
  pane1,
  pane2,
  pane3,
  pane4,
}: CalculationQuery = {}): string {
  const query: {
    pane1?: string
    pane2?: string
    pane3?: string
    pane4?: string
  } = {}
  if (pane1) {
    query.pane1 = pane1
  }
  if (pane2) {
    query.pane2 = pane2
  }
  if (pane3) {
    query.pane3 = pane3
  }
  if (pane4) {
    query.pane4 = pane4
  }
  const queryString = stringifyQuery(query)
  return `/calculations${queryString ? "?" + queryString : ""}`
}
