export interface Formula {
  content: string
  documentation?: string
  source: string
}

export interface Variable {
  defaultValue: boolean | number | string
  definitionPeriod: "ETERNITY" | "MONTH" | "YEAR"
  description: string | null
  entity: "famille" | "foyer_fiscal" | "individu" | "menage"
  formulas?: { [date: string]: Formula }
  id: string
  possibleValues?: { [id: string]: string }
  references?: string[]
  source: string
  valueType: "Boolean" | "Date" | "Float" | "Int" | "String"
}

export interface VariableSummary {
  description: string | null
  href: string
}

export interface VariableSummaryById {
  [id: string]: VariableSummary
}
