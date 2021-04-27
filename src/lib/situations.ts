export interface Axis {
  count: number
  index?: number
  max: number
  min: number
  name: string
  period?: string
}

export interface EntitySituation {
  [key: string]: { [date: string]: number | null } | string[]
}

export interface EntitySituationComplement {
  [key: string]: boolean | number | string | null
}

export interface FamilleSituation extends EntitySituation {
  enfants: string[]
  parents: string[]
}

export interface FoyerFiscalSituation extends EntitySituation {
  declarants: string[]
  personnes_a_charge: string[]
}

export type IndividuSituation = EntitySituation

export interface MenageSituation extends EntitySituation {
  conjoint: string[]
  enfants: string[]
  personne_de_reference: string[]
}

export interface Situation {
  axes?: Axis[][]
  familles: { [name: string]: FamilleSituation }
  foyers_fiscaux: { [name: string]: FoyerFiscalSituation }
  individus: { [name: string]: IndividuSituation }
  menages: { [name: string]: MenageSituation }
}

export interface SituationComplement {
  familles: { [name: string]: EntitySituationComplement }
  foyers_fiscaux: { [name: string]: EntitySituationComplement }
  individus: { [name: string]: EntitySituationComplement }
  menages: { [name: string]: EntitySituationComplement }
}
