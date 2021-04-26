export interface ReformChange {
  start: string
  stop?: string
  value: number
}

export interface Reform {
  [parameterName: string]: ReformChange
}
