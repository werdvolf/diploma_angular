import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ShareService } from '../share.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  infectedAmount: number = 10;
  suspectibleAmount: number = 10;
  separationPercent: number = 0;
  infectionRadius: number = 10;
  timeToRecover: number = 10;
  quarantine: boolean = false;

  constructor(private shareService: ShareService) {}

  ngOnInit(): void {
    this.shareService.sendInfectedAmount(this.infectedAmount);
    this.shareService.sendSuspectibleAmount(this.suspectibleAmount);
  }
  onValueChange() {
    this.shareService.sendInfectedAmount(this.infectedAmount);
    this.shareService.sendSuspectibleAmount(this.suspectibleAmount);
  }
}
