export interface Formula {
  documentation?: string
  parameters?: string[]
  source: string
  source_code: string
  variables?: string[]
}

export interface Variable {
  default_value: boolean | number | string
  definition_period: "eternity" | "month" | "year"
  documentation?: string
  entity: "famille" | "foyer_fiscal" | "individu" | "menage"
  formulas?: { [date: string]: Formula | null }
  label?: string
  name: string
  possible_values?: { [name: string]: string }
  reference?: string[]
  referring_variables?: string[]
  source: string
  // TODO
  valueType: "Boolean" | "Date" | "Float" | "Int" | "String"
}

export interface VariableSummary {
  // href: string
  label?: string
}

export interface VariableSummaryByName {
  [name: string]: VariableSummary
}
