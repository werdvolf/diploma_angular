import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-ploting',
  templateUrl: './ploting.component.html',
  styleUrls: ['./ploting.component.scss'],
})
export class PlotingComponent implements OnInit {
  data: any;
  options: any;
  suspectible: number[] | null;
  infected: number[] | null;

  constructor(private shareService: ShareService) {}

  //get labels from share service
  getLabels() {
    this.shareService.sharedInfectedChartLabels.subscribe(
      (message) => (this.infected = message)
    );
    this.shareService.sharedSuspectibleChartLabels.subscribe(
      (message) => (this.suspectible = message)
    );
  }
  //create data for chart
  createData(suspectible: number[] | null, infected: number[] | null) {
    return {
      //generate labels in range 0...suspectible.length
      labels: [...Array(suspectible?.length)].map((_, i) => i),
      datasets: [
        {
          label: 'Suspectible',
          data: this.suspectible,
          fill: false,
          borderColor: '#0000FF',
        },
        {
          label: 'Infected',
          data: infected,
          fill: false,
          borderColor: '#FF0000',
        },
      ],
    };
  }

  createOptions() {
    return {
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
    this.data = this.createData(this.suspectible, this.infected);
    this.options = this.createOptions();
  }

  update(event: Event) {
    this.getLabels();
    this.data = this.createData(this.suspectible, this.infected);
  }
}
