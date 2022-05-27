export interface IParams {
  infectiousAmount: number;
  susceptibleAmount: number;
  infectionRadius: number;
  timeToRecover: number;
  chanceToInfect: number;
  separationPercent: number;
  quarantinePercent: number;
  vaccinePercent: number;
}

export interface ILabels {
  infectiousLabels: number[];
  susceptibleLabels: number[];
  recoveredLabels: number[];
}
