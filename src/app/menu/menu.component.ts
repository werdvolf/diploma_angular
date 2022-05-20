import { Component, OnInit } from '@angular/core';
import { IParams } from '../interfaces/interfaces';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  params: IParams = {
    infectedAmount: 10,
    suspectibleAmount: 10,
    separationPercent: 10,
    infectionRadius: 10,
    timeToRecover: 10,
    chanceToInfect: 0.1,
    // quarantine: false,
  };

  constructor(private shareService: ShareService) {}

  ngOnInit(): void {
    this.shareService.sendParams(this.params);
  }
  onValueChange() {
    this.shareService.sendParams(this.params);
  }
}
