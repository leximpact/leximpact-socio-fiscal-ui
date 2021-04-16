export type AnyParameter = Parameter | ParameterNode | Scale

export interface Parameter extends ParameterBase {
  class: ParameterClass.Parameter
  values: ParameterAtInstant[]
}

export interface ParameterAtInstant {
  instant: string
  name: string
  source?: string
  unit?: Unit
  value: number | string | string[]
}

export interface ParameterBase {
  class: ParameterClass
  description?: string
  documentation?: string
  name: string
  reference?: string | string[] | { [instant: string]: string | string[] }
  source?: string
  unit?: Unit
}

export enum ParameterClass {
  Node = "Node",
  Parameter = "Parameter",
  Scale = "Scale",
}

export interface ParameterNode extends ParameterBase {
  children: { [name: string]: AnyParameter }
  class: ParameterClass.Node
}

export interface Scale extends ParameterBase {
  brackets: { [instant: string]: { [threshold: string]: number | null } | null }
  class: ParameterClass.Scale
  rate_unit?: Unit.Rate
  threshold_unit?: Unit.Currency
  type: ScaleType
}

export enum ScaleType {
  MarginalRate = "marginal_rate",
  SingleAmount = "single_amount",
}

export enum Unit {
  CodesDepartements = "codes départements",
  CountryCode = "ISO 3166-1 alpha-2", // Two-letters code of a country
  Currency = "currency",
  Month = "month",
  Rate = "/1", // Number between 0 and 1
  Year = "year",
}
