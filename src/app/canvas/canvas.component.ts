import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ILabels, IParams } from '../interfaces/interfaces';
import { Particle, Renderer } from '../interfaces/particle';
import { eachGroupAmount, getPerOfAmount } from '../interfaces/utils';
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
  //init renderer class
  renderer: Renderer;
  params: IParams = {
    infectedAmount: 10,
    suspectibleAmount: 10,
    separationPercent: 0,
    infectionRadius: 10,
    timeToRecover: 10,
    chanceToInfect: 0.1,
    // quarantine: false,
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

  createParticles(numOfSuspectible: number, numOfInfected: number): Particle[] {
    let particles: Particle[] = [];
    let perOfInfSeparate = getPerOfAmount(
      this.params.separationPercent,
      numOfInfected
    );
    let perOfSusSeparate = getPerOfAmount(
      this.params.separationPercent,
      numOfSuspectible
    );
    for (let i = 0; i < numOfSuspectible; i++) {
      if (perOfSusSeparate < i)
        particles[i] = new Particle(
          's',
          false,
          this.params.infectionRadius,
          this.params.timeToRecover,
          this.params.chanceToInfect
        );
      else
        particles[i] = new Particle(
          's',
          true,
          this.params.infectionRadius,
          this.params.timeToRecover,
          this.params.chanceToInfect
        );
    }
    for (let i = numOfSuspectible; i < numOfInfected + numOfSuspectible; i++) {
      if (perOfInfSeparate < i - numOfSuspectible)
        particles[i] = new Particle(
          'i',
          false,
          this.params.infectionRadius,
          this.params.timeToRecover,
          this.params.chanceToInfect
        );
      else
        particles[i] = new Particle(
          'i',
          true,
          this.params.infectionRadius,
          this.params.timeToRecover,
          this.params.chanceToInfect
        );
    }
    return particles;
  }

  startAnimate(): void {
    let lebels: ILabels = {
      suspectibleLabels: [],
      infectedLabels: [],
      recoveredLabels: [],
    };
    this.disable = true;
    let currentSuspectibleAmount: number,
      currentInfectedAmount: number,
      currentRecoveredAmount: number;
    //crete particles
    let particles = this.createParticles(
      this.params.suspectibleAmount,
      this.params.infectedAmount
    );
    //create array for chart

    this.intervalId = setInterval(() => {
      let seconds = 0;
      //render particles
      this.renderer.animate(particles);
      //check if infected particles are in radius of suspectible
      //and update status if rolled chance
      // checkAndUpdate(particles);
      //calculate current amount of suspectible and infected particles
      [
        currentInfectedAmount,
        currentSuspectibleAmount,
        currentRecoveredAmount,
      ] = eachGroupAmount(particles);
      //update values for chart
      if (seconds == 0 || seconds % 1000 == 0) {
        lebels.infectedLabels.push(currentInfectedAmount);
        lebels.suspectibleLabels.push(currentSuspectibleAmount);
        lebels.recoveredLabels.push(currentRecoveredAmount);
      }
      //check amount of suspectible, if 0 stop animation
      if (currentSuspectibleAmount == 0 || currentInfectedAmount == 0) {
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
