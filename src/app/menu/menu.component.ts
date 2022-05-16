import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ShareService } from '../share.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  infectedAmount: number | null = 10;
  suspectibleAmount: number | null = 10;

  constructor(private shareService: ShareService) {}

  ngOnInit(): void {
    if (this.infectedAmount && this.suspectibleAmount) {
      this.shareService.sendInfectedAmount(this.infectedAmount);
      this.shareService.sendSuspectibleAmount(this.suspectibleAmount);
    }
  }
  onValueChange() {
    if (this.infectedAmount && this.suspectibleAmount) {
      this.shareService.sendInfectedAmount(this.infectedAmount);
      this.shareService.sendSuspectibleAmount(this.suspectibleAmount);
    }
  }
}
