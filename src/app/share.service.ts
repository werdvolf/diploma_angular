import { Injectable } from '@angular/core';
import { IParams, ILabels } from './interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  defaultParams: IParams = {
    infectedAmount: 10,
    suspectibleAmount: 10,
    separationPercent: 10,
    infectionRadius: 10,
    timeToRecover: 10,
    chanceToInfect: 0.1,
    // quarantine: false,
  };

  defaulLabels: ILabels = {
    infectedLabels: [],
    suspectibleLabels: [],
    recoveredLabels: [],
  };

  private params = new BehaviorSubject<IParams>(this.defaultParams);
  sharedParams = this.params.asObservable();
  sendParams(message: IParams) {
    this.params.next(message);
  }

  private labels = new BehaviorSubject<ILabels>(this.defaulLabels);
  sharedLabels = this.labels.asObservable();
  sendLabels(message: ILabels) {
    this.labels.next(message);
  }
}
