import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IParticle, Particle, Renderer } from '../interfaces/particle';
import { checkAndUpdate } from '../interfaces/someStaff';
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
  suspectibleAmount: number | null;
  infectedAmount: number | null;
  intervalId: any;
  disable: boolean = false;
  //init renderer class
  renderer: Renderer;

  constructor(private shareService: ShareService) {}

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null;

  //send labels to share service
  sendLabels(infectedChartLabels: number[], suspectibleChartLabels: number[]) {
    this.shareService.sendInfectedChartLabels(infectedChartLabels);
    this.shareService.sendSuspectibleChartLabels(suspectibleChartLabels);
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

  createParticles(n: number | null, status: string): Particle[] {
    let particles: Particle[] = [];
    if (this.ctx && n) {
      for (let i = 0; i < n; i++) {
        particles[i] = new Particle(status);
      }
    }
    return particles;
  }

  createLabels(infected: IParticle[], suspectible: IParticle[]) {
    let infectedChartLabels: number[] = [];
    let suspectibleChartLabels: number[] = [];
    if (this.infectedAmount && this.suspectibleAmount) {
      infectedChartLabels.push(infected.length);
      suspectibleChartLabels.push(suspectible.length);
    }
    return [infectedChartLabels, suspectibleChartLabels];
  }

  startAnimate(): void {
    this.disable = true;
    let currentSuspectibleAmount: number, currentInfectedAmount: number;
    //crete particles
    let suspectible = this.createParticles(this.suspectibleAmount, 's');
    let infected = this.createParticles(this.infectedAmount, 'i');
    //create array for chart
    let [infectedChartLabels, suspectibleChartLabels] = this.createLabels(
      infected,
      suspectible
    );

    this.intervalId = setInterval(() => {
      //render particles
      this.renderer.animate(suspectible.concat(infected));
      //check if infected particles are in radius of suspectible
      //and update status if rolled chance
      checkAndUpdate(suspectible, infected);
      //calculate current amount of suspectible and infected particles
      if (this.suspectibleAmount && this.infectedAmount) {
        currentSuspectibleAmount =
          this.suspectibleAmount - infected.length + this.infectedAmount;
        currentInfectedAmount = infected.length;
        //update values for chart
        if (
          currentInfectedAmount !=
          infectedChartLabels[infectedChartLabels.length - 1]
        ) {
          infectedChartLabels.push(currentInfectedAmount);
          suspectibleChartLabels.push(currentSuspectibleAmount);
        }
      }
      //check amount of suspectible, if 0 stop animation
      if (currentSuspectibleAmount == 0) {
        this.stopAnimate();
        this.sendLabels(infectedChartLabels, suspectibleChartLabels);
      }
    }, 20);
  }

  stopAnimate(): void {
    //stop simulation
    this.disable = false;
    clearInterval(this.intervalId);
  }
}
