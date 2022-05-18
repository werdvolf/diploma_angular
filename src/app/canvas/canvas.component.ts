import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  suspectibleAmount: number;
  infectedAmount: number;
  recoveredAmount: number = 0;
  perOfSeparate: number = 80;
  intervalId: any;
  disable: boolean = false;
  //init renderer class
  renderer: Renderer;

  constructor(private shareService: ShareService) {}

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null;

  //send labels to share service
  sendLabels(
    infectedChartLabels: number[],
    suspectibleChartLabels: number[],
    recoveredChartLabels: number[]
  ) {
    this.shareService.sendInfectedChartLabels(infectedChartLabels);
    this.shareService.sendSuspectibleChartLabels(suspectibleChartLabels);
    this.shareService.sendRecoveredChartLabels(recoveredChartLabels);
  }

  //get particles amount from share service
  getParticlesAmount() {
    this.shareService.sharedInfectedAmount.subscribe((message) => {
      this.infectedAmount = message;
    });
    this.shareService.sharedSuspectibleAmount.subscribe(
      (message) => (this.suspectibleAmount = message)
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
    let perOfInfSeparate = getPerOfAmount(this.perOfSeparate, numOfInfected);
    let perOfSusSeparate = getPerOfAmount(this.perOfSeparate, numOfSuspectible);
    for (let i = 0; i < numOfSuspectible; i++) {
      if (perOfSusSeparate < i) particles[i] = new Particle('s', true);
      else particles[i] = new Particle('s', false);
    }
    for (let i = numOfSuspectible; i < numOfInfected + numOfSuspectible; i++) {
      if (perOfInfSeparate < i - numOfSuspectible)
        particles[i] = new Particle('i', true);
      else particles[i] = new Particle('i', false);
    }
    return particles;
  }

  startAnimate(): void {
    this.disable = true;
    let currentSuspectibleAmount: number,
      currentInfectedAmount: number,
      currentRecoveredAmount: number;
    let infectedChartLabels: number[] = [this.infectedAmount],
      suspectibleChartLabels: number[] = [this.suspectibleAmount],
      recoveredChartLabels: number[] = [this.recoveredAmount];
    //crete particles
    let particles = this.createParticles(
      this.suspectibleAmount,
      this.infectedAmount
    );
    //create array for chart

    this.intervalId = setInterval(() => {
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
      if (
        infectedChartLabels[infectedChartLabels.length - 1] !=
          currentInfectedAmount ||
        suspectibleChartLabels[suspectibleChartLabels.length - 1] !=
          currentSuspectibleAmount
      ) {
        infectedChartLabels.push(currentInfectedAmount);
        suspectibleChartLabels.push(currentSuspectibleAmount);
        recoveredChartLabels.push(currentRecoveredAmount);
      }

      //check amount of suspectible, if 0 stop animation
      if (currentSuspectibleAmount == 0 || currentInfectedAmount == 0) {
        this.stopAnimate();
        this.sendLabels(
          infectedChartLabels,
          suspectibleChartLabels,
          recoveredChartLabels
        );
      }
    }, 20);
  }

  stopAnimate(): void {
    //stop simulation
    this.disable = false;
    clearInterval(this.intervalId);
  }
}
