import { stringifyQuery } from "./urls"

export interface CalculationQuery {
  pane1?: string[]
  pane2?: string[]
  pane3?: string[]
  pane4?: string[]
}

export interface ValidCalculationQuery {
  pane1?: string[]
  pane2?: string[]
  pane3?: string[]
  pane4?: string[]
}

export function newCalculationUrl({
  pane1 = [],
  pane2 = [],
  pane3 = [],
  pane4 = [],
}: CalculationQuery = {}): string {
  const query: {
    pane1?: string[]
    pane2?: string[]
    pane3?: string[]
    pane4?: string[]
  } = {
    pane1,
    pane2,
    pane3,
    pane4,
  }
  const queryString = stringifyQuery(query)
  return `/calculations${queryString ? "?" + queryString : ""}`
}
