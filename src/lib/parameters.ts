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
  id: string // Generated attribute (last part of name)
  name: string
  parent?: ParameterNode // Generated attribute
  reference?: string | string[] | { [instant: string]: string | string[] }
  referring_variables?: string[]
  source?: string
  title: string // Generated attribute constructed using description or name
  titles: string // Generated attribute aggregating the titles of every ancestors
  unit?: Unit
}

export enum ParameterClass {
  Node = "Node",
  Parameter = "Parameter",
  Scale = "Scale",
}

export interface ParameterNode extends ParameterBase {
  children?: { [id: string]: AnyParameter } // Children are removed from ancestors.
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

export function improveParameter(
  parent: ParameterNode | undefined | null,
  parameter: AnyParameter,
): void {
  const nameSplit = parameter.name.split(".")
  const id = nameSplit[nameSplit.length - 1]
  parameter.id = id
  if (parent != null) {
    parameter.parent = parent
  }
  const title =
    parameter.description === undefined
      ? id.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())
      : parameter.description
  parameter.title = title
  parameter.titles = parent == null ? title : [parent.titles, title].join(" ")

  switch (parameter.class) {
    case ParameterClass.Node:
      if (parameter.children !== undefined) {
        for (const child of Object.values(parameter.children)) {
          improveParameter(parameter, child)
        }
      }
      break
    default:
  }
}

export function* iterParameterAncestors(
  parameter?: AnyParameter | undefined | null,
): Generator<AnyParameter, void, unknown> {
  if (parameter == null || !parameter.id) {
    return
  }
  yield* iterParameterAncestors(parameter.parent)
  yield parameter
}
