import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private infectedAmount = new BehaviorSubject<number>(10);
  sharedInfectedAmount = this.infectedAmount.asObservable();

  private suspectibleAmount = new BehaviorSubject<number>(10);
  sharedSuspectibleAmount = this.suspectibleAmount.asObservable();

  private suspectibleChartLabels = new BehaviorSubject<number[]>([]);
  sharedSuspectibleChartLabels = this.suspectibleChartLabels.asObservable();

  private infectedChartLabels = new BehaviorSubject<number[]>([]);
  sharedInfectedChartLabels = this.infectedChartLabels.asObservable();

  private recoveredChartLabels = new BehaviorSubject<number[]>([]);
  sharedRecoveredChartLabels = this.recoveredChartLabels.asObservable();

  sendInfectedAmount(message: number) {
    this.infectedAmount.next(message);
  }

  sendSuspectibleAmount(message: number) {
    this.suspectibleAmount.next(message);
  }

  sendInfectedChartLabels(message: number[]) {
    this.infectedChartLabels.next(message);
  }

  sendSuspectibleChartLabels(message: number[]) {
    this.suspectibleChartLabels.next(message);
  }

  sendRecoveredChartLabels(message: number[]) {
    this.recoveredChartLabels.next(message);
  }
}
