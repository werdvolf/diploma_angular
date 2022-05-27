import { Component, OnInit } from '@angular/core';
import { IParams } from '../interfaces/interfaces';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  quarantine: boolean = false;
  vaccine: boolean = false;
  params: IParams = {
    infectiousAmount: 10,
    susceptibleAmount: 10,
    separationPercent: 0,
    infectionRadius: 10,
    timeToRecover: 10,
    chanceToInfect: 0.1,
    quarantinePercent: 0,
    vaccinePercent: 0,
  };

  constructor(private shareService: ShareService) {}

  onCheckboxChange() {
    if (this.quarantine == false) this.params.quarantinePercent = 0;
    if (this.vaccine == false) this.params.vaccinePercent = 0;
  }

  ngOnInit(): void {
    this.shareService.sendParams(this.params);
  }

  onValueChange() {
    this.shareService.sendParams(this.params);
  }
}
