export interface IParams {
  infectedAmount: number;
  suspectibleAmount: number;
  separationPercent: number;
  infectionRadius: number;
  timeToRecover: number;
  chanceToInfect: number;
  // quarantine: boolean;
}

export interface ILabels {
  infectedLabels: number[];
  suspectibleLabels: number[];
  recoveredLabels: number[];
}
