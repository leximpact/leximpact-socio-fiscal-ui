export interface EntitySituation {
  [key: string]: { [date: string]: number | null } | string[]
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
  familles: { [name: string]: FamilleSituation }
  foyers_fiscaux: { [name: string]: FoyerFiscalSituation }
  individus: { [name: string]: IndividuSituation }
  menages: { [name: string]: MenageSituation }
}
