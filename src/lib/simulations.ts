export interface EntitySimulation {
  [key: string]: { [date: string]: number } | string[]
}

export interface FamilleSimulation extends EntitySimulation {
  enfants: string[]
  parents: string[]
}

export interface FoyerFiscalSimulation extends EntitySimulation {
  declarants: string[]
  personnes_a_charge: string[]
}

export type IndividuSimulation = EntitySimulation

export interface MenageSimulation extends EntitySimulation {
  conjoint: string[]
  enfants: string[]
  personne_de_reference: string[]
}

export interface Simulation {
  familles: { [name: string]: FamilleSimulation }
  foyers_fiscaux: { [name: string]: FoyerFiscalSimulation }
  individus: { [name: string]: IndividuSimulation }
  menages: { [name: string]: MenageSimulation }
}
