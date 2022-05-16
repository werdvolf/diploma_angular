import * as someStaff from './someStaff';

const width = 700;
const height = 700;
const timeToRecover = 10000;

export interface IParticle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  status: string;
  particleRadius: number;
  infectedTime: number;
  color: string;
  move(): void;
  updateStatus(value: string): void;
  setSpeed(dx: number, dy: number): void;
  getStatus(): string;
  changeColor(value: string): void;
  checkIfRecovered(): void;
}

export class Particle implements IParticle {
  status: string;
  particleRadius = 5;
  infectedTime = 0;
  color: string;
  x = someStaff.random(this.particleRadius, width - this.particleRadius);
  dx = someStaff.randomSpeedUp(-4, 4);

  y = someStaff.random(this.particleRadius, height - this.particleRadius);
  dy = someStaff.randomSpeedUp(-4, 4);

  constructor(status: string) {
    this.status = status;
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
    if (
      this.x + this.dx > width - this.particleRadius ||
      this.x + this.dx < this.particleRadius
    ) {
      this.dx = -this.dx;
    }
    if (
      this.y + this.dy > height - this.particleRadius ||
      this.y + this.dy < this.particleRadius
    ) {
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
    }, timeToRecover);
  }
}

export class Renderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  public animate(particles: Particle[]): void {
    this.ctx.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      this.ctx.beginPath();
      this.ctx.arc(
        particle.x,
        particle.y,
        particle.particleRadius,
        0,
        Math.PI * 2
      );
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
      this.ctx.closePath();
      particle.move();
    });
  }
}
