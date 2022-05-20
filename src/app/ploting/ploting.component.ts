import { Component, OnInit } from '@angular/core';
import { ILabels } from '../interfaces/interfaces';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-ploting',
  templateUrl: './ploting.component.html',
  styleUrls: ['./ploting.component.scss'],
})
export class PlotingComponent implements OnInit {
  data: any;
  options: any;
  labels: ILabels;

  constructor(private shareService: ShareService) {}

  //get labels from share service
  getLabels() {
    this.shareService.sharedLabels.subscribe(
      (message) => (this.labels = message)
    );
  }
  //create data for chart
  createData(suspectible: number[], infected: number[], recovered: number[]) {
    return {
      //generate labels in range 0...suspectible.length
      labels: [...Array(suspectible?.length)].map((_, i) => i),
      datasets: [
        {
          label: 'Suspectible',
          data: suspectible,
          fill: false,
          borderColor: '#0000FF',
        },
        {
          label: 'Infected',
          data: infected,
          fill: false,
          borderColor: '#FF0000',
        },
        {
          label: 'Recovered',
          data: recovered,
          fill: false,
          borderColor: '#808080',
        },
      ],
    };
  }

  createOptions() {
    return {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: false,
          align: 'center',
          text: 'Time',
          min: 0,
        },
        y: {
          align: 'center',
          text: 'Population',
          min: 1,
        },
      },
    };
  }

  ngOnInit() {
    this.getLabels();
    this.data = this.createData(
      this.labels.suspectibleLabels,
      this.labels.infectedLabels,
      this.labels.recoveredLabels
    );
    this.options = this.createOptions();
  }

  update(event: Event) {
    this.getLabels();
    this.data = this.createData(
      this.labels.suspectibleLabels,
      this.labels.infectedLabels,
      this.labels.recoveredLabels
    );
  }
}
