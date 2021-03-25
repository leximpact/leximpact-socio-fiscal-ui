export interface Parameter {
  description: string | null
  id: string
  metadata: ParameterMetadata
  source: string
  subparams: { [id: string]: { description: string | null } }
  values?: { [date: string]: number }
}

export interface ParameterMetadata {
  unit?: "/1"
}

export interface ParametersNode extends ParameterSummary {
  children?: { [id: string]: ParametersNode }
}

export interface ParameterSummary {
  description: string | null
  href: string
}

export interface ParametersTree {
  [id: string]: ParametersNode
}
