import * as utils from './utils';

const width = 700;
const height = 700;

export interface IParticle {
  x: number;
  y: number;
  status: string;
  particleRadius: number;
  color: string;
  moveSeparate: boolean;
  distanceToInfect: number;
  timeToRecover: number;
  chanceToInfect: number;
  move(): void;
  updateStatus(value: string): void;
  getStatus(): string;
  changeColor(value: string): void;
  checkIfRecovered(): void;
}

export class Particle implements IParticle {
  status: string;
  particleRadius = 5;
  color: string;
  moveSeparate: boolean;
  distanceToInfect: number;
  timeToRecover: number;
  chanceToInfect: number;

  x = utils.random(this.particleRadius, width - this.particleRadius);
  dx = utils.randomSpeedUp(-4, 4);

  y = utils.random(this.particleRadius, height - this.particleRadius);
  dy = utils.randomSpeedUp(-4, 4);

  constructor(
    status: string,
    moveSeparate: boolean,
    distanceToInfect: number,
    timeToRecover: number,
    chanceToInfect: number
  ) {
    this.chanceToInfect = chanceToInfect;
    this.timeToRecover = timeToRecover * 1000;
    this.distanceToInfect = distanceToInfect;
    this.status = status;
    this.moveSeparate = moveSeparate;
    if (this.status == 'i') {
      this.color = '#FF0000';
      this.checkIfRecovered();
    } else if (this.status == 's') {
      this.color = '#0095DD';
    } else if (this.status == 'r') {
      this.color = '#808080';
    }
  }

  public move() {
    if (this.x + this.dx >= width - this.particleRadius) {
      this.x = width - this.particleRadius;
      this.dx = -this.dx;
    }
    if (this.x + this.dx <= this.particleRadius) {
      this.x = this.particleRadius;
      this.dx = -this.dx;
    }
    if (this.y + this.dy >= height - this.particleRadius) {
      this.y = height - this.particleRadius;
      this.dy = -this.dy;
    }
    if (this.y + this.dy <= this.particleRadius) {
      this.y = this.particleRadius;
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
  }

  public setSpeed(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }

  public getStatus(): string {
    return this.status;
  }
  public updateStatus(value: string): void {
    this.status = value;
  }

  public changeColor(value: string) {
    this.color = value;
  }

  public checkIfRecovered() {
    setTimeout(() => {
      this.updateStatus('r');
      this.changeColor('#808080');
    }, this.timeToRecover);
  }
}

export class Renderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  public animate(particles: IParticle[]): void {
    this.ctx.clearRect(0, 0, width, height);
    particles.forEach((p1) => {
      this.ctx.beginPath();
      this.ctx.arc(p1.x, p1.y, p1.particleRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = p1.color;
      this.ctx.fill();
      this.ctx.closePath();
      particles.forEach((p2) => {
        utils.checkAndUpdate(p1, p2, p1.distanceToInfect, p1.chanceToInfect);
        utils.moveSeparate(p1, p2, p1.moveSeparate);
      });
      p1.move();
    });
  }
}
