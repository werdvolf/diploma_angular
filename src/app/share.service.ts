import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private infectedAmount = new BehaviorSubject<number | null>(10);
  sharedInfectedAmount = this.infectedAmount.asObservable();

  private suspectibleAmount = new BehaviorSubject<number | null>(10);
  sharedSuspectibleAmount = this.suspectibleAmount.asObservable();

  private suspectibleChartLabels = new BehaviorSubject<number[] | null>([]);
  sharedSuspectibleChartLabels = this.suspectibleChartLabels.asObservable();

  private infectedChartLabels = new BehaviorSubject<number[] | null>([]);
  sharedInfectedChartLabels = this.infectedChartLabels.asObservable();

  sendInfectedAmount(message: number | null) {
    this.infectedAmount.next(message);
  }

  sendSuspectibleAmount(message: number | null) {
    this.suspectibleAmount.next(message);
  }

  sendInfectedChartLabels(message: number[] | null) {
    this.infectedChartLabels.next(message);
  }

  sendSuspectibleChartLabels(message: number[] | null) {
    this.suspectibleChartLabels.next(message);
  }
}
