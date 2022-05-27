import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ILabels, IParams } from '../interfaces/interfaces';
import { Person, Renderer } from '../interfaces/person';
import { eachGroupAmount, updateAllParams } from '../interfaces/utils';
import { ShareService } from '../share.service';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  //canvas width and heigth
  width: number = 700;
  height: number = 700;
  intervalId: any;
  disable: boolean = false;
  renderer: Renderer;
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

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null;

  //send labels to share service
  sendLabels(labels: ILabels) {
    this.shareService.sendLabels(labels);
  }

  //get particles amount from share service
  getParticlesAmount() {
    this.shareService.sharedParams.subscribe(
      (message) => (this.params = message)
    );
  }

  ngOnInit(): void {
    //init canvas
    this.ctx = this.canvas.nativeElement.getContext('2d');
    if (this.ctx) this.renderer = new Renderer(this.ctx);
    //get particles amount from menu component
    this.getParticlesAmount();
  }

  createParticles(numOfSusceptible: number, numOfInfectious: number): Person[] {
    let persons: Person[] = [];
    for (let i = 0; i < numOfSusceptible + numOfInfectious; i++) {
      if (i < numOfSusceptible) {
        persons[i] = new Person(
          's',
          this.params.infectionRadius,
          this.params.timeToRecover,
          this.params.chanceToInfect
        );
      } else {
        persons[i] = new Person(
          'i',
          this.params.infectionRadius,
          this.params.timeToRecover,
          this.params.chanceToInfect
        );
      }
    }
    return persons;
  }

  startAnimate(): void {
    //disable button
    this.disable = true;
    // init labels for chart
    let lebels: ILabels = {
      susceptibleLabels: [],
      infectiousLabels: [],
      recoveredLabels: [],
    };
    // init current amount persons in each group
    let currentSuspectibleAmount: number,
      currentInfectedAmount: number,
      currentRecoveredAmount: number;
    //crete group of persons
    let persons = this.createParticles(
      this.params.susceptibleAmount,
      this.params.infectiousAmount
    );
    updateAllParams(
      this.params.vaccinePercent,
      this.params.quarantinePercent,
      this.params.separationPercent,
      persons
    );
    // count seconds
    let seconds = 0;

    this.intervalId = setInterval(() => {
      //render persons
      this.renderer.animate(persons);
      //calculate current amount of susceptible and infected persons
      [
        currentInfectedAmount,
        currentSuspectibleAmount,
        currentRecoveredAmount,
      ] = eachGroupAmount(persons);
      //update values for chart
      if (seconds == 0 || seconds % 240 == 0) {
        lebels.infectiousLabels.push(currentInfectedAmount);
        lebels.susceptibleLabels.push(currentSuspectibleAmount);
        lebels.recoveredLabels.push(currentRecoveredAmount);
      }
      //check amount of susceptible, if 0 stop animation
      if (
        currentSuspectibleAmount == 0 ||
        currentInfectedAmount == 0 ||
        currentRecoveredAmount == persons.length
      ) {
        this.stopAnimate();
        this.sendLabels(lebels);
      }
      seconds += 20;
    }, 20);
  }

  stopAnimate(): void {
    //stop simulation
    this.disable = false;
    clearInterval(this.intervalId);
  }
}
